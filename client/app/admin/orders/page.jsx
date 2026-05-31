"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const STATUSES = ["pending","processing","shipped","delivered","cancelled"];

export default function AdminOrders() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (user && !user.isAdmin) router.push("/");
    if (!user) router.push("/login");
  }, [user]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    api.get("/admin/orders")
      .then(({ data }) => setOrders(data))
      .finally(() => setFetching(false));
  }, [user]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      const { data } = await api.put(`/admin/orders/${id}`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status: data.status } : o));
    } finally { setUpdating(null); }
  };

  if (fetching) return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {[...Array(5)].map((_, i) => <div key={i} className="card h-16 mb-3 animate-pulse bg-bg2" />)}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-8">
        All Orders <span className="text-ink-faint font-sans font-normal text-lg">({orders.length})</span>
      </h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Order ID","Customer","Items","Total","Payment","Status","Date"].map(h => (
                  <th key={h} className="text-left text-xs font-mono text-ink-faint uppercase tracking-wider px-6 py-3 bg-surface2 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-border/60 hover:bg-bg transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-ink-muted">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="text-ink font-medium text-sm">{order.user?.name || "—"}</p>
                    <p className="text-ink-faint text-xs">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-ink-muted">{order.items.length}</td>
                  <td className="px-6 py-4 font-display font-bold text-ink">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${order.paymentStatus === "paid" ? "badge-green" : "badge-yellow"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      disabled={updating === order._id}
                      onChange={(e) => handleStatus(order._id, e.target.value)}
                      className="text-xs font-semibold border border-border rounded-lg px-2 py-1.5 bg-white outline-none cursor-pointer"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-ink-muted text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
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
