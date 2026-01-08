import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../store/thunks/authThunk";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setToast("Please enter your email");
    setLoading(true);
    const res = await dispatch(forgotPassword(email));
    setLoading(false);
    if (res.error) {
      setToast(res.error.message);
      setTimeout(() => setToast(null), 3000);
    } else {
      localStorage.setItem("eventhub_reset_email", email);
      navigate("/verify-otp");
    }
  };

  return (
    <div className="px-4 py-12">
      {toast && <Toast message={toast} />}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
