import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { ShieldCheck, ShieldAlert, ArrowLeft } from "lucide-react";

export default function VerifyTicket() {
  const { ticketId } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/api/tickets/verify/${ticketId}`);
        setTicketData(response.data.ticket);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or cancelled ticket.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-[#f8fafc]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-gray-500 font-medium">Verifying Ticket...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 flex justify-center px-4">
      <div className="max-w-md w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
        <div className="bg-white rounded-[2rem] shadow-xl p-8 text-center border border-gray-100">
          {error || (ticketData && ticketData.status === "used") ? (
            <>
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Invalid Ticket</h2>
              <p className="text-red-500 font-medium mb-8">{error || "Ticket has already been used."}</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ticket Verified</h2>
              <p className="text-emerald-600 font-medium mb-8">This is a valid ticket.</p>
              
              <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100 mb-8 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Event</p>
                  <p className="text-lg font-bold text-gray-900">{ticketData?.booking?.event?.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Attendee</p>
                  <p className="text-lg font-bold text-gray-900">{ticketData?.booking?.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ticket ID</p>
                  <p className="text-sm font-mono text-gray-600 bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                    {ticketData?.ticketId}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <p className="text-sm text-yellow-800 font-medium">
              Note: You are not the organizer. You foolish human! Only organizers can check-in tickets from their dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
