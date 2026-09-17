import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { CalendarDays, MapPin, Clock, Tag, ArrowLeft, Ticket, Users, AlertTriangle } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [remainingCapacity, setRemainingCapacity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/api/event/${id}`);
        setEvent(response.data.event);
        setRemainingCapacity(response.data.remainingCapacity);
      } catch (err) {
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] pt-24 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-3 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#8C8880] font-semibold text-sm">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] pt-24 flex justify-center items-center px-4">
        <div className="bg-[#FFFDF8] p-10 rounded-[2rem] border border-[#D9D7D0]/40 text-center max-w-sm w-full">
          <div className="flex justify-center mb-4 text-[#8C8880]"><AlertTriangle className="w-12 h-12" /></div>
          <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Oops!</h2>
          <p className="text-[#8C8880] mb-6 text-sm">{error || "Something went wrong."}</p>
          <Link to="/" className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors w-full">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const soldOut = remainingCapacity === 0;
  const capacityPct = event.capacity > 0 ? Math.round(((event.capacity - (remainingCapacity ?? 0)) / event.capacity) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FAF9F5] pt-20 pb-20">
      {/* Hero image */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-6 left-6">
          <Link to="/" className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <span className="px-3 py-1 rounded-full bg-[#FFFDF8]/90 backdrop-blur-md text-[#1B1B1B] text-[10px] font-bold uppercase tracking-[0.08em] mb-3 inline-block">
            {event.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left — description */}
          <div className="md:col-span-7">
            <div className="bg-[#FFFDF8] rounded-[2rem] border border-[#D9D7D0]/40 shadow-sm p-8">
              <h2 className="text-xl font-bold text-[#1B1B1B] mb-5" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>About this event</h2>
              <div className="text-[#5e5f5c] text-sm leading-relaxed space-y-4">
                {event.description.split("\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Meta pills */}
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: <CalendarDays className="w-4 h-4" />, text: new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                  { icon: <Clock className="w-4 h-4" />, text: event.time },
                  { icon: <MapPin className="w-4 h-4" />, text: event.location },
                  { icon: <Tag className="w-4 h-4" />, text: event.price === 0 ? "Free Entry" : `₹${event.price}` },
                  { icon: <Users className="w-4 h-4" />, text: `${remainingCapacity ?? "?"} / ${event.capacity} seats left` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0EFEB] text-[#1B1B1B] text-[12px] font-semibold">
                    <span className="text-[#8C8880]">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — booking card */}
          <div className="md:col-span-5">
            <div className="bg-[#FFFDF8] rounded-[2rem] border border-[#D9D7D0]/40 shadow-sm p-8 sticky top-28">
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880] mb-1">Price</p>
                <p className="text-4xl font-bold text-[#1B1B1B]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  {event.price === 0 ? <span className="text-[#22C55E]">Free</span> : `₹${event.price}`}
                </p>
              </div>

              {/* Capacity bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8C8880]">Availability</span>
                  <span className="text-[12px] font-bold text-[#1B1B1B]">{soldOut ? "Sold Out" : `${remainingCapacity} left`}</span>
                </div>
                <div className="w-full h-1.5 bg-[#E9E8E4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF4B2B] to-[#8A2387] transition-all duration-500"
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#8C8880] mt-1">{capacityPct}% filled</p>
              </div>

              <button
                onClick={() => {
                  if (!localStorage.getItem("token")) {
                    alert("Please login first to book a ticket.");
                    return;
                  }
                  setShowConfirmModal(true);
                }}
                disabled={soldOut}
                className="w-full h-12 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-2 hover:bg-black/85 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:bg-[#D9D7D0] disabled:text-[#8C8880] disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Ticket className="w-4 h-4" />
                {soldOut ? "Sold Out" : event.price === 0 ? "Register Now" : "Buy Ticket"}
              </button>
              <p className="text-center text-[11px] text-[#BDBAB2] mt-4 font-medium">Secure checkout powered by Eventor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#FFFDF8] rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-[#D9D7D0]/40 relative text-center">
            {bookingSuccess ? (
              <>
                <div className="w-16 h-16 bg-[#E9E8E4] text-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#1B1B1B] mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Booking Confirmed!</h3>
                <p className="text-[#8C8880] mb-4 text-sm">Your ticket has been successfully booked.</p>
                {qrCode && (
                  <div className="mb-6 flex justify-center">
                    <img src={qrCode} alt="Ticket QR Code" className="w-48 h-48 border-4 border-[#E9E8E4] rounded-2xl" />
                  </div>
                )}
                <button onClick={() => { setShowConfirmModal(false); setBookingSuccess(false); }}
                  className="w-full h-12 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black/85 transition-colors">
                  Awesome!
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-[#1B1B1B] mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Confirm Booking</h3>
                <p className="text-[#8C8880] mb-6 text-sm">
                  You are about to book 1 ticket for<br />
                  <span className="font-bold text-[#1B1B1B]">{event.title}</span>
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmModal(false)}
                    className="flex-1 h-11 rounded-full bg-[#E9E8E4] text-[#1B1B1B] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F0EFEB] transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setBooking(true);
                      try {
                        const token = localStorage.getItem("token");
                        const res = await api.post("/api/booking/create", { eventId: event._id }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setRemainingCapacity(prev => prev - 1);
                        setQrCode(res.data.qrCode);
                        setBookingSuccess(true);
                      } catch (err) {
                        alert(err.response?.data?.message || "Booking failed");
                        setShowConfirmModal(false);
                      } finally {
                        setBooking(false);
                      }
                    }}
                    disabled={booking}
                    className="flex-1 h-11 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black/85 disabled:opacity-50 transition-colors">
                    {booking ? "Processing..." : "Confirm & Pay"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


