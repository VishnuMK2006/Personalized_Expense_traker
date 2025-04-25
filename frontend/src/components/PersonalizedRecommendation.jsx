import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const PersonalizedRecommendation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      // First, fetch user's transaction history with proper error handling
      const [incomeResponse, expenseResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME, { 
          timeout: 5000,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        }),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE, { 
          timeout: 5000,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        })
      ]);

      // Check if responses are valid
      if (!incomeResponse || !expenseResponse) {
        throw new Error('Failed to fetch transaction data');
      }

      const userData = {
        income: incomeResponse.data || [],
        expenses: expenseResponse.data || []
      };

      // Send the data to the backend for processing with Mistral
      const response = await axiosInstance.post('/api/recommendations', userData, {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      if (response.data && response.data.recommendation) {
        setRecommendation(response.data.recommendation);
      } else {
        throw new Error('No recommendations available');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please check your internet connection and try again.');
      } else if (error.message.includes('Network Error')) {
        setError('Could not connect to the server. Please make sure the backend server is running.');
      } else if (error.response) {
        setError(error.response.data.message || 'Failed to generate recommendations');
      } else {
        setError('Failed to generate recommendations. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={fetchRecommendations}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Generating Recommendations...' : 'Get Personalized Recommendations'}
      </button>

      {isLoading && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-center text-gray-500 mt-2">Analyzing your spending patterns...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {recommendation && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Your Personalized Recommendations</h3>
          <div className="prose max-w-none">
            {recommendation.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2">{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendation; 