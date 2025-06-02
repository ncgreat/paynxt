import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SalesReports = () => {
  const [reports] = useState([
    { month: "January", revenue: 200000, orders: 120 },
    { month: "February", revenue: 320000, orders: 140 },
    { month: "March", revenue: 730000, orders: 160 },
    { month: "April", revenue: 510000, orders: 180 },
    { month: "May", revenue: 300000, orders: 100 },
  ]);

  const chartData = {
    labels: reports.map((r) => r.month),
    datasets: [
      {
        label: "Revenue (₦)",
        data: reports.map((r) => r.revenue),
        borderColor: "#23b02c",
        backgroundColor: "rgba(35, 176, 44, 0.4)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Total Orders",
        data: reports.map((r) => r.orders),
        borderColor: "#ff9800",
        backgroundColor: "rgba(255, 152, 0, 0.4)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl sm:text-2xl text-gray-800 mb-4 sm:mb-6">Sales Reports</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">View monthly revenue and order statistics.</p>

      {/* Chart Section */}
      <div className="mb-6">
        <div className="w-full h-[250px] sm:h-[400px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Monthly Sales Performance" },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(0, 0, 0, 0.1)" },
                },
                x: {
                  grid: { color: "rgba(0, 0, 0, 0.1)" },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 shadow-sm rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase">
              <th className="p-3 border">Month</th>
              <th className="p-3 border">Revenue (₦)</th>
              <th className="p-3 border">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="text-gray-700 hover:bg-gray-100 transition">
                <td className="p-3 border">{report.month}</td>
                <td className="p-3 border font-semibold">₦{report.revenue.toLocaleString()}</td>
                <td className="p-3 border">{report.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReports;
