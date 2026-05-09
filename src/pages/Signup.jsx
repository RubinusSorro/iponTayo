import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";


import sidePhoto from "../assets/sidephoto.png";


export default function Signup() {
  const { signup, user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function getPasswordStrength(password) {
    if (!password) return { label: "", width: "0%", color: "bg-transparent", text: "" };

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak password",
        width: "33%",
        color: "bg-red-500",
        text: "text-red-500",
      };
    }

    if (score <= 4) {
      return {
        label: "Medium strength",
        width: "66%",
        color: "bg-[#F0A429]",
        text: "text-[#F0A429]",
      };
    }

    return {
      label: "Strong password",
      width: "100%",
      color: "bg-[#21B37A]",
      text: "text-[#21B37A]",
    };
  }

  const passwordStrength = getPasswordStrength(form.password);

  if (user) return <Navigate to="/app" />;
  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
            <div
        className="hidden md:flex w-1/2 items-center justify-center p-10 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${sidePhoto})`,
        }}
      >
            </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-[#F8F5F0] p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1C1C1C]">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Start saving smarter today — it's free
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First name"
                placeholder="Juan"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <Input
                label="Last name"
                placeholder="Dela Cruz"
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            </div>

            <Input
              label="Email address"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <div>
              <label className="text-sm font-semibold text-[#1C1C1C]">
                Password
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-black/10 bg-white px-4 focus-within:border-[#21B37A]">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full py-3 text-[#1C1C1C] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-[#21B37A]"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="mt-2 h-1 rounded-full bg-black/10">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: passwordStrength.width }}
                ></div>
              </div>

              {passwordStrength.label && (
                <p className={`mt-1 text-xs font-semibold ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-[#1C1C1C]">
                Confirm password
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-black/10 bg-white px-4 focus-within:border-[#21B37A]">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="w-full py-3 text-[#1C1C1C] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-[#21B37A]"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                if (form.password !== form.confirmPassword) {
                  toast.error("Passwords do not match.");
                  return;
                }

                setLoading(true);
                try {
                  await signup(form);
                  toast.success("Account created!");
                  navigate("/app");
                } catch (error) {
                  if (error.code === "auth/email-already-in-use") {
                    toast.error("Email is already registered.");
                  } else if (error.code === "auth/weak-password") {
                    toast.error("Password should be at least 6 characters.");
                  } else {
                    toast.error("Something went wrong.");
                  }
                } finally {
                  setLoading(false);
                }
              }}
              className={`w-full rounded-xl py-3 font-bold text-white transition duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#21B37A] hover:bg-[#159A6A]"
              }`}
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="h-px flex-1 bg-black/10"></div>
              or sign up with
              <div className="h-px flex-1 bg-black/10"></div>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  await loginWithGoogle();
                  toast.success("Signed in with Google!");
                  navigate("/app");
                } catch (error) {
                  toast.error("Google sign-in failed.");
                }
              }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/20 py-3 font-semibold text-black hover:bg-black/5"
            >
              {/* Google SVG here */}
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.1 29.7 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.1 29.7 4 24 4 16.3 4 9.7 8.6 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.7-5.2l-6.3-5.2C29.4 35.8 26.9 36.7 24 36.7c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.5 5.3-6.5 6.5l6.3 5.2C39.6 36.1 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-gray-500">
              By signing up you agree to our{" "}
              <span className="text-[#21B37A]">Terms of Service</span> and{" "}
              <span className="text-[#21B37A]">Privacy Policy</span>
            </p>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#21B37A]">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#1C1C1C]">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[#1C1C1C] outline-none focus:border-[#21B37A]"
      />
    </div>
  );
}