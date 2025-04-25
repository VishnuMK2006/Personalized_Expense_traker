import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { LuRefreshCw } from 'react-icons/lu';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [financialMetrics, setFinancialMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First, fetch user's transaction history
      const [incomeResponse, expenseResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE)
      ]);

      const userData = {
        income: incomeResponse.data || [],
        expenses: expenseResponse.data || []
      };

      // Send the data to the backend for processing
      const response = await axiosInstance.post(API_PATHS.RECOMMENDATIONS.GET_RECOMMENDATIONS, userData);

      if (response.data && response.data.success) {
        setRecommendations(response.data.recommendation);
        setFinancialMetrics(response.data.financialMetrics);
      } else {
        throw new Error(response.data?.message || 'No recommendations available');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.response?.data?.message || error.message || 'Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <DashboardLayout activeMenu="Recommendations">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Personalized Recommendations</h1>
          <button
            onClick={fetchRecommendations}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            <LuRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Recommendations
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {financialMetrics && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Total Income</h3>
              <p className="text-xl font-semibold">₹{financialMetrics.totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Total Expenses</h3>
              <p className="text-xl font-semibold">₹{financialMetrics.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Monthly Savings</h3>
              <p className="text-xl font-semibold">₹{financialMetrics.savings.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Savings Rate</h3>
              <p className="text-xl font-semibold">{financialMetrics.savingsRate.toFixed(2)}%</p>
            </div>
          </div>
        )}

        {financialMetrics?.topCategories && !isLoading && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Top Spending Categories</h3>
            <div className="space-y-2">
              {financialMetrics.topCategories.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{category.category}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">{category.percentage.toFixed(2)}%</span>
                    <span className="font-medium">₹{category.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations && !isLoading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="prose max-w-none">
              {recommendations.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Recommendations; 