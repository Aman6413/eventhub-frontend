import { Link } from "react-router-dom";
import moment from "moment";

const EventList = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className="text-center text-gray-600 mt-4">No events found.</p>;
  }

  return (
    <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const status = event.eventStatus || "UPCOMING";

        const isFull =
          event.maxRegistrations !== undefined &&
          event.maxRegistrations !== null &&
          (event.registrationCount || 0) >= event.maxRegistrations;

        const CardContent = (
          <div
            className={`border p-4 rounded shadow transition ${
              (status === "COMPLETED" || isFull)
                ? "bg-gray-100 cursor-not-allowed opacity-70"
                : "hover:shadow-md hover:bg-gray-50"
            }`}
          >
            {/* Title + Status */}
              <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-blue-600">
                {event.title}
              </h3>
              <div className="flex gap-2 items-center">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    status === "UPCOMING"
                      ? "bg-blue-100 text-blue-600"
                      : status === "REGISTRATION_CLOSED"
                      ? "bg-orange-100 text-orange-600"
                      : status === "LIVE"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status === "UPCOMING"
                    ? "Upcoming"
                    : status === "REGISTRATION_CLOSED"
                    ? "Registration Closed"
                    : status === "LIVE"
                    ? "Live"
                    : "Completed"}
                </span>

                {isFull && (
                  <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                    FULL
                  </span>
                )}
              </div>
            </div>

            {/* Date */}
            <p className="text-sm text-gray-600 mt-1">
              Event Date: {event.date}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              👥 Registered: {event.registrationCount || 0} {event.maxRegistrations ? "/ " + event.maxRegistrations : ""}
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

        // ❌ Completed or full event → no navigation
        if (status === "COMPLETED" || isFull) {
          return <div key={event._id}>{CardContent}</div>;
        }

        // ✅ Clickable otherwise
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
