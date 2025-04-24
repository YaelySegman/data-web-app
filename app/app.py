"""
Main application module for the Patient Outcomes Data Web Application.
Handles routing, file uploads, and data processing.
"""

import os
from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
import csv
import codecs
from datetime import datetime
from db import init_db, get_db, close_db, save_data, get_all_data
from csv_validator import validate_csv

# Initialize Flask app
app = Flask(__name__)
app.config.from_pyfile('../config/config.py')

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
with app.app_context():
    init_db()

@app.teardown_appcontext
def close_connection(exception):
    """
    Close the database connection when the application context ends.
    
    Args:
        exception: Exception object if an error occurred
    """
    close_db()

@app.route('/')
def index():
    """
    Render the main page with the patient outcomes data table.
    
    Returns:
        str: Rendered HTML template with patient data
    """
    data = get_all_data()
    return render_template('index.html', data=data)

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Handle CSV file uploads.
    Validates and processes the uploaded file.
    
    Returns:
        str: Redirect to index page with appropriate flash message
        
    The function:
    1. Validates the uploaded file
    2. Processes the CSV data
    3. Saves the data to the database
    4. Handles various error cases
    """
    if 'file' not in request.files:
        flash('No file part')
        return redirect(url_for('index'))
    
    file = request.files['file']
    
    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('index'))
    
    # Check if the file is a CSV
    if file and file.filename.endswith('.csv'):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Validate CSV
        is_valid, message = validate_csv(file_path)
        
        if is_valid:
            # Process and save data
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            
            for encoding in encodings:
                try:
                    with codecs.open(file_path, 'r', encoding=encoding) as csv_file:
                        csv_reader = csv.DictReader(csv_file)
                        # Add upload timestamp to each row
                        upload_time = datetime.now()
                        data_to_save = []
                        
                        for row in csv_reader:
                            # Create a new dict with the required fields
                            processed_row = {
                                'patient_id': row['Patient ID'],
                                'outcome': row['Outcome'],
                                'recorded_at': upload_time
                            }
                            data_to_save.append(processed_row)
                        
                        # Save the processed data
                        save_data(data_to_save)
                        flash('success: File successfully uploaded and processed')
                        return redirect(url_for('index'))
                except UnicodeDecodeError:
                    # Try the next encoding
                    continue
            
            flash('Could not process CSV file with any supported encoding')
            return redirect(url_for('index'))
        
        else:
            flash(f'Invalid CSV file: {message}')
            return redirect(url_for('index'))
    else:
        flash('Only CSV files are allowed')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True) 