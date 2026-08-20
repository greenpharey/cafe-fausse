import os


class Config:
    """Base configuration, values are pulled from environment variables so that
    real credentials never live in source control."""

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql+pg8000://cafe_fausse_user:cafe_fausse_pass@localhost:5432/cafe_fausse",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    TOTAL_TABLES = 30
