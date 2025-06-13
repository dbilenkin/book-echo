# Book Echo 📚

**Book Echo** is an early-stage Goodreads-style clone for tracking books, reviews, ratings, and more. It’s a full-stack web application built with modern tools and designed to grow into a personalized reading platform.

## 🌟 Features (Planned)

- User authentication and profiles  
- Search and browse books  
- Personal bookshelves (Read / Want to Read / Currently Reading)  
- Star ratings and written reviews  
- Friend/follow system  
- Activity feed  
- Book recommendations  

## 🛠 Tech Stack

### Frontend
- React (with Vite)
- Bootstrap 5

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Docker

## 📦 Prerequisites

- Node.js (v16+): https://nodejs.org/
- Docker & Docker Compose: https://docs.docker.com/compose/

## 🚀 Getting Started

### 1. Clone the repo

    git clone https://github.com/your-username/book-echo.git
    cd book-echo

### 2. Create a `.env` file

Create a file named `.env` in the root folder with:

    POSTGRES_USER=devuser
    POSTGRES_PASSWORD=devpass
    POSTGRES_DB=devdb

### 3. Start the backend and database

    docker-compose up --build

Visit [http://localhost:8000](http://localhost:8000)

### 4. Set up the frontend (Vite + React)

    cd frontend
    npm install
    npm run dev

Visit [http://localhost:5173](http://localhost:5173)

## 🧪 Test Login

Use:

- Username: `testuser`
- Password: `testpass`

If needed, create the `users` table manually — see below.

## 📝 Setup Notes

### Connect to Postgres:

    docker exec -it book-echo-db-1 psql -U devuser -d devdb

### Create the table:

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

    INSERT INTO users (username, password) VALUES ('testuser', 'testpass');

    \q

## 🤝 Contributing

Contributions welcome! Open issues or submit PRs to help shape Book Echo.

## 📚 License

MIT — free for personal or commercial use.
