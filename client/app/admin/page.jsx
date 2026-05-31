"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

const STAT_CARDS = [
  { key: "totalRevenue", label: "Total Revenue", prefix: "₹", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { key: "totalOrders",  label: "Total Orders",  color: "text-brand",   bg: "bg-blue-50 border-blue-200" },
  { key: "totalProducts",label: "Products",      color: "text-brand",   bg: "bg-indigo-50 border-indigo-200" },
  { key: "totalUsers",   label: "Users",          color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
];

export default function AdminDashboard() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user && !user.isAdmin) router.push("/");
    if (!user) router.push("/login");
  }, [user]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    Promise.all([api.get("/admin/stats"), api.get("/admin/orders")])
      .then(([s, o]) => { setStats(s.data); setOrders(o.data.slice(0, 5)); });
  }, [user]);

  if (!stats) return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-bg2" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl text-ink">Admin Dashboard</h1>
        <Link href="/admin/products" className="btn-primary text-sm">+ Add Product</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map(({ key, label, prefix = "", color, bg }) => (
          <div key={key} className={`card p-5 border ${bg}`}>
            <p className="section-label mb-2">{label}</p>
            <p className={`font-display font-bold text-2xl ${color}`}>
              {prefix}{key === "totalRevenue" ? stats[key].toLocaleString() : stats[key]}
            </p>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h2 className="font-display font-semibold text-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="text-brand text-sm font-medium hover:text-brand-dark transition-colors">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Order ID","Customer","Amount","Payment","Status","Date"].map(h => (
                  <th key={h} className="text-left text-xs font-mono text-ink-faint uppercase tracking-wider px-6 py-3 bg-surface2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-border/60 hover:bg-bg transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-ink-muted">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-ink font-medium">{order.user?.name || "—"}</td>
                  <td className="px-6 py-4 font-display font-semibold text-ink">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${order.paymentStatus === "paid" ? "badge-green" : "badge-yellow"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${order.status === "delivered" ? "badge-green" : order.status === "pending" ? "badge-yellow" : "badge-blue"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-muted text-xs">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
