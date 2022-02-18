import express from 'express';
import { body, validationResult } from 'express-validator';
import xss from 'xss';

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

const validationMiddleware = [
	body('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  body('name')
    .isLength({ max: 64 })
    .withMessage('Nafn má að hámarki vera 64 stafir'),
  body('comment')
    .isLength({ max: 128 })
    .withMessage('Athugasemd er of löng')
];
const xssSanitizationMiddleware = [
	body('name').customSanitizer((v) => xss(v)),
	body('comment').customSanitizer((v) => xss(v)),
];
const sanitizationMiddleware = [
	body('name').trim().escape(),
];

async function validationCheck(req, res, next) {
  const {
    name, comment
  } = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.render('error', { title: 'Validation villa', errors: validation.errors });
  }

  return next();
}

router.post('/entry', validationMiddleware,
											xssSanitizationMiddleware,
											catchErrors(validationCheck),
  										sanitizationMiddleware,
											catchErrors(newEntry));

router.get('/:id', catchErrors(index), (req, res) => {
  res.send(`hello ${req.params.id}`);
});