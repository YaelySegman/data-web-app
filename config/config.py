import os

# Secret key for session
SECRET_KEY = 'dev'

# Database
DATABASE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data.sqlite3')

# Upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')

# Allowed file extensions
ALLOWED_EXTENSIONS = {'csv'} 