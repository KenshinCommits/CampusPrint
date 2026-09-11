export function StatCard({ label, value, tone = '' }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-num">{value}</div>
    </div>
  );
}
