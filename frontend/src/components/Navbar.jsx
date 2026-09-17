import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { name: "About", hash: "#about" },
    { name: "Events", hash: "#events" },
    { name: "Process", hash: "#process" },
    { name: "FAQ", hash: "#faq" },
    { name: "Contact", hash: "#contact" },
  ];

  const handleNavClick = (hash) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="h-20 max-w-[1440px] mx-auto px-6 flex items-center justify-between">

        {/* Logo left */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            to="/"
            className="group flex items-center gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105">
              <span className="font-bold text-white text-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>E</span>
            </div>
            <span className="font-semibold text-[#1B1B1B] text-base tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Eventor
            </span>
          </Link>
        </div>

        {/* Center pill nav — desktop */}
        <div className="pointer-events-auto hidden md:flex items-center h-14 px-3 bg-black/95 backdrop-blur-2xl rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
          <div className="h-4 w-px bg-white/20 mx-2" />
          <nav className="flex items-center gap-1 px-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.hash)}
                className="text-[11px] font-bold text-[#BDBAB2] hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10 uppercase tracking-wider"
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Right actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full bg-[#FFFDF8] text-[#1B1B1B] text-[11px] font-bold uppercase tracking-wider hover:bg-[#E9E8E4] transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full bg-[#E9E8E4] text-[#1B1B1B] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F4F3EF] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-full bg-[#E9E8E4] text-[#1B1B1B] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F4F3EF] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
              >
                Get Tickets
              </Link>
            </>
          )}
          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-1 w-9 h-9 rounded-full bg-[#E9E8E4] flex flex-col items-center justify-center gap-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-4 h-0.5 bg-[#1B1B1B] rounded-full" />
            <span className="block w-4 h-0.5 bg-[#1B1B1B] rounded-full" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden mx-4 mb-2 bg-black/95 backdrop-blur-2xl rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.hash)}
                className="text-left text-xs font-bold text-[#BDBAB2] hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/10 uppercase tracking-wider"
              >
                {link.name}
              </button>
            ))}
            <div className="h-px bg-white/10 my-2" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-left text-sm font-bold text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-sm font-bold text-[#FF4B2B] px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-left text-sm font-bold text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-left text-sm font-bold text-white px-3 py-2 rounded-xl bg-white/10 transition-colors">Get Tickets</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


