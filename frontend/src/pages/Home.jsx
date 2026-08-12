import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  { name: "Mobile Covers", img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600" },
  { name: "Tempered Glass", img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600" },
  { name: "Chargers", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600" },
  { name: "Earphones", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products?featured=true&limit=8").then(({ data }) => setFeatured(data.products));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-espresso text-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-36 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="eyebrow text-brassLight">New Arrivals</span>
            <h1 className="font-display font-bold text-5xl md:text-6xl leading-[1.05] mt-4">
              Protect it. <span className="text-brassLight">Power it.</span>
            </h1>
            <p className="mt-6 text-ivory/70 max-w-md leading-relaxed">
              Cases, tempered glass, fast chargers, earphones, and everyday
              gadgets — engineered for your device, priced for everyone.
            </p>
            <Link to="/shop" className="btn-primary mt-8">
              Shop the Collection
            </Link>
          </div>
          <div className="relative h-72 md:h-[420px] rounded-xl2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900"
              alt="Mobile accessories flatlay"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow">Explore</span>
            <h2 className="section-heading mt-1">Shop by Category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/shop?category=${cat.name}`} className="group relative overflow-hidden aspect-[3/4] rounded-xl2">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-espresso/25 group-hover:bg-espresso/40 transition-colors"></div>
              <span className="absolute bottom-4 left-4 text-ivory font-display font-semibold text-lg">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow">Best Sellers</span>
            <h2 className="section-heading mt-1">Featured Products</h2>
          </div>
          <Link to="/shop" className="text-sm uppercase tracking-widest2 hover:text-brass border-b border-espresso pb-0.5">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand strip */}
      <section className="bg-sand/50 py-16">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="font-display font-semibold text-xl mb-2">Free Shipping</h3>
            <p className="text-sm text-slateink/70">On all orders over ₹2000</p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-xl mb-2">Genuine Quality</h3>
            <p className="text-sm text-slateink/70">Tested for drop, scratch & fast-charge safety</p>
          </div>
          <div>
            <h3 className="font-display font-semibold text-xl mb-2">Easy Returns</h3>
            <p className="text-sm text-slateink/70">7-day hassle-free returns</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
