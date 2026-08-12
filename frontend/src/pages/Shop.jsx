import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);

  const category = searchParams.get("category") || "";
  const keyword = searchParams.get("keyword") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    api.get("/products/categories").then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (keyword) params.set("keyword", keyword);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    params.set("limit", 12);

    api
      .get(`/products?${params.toString()}`)
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, keyword, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <div className="mb-10">
        <span className="eyebrow">Collection</span>
        <h1 className="section-heading mt-1">{category || "Shop All Accessories"}</h1>
        {keyword && <p className="text-sm text-slateink/60 mt-2">Results for "{keyword}"</p>}
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-56 shrink-0">
          <h4 className="eyebrow mb-3">Category</h4>
          <ul className="space-y-2 text-sm mb-8">
            <li>
              <button
                onClick={() => updateParam("category", "")}
                className={`hover:text-brass ${!category ? "text-brass font-semibold" : "text-slateink"}`}
              >
                All Categories
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => updateParam("category", cat)}
                  className={`hover:text-brass ${category === cat ? "text-brass font-semibold" : "text-slateink"}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          <h4 className="eyebrow mb-3">Sort By</h4>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="input-field text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </aside>

        <div className="flex-1">
          {loading ? (
            <p className="text-slateink/60 text-sm">Loading pieces…</p>
          ) : products.length === 0 ? (
            <p className="text-slateink/60 text-sm">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-14">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateParam("page", p)}
                  className={`w-9 h-9 text-sm border ${
                    p === page ? "bg-espresso text-ivory border-espresso" : "border-sand text-slateink hover:border-brass"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
