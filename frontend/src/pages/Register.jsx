import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created — welcome to HYRA");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
        <h1 className="section-heading mt-4">Create Account</h1>
        <p className="text-sm text-slateink/60 mt-2">Join HYRA Mobile Accessories.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-field"
        />
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
          placeholder="Password (min. 6 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input-field"
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating Account…" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-slateink/60 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brass underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
