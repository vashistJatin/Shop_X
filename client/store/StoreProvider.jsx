"use client";
import { Provider } from "react-redux";
import { store } from "./index";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initCart } from "./cartSlice";
import { initAuth } from "./authSlice";

function Initializer({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initCart());
    dispatch(initAuth());
  }, [dispatch]);
  return children;
}

export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <Initializer>{children}</Initializer>
    </Provider>
  );
}
