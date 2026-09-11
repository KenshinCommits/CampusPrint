import { config } from '../config.js';
import { localDb } from './local.js';

// Lazy-load the AWS SDK-backed driver only when it's actually needed, so
// DB_DRIVER=local (the default) never requires AWS credentials to even boot.
export const db =
  config.dbDriver === 'dynamodb' ? (await import('./dynamo.js')).dynamoDb : localDb;

console.log(`[db] using "${config.dbDriver}" driver`);
