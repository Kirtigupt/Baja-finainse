import React from 'react';
import Column from './Column';

export default function Board({ tickets, onMove }) {
  const columns = [
    { id: 'open', title: 'Open' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'resolved', title: 'Resolved' },
    { id: 'closed', title: 'Closed' }
  ];

  return (
    <div className="board">
      {columns.map(col => (
        <Column 
          key={col.id} 
          title={col.title} 
          status={col.id} 
          tickets={tickets.filter(t => t.status === col.id)} 
          onMove={onMove}
        />
      ))}
    </div>
  );
}
