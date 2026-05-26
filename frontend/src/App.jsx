import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import TicketForm from './components/TicketForm';
import StatsStrip from './components/StatsStrip';
import { getTickets, getStats, createTicket, updateTicketStatus } from './api';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    priority: '',
    breached: ''
  });

  const fetchData = async () => {
    try {
      const [ticketsData, statsData] = await Promise.all([
        getTickets(filters),
        getStats()
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute for age updates
    return () => clearInterval(interval);
  }, [filters]);

  const handleCreateSubmit = async (data) => {
    await createTicket(data);
    fetchData();
  };

  const handleTicketMove = async (id, nextStatus) => {
    try {
      await updateTicketStatus(id, nextStatus);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error moving ticket');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <header>
        <h1>DeskFlow</h1>
        <button className="btn" onClick={() => setIsFormOpen(true)}>
          + New Ticket
        </button>
      </header>

      <StatsStrip stats={stats} />

      <div className="filters">
        <select 
          name="priority" 
          value={filters.priority} 
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select 
          name="breached" 
          value={filters.breached} 
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All SLA Statuses</option>
          <option value="true">SLA Breached Only</option>
        </select>
      </div>

      <Board tickets={tickets} onMove={handleTicketMove} />

      {isFormOpen && (
        <TicketForm 
          onSubmit={handleCreateSubmit} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
