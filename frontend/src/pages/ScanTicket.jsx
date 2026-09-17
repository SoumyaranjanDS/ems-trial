import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Shield,
  Search,
} from "lucide-react";

export default function ScanTicket() {
  const [ticketId, setTicketId] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | success | error
  const [message, setMessage] = useState("");
  const [ticketDetails, setTicketDetails] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setStatus("processing");
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/api/tickets/${ticketId.trim().toUpperCase()}/check-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTicketDetails(response.data.ticket);
      setStatus("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Check-in failed. Invalid or unauthorized.");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
    setTicketDetails(null);
    setTicketId("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 flex justify-center px-4">
      <div className="max-w-md w-full">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 text-center border border-gray-100">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#6366f1]/10 text-[#6366f1] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Ticket</h2>
          </div>

          {/* IDLE */}
          {status === "idle" && (
            <div className="py-4">
              <p className="text-gray-500 mb-8 text-sm">
                Enter the attendee's 8-character Ticket ID to verify and check them in.
              </p>
              
              <form onSubmit={handleVerify}>
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 text-center tracking-widest uppercase font-mono font-bold text-lg bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-gray-400"
                    placeholder="e.g. A1B2C3D4"
                    maxLength={10}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!ticketId.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#6366f1] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#4f46e5] transition-colors shadow-lg disabled:opacity-50"
                >
                  Verify Ticket
                </button>
              </form>
            </div>
          )}

          {/* PROCESSING */}
          {status === "processing" && (
            <div className="py-12">
              <div className="w-14 h-14 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-semibold">Verifying ticket...</p>
            </div>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <div className="py-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-1">Checked In!</h3>
              <p className="text-gray-500 mb-5 text-sm">Ticket verified and marked as used.</p>
              {ticketDetails && (
                <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 mb-6 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Event</p>
                    <p className="font-bold text-gray-900">{ticketDetails.booking?.event?.title || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Attendee</p>
                    <p className="font-bold text-gray-900">{ticketDetails.booking?.user?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</p>
                    <p className="font-bold text-gray-900">{ticketDetails.booking?.user?.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ticket ID</p>
                    <p className="text-xs font-mono text-gray-600 bg-gray-200 px-2 py-1 rounded inline-block mt-1">
                      {ticketDetails.ticketId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Checked in at</p>
                    <p className="font-bold text-gray-900">
                      {ticketDetails.verifiedAt
                        ? new Date(ticketDetails.verifiedAt).toLocaleString()
                        : new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={reset}
                className="w-full bg-[#6366f1] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4f46e5] transition-colors"
              >
                Verify Another Ticket
              </button>
            </div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <div className="py-6">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <XCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">Check-in Failed</h3>
              <p className="text-gray-600 mb-8 text-sm">{message}</p>
              <button
                onClick={reset}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
