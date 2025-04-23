import sqlite3
from flask import current_app, g
from datetime import datetime

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    with current_app.open_resource('../schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

def save_data(csv_data):
    db = get_db()
    cursor = db.cursor()
    
    for row in csv_data:
        patient_id = row.get('patient_id')
        outcome = row.get('outcome')
        recorded_at = row.get('recorded_at')
        
        # Check if patient exists
        cursor.execute('SELECT patient_id FROM patients WHERE patient_id = ?', (patient_id,))
        patient = cursor.fetchone()
        
        if patient is None:
            # New patient - add to patients table
            cursor.execute(
                'INSERT INTO patients (patient_id, created_at) VALUES (?, ?)',
                (patient_id, recorded_at)
            )
        
        # Set all previous outcomes for this patient to not current
        cursor.execute(
            'UPDATE patient_outcomes SET is_current = FALSE WHERE patient_id = ?',
            (patient_id,)
        )
        
        # Add new outcome
        cursor.execute(
            'INSERT INTO patient_outcomes (patient_id, outcome, recorded_at, is_current) VALUES (?, ?, ?, ?)',
            (patient_id, outcome, recorded_at, True)
        )
    
    db.commit()

def get_all_data():
    db = get_db()
    cursor = db.cursor()
    
    # Get all patient outcomes with patient info
    cursor.execute('''
        SELECT p.patient_id, p.created_at, po.outcome, po.recorded_at, po.is_current
        FROM patients p
        JOIN patient_outcomes po ON p.patient_id = po.patient_id
        ORDER BY p.patient_id, po.recorded_at
    ''')
    
    return [dict(row) for row in cursor.fetchall()] 