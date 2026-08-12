import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const emptyAddress = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  phone: "",
};

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.addresses?.[0] || emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);

  const shipping = cartTotal > 2000 ? 0 : 99;
  const tax = Number((cartTotal * 0.05).toFixed(2));
  const total = (cartTotal + shipping + tax).toFixed(2);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        variant: item.variant,
      }));

      const { data } = await api.post("/orders", {
        orderItems,
        shippingAddress: address,
        paymentMethod,
      });

      await clearCart();
      toast.success("Order placed successfully");
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <p className="text-slateink/60">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <h1 className="section-heading mb-10">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h3 className="eyebrow mb-4">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Full name" className="input-field col-span-2" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
              <input required placeholder="Address line 1" className="input-field col-span-2" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
              <input placeholder="Address line 2 (optional)" className="input-field col-span-2" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
              <input required placeholder="City" className="input-field" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input required placeholder="State" className="input-field" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              <input required placeholder="Postal code" className="input-field" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
              <input required placeholder="Country" className="input-field" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
              <input required placeholder="Phone number" className="input-field col-span-2" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
            </div>
          </div>

          <div>
            <h3 className="eyebrow mb-4">Payment Method</h3>
            <div className="space-y-2">
              {["COD", "Card", "UPI"].map((method) => (
                <label key={method} className="flex items-center gap-3 border border-sand px-4 py-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span className="text-sm">
                    {method === "COD" ? "Cash on Delivery" : method === "Card" ? "Credit / Debit Card" : "UPI"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-sand/30 p-6 h-fit">
          <h3 className="eyebrow mb-4">Order Summary</h3>
          <ul className="space-y-2 mb-4 text-sm">
            {cart.map((item) => (
              <li key={item.product._id + item.variant} className="flex justify-between">
                <span className="text-slateink/70">{item.product.name} × {item.quantity}</span>
                <span>₹{((item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price) * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-sand pt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-sand mt-2">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
          <button type="submit" disabled={placing} className="btn-primary w-full mt-6">
            {placing ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
