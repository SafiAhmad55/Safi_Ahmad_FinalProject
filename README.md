# AVENRIX CRM — Client Relationship Management System

A full-stack Client Relationship Management (CRM) application developed as part of the AVENRIX Technologies Full Stack Web Development Internship Capstone Project.

The application helps manage clients, projects, tasks, meetings, files, invoices, and reports through a centralized web interface.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [Features](#3-features)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Project Structure](#6-project-structure)

9. [Environment Variables](#9-environment-variables)
10. [Database Integration](#10-database-integration)
11. [Running the Application](#11-running-the-application)
12. [API Documentation](#12-api-documentation)
13. [Authentication and Authorization](#13-authentication-and-authorization)
14. [Testing](#14-testing)
15. [Screenshots](#15-screenshots)
16. [Deployment](#16-deployment)
17. [Troubleshooting](#17-troubleshooting)
18. [Security Considerations](#18-security-considerations)
19. [Future Improvements](#19-future-improvements)
20. [Project Deliverables](#20-project-deliverables)

---

## 1. Project Overview

AVENRIX CRM is a web-based application designed to organize and manage important business activities in one place.

The system provides a frontend interface built with React and Vite, a backend REST API built with Node.js and Express.js, and a MongoDB database accessed through Mongoose.

The application is intended to simplify client management, project tracking, task organization, meeting coordination, file handling, invoice management, and reporting.

## 2. Objectives

The main objectives of this project are to:

- Develop a full-stack web application using modern technologies.
- Implement communication between the frontend and backend through REST APIs.
- Store and manage application data using MongoDB.
- Implement authentication and role-based access where configured.
- Provide interfaces for managing clients, projects, tasks, meetings, files, and invoices.
- Support searching, filtering, and displaying relevant business information.
- Test application functionality and document the results.
- Prepare the application for deployment or local execution.

## 3. Features

### 3.1 Authentication

- User login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Admin and Employee roles, where configured.
- Protected API routes according to the application's authorization rules.

### 3.2 Dashboard

- Centralized application dashboard.
- Summary cards for relevant CRM information.
- Navigation between application modules.
- Overview of selected business records and statistics.

### 3.3 Client Management

- View client records.
- Create new clients.
- Update existing client information.
- Delete clients where permitted.

### 3.4 Project Management

- Create and manage projects.
- Associate projects with clients.
- Store project information such as descriptions, start dates, and deadlines.
- Track project status using the values supported by the application.

### 3.5 Task Management

- Create and update tasks.
- Track task status.
- Manage task priority.
- Organize tasks through a Kanban-style interface where available.

### 3.6 Meeting Management

- Create and manage meetings.
- View meeting information.
- Update or delete meeting records where supported.

### 3.7 File Management

- Upload files using Multer.
- Manage uploaded file records.
- Download or access files through the implemented file endpoints.

### 3.8 Invoice Management

- Create and manage invoices.
- Associate invoices with relevant clients or projects where supported.
- Calculate invoice amounts based on configured business rules.
- Track invoice statuses such as Draft, Sent, Paid, and Overdue, where implemented.
- Search or filter invoices where supported.

### 3.9 Reports

- View available reports and dashboard summaries.
- Review relevant CRM information.
- Display charts or visual summaries using the charting library configured in the project.

**Note:** The exact functionality of each module depends on the features implemented in the submitted source code.

## 4. Technology Stack

### Frontend

- React.js — user interface development.
- Vite — development server and build tool.
- Tailwind CSS — styling and responsive layouts.
- React Router — navigation, where configured.
- Axios — HTTP requests, where configured.
- Recharts or Chart.js — charts and data visualization, depending on the implementation.

### Backend

- Node.js — JavaScript runtime.
- Express.js — backend framework.
- REST APIs — communication between the frontend and backend.
- JSON Web Token (JWT) — authentication.
- bcrypt — password hashing.
- Multer — file uploads.
- Mongoose — MongoDB object modeling.

### Database

- MongoDB Atlas Free Tier — cloud database.
- MongoDB — document-oriented database.

### Development and Testing

- Visual Studio Code.
- Git and GitHub.
- Postman.
- Web browser developer tools.

## 5. System Architecture

The application follows a frontend–backend–database architecture.

```text
User
  |
  v
React + Vite Frontend
  |
  | HTTP Requests / REST APIs
  v
Node.js + Express Backend
  |
  | Mongoose
  v
MongoDB Atlas
```

### How it works

1. The user interacts with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. The backend validates requests and applies authentication and authorization rules.
4. Mongoose communicates with MongoDB Atlas.
5. The backend returns a response to the frontend.
6. The frontend displays the result to the user.

## 6. Project Structure

The following is a typical structure for this project. Actual filenames and folders may differ.

```text
AVENRIX-CRM/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── screenshots/
├── API_DOCUMENTATION.md
├── TESTING_REPORT.md
└── README.md
```

Adjust this structure to match the folders and files actually present in your repository. Do not create empty folders just to match this example.





## 9. Environment Variables

The following example lists common backend environment variables.

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Backend server port | `5001` |
| `MONGO_URI` | MongoDB connection string | Set privately in `.env` |
| `JWT_SECRET` | Secret used for JWT signing and verification | Set privately in `.env` |

Your actual environment variables may differ.

### Example `.env.example`

```env
PORT=5001
MONGO_URI=
JWT_SECRET=
```

Commit `.env.example` to GitHub, but never commit your real `.env` file or secret values.

## 10. Database Integration

The application uses MongoDB Atlas for cloud database storage and Mongoose for database operations.

MongoDB stores application records according to the models implemented in the backend.

### Database integration workflow

1. The backend loads the MongoDB connection string from its environment variables.
2. Mongoose establishes the database connection.
3. Backend API routes process incoming requests.
4. Models perform the required database operations.
5. The API returns the operation result to the frontend.

### Database verification

To verify the integration:

1. Start the backend.
2. Confirm that the MongoDB connection succeeds.
3. Create a test client or project through the application.
4. Check the corresponding MongoDB Atlas collection.
5. Confirm that the record exists.
6. Refresh the application and verify that the saved record can be retrieved.

Record the actual results in `TESTING_REPORT.md`.

## 11. Running the Application

### Start the backend

From the backend directory, run the development command defined in `package.json`. For example:

```bash
npm run dev
```

If this script does not exist, use the appropriate command from the available package scripts.

The backend should start on the configured port, such as `5001`.

### Start the frontend

From the frontend directory, run:

```bash
npm run dev
```

Vite will display the local development URL in the terminal, commonly:

```text
http://localhost:5173
```

Open the URL displayed by your terminal in a browser.

### API configuration

The frontend must send API requests to the correct backend address.

If the project uses a Vite environment variable, it may be configured as:

```env
VITE_API_URL=http://localhost:5001/api
```

Only add this variable if your frontend code uses it. Otherwise, follow the API configuration already implemented in the source code.

## 12. API Documentation

The backend exposes REST API endpoints for the implemented CRM modules.

**Local base URL:** `http://localhost:5001/api`

The following table describes common endpoint patterns. Verify the actual routes in your Express route files before relying on this list.

| Module | Common operations |
|---|---|
| Authentication | Login and token generation |
| Clients | Create, read, update, and delete clients |
| Projects | Create, read, update, and delete projects |
| Tasks | Create, read, update, and delete tasks |
| Meetings | Create, read, update, and delete meetings |
| Files | Upload and manage files |
| Invoices | Create, read, update, and delete invoices |
| Reports | Retrieve report or summary data where implemented |

For complete endpoint paths, request parameters, request bodies, response examples, and authentication requirements, see `API_DOCUMENTATION.md`.

### Testing API endpoints

Use Postman to:

1. Send a login request.
2. Obtain the JWT token returned by the backend.
3. Include the token in the `Authorization` header for protected endpoints.
4. Test the supported CRUD operations.
5. Record response codes and actual results.

Example authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Do not publish real authentication tokens in screenshots or documentation.

## 13. Authentication and Authorization

The backend uses JWT authentication and bcrypt password hashing, according to the configured implementation.

- JWT tokens are used to authenticate protected requests.
- Passwords should be stored as hashes rather than plaintext.
- Role-based authorization restricts access according to the configured user roles and permissions.
- Invalid or missing tokens should be handled by the authentication middleware.

Verify that Admin and Employee permissions work correctly before claiming authorization testing is complete.

## 14. Testing

Testing is used to verify that the application behaves as expected.

### Main test areas

| Test ID | Feature | Verification |
|---|---|---|
| TC-01 | Login | Verify valid login credentials |
| TC-02 | Authorization | Verify role permissions |
| TC-03 | Clients | Create and update a client |
| TC-04 | Projects | Create a project linked to a client |
| TC-05 | Tasks | Create and update a task |
| TC-06 | Meetings | Create and delete a meeting |
| TC-07 | Files | Test file upload and retrieval |
| TC-08 | Invoices | Verify invoice creation and calculations |
| TC-09 | Invoice Status | Verify supported invoice statuses |
| TC-10 | Reports | Verify displayed report information |
| TC-11 | Search and Filters | Verify matching records |
| TC-12 | Responsive Layout | Test desktop and mobile usability |

### Testing evidence

Save genuine screenshots of important tests in the `screenshots/` directory.

Include evidence such as:

- Successful login.
- Dashboard display.
- Client or project records.
- MongoDB Atlas documents.
- Successful Postman responses.
- Invoice details and calculations.
- Relevant error handling or validation results.

Document actual results and mark each test as Passed, Failed, Partial, or Not Tested as appropriate.

Refer to `TESTING_REPORT.md` for the detailed test results.

## 15. Screenshots

Add actual screenshots of the application to the `screenshots/` directory.

Example:

```text
screenshots/
├── dashboard.png
├── clients.png
├── projects.png
├── tasks.png
├── meetings.png
├── invoices.png
|── file.png
├── database.png

```

Include only screenshots that exist in your project.

To display a screenshot in this README, use:

```markdown
![CRM Dashboard](screenshots/dashboard.png)
```


## 16. Deployment

The application may be deployed using free hosting services where available.

### Frontend deployment

Vercel is a possible hosting option for the React/Vite frontend.

### Backend deployment

Render is a possible hosting option for the Node.js/Express backend.

### Database deployment

The application uses MongoDB Atlas as its configured cloud database. Ensure the deployed backend has network access to Atlas and uses valid credentials.


## 17. Troubleshooting

### MongoDB connection error

- Check the `MONGO_URI` value.
- Confirm the database username and password.
- Check MongoDB Atlas network access settings.
- Verify that the backend loads environment variables correctly.

### Backend does not start

- Confirm that Node.js is installed.
- Run `npm install` in the backend directory.
- Check the scripts in `package.json`.
- Review the terminal error message.
- Confirm that the configured port is available.

### Frontend cannot reach the backend

- Confirm that the backend is running.
- Verify the API base URL.
- Check browser developer tools for failed network requests.
- Confirm CORS settings if the frontend and backend use different origins.

### Unauthorized or forbidden responses

- Confirm that a valid JWT token is being sent.
- Check the token verification secret.
- Verify the user's role and route authorization middleware.

### File upload problems

- Check the Multer configuration.
- Verify the expected upload field name.
- Check file size and type restrictions, if configured.
- Confirm how uploaded files are stored and served.

## 18. Security Considerations

- Never commit `.env` files or database credentials.
- Use strong, private JWT secrets.
- Store passwords as secure hashes.
- Validate incoming request data.
- Apply authentication and authorization to protected routes.
- Configure CORS appropriately for the deployed frontend.
- Avoid exposing sensitive information in API responses.
- Configure database network access carefully.
- Review dependencies and address security vulnerabilities where possible.

## 19. Future Improvements

Potential improvements include:

- More comprehensive automated testing.
- Improved mobile responsiveness.
- Enhanced reporting and analytics.
- More detailed role and permission management.
- Improved file storage and management.
- Additional input validation and error handling.
- Continuous integration and deployment.
- Further performance and security improvements.

These are potential future enhancements and are not claims about currently implemented features.

## 20. Project Deliverables

The final submission should include the following items, as applicable to the internship instructions:

- Frontend source code.
- Backend source code.
- README with setup and execution instructions.
- `.env.example` without secret values.
- API documentation.
- Testing report with actual results.
- Postman collection.
- Screenshots of major application modules.
- GitHub repository link.
- Working deployment URLs, if available.
- Final project presentation or live demonstration.

### Conclusion

AVENRIX CRM brings essential client and project management activities together in a full-stack web application using React, Node.js, Express.js, and MongoDB Atlas.

The project demonstrates the integration of a web frontend, REST APIs, database operations, authentication, and CRM management features. Final functionality and testing results should be confirmed against the submitted source code.


