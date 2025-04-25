const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Convert userId to ObjectId for aggregation
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income using aggregation
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Fetch total expense using aggregation
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Calculate total income and expense values
    const totalIncomeValue = totalIncome.length > 0 ? totalIncome[0].total : 0;
    const totalExpenseValue = totalExpense.length > 0 ? totalExpense[0].total : 0;
    
    // Calculate balance
    const balance = totalIncomeValue - totalExpenseValue;

    // Get income transactions in the last 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const last60DaysIncomeTransaction = await Income.find({
      userId: userObjectId,
      date: { $gte: sixtyDaysAgo },
    }).sort({ date: -1 });

    // Calculate total income for last 60 days
    const last60DaysIncome = last60DaysIncomeTransaction.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const last30DaysExpenseTransaction = await Expense.find({
      userId: userObjectId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    // Calculate total expense for last 30 days
    const last30DaysExpense = last30DaysExpenseTransaction.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch recent transactions (5 most recent income and 5 most recent expenses)
    const recentIncomes = await Income.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(5);
      
    const recentExpenses = await Expense.find({ userId: userObjectId })
      .sort({ date: -1 })
      .limit(5);

    // Combine and sort recent transactions
    const recentTransactions = [
      ...recentIncomes.map(income => ({
        ...income.toObject(),
        type: "income"
      })),
      ...recentExpenses.map(expense => ({
        ...expense.toObject(),
        type: "expense"
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Send response
    return res.status(200).json({
      totalBalance: balance,
      totalIncome: totalIncomeValue,
      totalExpense: totalExpenseValue,
      last30DaysExpese: {
        total: last30DaysExpense,
        transaction: last30DaysExpenseTransaction,
      },
      last60DaysIncome: {
        total: last60DaysIncome,
        transaction: last60DaysIncomeTransaction,
      },
      recentTransaction: recentTransactions.slice(0, 5), // Ensure we only return 5 most recent
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch dashboard data", 
      error: error.message 
    });
  }
};
