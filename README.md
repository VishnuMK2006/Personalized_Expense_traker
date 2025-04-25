# ExpenseFlow - Personal Finance Tracker

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

5. Start the Development Servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`

## Project Structure
