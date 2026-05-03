import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./layout/AppLayout";

import SplashScreen from "./pages/SplashScreen";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import SavingsPlans from "./pages/SavingsPlans";
import Deposit from "./pages/Deposit";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import CashHistory from "./pages/CashHistory";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>

      <Route path="/" element={<SplashScreen />} />

      {/* No sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* With sidebar */}
      <Route
        path="/app"
        element={user ? <AppLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="plans" element={<SavingsPlans />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="history" element={<CashHistory />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}