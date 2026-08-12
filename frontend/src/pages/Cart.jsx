import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <h1 className="section-heading mb-4">Your Bag is Empty</h1>
        <p className="text-slateink/60 mb-8">Discover pieces that complete your look.</p>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <h1 className="section-heading mb-10">Your Bag</h1>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 divide-y divide-sand">
          {cart.map((item) => (
            <div key={item.product._id + item.variant} className="flex gap-4 py-6">
              <Link to={`/product/${item.product.slug}`} className="w-24 h-24 bg-sand/40 shrink-0 rounded-lg overflow-hidden">
                <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <Link to={`/product/${item.product.slug}`} className="font-display text-lg hover:text-brass">
                      {item.product.name}
                    </Link>
                    {item.variant && <p className="text-xs text-slateink/50 mt-0.5">Variant: {item.variant}</p>}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-xs text-oxblood uppercase tracking-wide"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-sand">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.variant)}
                      className="w-8 h-8"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.variant)}
                      className="w-8 h-8"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold">
                    ₹{((item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-sand/30 p-6 h-fit">
          <h3 className="eyebrow mb-4">Order Summary</h3>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-slateink/50 mb-4">Shipping & taxes calculated at checkout.</p>
          <button onClick={() => navigate("/checkout")} className="btn-primary w-full">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
