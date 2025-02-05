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
)
from datetime import timedelta
from blueprints.authentication import auth
from werkzeug.utils import secure_filename
import os
from config.config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(auth)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

class Activity:
    def load_activities():
        with open(Config.ACTIVITES_FILE, "r", encoding="utf-8") as file:
            return json.load(file)["activities"]

class UserActivity:
    def load_user_activities():
        with open(Config.USER_ACTIVITY_FILE, "r") as file:
            return json.load(file)["user_activities"]

    def save_user_activities(user_activities):
        with open(Config.USER_ACTIVITY_FILE, "w") as f:
            json.dump({"user_activities": user_activities}, f, indent=4)

@app.route("/landing_page")
def landing_page():
    return render_template("landingpage.html")

@app.route("/")
def base():
    return render_template("signup.html")


@app.route("/my_activities")
def my_activities():
    user_activities = UserActivity.load_user_activities()
    return render_template("my_activities.html", activities=user_activities)


@app.route("/add_activity", methods=["POST"])
def add_activity():
    data = request.json
    activity_id = data.get("id")

    if not activity_id:
        return jsonify({"error": "Invalid activity ID"}), 400

    all_activities = Activity.load_activities()
    user_activities = UserActivity.load_user_activities()

    activity = None
    for act in all_activities:
        if act["id"] == activity_id:
            activity = act
            break

    # if activity and activity not in user_activities:
    if activity and activity_id not in user_activities:
        user_activities.append(activity)
        UserActivity.save_user_activities(user_activities)
        return jsonify({"message": "Activity added successfully"}), 200

    return jsonify({"message": "Activity already added"}), 400


@app.route("/remove_activity", methods=["POST"])
def remove_activity():
    data = request.json
    activity_id = data.get("id")

    if not activity_id:
        return jsonify({"error": "Invalid activity ID"}), 400

    user_activities = UserActivity.load_user_activities()
    updated_activities = [act for act in user_activities if act["id"] != activity_id]

    UserActivity.save_user_activities(updated_activities)
    return jsonify({"message": "Activity removed successfully"}), 200


@app.route("/create_activity", methods=["GET", "POST"])
def create_activity():
    if request.method == "POST":

        activity_name = request.form.get("activityName")
        duration = request.form.get("duration")
        calories = request.form.get("calories")
        image = request.files.get("image")
        category = request.form.get("category")

        try:
            duration = int(duration)
            calories = int(calories)
        except ValueError:
            flash("Invalid input. Duration and Calories must be numbers.", "error")
            return redirect(url_for("create_activity"))

        global filename
        filename = None
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(Config.UPLOAD_FOLDER, filename)
            image.save(image_path)
        else:
            flash(
                "Invalid image file. Please upload a PNG, JPG, JPEG, or GIF.", "error"
            )
            return redirect(url_for("create_activity"))

        user_activities = UserActivity.load_user_activities()

        new_activity = {
            "id": str(len(user_activities) + 1),
            "category": category,
            "name": activity_name,
            "duration_minutes": int(duration),
            "calories_burned_per_hour": int(calories),
            "image": filename,
        }

        user_activities.append(new_activity)

        UserActivity.save_user_activities(user_activities)

        flash("Activity created successfully!", "success")
        return redirect(url_for("my_activities"))

    return render_template("create_activity.html")


@app.route("/update_activity", methods=["POST"])
def update_activity():
    data = request.json
    activity_id = data.get("id")
    updated_name = data.get("name")
    updated_duration = data.get("duration_minutes")
    updated_calories = data.get("calories_burned_per_hour")
    updated_category = data.get("category")

    user_activities = UserActivity.load_user_activities()

    for activity in user_activities:
        if activity["id"] == activity_id:
            activity["name"] = updated_name
            activity["duration_minutes"] = int(updated_duration)
            activity["calories_burned_per_hour"] = int(updated_calories)
            activity["category"] = updated_category
            break

    UserActivity.save_user_activities(user_activities)

    return jsonify({"message": "Activity updated successfully!"}), 200
@app.route("/data/<path:filename>")
def serve_file(filename):
    return send_from_directory("data", filename)


if __name__ == "__main__":
    app.run(debug=True)
