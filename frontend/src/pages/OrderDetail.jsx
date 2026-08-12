import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const steps = ["Pending", "Processing", "Shipped", "Delivered"];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = () => {
    setLoading(true);
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Cancel this order?")) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order cancelled");
      loadOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-5 py-24 text-center text-slateink/60">Loading order…</div>;
  if (!order) return <div className="max-w-4xl mx-auto px-5 py-24 text-center">Order not found.</div>;

  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-14">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <span className="eyebrow">Order Details</span>
          <h1 className="section-heading mt-1">#{order._id.slice(-8)}</h1>
          <p className="text-sm text-slateink/60 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        {["Pending", "Processing"].includes(order.status) && (
          <button onClick={handleCancel} className="btn-secondary border-oxblood text-oxblood hover:bg-oxblood">
            Cancel Order
          </button>
        )}
      </div>

      {order.status !== "Cancelled" ? (
        <div className="flex justify-between mb-14 relative">
          <div className="absolute top-3 left-0 right-0 h-px bg-sand"></div>
          {steps.map((step, idx) => (
            <div key={step} className="relative z-10 flex flex-col items-center flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${idx <= currentStepIndex ? "bg-brass text-ivory" : "bg-sand text-slateink/50"}`}>
                {idx <= currentStepIndex ? "✓" : idx + 1}
              </div>
              <span className="text-xs mt-2 text-slateink/70">{step}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-14 bg-oxblood/10 text-oxblood text-sm px-4 py-3">This order was cancelled.</div>
      )}

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 divide-y divide-sand">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex gap-4 py-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-sand/40 rounded-lg" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                {item.variant && <p className="text-xs text-slateink/50">Variant: {item.variant}</p>}
                <p className="text-sm text-slateink/70">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-sand/30 p-5">
            <h4 className="eyebrow mb-3">Shipping Address</h4>
            <p className="text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-slateink/70">
              {order.shippingAddress.line1}, {order.shippingAddress.line2 && `${order.shippingAddress.line2}, `}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-sm text-slateink/70">{order.shippingAddress.phone}</p>
          </div>

          <div className="bg-sand/30 p-5 text-sm space-y-1">
            <h4 className="eyebrow mb-3">Payment</h4>
            <div className="flex justify-between"><span>Method</span><span>{order.paymentMethod}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{order.shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold border-t border-sand pt-2 mt-2"><span>Total</span><span>₹{order.totalPrice.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
