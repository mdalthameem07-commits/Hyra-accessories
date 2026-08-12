import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const emptyAddress = { fullName: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "India", phone: "" };

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email, password: "" });
  const [addresses, setAddresses] = useState(user.addresses || []);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await updateUserProfile(payload);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/addresses", newAddress);
      setAddresses(data.addresses);
      setNewAddress(emptyAddress);
      toast.success("Address added");
    } catch (err) {
      toast.error("Could not add address");
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const { data } = await api.delete(`/auth/addresses/${index}`);
      setAddresses(data.addresses);
    } catch (err) {
      toast.error("Could not remove address");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-14">
      <h1 className="section-heading mb-10">My Profile</h1>

      <form onSubmit={handleProfileSave} className="space-y-4 mb-14">
        <h3 className="eyebrow">Account Details</h3>
        <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
        <input
          className="input-field"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="New password (leave blank to keep current)"
        />
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <div className="mb-10">
        <h3 className="eyebrow mb-4">Saved Addresses</h3>
        {addresses.length === 0 && <p className="text-sm text-slateink/60 mb-4">No saved addresses yet.</p>}
        <div className="space-y-3 mb-6">
          {addresses.map((addr, idx) => (
            <div key={idx} className="border border-sand p-4 flex justify-between items-start">
              <div className="text-sm">
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-slateink/70">{addr.line1}, {addr.city}, {addr.state} {addr.postalCode}</p>
                <p className="text-slateink/70">{addr.phone}</p>
              </div>
              <button onClick={() => handleDeleteAddress(idx)} className="text-xs text-oxblood uppercase">Remove</button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddAddress} className="grid grid-cols-2 gap-3">
          <input required placeholder="Full name" className="input-field col-span-2" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
          <input required placeholder="Address line 1" className="input-field col-span-2" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
          <input required placeholder="City" className="input-field" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
          <input required placeholder="State" className="input-field" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
          <input required placeholder="Postal code" className="input-field" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
          <input required placeholder="Phone" className="input-field" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
          <button type="submit" className="btn-secondary col-span-2">Add Address</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
