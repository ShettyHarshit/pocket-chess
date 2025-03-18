Here’s a **README** template for your project:

---

# **Online Chess Game**

A full-stack online chess game where users can play against an AI opponent. Built using **React** (frontend) and **Node.js with PostgreSQL** (backend).

## **Features**

✅ Play chess against a simple AI  
✅ Track moves and game history  
✅ Game-over detection (checkmate, stalemate, draw)  
✅ Persistent game storage using PostgreSQL  
✅ Hosted on **Netlify (Frontend)** & **Railway (Backend + DB)**

---

## **Tech Stack**

### **Frontend** 🖥️

- React
- React Chessboard
- React Router

### **Backend** ⚙️

- Node.js (Express)
- Chess.js (game logic)
- PostgreSQL (database)

### **Deployment** 🚀

- **Frontend:** [Netlify](https://www.netlify.com/)
- **Backend:** [Railway](https://railway.app/)
- **Database:** Railway PostgreSQL

---

## **Setup Instructions**

### **1. Clone the Repository**

```sh
git clone https://github.com/yourusername/chess-game.git
cd chess-game
```

### **2. Install Dependencies**

#### **Frontend**

```sh
cd fe
npm install
npm start
```

Runs at `http://localhost:3000`.

#### **Backend**

```sh
cd ../be
npm install
npm start
```

Runs at `http://localhost:5555`.

### **3. Set Up PostgreSQL Database**

Create a `.env` file inside `be/` with:

```
DATABASE_URL=your_postgresql_url_here
```

Then, run migrations:

```sh
npx knex migrate:latest
```

---

## **API Endpoints**

| Method   | Endpoint    | Description      |
| -------- | ----------- | ---------------- |
| **GET**  | `/game/:id` | Fetch game state |
| **POST** | `/move`     | Make a move      |
| **POST** | `/new`      | Start a new game |

---

## **Contributing**

Feel free to submit issues and PRs! 🎉

---

This **README** gives an overview, setup guide, and API reference.  
Let me know if you need more sections! 🚀
