import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';

import { getEvent } from '../lib/db.js';

export const router = express.Router();

async function index(req, res) {
   const content = await getEvent(req.params.id);
   console.log('content   ',content);
  res.render('event', {
    title: 'Viðburðarsíða',
    content
  });
};

router.get('/:id', catchErrors(index), (req, res) => {
  res.send(`hello ${req.params.id}`);
});