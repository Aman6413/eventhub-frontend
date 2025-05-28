// Updated AdminPage.js
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

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    contactNumber: "",
    type: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { user } = auth;
  const { list } = events;

  useEffect(() => {
    dispatch(fetchEvents(user.token));
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setImageError("Image size exceeds 500 KB.");
        setImageFile(null);
      } else {
        setImageFile(file);
        setImageError("");
      }
    } else {
      setImageFile(null);
      setImageError("Please select an image.");
    }
  };

  const handleCreateOrUpdate = async () => {
    if (formData.date)
      formData.date = moment(formData.date).format("DD-MM-YYYY");
    if (formData.time)
      formData.time = moment(formData.time, "HH:mm").format("h:mm A");
    if (formData.type) formData.type = formData.type.toUpperCase();

    if (imageFile) {
      const imgBase64 = await getBase64(imageFile);
      formData.imageUrl = imgBase64;
    }

    if (editingId) {
      dispatch(updateEvent({ id: editingId, data: formData }));
    } else {
      await dispatch(createEvent({ data: formData, token: user.token }));
      await dispatch(fetchEvents(user.token));
    }
    resetForm();
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      contactNumber: event.contactNumber,
      type: event.type,
    });
    setShowForm(true);
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
    });
    setImageFile(null);
    setImageError("");
    setShowForm(false);
    setEditingId(null);
  };

  const isFormValid =
    Object.values(formData).every((val) => val.trim() !== "") &&
    imageFile !== null &&
    imageError === "";

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Admin - Manage Events
      </h1>

      <Button onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? "Cancel" : "Create New Event"}
      </Button>

      {showForm && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="text-xl mb-2">
            {editingId ? "Edit Event" : "Create Event"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="p-2 border rounded"
            />
            <input
              type="text"
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
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className="p-2 border rounded"
            />
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

            <div>
              <label className="block mb-1 font-semibold">
                Image (Max 500 KB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="p-2 border rounded w-full"
              />
              {imageError && (
                <p className="text-red-600 text-sm mt-1">{imageError}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleCreateOrUpdate}
              disabled={!isFormValid}
              className={!isFormValid ? "bg-gray-300 cursor-not-allowed" : ""}
            >
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
            <p className="text-gray-700">{event.description}</p>
            <div className="mt-3 flex gap-3">
              <Button onClick={() => handleEdit(event)}>Edit</Button>
              <Button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500"
              >
                Delete
              </Button>
              <Button
                onClick={() => navigate(`/events/${event._id}`)}
                className="bg-green-600"
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
