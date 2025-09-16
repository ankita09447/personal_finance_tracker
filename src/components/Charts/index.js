import React from 'react'
import {Line,Pie} from '@ant-design/charts';

function ChartComponent({sortedTransactions =[]}) {
  const data = sortedTransactions.map((item) => ({
      date: typeof item.date === 'string' 
          ? item.date 
          : (item.date?.toDate?.() || item.date)?.toISOString().split("T")[0] || "Invalid Date",
      amount: Number(item.amount),
  }));

  // const tagMap = new Map();
  // sortedTransactions.forEach((transaction) => {
  //   if (transaction.type === "expense") {
  //     const tag = transaction.tag || "Others";
  //     const amount = Number(transaction.amount);
  //     if (tagMap.has(tag)) {
  //       tagMap.set(tag, tagMap.get(tag) + amount);
  //     } else {
  //       tagMap.set(tag, amount);
  //     }
  //   }
  // });

   const spendingData = sortedTransactions
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => ({
      tag: transaction.tag || "Others",
      amount: Number(transaction.amount),
    }));

  const finalSpendings = spendingData.reduce((acc, obj) => {
    const key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: key, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  console.log("spending Arrat",Object.values(finalSpendings));
  const config = {
    data:data,
    autoFit: true,
    height: 300,
    xField: 'date',
    yField: 'amount',
    point: { size: 4, shape: 'circle' },
  };

  const spendingConfig = {
    data:Object.values(finalSpendings),
    height:300,
    angleField: 'amount',
    colorField: 'tag',
    radius: 0.8,
    autoFit: true,
  };

   return (
    <div className="charts-wrapper">
      <div className="chart-box">
        <h2>Your Transaction</h2>
        <Line {...config} />
      </div>
      <div className="chart-box">
        <h2>Your Spending</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
}
export default  ChartComponent;