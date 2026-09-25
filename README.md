Insurance Policy Management API

A Node.js backend application developed as a technical assessment for importing insurance policy data from CSV/XLSX files into MongoDB, searching policy information, aggregating policies by user, monitoring server CPU utilization, and scheduling messages.

Tech Stack

Node.js

JavaScript (ES Modules)

Express.js

MongoDB

Mongoose

Worker Threads

Multer

XLSX

Node-Cron

PM2

Docker

Docker Compose

Features
Task 1

Upload CSV/XLSX insurance data.

Process uploaded files using Node.js Worker Threads.

Store data in separate MongoDB collections.

Search policy information using username.

Aggregate policies by each user.

Deduplicate imported records.

Remove temporary uploaded files after processing.

Task 2

Monitor Node.js server CPU utilization.

Check CPU usage every 5 seconds.

Restart the server when CPU utilization reaches 70%.

Schedule messages using day and time.

Store scheduled messages in MongoDB.

Process scheduled messages using a cron scheduler.

MongoDB Collections

The application uses separate collections for:

agents

users

accounts

lobs

carriers

policies

messages

Project Structure
insurance-assessment/
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── upload.controller.js
│   │   ├── policy.controller.js
│   │   └── message.controller.js
│   │
│   ├── middleware/
│   │   ├── upload.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── models/
│   │   ├── Agent.js
│   │   ├── User.js
│   │   ├── Account.js
│   │   ├── Lob.js
│   │   ├── Carrier.js
│   │   ├── Policy.js
│   │   └── Message.js
│   │
│   ├── routes/
│   │   ├── upload.routes.js
│   │   ├── health.routes.js
│   │   ├── policy.routes.js
│   │   └── message.routes.js
│   │
│   ├── services/
│   │   └── message.scheduler.js
│   │
│   ├── utils/
│   │   └── cpuMonitor.js
│   │
│   └── workers/
│       └── import.worker.js
│
├── uploads/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env
├── .gitignore
└── README.md

Environment Variables

Create a .env file in the project root:

PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/insurance_assessment
NODE_ENV=development

Docker Compose

When running the complete application using Docker Compose, use:

MONGO_URI=mongodb://mongodb:27017/insurance_assessment

Installation
1. Clone the Repository
git clone <repository-url>
cd insurance-assessment

2. Install Dependencies
npm install

3. Start the Development Server
npm run dev


The API will be available at:

http://localhost:3000

API Endpoints
Health Check

GET /api/health

Example:

curl http://localhost:3000/api/health

Upload Insurance Data

POST /api/upload

Uploads and processes insurance data from a CSV or XLSX file.

Request
Content-Type: multipart/form-data


Form field:

file


Supported formats:

CSV

XLSX

Example Using Postman
POST http://localhost:3000/api/upload


Select:

Body → form-data
file → <CSV/XLSX file>


The uploaded file is processed using a Worker Thread and removed after processing.

Search Policy by Username

GET /api/policies/search?username=<username>

Example:

GET /api/policies/search?username=Lura%20Lucca


The response contains:

User information

Agent

Account

Policies

Carrier

LOB

Aggregate Policies by User

GET /api/policies/aggregate

Returns policies grouped by user along with:

User information

Agent

Account

Policy list

Policy count

Schedule Message

POST /api/messages/schedule

Request Body
{
  "message": "Test scheduled message",
  "day": "2026-09-24",
  "time": "18:30"
}


The message is stored with a scheduled status and processed when the scheduled time is reached.

CPU Monitoring

The application monitors CPU utilization every 5 seconds.

Configuration

CPU Threshold: 70%

Check Interval: 5 seconds

When CPU utilization reaches or exceeds 70%, PM2 is used to restart the application:

pm2 restart insurance-api


The application can be started using PM2:

npm run start:pm2

Worker Thread Processing

The file import operation uses Node.js Worker Threads to prevent heavy CSV/XLSX processing from blocking the main Node.js event loop.

Processing Flow
Upload File
     ↓
Main Node.js Thread
     ↓
Worker Thread
     ↓
Parse CSV/XLSX
     ↓
Transform & Deduplicate Data
     ↓
MongoDB Bulk Operations
     ↓
Worker Response
     ↓
Temporary File Cleanup

Message Scheduling

The message scheduler uses node-cron to check scheduled messages every minute.

Scheduling Flow
POST Message
     ↓
MongoDB
     ↓
Status: scheduled
     ↓
Cron Scheduler
     ↓
Scheduled Time Reached
     ↓
Process Message
     ↓
Status: sent

Docker
Build and Start the Application
docker compose up --build

Run in Detached Mode
docker compose up -d --build

Stop Containers
docker compose down

Testing

Run the Node.js test command:

npm test


API testing can be performed using Postman or any REST client.

Error Handling

The application includes centralized error handling for:

Validation errors

MongoDB duplicate key errors

Mongoose cast errors

Multer errors

Unknown routes

Unexpected server errors

Security & Code Quality

Environment variables are used for configuration.

.env is excluded from Git.

Uploaded files are validated for CSV/XLSX extensions.

File size is limited.

MongoDB operations use bulk writes where appropriate.

Temporary uploaded files are removed after processing.

Express x-powered-by header is disabled.

Graceful shutdown is implemented for the Node.js server.

Assessment Requirements
Task 1

 CSV/XLSX upload API

 Worker Thread processing

 MongoDB integration

 Agent collection

 User collection

 User Account collection

 LOB collection

 Carrier collection

 Policy collection

 Policy search API

 Policy aggregation API

Task 2

 Real-time CPU monitoring

 70% CPU threshold

 Automatic server restart

 Message scheduling API

 Day and time-based scheduling

 MongoDB persistence

 JavaScript implementation

Author

Karthick Kannan R.