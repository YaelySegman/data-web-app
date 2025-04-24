"""
CSV validation module for the Patient Outcomes Data Web Application.
Handles validation of uploaded CSV files to ensure they meet the required format.
"""

import csv
import codecs
import logging

def validate_csv(file_path):
    """
    Validates that the CSV file has the expected format and content.
    
    Args:
        file_path (str): Path to the CSV file to validate
        
    Returns:
        tuple: (is_valid, message)
            - is_valid (bool): True if the file is valid, False otherwise
            - message (str): Description of validation result or error message
            
    The function checks:
    1. File is not empty
    2. File can be decoded with supported encodings
    3. Required columns are present
    4. Data in each row is valid
    """
    required_columns = ['Patient ID', 'Outcome']
    
    try:
        # Try different encodings to handle various file formats
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with codecs.open(file_path, 'r', encoding=encoding) as csv_file:
                    # Check if file is empty
                    if csv_file.read(1) == '':
                        return False, "File is empty"
                    
                    # Reset file pointer to beginning
                    csv_file.seek(0)
                    
                    # Check header
                    csv_reader = csv.reader(csv_file)
                    header = next(csv_reader, None)
                    
                    if not header:
                        logging.error("Could not read CSV header")
                        return False, "Could not read CSV header"
                    
                    logging.debug(f"CSV header: {header}")
                    
                    # Validate that only the required columns are present
                    if len(header) != len(required_columns):
                        logging.error("CSV must contain exactly two columns: 'Patient ID' and 'Outcome'")
                        return False, "CSV must contain exactly two columns: 'Patient ID' and 'Outcome'"
                    
                    # Check if all required columns are present
                    missing_columns = [col for col in required_columns if col not in header]
                    if missing_columns:
                        logging.error(f"Missing required columns: {', '.join(missing_columns)}")
                        return False, f"Missing required columns: {', '.join(missing_columns)}"
                    
                    # Check data types and content in rows
                    for i, row in enumerate(csv_reader, start=2):  # Start from 2 to account for header
                        if len(row) != len(header):
                            return False, f"Row {i} has incorrect number of columns"
                        
                        # Get column index for each required column
                        patient_id_idx = header.index('Patient ID')
                        outcome_idx = header.index('Outcome')
                        
                        # Validate patient_id is not empty
                        if not row[patient_id_idx].strip():
                            return False, f"Row {i}: 'Patient ID' cannot be empty"
                        
                        # Validate outcome is not empty
                        if not row[outcome_idx].strip():
                            return False, f"Row {i}: 'Outcome' cannot be empty"
                    
                    # If we get here, the file is valid with this encoding
                    return True, "CSV is valid"
            except UnicodeDecodeError:
                # Try the next encoding
                continue
        
        # If we get here, none of the encodings worked
        return False, "Could not decode CSV file with any supported encoding"
    except Exception as e:
        return False, f"Error validating CSV: {str(e)}" 