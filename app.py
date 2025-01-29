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
from datetime import timedelta
from blueprints.authentication import auth

app = Flask(__name__)
app.secret_key = "1234"
app.register_blueprint(auth)


@app.route("/")
def base():
    return render_template("base.html")


if __name__ == "__main__":
    app.run(debug=True)
