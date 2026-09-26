# 🚀 Insurance Policy Management API

A production-style Node.js backend application developed as a technical assessment for managing insurance policy data, importing CSV/XLSX files into MongoDB, searching and aggregating policy information, monitoring CPU utilization, and scheduling messages.

---

## 🧩 Tech Stack

* 🟨 **JavaScript (ES6+)**
* 🟢 **Node.js**
* ⚡ **Express.js**
* 🍃 **MongoDB**
* 🧠 **Mongoose**
* 🐳 **Docker & Docker Compose**
* 🧵 **Node.js Worker Threads**
* 📄 **XLSX / CSV Processing**
* 📦 **Multer**
* ⏰ **Node-Cron**
* 🔄 **PM2**
* 🧪 **Node.js Test Runner**

---

## ✨ Features

### 🔹 Task 1

- Upload CSV/XLSX insurance data
- Process uploaded files using Node.js Worker Threads
- Store data in separate MongoDB collections
- Search policy information using username
- Aggregate policies by each user
- Deduplicate imported records
- Remove temporary uploaded files after processing

### 🔹 Task 2

- Monitor Node.js server CPU utilization
- Check CPU usage every 5 seconds
- Restart the server when CPU utilization reaches 70%
- Schedule messages using day and time
- Store scheduled messages in MongoDB
- Process scheduled messages using a cron scheduler

---

# 🗄️ MongoDB Collections

The application uses separate collections for:

```text
agents
users
accounts
lobs
carriers
policies
messages
```

### 🔗 Data Relationships

```text
Agent
  │
  └── User
       │
       ├── Account
       │
       └── Policy
             ├── Carrier
             └── LOB
```

---

# 📁 Project Structure

```text
insurance-policy-management-api/
│
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
│   ├── workers/
│   │   └── import.worker.js
│   │
│   ├── services/
│   │   └── message.scheduler.js
│   │
│   └── utils/
│       ├── asyncHandler.js
│       └── cpuMonitor.js
│
├── uploads/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env
└── .gitignore
└── README.md
```

---

# ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/insurance_assessment
NODE_ENV=development
```

> 🔐 The `.env` file contains environment-specific configuration and should not be committed to Git.

---

# 🚀 Running the Application

There are two supported ways to run the application.

### 🐳 Option 1 — Complete Application Using Docker

```text
Node.js API → Docker
MongoDB     → Docker
```

### 💻 Option 2 — Local Node.js + Docker MongoDB

```text
Node.js API → Local machine
MongoDB     → Docker
```

---

# 🐳 Option 1: Run Complete Application Using Docker

This is the simplest way to run the complete application.

## 📋 Prerequisites

Install and start:

* Docker Desktop
* Git

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Karthick-kannan-24/insurance-policy-management-api.git
cd insurance-policy-management-api
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Pull MongoDB Image

Pull the MongoDB 8 image:

```bash
docker pull mongo:8
```

> 💡 Docker Compose can also pull the image automatically if it is not available locally. This command explicitly downloads the required MongoDB image before starting the application.

## 4️⃣ Build and Start the Application

```bash
docker compose up --build
```

This command:

* 🏗️ Builds the Node.js API Docker image
* 🚀 Starts the API container
* 🍃 Starts the MongoDB container
* 🔗 Connects the API to MongoDB
* 🌐 Exposes the API on port `3000`

You **do not need to run `npm run dev`** when using this option.

### Run in Background

To run the application without keeping the terminal occupied:

```bash
docker compose up -d --build
```

### Check Running Containers

```bash
docker compose ps
```

### View Logs

```bash
docker compose logs -f
```

### Stop the Application

```bash
docker compose down
```

---

# 💻 Option 2: Run Node.js Locally + MongoDB Using Docker

This option is useful for local development, debugging, and modifying the Node.js application.

## 📋 Prerequisites

* Node.js
* npm
* Docker Desktop
* Git

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Karthick-kannan-24/insurance-policy-management-api.git
cd insurance-policy-management-api
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Configure `.env`

Create a `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/insurance_assessment
NODE_ENV=development
```

## 4️⃣ Pull MongoDB Image

```bash
docker pull mongo:8
```

## 5️⃣ Start MongoDB Using Docker

Make sure Docker Desktop is running.

Start only the MongoDB service:

```bash
docker compose up -d mongodb
```

Check the MongoDB container:

```bash
docker compose ps
```

MongoDB will be available at:

```text
mongodb://127.0.0.1:27017
```

## 6️⃣ Start Node.js Locally

Run the application:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

### 🛑 Stop MongoDB

```bash
docker compose stop mongodb
```

Or:

```bash
docker compose down
```

---

# ❤️ Health Check

Check whether the API is running:

```http
GET /api/health
```

Example:

```text
http://localhost:3000/api/health
```

Response:

```json
{
  "success": true,
  "status": "healthy",
  "service": "insurance-assessment-api",
  "timestamp": "2026-09-26T10:00:00.000Z"
}
```

---

# 📤 Upload Insurance Data

Upload a CSV or XLSX file:

```http
POST /api/upload
```

### 📮 Postman Configuration

Select:

```text
Body → form-data
```

Add:

```text
Key  : file
Type : File
Value: Select your CSV/XLSX file
```

Example:

```text
POST http://localhost:3000/api/upload
```

### 🔄 Upload Processing Flow

```text
Client
   │
   ▼
Upload API
   │
   ▼
Multer
   │
   ▼
Temporary File
   │
   ▼
Worker Thread
   │
   ├── Parse CSV/XLSX
   ├── Create Agents
   ├── Create Users
   ├── Create Accounts
   ├── Create LOBs
   ├── Create Carriers
   └── Create Policies
   │
   ▼
MongoDB
   │
   ▼
Temporary File Deleted
```

The uploaded file is temporary. After successful processing, it is automatically removed from the `uploads/` directory.

---

# 🔎 Search Policy By Username

```http
GET /api/policies/search?username=<username>
```

Example:

```text
http://localhost:3000/api/policies/search?username=Lura Lucca
```

The response includes:

* 👤 User information
* 🤝 Agent information
* 🏦 Account information
* 📄 Policy information
* 🏢 Insurance carrier
* 📋 Line of business

Email can also be used:

```text
http://localhost:3000/api/policies/search?username=madler@yahoo.ca
```

---

# 📊 Aggregate Policies By User

```http
GET /api/policies/aggregate
```

Example:

```text
http://localhost:3000/api/policies/aggregate
```

The endpoint groups policies by user and returns:

* 👤 User
* 🤝 Agent
* 🏦 Account
* 📄 Policies
* 🏢 Carrier
* 📋 Line of Business
* 🔢 Policy count

---

# 📨 Schedule a Message

Schedule a message for a specific date and time:

```http
POST /api/messages/schedule
```

### Request Body

Use a future date and time:

```json
{
  "message": "Test scheduled message",
  "day": "2026-09-30",
  "time": "18:30"
}
```

### Processing Flow

```text
Client
   │
   ▼
Schedule API
   │
   ▼
MongoDB
   │
   ▼
Background Scheduler
   │
   ▼
Scheduled Time Reached
   │
   ▼
Message Processed
```

The scheduler checks pending messages and processes them when their scheduled time is reached.

---

# 🧵 Worker Thread Processing

The file import functionality uses Node.js Worker Threads so that file processing runs separately from the main API thread.

### Benefits

* ⚡ Keeps the main API responsive
* 🧵 Handles CPU-intensive file processing separately
* 📄 Supports CSV/XLSX processing
* 🗄️ Performs bulk MongoDB operations
* 🧹 Cleans up temporary files after processing

---

# 📈 CPU Monitoring

The application monitors server CPU utilization continuously.

### Configuration

```text
Check interval : 5 seconds
CPU threshold  : 70%
Restart method : PM2
```

When CPU utilization reaches or exceeds 70%, the application triggers a PM2 restart.

### Start With PM2

```bash
npm run start:pm2
```

### Restart Manually

```bash
pm2 restart insurance-api
```

---

# 🧪 Testing

Run the test suite:

```bash
npm test
```

---

# 🐳 Useful Docker Commands

### Pull MongoDB

```bash
docker pull mongo:8
```

### Build and Start

```bash
docker compose up --build
```

### Build and Start in Background

```bash
docker compose up -d --build
```

### Start MongoDB Only

```bash
docker compose up -d mongodb
```

### Check Containers

```bash
docker compose ps
```

### View Logs

```bash
docker compose logs -f
```

### Stop Containers

```bash
docker compose down
```

### Stop MongoDB Only

```bash
docker compose stop mongodb
```

---

# 🛡️ Error Handling

The application provides centralized error handling for:

* ❌ Invalid routes
* ❌ Missing required fields
* ❌ Invalid file types
* ❌ File upload errors
* ❌ Duplicate MongoDB records
* ❌ Mongoose validation errors
* ❌ Invalid MongoDB IDs
* ❌ Internal server errors

---

# 🔐 Reliability & Security

* 🔑 Environment-based configuration
* 📦 Request body size limits
* 📁 File upload size limits
* ✅ File type validation
* 🗂️ MongoDB indexes
* 🚫 Duplicate record prevention
* 🔄 Graceful server shutdown
* 🛡️ Centralized error handling
* 🧵 Worker Thread processing
* 🐳 Docker containerization
* 📈 CPU monitoring

---

# 🔌 API Endpoints

| Method | Endpoint                  | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| `GET`  | `/api/health`             | ❤️ Health check                    |
| `POST` | `/api/upload`             | 📤 Upload CSV/XLSX                 |
| `GET`  | `/api/policies/search`    | 🔎 Search policy by username/email |
| `GET`  | `/api/policies/aggregate` | 📊 Aggregate policies by user      |
| `POST` | `/api/messages/schedule`  | 📨 Schedule a message              |

---

# 👨‍💻 Author

**Karthick Kannan R.**

Senior Web Developer | Node.js | Express.js | Next.js | React.js | Laravel

🔗 GitHub:
https://github.com/Karthick-kannan-24

🔗 LinkedIn:
https://www.linkedin.com/in/Karthick-kannan-2421997/

---

# 📄 License

This project was developed as part of a technical assessment.
