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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {toast && <Toast message={toast} />}

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your activities</p>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Full Name</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email Address</p>
                <p className="text-lg text-gray-700 mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Role</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-block px-4 py-2 rounded-full font-bold text-white ${
                    user.role === "admin" ? "bg-purple-500" : "bg-blue-500"
                  }`}>
                    {user.role === "admin" ? "👑 Admin" : "👤 Student"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Registrations Section */}
        {user?.role === "student" && (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                📚 My Registrations
              </h2>
              <p className="text-gray-600 text-sm mt-1">View all events you've registered for</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {myRegistrations?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">🎯 No registrations yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Explore events and register to get started!</p>
                </div>
              ) : (
                <EventList events={myRegistrations} />
              )}
            </div>
          </div>
        )}

        {/* Admin Analytics Section */}
        {user?.role === "admin" && analytics && (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                📊 Dashboard Analytics
              </h2>
              <p className="text-gray-600 text-sm mt-1">Overview of your event management platform</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Events Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Events</p>
                    <p className="text-4xl font-bold text-blue-900 mt-2">{analytics.totalEvents}</p>
                  </div>
                  <span className="text-4xl">📅</span>
                </div>
                <p className="text-xs text-blue-700 mt-3">Active events in system</p>
              </div>

              {/* Total Registrations Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Total Registrations</p>
                    <p className="text-4xl font-bold text-green-900 mt-2">{analytics.totalRegistrations}</p>
                  </div>
                  <span className="text-4xl">👥</span>
                </div>
                <p className="text-xs text-green-700 mt-3">Total registrations across all events</p>
              </div>

              {/* Top Event Card - Clickable */}
              <div
                onClick={() => {
                  if (!analytics?.topEvent?.eventId) {
                    alert("Event not found");
                    return;
                  }
                  navigate(`/events/${analytics.topEvent.eventId}`);
                }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Top Event</p>
                    <p className="text-2xl font-bold text-orange-900 mt-2 group-hover:text-orange-700 transition-colors">
                      {analytics.topEvent?.title || "N/A"}
                    </p>
                  </div>
                  <span className="text-4xl">🏆</span>
                </div>
                <p className="text-xs text-orange-700 mt-3">
                  👥 {analytics.topEvent?.count || 0} registrations
                </p>
                <p className="text-xs text-orange-600 mt-2 font-semibold group-hover:text-orange-700">
                  Click to view details →
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🔒 Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
