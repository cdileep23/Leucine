 Leucine - Software Access Management System
 Project Setup
 Clone the Repository

git clone https://github.com/cdileep23/Leucine

Backend Setup

cd server
npm install
npm run dev
Runs on: http://localhost:5000

 Frontend Setup

cd client
npm install
npm run dev
Runs on: http://localhost:5173

📚 API Documentation
🔗 Base URL

http://localhost:5000


🔐 Authentication APIs

🧾 Sign-In (Register)
POST /api/auth/sign-in
Body:



{
  "username": "admin12",
  "password": "Admin@123",
  "role": "Admin"
}
Response:



{
  "message": "User created successfully",
  "success": true,
  "user": {
    "username": "admin12",
    "role": "Admin",
    "id": "uuid"
  }
}


🔑 Login
POST /api/auth/login
Body:

{
  "username": "admin1",
  "password": "Admin@123"
}

Response:


{
  "message": "Login successful",
  "success": true,
  "user": {
    "id": "uuid",
    "username": "admin1",
    "role": "Admin"
  }
}

🚪 Logout
GET /api/auth/logout
Response:

json
Copy
Edit
{
  "message": "Logout successful",
  "success": true
}
👤 Get User Profile
GET /api/auth/user
Response:


{
  "message": "User profile fetched successfully",
  "success": true,
  "user": {
    "id": "uuid",
    "username": "admin1",
    "role": "Admin"
  }
}

Software Management APIs
Create Software
POST /api/software/create-software
Body:


{
  "name": "Cloud Computing",
  "description": "Building automation of cloud",
  "accessLevels": ["Read", "Write"]
}
Response:


{
  "message": "Software created successfully",
  "success": true,
  "software": {
    "name": "Cloud Computing",
    "description": "Building automation of cloud",
    "accessLevels": ["Read", "Write"],
    "id": "uuid"
  }
}

📤 Get All Softwares
GET /api/software/get-software
Response:


{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "AI Agents",
      "description": "Build a Chat bot using AI Agent",
      "accessLevels": ["Read", "Write"]
    },
    ...
  ]
}


🧾 Access Request APIs
📩 Submit Request
POST /api/request
Body:

{
  "softwareId": "software-uuid",
  "reason": "To use it",
  "accessType": "Write"
}
Response:


{
  "success": true,
  "message": "Access request submitted successfully",
  "data": {
    "accessType": "Write",
    "reason": "To use it",
    "status": "Pending",
    "user": {
      "id": "user-uuid",
      "username": "employee1",
      "role": "Employee"
    },
    "software": {
      "id": "software-uuid",
      "name": "Cloud Computing",
      "accessLevels": ["Read", "Write"]
    },
    "id": 8
  }
}
📜 Get All Requests
GET /api/request/get-all
Response:


{
  "success": true,
  "data": [
    {
      "id": 8,
      "accessType": "Write",
      "reason": "To use it",
      "status": "Pending",
      "user": {
        "id": "user-uuid",
        "username": "employee1",
        "role": "Employee"
      },
      "software": {
        "id": "software-uuid",
        "name": "Cloud Computing"
      }
    }
  ]
}

🛠️ Update Request Status
PUT /api/request/8
Body:


{
  "status": "Approved"
}
Response:


{
  "success": true,
  "message": "Request has been approved",
  "data": {
    "id": 8,
    "status": "Approved",
    ...
  }
}
🔗 Postman Collection:https://www.postman.com/science-technologist-30252639/workspace/dileep-kumar/collection/36192114-b93b858c-a467-4088-b503-960b5fdf9db3?action=share&creator=36192114
