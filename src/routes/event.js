import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';

import { getEvent, getEntries, insertEntry } from '../lib/db.js';

export const router = express.Router();

async function index(req, res) {
	const content = await getEvent(req.params.id);
	const entries = await getEntries(content.id);
	res.render('event', {
    title: 'Viðburðarsíða',
    content,
    entries,
  });
};

async function newEntry(req, res){
	const {
		name, comment, id
	} = req.body;
	insertEntry(name, comment, id);
	res.redirect(`/event/${id}`);
}

router.post('/entry', catchErrors(newEntry));
router.get('/:id', catchErrors(index), (req, res) => {
  res.send(`hello ${req.params.id}`);
});