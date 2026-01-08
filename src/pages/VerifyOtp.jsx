import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../store/thunks/authThunk";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("eventhub_reset_email") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setToast("No email found. Please start from forgot password.");
    if (!otp) return setToast("Enter OTP");

    setLoading(true);
    const res = await dispatch(verifyOtp({ email, otp }));
    setLoading(false);

    if (res.error) {
      setToast(res.error.message);
      setTimeout(() => setToast(null), 3000);
    } else {
      const { resetToken } = res.payload || {};
      if (resetToken) {
        localStorage.setItem("eventhub_reset_token", resetToken);
        navigate("/reset-password");
      } else {
        setToast("Unexpected response");
      }
    }
  };

  return (
    <div className="px-4 py-12">
      {toast && <Toast message={toast} />}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">OTP sent to {email}</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
