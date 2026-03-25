import { DataSource } from 'typeorm';

export const clearIntegrationTestData = async (dataSource: DataSource) => {
  if (!dataSource || !dataSource.isInitialized) {
    return;
  }

  const queries = [
    `DELETE FROM "access_token" WHERE id IN (SELECT a.id FROM "access_token" a JOIN "user" u ON a.user_id = u.id WHERE u.name LIKE '%integration-test%' OR u.email LIKE '%integration-test%');`,
    `DELETE FROM "user_role" WHERE "user_id" IN (SELECT id FROM "user" WHERE name LIKE '%integration-test%' OR email LIKE '%integration-test%');`,
    `DELETE FROM "user" WHERE name LIKE '%integration-test%' OR email LIKE '%integration-test%';`,
    `DELETE FROM "menu_item" WHERE name LIKE '%integration-test%';`,
    `DELETE FROM "category" WHERE name LIKE '%integration-test%' OR code LIKE '%integration-test%';`,
    `DELETE FROM "restaurant" WHERE name LIKE '%integration-test%';`,
  ];

  for (const query of queries) {
    await dataSource.query(query);
  }
};
