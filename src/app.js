import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { format } from 'date-fns';

import passport from './login.js';
import { router as indexRouter } from './routes/index-routes.js';
import { router as adminRouter } from './routes/admin.js';
import { router as eventRouter } from './routes/event.js';


dotenv.config();

const { PORT: port = 3000,
        SESSION_SECRET: sessionSecret,
        DATABASE_URL: connectionString, } = process.env;

const app = express();

// Sér um að req.body innihaldi gögn úr formi
app.use(express.urlencoded({ extended: true }));

const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, '../public')));
app.set('views', join(path, '../views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 20 * 1000, // 20 sek
}));

app.use(passport.initialize());
app.use(passport.session());

app.locals = {
  // TODO hjálparföll fyrir template
};
app.locals.formatDate = (str) => {
  let date = '';

  try {
    date = format(str || '', 'dd.MM.yyyy');
  } catch {
    return '';
  }

  return date;
};

app.use('/', indexRouter);
// TODO admin routes
app.use('/admin', adminRouter);

app.use('/event', eventRouter);



/** Middleware sem sér um 404 villur. */
app.use((req, res) => {
  const title = 'Síða fannst ekki';
  res.status(404).render('error', { title, errors: '' });
});

/** Middleware sem sér um villumeðhöndlun. */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const title = 'Villa kom upp';
  res.status(500).render('error', { title, errors: '' });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
