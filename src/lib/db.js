import { readFile } from 'fs/promises';
import pg from 'pg';
import{ faker } from '@faker-js/faker';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';

const { DATABASE_URL: connectionString, NODE_ENV: nodeEnv = 'development' } =
  process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development
// mode, á heroku, ekki á local vél
const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

export async function query(q, values = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    if (nodeEnv !== 'test') {
      console.error('unable to query', e);
    }
    return null;
  } finally {
    client.release();
  }
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}

export async function end() {
  await pool.end();
}

/* TODO útfæra aðgeðir á móti gagnagrunni */
export async function allEvents() {
  let result = [];
  try {
    const q = `
      SELECT *
      FROM events
    `;
    const queryResult = await query(q, '');

    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting events', e);
  }
  return result;
}

export async function getEvent(id) {
  let result = [];
  try {
    const q = `
      SELECT *
      FROM events
      WHERE id = $1
    `;
    const qresult = await query(q, [id]);

    if (qresult && qresult.rows) {
      result = qresult.rows[0];
    }
  } catch (e) {
    console.error('Error getting event', e);
  }
  return result;
}

export async function insertEvent(name, descrip){
  let success = true;
  const q = `
    INSERT INTO events
      (name, slug, description)
    VALUES
      ($1, $2, $3);
  `;
  try {
    await query(q, [name, faker.helpers.slugify(name) , descrip]);
  } catch (e) {
    console.error('Error inserting signature', e);
    success = false;
  }
  return success;
}

export async function getEntries(event){
  let result = [];
  try {
    const q = `
      SELECT *
      FROM entries
      WHERE event = $1
    `;
    const qresult = await query(q, [event]);

    if (qresult && qresult.rows) {
      result = qresult.rows;
    }
  } catch (e) {
    console.error('Error getting entries', e);
  }
  return result;
}

export async function insertEntry(name, comment, id){
  let success = true;
  const q = `
  INSERT INTO entries
    (name, comment, event)
  VALUES
    ($1, $2, $3);
  `;
  try {
    await query(q, [name, comment, id]);
  } catch (e) {
    console.error('Error inserting entry', e);
    success = false;
  }
  return success;
}