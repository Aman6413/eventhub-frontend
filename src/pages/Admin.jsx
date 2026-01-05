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
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    dispatch(fetchEvents(user.token));
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
          </div>

          <div className="mt-4">
            <Button onClick={handleCreateOrUpdate} disabled={!isFormValid}>
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((event) => (
          <div key={event._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-600">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600">
              {event.date} | {event.time}
            </p>
            {event.registrationDeadline && (
              <p className="text-xs text-red-600">
                Deadline: {event.registrationDeadline}
              </p>
            )}
            <div className="mt-3 flex gap-3">
              <Button onClick={() => handleEdit(event)}>Edit</Button>
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
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
