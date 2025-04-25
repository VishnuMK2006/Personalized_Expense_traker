import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formatedIneger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formatedIneger}.${fractionalPart}`
    : formatedIneger;
};

export const prepareExpenseBarChartData = (data = []) => {
  if (!data || data.length === 0) {
    return [];
  }
  
  // Group expenses by category and sum amounts
  const categoryMap = {};
  
  data.forEach(item => {
    if (item && item.category) {
      const category = item.category;
      const amount = Number(item.amount) || 0;
      
      if (categoryMap[category]) {
        categoryMap[category] += amount;
      } else {
        categoryMap[category] = amount;
      }
    }
  });
  
  // Convert to array format for chart
  const chartData = Object.keys(categoryMap).map(category => ({
    category: category,
    amount: categoryMap[category],
  }));
  
  // Sort by amount (highest first)
  return chartData.sort((a, b) => b.amount - a.amount);
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};
