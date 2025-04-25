# ExpenseFlow - Personal Finance Tracker

# preview😉
## dashboard
![image](https://github.com/user-attachments/assets/e9a71be9-c58f-4367-ad28-ef7fcdfd70d0)
![image](https://github.com/user-attachments/assets/4e26d781-8011-420d-a0e6-a9e7baa7bc34)
## income
![image](https://github.com/user-attachments/assets/31dae292-9a34-424d-bea7-68be3dd1c1b7)
## Expense with graph
![image](https://github.com/user-attachments/assets/43b543c3-00b5-4de0-9819-63d6f7e3c0ff)
![image](https://github.com/user-attachments/assets/b76b4d30-9cdb-4cf5-970b-eceb891eb5d3)

## Personalize recommendation
![image](https://github.com/user-attachments/assets/7cfc0567-1f20-4dc1-8d18-26596c8a6e24)


ExpenseFlow is a modern, full-stack web application for tracking personal finances, managing income and expenses, and receiving personalized financial recommendations.

![ExpenseFlow Banner](frontend/src/assets/images/expense_banner.jpg)

## Features

- 📊 **Dashboard Overview**: Get a quick snapshot of your financial health with total balance, income, and expenses
- 💰 **Income Management**: Track and categorize your income sources
- 💳 **Expense Tracking**: Monitor and categorize your expenses
- 📈 **Financial Analytics**: Visual representations of your spending patterns
- 🤖 **AI-Powered Recommendations**: Get personalized financial advice based on your spending habits
- 📱 **Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- 🔒 **Secure Authentication**: JWT-based authentication system
- 📥 **Data Export**: Download your financial records in Excel format

## Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests
- Recharts for data visualization
- React Hot Toast for notifications
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- CORS for cross-origin resource sharing
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/expenseflow.git
cd expenseflow
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Configure Backend Environment
Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=8000
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
Install Backend Dependencies
```bash
cd ../frontend
npm install
```

5. Start the Development Servers

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run dev
```

Install Ollama then run
```
ollama run mistral
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`

## Project Structure

![image](https://github.com/user-attachments/assets/8b5c3b03-52b3-442f-9969-765cca0d0789)

