import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEvent,
  createEvent,
  updateEvent,
} from "../store/thunks/adminThunk";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../store/thunks/eventThunk";
import moment from "moment";
import { getBase64 } from "../utilities/utilities";
import axios from "axios";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, auth } = useSelector((state) => ({
    events: state.events,
    auth: state.auth,
  }));

  const { user } = auth;
  const { list } = events;

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
    registrationDeadline: "", // 🔥 NEW
    maxRegistrations: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents(user.token));

    const fetchAnalytics = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/analytics`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAnalytics(res.data);
    };

    fetchAnalytics();
  }, [dispatch, user.token]);

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
    <div className="max-w-5xl mx-auto mt-8 p-4">
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-100 rounded shadow">
            <p className="text-sm text-gray-600">Total Events</p>
            <p className="text-2xl font-bold">{analytics.totalEvents}</p>
          </div>

          <div className="p-4 bg-green-100 rounded shadow">
            <p className="text-sm text-gray-600">Total Registrations</p>
            <p className="text-2xl font-bold">{analytics.totalRegistrations}</p>
          </div>

          <div
            className="p-4 bg-orange-100 rounded shadow cursor-pointer hover:bg-orange-200 transition"
            onClick={() => {
              if (!analytics?.topEvent?._id) {
                alert("Event not found");
                return;
              }
              navigate(`/events/${analytics.topEvent._id}`);
            }}
          >
            <p className="text-sm text-gray-600">Top Event</p>

            <p className="font-semibold text-blue-700 underline">
              {analytics.topEvent?.title || "N/A"}
            </p>

            <p className="text-sm text-gray-700">
              👥 {analytics.topEvent?.count || 0}
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Admin - Manage Events
      </h1>

      <Button onClick={() => setShowForm((p) => !p)}>
        {showForm ? "Cancel" : "Create New Event"}
      </Button>

      {showForm && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="text-xl mb-3">
            {editingId ? "Edit Event" : "Create Event"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="p-2 border rounded"
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="p-2 border rounded"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="p-2 border rounded"
            />
            <input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className="p-2 border rounded"
            />

            {/* 🔥 DEADLINE FIELD */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Registration Deadline
              </label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className="p-2 border rounded"
              />
            </div>

            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="p-2 border rounded"
            >
              <option value="">Select Type</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 border rounded"
            />

            {/* Max Registrations */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Max Registrations
              </label>
              <input
                type="number"
                min={1}
                name="maxRegistrations"
                value={formData.maxRegistrations}
                onChange={handleInputChange}
                className="p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleCreateOrUpdate} disabled={!isFormValid}>
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((event) => {
          const status = event.eventStatus || "UPCOMING";

          return (
            <div key={event._id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.date} | {event.time}</p>
                  {event.registrationDeadline && (
                    <p className="text-xs text-red-600">Deadline: {event.registrationDeadline}</p>
                  )}
                </div>

                <span className={`text-xs px-2 py-1 rounded ${
                  status === "UPCOMING"
                    ? "bg-blue-100 text-blue-600"
                    : status === "REGISTRATION_CLOSED"
                    ? "bg-orange-100 text-orange-600"
                    : status === "LIVE"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {status === "UPCOMING" ? "Upcoming" : status === "REGISTRATION_CLOSED" ? "Registration Closed" : status === "LIVE" ? "Live" : "Completed"}
                </span>
              </div>

              <div className="mt-3 flex gap-3">
                {status !== "COMPLETED" && (
                  <Button onClick={() => handleEdit(event)}>Edit</Button>
                )}

                <Button
                  className="bg-red-500"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </Button>

                <Button
                  className="bg-green-600"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  Open
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPage;
