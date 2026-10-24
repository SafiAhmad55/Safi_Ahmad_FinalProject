# API Documentation — AVENRIX CRM

## 1. Overview

The AVENRIX CRM backend provides REST APIs for authentication and customer relationship management, including clients, projects, tasks, meetings, file management, invoices, and reports.

**Base URL (local):**
`http://localhost:5001/api`

**Technology Stack:**
- Node.js and Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcrypt password hashing
- Multer file uploads

## 2. Authentication

Protected endpoints require a valid JWT token.

**Authorization header:**
`Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a user, if supported | Verify route |
| POST | `/auth/login` | Log in and obtain a token | No |
| GET | `/auth/me` | Get the current user, if supported | Yes |

### Login example

**Request:**
```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Expected response:** A successful response containing the authentication token and relevant user information. The exact response structure depends on the implementation.

## 3. Clients

| Method | Endpoint | Description |
|---|---|---|
| GET | `/clients` | Retrieve clients |
| GET | `/clients/:id` | Retrieve one client |
| POST | `/clients` | Create a client |
| PUT | `/clients/:id` | Update a client |
| DELETE | `/clients/:id` | Delete a client |

**Example create-client request:**

```json
{
  "name": "Example Client",
  "email": "client@example.com",
  "phone": "03001234567"
}
```

Use the field names required by your actual client schema.

## 4. Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | Retrieve projects |
| GET | `/projects/:id` | Retrieve project details |
| POST | `/projects` | Create a project |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |

Projects may contain client references, start dates, deadlines, descriptions, and statuses such as Planning, In Progress, On Hold, and Completed. Verify the actual schema and allowed values in your code.

## 5. Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve tasks |
| GET | `/tasks/:id` | Retrieve one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

Task records may include a title, description, priority, due date, and status. Confirm the accepted fields and status values in your task model.

## 6. Meetings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/meetings` | Retrieve meetings |
| GET | `/meetings/:id` | Retrieve one meeting, if supported |
| POST | `/meetings` | Create a meeting |
| PUT | `/meetings/:id` | Update a meeting |
| DELETE | `/meetings/:id` | Delete a meeting |

The meetings module supports meeting management. Confirm the exact route definitions in your Express router.

## 7. File Management

The application supports file uploads using Multer.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/files` | Upload a file, if this is the configured route |
| GET | `/files` | Retrieve file records, if supported |
| GET | `/files/:id` | Retrieve or download a file, depending on implementation |
| DELETE | `/files/:id` | Delete a file, if supported |

**Note:** File routes and upload field names must match the actual Multer configuration. Use `multipart/form-data` for file uploads.

## 8. Invoices

| Method | Endpoint | Description |
|---|---|---|
| GET | `/invoices` | Retrieve invoices |
| GET | `/invoices/:id` | Retrieve one invoice |
| POST | `/invoices` | Create an invoice |
| PUT | `/invoices/:id` | Update an invoice |
| DELETE | `/invoices/:id` | Delete an invoice |

Invoice functionality includes invoice details, line items, totals, and statuses such as Draft, Sent, Paid, and Overdue, where implemented.

The backend should validate invoice data and calculate totals according to its implemented business rules.

## 9. Reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reports` | Retrieve report data, if implemented |
| GET | `/reports/summary` | Retrieve summary data, if implemented |

Report endpoints must be confirmed against the actual backend. Some dashboards calculate summaries using several existing endpoints instead of dedicated report routes.

## 10. Common HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request data |
| 401 | Authentication required or token invalid |
| 403 | Access denied |
| 404 | Resource or endpoint not found |
| 500 | Internal server error |

Actual status codes depend on the backend implementation.

## 12. Environment Configuration

Creating a backend `.env` file using `.env.example` as a template. Configure the MongoDB connection string, JWT secret, port, and any other variables required by the code.
