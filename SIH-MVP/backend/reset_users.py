import sqlite3

def reset_users_table():
    db_file = 'students.db'
    
    print(f"Connecting to {db_file}...")
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    try:
        # 1. Drop the existing users table (This deletes all user data)
        print("Dropping 'users' table...")
        cursor.execute("DROP TABLE IF EXISTS users")

        # 2. Re-create the table with the correct columns
        print("Re-creating 'users' table...")
        cursor.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        """)

        conn.commit()
        print("✅ Success! All users deleted and table reset.")
        print("You can now go to /signup and create new Student/Admin accounts.")

    except sqlite3.Error as e:
        print(f"❌ An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    reset_users_table()