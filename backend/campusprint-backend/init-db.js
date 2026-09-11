// Run this once against real AWS (with DB_DRIVER=dynamodb and valid AWS
// credentials configured) to create the two tables the app needs.
// Usage: npm run init-db
require('dotenv').config();
const { DynamoDBClient, CreateTableCommand, waitUntilTableExists } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({});
const USERS_TABLE = process.env.USERS_TABLE || 'campusprint_users';
const ORDERS_TABLE = process.env.ORDERS_TABLE || 'campusprint_orders';

async function createTableIfMissing(TableName, KeyName) {
  try {
    await client.send(
      new CreateTableCommand({
        TableName,
        AttributeDefinitions: [{ AttributeName: KeyName, AttributeType: 'S' }],
        KeySchema: [{ AttributeName: KeyName, KeyType: 'HASH' }],
        BillingMode: 'PAY_PER_REQUEST', // no capacity planning needed for a hackathon demo
      })
    );
    console.log(`Creating ${TableName} ... waiting for it to become active`);
    await waitUntilTableExists({ client, maxWaitTime: 60 }, { TableName });
    console.log(`${TableName} is ready.`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`${TableName} already exists, skipping.`);
    } else {
      throw err;
    }
  }
}

(async () => {
  await createTableIfMissing(USERS_TABLE, 'email');
  await createTableIfMissing(ORDERS_TABLE, 'orderId');
  console.log('Done. Both tables ready.');
})();
