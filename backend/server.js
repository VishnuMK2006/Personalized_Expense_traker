require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatRoutes = require("./routes/chatRoutes");
const recommendationRoutes = require('./routes/recommendationRoutes');

// Initialize express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api", chatRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

// Root route for API health check
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running" });
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;

// Create server with error handling for port conflicts
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying alternative port...`);
    // Try an alternative port
    const alternativePort = parseInt(PORT) + 1;
    app.listen(alternativePort, () => {
      console.log(`Server running on alternative port ${alternativePort}`);
      console.log(`API URL: http://localhost:${alternativePort}`);
      console.log(`Note: You may need to update your frontend to use port ${alternativePort}`);
    });
  } else {
    console.error('Server error:', error);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
});
