from flask import (
    Flask,
    request,
    render_template,
    json,
    redirect,
    url_for,
    flash,
    jsonify,
    send_from_directory,
    session,
)
from blueprints.authentication import auth
from werkzeug.utils import secure_filename
import os
import json as json_module
from config.config import Config
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(auth)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


# Decorator to restrict access to authenticated users only
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            flash("You must be logged in", "error")
            return redirect(url_for("auth.login"))
        return f(*args, **kwargs)

    return decorated_function


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


class Activity:
    @staticmethod
    def load_activities():
        with open(Config.ACTIVITES_FILE, "r", encoding="utf-8") as file:
            return json.load(file)["activities"]


class UserActivity:
    @staticmethod
    def load_user_activities():
        try:
            with open(Config.USER_ACTIVITY_FILE, "r") as file:
                return json.load(file)["user_activities"]
        except (FileNotFoundError, json_module.JSONDecodeError):
            return {}

    @staticmethod
    def get_user_activities(user_email):
        activities = UserActivity.load_user_activities()
        return activities.get(user_email, [])

    @staticmethod
    def save_user_activities(activities):
        with open(Config.USER_ACTIVITY_FILE, "w") as f:
            json.dump({"user_activities": activities}, f, indent=4)

    @staticmethod
    def add_activity_for_user(user_email, activity):
        activities = UserActivity.load_user_activities()
        if user_email not in activities:
            activities[user_email] = []
        activities[user_email].append(activity)
        UserActivity.save_user_activities(activities)

    @staticmethod
    def remove_activity_for_user(user_email, activity_id):
        activities = UserActivity.load_user_activities()
        if user_email in activities:
            activities[user_email] = [
                act for act in activities[user_email] if act["id"] != activity_id
            ]
            UserActivity.save_user_activities(activities)

    @staticmethod
    def update_activity_for_user(user_email, activity_id, updated_data):
        activities = UserActivity.load_user_activities()
        if user_email in activities:
            for activity in activities[user_email]:
                if activity["id"] == activity_id:
                    activity.update(updated_data)
                    break
            UserActivity.save_user_activities(activities)


class UserGoal:
    @staticmethod
    def load_user_goals():
        try:
            with open(Config.USER_GOALS_FILE, "r") as file:
                return json.load(file)["user_goals"]
        except (FileNotFoundError, json_module.JSONDecodeError):
            return {}

    @staticmethod
    def get_user_goals(user_email):
        goals = UserGoal.load_user_goals()
        return goals.get(user_email, [])

    @staticmethod
    def save_user_goals(goals):
        with open(Config.USER_GOALS_FILE, "w") as f:
            json.dump({"user_goals": goals}, f, indent=4)

    @staticmethod
    def add_goal_for_user(user_email, activity):
        goals = UserGoal.load_user_goals()
        if user_email not in goals:
            goals[user_email] = []
        goals[user_email].append(activity)
        UserGoal.save_user_goals(goals)


@app.route("/")
def base():
    return render_template("signup.html")


# aadding goals to user activity page
@app.route("/add_activity", methods=["POST"])
@login_required
def add_activity():
    user_email = session.get("user", {}).get("email")
    if not user_email:

        return jsonify({"error": "User not logged in"}), 401

    data = request.get_json()

    if not data or "id" not in data:

        return jsonify({"error": "Invalid request payload"}), 400

    activity_id = data["id"]
    all_activities = Activity.load_activities()
    user_activities = UserActivity.get_user_activities(user_email)

    activity = next((act for act in all_activities if act["id"] == activity_id), None)

    if not activity:

        return jsonify({"error": "Activity not found"}), 404

    if activity_id in [a["id"] for a in user_activities]:

        return jsonify({"message": "Activity already added"}), 200

    UserActivity.add_activity_for_user(user_email, activity)

    return jsonify({"message": "Activity added successfully"}), 200


# remove activity
@app.route("/remove_activity", methods=["POST"])
@login_required
def remove_activity():
    user_email = session.get("user", {}).get("email")
    if not user_email:
        return jsonify({"error": "User not logged in"}), 401

    data = request.json
    activity_id = data.get("id")

    if not activity_id:
        return jsonify({"error": "Invalid activity ID"}), 400

    UserActivity.remove_activity_for_user(user_email, activity_id)
    return jsonify({"message": "Activity removed successfully"}), 200


# display user activities page
@app.route("/my_activities")
@login_required
def my_activities():
    user_email = session.get("user", {}).get("email")
    if not user_email:
        return redirect(url_for("auth.login"))

    user_activities = UserActivity.get_user_activities(user_email)
    return render_template("my_activities.html", activities=user_activities)


# adding activitiees to goals page
@app.route("/add_to_goals", methods=["POST"])
@login_required
def add_to_goals():
    user_email = session.get("user", {}).get("email")
    if not user_email:
        return jsonify({"error": "User not logged in"}), 401

    data = request.get_json()
    if not data or "id" not in data:
        return jsonify({"error": "Invalid request payload"}), 400

    activity_id = data["id"]
    user_activities = UserActivity.get_user_activities(user_email)
    activity = next((act for act in user_activities if act["id"] == activity_id), None)

    if not activity:
        return jsonify({"error": "Activity not found"}), 404

    user_goals = UserGoal.get_user_goals(user_email)
    if any(g["id"] == activity_id for g in user_goals):
        return jsonify({"message": "Activity already added to goals"}), 200

    UserGoal.add_goal_for_user(user_email, activity)
    return jsonify({"message": "Activity added to goals successfully"}), 200


# reemove activity from goals page
@app.route("/remove_goal", methods=["POST"])
@login_required
def remove_goal():
    user_email = session.get("user", {}).get("email")
    if not user_email:
        return jsonify({"error": "User not logged in"}), 401

    data = request.json
    activity_id = data.get("id")

    if not activity_id:
        return jsonify({"error": "Invalid activity ID"}), 400

    user_goals = UserGoal.get_user_goals(user_email)
    updated_goals = [goal for goal in user_goals if goal["id"] != activity_id]
    UserGoal.save_user_goals({user_email: updated_goals})

    return jsonify({"message": "Activity removed from goals"}), 200


# display goals page
@app.route("/my_goals")
@login_required
def my_goals():
    user_email = session.get("user", {}).get("email")
    if not user_email:
        return redirect(url_for("auth.login"))

    user_goals = UserGoal.get_user_goals(user_email)

    return render_template(
        "goals.html", goals=user_goals, goals_json=json.dumps(user_goals)
    )


# createe user's activity
@app.route("/create_activity", methods=["GET", "POST"])
@login_required
def create_activity():
    if request.method == "POST":
        user_email = session.get("user", {}).get("email")
        if not user_email:
            return redirect(url_for("auth.login"))

        activity_name = request.form.get("activityName")
        duration = request.form.get("duration")
        calories = request.form.get("calories")
        image = request.files.get("image")
        category = request.form.get("category")
        difficulty = request.form.get("difficulty")

        try:
            duration = int(duration)
            calories = int(calories)
        except ValueError:
            flash("Invalid input. Duration and Calories must be numbers.", "error")
            return redirect(url_for("create_activity"))

        filename = None
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(Config.UPLOAD_FOLDER, filename)
            image.save(image_path)
        else:
            print("invalid")
            flash(
                "Invalid image file. Please upload a PNG, JPG, JPEG, or GIF.", "error"
            )
            return redirect(url_for("create_activity"))

        user_activities = UserActivity.get_user_activities(user_email)

        new_activity = {
            "id": str(len(user_activities) + 1),
            "category": category,
            "name": activity_name,
            "duration_minutes": int(duration),
            "calories_burned_per_hour": int(calories),
            "image": filename,
            "difficulty": difficulty,
        }

        UserActivity.add_activity_for_user(user_email, new_activity)

        flash("Activity created successfully!", "success")
        return redirect(url_for("my_activities"))

    return render_template("create_activity.html")


# uodate user's activity in user activities page
@app.route("/update_activity", methods=["POST"])
@login_required
def update_activity():
    user_email = session.get("user", {}).get("email")
    if not user_email:
        return jsonify({"error": "User not logged in"}), 401

    data = request.json
    activity_id = data.get("id")

    if not activity_id:
        return jsonify({"error": "Invalid activity ID"}), 400

    updated_data = {
        "name": data.get("name"),
        "duration_minutes": int(data.get("duration_minutes")),
        "calories_burned_per_hour": int(data.get("calories_burned_per_hour")),
        "category": data.get("category"),
        "difficulty": data.get("difficulty"),
    }

    UserActivity.update_activity_for_user(user_email, activity_id, updated_data)
    return jsonify({"message": "Activity updated successfully!"}), 200


@app.route("/data/<path:filename>")
def serve_file(filename):
    return send_from_directory("data", filename)


if __name__ == "__main__":
    app.run(debug=True)
