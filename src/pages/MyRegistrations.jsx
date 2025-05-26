import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EventList from "../components/EventList";
import { getMyRegistrations } from "../store/thunks/authThunk";

const MyRegistrations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const { user, myRegistrations, loading, error } = auth;

  useEffect(() => {
    if (!user && !localStorage.getItem("eventhub user")) {
      navigate("/login");
    } else {
      dispatch(getMyRegistrations(user.token));
    }
  }, [dispatch, user]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">My Registered Events</h1>
      <EventList events={myRegistrations || []} />
    </div>
  );
};

export default MyRegistrations;
