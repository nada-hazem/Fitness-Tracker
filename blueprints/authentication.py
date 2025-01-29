from flask import Blueprint
from flask import (
    Flask,
    request,
    render_template,
    redirect,
    url_for,
    flash,
    jsonify,
    session,
)
import re
from datetime import timedelta
import json
import bcrypt

auth = Blueprint("auth", __name__, url_prefix="/auth")
auth.permanent_session_lifetime = timedelta(days=2)


PASSWORD_REGEX = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=\[\]{}|;:,.<>?/~`])[A-Za-z\d!@#$%^&*()\-_+=\[\]{}|;:,.<>?/~`]{8,}$"


# Function to validate password using regex
def validate_password(password):
    if not re.match(PASSWORD_REGEX, password):
        return [
            "Password must be at least 8 characters long, include an uppercase letter, "
            "a lowercase letter, a number, and a special character."
        ]
    return []


@auth.route("/home")
def base():
    return render_template("home.html")


def load_users():
    with open("data/users.json", "r") as f:
        return json.load(f)


def save_users(users):
    with open("data/users.json", "w") as f:
        json.dump(users, f, indent=4)


@auth.route("/signup", methods=["GET", "POST"])
def signup():
    print("Signup route accessed")
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()

        # Password validation using regex
        password_errors = validate_password(password)
        if password_errors:
            for error in password_errors:
                flash(error, "error")
            return redirect(url_for("auth.signup"))

        # Load existing users
        users = load_users()

        # Check for existing email
        for user in users:
            if user["email"] == email:
                flash("Email already exists. Please log in.", "error")
                return redirect(url_for("auth.signup"))

        # Hash the password
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        new_user = {
            "id": len(users) + 1,
            "username": username,
            "email": email,
            "password": hashed_password,
            "created_at": "2025-01-01T12:00:00Z",
        }

        # Save new user
        users.append(new_user)
        save_users(users)
        session["user"] = new_user

        flash("Account created successfully!", "success")
        return redirect(url_for("auth.login"))

    return render_template("signup.html")


@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        print("post")
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()

        # Validation for empty fields
        if not email:
            flash("Email is required.", "error")
            return redirect(url_for("auth.login"))
        if not password:
            flash("Password is required.", "error")
            return redirect(url_for("auth.login"))

        # Load existing users
        users = load_users()

        # Find user by email
        user = next((u for u in users if u["email"] == email), None)

        if user and bcrypt.checkpw(
            password.encode("utf-8"), user["password"].encode("utf-8")
        ):
            session["user"] = user
            flash("Login successful!", "success")
            return redirect(url_for("base"))
        else:
            flash("Invalid email or password.", "error")
            return redirect(url_for("auth.login"))
    else:
        if "user" in session:
            return redirect(url_for("auth.base"))
        return render_template("login.html")

@auth.route("/logout")
def logout ():
    session.clear()
    return redirect(url_for('auth.login'))