import { Link } from "react-router-dom";
import moment from "moment";

const EventList = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 text-lg">📭 No events found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const status = event.eventStatus || "UPCOMING";

        const isFull =
          event.maxRegistrations !== undefined &&
          event.maxRegistrations !== null &&
          (event.registrationCount || 0) >= event.maxRegistrations;

        const CardContent = (
          <div
            className={`group relative flex flex-col h-full rounded-lg border border-gray-200 transition-all duration-300 ${
              (status === "COMPLETED" || isFull)
                ? "bg-gray-50 cursor-not-allowed opacity-60 shadow-sm"
                : "bg-white shadow-md hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
            }`}
          >
            {/* Card Body */}
            <div className="p-5 flex flex-col flex-grow">
              {/* Title + Status */}
              <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex-grow leading-tight">
                  {event.title}
                </h3>
                <div className="flex flex-wrap gap-2 justify-end flex-shrink-0">
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                      status === "UPCOMING"
                        ? "bg-blue-100 text-blue-700"
                        : status === "REGISTRATION_CLOSED"
                        ? "bg-orange-100 text-orange-700"
                        : status === "LIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {status === "UPCOMING"
                      ? "🔔 Upcoming"
                      : status === "REGISTRATION_CLOSED"
                      ? "🚫 Closed"
                      : status === "LIVE"
                      ? "✨ Live"
                      : "✅ Done"}
                  </span>

                  {isFull && (
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                      🔴 Full
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                {event.description}
              </p>

              {/* Event Info Grid */}
              <div className="space-y-2 mb-4 py-3 border-t border-b border-gray-100">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">📅 Date:</span> {event.date}
                </p>

                <p className="text-sm text-gray-700">
                  <span className="font-semibold">👥 Registered:</span> {event.registrationCount || 0}
                  {event.maxRegistrations && ` / ${event.maxRegistrations}`}
                </p>

                {event.registrationDeadline && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">⏰ Deadline:</span> {moment(event.registrationDeadline).format("DD MMM YYYY")}
                  </p>
                )}
              </div>

              {/* Capacity Bar */}
              {event.maxRegistrations && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">Capacity</span>
                    <span className="text-xs font-bold text-gray-700">
                      {Math.round(((event.registrationCount || 0) / event.maxRegistrations) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(((event.registrationCount || 0) / event.maxRegistrations) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

        if (status === "COMPLETED" || isFull) {
          return <div key={event._id}>{CardContent}</div>;
        }

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
