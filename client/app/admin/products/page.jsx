"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";

const EMPTY = { name:"", description:"", price:"", image:"", category:"Electronics", brand:"", stock:"" };

export default function AdminProducts() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && !user.isAdmin) router.push("/");
    if (!user) router.push("/login");
  }, [user]);

  const fetch = () => api.get("/admin/products").then(({ data }) => setProducts(data));
  useEffect(() => { if (user?.isAdmin) fetch(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) await api.put(`/admin/products/${editing}`, payload);
      else await api.post("/admin/products", payload);
      setForm(EMPTY); setEditing(null); setShowForm(false); fetch();
    } catch (err) { alert(err.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setForm({ name:p.name, description:p.description, price:p.price, image:p.image, category:p.category, brand:p.brand, stock:p.stock });
    setEditing(p._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`); fetch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl text-ink">Products</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }} className="btn-primary text-sm">
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
          <h2 className="font-display font-semibold text-ink mb-6">{editing ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            {[
              { key:"name",  label:"Product Name", placeholder:"iPhone 15 Pro" },
              { key:"brand", label:"Brand",         placeholder:"Apple" },
              { key:"price", label:"Price (₹)",     placeholder:"99999", type:"number" },
              { key:"stock", label:"Stock",          placeholder:"50",    type:"number" },
              { key:"image", label:"Image URL",      placeholder:"https://...", span:true },
            ].map(({ key, label, placeholder, type="text", span }) => (
              <div key={key} className={span ? "md:col-span-2" : ""}>
                <label className="section-label mb-2 block">{label}</label>
                <input className="input" type={type} placeholder={placeholder} required
                  value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="section-label mb-2 block">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Electronics","Fashion","Books","Home","Sports"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="section-label mb-2 block">Description</label>
              <textarea className="input min-h-[80px] resize-none" placeholder="Product description..."
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-blue" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Product","Category","Price","Stock","Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-mono text-ink-faint uppercase tracking-wider px-6 py-3 bg-surface2 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-border/60 hover:bg-bg transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-bg2 flex-shrink-0 border border-border">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <span className="text-ink font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="badge badge-blue">{p.category}</span></td>
                  <td className="px-6 py-4 font-display font-semibold text-ink">₹{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-xs font-semibold ${p.stock > 10 ? "text-green-600" : p.stock > 0 ? "text-amber-600" : "text-red-600"}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(p)} className="text-brand text-xs font-semibold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-500 text-xs font-semibold hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
