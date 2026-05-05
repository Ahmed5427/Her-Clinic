export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-stone-200 rounded-md" />
        <div className="h-4 w-72 bg-stone-200 rounded-md mt-3" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="admin-card p-5 h-28">
            <div className="h-3 w-20 bg-stone-200 rounded" />
            <div className="h-7 w-16 bg-stone-200 rounded mt-3" />
            <div className="h-3 w-24 bg-stone-200 rounded mt-3" />
          </div>
        ))}
      </div>

      <div className="admin-card h-72">
        <div className="p-5 border-b border-[var(--admin-line)]">
          <div className="h-5 w-40 bg-stone-200 rounded" />
        </div>
        <div className="p-5 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-stone-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
