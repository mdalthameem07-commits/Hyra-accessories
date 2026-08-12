import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const hasDiscount = product.discountPrice > 0;

  return (
    <div className="group">
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-sand/40 aspect-square rounded-xl2">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-oxblood text-ivory text-[10px] tracking-widest2 uppercase px-2 py-1 rounded-full">
            Sale
          </span>
        )}
        {product.countInStock === 0 && (
          <span className="absolute inset-0 bg-espresso/50 flex items-center justify-center text-ivory text-xs tracking-widest2 uppercase rounded-xl2">
            Sold Out
          </span>
        )}
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-display text-lg text-espresso leading-snug hover:text-brass transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slateink/60 uppercase tracking-wide mt-0.5">{product.category}</p>
          <div className="mt-1 flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-sm font-semibold text-oxblood">₹{product.discountPrice}</span>
                <span className="text-xs text-slateink/50 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-espresso">₹{product.price}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => addToCart(product._id, 1)}
          disabled={product.countInStock === 0}
          className="mt-1 shrink-0 border border-espresso w-9 h-9 rounded-full flex items-center justify-center hover:bg-brass hover:border-brass hover:text-ivory transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Add to bag"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
