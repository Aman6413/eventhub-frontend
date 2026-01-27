import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../store/thunks/eventThunk";
import { setSearchTerm, setFilter } from "../store/slices/eventSlice";
import EventList from "../components/EventList";

const HomePage = () => {
  const dispatch = useDispatch();

  const list = useSelector((state) => state.events.list);
  const loading = useSelector((state) => state.events.loading);
  const searchTerm = useSelector((state) => state.events.searchTerm);
  const filter = useSelector((state) => state.events.filter);
  const user = useSelector((state) => state.auth.user);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user && user.token) {
      dispatch(fetchEvents(user.token));
    }
  }, [dispatch, user]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">🎉 Upcoming Events</h1>
          <p className="text-blue-100 text-lg">Discover and register for exciting events happening near you</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 max-w-6xl mx-auto">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Search Events</label>
              <input
                type="text"
                placeholder="Search by event name..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              />
            </div>

            {/* Filter Buttons */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">📂 Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {["all", "technical", "cultural", "sports"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => dispatch(setFilter(cat))}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                      filter === cat
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading amazing events...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-400 text-xl mb-2">🎯 No events found</p>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4 font-semibold">📊 Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}</p>
            <EventList events={filteredEvents} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
