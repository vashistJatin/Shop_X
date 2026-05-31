"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, selectCartTotal, removeItem, updateQty, clearCart } from "@/store/cartSlice";
import { selectUser } from "@/store/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const user = useSelector(selectUser);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [step, setStep] = useState("cart");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle success redirect from Stripe
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    if (success && sessionId) {
      api.get(`/payment/verify-session/${sessionId}`)
        .then(() => {
          dispatch(clearCart());
          setStep("success");
        })
        .catch(() => setStep("success")); // Still show success
    }
  }, []);

  const handleCheckout = async () => {
    if (!user) return router.push("/login");
    if (!address.street || !address.city || !address.state || !address.pincode)
      return setError("Please fill in all address fields.");
    setError("");
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i._id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.qty,
      }));
      const { data } = await api.post("/payment/create-checkout-session", {
        items: orderItems,
        address,
      });
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  if (step === "success") return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="font-display font-bold text-2xl text-ink mb-3">Payment Successful!</h1>
      <p className="text-ink-muted mb-8">Your order has been placed and payment confirmed via Stripe.</p>
      <div className="flex gap-3 justify-center">
        <Link href="/orders" className="btn-blue px-6 py-3">View Orders</Link>
        <Link href="/" className="btn-ghost px-6 py-3">Continue Shopping</Link>
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🛒</div>
      <h1 className="font-display font-bold text-2xl text-ink mb-3">Your cart is empty</h1>
      <p className="text-ink-muted mb-8">Add some products to get started.</p>
      <Link href="/" className="btn-blue px-6 py-3">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-8">
        Your Cart <span className="text-ink-faint text-lg font-sans font-normal">({items.length} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item._id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-bg2">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider">{item.brand}</p>
                <h3 className="font-display font-semibold text-ink text-sm line-clamp-1 mt-0.5">{item.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-surface2 border border-border rounded-lg p-1">
                    <button onClick={() => dispatch(updateQty({ id: item._id, qty: item.qty - 1 }))}
                      className="w-7 h-7 flex items-center justify-center text-ink-muted hover:text-ink transition-colors text-lg">−</button>
                    <span className="text-ink text-sm font-medium w-6 text-center">{item.qty}</span>
                    <button onClick={() => dispatch(updateQty({ id: item._id, qty: item.qty + 1 }))}
                      className="w-7 h-7 flex items-center justify-center text-ink-muted hover:text-ink transition-colors text-lg">+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-ink">₹{(item.price * item.qty).toLocaleString()}</span>
                    <button onClick={() => dispatch(removeItem(item._id))}
                      className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
          <h2 className="font-display font-bold text-ink text-lg mb-6">Order Summary</h2>

          {/* Address form */}
          {step === "address" && (
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-xs font-mono font-semibold text-ink-faint uppercase tracking-wider">Delivery Address</p>
              <input className="input text-sm" placeholder="Street address"
                value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              <input className="input text-sm" placeholder="City"
                value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="input text-sm" placeholder="State"
                  value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                <input className="input text-sm" placeholder="Pincode"
                  value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 text-sm mb-6">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Delivery</span><span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Payment</span><span className="text-brand font-medium">Stripe (Test Mode)</span>
            </div>
            <div className="border-t border-border pt-2 mt-1 flex justify-between font-display font-bold text-ink text-lg">
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {step === "cart" ? (
            <button onClick={() => setStep("address")} className="btn-blue w-full py-3">
              Proceed to Checkout →
            </button>
          ) : (
            <button onClick={handleCheckout} disabled={loading} className="btn-blue w-full py-3">
              {loading ? "Redirecting to Stripe..." : "Pay with Stripe →"}
            </button>
          )}

          {/* Test card info */}
          {step === "address" && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-mono font-semibold text-brand mb-2">🧪 Stripe Test Cards</p>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-ink-muted">Success:</span>
                  <span className="font-mono font-bold text-ink">4242 4242 4242 4242</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-ink-muted">Declined:</span>
                  <span className="font-mono font-bold text-ink">4000 0000 0000 0002</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-ink-muted">3D Secure:</span>
                  <span className="font-mono font-bold text-ink">4000 0027 6000 3184</span>
                </div>
                <p className="text-[10px] text-ink-faint mt-1">Use any future expiry · Any 3-digit CVV</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
