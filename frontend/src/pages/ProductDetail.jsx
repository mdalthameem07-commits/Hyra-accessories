import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);

  const loadProduct = () => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data.product);
        if (data.product.variants?.length) setVariant(data.product.variants[0]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      toast.success("Thank you for your review");
      setReviewForm({ rating: 5, comment: "" });
      loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-5 py-24 text-center text-slateink/60">Loading…</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-5 py-24 text-center">Product not found.</div>;

  const hasDiscount = product.discountPrice > 0;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <div className="text-xs text-slateink/50 mb-8 uppercase tracking-wide">
        <Link to="/shop">Shop</Link> / <span>{product.category}</span> / <span className="text-espresso">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-sand/40 overflow-hidden rounded-xl2">
          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <span className="eyebrow">{product.category}</span>
          <h1 className="font-display text-4xl mt-2">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-brass">{"★".repeat(Math.round(product.rating)) || "☆"}</span>
            <span className="text-sm text-slateink/60">({product.numReviews} reviews)</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-semibold text-oxblood">₹{product.discountPrice}</span>
                <span className="text-lg text-slateink/50 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-espresso">₹{product.price}</span>
            )}
          </div>

          <p className="mt-6 text-slateink/80 leading-relaxed">{product.description}</p>

          <dl className="mt-6 text-sm space-y-1 text-slateink/70">
            {product.material && (
              <div className="flex gap-2"><dt className="font-medium text-espresso">Material:</dt><dd>{product.material}</dd></div>
            )}
            {product.color && (
              <div className="flex gap-2"><dt className="font-medium text-espresso">Color:</dt><dd>{product.color}</dd></div>
            )}
            <div className="flex gap-2">
              <dt className="font-medium text-espresso">Availability:</dt>
              <dd>{product.countInStock > 0 ? `${product.countInStock} in stock` : "Sold out"}</dd>
            </div>
          </dl>

          {product.variants?.length > 0 && (
            <div className="mt-6">
              <h4 className="eyebrow mb-2">Variant</h4>
              <div className="flex gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`px-3 py-1.5 text-sm border ${variant === v ? "border-espresso bg-espresso text-ivory" : "border-sand"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-sand">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10">−</button>
              <span className="w-10 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))} className="w-10 h-10">+</button>
            </div>
            <button
              onClick={() => addToCart(product._id, quantity, variant)}
              disabled={product.countInStock === 0}
              className="btn-primary flex-1 disabled:opacity-40 disabled:pointer-events-none"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-24 max-w-2xl">
        <h2 className="section-heading mb-8">Customer Reviews</h2>

        {product.reviews.length === 0 && <p className="text-sm text-slateink/60 mb-8">No reviews yet — be the first to share your thoughts.</p>}

        <div className="space-y-6 mb-10">
          {product.reviews.map((r, idx) => (
            <div key={idx} className="border-b border-sand pb-6">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.name}</span>
                <span className="text-brass text-sm">{"★".repeat(r.rating)}</span>
              </div>
              <p className="text-sm text-slateink/70 mt-2">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={submitReview} className="space-y-4">
            <h4 className="eyebrow">Write a Review</h4>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
              className="input-field w-40"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
            <textarea
              required
              rows={3}
              placeholder="Share your experience with this piece"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="input-field"
            />
            <button type="submit" className="btn-secondary">Submit Review</button>
          </form>
        ) : (
          <p className="text-sm text-slateink/60">
            <Link to="/login" className="text-brass underline">Sign in</Link> to leave a review.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
