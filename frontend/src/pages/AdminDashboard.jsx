import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const emptyProduct = {
  name: "",
  description: "",
  category: "Mobile Covers",
  price: "",
  discountPrice: "",
  material: "",
  color: "",
  countInStock: "",
  images: "",
  isFeatured: false,
};

const categories = [
  "Mobile Covers",
  "Tempered Glass",
  "Chargers",
  "Cables",
  "Power Banks",
  "Earphones",
  "Smart Watches",
  "Gadgets",
];
const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminDashboard = () => {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    api.get("/products?limit=100").then(({ data }) => setProducts(data.products));
  };
  const loadOrders = () => {
    api.get("/orders").then(({ data }) => setOrders(data.orders));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get("/products?limit=100"), api.get("/orders")])
      .then(([p, o]) => {
        setProducts(p.data.products);
        setOrders(o.data.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      countInStock: Number(form.countInStock),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice,
      material: product.material,
      color: product.color,
      countInStock: product.countInStock,
      images: product.images.join(", "),
      isFeatured: product.isFeatured,
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      loadProducts();
    } catch (err) {
      toast.error("Could not delete product");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      loadOrders();
    } catch (err) {
      toast.error("Could not update order status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <h1 className="section-heading mb-4">Admin Dashboard</h1>

      <div className="flex gap-6 border-b border-sand mb-10 text-sm uppercase tracking-wide">
        <button onClick={() => setTab("products")} className={`pb-3 ${tab === "products" ? "border-b-2 border-brass text-espresso" : "text-slateink/50"}`}>
          Products ({products.length})
        </button>
        <button onClick={() => setTab("orders")} className={`pb-3 ${tab === "orders" ? "border-b-2 border-brass text-espresso" : "text-slateink/50"}`}>
          Orders ({orders.length})
        </button>
      </div>

      {loading ? (
        <p className="text-slateink/60">Loading dashboard…</p>
      ) : tab === "products" ? (
        <div className="grid lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-1 space-y-3 h-fit border border-sand p-6">
            <h3 className="eyebrow mb-2">{editingId ? "Edit Product" : "New Product"}</h3>
            <input required placeholder="Name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <textarea required rows={3} placeholder="Description" className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Price" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input type="number" placeholder="Discount price" className="input-field" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Material" className="input-field" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
              <input placeholder="Color" className="input-field" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <input required type="number" placeholder="Stock quantity" className="input-field" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />
            <input placeholder="Image URLs (comma separated)" className="input-field" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Feature on homepage
            </label>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">{editingId ? "Update" : "Create"}</button>
              {editingId && <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>}
            </div>
          </form>

          <div className="lg:col-span-2 divide-y divide-sand">
            {products.map((p) => (
              <div key={p._id} className="flex items-center gap-4 py-4">
                <img src={p.images?.[0]} alt={p.name} className="w-14 h-14 object-cover bg-sand/40 rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-slateink/50">{p.category} · Stock: {p.countInStock}</p>
                </div>
                <span className="text-sm">₹{p.discountPrice > 0 ? p.discountPrice : p.price}</span>
                <button onClick={() => handleEdit(p)} className="text-xs uppercase text-brass">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-xs uppercase text-oxblood">Delete</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="divide-y divide-sand">
          {orders.map((order) => (
            <div key={order._id} className="flex flex-col md:flex-row md:items-center gap-3 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium">#{order._id.slice(-8)} — {order.user?.name}</p>
                <p className="text-xs text-slateink/50">{order.user?.email} · {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="text-sm font-semibold">₹{order.totalPrice.toFixed(2)}</span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="input-field w-40 text-sm py-2"
              >
                {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
