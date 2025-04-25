import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";
import toast from "react-hot-toast";

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";
const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

      if (response.data) {
        console.log("Dashboard data:", response.data);
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {loading ? (
          // Loading state
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : dashboardData ? (
          // Dashboard content when data is loaded
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                icon={<IoMdCard />}
                label="Total Balance"
                value={addThousandsSeparator(dashboardData?.totalBalance)}
                color="bg-primary"
              />
              <InfoCard
                icon={<LuWalletMinimal />}
                label="Total Income"
                value={addThousandsSeparator(dashboardData?.totalIncome)}
                color="bg-orange-500"
              />
              <InfoCard
                icon={<LuHandCoins />}
                label="Total Expense"
                value={addThousandsSeparator(dashboardData?.totalExpense)}
                color="bg-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <RecentTransactions
                transaction={dashboardData?.recentTransaction}
                onSeeMore={() => navigate("/expense")}
              />
              <FinanceOverview
                totalBalance={dashboardData?.totalBalance || 0}
                totalIncome={dashboardData?.totalIncome || 0}
                totalExpense={dashboardData?.totalExpense || 0}
              />

              <ExpenseTransactions
                transaction={dashboardData?.last30DaysExpese?.transaction || []}
                onSeeMore={() => navigate("/expense")}
              />

              <Last30DaysExpenses
                data={dashboardData?.last30DaysExpese?.transaction || []}
              />
              
              <RecentIncomeWithChart
                data={
                  dashboardData?.last60DaysIncome?.transaction?.slice(0, 4) || []
                }
                totalIncome={dashboardData?.totalIncome || 0}
              />

              <RecentIncome
                transaction={dashboardData?.last60DaysIncome?.transaction || []}
                onSeeMore={() => navigate("/income")}
              />
            </div>
          </>
        ) : (
          // Error state when no data is available
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load dashboard data</p>
              <button 
                className="btn-primary"
                onClick={fetchDashboardData}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
