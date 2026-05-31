"use client";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";
import { useState } from "react";

function Stars({ rating }) {
  return (
    <div className="flex gap-px">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addItem(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={`/product/${product._id}`} className="card group overflow-hidden flex flex-col hover:shadow-card-hover hover:-translate-y-1 transition-all duration-250 hover:border-border2">
      <div className="relative overflow-hidden aspect-square bg-bg2">
        <Image src={product.image} alt={product.name} fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw" />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-ink-muted bg-white border border-border px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-semibold bg-white text-ink-muted border border-border px-2 py-0.5 rounded-md">{product.category}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-widest">{product.brand}</p>
        <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2 group-hover:text-brand transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-ink-faint">{product.rating} ({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="font-display font-bold text-lg text-ink tracking-tight">₹{product.price.toLocaleString()}</span>
          <button onClick={handleAdd} disabled={product.stock === 0}
            className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200 border-0
              ${added ? "bg-emerald-600 text-white" : "bg-ink text-white hover:bg-ink2 disabled:opacity-40 disabled:cursor-not-allowed"}`}>
            {added ? "✓ Added" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
