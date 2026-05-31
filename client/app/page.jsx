"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Fashion", "Books", "Home", "Sports"];
const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="skeleton aspect-square" />
      <div className="p-4 flex flex-col gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="flex justify-between mt-2">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("newest");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      const { data } = await api.get("/products", { params });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [category, sort]);

  return (
    <div>
      {/* Promo banner */}
      <div className="bg-ink text-white text-center text-xs font-medium py-2.5 tracking-wide">
        🚀 Free delivery on orders above ₹499 —{" "}
        <span className="text-blue-300 font-bold cursor-pointer">Shop Now</span>
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-brand text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
              New Arrivals Just Dropped
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-ink leading-[1.08] tracking-tight mb-5">
              Discover{" "}
              <em className="font-serif not-italic text-brand italic">premium</em>
              <br />products for less
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed mb-8 max-w-lg">
              Top picks across electronics, fashion, books and more — curated for quality, delivered fast.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                className="btn-blue px-7 py-3 text-sm"
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              >
                Shop Now
              </button>
              <button className="btn-ghost px-6 py-3 text-sm">View Deals</button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-border">
              {[
                { num: "20+", label: "Products" },
                { num: "4.8★", label: "Avg Rating" },
                { num: "Free", label: "Delivery" },
                { num: "100%", label: "Secure" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="font-display font-bold text-xl text-ink">{num}</div>
                  <div className="text-xs text-ink-faint font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10" id="products">

        {/* Search */}
        <form
          onSubmit={(e) => { e.preventDefault(); fetchProducts(); }}
          className="flex gap-3 mb-8 max-w-xl"
        >
          <input
            className="input flex-1"
            placeholder="Search products, brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-blue px-5">Search</button>
        </form>

        {/* Filters row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                  category === cat
                    ? "bg-ink text-white border-ink"
                    : "bg-surface text-ink-muted border-border hover:border-border2 hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            className="input w-auto text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-ink-faint font-mono mb-5">
            {products.length} product{products.length !== 1 ? "s" : ""} found
            {category !== "All" ? ` in ${category}` : ""}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-lg text-ink mb-2">No products found</h3>
            <p className="text-ink-muted text-sm">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
