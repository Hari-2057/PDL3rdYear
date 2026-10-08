import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "InvoiceGuard AI"
    DEBUG: bool = True
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///./invoiceguard.db"
    
    # Auth
    SECRET_KEY: str = "invoiceguard-secret-key-change-in-production-super-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # LLM Settings
    LLM_PROVIDER: str = "fallback" # fallback, openai, gemini, ollama
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
