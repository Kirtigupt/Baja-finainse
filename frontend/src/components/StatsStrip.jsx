import React from 'react';

export default function StatsStrip({ stats }) {
  if (!stats) return null;

  const total = Object.values(stats.status).reduce((a, b) => a + b, 0);

  return (
    <div className="stats-strip">
      <div className="stat-card glass">
        <span className="stat-label">Total Tickets</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat-card glass">
        <span className="stat-label">Open</span>
        <span className="stat-value">{stats.status.open}</span>
      </div>
      <div className="stat-card glass">
        <span className="stat-label">In Progress</span>
        <span className="stat-value">{stats.status.in_progress}</span>
      </div>
      <div className="stat-card glass">
        <span className="stat-label stat-danger">SLA Breached (Open/WIP)</span>
        <span className="stat-value stat-danger">{stats.slaBreachedOpen}</span>
      </div>
    </div>
  );
}
