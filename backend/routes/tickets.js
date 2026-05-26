const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

const SLA_TARGETS = {
  urgent: 1 * 60, // 1 hour in minutes
  high: 4 * 60,
  medium: 24 * 60,
  low: 72 * 60
};

const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed'];

// Helper to compute derived fields
const computeDerivedFields = (ticket) => {
  const now = new Date();
  const end = ticket.resolvedAt || (ticket.status === 'closed' ? ticket.updatedAt || now : now); // Use now if not resolved
  // To be safe, if resolvedAt exists, use it. If not, use now.
  const endTarget = ticket.resolvedAt ? ticket.resolvedAt : now;
  const ageMs = endTarget - ticket.createdAt;
  const ageMinutes = Math.floor(ageMs / 60000);
  
  const targetMinutes = SLA_TARGETS[ticket.priority];
  const slaBreached = ageMinutes > targetMinutes;

  return {
    ...ticket.toObject(),
    ageMinutes,
    slaBreached
  };
};

// GET /tickets
router.get('/', async (req, res) => {
  try {
    const { status, priority, breached } = req.query;
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    let computedTickets = tickets.map(computeDerivedFields);

    if (breached === 'true') {
      computedTickets = computedTickets.filter(t => t.slaBreached);
    }

    res.json(computedTickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tickets/stats
router.get('/stats', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    
    let stats = {
      status: { open: 0, in_progress: 0, resolved: 0, closed: 0 },
      priority: { low: 0, medium: 0, high: 0, urgent: 0 },
      slaBreachedOpen: 0
    };

    tickets.forEach(t => {
      const computed = computeDerivedFields(t);
      if (stats.status[t.status] !== undefined) {
        stats.status[t.status]++;
      }
      if (stats.priority[t.priority] !== undefined) {
        stats.priority[t.priority]++;
      }
      
      if (computed.slaBreached && (t.status === 'open' || t.status === 'in_progress')) {
        stats.slaBreachedOpen++;
      }
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tickets
router.post('/', async (req, res) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;
    if (!subject || !description || !customerEmail || !priority) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const ticket = new Ticket({
      subject,
      description,
      customerEmail,
      priority
    });
    
    await ticket.save();
    res.status(201).json(computeDerivedFields(ticket));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /tickets/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (status) {
      const currentIndex = STATUS_ORDER.indexOf(ticket.status);
      const nextIndex = STATUS_ORDER.indexOf(status);

      if (nextIndex === -1) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      // Transition rules
      if (nextIndex > currentIndex + 1) {
        return res.status(400).json({ error: 'Cannot skip forward statuses' });
      }
      if (nextIndex < currentIndex - 1) {
        return res.status(400).json({ error: 'Cannot move backward more than one step' });
      }

      // Handle resolvedAt
      if (status === 'resolved' && ticket.status !== 'resolved') {
        ticket.resolvedAt = new Date();
      } else if (ticket.status === 'resolved' && status !== 'resolved' && status !== 'closed') {
        ticket.resolvedAt = null;
      }
      
      ticket.status = status;
    }

    await ticket.save();
    res.json(computeDerivedFields(ticket));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tickets/:id
router.delete('/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
