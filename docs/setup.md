# Setup Instructions

This document provides instructions for setting up the Data Web Application on both Windows and Ubuntu systems.

## Prerequisites

- Python 3.8 or higher
- Git

## Setup on Windows

1. **Clone the repository**

   ```
   git clone https://github.com/YaelySegman/data-web-app.git
   cd data-web-app
   ```

2. **Create a virtual environment**

   ```
   python -m venv data-web-page
   data-web-page\Scripts\activate
   ```

3. **Install dependencies**

   ```
   pip install -r requirements.txt
   ```

4. **Create necessary directories**

   ```
   mkdir uploads
   ```

5. **Run the application**

   ```
   python app\app.py
   ```

6. **Access the application**

   Open your web browser and navigate to `http://127.0.0.1:5000`

## Setup on Ubuntu

1. **Clone the repository**

   ```
   git clone https://github.com/YaelySegman/data-web-app.git
   cd data-web-app
   ```

2. **Create a virtual environment**

   ```
   python3 -m venv data-web-page
   source data-web-page/bin/activate
   ```

3. **Install dependencies**

   ```
   pip install -r requirements.txt
   ```

4. **Create necessary directories**

   ```
   mkdir uploads
   ```

5. **Run the application**

   ```
   python3 app/app.py
   ```

6. **Access the application**

   Open your web browser and navigate to `http://127.0.0.1:5000`

## Database Initialization

The database will be automatically initialized when you first run the application. If you need to reset the database, simply delete the `data.sqlite3` file and restart the application.

## Configuration

You can modify the application configuration in the `config/config.py` file. 