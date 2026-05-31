import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    if (typeof window === "undefined") return [];
    const s = localStorage.getItem("cart");
    return s ? JSON.parse(s) : [];
  } catch { return []; }
};

const saveCart = (items) => {
  try { localStorage.setItem("cart", JSON.stringify(items)); } catch {}
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    initCart: (state) => {
      state.items = loadCart();
    },
    addItem: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((i) => i._id === product._id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...product, qty: 1 });
      }
      saveCart(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      saveCart(state.items);
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      if (qty < 1) {
        state.items = state.items.filter((i) => i._id !== id);
      } else {
        const item = state.items.find((i) => i._id === id);
        if (item) item.qty = qty;
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },
  },
});

export const { initCart, addItem, removeItem, updateQty, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems  = (state) => state.cart.items;
export const selectCartCount  = (state) => state.cart.items.reduce((s, i) => s + i.qty, 0);
export const selectCartTotal  = (state) => state.cart.items.reduce((s, i) => s + i.price * i.qty, 0);

export default cartSlice.reducer;
