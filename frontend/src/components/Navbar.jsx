import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/shop?keyword=${encodeURIComponent(query)}` : "/shop");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur border-b border-sand">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            className="md:hidden text-espresso"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-px bg-espresso mb-1.5"></span>
            <span className="block w-6 h-px bg-espresso mb-1.5"></span>
            <span className="block w-6 h-px bg-espresso"></span>
          </button>

          <Link to="/" className="flex flex-col items-center md:items-start group">
            <span className="font-display text-2xl font-bold tracking-tight text-espresso">
              HYRA <span className="text-brass">Mobile</span>
            </span>
            <span className="hidden md:block text-[10px] tracking-widest2 uppercase text-slateink/60 -mt-0.5">
              Accessories
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide uppercase font-medium text-slateink">
            <Link to="/shop" className="hover:text-brass transition-colors">Shop All</Link>
            <Link to="/shop?category=Mobile Covers" className="hover:text-brass transition-colors">Covers</Link>
            <Link to="/shop?category=Tempered Glass" className="hover:text-brass transition-colors">Tempered Glass</Link>
            <Link to="/shop?category=Chargers" className="hover:text-brass transition-colors">Chargers</Link>
            <Link to="/shop?category=Gadgets" className="hover:text-brass transition-colors">Gadgets</Link>
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center border-b border-slateink/40 focus-within:border-brass transition-colors">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="bg-transparent text-sm py-1 px-1 focus:outline-none w-32"
              />
            </form>

            <Link to="/cart" className="relative" aria-label="Shopping bag">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 7h12l1 14H5L6 7Z" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-oxblood text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="text-sm uppercase tracking-wide hover:text-brass transition-colors">
                  {user.name.split(" ")[0]}
                </button>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-white border border-sand shadow-lg w-44 py-2 text-sm">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-sand/50">My Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-sand/50">My Orders</Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-sand/50">Admin Dashboard</Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-sand/50 text-oxblood"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm uppercase tracking-wide hover:text-brass transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-3 pb-5 text-sm uppercase tracking-wide">
            <form onSubmit={handleSearch} className="flex items-center border-b border-slateink/40 mb-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="bg-transparent text-sm py-2 px-1 focus:outline-none w-full"
              />
            </form>
            <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop All</Link>
            <Link to="/shop?category=Mobile Covers" onClick={() => setMenuOpen(false)}>Covers</Link>
            <Link to="/shop?category=Tempered Glass" onClick={() => setMenuOpen(false)}>Tempered Glass</Link>
            <Link to="/shop?category=Chargers" onClick={() => setMenuOpen(false)}>Chargers</Link>
            <Link to="/shop?category=Gadgets" onClick={() => setMenuOpen(false)}>Gadgets</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
