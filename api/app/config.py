import os
from datetime import timedelta


class Config:
    """Base application configuration."""

    # Flask
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "")

    # Database: e.g. postgresql+psycopg2://user:pass@host:5432/dbname
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.getenv("JWT_ACCESS_EXPIRES_MIN", "30")))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_REFRESH_EXPIRES_DAYS", "7")))
    JWT_HEADER_TYPE = "Bearer"

    # Upload limits (bytes). Nginx must allow at least this size too.
    # Default: 25MB
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(25 * 1024 * 1024)))


