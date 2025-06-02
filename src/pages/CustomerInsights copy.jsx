import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CustomerInsights = () => {
  const [insights, setInsights] = useState([
    { name: "John Doe", purchases: 15, totalSpent: 1200 },
    { name: "Jane Smith", purchases: 20, totalSpent: 1500 },
    { name: "Alice Johnson", purchases: 12, totalSpent: 900 },
    { name: "Mark Brown", purchases: 18, totalSpent: 1300 },
    { name: "Emily Davis", purchases: 22, totalSpent: 1700 }
  ]);

  const chartData = {
    labels: insights.map(insight => insight.name),
    datasets: [
      {
        label: "Total Purchases",
        data: insights.map(insight => insight.purchases),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2
      },
      {
        label: "Total Spent ($)",
        data: insights.map(insight => insight.totalSpent),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Insights</h2>
      <p className="text-gray-600 mb-4">Analyze customer purchasing behavior.</p>
      
      <div className="mb-6">
        <Bar data={chartData} options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Customer Spending & Purchases" }
          },
          scales: {
            y: { beginAtZero: true },
            x: { grid: { display: false } }
          }
        }} />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-sm rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-3">Customer Name</th>
              <th className="border p-3">Total Purchases</th>
              <th className="border p-3">Total Spent (₦)</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((customer, index) => (
              <tr key={index} className="text-gray-700 hover:bg-gray-100 transition">
                <td className="border p-3">{customer.name}</td>
                <td className="border p-3 font-semibold">{customer.purchases}</td>
                <td className="border p-3">₦{customer.totalSpent.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerInsights;
