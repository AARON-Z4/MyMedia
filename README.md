# ProjectFlow

> A full-stack Mini Project Management System — Node.js/Express backend, React frontend, MongoDB database.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Projects](#projects)
  - [Tasks](#tasks)
  - [Filtering, Sorting & Pagination](#filtering-sorting--pagination)
  - [Error Handling](#error-handling)
- [Data Schemas](#data-schemas)
- [Postman Collection](#postman-collection)
- [API Documentation](#api-documentation)
- [Docker](#docker)

---

## Features

| Feature | Details |
|---|---|
| **Project CRUD** | Create, list, get by ID, delete (with cascading task deletion) |
| **Task CRUD** | Create, list, update, delete tasks scoped to a project |
| **Pagination** | `?page=1&limit=10` on both project and task listings |
| **Status Filtering** | Filter tasks by `todo` / `in-progress` / `done` |
| **Due Date Sorting** | Sort tasks by `due_date` ascending |
| **Input Validation** | `express-validator` on all POST/PUT bodies |
| **Error Handling** | Consistent JSON error envelope across all endpoints |
| **In-memory DB fallback** | Auto-starts an in-memory MongoDB if no local instance is found — no setup needed for demos |
| **Toast notifications** | Real-time feedback on all create/delete actions |
| **Cascading delete** | Removing a project deletes all its tasks |
| **Responsive UI** | Mobile-friendly React frontend |

---

## Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Database:** MongoDB + Mongoose
- **Validation:** express-validator
- **Dev server:** nodemon
- **Demo fallback:** mongodb-memory-server

### Frontend
- **Framework:** React 18 (Create React App)
- **Routing:** React Router v6
- **HTTP client:** Axios
- **Notifications:** react-hot-toast
- **Styling:** CSS Modules

---

## Project Structure

```
project-mgmt/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express app entry point
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection (with in-memory fallback)
│   │   ├── controllers/
│   │   │   ├── projects.js         # Project route handlers
│   │   │   └── tasks.js            # Task route handlers
│   │   ├── middleware/
│   │   │   ├── validate.js         # express-validator rules
│   │   │   └── errorHandler.js     # Global error handler
│   │   ├── models/
│   │   │   ├── project.js          # Project Mongoose schema
│   │   │   └── task.js             # Task Mongoose schema
│   │   ├── routes/
│   │   │   ├── projects.js         # /projects router
│   │   │   └── tasks.js            # /tasks router
│   │   └── utils/
│   │       └── seed.js             # Optional seed script
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/                    # Axios API client
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/
│   │   │   ├── ProjectsPage.js     # Projects listing
│   │   │   └── ProjectDetailPage.js# Project detail + tasks
│   │   ├── App.js
│   │   └── index.css               # Global styles + design tokens
│   ├── .env.example
│   └── Dockerfile
│
├── API_DOCS.html                   # Standalone API documentation (open in browser)
├── ProjectFlow.postman_collection.json
├── ProjectFlow.postman_environment.json
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** running locally — OR skip this entirely (the backend will auto-start an in-memory MongoDB for demo/development)

### 1. Clone the Repository

```bash
git clone https://github.com/AARON-Z4/MyMedia.git
cd MyMedia
```

### 2. Backend

```bash
cd backend
cp .env.example .env      # edit MONGODB_URI if you have MongoDB installed
npm install
npm run dev               # starts on http://localhost:5000
```

> **No MongoDB?** No problem — the server detects a missing local instance and automatically starts an in-memory MongoDB. All API features work identically.

Optional — seed sample data:

```bash
npm run seed
```

### 3. Frontend

Open a new terminal:

```bash
cd frontend
cp .env.example .env      # set REACT_APP_API_URL if backend isn't on :5000
npm install
npm start                 # starts on http://localhost:3000
```

Visit **http://localhost:3000** — the app should be fully functional.

---

## Environment Variables

### Backend `.env`

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server listening port |
| `MONGODB_URI` | `mongodb://localhost:27017/project_mgmt` | MongoDB connection string |
| `NODE_ENV` | `development` | Environment mode |

### Frontend `.env`

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000` | Backend base URL |

---

## API Reference

**Base URL:** `http://localhost:5000`

All request bodies must be `Content-Type: application/json`. All responses are JSON.

---

### Projects

#### `POST /projects`

Create a new project.

**Request body:**

```json
{
  "name": "Website Redesign",
  "description": "Full company website overhaul"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✅ Yes | Cannot be empty |
| `description` | string | No | Defaults to `""` |

**Response `201 Created`:**

```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "name": "Website Redesign",
  "description": "Full company website overhaul",
  "created_at": "2026-04-10T08:00:00.000Z"
}
```

---

#### `GET /projects`

List all projects — paginated, sorted by newest first.

**Query params:**

| Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `10` | Items per page (max: 100) |

```
GET /projects?page=1&limit=10
```

**Response `200 OK`:**

```json
{
  "data": [ { "_id": "...", "name": "...", "description": "...", "created_at": "..." } ],
  "pagination": { "page": 1, "limit": 10, "total": 3, "pages": 1 }
}
```

---

#### `GET /projects/:id`

Fetch a single project by its MongoDB `_id`.

**Response `200 OK`:** Project object  
**Response `404`:** `{ "error": "Project not found" }`

---

#### `DELETE /projects/:id`

Delete a project **and all its tasks** (cascading delete).

**Response `200 OK`:** `{ "message": "Project deleted" }`  
**Response `404`:** `{ "error": "Project not found" }`

---

### Tasks

#### `POST /projects/:project_id/tasks`

Create a task under a project.

**Request body:**

```json
{
  "title": "Design Mockups",
  "description": "Figma wireframes for all screens",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-06-15"
}
```

| Field | Type | Required | Allowed Values | Default |
|---|---|---|---|---|
| `title` | string | ✅ Yes | Any non-empty string | — |
| `description` | string | No | Any string | `""` |
| `status` | enum | No | `todo` · `in-progress` · `done` | `todo` |
| `priority` | enum | No | `low` · `medium` · `high` | `medium` |
| `due_date` | ISO 8601 | No | e.g. `2026-06-15` | `null` |

**Response `201 Created`:** Full task object  
**Response `400`:** Validation error details  
**Response `404`:** `{ "error": "Project not found" }`

---

#### `GET /projects/:project_id/tasks`

List tasks for a project — supports filtering, sorting, and pagination.

**Query params:**

| Param | Description |
|---|---|
| `status` | Filter: `todo` · `in-progress` · `done` |
| `sort` | Pass `due_date` to sort ascending by due date |
| `page` | Page number (default: `1`) |
| `limit` | Items per page (default: `20`, max: `100`) |

```bash
# Filter by status
GET /projects/:id/tasks?status=in-progress

# Sort by due date
GET /projects/:id/tasks?sort=due_date

# Combine all
GET /projects/:id/tasks?status=todo&sort=due_date&page=1&limit=10
```

**Response `200 OK`:** Paginated task list (same `{ data, pagination }` envelope)

---

#### `PUT /tasks/:id`

Update any fields of a task. All fields are optional — send only what you want to change.

```json
{
  "status": "in-progress",
  "priority": "medium",
  "due_date": "2026-07-01"
}
```

**Response `200 OK`:** Updated task object  
**Response `400`:** Validation error  
**Response `404`:** `{ "error": "Task not found" }`

---

#### `DELETE /tasks/:id`

Delete a single task.

**Response `200 OK`:** `{ "message": "Task deleted" }`  
**Response `404`:** `{ "error": "Task not found" }`

---

### Filtering, Sorting & Pagination

All three features can be combined in a single request:

```
GET /projects/{id}/tasks?status=todo&sort=due_date&page=1&limit=5
```

| Feature | Query Param | Example |
|---|---|---|
| Filter by status | `?status=` | `?status=in-progress` |
| Sort by due date | `?sort=due_date` | earliest deadline first |
| Paginate | `?page=&limit=` | `?page=2&limit=5` |

---

### Error Handling

All errors return a consistent JSON envelope:

```json
{
  "error": "Human-readable message",
  "details": [
    { "msg": "Name is required", "path": "name", "location": "body" }
  ]
}
```

> `details` is only present on validation errors (`400`).

| Status | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Validation failed / Invalid ID format |
| `404` | Resource not found |
| `409` | Conflict (duplicate entry) |
| `500` | Internal server error |

---

## Data Schemas

### Project

```json
{
  "_id":         "MongoDB ObjectId",
  "name":        "string — required",
  "description": "string — optional, default: \"\"",
  "created_at":  "ISO 8601 — auto-set"
}
```

### Task

```json
{
  "_id":         "MongoDB ObjectId",
  "project_id":  "ObjectId — ref: Project",
  "title":       "string — required",
  "description": "string — optional, default: \"\"",
  "status":      "todo | in-progress | done   (default: todo)",
  "priority":    "low | medium | high          (default: medium)",
  "due_date":    "ISO 8601 | null",
  "created_at":  "ISO 8601 — auto-set"
}
```

---

## Postman Collection

Two files are included in the root of this repository:

| File | Purpose |
|---|---|
| `ProjectFlow.postman_collection.json` | All 8 endpoints with test scripts, example responses, and validation error cases |
| `ProjectFlow.postman_environment.json` | Environment variables (`base`, `projectId`, `taskId`) |

### How to import

1. Open **Postman** → **Import**
2. Import both `.json` files
3. Select **ProjectFlow Local** from the environment dropdown (top-right)
4. Run **Create Project** first → `projectId` is auto-saved to the environment
5. Run **Create Task** → `taskId` is auto-saved
6. All downstream requests use these variables automatically

### Included requests

| Folder | Request |
|---|---|
| 🩺 Health | `GET /health` |
| 📁 Projects | Create, List (paginated), List page 2, Get by ID, Delete |
| ✅ Tasks | Create, List all, Filter by `todo`/`in-progress`/`done`, Sort by `due_date`, Filter+Sort+Paginate combined, Update, Delete |
| ⚠️ Error Cases | 404 project, 400 missing name, 400 invalid status/priority, 404 unknown route |

---

## API Documentation

A fully interactive HTML API reference is included:

```
API_DOCS.html
```

Open it directly in any browser (no server required):

```bash
# Windows
start API_DOCS.html

# Mac
open API_DOCS.html

# Linux
xdg-open API_DOCS.html
```

### Documentation includes

- All 8 endpoints with request/response examples
- Syntax-highlighted JSON code blocks with **Copy** buttons
- Color-coded HTTP method badges
- Query parameter tables for filtering, sorting, and pagination
- Full error response reference
- Data schema definitions
- Active sidebar navigation with scroll highlighting

---

## Docker

A `docker-compose.yml` is included to run the full stack (backend + frontend + MongoDB) in containers.

```bash
docker-compose up --build
```

| Service | Port |
|---|---|
| Backend | `5000` |
| Frontend | `3000` |
| MongoDB | `27017` |

Individual Dockerfiles are also available in `backend/` and `frontend/` for building each service separately.
