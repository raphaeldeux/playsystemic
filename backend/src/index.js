const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'playsystemic-backend', version: '1.0.0' });
});

// Cards by lot
app.get('/cards/:lot', (req, res) => {
  const lot = parseInt(req.params.lot);
  try {
    const data = require(`../data/cards/lot${lot}.json`);
    res.json(data);
  } catch {
    res.status(404).json({ error: `Lot ${lot} not found` });
  }
});

// Choices by family
app.get('/choices/:famille', (req, res) => {
  const { famille } = req.params;
  try {
    const data = require(`../data/choices/famille_${famille}.json`);
    res.json(data);
  } catch {
    res.status(404).json({ error: `Family ${famille} not found` });
  }
});

// Session save (in-memory for MVP — Redis in Phase 2)
const sessions = new Map();

app.post('/session', (req, res) => {
  const { sessionId, state } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  sessions.set(sessionId, { ...state, savedAt: new Date().toISOString() });
  res.json({ ok: true, sessionId });
});

app.get('/session/:id', (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// Anonymous stats
const statsLog = [];
app.post('/stats', (req, res) => {
  const { act, choice, family } = req.body;
  statsLog.push({ act, choice, family, timestamp: new Date().toISOString() });
  res.json({ ok: true });
});

app.get('/stats', (req, res) => {
  const summary = {};
  statsLog.forEach(({ family, choice }) => {
    if (!summary[family]) summary[family] = { A: 0, B: 0, C: 0 };
    if (choice) summary[family][choice] = (summary[family][choice] || 0) + 1;
  });
  res.json({ total: statsLog.length, byFamily: summary });
});

app.listen(PORT, () => {
  console.log(`PlaySystemic backend running on port ${PORT}`);
});
