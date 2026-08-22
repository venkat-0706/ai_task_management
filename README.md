
# 🤖 AI Task & Knowledge Engine

A full-stack enterprise-style task and knowledge management platform built with **FastAPI, React, MySQL, JWT-based RBAC, and FAISS semantic search**.

The system combines secure task management, document ingestion, local semantic search, role-based access control, audit logging, and operational analytics in a modular architecture designed for maintainability and scalability.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.1+-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)](https://www.mysql.com/)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-0467DF?style=for-the-badge)](https://github.com/facebookresearch/faiss)
[![JWT](https://img.shields.io/badge/JWT-RBAC-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)](https://jwt.io/)

---

## 📌 Project Overview

The **AI Task & Knowledge Engine** is designed to demonstrate how a modern Python full-stack application can combine traditional enterprise application development with AI-powered information retrieval.

The platform provides two major capabilities:

* **Task Management** — administrators can create and assign tasks while authenticated users can track and update task status.
* **Knowledge Retrieval** — administrators can upload PDF/TXT documents, which are processed into text chunks and converted into vector embeddings for semantic search.

The application also maintains **structured audit logs and analytics**, providing administrators with visibility into user activity, task distribution, and search behavior.

---

## 🎯 Key Features

### 🔐 Authentication & Authorization

* JWT-based stateless authentication
* Role-Based Access Control (RBAC)
* Separate `Admin` and `User` permissions
* Secure password hashing using bcrypt
* Protected FastAPI routes using dependency-based authorization
* Token expiration and configurable authentication settings

### 📋 Task Management

* Create and assign tasks
* Task filtering using multiple query parameters
* Task status management
* User-specific task access
* Admin-controlled task assignment
* Status transition workflow such as:

```text
Pending → In Progress → Completed
```

### 🧠 Semantic Knowledge Search

* Upload PDF and TXT documents
* Extract and process document text
* Split documents into searchable chunks
* Generate embeddings using SentenceTransformers
* Store vectors locally using FAISS
* Perform semantic similarity search
* Return relevant document content based on meaning rather than exact keyword matching

### 📊 Analytics & Monitoring

* Task distribution statistics
* Completed vs pending task metrics
* Search activity tracking
* User activity monitoring
* Administrative analytics dashboard
* Structured audit history for important system operations

### 📝 Audit Logging

The application records important actions such as:

```text
LOGIN
DOCUMENT_UPLOAD
TASK_CREATE
TASK_UPDATE
SEARCH_QUERY
```

This provides traceability for critical application operations.

---

# 🏗️ System Architecture

The application follows **Clean / Onion Architecture principles**, separating API transport, business logic, persistence, authentication, and AI-related services.

```text
                    ┌──────────────────────────┐
                    │       React Frontend     │
                    │                          │
                    │ Dashboard | Tasks |      │
                    │ Search | Authentication  │
                    └────────────┬─────────────┘
                                 │
                            REST / JWT
                                 │
                    ┌────────────▼─────────────┐
                    │       FastAPI API        │
                    │                          │
                    │ Routes | RBAC | Security │
                    │ Middleware | Validation  │
                    └────────────┬─────────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
      ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
      │ Task Service │     │  Knowledge  │     │  Analytics  │
      │              │     │   Service   │     │   Service   │
      └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
             │                   │                   │
      ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
      │   MySQL     │     │    FAISS    │     │ Audit Logs  │
      │             │     │ Vector Index│     │              │
      └─────────────┘     └─────────────┘     └─────────────┘
```

### Architectural Principles

* Separation of concerns
* Repository abstraction
* Service-layer business logic
* Dependency injection
* Centralized authentication and authorization
* Independent persistence and AI processing layers
* Modular frontend components
* Database indexing for frequently queried fields

---

# 🧠 Semantic Search Pipeline

The document retrieval pipeline follows this flow:

```text
       PDF / TXT Upload
              │
              ▼
      Document Extraction
              │
              ▼
       Text Preprocessing
              │
              ▼
        Text Chunking
              │
              ▼
   SentenceTransformer Model
       all-MiniLM-L6-v2
              │
              ▼
       Vector Embeddings
              │
              ▼
        FAISS Index
              │
              ▼
        Semantic Search
              │
              ▼
       Relevant Results
```

### Why Semantic Search?

Traditional keyword search can fail when the user's query and document content use different words with similar meanings.

For example:

```text
Query:
"How can an employee request time off?"

Relevant document:
"Employees must submit a leave application
through the staff portal."
```

Semantic embeddings allow the system to identify the conceptual relationship between the query and the document content.

---

# 🗄️ Database Design

The application uses **MySQL** as the primary relational database.

The schema is designed around normalized entities and relationships such as:

```text
Users
  │
  ├── Roles
  │
  ├── Tasks
  │
  └── Activity Logs

Documents
  │
  └── Document Metadata
```

### Database Engineering

* SQLAlchemy ORM
* Foreign-key relationships
* Normalized relational schema
* Transaction-based database operations
* Indexed fields for frequent queries
* Filtering by user, status, and timestamps
* Structured audit records

Example indexed query:

```text
GET /tasks?status=completed&assigned_to=1
```

---

# 🔒 Security Architecture

Security is implemented at multiple layers.

### Authentication

Users authenticate using credentials and receive a signed JWT access token.

```text
User Credentials
       │
       ▼
Password Verification
       │
       ▼
JWT Generation
       │
       ▼
Bearer Access Token
       │
       ▼
Protected API
```

### Authorization

FastAPI dependencies validate the authenticated user's role before allowing access to protected operations.

```text
Admin
 ├── Create Tasks
 ├── Assign Tasks
 ├── Upload Documents
 └── View Analytics

User
 ├── View Authorized Tasks
 ├── Update Task Status
 └── Perform Knowledge Search
```

Passwords are stored using secure one-way hashing rather than plaintext credentials.

---

# 📊 Operational Analytics

The administrative dashboard provides visibility into system activity.

Example metrics include:

| Metric          | Purpose                     |
| --------------- | --------------------------- |
| Total Tasks     | Overall workload            |
| Completed Tasks | Completed work              |
| Pending Tasks   | Outstanding work            |
| User Activity   | User interaction monitoring |
| Search Queries  | Knowledge retrieval usage   |
| Document Count  | Knowledge-base size         |

These metrics are calculated from application data and audit records rather than being maintained as manually updated counters.

---

# 📡 API Overview

| Method  | Endpoint             | Access        | Purpose                         |
| ------- | -------------------- | ------------- | ------------------------------- |
| `POST`  | `/auth/login`        | Public        | Authenticate user and issue JWT |
| `GET`   | `/tasks`             | Authenticated | Retrieve and filter tasks       |
| `POST`  | `/tasks`             | Admin         | Create and assign tasks         |
| `PATCH` | `/tasks/{id}/status` | User/Admin    | Update task status              |
| `POST`  | `/documents`         | Admin         | Upload and index documents      |
| `POST`  | `/search`            | Authenticated | Perform semantic search         |
| `GET`   | `/analytics`         | Admin         | Retrieve operational metrics    |

Interactive API documentation is available through FastAPI's Swagger UI:

```text
http://localhost:8000/docs
```

---

# 🛠️ Technology Stack

### Backend

* Python 3.10+
* FastAPI
* Uvicorn
* Pydantic
* SQLAlchemy
* PyJWT
* Passlib / bcrypt

### Frontend

* React
* Context API
* Axios
* Tailwind CSS / Bootstrap

### Database

* MySQL 8.0+
* SQLAlchemy ORM

### AI / Search

* FAISS
* SentenceTransformers
* `all-MiniLM-L6-v2`

### Development

* Git
* GitHub
* REST APIs
* Swagger / OpenAPI

---

# 📂 Project Structure

```text
AI-Task-Knowledge-System/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── core/
│   │   │   ├── security/
│   │   │   └── config/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   └── services/
│   │
│   ├── uploads/
│   ├── vector_store/
│   ├── main.py
│   ├── seed.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   │
│   ├── package.json
│   └── .env.example
│
├── docs/
│   └── screenshots/
│       ├── dashboard.png
│       ├── search.png
│       ├── tasks.png
│       └── logs.png
│
├── README.md
└── .gitignore
```

> Update the structure above if your actual repository differs.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* Python 3.10+
* Node.js 18+
* npm
* MySQL 8.0+
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/venkat-0706/AI-Task-Knowledge-System.git

cd AI-Task-Knowledge-System
```

---

## 2. Configure MySQL

Create the application database:

```sql
CREATE DATABASE task_knowledge_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

## 3. Configure the Backend

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=mysql+pymysql://<username>:<password>@localhost:3306/task_knowledge_db

SECRET_KEY=<generate-a-secure-secret-key>

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=120
```

> **Security:** Never commit real credentials, database passwords, JWT secrets, API keys, or `.env` files to GitHub.

---

## 5. Initialize Application Data

If the project includes the provided seed script:

```bash
python seed.py
```

---

## 6. Start the FastAPI Backend

```bash
uvicorn main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

---

## 7. Start the React Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

Start the application:

```bash
npm start
```

Frontend:

```text
http://localhost:3000
```

---

# 📸 Application Screenshots

Add screenshots of the actual running application under:

```text
docs/screenshots/
```

Recommended screenshots:

| Screen          | File            |
| --------------- | --------------- |
| Dashboard       | `dashboard.png` |
| Semantic Search | `search.png`    |
| Task Management | `tasks.png`     |
| Audit Logs      | `logs.png`      |

### Dashboard

![Dashboard Screenshot](docs/screenshots/dashboard.png)

### Semantic Search

![Semantic Search Screenshot](docs/screenshots/search.png)

### Task Management

![Task Management Screenshot](docs/screenshots/tasks.png)

### Audit Logs

![Audit Logs Screenshot](docs/screenshots/logs.png)

---

# 🧪 Testing

Run backend tests using the project's configured test framework.

Example:

```bash
pytest
```

For API testing, the interactive Swagger documentation can be used:

```text
http://localhost:8000/docs
```

Recommended validation areas:

* Authentication
* RBAC permissions
* Task CRUD operations
* Task filtering
* Document ingestion
* Semantic search
* Audit logging
* Analytics endpoints

---

# 🔄 Application Workflow

```text
                ┌─────────────┐
                │    Login    │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │ JWT Token   │
                └──────┬──────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Role Validation │
              └────────┬────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
      Admin User               Regular User
          │                         │
          ▼                         ▼
   Tasks / Documents         Tasks / Search
          │                         │
          └────────────┬────────────┘
                       ▼
                Activity Logging
                       │
                       ▼
                 Analytics
```

---

# 💡 Engineering Highlights

This project demonstrates practical implementation of several backend and full-stack engineering concepts:

* RESTful API development with FastAPI
* Stateless JWT authentication
* Role-Based Access Control
* Dependency injection
* SQLAlchemy repository and service abstractions
* Relational database design
* Database indexing
* Document processing pipelines
* Vector embeddings
* FAISS-based semantic retrieval
* React state management
* Axios API integration
* Audit logging
* Aggregation-based analytics
* Environment-based configuration
* Modular application architecture

---

# 🔮 Future Improvements

Potential extensions include:

* Redis-based caching
* Background document processing with Celery
* PostgreSQL support
* Docker and Docker Compose deployment
* CI/CD with GitHub Actions
* Automated API and integration testing
* Cloud object storage for uploaded documents
* Hybrid keyword + semantic search
* RAG-based answer generation
* Observability using structured logging and metrics
* Production deployment with Nginx and HTTPS

---

# 👨‍💻 Author

## Venkata Chandu

**Python Full-Stack Developer | Backend & AI Application Development**

I enjoy building practical software systems that combine **Python backend engineering, REST APIs, databases, modern frontend development, and AI-powered functionality**.

### Connect With Me

* 💼 **LinkedIn:** [linkedin.com/in/chandu0706](https://linkedin.com/in/chandu0706)
* 💻 **GitHub:** [github.com/venkat-0706](https://github.com/venkat-0706)
* 📧 **Email:** [chanduabbireddy247@gmail.com](mailto:chanduabbireddy247@gmail.com)

---

## ⭐ If You Find This Project Interesting

Feel free to explore the repository, review the architecture, and experiment with the API and semantic search pipeline.

If you find the project useful, consider giving the repository a ⭐.

---

### 📌 Repository Summary

**AI Task & Knowledge Engine** is a full-stack application demonstrating how **FastAPI, React, MySQL, JWT/RBAC, document processing, vector embeddings, and FAISS semantic search** can be combined into a modular enterprise-style platform for task management and knowledge retrieval.
