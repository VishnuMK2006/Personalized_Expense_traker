const axios = require('axios');

const generateRecommendations = async (req, res) => {
  try {
    const { income, expenses } = req.body;

    // Calculate financial metrics
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const savings = totalIncome - totalExpenses;
    const savingsRate = ((savings / totalIncome) * 100).toFixed(2);

    // Group expenses and income by categories
    const groupByCategory = (items, key) =>
      items.reduce((acc, item) => {
        acc[item[key]] = (acc[item[key]] || 0) + item.amount;
        return acc;
      }, {});

    const expenseCategories = groupByCategory(expenses, "category");
    const incomeSources = groupByCategory(income, "source");

    // Sort and format expense categories
    const sortedCategories = Object.entries(expenseCategories)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalExpenses) * 100).toFixed(2)
      }))
      .slice(0, 5); // Limit to top 5 categories

    // Prepare prompt for recommendations
    const prompt = `
      Based on the following financial data, provide exactly 3 specific, actionable recommendations to improve financial health:
      Financial Summary:
      - Total Monthly Income: $${totalIncome}
      - Total Monthly Expenses: $${totalExpenses}
      - Monthly Savings: $${savings}
      - Savings Rate: ${savingsRate}%
      Top Expense Categories:
      ${sortedCategories.map(cat => `- ${cat.category}: $${cat.amount} (${cat.percentage}%)`).join('\n')}
      Income Sources:
      ${Object.entries(incomeSources).map(([source, amount]) => `- ${source}: $${amount}`).join('\n')}
      Provide 3 concise recommendations starting with 1., 2., and 3.`;

    // Create axios instance with retry logic
    const axiosInstance = axios.create({
      timeout: 8000,
      headers: { 'Content-Type': 'application/json' }
    });

    let attempts = 0;
    const maxAttempts = 2;
    let response;

    while (attempts < maxAttempts) {
      try {
        response = await axiosInstance.post('http://localhost:11434/api/generate', {
          model: 'mistral',
          prompt,
          stream: false
        });
        break;
      } catch (error) {
        if (++attempts >= maxAttempts) throw new Error('Failed to get response after multiple attempts');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Retry after 1 second
      }
    }

    res.json({
      success: true,
      recommendation: response.data.response,
      financialMetrics: {
        totalIncome,
        totalExpenses,
        savings,
        savingsRate,
        topCategories: sortedCategories
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
};

module.exports = { generateRecommendations };
