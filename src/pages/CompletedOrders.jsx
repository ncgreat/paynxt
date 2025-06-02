import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "#2001",
      customer: "Emily Clark",
      status: "Ready",
      total: "$50.75",
      orderTime: "March 15, 5:20 PM",
      pickupTime: "March 15, 6:30 PM",
      orderNote: "No nuts, extra cheese.",
      deliveryAddress: "789 Maple St, San Francisco, CA",
      items: [
        { name: "Pepperoni Pizza", quantity: 1 },
        { name: "Garlic Bread", quantity: 1 },
        { name: "Iced Tea", quantity: 2 },
      ],
    },
    {
      id: "#2002",
      customer: "Chris Johnson",
      status: "Ready",
      total: "$28.99",
      orderTime: "March 12, 1:45 PM",
      pickupTime: "March 12, 2:30 PM",
      orderNote: "Extra sauce, well-done steak.",
      deliveryAddress: "456 Oak St, Chicago, IL",
      items: [
        { name: "Grilled Steak", quantity: 1 },
        { name: "Mashed Potatoes", quantity: 1 },
        { name: "House Salad", quantity: 1 },
      ],
    },
  ]);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const markAsDelivered = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Delivered" } : order
      )
    );
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Completed Orders</h2>
      <p className="text-gray-600 mb-4">Review and confirm completed orders.</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr 
                  className="text-gray-700 hover:bg-gray-100 transition border-b cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded 
                      ${order.status === "Completed" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{order.total}</td>
                  <td className="p-3">
                    <button
                      className={`text-gray-600 hover:text-gray-900 transition-transform ${expandedOrder === order.id ? "rotate-180" : "rotate-0"}`}
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="5" className="p-0">
                    <div className={`transition-all duration-[1s,15s] ease-in-out overflow-hidden 
                      ${expandedOrder === order.id ? "max-h-[500px] opacity-100 p-4 bg-gray-50 text-gray-600" : "max-h-0 opacity-0 p-0"}`}>
                      {expandedOrder === order.id && (
                        <div className="space-y-3">
                          <p><strong>Order Time:</strong> {order.orderTime}</p>
                          <p><strong>Pickup Time:</strong> {order.pickupTime}</p>
                          <p><strong>Order Note:</strong> {order.orderNote}</p>
                          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                          <div>
                            <strong>Items:</strong>
                            <ul className="list-disc ml-5 text-sm">
                              {order.items.map((item, index) => (
                                <li key={index}>{item.quantity}x {item.name}</li>
                              ))}
                            </ul>
                          </div>
                          <p className="font-bold">Total: {order.total}</p>

                          {/* Mark as Delivered Button */}
                          {order.status === "Ready" && (
                            <button
                              className="bg-green-500 text-white px-4 py-2 text-sm rounded-md hover:bg-green-600 transition"
                              onClick={() => markAsDelivered(order.id)}
                            >
                              Mark as Delivered
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedOrders;
