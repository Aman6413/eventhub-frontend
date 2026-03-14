import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEvent,
  createEvent,
  updateEvent,
} from "../store/thunks/adminThunk";
import { fetchEvents } from "../store/thunks/eventThunk";
import moment from "moment";
import { getBase64 } from "../utilities/utilities";

const AdminPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const list = useSelector((state) => state.events.list);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    contactNumber: "",
    type: "",
    registrationDeadline: "", 
    maxRegistrations: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!user || !user.token) return;
    dispatch(fetchEvents(user.token));

    // analytics moved to Profile dashboard
  }, [dispatch, user, user.token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setImageError("Image size exceeds 500 KB");
      setImageFile(null);
    } else {
      setImageError("");
      setImageFile(file);
    }
  };

  const handleCreateOrUpdate = async () => {
    const payload = { ...formData };

    // formatting
    payload.date = moment(payload.date).format("DD-MM-YYYY");
    payload.time = moment(payload.time, "HH:mm").format("h:mm A");
    payload.type = payload.type.toUpperCase();

    if (imageFile) {
      payload.imageUrl = await getBase64(imageFile);
    }

    // ensure numeric
    if (payload.maxRegistrations !== undefined && payload.maxRegistrations !== null) {
      payload.maxRegistrations = Number(payload.maxRegistrations);
    }

    if (editingId) {
      await dispatch(
        updateEvent({ id: editingId, data: payload, token: user.token })
      );
    } else {
      await dispatch(createEvent({ data: payload, token: user.token }));
    }

    await dispatch(fetchEvents(user.token));
    resetForm();
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setShowForm(true);

    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: moment(event.date, "DD-MM-YYYY").format("YYYY-MM-DD"),
      time: moment(event.time, "h:mm A").format("HH:mm"),
      location: event.location || "",
      contactNumber: event.contactNumber || "",
      type: event.type || "",
      registrationDeadline: event.registrationDeadline
        ? moment(event.registrationDeadline).format("YYYY-MM-DD")
        : "",
      maxRegistrations: event.maxRegistrations || "",
    });

    setImageFile(null);
    setImageError("");
  };

  const handleDelete = async (id) => {
    await dispatch(deleteEvent({ token: user.token, id }));
    await dispatch(fetchEvents(user.token));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      contactNumber: "",
      type: "",
      registrationDeadline: "",
      maxRegistrations: "",
    });
    setImageFile(null);
    setImageError("");
    setEditingId(null);
    setShowForm(false);
  };

  const isFormValid =
    Object.values(formData).every((val) => val !== "") && imageError === "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            ⚙️ Event Management Dashboard
          </h1>
          <p className="text-gray-600">Create, edit, and manage your events</p>
        </div>

        {/* Create Event Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm((p) => !p)}
            className={`px-6 py-3 font-bold rounded-lg transition-all duration-200 transform hover:scale-105 ${
              showForm
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg"
            }`}
          >
            {showForm ? "❌ Cancel" : "➕ Create New Event"}
          </button>
        </div>

        {/* Create/Edit Event Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "✏️ Edit Event" : "🎉 Create Event"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Event location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
                <input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Contact number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Deadline *</label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Registrations *</label>
                <input
                  type="number"
                  min={1}
                  name="maxRegistrations"
                  value={formData.maxRegistrations}
                  onChange={handleInputChange}
                  placeholder="Maximum registrations"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="cursor-pointer block">
                    <p className="text-gray-600 font-medium">📁 Click to upload image</p>
                    <p className="text-xs text-gray-500 mt-1">Max 500 KB</p>
                  </label>
                  {imageFile && <p className="text-green-600 text-sm mt-2">✓ {imageFile.name}</p>}
                  {imageError && <p className="text-red-600 text-sm mt-2">✗ {imageError}</p>}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCreateOrUpdate}
                disabled={!isFormValid}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? "✅ Update Event" : "➕ Create Event"}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400 transition-all"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📋 Your Events
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((event) => {
              const status = event.eventStatus || "UPCOMING";

              return (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-blue-300"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-grow">{event.title}</h3>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                        status === "UPCOMING"
                          ? "bg-blue-100 text-blue-700"
                          : status === "REGISTRATION_CLOSED"
                          ? "bg-orange-100 text-orange-700"
                          : status === "LIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status === "UPCOMING"
                        ? "🔔 Upcoming"
                        : status === "REGISTRATION_CLOSED"
                        ? "🚫 Closed"
                        : status === "LIVE"
                        ? "✨ Live"
                        : "✅ Done"}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 py-3 border-t border-b border-gray-100 mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">📅 Date:</span> {event.date}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">⏰ Time:</span> {event.time}
                    </p>
                    {event.registrationDeadline && (
                      <p className="text-sm text-red-600">
                        <span className="font-semibold">📌 Deadline:</span> {event.registrationDeadline}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">👥 Registrations:</span> {event.registrationCount || 0} / {event.maxRegistrations || "∞"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {status !== "COMPLETED" && (
                      <button
                        onClick={() => handleEdit(event)}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-sm transition-all"
                      >
                        ✏️ Edit
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {list.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-400 text-lg">🎯 No events yet.</p>
              <p className="text-gray-500 text-sm mt-2">Create your first event using the form above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
