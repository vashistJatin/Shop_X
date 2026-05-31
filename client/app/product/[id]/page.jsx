"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/cartSlice";
import { selectUser } from "@/store/authSlice";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) dispatch(addItem(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, review);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: "" });
    } catch (err) { alert(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  if (!product) return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-bg2 rounded-2xl animate-pulse" />
        <div className="flex flex-col gap-4">{[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-bg2 rounded-xl animate-pulse" />)}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-bg2 border border-border">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
          <div className="absolute top-4 left-4">
            <span className="badge badge-gray">{product.category}</span>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-widest mb-2">{product.brand}</p>
            <h1 className="font-display font-bold text-3xl text-ink mb-3 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-ink-muted text-sm">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
            <p className="text-ink-muted text-sm leading-relaxed">{product.description}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-4xl text-ink">₹{product.price.toLocaleString()}</span>
            <span className="text-green-600 text-sm font-medium">Free Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
            <span className="text-sm text-ink-muted">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-surface2 border border-border rounded-xl px-4 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-ink-muted hover:text-ink transition-colors text-lg">−</button>
                <span className="text-ink font-medium w-8 text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="text-ink-muted hover:text-ink transition-colors text-lg">+</button>
              </div>
              <button onClick={handleAdd}
                className={`btn-blue flex-1 py-3 ${added ? "!bg-emerald-600" : ""}`}>
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            {[["Category", product.category],["Brand", product.brand || "—"],["Reviews", product.numReviews],["Rating", `${product.rating.toFixed(1)} / 5`]].map(([label, value]) => (
              <div key={label}>
                <p className="section-label mb-1">{label}</p>
                <p className="text-ink text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display font-bold text-xl text-ink mb-6">Reviews <span className="text-ink-faint font-sans font-normal text-base">({product.numReviews})</span></h2>
          {product.reviews.length === 0 ? (
            <p className="text-ink-muted text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {product.reviews.map((r, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-ink text-sm">{r.name}</span>
                    <div className="flex">{[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3 h-3 ${s <= r.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}</div>
                  </div>
                  <p className="text-ink-muted text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {user && (
          <div>
            <h2 className="font-display font-bold text-xl text-ink mb-6">Write a Review</h2>
            <form onSubmit={handleReview} className="card p-5 flex flex-col gap-4">
              <div>
                <label className="section-label mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReview({ ...review, rating: s })}>
                      <svg className={`w-6 h-6 transition-colors ${s <= review.rating ? "text-amber-400" : "text-gray-200 hover:text-amber-300"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="section-label mb-2 block">Comment</label>
                <textarea className="input resize-none min-h-[100px]" placeholder="Share your experience..."
                  value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
              </div>
              <button type="submit" className="btn-blue" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
