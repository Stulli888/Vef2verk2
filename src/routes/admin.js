import express from 'express';
import xss from 'xss';

import passport, { ensureLoggedIn } from '../login.js';
import { catchErrors } from '../lib/catch-errors.js';

export const router = express.Router();

async function index(req, res) {
  const { search } = req.query;

	return res.render('admin', { title: 'Stjórnandasíða', admin: true, search: xss(search),});
};

function login(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/admin');
  }

  let message = '';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
  // og hreinsum skilaboð
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('login', { message, title: 'Innskráning' });
}


router.get('/', ensureLoggedIn, catchErrors(index));
router.get('/login', login);



router.post(
  '/login',

  // Þetta notar strat að ofan til að skrá notanda inn
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/admin/login',
  }),

  // Ef við komumst hingað var notandi skráður inn, senda á /admin
  (req, res) => {
    res.redirect('/admin');
  },
);