"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

const STATUS_COLORS = {
  pending:    "badge-yellow",
  processing: "badge-blue",
  shipped:    "badge-blue",
  delivered:  "badge-green",
  cancelled:  "badge-red",
};

export default function OrdersPage() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const success = searchParams.get("success");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    api.get("/orders/my")
      .then(({ data }) => setOrders(data))
      .finally(() => setFetching(false));
  }, [user]);

  if (fetching) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {[...Array(3)].map((_, i) => <div key={i} className="card h-32 mb-4 animate-pulse bg-bg2" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-sm">Payment Successful!</p>
            <p className="text-xs text-emerald-600">Your order has been placed and confirmed via Stripe.</p>
          </div>
        </div>
      )}
      <h1 className="font-display font-bold text-2xl text-ink mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-ink-muted mb-6">No orders yet.</p>
          <Link href="/" className="btn-blue px-6 py-3">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6 relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-ink-faint mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-ink-faint">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${STATUS_COLORS[order.status] || "badge-gray"}`}>{order.status}</span>
                  <span className={`badge ${order.paymentStatus === "paid" ? "badge-green" : "badge-yellow"}`}>
                    {order.paymentStatus === "paid" ? "✓ Paid" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-ink-muted">{item.name} × {item.quantity}</span>
                    <span className="text-ink">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-between">
                <span className="text-ink-muted text-sm">Total</span>
                <span className="font-display font-bold text-ink">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
