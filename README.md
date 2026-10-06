**# Daily Executive Activity Tracker**

A full-stack web application for executives to record their daily field activities and for administrators to monitor executive performance.

**## 1. Technology Stack**

**### Frontend**
\- React.js
\- Vite
\- Bootstrap
\- Axios

**### Backend**
\- Node.js
\- Express.js
\- JWT Authentication

**### Database**
\- MongoDB Atlas
\- Mongoose

**### Development Tools**
\- Visual Studio Code
\- Postman
\- Git / GitHub

\---

**## 2. Why These Technologies Were Selected**

**### React.js**
React was selected to build a responsive and component-based user interface.

**### Vite**
Vite provides a fast development environment for the React application.

**### Bootstrap**
Bootstrap was used to create a clean and responsive interface with less custom CSS.

**### Node.js and Express.js**
Node.js and Express.js were selected to build the REST API and backend services efficiently using JavaScript.

**### MongoDB**
MongoDB was selected because the application contains activity records with flexible fields and MongoDB works well with JavaScript-based applications.

**### Mongoose**
Mongoose is used to define database schemas and communicate with MongoDB from the Node.js backend.

**### JWT**
JWT is used for secure user authentication and authorization.

**### Axios**
Axios is used by the React frontend to communicate with the backend REST APIs.

\---

**## 3. Application Architecture**

The application follows a simple three-layer architecture:

React Frontend
        |
        | HTTP / REST API
        ↓
Node.js + Express Backend
        |
        | Mongoose
        ↓
MongoDB Atlas

**### Frontend**
The React application provides:
\- Login
\- Executive Dashboard
\- Add Activity
\- Edit Activity
\- Delete Activity
\- Activity History
\- Admin Dashboard
\- Activity filters

**### Backend**
The Express backend provides REST APIs for:
\- Authentication
\- Activity management
\- Executive dashboard statistics
\- Admin dashboard statistics
\- Executive activity viewing
\- Activity update and deletion
\- Admin authorization

**### Database**
MongoDB stores:
\- User information
\- Executive information
\- Daily activity records

\---

**## 4. Main Features**

**### Executive**

Executives can:

\- Login securely
\- Add daily activities
\- Edit their own activities
\- Delete their own activities
\- View activity history
\- View today's visits
\- View total cases
\- View sales amount
\- View collection amount
\- View pending follow-ups
\- Logout securely

**### Admin**

Administrators can:

\- Login as administrator
\- View total executives
\- View executives updated today
\- View executives who have not updated today
\- View today's visits
\- View total cases
\- View sales
\- View collection
\- Select an executive
\- View selected executive activities
\- Filter activities by date
\- Filter activities by dealer/customer
\- Clear filters
\- View executive update status

\---

**## 5. Daily Activity Fields**

Each activity contains:

\- Date
\- Dealer / Customer Name
\- Location
\- Visit / Activity
\- Order / Cases
\- Sales Amount
\- Collection Amount
\- Remarks
\- Next Follow-up

\---

**## 6. Database Structure**

**### User Collection**

Fields:

\- name
\- email
\- password
\- role
\- createdAt
\- updatedAt

Roles:

\- executive
\- admin

**### Activity Collection**

Fields:

\- executive
\- date
\- dealerName
\- location
\- activity
\- cases
\- salesAmount
\- collectionAmount
\- remarks
\- nextFollowUp
\- createdAt
\- updatedAt

The \`executive\` field connects each activity with the user who created it.

\---

**## 7. Authentication**

The application uses JWT-based authentication.

After successful login:

1\. Backend verifies the email and password.
2\. Backend generates a JWT token.
3\. Frontend stores the token.
4\. The token is sent with protected API requests.
5\. Backend verifies the token before allowing access.

Admin-only dashboard APIs also use role-based authorization.

**### Authentication Flow**

User Login
        |
        ↓
React Login Form
        |
        ↓
POST /api/auth/login
        |
        ↓
Express Backend
        |
        ↓
Verify Email & Password
        |
        ↓
Generate JWT Token
        |
        ↓
React Stores Token
        |
        ↓
Protected API Requests

\---

**## 8. Authorization**

The application uses role-based authorization.

**### Executive**

An executive can:

\- Access the executive dashboard
\- Add activities
\- View their own activities
\- Edit their own activities
\- Delete their own activities
\- View activity history
\- View pending follow-ups

**### Admin**

An administrator can:

\- Access the admin dashboard
\- View executive statistics
\- View executive update status
\- Select executives
\- View selected executive activities
\- Filter activities
\- Access admin-protected APIs

Admin API routes use both authentication and admin authorization middleware.

\---

**## 9. Project Structure**

\`\`\`text
daily-executive-tracker
│
├── backend
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── activityController.js
│   │   └── authController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models
│   │   ├── Activity.js
│   │   └── User.js
│   │
│   ├── routes
│   │   ├── activityRoutes.js
│   │   └── authRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── ExecutiveDashboard.jsx
│   │   │   ├── AddActivity.jsx
│   │   │   ├── EditActivity.jsx
│   │   │   ├── ActivityHistory.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
\`\`\`

\---

**## 10. Backend Configuration**

The backend uses environment variables for configuration.

Example \`.env\` file:

\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
\`\`\`

The \`.env\` file contains private information and should not be uploaded to GitHub.

\---

**## 11. How to Run the Project**

**### Step 1: Open the Project**

Open the project folder in Visual Studio Code.

Project folder:

\`\`\`text
daily-executive-tracker
\`\`\`

**### Step 2: Start the Backend**

Open a terminal and go to the backend folder:

\`\`\`bash
cd backend
\`\`\`

Install backend dependencies:

\`\`\`bash
npm install
\`\`\`

Start the backend server:

\`\`\`bash
npm run dev
\`\`\`

The backend runs on:

\`\`\`text
http://localhost:5000
\`\`\`

The terminal should show:

\`\`\`text
Server running on port 5000
MongoDB connected successfully
\`\`\`

**### Step 3: Start the Frontend**

Open another terminal and go to the frontend folder:

\`\`\`bash
cd frontend
\`\`\`

Install frontend dependencies:

\`\`\`bash
npm install
\`\`\`

Start the React application:

\`\`\`bash
npm run dev
\`\`\`

The frontend runs on:

\`\`\`text
http://localhost:5173
\`\`\`

**### Step 4: Open the Application**

Open a browser and visit:

\`\`\`text
http://localhost:5173
\`\`\`

\---

**## 12. API Endpoints**

**### Authentication**

**Login**

\`\`\`text
POST /api/auth/login
\`\`\`

**### Executive Activity APIs**

**Add Activity**

\`\`\`text
POST /api/activities
\`\`\`

**Get My Activities**

\`\`\`text
GET /api/activities/my
\`\`\`

**Get Executive Dashboard Statistics**

\`\`\`text
GET /api/activities/dashboard-stats
\`\`\`

**Get Single Activity**

\`\`\`text
GET /api/activities/:id
\`\`\`

**Update Activity**

\`\`\`text
PUT /api/activities/:id
\`\`\`

**Delete Activity**

\`\`\`text
DELETE /api/activities/:id
\`\`\`

**### Admin APIs**

**Get Admin Dashboard Statistics**

\`\`\`text
GET /api/activities/admin-dashboard-stats
\`\`\`

**Get Selected Executive Activities**

\`\`\`text
GET /api/activities/admin/executive/:executiveId
\`\`\`

\---

**## 13. API Architecture**

The frontend communicates with the backend using HTTP requests.

React
  |
  | Axios
  ↓
Express REST API
  |
  | Controllers
  ↓
Mongoose Models
  |
  ↓
MongoDB Atlas

JWT tokens are included in protected API requests using the Authorization header.

Example:

\`\`\`text
Authorization: Bearer <JWT_TOKEN>
\`\`\`

\---

**## 14. Activity Management**

Executives can:

1\. Add a new daily activity.
2\. View previous activities.
3\. Edit their own activities.
4\. Delete their own activities.
5\. View pending follow-ups.

Each activity is associated with the executive who created it.

**### Add Activity**

The Add Activity page allows the executive to enter:

\- Date
\- Dealer / Customer Name
\- Location
\- Visit / Activity
\- Cases
\- Sales Amount
\- Collection Amount
\- Remarks
\- Next Follow-up

**### Edit Activity**

Executives can edit their own activity records.

**### Delete Activity**

Executives can delete their own activity records after confirmation.

\---

**## 15. Validation**

The application validates activity data.

Validation includes:

\- Date is required.
\- Dealer / Customer name is required.
\- Location is required.
\- Visit / Activity is required.
\- Cases cannot be negative.
\- Sales amount cannot be negative.
\- Collection amount cannot be negative.

The MongoDB/Mongoose schema also enforces:

\- Required fields
\- Minimum value of \`0\` for cases
\- Minimum value of \`0\` for sales amount
\- Minimum value of \`0\` for collection amount

\---

**## 16. Executive Dashboard**

The Executive Dashboard provides an overview of the executive's daily activities.

**### Dashboard Statistics**

The dashboard displays:

\- Today's Visits
\- Total Cases
\- Sales
\- Collection

Example:

\`\`\`text
Today's Visits       1
Total Cases          2
Sales             ₹3000
Collection        ₹5000
\`\`\`

**### Pending Follow-ups**

The dashboard also displays pending follow-ups with:

\- Dealer / Customer Name
\- Follow-up Date

**### Dashboard Actions**

Executives can access:

\- Add Activity
\- Activity History
\- Logout

\---

**## 17. Activity History**

The Activity History page displays the executive's previous activities.

Executives can:

\- View activity records
\- Edit activities
\- Delete activities

The activities are associated with the currently logged-in executive.

\---

**## 18. Admin Dashboard**

The Admin Dashboard allows administrators to monitor executive performance.

**### Dashboard Statistics**

The admin dashboard displays:

\- Total Executives
\- Updated Today
\- Not Updated Today
\- Today's Visits
\- Total Cases
\- Sales
\- Collection

**### Executive Status**

Each executive has an update status:

\`\`\`text
Updated
\`\`\`

or

\`\`\`text
Not Updated
\`\`\`

The status is determined based on whether the executive has added an activity for the current day.

\---

**## 19. Executive Selection**

The administrator can select an executive from the executive list.

After selecting an executive, the dashboard displays that executive's activities.

Activity information includes:

\- Date
\- Dealer / Customer
\- Location
\- Activity
\- Cases
\- Sales
\- Collection
\- Remarks
\- Next Follow-up

\---

**## 20. Filtering**

The Admin Dashboard provides filtering functionality.

**### Date Filter**

Administrators can filter activities by activity date.

Example:

\`\`\`text
Date: 10/04/2026
\`\`\`

The dashboard displays activities matching the selected date.

**### Dealer / Customer Filter**

Administrators can search activities using the dealer or customer name.

Example:

\`\`\`text
Dealer Search: ABC
\`\`\`

The dashboard displays matching activities.

**### Clear Filters**

The Clear Filters option removes the selected date and dealer/customer filters.

\---

**## 21. Dashboard Status Tracking**

The system tracks whether each executive has updated their daily activity.

For example:

\`\`\`text
Executive          Status
--------------------------------
Executive 1        Updated
Executive 2        Not Updated
\`\`\`

This allows administrators to quickly identify executives who have not submitted their daily activity.

\---

**## 22. Database Connection**

The application uses MongoDB Atlas as the database.

The backend connects to MongoDB using Mongoose.

Database connection is configured in:

\`\`\`text
backend/config/db.js
\`\`\`

The MongoDB connection string is stored in the \`.env\` file.

The application database contains:

\- Users
\- Activities

\---

**## 23. Security**

The application implements authentication and authorization.

**### Password Security**

Passwords are hashed using \`bcryptjs\` before being stored in the database.

**### JWT Authentication**

JWT tokens are generated after successful login.

**### Protected Routes**

Protected routes require a valid JWT token.

**### Admin Authorization**

Admin-only routes require the authenticated user's role to be:

\`\`\`text
admin
\`\`\`

**### User Activity Protection**

Executives can only update and delete their own activities.

\---

**## 24. Responsive Design**

Bootstrap responsive classes are used to make the application usable on different screen sizes.

The following pages are designed to be responsive:

\- Login
\- Executive Dashboard
\- Add Activity
\- Edit Activity
\- Activity History
\- Admin Dashboard

Tables use responsive containers so that they can be viewed on smaller screens.

\---

**## 25. Error Handling**

The application provides error handling for common operations.

Examples include:

\- Invalid login credentials
\- Missing authentication token
\- Invalid or expired JWT token
\- Unauthorized admin access
\- Activity not found
\- Failed database operations
\- Invalid activity data

The frontend displays appropriate messages when API requests fail.

\---

**## 26. Development Tools**

**### Visual Studio Code**

Used for developing and managing the project files.

**### Postman**

Used for testing REST API endpoints.

**### Git**

Used for version control.

**### GitHub**

Used for storing and sharing the project source code.

\---

**## 27. Testing**

The following features have been tested:

**### Authentication**

\- Executive login
\- Admin login
\- JWT authentication
\- Invalid login handling
\- Admin authorization

**### Executive Features**

\- Add activity
\- View activity history
\- Edit activity
\- Delete activity
\- Executive dashboard
\- Dashboard statistics
\- Pending follow-ups
\- Logout

**### Admin Features**

\- Admin dashboard
\- Total executives
\- Updated Today status
\- Not Updated Today status
\- Today's visits
\- Total cases
\- Sales
\- Collection
\- Executive selection
\- View selected executive activities
\- Date filtering
\- Dealer/customer filtering
\- Clear filters

**### Validation**

\- Required fields
\- Negative cases validation
\- Negative sales validation
\- Negative collection validation

\---

**## 28. Sample Application Flow**

**### Executive Flow**

Login
  ↓
Executive Dashboard
  ↓
Add Activity
  ↓
Activity Saved
  ↓
Dashboard Statistics Updated
  ↓
Activity History
  ↓
Edit / Delete Activity

**### Admin Flow**

Admin Login
  ↓
Admin Dashboard
  ↓
View Executive Statistics
  ↓
Check Updated / Not Updated Status
  ↓
Select Executive
  ↓
View Executive Activities
  ↓
Filter by Date / Dealer

\---

**## 29. Future Improvements**

The following features can be added in future versions:

\- Multiple executive accounts
\- Advanced reports
\- Export reports to Excel/PDF
\- Charts and graphs
\- Monthly and weekly statistics
\- Email notifications
\- Follow-up reminders
\- Search and pagination
\- Profile management
\- Password reset
\- Improved role management
\- Cloud deployment
\- Production environment configuration

\---

**## 30. Conclusion**

The Daily Executive Activity Tracker provides a simple full-stack solution for recording daily executive activities and monitoring executive performance through an administrative dashboard.

The application demonstrates:

\- React frontend development
\- Vite development environment
\- Bootstrap responsive UI
\- Axios API integration
\- Node.js backend development
\- Express.js REST APIs
\- MongoDB Atlas database integration
\- Mongoose database modeling
\- JWT authentication
\- Role-based authorization
\- Password hashing
\- CRUD operations
\- Data validation
\- Dashboard development
\- Activity tracking
\- Executive status monitoring
\- Filtering and reporting
\- Responsive UI design

The project provides a complete MVP solution for daily executive activity tracking and administrative monitoring.