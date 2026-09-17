import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import {
  User,
  Mail,
  Calendar,
  Trash2,
  Shield,
  ArrowUpCircle,
  X,
  PlusCircle,
  MapPin,
  Ticket,
  LogOut,
  Clock,
  Tag,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("My Tickets");

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const [showEventModal, setShowEventModal] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [eventData, setEventData] = useState({
    title: "", description: "", date: "", time: "",
    location: "", category: "Music", capacity: "", price: "", image: "",
  });

  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [myTickets, setMyTickets] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) { navigate("/login"); return; }
        const user = JSON.parse(userStr);
        const response = await api.get(`/api/auth/user/${user._id}`);
        setUserData(response.data.user);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (userData?.role === "organizer") {
        setLoadingEvents(true);
        try {
          const token = localStorage.getItem("token");
          const res = await api.get("/api/event/my-events", { headers: { Authorization: `Bearer ${token}` } });
          setMyEvents(res.data.events || []);
        } catch (err) {
          console.error("Failed to fetch my events", err);
        } finally { setLoadingEvents(false); }
      }
    };
    const fetchMyBookings = async () => {
      if (userData) {
        setLoadingBookings(true);
        try {
          const token = localStorage.getItem("token");
          const [bookingsRes, ticketsRes] = await Promise.all([
            api.get("/api/booking/my-bookings", { headers: { Authorization: `Bearer ${token}` } }),
            api.get("/api/tickets/my-tickets", { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          setMyBookings(bookingsRes.data.bookings || []);
          setMyTickets(ticketsRes.data.tickets || []);
        } catch (err) {
          console.error("Failed to fetch bookings", err);
        } finally { setLoadingBookings(false); }
      }
    };
    fetchMyEvents();
    fetchMyBookings();
  }, [userData]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await api.delete(`/api/auth/user/${userData._id}`);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      alert("Failed to delete account");
      console.error(err);
    }
  };

  const handleUpgradeAccount = async () => {
    if (!agreed) return;
    setUpgrading(true);
    try {
      await api.put(`/api/upgrade/organizer`, { userId: userData._id });
      setUserData({ ...userData, role: "organizer" });
      setShowUpgradeModal(false);
      setAgreed(false);
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        u.role = "organizer";
        localStorage.setItem("user", JSON.stringify(u));
      }
    } catch (err) {
      alert("Failed to upgrade account");
      console.error(err);
    } finally { setUpgrading(false); }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreatingEvent(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/api/event/create-event", eventData, { headers: { Authorization: `Bearer ${token}` } });
      setShowEventModal(false);
      setEventData({ title: "", description: "", date: "", time: "", location: "", category: "Music", capacity: "", price: "", image: "" });
      if (res.data.event) setMyEvents((prev) => [...prev, res.data.event]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create event");
    } finally { setCreatingEvent(false); }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/event/${eventId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMyEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-[#8C8880] font-semibold text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl m-4 text-sm font-medium">{error}</div>;
  }

  const TABS = [
    { name: "My Tickets", icon: <Ticket className="w-5 h-5" /> },
    { name: "My Events", icon: <Calendar className="w-5 h-5" />, organizerOnly: true },
    { name: "Profile", icon: <User className="w-5 h-5" /> }
  ];

  const visibleTabs = TABS.filter(tab => !tab.organizerOnly || userData?.role === "organizer");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FAF9F5]">
      
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden md:flex flex-col w-72 h-screen pt-24 sticky top-0 border-r border-[#D9D7D0]/40 bg-[#FFFDF8] shrink-0">
        
        {/* User Profile Header */}
        <div className="p-8 pb-6 border-b border-[#D9D7D0]/40">
          <Link to="/" className="inline-block text-xl font-bold tracking-tight mb-8" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Eventor.
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xl shadow-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <h2 className="text-[#1B1B1B] font-bold truncate leading-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{userData?.name}</h2>
              <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${userData?.role === "organizer" ? "bg-[#FF4B2B]/10 text-[#FF4B2B]" : "bg-[#E9E8E4] text-[#8C8880]"}`}>
                {userData?.role === "organizer" ? <Zap className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                {userData?.role === "organizer" ? "Organizer" : "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-3">Menu</p>
          {visibleTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.name
                  ? "bg-black text-white shadow-md"
                  : "text-[#8C8880] hover:bg-[#E9E8E4] hover:text-[#1B1B1B]"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}

          {/* Organizer Actions */}
          {userData?.role === "organizer" && (
            <div className="pt-8">
              <p className="px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-3">Organizer Tools</p>
              <div className="space-y-2 px-2">
                <button
                  onClick={() => setShowEventModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#FFFDF8] border border-[#D9D7D0] text-[#1B1B1B] px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#E9E8E4] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Create Event
                </button>
                <Link
                  to="/scan"
                  className="w-full flex items-center justify-center gap-2 bg-[#22C55E]/10 text-[#22C55E] px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#22C55E]/20 transition-colors"
                >
                  <Shield className="w-4 h-4" /> Verify Ticket
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D9D7D0]/40">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#8C8880] hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MOBILE NAVIGATION (BOTTOM) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#D9D7D0]/40 z-40 pb-safe">
        <div className="flex justify-around items-center p-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[72px] transition-colors ${
                activeTab === tab.name ? "text-[#1B1B1B]" : "text-[#8C8880]"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-bold">{tab.name.split(" ")[1] || tab.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 h-screen overflow-y-auto pt-24 pb-24 md:pb-10 px-5 md:px-10 lg:px-14">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between mb-8">
          <Link to="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Eventor.
          </Link>
          <button onClick={handleLogout} className="p-2 rounded-full bg-[#E9E8E4] text-[#8C8880] hover:text-red-600">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* ─── MY TICKETS TAB ─── */}
          {activeTab === "My Tickets" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#1B1B1B] tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                    Your Tickets
                  </h1>
                  <p className="text-[#8C8880] text-sm mt-1">Manage and access your upcoming experiences.</p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-[#1B1B1B] text-3xl font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{myBookings.length}</p>
                  <p className="text-[#8C8880] text-[10px] font-bold uppercase tracking-[0.08em]">Total</p>
                </div>
              </div>

              {loadingBookings ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-[#E9E8E4] rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : myBookings.length === 0 ? (
                <div className="text-center py-20 bg-[#FFFDF8] rounded-[2rem] border border-[#D9D7D0]/40">
                  <div className="w-20 h-20 bg-[#E9E8E4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-9 h-9 text-[#BDBAB2]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">No tickets yet</h3>
                  <p className="text-[#8C8880] text-sm mt-1 mb-6">Discover amazing experiences near you.</p>
                  <Link to="/" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors">
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myBookings.map((booking) => {
                    const ticket = myTickets.find((t) => t.booking?._id === booking._id || t.booking === booking._id);
                    const isUsed = ticket?.status === "used";
                    
                    return (
                      <div key={booking._id} className="bg-[#FFFDF8] rounded-2xl border border-[#D9D7D0]/40 overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative sm:w-48 h-48 sm:h-auto shrink-0 bg-[#F4F3EF]">
                          <img src={booking.event?.image} alt={booking.event?.title} className="w-full h-full object-cover" />
                          {isUsed && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                              <span className="px-3 py-1 bg-black/80 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">Used</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isUsed ? "bg-[#E9E8E4] text-[#8C8880]" : "bg-[#22C55E]/15 text-[#22C55E]"}`}>
                                {isUsed ? "Used" : "Valid Pass"}
                              </span>
                              {ticket && (
                                <span className="font-mono text-[#8C8880] text-xs font-bold bg-[#F4F3EF] px-2 py-1 rounded-md border border-[#D9D7D0]/40">
                                  ID: {ticket.ticketId}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-[#1B1B1B] text-xl leading-tight truncate mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                              {booking.event?.title}
                            </h3>
                            <div className="space-y-2">
                              {booking.event?.date && (
                                <p className="flex items-center gap-2 text-[12px] text-[#8C8880] font-medium">
                                  <Calendar className="w-4 h-4 shrink-0 text-[#1B1B1B]" />
                                  {new Date(booking.event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                </p>
                              )}
                              {booking.event?.location && (
                                <p className="flex items-center gap-2 text-[12px] text-[#8C8880] font-medium truncate">
                                  <MapPin className="w-4 h-4 shrink-0 text-[#1B1B1B]" />
                                  {booking.event.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── MY EVENTS TAB (ORGANIZER) ─── */}
          {activeTab === "My Events" && userData?.role === "organizer" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#1B1B1B] tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                    Hosted Events
                  </h1>
                  <p className="text-[#8C8880] text-sm mt-1">Create and manage your experiences.</p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-[#1B1B1B] text-3xl font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{myEvents.length}</p>
                  <p className="text-[#8C8880] text-[10px] font-bold uppercase tracking-[0.08em]">Events</p>
                </div>
              </div>

              {/* Mobile Only Action Buttons */}
              <div className="md:hidden flex gap-3 mb-6">
                <button
                  onClick={() => setShowEventModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-md"
                >
                  <PlusCircle className="w-4 h-4" /> Create
                </button>
                <Link
                  to="/scan"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#22C55E]/10 text-[#22C55E] px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider border border-[#22C55E]/20"
                >
                  <Shield className="w-4 h-4" /> Verify
                </Link>
              </div>

              {loadingEvents ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2].map(i => <div key={i} className="h-48 bg-[#E9E8E4] rounded-2xl animate-pulse" />)}
                </div>
              ) : myEvents.length === 0 ? (
                <div className="text-center py-20 bg-[#FFFDF8] rounded-[2rem] border border-[#D9D7D0]/40">
                  <div className="w-20 h-20 bg-[#E9E8E4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-9 h-9 text-[#BDBAB2]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">No events hosted</h3>
                  <p className="text-[#8C8880] text-sm mt-1 mb-6">Start building your community today.</p>
                  <button onClick={() => setShowEventModal(true)} className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors">
                    Create Event
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {myEvents.map((event) => (
                    <div key={event._id} className="bg-[#FFFDF8] rounded-2xl border border-[#D9D7D0]/40 overflow-hidden flex flex-col shadow-sm group">
                      <div className="h-32 w-full relative overflow-hidden bg-[#F4F3EF]">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${event.image})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <button onClick={() => handleDeleteEvent(event._id)} className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2 left-3 px-2 py-1 rounded bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                          {event.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-[#1B1B1B] text-base mb-2 truncate" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{event.title}</h4>
                          <div className="space-y-1">
                            <span className="flex items-center gap-1.5 text-[11px] text-[#8C8880] font-medium">
                              <Calendar className="w-3.5 h-3.5" /> {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • {event.time}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-[#8C8880] font-medium truncate">
                              <MapPin className="w-3.5 h-3.5" /> {event.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#D9D7D0]/40">
                          <span className="text-[10px] font-bold text-[#8C8880] uppercase tracking-wider">{event.capacity} Capacity</span>
                          <span className="text-sm font-bold text-[#1B1B1B]">
                            {event.price === 0 ? <span className="text-[#22C55E]">Free</span> : `₹${event.price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── PROFILE TAB ─── */}
          {activeTab === "Profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1B1B1B] tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                  Your Profile
                </h1>
                <p className="text-[#8C8880] text-sm mt-1">Manage your personal information and account settings.</p>
              </div>

              <div className="bg-[#FFFDF8] rounded-[2rem] border border-[#D9D7D0]/40 p-6 sm:p-8 space-y-4 shadow-sm mb-8">
                {[
                  { icon: <User className="w-5 h-5" />, label: "Full Name", value: userData?.name },
                  { icon: <Mail className="w-5 h-5" />, label: "Email Address", value: userData?.email },
                  { icon: <Shield className="w-5 h-5" />, label: "Account Role", value: userData?.role, capitalize: true },
                  { icon: <Clock className="w-5 h-5" />, label: "Member Since", value: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—" },
                ].map(({ icon, label, value, capitalize }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 rounded-2xl bg-[#F4F3EF] border border-[#D9D7D0]/30 transition-colors hover:border-[#D9D7D0]/60">
                    <div className="flex items-center gap-4 sm:w-1/3 shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#1B1B1B] flex items-center justify-center shadow-sm">
                        {icon}
                      </div>
                      <p className="text-xs text-[#8C8880] font-bold uppercase tracking-wider">{label}</p>
                    </div>
                    <p className={`text-sm font-bold text-[#1B1B1B] ${capitalize ? "capitalize" : ""}`}>{value || "—"}</p>
                  </div>
                ))}
              </div>

              {/* Upgrade banner */}
              {userData?.role !== "organizer" && (
                <div className="relative overflow-hidden rounded-[2rem] bg-black text-white p-8 shadow-xl mb-8">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#FF4B2B]/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#8A2387]/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                        <Zap className="w-6 h-6 text-[#FF4B2B]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Become an Organizer</h3>
                        <p className="text-[#BDBAB2] text-sm mt-1 max-w-sm">Create and manage your own events. Host concerts, meetups, workshops, and build your community.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full sm:w-auto shrink-0 bg-white text-[#1B1B1B] px-6 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-[#E9E8E4] transition-colors shadow-lg"
                    >
                      Upgrade Account →
                    </button>
                  </div>
                </div>
              )}

              {/* Danger zone */}
              <div className="p-6 rounded-[2rem] border border-red-200 bg-red-50/50">
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-4">Danger Zone</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-[#1B1B1B]">Delete Account</h4>
                    <p className="text-xs text-[#8C8880] mt-1">Permanently delete your data and all associated tickets.</p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 text-[11px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ─── MODALS ─── */}
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-0">
          <div className="bg-[#FFFDF8] rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative border border-[#D9D7D0]/40 animate-in slide-in-from-bottom-8 duration-300">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-5 right-5 text-[#8C8880] hover:text-[#1B1B1B] p-2 rounded-full hover:bg-[#E9E8E4] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
              <ArrowUpCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#1B1B1B] mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Upgrade to Organizer</h3>
            <p className="text-sm text-[#8C8880] mb-8">Unlock the ability to create, manage, and scan tickets for your own events on Eventor.</p>
            
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F3EF] border border-[#D9D7D0]/50 cursor-pointer mb-8 hover:border-[#D9D7D0] transition-colors">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 text-black rounded border-gray-300 focus:ring-black" />
              <span className="text-sm text-[#1B1B1B] font-medium leading-snug">I agree to the Organizer Policy and accept responsibility as an event host.</span>
            </label>
            
            <button
              onClick={handleUpgradeAccount}
              disabled={!agreed || upgrading}
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-black/85 disabled:opacity-40 transition-all shadow-lg"
            >
              {upgrading ? "Processing..." : "Confirm Upgrade"}
            </button>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-0 overflow-y-auto pt-20 pb-20">
          <div className="bg-[#FFFDF8] rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative my-0 sm:my-8 border border-[#D9D7D0]/40 animate-in slide-in-from-bottom-8 duration-300">
            <button onClick={() => setShowEventModal(false)} className="absolute top-5 right-5 text-[#8C8880] hover:text-[#1B1B1B] p-2 rounded-full hover:bg-[#E9E8E4] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-[#1B1B1B] mb-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Create New Event</h3>
            <p className="text-sm text-[#8C8880] mb-8">Fill in the details below to publish your event to the world.</p>

            <form onSubmit={handleCreateEvent} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Event Title *</label>
                  <input type="text" required value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm transition-colors" placeholder="e.g. Summer Music Festival" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Description *</label>
                  <textarea required rows={3} value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none resize-none bg-white text-sm transition-colors" placeholder="What is your event about?" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Date *</label>
                  <input type="date" required value={eventData.date} onChange={(e) => setEventData({ ...eventData, date: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Time *</label>
                  <input type="time" required value={eventData.time} onChange={(e) => setEventData({ ...eventData, time: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Category *</label>
                  <select required value={eventData.category} onChange={(e) => setEventData({ ...eventData, category: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm transition-colors">
                    {["Music", "Sports", "Technology", "Food", "Arts", "Networking", "Gaming", "Wellness", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Total Capacity *</label>
                  <input type="number" min="1" required value={eventData.capacity} onChange={(e) => setEventData({ ...eventData, capacity: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm transition-colors" placeholder="e.g. 100" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Price (₹) *</label>
                  <input type="number" min="0" required value={eventData.price} onChange={(e) => setEventData({ ...eventData, price: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm transition-colors" placeholder="0 for free" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Location / Link *</label>
                  <input type="text" required value={eventData.location} onChange={(e) => setEventData({ ...eventData, location: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm transition-colors" placeholder="Address or Zoom link" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8880] mb-2">Image URL *</label>
                  <input type="url" required value={eventData.image} onChange={(e) => setEventData({ ...eventData, image: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-[#D9D7D0] focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm transition-colors" placeholder="https://example.com/image.jpg" />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEventModal(false)} className="flex-1 py-4 text-[11px] font-bold uppercase tracking-wider text-[#1B1B1B] bg-[#E9E8E4] hover:bg-[#D9D7D0] rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creatingEvent} className="flex-1 py-4 text-[11px] font-bold uppercase tracking-wider bg-black text-white rounded-xl hover:bg-black/85 disabled:opacity-50 transition-colors shadow-lg">
                  {creatingEvent ? "Publishing..." : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
