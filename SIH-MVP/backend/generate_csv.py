import csv
import random
import json

def generate_balanced_csv():
    filename = "students_dataset.csv"
    
    # --- Configuration ---
    # Start PRN from where the database script left off (e.g., 2023025110)
    start_prn = 2023025110 
    target_subjects = ["Object Oriented Programming", "Computer Networks", "DBMS", "Automata Theory"]
    
    # Define profiles directly (20 Low, 20 Medium, 20 High)
    profiles = []

    # 1. 20 'Low Risk' (Good) Profiles
    for _ in range(20):
        profiles.append({
            "att_range": (85, 100),
            "fee_opts": ['Paid'],
            "score_range": (75, 100),
            "cgpa_base": 9.0
        })

    # 2. 20 'Medium Risk' (Average) Profiles
    for _ in range(20):
        profiles.append({
            "att_range": (60, 84),
            "fee_opts": ['Paid', 'Paid', 'Overdue'],
            "score_range": (50, 74),
            "cgpa_base": 7.0
        })

    # 3. 20 'High Risk' (Poor) Profiles
    for _ in range(20):
        profiles.append({
            "att_range": (30, 59),
            "fee_opts": ['Overdue', 'Overdue', 'Paid'],
            "score_range": (20, 49),
            "cgpa_base": 5.0
        })

    header = [
        'student_id', 'name', 'prn', 'fee_status', 'attendance_percentage', 'avgMarks',
        'sem1_att', 'sem2_att', 'sem3_att', 'sem4_att', 'sem5_att', 'sem6_att',
        'sem1_cgpa', 'sem2_cgpa', 'sem3_cgpa', 'sem4_cgpa', 'sem5_cgpa', 'sem6_cgpa',
        'credits', 'wellbeing', 'subjects_json'
    ]
    
    rows = []
    print(f"🔨 Generating {len(profiles)} BALANCED students (Config-based)...")

    for i, conf in enumerate(profiles):
        prn = str(start_prn + i)
        name = f"Student {prn}"
        
        # Apply Configuration directly
        att_pct = random.randint(*conf["att_range"])
        fee_status = random.choice(conf["fee_opts"])
        base_cgpa = conf["cgpa_base"]
        min_s, max_s = conf["score_range"]

        # Generate Semester Data
        sem_att = [min(100, max(0, att_pct + random.randint(-5, 5))) for _ in range(6)]
        sem_cgpas = [round(min(10.0, max(0, base_cgpa + random.uniform(-0.5, 0.5))), 2) for _ in range(6)]

        # Generate Subject Marks
        subject_list = []
        total = 0
        for subj in target_subjects:
            score = random.randint(min_s, max_s)
            subject_list.append({"subject": subj, "score": score})
            total += score
        
        avg_marks = round(total / len(target_subjects), 1)
        
        rows.append([
            prn, name, prn, fee_status, att_pct, avg_marks,
            *sem_att, *sem_cgpas, 20, 70, json.dumps(subject_list)
        ])

    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)
        
    print(f"✅ Success! Created balanced dataset: {filename}")

if __name__ == "__main__":
    generate_balanced_csv()