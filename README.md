# ProjectFlow — Mini Project Management System

A full-stack project and task management app built with Node.js/Express, React, and MongoDB.

## Stack

- **Backend:** Node.js, Express, Mongoose
- **Frontend:** React, React Router, react-hot-toast
- **Database:** MongoDB

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── middleware/      # Validation + error handling
│   │   ├── config/         # DB connection
│   │   ├── utils/          # Seed script
│   │   └── app.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/            # API client
    │   ├── components/     # UI, project, task components
    │   ├── pages/          # Route-level pages
    │   └── index.css       # Global styles + design tokens
    └── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### Backend

```bash
cd backend
cp .env.example .env        # edit MONGODB_URI if needed
npm install
npm run dev                 # starts on :5000
```

Optional — seed sample data:

```bash
npm run seed
```

### Frontend

```bash
cd frontend
cp .env.example .env        # set REACT_APP_API_URL if backend isn't on :5000
npm install
npm start                   # starts on :3000
```

## Environment Variables

### Backend `.env`

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/project_mgmt` | MongoDB connection string |
| `NODE_ENV` | `development` | Environment |

### Frontend `.env`

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000` | Backend base URL |

## API Reference

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects?page=1&limit=10` | List projects (paginated) |
| `POST` | `/projects` | Create project |
| `GET` | `/projects/:id` | Get project by ID |
| `DELETE` | `/projects/:id` | Delete project + its tasks |

**POST /projects body:**
```json
{
  "name": "Website Redesign",
  "description": "Optional description"
}
```

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects/:project_id/tasks` | List tasks (filter + sort) |
| `POST` | `/projects/:project_id/tasks` | Create task |
| `PUT` | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |

**Query params for GET tasks:**
- `status` — filter by `todo`, `in-progress`, or `done`
- `sort` — `due_date` to sort ascending by due date
- `page`, `limit` — pagination

**POST /projects/:id/tasks body:**
```json
{
  "title": "Design mockups",
  "description": "Figma wireframes for all screens",
  "status": "todo",
  "priority": "high",
  "due_date": "2025-06-01"
}
```

**PUT /tasks/:id body** (all fields optional):
```json
{
  "status": "in-progress",
  "priority": "medium"
}
```

### Error Responses

All errors return JSON:
```json
{ "error": "Description of what went wrong" }
```

Common status codes: `400` (validation), `404` (not found), `409` (conflict), `500` (server error).

## Features

- Paginated project listing
- Task filtering by status
- Task sorting by due date
- Overdue task highlighting
- Inline status/priority updates
- Confirmation modals before deletion
- Cascading delete (removing a project deletes its tasks)
- Toast notifications
- Responsive layout
