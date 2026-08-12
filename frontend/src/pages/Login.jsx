import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back");
      navigate(location.state?.from || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-24">
      <div className="text-center mb-10">
        <span className="font-display text-2xl font-bold">
          HYRA <span className="text-brass">Mobile</span>
        </span>
        <h1 className="section-heading mt-4">Sign In</h1>
        <p className="text-sm text-slateink/60 mt-2">Welcome back to HYRA Mobile Accessories.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-field"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input-field"
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing In…" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-slateink/60 mt-6">
        New to HYRA?{" "}
        <Link to="/register" className="text-brass underline">
          Create an account
        </Link>
      </p>
      <p className="text-center text-xs text-slateink/40 mt-4">
        Admin demo: admin@hyra.com / admin1234
      </p>
    </div>
  );
};

export default Login;
