// Creates the DynamoDB tables this app needs, if they don't already exist.
// Mirrors the pattern in your org's Deployment_Guide_1.pdf (Section: "npm run init-db").
// Only relevant once DB_DRIVER=dynamodb and real AWS credentials are configured.

import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { config } from '../src/config.js';

const client = new DynamoDBClient({ region: config.awsRegion });

async function tableExists(name) {
  try {
    await client.send(new DescribeTableCommand({ TableName: name }));
    return true;
  } catch (err) {
    if (err.name === 'ResourceNotFoundException') return false;
    throw err;
  }
}

async function createTable(name, keyAttrName) {
  if (await tableExists(name)) {
    console.log(`Table already exists: ${name}`);
    return;
  }
  await client.send(
    new CreateTableCommand({
      TableName: name,
      AttributeDefinitions: [{ AttributeName: keyAttrName, AttributeType: 'S' }],
      KeySchema: [{ AttributeName: keyAttrName, KeyType: 'HASH' }],
      BillingMode: 'PAY_PER_REQUEST', // on-demand, matches the guide's screenshots
    })
  );
  console.log(`Created table: ${name} (PK: ${keyAttrName})`);
}

async function main() {
  if (config.dbDriver !== 'dynamodb') {
    console.log(
      `DB_DRIVER is "${config.dbDriver}", not "dynamodb". Set DB_DRIVER=dynamodb in your .env before running init-db.`
    );
  }
  await createTable(config.usersTable, 'email');
  await createTable(config.ordersTable, 'orderId');
  console.log('DynamoDB ready:', config.usersTable, config.ordersTable);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
