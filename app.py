import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy.orm import DeclarativeBase

logging.basicConfig(level=logging.DEBUG)


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
login_manager = LoginManager()

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_key")


@app.template_filter('char')
def char_filter(number):
    try:
        if isinstance(number, str):
            number = int(number)
        return chr(96 + number)  # a=1, b=2, etc
    except (ValueError, TypeError):
        return ''

# Also register the filter for Jinja environment
app.jinja_env.filters['char'] = char_filter


# Configure PostgreSQL database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///question_bank.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size

db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(id):
    from models import User
    return User.query.get(id)


# Import routes after app is created to avoid circular imports
with app.app_context():
    from routes import *  # noqa
    db.create_all()
