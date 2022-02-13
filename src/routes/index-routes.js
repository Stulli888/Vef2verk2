import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';

import { allEvents } from '../lib/db.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  //const events = await listEvents();
  const events = await allEvents();
  res.render('index', {
    title: 'Viðburðasíðan',
    events
  });
}

indexRouter.get('/', catchErrors(indexRoute));

// TODO útfæra öll routes
