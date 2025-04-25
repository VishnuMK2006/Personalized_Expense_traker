const xlsx = require("xlsx");
const Expense = require("../models/Expense");

//add expense in database
exports.addExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { icon, category, amount, date } = req.body;

    // Validate required fields
    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount are required." });
    }

    // Create new expense
    const newExpense = new Expense({
      userId,
      icon: icon || "", // Default to empty string if no icon
      category,
      amount: Number(amount), // Ensure amount is a number
      date: date ? new Date(date) : new Date(), // Use current date if not provided
    });

    // Save to database
    await newExpense.save();
    
    // Return success response
    return res.status(201).json({
      success: true,
      data: newExpense,
      message: "Expense added successfully"
    });
  } catch (error) {
    console.error("Add expense error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server Error", 
      error: error.message 
    });
  }
};

//get all expense data from database
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all expenses for the user, sorted by date (newest first)
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    
    return res.status(200).json(expenses);
  } catch (error) {
    console.error("Get all expenses error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch expenses", 
      error: error.message 
    });
  }
};

//delete expense data from database
exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user.id;
  
  try {
    // Find the expense first to make sure it exists and belongs to the user
    const expense = await Expense.findOne({ _id: expenseId, userId });
    
    if (!expense) {
      return res.status(404).json({ 
        success: false,
        message: "Expense not found or you don't have permission to delete it" 
      });
    }
    
    // Delete the expense
    await Expense.findByIdAndDelete(expenseId);
    
    return res.status(200).json({ 
      success: true,
      message: "Expense deleted successfully" 
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to delete expense", 
      error: error.message 
    });
  }
};

//download expense data in excel format
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get all expenses for the user
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    if (expenses.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "No expense data found to download" 
      });
    }

    // Prepare data for excel
    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString(),
      Time: new Date(item.date).toLocaleTimeString(),
    }));

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Category
      { wch: 15 }, // Amount
      { wch: 15 }, // Date
      { wch: 15 }, // Time
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(wb, ws, "Expense Details");
    
    // Create a temporary file path
    const filePath = `${__dirname}/../temp/expense_details_${Date.now()}.xlsx`;
    const dir = `${__dirname}/../temp`;
    
    // Create directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    xlsx.writeFile(wb, filePath);
    
    // Send file for download
    return res.download(filePath, "expense_details.xlsx", (err) => {
      // Delete the temporary file after download
      if (err) {
        console.error("Download error:", err);
      }
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Download excel error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to generate Excel file", 
      error: error.message 
    });
  }
};
