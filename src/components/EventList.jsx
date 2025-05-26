// src/components/EventList.jsx
import { Link } from 'react-router-dom';

const EventList = ({ events }) => {
  if (events.length === 0) {
    return <p className="text-center text-gray-600 mt-4">No events found.</p>;
  }

  return (
    <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Link
          to={`/events/${event._id}`}
          key={event._id}
          className="block border p-4 rounded shadow hover:shadow-md transition hover:bg-gray-50"
        >
          <h3 className="text-xl font-semibold text-blue-600">{event.title}</h3>
          <p className="text-sm text-gray-600">{event.date}</p>
          <p className="mt-2 text-gray-700">{event.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default EventList;