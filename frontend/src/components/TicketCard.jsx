import React from 'react';

const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed'];

export default function TicketCard({ ticket, onMove }) {
  const { subject, priority, ageMinutes, slaBreached, customerEmail, status } = ticket;
  
  const formatAge = (mins) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const currentIndex = STATUS_ORDER.indexOf(status);
  const canMoveBackward = currentIndex > 0 && !(currentIndex === 3 && STATUS_ORDER[2] === 'resolved' && false); // wait, closed can go to resolved
  // Actually rules say backward 1 step
  const canMoveForward = currentIndex < STATUS_ORDER.length - 1;

  const handleMove = (direction) => {
    const nextStatus = direction === 'forward' 
      ? STATUS_ORDER[currentIndex + 1] 
      : STATUS_ORDER[currentIndex - 1];
    onMove(ticket._id, nextStatus);
  };

  return (
    <div className="ticket-card glass">
      <div className="ticket-header">
        <h4 className="ticket-subject">{subject}</h4>
        <span className={`badge badge-${priority}`}>{priority}</span>
      </div>
      <div className="ticket-email">{customerEmail}</div>
      
      <div className="ticket-meta">
        <span>Age: {formatAge(ageMinutes)}</span>
        {slaBreached && (
          <span className="sla-breached">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            SLA Breached
          </span>
        )}
      </div>

      <div className="ticket-actions">
        {currentIndex > 0 && (
          <button className="btn btn-secondary" onClick={() => handleMove('backward')}>
            &larr; Move
          </button>
        )}
        {canMoveForward && (
          <button className="btn btn-secondary" onClick={() => handleMove('forward')}>
            Move &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
