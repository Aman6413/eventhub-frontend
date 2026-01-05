import { Link } from "react-router-dom";
import moment from "moment";

const EventList = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-4">
        No events found.
      </p>
    );
  }

  return (
    <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        let isClosed = false;

        if (event.registrationDeadline) {
          const today = moment().startOf("day");
          const deadline = moment(event.registrationDeadline, "YYYY-MM-DD");
          isClosed = today.isAfter(deadline);
        }

        const CardContent = (
          <div
            className={`border p-4 rounded shadow transition ${
              isClosed
                ? "bg-gray-100 cursor-not-allowed opacity-70"
                : "hover:shadow-md hover:bg-gray-50"
            }`}
          >
            {/* Title + Status */}
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-blue-600">
                {event.title}
              </h3>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  isClosed
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {isClosed ? "Closed" : "Open"}
              </span>
            </div>

            {/* Date */}
            <p className="text-sm text-gray-600 mt-1">
              Event Date: {event.date}
            </p>

            {/* Deadline */}
            {event.registrationDeadline && (
              <p className="text-sm text-gray-500 mt-1">
                Registration Deadline:{" "}
                <span className="font-medium">
                  {moment(event.registrationDeadline).format("DD MMM YYYY")}
                </span>
              </p>
            )}

            {/* Description */}
            <p className="mt-2 text-gray-700 line-clamp-3">
              {event.description}
            </p>
          </div>
        );

        // ❌ Closed event → no navigation
        if (isClosed) {
          return (
            <div key={event._id}>
              {CardContent}
            </div>
          );
        }

        // ✅ Open event → clickable
        return (
          <Link to={`/events/${event._id}`} key={event._id}>
            {CardContent}
          </Link>
        );
      })}
    </div>
  );
};

export default EventList;
