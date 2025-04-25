import moment from "moment";
import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const ExpenseTransactions = ({ transaction = [], onSeeMore }) => {
  // Check if we have transactions to display
  const hasTransactions = Array.isArray(transaction) && transaction.length > 0;
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {hasTransactions ? (
          // Display up to 5 transactions
          transaction.slice(0, 5).map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category || "Uncategorized"}
              icon={expense.icon || "💰"}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              hideDeleteBtn
            />
          ))
        ) : (
          // Display message when no transactions
          <div className="py-4 text-center text-gray-500">
            No recent expenses found
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
