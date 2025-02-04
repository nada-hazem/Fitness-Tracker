from flask import (
    Flask,
    request,
    render_template,
    json,
    redirect,
    url_for,
    flash,
    jsonify,
    session,
    send_from_directory,
)
from datetime import timedelta
from blueprints.authentication import auth
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.secret_key = "1234"
app.register_blueprint(auth)

UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


ACTIVITIES_FILE = "data/activities.json"
USER_ACTIVITIES_FILE = "data/user_activities.json"


# Load all default activities
def load_activities():
    with open(ACTIVITIES_FILE, "r") as file:
        return json.load(file)["activities"]


# Load user activities
def load_user_activities():
    with open(USER_ACTIVITIES_FILE, "r") as file:
        return json.load(file)["user_activities"]


# Save user activities
def save_user_activities(user_activities):
    with open(USER_ACTIVITIES_FILE, "w") as f:
        json.dump({"user_activities": user_activities}, f, indent=4)


@app.route("/")
def base():
    return render_template("signup.html")


# edisplay  user activity
@app.route("/my_activities")
def my_activities():
    user_activities = load_user_activities()
    return render_template("my_activities.html", activities=user_activities)


@app.route("/add_activity", methods=["POST"])
def add_activity():
    data = request.json
    activity_id = data.get("id")

    if not activity_id:
        return jsonify({"error": "Invalid activity ID"}), 400

    all_activities = load_activities()
    user_activities = load_user_activities()

    activity = None
    for act in all_activities:
        if act["id"] == activity_id:
            activity = act
            break

    # if activity and activity not in user_activities:
    if activity and activity_id not in user_activities:
        user_activities.append(activity)
        save_user_activities(user_activities)
        return jsonify({"message": "Activity added successfully"}), 200

    return jsonify({"message": "Activity already added"}), 400


@app.route("/remove_activity", methods=["POST"])
def remove_activity():
    data = request.json
    activity_id = data.get("id")

    if not activity_id:
        return jsonify({"error": "Invalid activity ID"}), 400

    user_activities = load_user_activities()
    updated_activities = [act for act in user_activities if act["id"] != activity_id]

    save_user_activities(updated_activities)
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
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            image.save(image_path)
        else:
            flash(
                "Invalid image file. Please upload a PNG, JPG, JPEG, or GIF.", "error"
            )
            return redirect(url_for("create_activity"))

        user_activities = load_user_activities()

        new_activity = {
            "id": str(len(user_activities) + 1),
            "category" : category,
            "name": activity_name,
            "duration_minutes": int(duration),
            "calories_burned_per_hour": int(calories),
            "image": filename
        }

        user_activities.append(new_activity)

        save_user_activities(user_activities)

        flash("Activity created successfully!", "success")
        return redirect(url_for("my_activities"))

    return render_template("create_activity.html")


@app.route("/data/<path:filename>")
def serve_file(filename):
    return send_from_directory("data", filename)


if __name__ == "__main__":
    app.run(debug=True)
