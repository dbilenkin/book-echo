from fastapi import FastAPI, Depends, HTTPException, Form, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel
import requests
from mangum import Mangum

from app.db.database import SessionLocal

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Database health check endpoint, will remove in prod
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

@app.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # db query to check user credentials
    user = db.execute(
        text("SELECT * FROM users WHERE username = :username AND password = :password"),
        {"username": username, "password": password}
    ).mappings().fetchone()
    if user:
        return {"message": "Login successful", "user": user}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
@app.get("/search")
def search_books(q: str = Query(..., description="Book title to search for")):
    try:
        openlibrary_url = "https://openlibrary.org/search.json"
        response = requests.get(openlibrary_url, params={"q": q, "limit": 10})
        response.raise_for_status()

        data = response.json()

        # Extract a simplified list of results
        books = [
            {
                "title": doc.get("title"),
                "author": ", ".join(doc.get("author_name", [])),
                "year": doc.get("first_publish_year"),
                "key": doc.get("key"),
                "cover_url": f"https://covers.openlibrary.org/b/id/{doc['cover_i']}-M.jpg" if doc.get("cover_i") else None
            }
            for doc in data.get("docs", [])
        ]


        return {"results": books}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

class BookEntry(BaseModel):
    username: str
    title: str
    author: str | None = None
    year: int | None = None
    openlibrary_key: str
    cover_url: str | None = None

@app.post("/user/books")
def add_book(entry: BookEntry, db: Session = Depends(get_db)):
    # Look up the user by username
    user = db.execute(
        text("SELECT id FROM users WHERE username = :username"),
        {"username": entry.username}
    ).fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.execute(
        text("""
            INSERT INTO user_books (user_id, title, author, year, openlibrary_key, cover_url)
            VALUES (:user_id, :title, :author, :year, :key, :cover)
        """),
        {
            "user_id": user.id,
            "title": entry.title,
            "author": entry.author,
            "year": entry.year,
            "key": entry.openlibrary_key,
            "cover": entry.cover_url
        }
    )
    db.commit()
    return {"message": "Book added to list"}

@app.get("/user/books")
def get_user_books(username: str, db: Session = Depends(get_db)):
    # Look up the user ID
    user = db.execute(
        text("SELECT id FROM users WHERE username = :username"),
        {"username": username}
    ).fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get the user's saved books
    rows = db.execute(
        text("""
            SELECT title, author, year, openlibrary_key, cover_url
            FROM user_books
            WHERE user_id = :user_id
        """),
        {"user_id": user.id}
    ).fetchall()

    # Convert to list of dicts
    books = [dict(row._mapping) for row in rows]

    return {"books": books}

handler = Mangum(app)
