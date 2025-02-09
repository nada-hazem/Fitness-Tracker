from flask import (
    Blueprint,
    request,
    render_template,
    redirect,
    url_for,
    flash,
    jsonify,
    session,
)
from functools import wraps
import re
from datetime import timedelta
import json
import bcrypt  # type: ignore
from email_validator import validate_email, EmailNotValidError  # type: ignore

auth = Blueprint("auth", __name__, url_prefix="/auth")
auth.permanent_session_lifetime = timedelta(days=2)
PASSWORD_REGEX = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=\[\]{}|;:,.<>?/~`])[A-Za-z\d!@#$%^&*()\-_+=\[\]{}|;:,.<>?/~`]{8,}$"


class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = self.hash_password(password)

    def hash_password(self, password):
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def check_password(self, password):
        return bcrypt.checkpw(password.encode("utf-8"), self.password.encode("utf-8"))

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
        }


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            flash("You must be logged in", "error")
            return redirect(url_for("auth.login"))
        return f(*args, **kwargs)

    return decorated_function


def validate_password(password):
    if not re.match(PASSWORD_REGEX, password):
        return [
            "Password must be at least 8 characters long, include an uppercase letter, "
            "a lowercase letter, a number, and a special character."
        ]
    return []


def is_valid_email(email):
    try:
        validate_email(email, check_deliverability=True)
        return True
    except EmailNotValidError as e:
        flash(f"Invalid email: {e}", "error")
        return False


def load_users():
    with open("data/users.json", "r") as f:
        return json.load(f)


def save_users(users):
    with open("data/users.json", "w") as f:
        json.dump(users, f, indent=4)


@auth.route("/home")
@login_required
def base():
    return render_template("home.html")


@auth.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()

        if not username:
            flash("Username is required", "error")
            return redirect(url_for("auth.signup"))
        if not is_valid_email(email):
            return redirect(url_for("auth.signup"))
        password_errors = validate_password(password)
        if password_errors:
            for error in password_errors:
                flash(error, "error")
            return redirect(url_for("auth.signup"))

        users = load_users()
        if any(user["email"] == email for user in users):
            flash("Email already exists. Please log in.", "error")
            return redirect(url_for("auth.signup"))

        new_user = User(username, email, password)
        users.append(new_user.to_dict())
        save_users(users)
        session["user"] = new_user.to_dict()

        flash("Account created successfully!", "success")
        return redirect(url_for("auth.login"))
    return render_template("signup.html")


@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()

        if not email:
            flash("Email is required.", "error")
            return redirect(url_for("auth.login"))
        if not password:
            flash("Password is required.", "error")
            return redirect(url_for("auth.login"))

        users = load_users()
        user_data = next((u for u in users if u["email"] == email), None)
        if user_data:
          
            if bcrypt.checkpw(
                password.encode("utf-8"), user_data["password"].encode("utf-8")
            ):
                session["user"] = user_data
                flash("Login successful!", "success")
                return redirect(url_for("auth.base"))

        flash("Invalid email or password.", "error")
        return redirect(url_for("auth.login"))

    if "user" in session:
        return redirect(url_for("auth.base"))
    return render_template("login.html")


@auth.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))
