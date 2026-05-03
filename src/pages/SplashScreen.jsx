import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ipontayologo.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      navigate("/login");
      return;
    }

    sessionStorage.setItem("hasSeenSplash", "true");

    const timer = setTimeout(() => {
      navigate("/login");
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#151515]">
      {/* Left split */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-120%" }}
        transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
        className="absolute left-0 top-0 z-20 h-full w-1/2 bg-[#151515]"
      />

      {/* Right split */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "120%" }}
        transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
        className="absolute right-0 top-0 z-20 h-full w-1/2 bg-[#151515]"
      />

      {/* Center logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.5, 1, 1, 8],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2.7,
          times: [0, 0.3, 0.65, 1],
          ease: "easeInOut",
        }}
        className="z-30 flex flex-col items-center"
      >
        <img
          src={logo}
          alt="iponTayo logo"
          className="h-40 w-40 object-contain"
        />

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-5 text-3xl font-bold text-white"
        >
          <span className="text-[#21B37A]">ipon</span>Tayo
        </motion.h1>
      </motion.div>
    </div>
  );
}