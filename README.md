# Campus Connect - Campus Event and Workshop Management System

Campus Connect is a full-stack campus platform built to manage technical and academic events.
It supports separate student and admin experiences with secure authentication, event lifecycle control, and MongoDB-backed persistence.

## Links
Frontend - https://campus-connect-brown-five.vercel.app/login
Backend - https://campus-connect-server-one.vercel.app/
## NOTE - TO ACCESS ADMIN INTERFACE, THE USER CREDENTIALS ARE - 
## EMAIL - amlanshanker2005@gmail.com
## PASSWORD - amlan2005amlan

## Project Overview

Campus Connect enables:

- Student account registration and login
- Admin account login and event management
- Event discovery with search, filter, and sort
- Event creation, update, lifecycle transitions, and deletion
- Real-time seat availability updates
- Registration tracking and statistics

The system follows RESTful architecture using React frontend and Express backend with MongoDB Atlas.

## Features

### Authentication and Authorization

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Roles: student and admin
- Protected APIs using Bearer token

### Event Management

- Create event
- Update event
- Delete event
- View event details
- Event lifecycle transitions:
  - draft
  - published
  - registration_open
  - closed
  - event_completed

### Event Validation

Server-side validations include:

- Event name is required
- Event type is required
- Resource person is required
- Event date is required
- Past dates are not allowed
- Venue is required
- Maximum participants must be a positive integer

### Dynamic Event Operations

Supports combinable filters and sorting without page reload:

- Search by event name, resource person, venue
- Filter by event type
- Filter by registration status
- Filter by lifecycle status
- Sort by upcoming events
- Sort by event name
- Sort by available seats

### Registration Logic

- Student can register only when lifecycle is registration_open
- Duplicate registration by same student is blocked
- Registration blocked when seats are full
- Seat count updates dynamically after successful registration
- Registration records are stored in dedicated registration collection

### Registration Statistics

- Total registrations
- Registration distribution by event type
- Event-level registration stats for admin dashboard

## Technology Stack

| Technology    | Purpose                         |
| ------------- | ------------------------------- |
| React         | Frontend UI                     |
| Vite          | Frontend build and dev server   |
| Tailwind CSS  | Styling and responsiveness      |
| Axios         | API communication               |
| Node.js       | Backend runtime                 |
| Express.js    | REST API server                 |
| MongoDB Atlas | Database                        |
| Mongoose      | ODM for MongoDB                 |
| JWT           | Authentication                  |
| bcrypt        | Password hashing                |
| nodemon       | Development server auto-restart |

## Project Structure

```text
Campus_Connect/
|
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   ├── eventApi.js
│   │   │   ├── registrationApi.js
│   │   │   └── http.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
|
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── account.js
│   │   ├── events.js
│   │   └── registration.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── utils/
│   │   ├── db.js
│   │   └── eventUtils.js
│   ├── .env
│   ├── index.js
│   └── package.json
|
└── .gitignore
```

## RESTful API

### Authentication APIs

Register user  
POST /api/auth/register

Example request:

```json
{
  "name": "Amlan Shanker",
  "email": "amlan@example.com",
  "password": "password123",
  "role": "student"
}
```

Login user  
POST /api/auth/login

Example request:

```json
{
  "email": "amlan@example.com",
  "password": "password123"
}
```

### Event APIs

- GET /api/events
- GET /api/events/:eventId
- POST /api/events (admin)
- PATCH /api/events/:eventId (admin)
- PATCH /api/events/:eventId/lifecycle (admin)
- DELETE /api/events/:eventId (admin)
- POST /api/events/:eventId/register (student)
- GET /api/events/stats/registrations (admin)

### Registration APIs

- GET /api/registrations
- GET /api/registrations/stats (admin)

## MongoDB Database Design

Database uses MongoDB Atlas with collections:

- accounts
- events
- registrations

### Account Document

```json
{
  "name": "Amlan Shanker",
  "email": "amlan@example.com",
  "password": "hashed_password",
  "role": "student"
}
```

### Event Document

```json
{
  "eventName": "Full Stack Workshop",
  "eventType": "Technical",
  "resourcePerson": "John Doe",
  "description": "Hands-on workshop",
  "eventDate": "2026-09-15T00:00:00.000Z",
  "venue": "Seminar Hall A",
  "maxParticipants": 100,
  "registeredCount": 45,
  "lifecycleStatus": "registration_open"
}
```

### Registration Document

```json
{
  "studentId": "66d0f7f4a0123456789abcd1",
  "eventId": "66d0f7f4a0123456789abcd2",
  "eventDetails": {
    "eventName": "Full Stack Workshop",
    "eventType": "Technical",
    "resourcePerson": "John Doe",
    "eventDate": "2026-09-15T00:00:00.000Z",
    "venue": "Seminar Hall A"
  }
}
```

## Authentication Flow

```text
User Register or Login
        |
        v
Password Hashing and Verification
        |
        v
JWT Token Issued
        |
        v
Token Stored in Frontend Session
        |
        v
Axios sends Authorization: Bearer token
        |
        v
Protected REST APIs
```

## Application Architecture

```text
+----------------------------+
|     React Frontend         |
|  Vite + Tailwind + Axios   |
+-------------+--------------+
              |
              | HTTP / REST
              v
+----------------------------+
|     Express Backend        |
|  Auth + Events + Register  |
+-------------+--------------+
              |
              | Mongoose
              v
+----------------------------+
|       MongoDB Atlas        |
+----------------------------+
```

## Installation and Setup

### 1. Clone Repository

```bash
git clone <your_repository_url>
cd Campus_Connect
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create server environment file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Start backend:

```bash
npm run dev
```

Backend runs at:
https://campus-connect-server-one.vercel.app/

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Create frontend environment file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:
https://campus-connect-brown-five.vercel.app/login

## Deployment

You can deploy:

- Frontend on Vercel or Netlify
- Backend on Render, Railway, or Vercel serverless
- Database on MongoDB Atlas

## API Testing

You can test APIs using:

- Postman
- Thunder Client
- Insomnia
- Frontend Axios integration

## Project Objective

Campus Connect demonstrates practical implementation of:

- RESTful API design
- Full-stack role-based application
- MongoDB data modeling
- Secure authentication and authorization
- Real-time event and registration workflow for campus use

## Author

Amlan Shanker
MCA - Computer Applications

## License

This project is intended for academic and educational use.
