import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white rounded-t-[3rem] mt-20 overflow-hidden">
      {/* Ambient glows */}
      <div className="relative">
        <div className="absolute -right-32 top-0 w-96 h-96 bg-[#FF4B2B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-32 bottom-0 w-96 h-96 bg-[#8A2387]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="font-bold text-white text-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>E</span>
                </div>
                <span className="font-semibold text-white text-base" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Eventor</span>
              </Link>
              <p className="text-[#8C8880] text-sm leading-relaxed max-w-xs">
                Discover unforgettable experiences and step into the cultural pulse of your city.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-4">Navigation</p>
              <ul className="space-y-3">
                {["About", "Events", "Process", "FAQ", "Contact"].map(item => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-sm text-[#BDBAB2] hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-4">Account</p>
              <ul className="space-y-3">
                {[
                  { label: "Login", to: "/login" },
                  { label: "Sign Up", to: "/signup" },
                  { label: "Dashboard", to: "/dashboard" },
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-[#BDBAB2] hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#8C8880] text-xs">© {new Date().getFullYear()} Eventor. All rights reserved.</p>
            <p className="text-[#8C8880] text-xs">Built with ?? for event lovers</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
