
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # SSMS Database Configuration
    SSMS_SERVER = os.getenv('SSMS_SERVER', 'LPT2084-B1')
    SSMS_DATABASE = os.getenv('SSMS_DATABASE', 'Ixigo_TestAutomation')
    SSMS_USERNAME = os.getenv('SSMS_USERNAME', '')
    SSMS_PASSWORD = os.getenv('SSMS_PASSWORD', '')
    SSMS_DRIVER = os.getenv('SSMS_DRIVER', 'ODBC Driver 17 for SQL Server')
    
    # Connection String - Windows Authentication when no username/password
    @property
    def SSMS_CONNECTION_STRING(self):
        if self.SSMS_USERNAME and self.SSMS_PASSWORD:
            # SQL Server Authentication
            return (
                f"DRIVER={{{self.SSMS_DRIVER}}};"
                f"SERVER={self.SSMS_SERVER};"
                f"DATABASE={self.SSMS_DATABASE};"
                f"UID={self.SSMS_USERNAME};"
                f"PWD={self.SSMS_PASSWORD};"
                f"TrustServerCertificate=yes;"
            )
        else:
            # Windows Authentication
            return (
                f"DRIVER={{{self.SSMS_DRIVER}}};"
                f"SERVER={self.SSMS_SERVER};"
                f"DATABASE={self.SSMS_DATABASE};"
                f"Trusted_Connection=yes;"
                f"TrustServerCertificate=yes;"
            )
    
    # Flask Configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
