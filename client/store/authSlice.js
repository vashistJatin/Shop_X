import { createSlice } from "@reduxjs/toolkit";

const loadUser = () => {
  try {
    if (typeof window === "undefined") return null;
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    initAuth: (state) => {
      state.user = loadUser();
    },
    setUser: (state, action) => {
      state.user = action.payload;
      try { localStorage.setItem("user", JSON.stringify(action.payload)); } catch {}
    },
    logout: (state) => {
      state.user = null;
      try { localStorage.removeItem("user"); } catch {}
    },
  },
});

export const { initAuth, setUser, logout } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export default authSlice.reducer;
