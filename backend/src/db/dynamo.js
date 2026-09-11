import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { config } from '../config.js';

// Real AWS DynamoDB driver - same shape as db/local.js so the rest of the
// app doesn't care which one is active. Uses Scan for listing (fine at
// hackathon-demo scale); add a GSI on userId/status later if you need it
// to scale further.

const client = new DynamoDBClient({ region: config.awsRegion });
const doc = DynamoDBDocumentClient.from(client);

export const dynamoDb = {
  users: {
    async create(user) {
      await doc.send(new PutCommand({ TableName: config.usersTable, Item: user }));
      return user;
    },
    async findByEmail(email) {
      const res = await doc.send(new GetCommand({ TableName: config.usersTable, Key: { email } }));
      return res.Item || null;
    },
  },
  orders: {
    async create(order) {
      await doc.send(new PutCommand({ TableName: config.ordersTable, Item: order }));
      return order;
    },
    async findById(orderId) {
      const res = await doc.send(new GetCommand({ TableName: config.ordersTable, Key: { orderId } }));
      return res.Item || null;
    },
    async findByUser(userEmail) {
      const res = await doc.send(new ScanCommand({ TableName: config.ordersTable }));
      return (res.Items || [])
        .filter((o) => o.userId === userEmail)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async findAll({ status, q } = {}) {
      const res = await doc.send(new ScanCommand({ TableName: config.ordersTable }));
      let orders = res.Items || [];
      if (status) orders = orders.filter((o) => o.status === status);
      if (q) {
        const needle = q.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.orderId.toLowerCase().includes(needle) ||
            (o.userName || '').toLowerCase().includes(needle) ||
            (o.userId || '').toLowerCase().includes(needle) ||
            (o.fileName || '').toLowerCase().includes(needle)
        );
      }
      return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async update(orderId, patch) {
      const sets = Object.keys(patch);
      if (sets.length === 0) return this.findById(orderId);

      const UpdateExpression = 'SET ' + sets.map((k, i) => `#f${i} = :v${i}`).join(', ');
      const ExpressionAttributeNames = Object.fromEntries(sets.map((k, i) => [`#f${i}`, k]));
      const ExpressionAttributeValues = Object.fromEntries(sets.map((k, i) => [`:v${i}`, patch[k]]));

      const res = await doc.send(
        new UpdateCommand({
          TableName: config.ordersTable,
          Key: { orderId },
          UpdateExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
      );
      return res.Attributes || null;
    },
  },
};
