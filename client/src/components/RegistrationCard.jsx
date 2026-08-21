import StatusBadge from "./StatusBadge";
import { formatEventDate } from "../utils/eventHelpers";

function RegistrationCard({ registration }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {registration.eventName}
          </h3>
          <p className="text-sm text-slate-600">{registration.eventType}</p>
        </div>
        <StatusBadge status={registration.registrationStatus} />
      </div>

      <div className="mt-3 space-y-1 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Student:</span>{" "}
          {registration.studentName}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Date:</span>{" "}
          {formatEventDate(registration.eventDate)}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Venue:</span>{" "}
          {registration.venue}
        </p>
      </div>
    </article>
  );
}

export default RegistrationCard;
