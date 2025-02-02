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

app = Flask(__name__)
app.secret_key = "1234"
app.register_blueprint(auth)

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

#edisplay  user activity
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

    # Find the activity by ID
    # activity = next((act for act in all_activities if act["id"] == activity_id), None)
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


@app.route('/data/<path:filename>')
def serve_file(filename):
    return send_from_directory('data', filename)

if __name__ == "__main__":
    app.run(debug=True)