import React from 'react';
import TicketCard from './TicketCard';

export default function Column({ title, status, tickets, onMove }) {
  return (
    <div className="column glass">
      <div className="column-header">
        <span>{title}</span>
        <span className="column-count">{tickets.length}</span>
      </div>
      {tickets.map(ticket => (
        <TicketCard key={ticket._id} ticket={ticket} onMove={onMove} />
      ))}
    </div>
  );
}
