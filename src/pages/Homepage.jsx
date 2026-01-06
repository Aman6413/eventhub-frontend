import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../store/thunks/eventThunk";
import { setSearchTerm, setFilter } from "../store/slices/eventSlice";
import EventList from "../components/EventList";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, auth } = useSelector((state) => ({
    events: state.events,
    auth: state.auth,
  }));

  const { list, loading, searchTerm, filter } = events;
  const { user } = auth;

  useEffect(() => {
    if (!user && !localStorage.getItem("eventhub user")) {
      navigate("/login");
      return;
    }

    if (!user) {
      window.location.reload();
    } else {
      dispatch(fetchEvents(user.token));
    }
  }, [dispatch, user, navigate]);

  // 🔥 FILTER WITH DEADLINE LOGIC
  const filteredEvents = list.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" || event.type.toLowerCase() === filter.toLowerCase();

    // ✅ DO NOT check deadline here
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Upcoming Events
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className="w-full md:w-1/2 px-4 py-2 border rounded
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-2">
          {["all", "technical", "cultural", "sports"].map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setFilter(cat))}
              className={`px-3 py-1 rounded border ${
                filter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <EventList events={filteredEvents} />
      )}
    </div>
  );
};

export default HomePage;
