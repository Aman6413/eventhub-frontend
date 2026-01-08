import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, changePassword } from "../store/thunks/authThunk";
import { getMyRegistrations } from "../store/thunks/authThunk";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";
import EventList from "../components/EventList";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const myRegistrations = useSelector((state) => state.auth.myRegistrations);

  const [analytics, setAnalytics] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    // Only dispatch on mount, use token as dependency to avoid infinite loops
    dispatch(getProfile(user.token));
    if (user.role === "student") {
      dispatch(getMyRegistrations(user.token));
    }

    if (user.role === "admin") {
      (async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/analytics`, { headers: { Authorization: `Bearer ${user.token}` } });
          setAnalytics(res.data);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [dispatch, user?.token, user?.role]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return setToast("Fill both fields");
    const res = await dispatch(changePassword({ token: user.token, oldPassword, newPassword }));
    if (res.error) {
      setToast(res.error.message);
      setTimeout(() => setToast(null), 3000);
    } else {
      const msg = res.payload?.message || "Password changed successfully";
      setToast(msg);
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4">
      {toast && <Toast message={toast} />}
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Profile</h1>

      {user && (
        <div className="mb-6">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {user?.role === "student" && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">My Registrations</h2>
          {myRegistrations?.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            <EventList events={myRegistrations} />
          )}
        </div>
      )}

      {user?.role === "admin" && analytics && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Admin Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-100 rounded">Total Events: {analytics.totalEvents}</div>
            <div className="p-4 bg-green-100 rounded">Total Registrations: {analytics.totalRegistrations}</div>
            <div
              className="p-4 bg-orange-100 rounded cursor-pointer hover:bg-orange-200 transition"
              onClick={() => {
                if (!analytics?.topEvent?.eventId) {
                  alert("Event not found");
                  return;
                }
                navigate(`/events/${analytics.topEvent.eventId}`);
              }}
            >
              <p className="text-sm text-gray-600">Top Event</p>
              <p className="font-semibold text-blue-700 underline">{analytics.topEvent?.title || 'N/A'}</p>
              <p className="text-sm text-gray-700">👥 {analytics.topEvent?.count || 0}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} className="w-full p-2 border rounded" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full p-2 border rounded" />
          <button className="bg-blue-600 text-white py-2 px-4 rounded">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
