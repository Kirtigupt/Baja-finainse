import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getTickets = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.breached) params.append('breached', filters.breached);

  const res = await axios.get(`${API_URL}/tickets?${params.toString()}`);
  return res.data;
};

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/tickets/stats`);
  return res.data;
};

export const createTicket = async (ticketData) => {
  const res = await axios.post(`${API_URL}/tickets`, ticketData);
  return res.data;
};

export const updateTicketStatus = async (id, status) => {
  const res = await axios.patch(`${API_URL}/tickets/${id}`, { status });
  return res.data;
};
