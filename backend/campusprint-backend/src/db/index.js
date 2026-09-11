// Local JSON-file driver for dev/demo, DynamoDB driver for the real deploy.
// Both export the exact same function names, so nothing else in the app changes.
module.exports =
  process.env.DB_DRIVER === 'dynamodb' ? require('./dynamo') : require('./local');
