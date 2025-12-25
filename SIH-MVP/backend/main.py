import os
import sqlite3
import io
import re
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import numpy as np
import pandas as pd
import joblib
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

# AI/ML Imports
from xgboost import XGBClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder

# -------------------- App Setup --------------------
app = Flask(
    __name__,
    template_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
)
CORS(app)

# -------------------- Configuration --------------------
MODEL_FILE = 'risk_model.joblib'
SCALER_FILE = 'scaler.joblib'
ENCODER_FILE = 'encoder.joblib'
LABEL_ENCODER_FILE = 'label_encoder.joblib'

# Global variables
MODEL = None
SCALER = None
ENCODER = None
LABEL_ENCODER = None
FEATURES = None

# -------------------- Historical Data (Fallback) --------------------
# Updated to match new schema, just in case DB is empty.
historical_data = {
    'student_id': ['2023025050', '2023025051', '2023025052', '2023025053', '2023025054'],
    'attendance_percentage': [82, 65, 90, 72, 55],
    'avgMarks': [81.5, 37.5, 90.0, 50.0, 32.0], 
    'fee_status': ['Paid', 'Overdue', 'Paid', 'Overdue', 'Overdue'],
    'risk_label': ['Low', 'High', 'Low', 'Medium', 'High']
}
historical_df = pd.DataFrame(historical_data)

# -------------------- Helper Functions --------------------

def get_db_connection():
    conn = sqlite3.connect('students.db')
    conn.row_factory = sqlite3.Row  # Allows accessing columns by name
    return conn

def validate_password(password):
    if len(password) < 8: return "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", password): return "Password must contain at least one uppercase letter."
    if not re.search(r"\d", password): return "Password must contain at least one number."
    return None

def send_real_email(to_email, subject, body):
    """
    Sends a real email using Gmail SMTP. Defaults to simulation if credentials aren't set.
    """
    SENDER_EMAIL = "your-email@gmail.com" 
    SENDER_PASSWORD = "your-app-password" 

    if SENDER_EMAIL == "your-email@gmail.com":
        print(f"📧 [SIMULATION] Email to {to_email}: {subject}")
        return True 

    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"❌ Email Error: {e}")
        return False

# -------------------- AI Logic --------------------

def train_model_once():
    global MODEL, SCALER, ENCODER, LABEL_ENCODER, FEATURES

    # 1. Load existing model if available
    if (os.path.exists(MODEL_FILE) and os.path.exists(SCALER_FILE) and 
        os.path.exists(ENCODER_FILE) and os.path.exists(LABEL_ENCODER_FILE)):
        MODEL = joblib.load(MODEL_FILE)
        SCALER = joblib.load(SCALER_FILE)
        ENCODER = joblib.load(ENCODER_FILE)
        LABEL_ENCODER = joblib.load(LABEL_ENCODER_FILE)
        
        # Reconstruct feature names from encoder
        fee_cols = ENCODER.get_feature_names_out(['fee_status']).tolist()
        FEATURES = ['attendance_percentage', 'avgMarks'] + fee_cols
        print("✅ AI model loaded successfully.")
        return

    print("⚠️ Training a new AI model (XGBoost)...")
    
    # 2. Get Training Data (CRITICAL: Fetch risk_label)
    conn = get_db_connection()
    try:
        df = pd.read_sql_query("SELECT student_id, attendance_percentage, fee_status, avgMarks, risk_label FROM students", conn)
    except:
        df = pd.DataFrame()
    conn.close()
    
    # 3. Fallback Logic
    use_historical = False
    if df.empty:
        print("   > Database is empty.")
        use_historical = True
    elif 'risk_label' not in df.columns:
        print("   > Database missing 'risk_label'.")
        use_historical = True
    elif df['risk_label'].isnull().all():
        print("   > 'risk_label' column is empty.")
        use_historical = True
        
    if use_historical:
        print("   > Using historical dataset fallback.")
        df = historical_df.copy()

    if 'risk_label' not in df.columns:
        print("❌ Critical Error: Cannot train.")
        return

    # 4. Prepare Features (X)
    ENCODER = OneHotEncoder(handle_unknown='ignore')
    encoded_fee = pd.DataFrame(
        ENCODER.fit_transform(df[['fee_status']]).toarray(),
        columns=ENCODER.get_feature_names_out(['fee_status'])
    )
    
    FEATURES = ['attendance_percentage', 'avgMarks'] + list(encoded_fee.columns)
    X = pd.concat([df[['attendance_percentage', 'avgMarks']], encoded_fee], axis=1)

    # Scale X
    SCALER = StandardScaler()
    X_scaled = SCALER.fit_transform(X)

    # 5. Prepare Target (y)
    LABEL_ENCODER = LabelEncoder()
    y = LABEL_ENCODER.fit_transform(df['risk_label'])

    # 6. Train XGBoost
    MODEL = XGBClassifier(n_estimators=100, max_depth=4, eval_metric='mlogloss')
    MODEL.fit(X_scaled, y)

    # 7. Save Artifacts
    joblib.dump(MODEL, MODEL_FILE)
    joblib.dump(SCALER, SCALER_FILE)
    joblib.dump(ENCODER, ENCODER_FILE)
    joblib.dump(LABEL_ENCODER, LABEL_ENCODER_FILE)
    print("✅ AI model trained and saved.")

def predict_risk(df):
    if MODEL is None: return df, "AI model not loaded."

    try:
        # Preprocess exactly like training
        encoded_fee = pd.DataFrame(
            ENCODER.transform(df[['fee_status']]).toarray(),
            columns=ENCODER.get_feature_names_out(['fee_status'])
        )
        X = pd.concat([df[['attendance_percentage', 'avgMarks']], encoded_fee], axis=1)
        X_scaled = SCALER.transform(X)

        # Predict
        preds = MODEL.predict(X_scaled)
        df['risk_level'] = LABEL_ENCODER.inverse_transform(preds)
        
        return df, None
    except Exception as e:
        return df, str(e)

def get_counseling_insights(student_data):
    reasons = []
    advice = "No specific advice."

    if student_data['attendance_percentage'] < 75:
        reasons.append(f"Low attendance ({student_data['attendance_percentage']}%).")
        advice = "Encourage regular class attendance. "

    if student_data['avgMarks'] < 50:
        reasons.append(f"Low academic score ({student_data['avgMarks']}).")
        advice += "Suggest tutoring. "

    if str(student_data['fee_status']).lower() == 'overdue':
        reasons.append("Overdue fee status.")
        advice += "Consider financial counseling."

    return reasons, advice

# -------------------- Routes --------------------

@app.route('/')
def home():
    return render_template('dashboard.html')

@app.route("/api/register", methods=['POST'])
def register():
    data = request.json
    err = validate_password(data.get('password'))
    if err: return jsonify({'message': err}), 400

    conn = get_db_connection()
    try:
        pw_hash = generate_password_hash(data.get('password'))
        conn.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
                     (data.get('username'), pw_hash, data.get('role')))
        conn.commit()
        return jsonify({'message': 'Registered successfully!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username taken.'}), 409
    finally:
        conn.close()

@app.route("/api/login", methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username=?", (data.get('username'),)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], data.get('password')):
        return jsonify({'message': 'Login successful', 'role': user['role'], 'username': user['username']}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route("/api/students", methods=["GET"])
def get_students():
    conn = get_db_connection()
    # Fetch data. Note: We alias avgMarks to avg_test_score just in case old code expects it,
    # but we ALSO keep avgMarks for the AI model.
    df = pd.read_sql_query("SELECT student_id, name, attendance_percentage, fee_status, avgMarks, avgMarks as avg_test_score FROM students", conn)
    conn.close()

    if df.empty: return jsonify({"message": "No students found."}), 404

    final_df, err = predict_risk(df)
    
    search = request.args.get('search', '').lower()
    risk = request.args.get('filter', '').lower()

    if search: final_df = final_df[final_df['student_id'].astype(str).str.contains(search)]
    if risk and risk != 'all': final_df = final_df[final_df['risk_level'].str.lower() == risk]

    return jsonify(final_df.replace({np.nan: None}).to_dict(orient="records"))

@app.route("/api/student/<student_id>", methods=["GET"])
def get_student(student_id):
    conn = get_db_connection()
    student = conn.execute("SELECT * FROM students WHERE student_id=?", (student_id,)).fetchone()
    conn.close()

    if not student: return jsonify({"message": "Student not found."}), 404

    # Convert SQLite Row to Dictionary
    student_dict = dict(student)
    student_dict['avg_test_score'] = student_dict['avgMarks'] # Frontend compatibility

    # Parse Subject JSON
    try:
        scores_data = json.loads(student_dict['subjects_json'])
    except:
        scores_data = []

    # Get Prediction
    df = pd.DataFrame([student_dict])
    df, _ = predict_risk(df)
    student_dict['risk_level'] = df.iloc[0]['risk_level']

    # Get Insights
    reasons, advice = get_counseling_insights(student_dict)
    student_dict['reasons'] = reasons
    student_dict['advice'] = advice

    return jsonify({"info": student_dict, "scores": scores_data})

@app.route("/api/notify", methods=["POST"])
def notify_mentor():
    data = request.json
    student_id = data.get('student_id')
    risk_level = data.get('risk_level')
    mentor_email = "mentor@institute.edu"
    
    subject = f"⚠️ ALERT: High Risk Detected for Student {student_id}"
    body = f"URGENT ATTENTION REQUIRED\n\nStudent ID: {student_id}\nRisk Level: {risk_level}\n\nPlease review this case immediately."
    
    if send_real_email(mentor_email, subject, body):
        return jsonify({"message": f"Alert sent to {mentor_email}"}), 200
    return jsonify({"message": "Failed to send alert"}), 500

@app.route("/api/subjects/scores", methods=["GET"])
def get_subject_scores():
    """
    Parses JSON from all students to aggregate subject performance.
    """
    conn = get_db_connection()
    rows = conn.execute("SELECT subjects_json FROM students").fetchall()
    conn.close()

    subject_totals = {}
    subject_counts = {}

    for row in rows:
        try:
            subjects = json.loads(row['subjects_json'])
            for item in subjects:
                sub = item['subject']
                score = item['score']
                subject_totals[sub] = subject_totals.get(sub, 0) + score
                subject_counts[sub] = subject_counts.get(sub, 0) + 1
        except:
            continue

    results = []
    for sub, total in subject_totals.items():
        results.append({
            "subject": sub,
            "test_score": round(total / subject_counts[sub], 1)
        })

    return jsonify(results)

@app.route("/api/upload", methods=["POST"])
def upload_data():
    file = request.files['file']
    if not file: return jsonify({"message": "No file part"}), 400

    try:
        # Read CSV
        df = pd.read_csv(io.StringIO(file.stream.read().decode("UTF8")))
        conn = get_db_connection()
        
        existing = pd.read_sql_query("SELECT student_id FROM students", conn)
        existing_ids = set(existing['student_id'].astype(str))
        
        # Ensure ID format matches
        df['student_id'] = df['student_id'].astype(str)
        
        # Filter duplicates
        new_data = df[~df['student_id'].isin(existing_ids)]
        
        if new_data.empty:
            conn.close()
            return jsonify({"message": "No new unique students found."}), 200

        # Append to Database
        new_data.to_sql('students', conn, if_exists='append', index=False)
        
        conn.close()
        return jsonify({"message": f"Successfully uploaded {len(new_data)} records."}), 200
        
    except Exception as e:
        return jsonify({"message": f"Upload failed: {str(e)}"}), 500

# -------------------- Run --------------------
if __name__ == "__main__":
    train_model_once()
    app.run(debug=True)