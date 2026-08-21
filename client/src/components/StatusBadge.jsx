const statusClasses = {
  Open: "bg-emerald-100 text-emerald-900 ring-emerald-300",
  Closed: "bg-rose-100 text-rose-900 ring-rose-300",
  Ongoing: "bg-amber-100 text-amber-900 ring-amber-300",
  Upcoming: "bg-sky-100 text-sky-900 ring-sky-300",
  Completed: "bg-slate-200 text-slate-800 ring-slate-300",
};

function StatusBadge({ status }) {
  const classes =
    statusClasses[status] ?? "bg-slate-100 text-slate-700 ring-slate-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${classes}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
