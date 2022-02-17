import { promises } from 'fs';
import{ faker } from '@faker-js/faker';

import { query, end } from './lib/db.js';

const schemaFile = './sql/schema.sql';


function createFakeEvents(n){
  const fake = [];
  while (fake.length < n) {
    let fname = faker.lorem.sentence();
    fake.push({
      name: fname,
      slug: faker.helpers.slugify(fname),
      description: faker.lorem.paragraph(),
    });
  }
  return fake;
}

async function create() {
  // TODO setja upp gagnagrun + gögn
  const data = await promises.readFile(schemaFile);
  await query(data.toString('utf-8'));

  const fakes = createFakeEvents(3)

  for (let i = 0; i < fakes.length; i += 1) {
    const fake = fakes[i];
    try {
        // eslint-disable-next-line no-await-in-loop
        await query(
          `
            INSERT INTO
              events (name, slug, description)
            VALUES
             ($1, $2, $3)`,
          [fake.name, fake.slug, fake.description],
        );
      } catch (e) {
        console.error('Error inserting', e);
        return;
      }
  }

  await end();
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});
