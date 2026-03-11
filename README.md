# LMS Project (Admin + Learner)

A Learning Management System based on Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT-based login for Admin and Learners.
- **Admin Dashboard**: Overview of total users, courses, and classes.
- **User Management**: Admin can manage users (CRUD).
- **Course Management**: Admin can manage courses, sections, and lessons.
- **Class Management**: Admin can create classes, assign courses, and assign users.
- **Learning Pathway**: Admin can create sequences of courses for specific goals.
- **Learner System**: 
  - Course Catalog (View public courses).
  - My Learning (Track enrolled courses).
  - Learning Player (Access lessons and videos).
  - Assigned Pathways (Follow guided learning paths).

## Tech Stack
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Security: bcrypt, JWT

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` file with your MongoDB URI and JWT secret.
3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Admin (Requires Admin Role)
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `POST /api/admin/courses/:id/sections`
- `POST /api/admin/courses/sections/:sectionId/lessons`
- `GET /api/admin/classes`
- `POST /api/admin/classes`
- `GET /api/admin/pathways`
- `POST /api/admin/pathways`

### Learner
- `GET /api/learner/catalog`
- `GET /api/learner/course/:id`
- `GET /api/learner/my-courses`
- `POST /api/learner/enroll/:id`
- `GET /api/learner/pathways`
