import { Link } from "react-router-dom";
import { MapPin, ArrowRight, CalendarDays, CheckCircle2, Mail, Ticket, Lock, Flame, Bookmark, Tent, Music, Trophy, Laptop, Utensils, Palette, Users, Gamepad2, HeartPulse, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);
  const [dbEvents, setDbEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/event/all");
        if (response.data && response.data.events) {
          setDbEvents(response.data.events);
        }
      } catch (err) {
        console.log("Events API failed", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const faqs = [
    { q: "How do I register for an event?", a: "Simply click on any event, then click 'Buy Tickets'. Create an account or log in, and your ticket will be confirmed instantly." },
    { q: "Are the tickets refundable?", a: "Refund policies vary by event organizer. Please check the individual event page for specific terms." },
    { q: "How do I access my tickets?", a: "All your booked tickets are available in your Dashboard under 'My Tickets'. Each ticket includes a unique QR code for entry." },
    { q: "Can I become an event organizer?", a: "Yes! Sign up and choose the 'Organizer' role. You'll be able to create and manage your own events immediately." },
  ];

  const categories = [
    { icon: <Music className="w-5 h-5" />, name: "Music", desc: "Concerts, festivals, live sessions", count: "320+" },
    { icon: <Trophy className="w-5 h-5" />, name: "Sports", desc: "Matches, marathons, tournaments", count: "180+" },
    { icon: <Laptop className="w-5 h-5" />, name: "Technology", desc: "Hackathons, keynotes, demo days", count: "240+" },
    { icon: <Utensils className="w-5 h-5" />, name: "Food", desc: "Chef tastings, popups, markets", count: "95+" },
    { icon: <Palette className="w-5 h-5" />, name: "Arts", desc: "Galleries, screenings, exhibitions", count: "150+" },
    { icon: <Users className="w-5 h-5" />, name: "Networking", desc: "Founder salons, investor mixers", count: "110+" },
    { icon: <Gamepad2 className="w-5 h-5" />, name: "Gaming", desc: "Tournaments, LANs, VR demos", count: "60+" },
    { icon: <HeartPulse className="w-5 h-5" />, name: "Wellness", desc: "Retreats, breathwork, fitness", count: "75+" },
  ];

  const testimonials = [
    { text: "This platform fundamentally changed how our team discovers events. Absolutely phenomenal experience from booking to entry.", author: "Priya Sharma", company: "TechCorp India" },
    { text: "Flawless execution. The ticket booking felt incredibly smooth and the QR check-in was surprisingly fast.", author: "Arjun Mehta", company: "Innovate Ltd." },
    { text: "The events are curated so well. I walked away from every event with pages of insights to apply immediately.", author: "Sneha Patel", company: "Startup Hub" },
  ];

  // Hero bento: first event is large, next two are stacked small
  const heroEvent = dbEvents[0] || null;
  const heroEventTwo = dbEvents[1] || null;
  const heroEventThree = dbEvents[2] || null;

  const categoryColor = (cat) => {
    const map = { Music: "bg-purple-500", Sports: "bg-green-500", Technology: "bg-blue-500", Food: "bg-orange-500", Other: "bg-gray-500" };
    return map[cat] || "bg-black";
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#FAF9F5]">

      {/* ── AMBIENT GLOW ── */}
      <div className="relative w-full max-w-[1440px] mx-auto px-6 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[980px] h-[380px] bg-gradient-to-r from-[#FF4B2B]/15 via-[#8A2387]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* ── 1. HERO SECTION ── */}
        <section className="relative pt-32 pb-16">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

            {/* Live Pulse Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ebe7e6]/80 backdrop-blur-md shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E] animate-pulse" />
              <span className="text-[10px] font-bold text-[#1B1B1B] uppercase tracking-[0.08em]">
                Eventor Platform • Discover Amazing Experiences
              </span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[82px] font-bold text-[#1B1B1B] tracking-tight leading-[1.05] max-w-4xl" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.04em" }}>
              Find Something Worth{" "}
              <span className="bg-gradient-to-r from-[#1B1B1B] via-[#FF4B2B] to-[#8A2387] bg-clip-text text-transparent">
                Showing Up For.
              </span>
            </h1>

            <p className="text-lg text-[#5e5f5c] mt-6 max-w-2xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Discover unforgettable experiences, connect with creative communities, and step into the cultural pulse of your city.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link
                to="/signup"
                className="h-12 px-8 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.08em] flex items-center gap-2 hover:bg-black/85 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#events"
                className="h-12 px-8 rounded-full bg-[#E9E8E4] text-[#1B1B1B] text-[11px] font-bold uppercase tracking-[0.08em] flex items-center gap-2 hover:bg-[#F4F3EF] transition-all"
              >
                Browse Events
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-[#8C8880] text-[12px] font-semibold tracking-[0.05em]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Verified Organizers</span>
              </div>
              <span className="text-[#D9D7D0]">•</span>
              <div className="flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-[#FF4B2B]" />
                <span>Instant Mobile Passes</span>
              </div>
              <span className="text-[#D9D7D0]">•</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#8A2387]" />
                <span>Secure Booking</span>
              </div>
            </div>
          </div>

          {/* ── BENTO MOSAIC GRID ── */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Large feature card */}
            {loadingEvents ? (
              <>
                <div className="lg:col-span-7 h-[380px] bg-[#E9E8E4] rounded-2xl animate-pulse" />
                <div className="lg:col-span-5 flex flex-col gap-5">
                  <div className="h-[175px] bg-[#E9E8E4] rounded-2xl animate-pulse" />
                  <div className="h-[175px] bg-[#E9E8E4] rounded-2xl animate-pulse" />
                </div>
              </>
            ) : (
              <>
                {/* Main big card */}
                <Link
                  to={heroEvent ? `/event/${heroEvent._id}` : "/"}
                  className="lg:col-span-7 relative group rounded-2xl overflow-hidden bg-[#F0EFEB] shadow-lg min-h-[380px] flex flex-col justify-end p-6 sm:p-8"
                >
                  {heroEvent?.image && (
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${heroEvent.image})` }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="relative z-10 flex items-center justify-between gap-2 mb-auto">
                    {heroEvent && (
                      <span className="px-3 py-1 rounded-full bg-[#FFFDF8]/90 backdrop-blur-md text-[#1B1B1B] text-[10px] font-bold uppercase tracking-[0.08em] shadow-sm">
                        {heroEvent.category}
                      </span>
                    )}
                    {heroEvent && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[12px] font-semibold">
                        <Flame className="w-3 h-3 text-[#FF4B2B]" /> Fast Selling
                      </div>
                    )}
                  </div>
                  <div className="relative z-10 text-white space-y-2 mt-8">
                    {heroEvent && (
                      <div className="flex items-center gap-3 text-[12px] font-semibold text-[#BDBAB2]">
                        <span>{heroEvent.location}</span>
                        <span>•</span>
                        <span>{new Date(heroEvent.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                    <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-xl" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                      {heroEvent ? heroEvent.title : "Upcoming Events Coming Soon"}
                    </h2>
                    <div className="flex items-center justify-between pt-2">
                      {heroEvent && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{heroEvent.price === 0 ? "Free Entry" : `₹${heroEvent.price}`}</span>
                        </div>
                      )}
                      <span className="px-4 py-2 rounded-full bg-white text-[#1B1B1B] text-[10px] font-bold uppercase tracking-[0.08em] hover:bg-[#E9E8E4] transition-colors">
                        Reserve Seat
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Two stacked mini cards */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                  {[heroEventTwo, heroEventThree].map((ev, idx) => (
                    <Link
                      key={idx}
                      to={ev ? `/event/${ev._id}` : "/"}
                      className="relative group rounded-2xl overflow-hidden bg-[#F0EFEB] shadow-md flex-1 min-h-[175px] p-5 flex flex-col justify-end"
                    >
                      {ev?.image && (
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url(${ev.image})` }} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                      <div className="relative z-10 text-white">
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                            {ev?.category || "Event"}
                          </span>
                          {ev && (
                            <span className="text-[12px] font-semibold text-white/80">
                              {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {ev.time}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                          {ev?.title || "More events coming soon"}
                        </h3>
                        {ev && (
                          <p className="text-[12px] font-semibold text-[#BDBAB2] mt-0.5">
                            {ev.location} • {ev.price === 0 ? "Free" : `₹${ev.price}`}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── 2. EXPLORE BY CATEGORY ── */}
        <section className="py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Curated Collections</span>
              <h2 className="text-3xl font-bold text-[#1B1B1B] tracking-tight mt-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                Explore by Category
              </h2>
            </div>
            <a href="#events" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1B1B1B] hover:text-black transition-colors group">
              <span>Browse all events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href="#events"
                className="group p-5 rounded-2xl bg-[#FFFDF8] hover:bg-[#F7F3F2] transition-all duration-300 shadow-sm flex flex-col justify-between h-44 border border-[#D9D7D0]/30"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#E9E8E4] flex items-center justify-center text-xl group-hover:bg-black group-hover:text-white transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#8C8880] tracking-wider">{cat.count} Events</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1B1B1B] group-hover:translate-x-0.5 transition-transform" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    {cat.name}
                  </h3>
                  <p className="text-[12px] text-[#8C8880] mt-0.5">{cat.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── 3. FEATURED EVENTS FROM DB ── */}
        <section id="events" className="py-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Live Geolocation</span>
              <h2 className="text-3xl font-bold text-[#1B1B1B] tracking-tight mt-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                Trending Near You
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingEvents ? (
              [1,2,3,4].map(i => (
                <div key={i} className="bg-[#E9E8E4] rounded-2xl h-72 animate-pulse" />
              ))
            ) : dbEvents.length > 0 ? (
              dbEvents.map((event) => (
                <Link to={`/event/${event._id}`} key={event._id} className="group flex flex-col bg-[#FFFDF8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#D9D7D0]/30">
                  <div className="relative h-52 w-full overflow-hidden bg-[#F0EFEB]">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-8 h-8 rounded-full bg-[#FFFDF8]/90 backdrop-blur-md flex items-center justify-center text-[#1B1B1B] hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer">
                        <Bookmark className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[#8C8880] text-[12px] font-semibold">
                        <span>{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {event.time}</span>
                        <span className="truncate max-w-[80px]">{event.location}</span>
                      </div>
                      <h3 className="text-base font-semibold text-[#1B1B1B] group-hover:text-black transition-colors line-clamp-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                        {event.title}
                      </h3>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#D9D7D0]/40 flex items-center justify-between">
                      <span className="text-base font-bold text-[#1B1B1B]">
                        {event.price === 0 ? <span className="text-[#22C55E]">Free</span> : `₹${event.price}`}
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-[#E9E8E4] text-[#1B1B1B] text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                      >
                        Tickets</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-20">
                <div className="w-20 h-20 bg-[#E9E8E4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#8C8880]"><Tent className="w-10 h-10" /></div>
                <p className="text-[#8C8880] font-semibold">No events yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* ── 4. FEATURED HIGHLIGHT BANNER ── */}
        {dbEvents.length > 0 && (
          <section className="py-8">
            <div className="relative overflow-hidden rounded-2xl bg-black text-white p-8 sm:p-12 shadow-xl">
              <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#FF4B2B]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#8A2387]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[#FF4B2B]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">Featured Mainstage Highlight</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                    {dbEvents[0].title}
                  </h2>
                  <p className="text-[#BDBAB2] text-base max-w-xl leading-relaxed">
                    {dbEvents[0].description?.substring(0, 140)}...
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#BDBAB2]">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(dbEvents[0].date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#BDBAB2]">
                      <MapPin className="w-4 h-4" />
                      {dbEvents[0].location}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#BDBAB2]">Price</span>
                    <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                      {dbEvents[0].price === 0 ? "Free Entry" : `₹${dbEvents[0].price}`}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/event/${dbEvents[0]._id}`}
                      className="flex-1 h-12 rounded-full bg-white text-[#1B1B1B] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#E9E8E4] transition-colors shadow-md"
                    >
                      <span>{dbEvents[0].price === 0 ? "Register Now" : "Get Passes"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 5. HOW IT WORKS ── */}
        <section id="process" className="py-16">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Simple Steps</span>
            <h2 className="text-3xl font-bold text-[#1B1B1B] tracking-tight mt-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
              How It Works
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {[
              { title: "Create an Account", desc: "Sign up in seconds — choose your role as attendee or organizer." },
              { title: "Browse & Discover Events", desc: "Explore curated events across categories and find what speaks to you." },
              { title: "Book Your Ticket", desc: "Secure checkout — get an instant digital ticket with a unique QR code." },
              { title: "Attend & Enjoy", desc: "Show your QR at the door and step into the experience." },
            ].map((step, i) => (
              <div key={i} className="relative flex gap-6 mb-8">
                {/* Vertical ruler */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${i === 0 ? "bg-[#FF4B2B] shadow-[0_0_10px_#FF4B2B60]" : "bg-[#D9D7D0]"}`} />
                  {i < 3 && <div className="w-px flex-1 bg-[#D9D7D0] mt-1" />}
                </div>
                <div className={`pb-8 ${i === 0 ? "opacity-100" : "opacity-60 hover:opacity-100 transition-opacity"}`}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Step 0{i + 1}</span>
                  <h3 className="text-xl font-bold text-[#1B1B1B] mt-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-[#5e5f5c] text-sm mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. TESTIMONIALS ── */}
        <section id="testimonials" className="py-16">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Community</span>
            <h2 className="text-3xl font-bold text-[#1B1B1B] tracking-tight mt-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
              What Attendees Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((review, i) => (
              <div key={i} className="bg-[#FFFDF8] p-8 rounded-2xl border border-[#D9D7D0]/40 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <div className="text-4xl text-[#E9E8E4] font-serif mb-4">"</div>
                  <p className="text-[#5e5f5c] text-sm leading-relaxed font-medium">"{review.text}"</p>
                </div>
                <div className="mt-6 pt-6 border-t border-[#D9D7D0]/40">
                  <p className="font-bold text-[#1B1B1B]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{review.author}</p>
                  <p className="text-[11px] font-bold tracking-wider uppercase text-[#8C8880] mt-0.5">{review.company}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. FAQ ── */}
        <section id="faq" className="py-16 max-w-3xl mx-auto w-full">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Got Questions?</span>
            <h2 className="text-3xl font-bold text-[#1B1B1B] tracking-tight mt-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#FFFDF8] rounded-2xl border border-[#D9D7D0]/40 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-[#1B1B1B] text-base pr-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{faq.q}</span>
                  <span className={`text-[#8C8880] text-2xl font-light transition-transform duration-300 shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="text-[#5e5f5c] text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. ABOUT ── */}
        <section id="about" className="py-16 text-center">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] px-4 py-1.5 rounded-full bg-[#E9E8E4] mb-6">
            Welcome to Eventor
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1B1B1B] max-w-4xl mx-auto leading-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
            The platform for discovering and hosting unforgettable events.
          </h2>
          <p className="mt-8 text-lg text-[#5e5f5c] max-w-3xl mx-auto leading-relaxed">
            Eventor connects passionate event organizers with eager attendees. Whether you're hosting a tech summit, a music festival, or an intimate masterclass — we give you everything you need.
          </p>
        </section>

        {/* ── 9. CONTACT / CTA ── */}
        <section id="contact" className="py-16">
          <div className="relative overflow-hidden rounded-2xl bg-black text-white p-8 sm:p-12 md:p-16 shadow-xl">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#FF4B2B]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#8A2387]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
                  Ready to join the<br />future of events?
                </h2>
                <p className="mt-6 text-[#BDBAB2] text-base leading-relaxed">
                  Get in touch with our team for partnerships, sponsorships, or general inquiries.
                </p>
                <div className="mt-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Email Us</p>
                      <p className="text-white font-bold mt-0.5">hello@eventor.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Find Us</p>
                      <p className="text-white font-bold mt-0.5">Bhubaneswar, Odisha</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl">
                <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-2">Full Name</label>
                    <input type="text" placeholder="Your name" className="w-full px-5 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-[#8C8880] focus:outline-none focus:border-white/40 transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-2">Email Address</label>
                    <input type="email" placeholder="your@email.com" className="w-full px-5 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-[#8C8880] focus:outline-none focus:border-white/40 transition-colors text-sm" />
                  </div>
                  <button type="button" className="w-full bg-white text-[#1B1B1B] rounded-xl py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-[#E9E8E4] transition-all flex items-center justify-center gap-2">
                    Send Message <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


