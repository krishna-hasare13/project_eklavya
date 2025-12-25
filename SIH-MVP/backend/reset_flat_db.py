import sqlite3
import random
import json

def reset_database_clean():
    db_file = 'students.db'
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    print("🔄 Wiping DB and creating Clean, Balanced Data...")

    # 1. Drop old tables
    cursor.execute("DROP TABLE IF EXISTS students")
    cursor.execute("DROP TABLE IF EXISTS test_scores")
    cursor.execute("DROP TABLE IF EXISTS users") 

    # 2. Re-create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    """)

    # 3. Create students table WITH 'risk_label'
    cursor.execute("""
        CREATE TABLE students (
            student_id TEXT PRIMARY KEY,
            name TEXT,
            prn TEXT,
            fee_status TEXT,
            attendance_percentage INTEGER,
            avgMarks REAL,
            risk_label TEXT,
            sem1_att INTEGER, sem2_att INTEGER, sem3_att INTEGER, sem4_att INTEGER, sem5_att INTEGER, sem6_att INTEGER,
            sem1_cgpa REAL, sem2_cgpa REAL, sem3_cgpa REAL, sem4_cgpa REAL, sem5_cgpa REAL, sem6_cgpa REAL,
            credits INTEGER,
            wellbeing INTEGER,
            subjects_json TEXT
        )
    """)

    # --- CONFIGURATION: Define Profiles Data-Driven ---
    # We create a list of 60 configs: 20 Low, 20 Medium, 20 High
    
    profiles = []

    # 1. Add 20 'Low Risk' (Good) Profiles
    for _ in range(20):
        profiles.append({
            "label": "Low",
            "att_range": (85, 100),
            "fee_opts": ['Paid'],
            "score_range": (75, 100),
            "cgpa_base": 9.0,
            "credits": 24
        })

    # 2. Add 20 'Medium Risk' (Average) Profiles
    for _ in range(20):
        profiles.append({
            "label": "Medium",
            "att_range": (60, 84),
            "fee_opts": ['Paid', 'Paid', 'Overdue'],
            "score_range": (50, 74),
            "cgpa_base": 7.0,
            "credits": 22
        })

    # 3. Add 20 'High Risk' (Poor) Profiles
    for _ in range(20):
        profiles.append({
            "label": "High",
            "att_range": (30, 59),
            "fee_opts": ['Overdue', 'Overdue', 'Paid'],
            "score_range": (20, 49),
            "cgpa_base": 5.0,
            "credits": 18
        })

    # --- GENERATION LOOP ---
    start_prn = 2023025050
    target_subjects = ["Object Oriented Programming", "Computer Networks", "DBMS", "Automata Theory"]

    print(f"🚀 Inserting {len(profiles)} students...")

    for i, conf in enumerate(profiles):
        prn = str(start_prn + i)
        s_id = prn
        name = f"Student {s_id}"
        
        # Apply Configuration
        att_pct = random.randint(*conf["att_range"])
        fee_status = random.choice(conf["fee_opts"])
        base_cgpa = conf["cgpa_base"]
        label = conf["label"]
        
        wellbeing = random.randint(40, 90)

        # Semester Data
        sem_att = [min(100, max(0, att_pct + random.randint(-5, 5))) for _ in range(6)]
        sem_cgpas = [round(min(10.0, max(0, base_cgpa + random.uniform(-0.5, 0.5))), 2) for _ in range(6)]

        # Subject Marks
        subject_list = []
        total_marks = 0
        min_s, max_s = conf["score_range"]
        
        for subj in target_subjects:
            score = random.randint(min_s, max_s)
            subject_list.append({"subject": subj, "score": score})
            total_marks += score
        
        avg_marks = round(total_marks / len(target_subjects), 1)
        subjects_json = json.dumps(subject_list)

        # Insert Record
        cursor.execute("""
            INSERT INTO students (
                student_id, name, prn, fee_status, attendance_percentage, avgMarks, risk_label,
                sem1_att, sem2_att, sem3_att, sem4_att, sem5_att, sem6_att,
                sem1_cgpa, sem2_cgpa, sem3_cgpa, sem4_cgpa, sem5_cgpa, sem6_cgpa,
                credits, wellbeing, subjects_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            s_id, name, prn, fee_status, att_pct, avg_marks, label,
            *sem_att, *sem_cgpas, conf["credits"], wellbeing, subjects_json
        ))

    conn.commit()
    conn.close()
    print("✅ Database reset complete. 20 Low, 20 Medium, 20 High risk students created.")

if __name__ == "__main__":
    reset_database_clean()