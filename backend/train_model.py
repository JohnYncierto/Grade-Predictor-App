import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

# Load data
df = pd.read_csv('cleaned_grades.csv')

# Remove year columns
year_cols = [col for col in df.columns if col.startswith('year_')]
if year_cols:
    df = df.drop(columns=year_cols)

# Get categorical features
cat_features = [col for col in df.columns 
                if col.startswith(('section_', 'gender_', 'remarks_'))]

print("="*70)
print("TRAINING COMPREHENSIVE PREDICTION SYSTEM")
print("="*70)

os.makedirs('models', exist_ok=True)

# Calculate class averages for comparison
class_avg = {
    'q1': df['1st_quarter'].mean(),
    'q2': df['2nd_quarter'].mean(),
    'q3': df['3rd_quarter'].mean(),
    'q4': df['4th_quarter'].mean(),
    'final': df['final_grade'].mean()
}
joblib.dump(class_avg, 'models/class_averages.pkl')
print(f"\nClass Averages Calculated:")
for k, v in class_avg.items():
    print(f"   {k.upper()}: {v*100:.2f}%")

y_final = df['final_grade']

# ===========================================
# FINAL GRADE PREDICTION MODELS
# ===========================================
print("\n" + "="*70)
print("TRAINING FINAL GRADE PREDICTION MODELS")
print("="*70)

# Model 1: After Q1 → Predict Final
print("\nModel 1: Q1 → Final Grade")
X1 = df[['1st_quarter'] + cat_features]
scaler1 = StandardScaler()
X1_scaled = scaler1.fit_transform(X1)
X_train, X_test, y_train, y_test = train_test_split(X1_scaled, y_final, test_size=0.2, random_state=42)
model_q1_final = GradientBoostingRegressor(random_state=42, n_estimators=100)
model_q1_final.fit(X_train, y_train)
y_pred = model_q1_final.predict(X_test)
print(f"   R²: {r2_score(y_test, y_pred):.4f} | MAE: {mean_absolute_error(y_test, y_pred):.4f}")
joblib.dump(model_q1_final, 'models/q1_to_final.pkl')
joblib.dump(scaler1, 'models/scaler_q1_final.pkl')
joblib.dump(X1.columns.tolist(), 'models/features_q1_final.pkl')

# Model 2: After Q1+Q2 → Predict Final
print("\nModel 2: Q1+Q2 → Final Grade")
X2 = df[['1st_quarter', '2nd_quarter'] + cat_features]
scaler2 = StandardScaler()
X2_scaled = scaler2.fit_transform(X2)
X_train, X_test, y_train, y_test = train_test_split(X2_scaled, y_final, test_size=0.2, random_state=42)
model_q2_final = GradientBoostingRegressor(random_state=42, n_estimators=100)
model_q2_final.fit(X_train, y_train)
y_pred = model_q2_final.predict(X_test)
print(f"   R²: {r2_score(y_test, y_pred):.4f} | MAE: {mean_absolute_error(y_test, y_pred):.4f}")
joblib.dump(model_q2_final, 'models/q2_to_final.pkl')
joblib.dump(scaler2, 'models/scaler_q2_final.pkl')
joblib.dump(X2.columns.tolist(), 'models/features_q2_final.pkl')

# Model 3: After Q1+Q2+Q3 → Predict Final
print("\nModel 3: Q1+Q2+Q3 → Final Grade")
X3 = df[['1st_quarter', '2nd_quarter', '3rd_quarter'] + cat_features]
scaler3 = StandardScaler()
X3_scaled = scaler3.fit_transform(X3)
X_train, X_test, y_train, y_test = train_test_split(X3_scaled, y_final, test_size=0.2, random_state=42)
model_q3_final = GradientBoostingRegressor(random_state=42, n_estimators=100)
model_q3_final.fit(X_train, y_train)
y_pred = model_q3_final.predict(X_test)
print(f"   R²: {r2_score(y_test, y_pred):.4f} | MAE: {mean_absolute_error(y_test, y_pred):.4f}")
joblib.dump(model_q3_final, 'models/q3_to_final.pkl')
joblib.dump(scaler3, 'models/scaler_q3_final.pkl')
joblib.dump(X3.columns.tolist(), 'models/features_q3_final.pkl')

# ===========================================
# FUTURE QUARTER PREDICTION MODELS
# ===========================================
print("\n" + "="*70)
print("TRAINING FUTURE QUARTER PREDICTION MODELS")
print("="*70)

# Q1 → Predict Q2
print("\nQ1 → Q2 Prediction")
y_q2 = df['2nd_quarter']
X_q1 = df[['1st_quarter'] + cat_features]
scaler_q1_to_q2 = StandardScaler()
X_scaled = scaler_q1_to_q2.fit_transform(X_q1)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_q2, test_size=0.2, random_state=42)
model_q1_to_q2 = GradientBoostingRegressor(random_state=42, n_estimators=100)
model_q1_to_q2.fit(X_train, y_train)
y_pred = model_q1_to_q2.predict(X_test)
print(f"   R²: {r2_score(y_test, y_pred):.4f} | MAE: {mean_absolute_error(y_test, y_pred):.4f}")
joblib.dump(model_q1_to_q2, 'models/q1_to_q2.pkl')
joblib.dump(scaler_q1_to_q2, 'models/scaler_q1_to_q2.pkl')

# Q1+Q2 → Predict Q3
print("\nQ1+Q2 → Q3 Prediction")
y_q3 = df['3rd_quarter']
X_q2 = df[['1st_quarter', '2nd_quarter'] + cat_features]
scaler_q2_to_q3 = StandardScaler()
X_scaled = scaler_q2_to_q3.fit_transform(X_q2)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_q3, test_size=0.2, random_state=42)
model_q2_to_q3 = GradientBoostingRegressor(random_state=42, n_estimators=100)
model_q2_to_q3.fit(X_train, y_train)
y_pred = model_q2_to_q3.predict(X_test)
print(f"   R²: {r2_score(y_test, y_pred):.4f} | MAE: {mean_absolute_error(y_test, y_pred):.4f}")
joblib.dump(model_q2_to_q3, 'models/q2_to_q3.pkl')
joblib.dump(scaler_q2_to_q3, 'models/scaler_q2_to_q3.pkl')

# Q1+Q2+Q3 → Predict Q4
print("\nQ1+Q2+Q3 → Q4 Prediction")
y_q4 = df['4th_quarter']
X_q3 = df[['1st_quarter', '2nd_quarter', '3rd_quarter'] + cat_features]
scaler_q3_to_q4 = StandardScaler()
X_scaled = scaler_q3_to_q4.fit_transform(X_q3)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_q4, test_size=0.2, random_state=42)
model_q3_to_q4 = GradientBoostingRegressor(random_state=42, n_estimators=100)
model_q3_to_q4.fit(X_train, y_train)
y_pred = model_q3_to_q4.predict(X_test)
print(f"   R²: {r2_score(y_test, y_pred):.4f} | MAE: {mean_absolute_error(y_test, y_pred):.4f}")
joblib.dump(model_q3_to_q4, 'models/q3_to_q4.pkl')
joblib.dump(scaler_q3_to_q4, 'models/scaler_q3_to_q4.pkl')

print("\n" + "="*70)
print("ALL MODELS TRAINED AND SAVED!")
print("="*70)