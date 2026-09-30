import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cakes from "./pages/Cakes";
import CakeDetails from "./pages/CakeDetails";
import Customize from "./pages/Customize";
import PickupAvailability from "./pages/PickupAvailability";
import OrderSummary from "./pages/OrderSummary";
import Confirmation from "./pages/Confirmation";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Promotions from "./pages/Promotions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cakes" element={<Cakes />} />
          <Route path="/cakes/:id" element={<CakeDetails />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/pickup" element={<PickupAvailability />} />
          <Route path="/summary" element={<RequireAuth><OrderSummary /></RequireAuth>} />
          <Route path="/confirmation" element={<RequireAuth><Confirmation /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><MyOrders /></RequireAuth>} />
          <Route path="/orders/:id" element={<RequireAuth><OrderDetails /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><OrderHistory /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/about" element={<About />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
