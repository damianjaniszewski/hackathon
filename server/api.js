import express from 'express';
import { addSession, getEvents} from './data';
import uuid from 'uuid';

const router = express.Router();

router.post('/sessions', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email === 'error') {
    res.statusMessage = 'Invalid email or password';
    res.status(401).end();
  } else {
    const name = email.split('@')[0].replace(/\.|_/, ' '); // simulated
    const now = new Date();
    const token = `token-${uuid.v4()}`;
    const session = { email, name, token };
    addSession(token, session);
    res.json(session);
  }
});

router.get('/events', (req, res) => {
  getEvents(req.query).then(events => res.json(events));
});

router.delete('/sessions/*', (req, res) => {
  res.json(undefined);
});

module.exports = router;
