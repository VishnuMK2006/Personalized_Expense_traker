import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomeBarChart from "../Charts/CustomeBarChart";

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Process data for chart
      const result = prepareExpenseBarChartData(data);
      setChartData(result);
    } catch (error) {
      console.error("Error preparing expense chart data:", error);
    } finally {
      setIsLoading(false);
    }

    return () => {};
  }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expense</h5>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      ) : chartData.length > 0 ? (
        <CustomeBarChart data={chartData} />
      ) : (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-500">No expense data available for the last 30 days</p>
        </div>
      )}
    </div>
  );
};

export default Last30DaysExpenses;
