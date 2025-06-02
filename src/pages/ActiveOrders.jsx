import React, { useState, useEffect, useContext } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { DealContext } from "../DealContext";

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const { loggedVendor, setLoggedVendor } = useContext(DealContext);

  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
   };

   useEffect(() => {
    const fetchOrders = async () => {
      try {
        const vendorId = loggedVendor?.user?.id; // or wherever you're getting the vendor ID from
        const res = await axios.post(`${getBaseUrl()}/vendor/orders`, {
          vendor_id: vendorId,
        });
  
        const data = res.data.map((order) => ({
          id: `#${order.id}`,
          customer: order.user?.name || "Unknown",
          status: order.status,
          total: `₦${Number(order.total_price).toLocaleString()}`,
          orderTime: new Date(order.order_time).toLocaleString(),
          pickupTime: new Date(order.updated_at).toLocaleString(),
          orderNote: order.order_note,
          deliveryAddress: order.delivery_address,
          items: order.items || [],
        }));
  
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
  
    fetchOrders();
  }, []);
  

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const markAsDelivered = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Delivered" } : order
      )
    );
  };

  return (
    <div className="p-3 md:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl text-gray-800 mb-6">Active Orders</h2>
      <p className="text-gray-600 mb-4">Track and manage currently active orders efficiently.</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="p-3 text-left hidden sm:flex">Order ID</th>
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
                  <td className="p-3 hidden sm:flex">{order.id}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded 
                      ${order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                        order.status === "Ready" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{order.total}</td>
                  <td className="p-3">
                    <button
                      className={`text-gray-600 hover:text-gray-900  transition-transform ${expandedOrder === order.id ? "rotate-180" : "rotate-0"}`}
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
                          <p><strong>Order ID:</strong> {order.id}</p>
                          <p><strong>Order Time:</strong> {order.orderTime}</p>
                          <p><strong>Pickup Time:</strong> {order.pickupTime}</p>
                          <p><strong>Order Note:</strong> {order.orderNote}</p>
                          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                          <div>
                            <strong>Items:</strong>
                            <ul className="list-disc ml-5 text-sm">
                              {order.items.map((item, index) => (
                                // <li key={index}>{item.quantity}x {item.name}</li>
                                <li key={index}>{item.quantity}x {item.menu_item?.name || 'Unknown Item'}</li>
                              ))}
                            </ul>
                          </div>
                          <p className="font-bold">Total: {order.total}</p>

                          {/* Status change buttons */}
                          {order.status === "Pending" && (
                            <button
                              className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600 transition"
                              onClick={() => updateOrderStatus(order.id, "Processing")}
                            >
                              Mark as Processing
                            </button>
                          )}

                          {order.status === "Processing" && (
                            <button
                              className="bg-gray-600 text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800 transition"
                              onClick={() => updateOrderStatus(order.id, "Ready")}
                            >
                              Mark as Ready
                            </button>
                          )}

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

export default ActiveOrders;
