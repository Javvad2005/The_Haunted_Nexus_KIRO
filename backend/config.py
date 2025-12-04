import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'haunted-nexus-secret-key'
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY')
