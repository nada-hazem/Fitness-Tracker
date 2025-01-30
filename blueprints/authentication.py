from flask import Blueprint, Flask, request, render_template, redirect, url_for, flash, jsonify, session
import re
from datetime import timedelta
import json
import bcrypt
from email_validator import validate_email, EmailNotValidError

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

def is_valid_email(email):
    try:
        # Validate email using email_validator
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
def base():
    return render_template("home.html")

@auth.route("/signup", methods=["GET", "POST"])
def signup():
    print("Signup route accessed")
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()

        # Email validation
        if not is_valid_email(email):
            return redirect(url_for("auth.signup"))

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
    

# @auth.route("/reset_password" , methods=["GET", "POST"])
# def reset_password():
#     if request.method == "POST":
#         email = request.form.get("email", "").strip()

#         if not is_valid_email(email):
#             flash( "Invalid email addreess","error")
#             return redirect (url_for("auth.forget"))
#     users=load_users()
#     user = next((u for u in users if u["email"] == email), None)
#     if not user:
#         flash("No account found with this email address.", "error")
#         return redirect(url_for("auth.reset_password"))
#     return render_template("forget.html")


@auth.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('auth.login'))

@auth.route("/test_flash")
def test_flash():

    flash("This is a test flash message!", "success")
    return redirect(url_for("auth.login"))
