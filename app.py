from flask import (
    Flask,
    request,
    render_template,
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


@app.route("/")
def base():
    return render_template("signup.html")

@app.route('/data/<path:filename>')
def serve_file(filename):
    return send_from_directory('data', filename)

if __name__ == "__main__":
    app.run(debug=True)
