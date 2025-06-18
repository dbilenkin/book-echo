from sqlalchemy import create_engine, text
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://devuser:devpass@db:5432/devdb")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    with engine.connect() as conn:
        # Create table if not exists
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        """))

        # Create user_books table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS user_books (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                author TEXT,
                year INTEGER,
                openlibrary_key TEXT,
                cover_url TEXT
            )
        """))

        # Insert test user if not exists
        result = conn.execute(text("SELECT * FROM users WHERE username = 'steve'"))
        if not result.first():
            conn.execute(
                text("INSERT INTO users (username, password) VALUES (:u, :p)"),
                {"u": "steve", "p": "jobs"}
            )
        conn.commit()

if __name__ == "__main__":
    init_db()
