import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventById,
  registerForEvent,
} from "../store/thunks/eventDetailThunk";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import moment from "moment";
import SuccessScreen from "../components/SuccessScreen";
import { getMyRegistrations } from "../store/thunks/authThunk";
import { fetchEventRegistrations } from "../store/thunks/adminThunk";

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registrationStatus, setRegistrationStatus] = useState(false);
  const [eventRegistrations, setEventRegistrations] = useState([]);

  const { eventDetail, auth } = useSelector((state) => ({
    eventDetail: state.eventDetail,
    auth: state.auth,
  }));

  const { selectedEvent, loading, error, registrationMessage } = eventDetail;
  const { user, myRegistrations } = auth;

  useEffect(() => {
    if (!user && !localStorage.getItem("eventhub user")) {
      navigate("/login");
      return;
    }

    if (!user) return;

    const fetchData = async () => {
      const res = await dispatch(
        fetchEventById({ eventId: id, token: user.token })
      );

      if (!res.error) {
        dispatch(getMyRegistrations(user.token));

        if (user.role === "admin") {
          const regRes = await dispatch(
            fetchEventRegistrations({ id, token: user.token })
          );

          if (regRes.payload && Array.isArray(regRes.payload)) {
            setEventRegistrations(regRes.payload);
          }
        }
      }
    };

    fetchData();
  }, [dispatch, id, user, navigate]);

  const isRegistered = myRegistrations.find((event) => event._id === id);

  // 🔥 DEADLINE LOGIC
  const today = moment().startOf("day");
  const deadline = selectedEvent?.registrationDeadline
    ? moment(selectedEvent.registrationDeadline)
    : null;

  const isRegistrationClosed = deadline && today.isAfter(deadline);

  const handleRegister = async () => {
    const res = await dispatch(
      registerForEvent({ token: user.token, eventId: id })
    );
  
    const msg = res.payload?.toLowerCase() || "";
  
    if (msg.includes("success") || msg.includes("cancel")) {
      await dispatch(fetchEventById({ eventId: id, token: user.token }));
      await dispatch(getMyRegistrations(user.token));
    }
  
    if (msg.includes("success")) {
      setRegistrationStatus(true);
    }
  };  

  if (loading || !selectedEvent) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  if (registrationStatus) {
    return <SuccessScreen message="Registration Successful 🎉" />;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">
            {selectedEvent.title}
          </h1>

          <p className="mb-2 text-gray-700">
            <strong>Date:</strong>{" "}
            {moment(selectedEvent.date, "DD-MM-YYYY").format("DD MMMM YYYY")}
          </p>

          <p className="mb-2 text-gray-700">
            <strong>Time:</strong> {selectedEvent.time}
          </p>

          <p className="mb-2 text-gray-700">
            <strong>Location:</strong> {selectedEvent.location}
          </p>

          <p className="mb-2 text-gray-700">
            <strong>Coordinator Contact No:</strong>{" "}
            {selectedEvent.contactNumber}
          </p>

          <p className="mb-2 text-gray-700">
            <strong>Type:</strong> {selectedEvent.type}
          </p>

          <p className="mb-2 text-gray-700">
            <strong>Registered Students:</strong>{" "}
            {selectedEvent.registrationCount || 0}
          </p>

          {/* 🔥 REGISTRATION DEADLINE */}
          {selectedEvent.registrationDeadline && (
            <p className="mb-2 text-gray-700">
              <strong>Registration Deadline:</strong>{" "}
              {moment(selectedEvent.registrationDeadline).format(
                "DD MMMM YYYY"
              )}
            </p>
          )}

          <p className="mb-4 text-gray-800">{selectedEvent.description}</p>

          {/* 🔥 REGISTER BUTTON LOGIC */}
          {user?.role !== "admin" && (
            <>
              {isRegistrationClosed ? (
                <p className="text-red-600 font-semibold mt-4">
                  Registration Closed
                </p>
              ) : (
                <Button onClick={handleRegister}>
                  {!isRegistered ? "Register" : "Cancel Registration"}
                </Button>
              )}
            </>
          )}
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex-1 flex justify-center items-start">
          {selectedEvent.imageUrl && (
            <img
              src={selectedEvent.imageUrl}
              alt="Event"
              className="rounded shadow max-w-full max-h-[400px] object-cover"
            />
          )}
        </div>
      </div>

      {/* ADMIN: REGISTERED USERS LIST */}
      {user?.role === "admin" && eventRegistrations.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-blue-800 mb-5 border-b pb-2">
            Registered Users
          </h2>

          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {eventRegistrations.map((reg, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-2 text-gray-900">{reg.name}</td>
                    <td className="px-4 py-2 text-gray-700">{reg.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
