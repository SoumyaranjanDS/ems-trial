import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", { email, password });
      if (response.data && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#FF4B2B]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-[#8A2387]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
            <span className="font-bold text-white text-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>E</span>
          </div>
          <span className="font-semibold text-[#1B1B1B] text-base" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Eventor</span>
        </Link>

        {/* Card */}
        <div className="bg-[#FFFDF8] rounded-[2rem] border border-[#D9D7D0]/40 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-[#1B1B1B] mb-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
            Welcome back
          </h2>
          <p className="text-sm text-[#8C8880] mb-8">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-[#1B1B1B] hover:underline">
              Sign up today
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-3.5 rounded-xl border border-[#D9D7D0]/60 bg-[#FAF9F5] text-[#1B1B1B] placeholder-[#BDBAB2] focus:outline-none focus:border-black transition-colors text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-xl border border-[#D9D7D0]/60 bg-[#FAF9F5] text-[#1B1B1B] placeholder-[#BDBAB2] focus:outline-none focus:border-black transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-2 hover:bg-black/85 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

