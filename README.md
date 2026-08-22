
# AI Task & Knowledge Management Engine

<p align="center">

**Enterprise-style AI-powered task and knowledge management platform built with FastAPI, React, MySQL, JWT authentication, RBAC, FAISS semantic search, audit logging, and operational analytics.**

</p>

<p align="center">

[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.1x-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)](https://www.mysql.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=for-the-badge\&logo=sqlalchemy\&logoColor=white)](https://www.sqlalchemy.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)](https://jwt.io/)
[![FAISS](https://img.shields.io/badge/FAISS-Vector%20Search-0467DF?style=for-the-badge)](https://github.com/facebookresearch/faiss)
[![Axios](https://img.shields.io/badge/Axios-HTTP%20Client-5A29E4?style=for-the-badge\&logo=axios\&logoColor=white)](https://axios-http.com/)
[![Git](https://img.shields.io/badge/Git-Version%20Control-F05032?style=for-the-badge\&logo=git\&logoColor=white)](https://git-scm.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/)

</p>

---

## 📌 Project Overview

**AI Task & Knowledge Management Engine** is a full-stack enterprise-style application designed to centralize task management, document knowledge retrieval, AI-assisted task generation, user access control, auditability, and operational analytics.

The system combines a **FastAPI backend** with a **React frontend** and **MySQL database**, while integrating **JWT-based authentication**, **role-based access control**, **FAISS semantic retrieval**, and **activity/audit logging**.

The project was designed with maintainability, modularity, API-first development, and real-world backend engineering practices in mind.

---

## 🎯 Why This Project?

Modern business applications often require more than basic CRUD operations.

A production-oriented task platform needs to address:

* Secure authentication
* Role-based authorization
* Task ownership and assignment
* Task lifecycle management
* Document ingestion
* Semantic document retrieval
* AI-assisted workflows
* Activity tracking
* Operational analytics
* API documentation
* Structured database access
* Frontend/backend separation

This project brings these concepts together into a single application.

---

# ✨ Key Features

## 🔐 Authentication

* User login using email and password
* Password hashing
* JWT access-token authentication
* Protected API routes
* Protected React routes
* Automatic token attachment using Axios interceptors
* Automatic logout/redirect when the API returns `401 Unauthorized`
* Active/inactive user validation

---

## 👥 Role-Based Access Control

The application supports role-based authorization.

### Supported roles

| Role    | Access                                            |
| ------- | ------------------------------------------------- |
| `admin` | Administrative operations and protected resources |
| `user`  | Standard application functionality                |

RBAC is implemented at the backend level using FastAPI dependencies.

Example authorization flow:

```text
Request
   ↓
JWT Token
   ↓
Decode Token
   ↓
Identify User
   ↓
Check Active Status
   ↓
Check Role
   ↓
Allow / Reject Request
```

Unauthorized users receive appropriate HTTP responses rather than relying only on frontend restrictions.

---

# 📋 Task Management

The task management module supports the complete task lifecycle.

### Task capabilities

* Create tasks
* View tasks
* Filter tasks
* Assign tasks
* Set priorities
* Set due dates
* Update task status
* Delete tasks
* Track task ownership
* Track task assignment

### Task statuses

```text
Pending
   ↓
In Progress
   ↓
Completed
```

### Priority levels

```text
Low
Medium
High
```

---

# 🤖 AI Task Generator

The application includes an AI-assisted task generation workflow.

Users can provide a natural-language prompt and receive a structured task preview.

### Example

```text
Prompt:

Create a high priority task to complete the backend API
documentation by 29th August.
```

The system generates structured task information:

```text
Title
Description
Priority
Due Date
```

The AI service is integrated with the application's semantic retrieval layer so that uploaded document knowledge can be used as contextual information.

---

# 📚 Document Knowledge Engine

The document module allows users to upload knowledge sources and search them semantically.

### Supported documents

* PDF
* TXT

### Processing pipeline

```text
Upload Document
      ↓
Text Extraction
      ↓
Text Chunking
      ↓
Embedding Generation
      ↓
Vector Storage
      ↓
Semantic Search
      ↓
Relevant Context
```

This creates a lightweight Retrieval-Augmented Generation-style knowledge workflow.

---

# 🔎 Semantic Search

The application uses a local vector retrieval workflow based on **FAISS**.

Instead of relying only on exact keyword matching, the system can retrieve content based on semantic similarity.

Example:

```text
User Query
     ↓
Query Embedding
     ↓
Vector Similarity Search
     ↓
Top-K Relevant Chunks
     ↓
Returned Context
```

This provides the foundation for knowledge-aware AI task generation.

---

# 📝 Audit & Activity Logging

The system maintains activity records for important user actions.

The audit log captures:

* User ID
* Action
* Action details
* Timestamp

Example actions include:

```text
DOCUMENT_UPLOAD
DOCUMENT_SEARCH
TASK_CREATE
TASK_UPDATE
TASK_DELETE
USER_ACTIVITY
```

### Audit architecture

```text
User Action
     ↓
API Endpoint
     ↓
Business Logic
     ↓
ActivityLog
     ↓
MySQL
```

This provides traceability and supports operational monitoring.

---

# 📊 Analytics

The analytics module provides operational information about the application.

Example metrics include:

* Total users
* Total tasks
* Pending tasks
* In-progress tasks
* Completed tasks
* Task distribution
* System activity

The analytics layer can be extended with additional business metrics as the application grows.

---

# 🖥️ Frontend

The frontend is implemented using React.

### Main screens

```text
Login
  ↓
Dashboard
  ├── Tasks
  ├── Documents
  ├── Analytics
  └── Audit Logs
```

### Frontend responsibilities

* User authentication
* Route protection
* API communication
* Task management UI
* Document management UI
* AI task generation
* Analytics presentation
* Audit log presentation
* Loading states
* Error handling
* Success notifications

---

# 🔗 API Client

Axios is configured as a centralized API client.

The client automatically:

1. Reads the JWT from `localStorage`
2. Adds the token to the `Authorization` header
3. Sets appropriate content types
4. Handles authentication failures
5. Redirects users to login when required

Example:

```text
Frontend Request
      ↓
Axios Interceptor
      ↓
Authorization: Bearer <JWT>
      ↓
FastAPI
      ↓
Authentication Dependency
      ↓
Protected Endpoint
```

---

# 🏗️ Backend Architecture

The backend follows a modular architecture separating responsibilities between:

```text
Routes
Schemas
Models
Services
Core
Database
```

Conceptual architecture:

```text
                    React Frontend
                          │
                          ▼
                    Axios API Client
                          │
                          ▼
                    FastAPI Router
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        Authentication             Routes
              │                       │
              ▼                       ▼
        JWT / RBAC              Business Logic
                                      │
                         ┌────────────┼────────────┐
                         ▼            ▼            ▼
                     Services      Models       Logging
                         │            │            │
                         ▼            ▼            ▼
                     FAISS         MySQL      Activity Logs
```

---

# 📁 Project Structure

```text
AI-Task-Management-Engine/
│
├── backend/
│   │
│   ├── app/
│   │   ├── core/
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   └── activity_log.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   ├── ai.py
│   │   │   └── document.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── tasks.py
│   │   │   ├── documents.py
│   │   │   ├── ai.py
│   │   │   ├── analytics.py
│   │   │   └── audit_logs.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── document_service.py
│   │   │   └── vector_service.py
│   │   │
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AuditLogs.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env
│
├── assets/
│   ├── screenshots/
│   │   ├── login.png
│   │   ├── dashboard.png
│   │   ├── tasks.png
│   │   ├── ai-task-generator.png
│   │   ├── documents.png
│   │   ├── analytics.png
│   │   ├── audit-logs.png
│   │   └── swagger.png
│   │
│   └── demo/
│       └── ai-task-manager-demo.mp4
│
├── README.md
└── .gitignore
```

---

# 🗄️ Database Design

The application uses MySQL as its relational database.

### Core entities

```text
Users
  │
  ├───────────────┐
  │               │
  ▼               ▼
Created Tasks   Assigned Tasks
  │
  ▼
Activity Logs
```

### User entity

Important fields include:

```text
id
name
email
password_hash
role
is_active
created_at
```

### Task entity

The task model tracks:

```text
id
title
description
priority
status
due_date
created_by
assigned_to
created_at
updated_at
```

### Activity Log entity

```text
id
user_id
action
details
created_at
```

---

# 🔒 Security

Security considerations implemented in the application include:

* Password hashing
* JWT authentication
* Protected routes
* Backend authorization
* Role-based access control
* Active user validation
* Token validation
* Unauthorized request handling
* Separation of authentication and authorization logic
* Environment-based configuration

Secrets and database credentials should be stored in environment variables rather than committed to Git.

---

# 📡 API Endpoints

## Authentication

```http
POST /auth/login
```

Authenticates a user and returns a JWT access token.

---

## Users

```http
POST /users/
GET /users/admin-test
```

The administrative endpoint demonstrates role-based authorization.

---

## Tasks

```http
GET    /tasks/
POST   /tasks/
PUT    /tasks/{task_id}
DELETE /tasks/{task_id}
```

---

## Documents

```http
POST /documents/upload
POST /documents/search
```

---

## AI

```http
POST /ai/generate-task
```

Example request:

```json
{
  "prompt": "Create a high priority task to complete backend API documentation by 29th August."
}
```

Example response:

```json
{
  "title": "Create a high priority task to complete backend API documentation by 29th August",
  "description": "Task generated from AI prompt",
  "priority": "medium",
  "due_date": null
}
```

---

## API Documentation

FastAPI automatically provides interactive API documentation.

Once the backend is running:

```text
http://127.0.0.1:8000/docs
```

The Swagger UI can be used to test protected and unprotected API endpoints.

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

---

# 🐍 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🗄️ Database Configuration

Create a MySQL database.

Example:

```sql
CREATE DATABASE ai_task_manager;
```

Configure the database connection in the backend environment configuration.

Example:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/ai_task_manager
```

---

# 🔐 Environment Variables

Example backend `.env`:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/ai_task_manager

SECRET_KEY=your-secret-key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Do not commit `.env` to GitHub.

---

# ▶️ Run Backend

From the backend directory:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available through the URL displayed by Vite.

---

# 🔄 Application Workflow

```text
                 ┌─────────────────┐
                 │      Login      │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   JWT Token     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    Dashboard    │
                 └────────┬────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
       Tasks         Documents         Analytics
          │               │
          │               ▼
          │         Semantic Search
          │               │
          │               ▼
          │        Knowledge Context
          │               │
          └───────► AI Task Generator
                          │
                          ▼
                    Generated Task
                          │
                          ▼
                    Activity Log
```

---

# 🧪 Testing Strategy

The application can be tested at multiple levels.

## Backend API Testing

Use Swagger UI:

```text
http://127.0.0.1:8000/docs
```

or an API client such as Postman.

Recommended test sequence:

```text
1. Create / configure users
2. Login
3. Copy JWT token
4. Authorize protected endpoints
5. Create task
6. Retrieve tasks
7. Update task
8. Delete task
9. Upload document
10. Search document
11. Generate AI task
12. Test admin endpoint
13. Verify audit logs
14. Verify analytics
```

---

# 🔐 RBAC Testing

### Admin

Expected:

```text
HTTP 200
```

Example:

```json
{
  "message": "RBAC is working",
  "user": "admin@example.com",
  "role": "admin"
}
```

### Normal User

Expected behavior:

```text
HTTP 403 Forbidden
```

for endpoints restricted to administrators.

This verifies that authorization is enforced by the backend rather than only hidden in the frontend.

---

# 📸 Application Screenshots

> Screenshots will be stored inside `assets/screenshots/`.

## Login

![Login Screen](assets/login.png)

---

## Dashboard

![Dashboard](assets/dashboard.png)

---

## Task Management

![Task Management](assets/tasks.png)

---

## AI Task Generator

![AI Task Generator](assets/ai-task-generator.png)

---


## Analytics

![Analytics Dashboard](assets/analytics.png)

---

# 🎥 Project Demo

A short end-to-end demonstration of the application is included below.

### Demo flow

```text
Login
  ↓
Dashboard
  ↓
Create Task
  ↓
Update Task
  ↓
Upload Document
  ↓
Semantic Search
  ↓
Generate AI Task
  ↓
View Analytics
  ↓
View Audit Logs
```

### Demo Video

**[▶️ Watch the Full Project Demo](assets/demo/ai-task-manager-demo.mp4)**

> If GitHub does not render the video directly in the README, the repository can additionally contain a GIF preview or a GitHub-hosted video/release link.

---

# 🧠 Engineering Highlights

This project demonstrates practical full-stack engineering concepts rather than only basic CRUD functionality.

### Backend

* FastAPI
* REST API architecture
* SQLAlchemy ORM
* Pydantic schemas
* Dependency injection
* JWT authentication
* RBAC
* Service-layer separation
* Database relationships
* Exception handling
* Activity logging

### Frontend

* React
* React Router
* Component-based architecture
* Axios
* Protected routes
* State management with React hooks
* API integration
* Form handling
* Loading/error states
* Responsive UI

### AI / Knowledge Retrieval

* Document processing
* Text extraction
* Text chunking
* Embedding generation
* Vector similarity search
* FAISS
* Context-aware task generation

### Database

* MySQL
* SQLAlchemy
* Foreign-key relationships
* User/task relationships
* Audit trail persistence

---

# 🧩 Design Principles

The project emphasizes:

### Separation of Concerns

Routes, schemas, services, models, security, and database logic are separated.

### Reusable Services

Business functionality is extracted into service modules rather than placing everything inside route handlers.

### API-First Architecture

The React frontend communicates with the backend through REST APIs.

### Secure Authorization

Authorization decisions are performed by the backend.

### Auditability

Important user activities can be recorded for traceability.

### Extensibility

The architecture allows future integrations such as:

* External LLM APIs
* Background task queues
* Redis caching
* Kafka event streaming
* Cloud object storage
* Production monitoring
* CI/CD pipelines

---

# 🚀 Future Enhancements

Potential production-level improvements include:

* Refresh-token authentication
* Password reset workflow
* Email verification
* Advanced admin dashboard
* Fine-grained permissions
* User management UI
* Pagination for large datasets
* Advanced task filtering
* Task comments
* Task attachments
* Real-time notifications
* WebSocket support
* Redis caching
* Celery/background workers
* Kafka event streaming
* Cloud document storage
* Production LLM integration
* Automated testing
* Docker containerization
* CI/CD pipeline
* Cloud deployment
* Centralized logging
* Application monitoring

---

# 📈 Scalability Considerations

The current architecture provides a foundation that can be extended for larger workloads.

A future production architecture could evolve into:

```text
                   Load Balancer
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
         FastAPI API 1         FastAPI API 2
              │                     │
              └──────────┬──────────┘
                         │
                    Redis Cache
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
           MySQL                 FAISS
              │                     │
              └──────────┬──────────┘
                         ▼
                 Background Workers
                         │
                         ▼
                  AI / Document Jobs
```

---

# 📊 Project Capabilities Summary

| Capability                | Implemented |
| ------------------------- | :---------: |
| JWT Authentication        |      ✅      |
| Protected Routes          |      ✅      |
| Role-Based Access Control |      ✅      |
| User Management           |      ✅      |
| Task CRUD                 |      ✅      |
| Task Assignment           |      ✅      |
| Task Priority             |      ✅      |
| Task Status Workflow      |      ✅      |
| Due Dates                 |      ✅      |
| Document Upload           |      ✅      |
| Text Extraction           |      ✅      |
| Text Chunking             |      ✅      |
| Vector Search             |      ✅      |
| FAISS Retrieval           |      ✅      |
| AI Task Generation        |      ✅      |
| Audit Logging             |      ✅      |
| Analytics                 |      ✅      |
| Swagger Documentation     |      ✅      |
| React Frontend            |      ✅      |
| FastAPI Backend           |      ✅      |
| MySQL Database            |      ✅      |

---

# 🛠️ Technology Stack

| Layer               | Technology         |
| ------------------- | ------------------ |
| Frontend            | React              |
| Frontend Language   | JavaScript         |
| API Client          | Axios              |
| Routing             | React Router       |
| Backend             | FastAPI            |
| Backend Language    | Python             |
| ORM                 | SQLAlchemy         |
| Validation          | Pydantic           |
| Authentication      | JWT                |
| Authorization       | RBAC               |
| Database            | MySQL              |
| Vector Search       | FAISS              |
| Document Processing | PDF/TXT processing |
| API Documentation   | Swagger / OpenAPI  |
| Version Control     | Git                |
| Repository          | GitHub             |

---

# 👨‍💻 Developer

**Chandu Cruels**

Computer Science Engineering Graduate
Python Full Stack Developer | Software Engineer

### Technical Focus

```text
Python
FastAPI
Django
React
JavaScript
SQL
MySQL
PostgreSQL
REST APIs
JWT
RBAC
AI / ML
Vector Search
Git
GitHub
```

---

# ⭐ Why This Project Matters

This project demonstrates the ability to build a complete application across multiple engineering layers:

```text
Frontend
    ↓
REST API
    ↓
Authentication
    ↓
Authorization
    ↓
Business Logic
    ↓
Database
    ↓
AI / Vector Retrieval
    ↓
Auditability
    ↓
Analytics
```

Rather than implementing an isolated feature, the project combines **authentication, authorization, CRUD workflows, database relationships, document intelligence, semantic retrieval, AI-assisted task generation, auditability, and analytics** into a single full-stack system.

---

# 📄 License

This project is intended for educational, portfolio, and demonstration purposes.

---

<p align="center">

**Built with Python, FastAPI, React, MySQL and AI**

⭐ If you found this project interesting, consider giving the repository a star.

</p>

### One change I strongly recommend

Because we haven't actually run the complete end-to-end test yet, **don't claim things like "100% tested", "production-ready", performance numbers, or coverage percentages** in the README. That can hurt credibility if a recruiter checks the repository.

Tomorrow, after we test it, we can replace the testing section with **actual Postman/Swagger results and screenshots**.

Also, your current README can use repository-relative image paths, which GitHub supports, so once you add the screenshots under `assets/screenshots/`, they will render automatically. ([GitHub Docs][2])

**For tonight, your next steps are simply:**

1. Create `README.md` in the project root.
2. Paste the README above.
3. Create the `assets/screenshots` and `assets/demo` folders.
4. Add `.env` and other secrets to `.gitignore`.
5. Push the project to GitHub.
6. **Don't worry about screenshots/video tonight.**
7. Tomorrow we'll test the application systematically and then add the actual result screenshots + demo video.

[1]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes?utm_source=chatgpt.com "About the repository README file - GitHub Docs"
[2]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax?source=post_page---------------------------&utm_source=chatgpt.com "Basic writing and formatting syntax - GitHub Docs"
