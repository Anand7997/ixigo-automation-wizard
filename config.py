
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # SSMS Database Configuration
    SSMS_SERVER = os.getenv('SSMS_SERVER', 'localhost')
    SSMS_DATABASE = os.getenv('SSMS_DATABASE', 'IxigoTestDB')
    SSMS_USERNAME = os.getenv('SSMS_USERNAME', 'sa')
    SSMS_PASSWORD = os.getenv('SSMS_PASSWORD', 'password')
    SSMS_DRIVER = os.getenv('SSMS_DRIVER', 'ODBC Driver 17 for SQL Server')
    
    # Connection String
    SSMS_CONNECTION_STRING = (
        f"DRIVER={{{SSMS_DRIVER}}};"
        f"SERVER={SSMS_SERVER};"
        f"DATABASE={SSMS_DATABASE};"
        f"UID={SSMS_USERNAME};"
        f"PWD={SSMS_PASSWORD};"
        f"TrustServerCertificate=yes;"
    )
    
    # Flask Configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
