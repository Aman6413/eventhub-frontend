import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../store/thunks/authThunk";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetToken = localStorage.getItem("eventhub_reset_token") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirm) return setToast("Please fill both fields");
    if (password !== confirm) return setToast("Passwords do not match");
    if (!resetToken) return setToast("No reset token found");

    setLoading(true);
    const res = await dispatch(resetPassword({ resetToken, newPassword: password }));
    setLoading(false);

    if (res.error) {
      setToast(res.error.message);
      setTimeout(() => setToast(null), 3000);
    } else {
      localStorage.removeItem("eventhub_reset_token");
      localStorage.removeItem("eventhub_reset_email");
      navigate("/login");
    }
  };

  return (
    <div className="px-4 py-12">
      {toast && <Toast message={toast} />}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
