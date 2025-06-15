import React from "react";
import "./App.css";
import Products from "./Products";
import Payments from "./Payments";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./Cart";
import { ProductProvider } from "./ProductContext";
import PaymentMessage from "./PaymentMessage";
import { AuthProvider } from "./AuthContext";
import CartIcon from "./CartIcon";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import OauthGoogle from "./OauthGoogle";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Dashboard />
                  <Products />
                  <CartIcon to="/cart" />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Cart />
                  <CartIcon to="/" />
                </>
              }
            />
            <Route path="/payments" element={<><Dashboard /><Payments /></>} />
            <Route path="/message" element={<PaymentMessage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/oauth/google" element={<OauthGoogle  />} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </AuthProvider>
  );
}
export default App;
