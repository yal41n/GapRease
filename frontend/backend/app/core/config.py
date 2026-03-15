from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Cyber GAP MVP Backend"
    app_version: str = "0.1.0"
    debug: bool = True

    secret_key: str = "change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 8

    database_url: str = "sqlite:///./data/app.db"
    upload_dir: str = "uploads"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
