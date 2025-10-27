from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Load all models
print("Loading models...")
models = {
    'q1_to_final': joblib.load('models/q1_to_final.pkl'),
    'q2_to_final': joblib.load('models/q2_to_final.pkl'),
    'q3_to_final': joblib.load('models/q3_to_final.pkl'),
    'q1_to_q2': joblib.load('models/q1_to_q2.pkl'),
    'q2_to_q3': joblib.load('models/q2_to_q3.pkl'),
    'q3_to_q4': joblib.load('models/q3_to_q4.pkl'),
}

scalers = {
    'q1_final': joblib.load('models/scaler_q1_final.pkl'),
    'q2_final': joblib.load('models/scaler_q2_final.pkl'),
    'q3_final': joblib.load('models/scaler_q3_final.pkl'),
    'q1_to_q2': joblib.load('models/scaler_q1_to_q2.pkl'),
    'q2_to_q3': joblib.load('models/scaler_q2_to_q3.pkl'),
    'q3_to_q4': joblib.load('models/scaler_q3_to_q4.pkl'),
}

features = {
    'q1_final': joblib.load('models/features_q1_final.pkl'),
    'q2_final': joblib.load('models/features_q2_final.pkl'),
    'q3_final': joblib.load('models/features_q3_final.pkl'),
}

class_avg = joblib.load('models/class_averages.pkl')

print("Models loaded successfully!\n")

def create_input_df(quarters, section, gender):
    """Helper to create input dataframe"""
    data = {}
    if 'q1' in quarters:
        data['1st_quarter'] = quarters['q1']
    if 'q2' in quarters:
        data['2nd_quarter'] = quarters['q2']
    if 'q3' in quarters:
        data['3rd_quarter'] = quarters['q3']
    
    data.update({
        'section_BANABA': 1 if section == 'BANABA' else 0,
        'section_CABALLERO': 1 if section == 'CABALLERO' else 0,
        'section_GEMELINA': 1 if section == 'GEMELINA' else 0,
        'gender_FEMALE': 1 if gender == 'FEMALE' else 0,
        'gender_MALE': 1 if gender == 'MALE' else 0,
        'remarks_FAILED': 0,
        'remarks_PASSED': 1
    })
    return pd.DataFrame([data])

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Get inputs
        current_quarter = data['currentQuarter']  # 1, 2, 3, or 4
        section = data['section']
        gender = data['gender']
        
        # Get available grades (normalize to 0-1)
        q1 = float(data.get('q1', 0)) / 100 if data.get('q1') else None
        q2 = float(data.get('q2', 0)) / 100 if data.get('q2') else None
        q3 = float(data.get('q3', 0)) / 100 if data.get('q3') else None
        q4 = float(data.get('q4', 0)) / 100 if data.get('q4') else None
        
        quarters = {}
        if q1: quarters['q1'] = q1
        if q2: quarters['q2'] = q2
        if q3: quarters['q3'] = q3
        if q4: quarters['q4'] = q4
        
        response = {
            'success': True,
            'currentQuarter': current_quarter,
            'enteredGrades': {},
            'predictedGrades': {},
            'finalGrade': {},
            'comparison': {},
        }
        
        # Store entered grades
        if q1: response['enteredGrades']['Q1'] = round(q1 * 100, 2)
        if q2: response['enteredGrades']['Q2'] = round(q2 * 100, 2)
        if q3: response['enteredGrades']['Q3'] = round(q3 * 100, 2)
        if q4: response['enteredGrades']['Q4'] = round(q4 * 100, 2)
        
        # Predict future quarters
        if current_quarter == 1 and q1:
            # Predict Q2, Q3, Q4, and Final
            input_df = create_input_df({'q1': q1}, section, gender)
            input_df = input_df[features['q1_final']]
            
            # Predict Q2
            input_scaled = scalers['q1_to_q2'].transform(input_df)
            pred_q2 = models['q1_to_q2'].predict(input_scaled)[0]
            response['predictedGrades']['Q2'] = round(pred_q2 * 100, 2)
            
            # Predict Q3 (using predicted Q2)
            input_df2 = create_input_df({'q1': q1, 'q2': pred_q2}, section, gender)
            input_scaled2 = scalers['q2_to_q3'].transform(input_df2)
            pred_q3 = models['q2_to_q3'].predict(input_scaled2)[0]
            response['predictedGrades']['Q3'] = round(pred_q3 * 100, 2)
            
            # Predict Q4
            input_df3 = create_input_df({'q1': q1, 'q2': pred_q2, 'q3': pred_q3}, section, gender)
            input_scaled3 = scalers['q3_to_q4'].transform(input_df3)
            pred_q4 = models['q3_to_q4'].predict(input_scaled3)[0]
            response['predictedGrades']['Q4'] = round(pred_q4 * 100, 2)
            
            # Predict Final
            input_scaled = scalers['q1_final'].transform(input_df)
            final_grade = models['q1_to_final'].predict(input_scaled)[0]
            confidence = 70
            
        elif current_quarter == 2 and q1 and q2:
            # Predict Q3, Q4, and Final
            input_df = create_input_df({'q1': q1, 'q2': q2}, section, gender)
            input_df = input_df[features['q2_final']]
            
            # Predict Q3
            input_scaled = scalers['q2_to_q3'].transform(input_df)
            pred_q3 = models['q2_to_q3'].predict(input_scaled)[0]
            response['predictedGrades']['Q3'] = round(pred_q3 * 100, 2)
            
            # Predict Q4
            input_df2 = create_input_df({'q1': q1, 'q2': q2, 'q3': pred_q3}, section, gender)
            input_scaled2 = scalers['q3_to_q4'].transform(input_df2)
            pred_q4 = models['q3_to_q4'].predict(input_scaled2)[0]
            response['predictedGrades']['Q4'] = round(pred_q4 * 100, 2)
            
            # Predict Final
            input_scaled = scalers['q2_final'].transform(input_df)
            final_grade = models['q2_to_final'].predict(input_scaled)[0]
            confidence = 85
            
        elif current_quarter == 3 and q1 and q2 and q3:
            # Predict Q4 and Final
            input_df = create_input_df({'q1': q1, 'q2': q2, 'q3': q3}, section, gender)
            input_df = input_df[features['q3_final']]
            
            # Predict Q4
            input_scaled = scalers['q3_to_q4'].transform(input_df)
            pred_q4 = models['q3_to_q4'].predict(input_scaled)[0]
            response['predictedGrades']['Q4'] = round(pred_q4 * 100, 2)
            
            # Predict Final
            input_scaled = scalers['q3_final'].transform(input_df)
            final_grade = models['q3_to_final'].predict(input_scaled)[0]
            confidence = 95
            
        elif current_quarter == 4 and q1 and q2 and q3 and q4:
            # Calculate actual final
            final_grade = (q1 + q2 + q3 + q4) / 4
            confidence = 100
            
        else:
            return jsonify({'success': False, 'error': 'Invalid quarter data'}), 400
        
        # Final grade analysis
        final_pct = final_grade * 100
        status = 'PASSED' if final_grade >= 0.75 else 'AT RISK'
        
        response['finalGrade'] = {
            'percentage': round(final_pct, 2),
            'status': status,
            'confidence': confidence
        }
        
        # Compare to class average
        avg_final = class_avg['final'] * 100
        diff = final_pct - avg_final
        
        response['comparison'] = {
            'classAverage': round(avg_final, 2),
            'difference': round(diff, 2),
            'percentile': 'Above Average' if diff > 0 else 'Below Average' if diff < 0 else 'Average'
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'models': list(models.keys())})

if __name__ == '__main__':
    print("="*70)
    print("Comprehensive Grade Prediction API")
    print("="*70)
    print("Running on: http://localhost:5000")
    print("Endpoint: POST /predict")
    print("="*70 + "\n")
    app.run(debug=True, port=5000)