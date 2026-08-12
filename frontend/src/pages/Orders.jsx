import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const statusColor = {
  Pending: "bg-sand text-espresso",
  Processing: "bg-brassLight text-espresso",
  Shipped: "bg-brass text-ivory",
  Delivered: "bg-green-700 text-ivory",
  Cancelled: "bg-oxblood text-ivory",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/myorders").then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-5xl mx-auto px-5 py-24 text-center text-slateink/60">Loading orders…</div>;

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <h1 className="section-heading mb-10">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slateink/60 mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="flex flex-col md:flex-row md:items-center justify-between border border-sand p-5 hover:border-brass transition-colors"
            >
              <div>
                <p className="text-xs text-slateink/50 uppercase tracking-wide">Order #{order._id.slice(-8)}</p>
                <p className="text-sm mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-slateink/70 mt-1">{order.orderItems.length} item(s)</p>
              </div>
              <div className="flex items-center gap-4 mt-3 md:mt-0">
                <span className="font-semibold">₹{order.totalPrice.toFixed(2)}</span>
                <span className={`text-xs px-3 py-1.5 uppercase tracking-wide ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
