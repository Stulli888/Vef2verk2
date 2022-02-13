import { promises } from 'fs';

import { query, end } from './lib/db.js';

const schemaFile = './sql/schema.sql';

async function create() {
  // TODO setja upp gagnagrun + gögn
  const data = await promises.readFile(schemaFile);
  await query(data.toString('utf-8'));

  try {
      // eslint-disable-next-line no-await-in-loop
      await query(
        `
          INSERT INTO
            events (id, name, slug, description)
          VALUES
            ($1, $2, $3, $4)`,
        [1,"db.name", "db.slug", "db.description"],
      );
    } catch (e) {
      console.error('Error inserting', e);
      return;
    }

  await end();
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});
