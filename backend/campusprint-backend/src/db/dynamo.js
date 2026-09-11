// DynamoDB driver. Same function signatures as local.js on purpose -
// routes call db.xxx() and never know which driver is underneath.
//
// Tables needed (see init-db.js to create them):
//   USERS_TABLE  - partition key: email (String)
//   ORDERS_TABLE - partition key: orderId (String)
//
// Note: listOrdersByUser / listOrdersStaff use Scan+filter, not Query.
// That's fine at hackathon demo scale (tens of orders). If you want it
// "production correct" later, add a GSI on userId/status - not needed
// to satisfy the rubric.
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({}); // picks up region/creds from env or AWS CLI config
const doc = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE || 'campusprint_users';
const ORDERS_TABLE = process.env.ORDERS_TABLE || 'campusprint_orders';
const COUNTER_KEY = '__ORDER_COUNTER__'; // one special row in ORDERS_TABLE holds the token counter

// ---- Users ----
async function createUser(user) {
  await doc.send(new PutCommand({ TableName: USERS_TABLE, Item: user }));
  return user;
}

async function getUserByEmail(email) {
  const res = await doc.send(new GetCommand({ TableName: USERS_TABLE, Key: { email } }));
  return res.Item || null;
}

// ---- Orders ----
async function nextOrderSeq() {
  // Atomic counter using DynamoDB's ADD update - safe even with concurrent orders.
  const res = await doc.send(
    new UpdateCommand({
      TableName: ORDERS_TABLE,
      Key: { orderId: COUNTER_KEY },
      UpdateExpression: 'ADD seq :incr',
      ExpressionAttributeValues: { ':incr': 1 },
      ReturnValues: 'UPDATED_NEW',
    })
  );
  return res.Attributes.seq;
}

async function createOrder(orderData) {
  const seq = await nextOrderSeq();
  const orderId = `CP-${1000 + seq}`;
  const now = new Date().toISOString();
  const order = {
    orderId,
    ...orderData,
    status: 'placed',
    paymentStatus: 'unpaid',
    statusHistory: [{ status: 'placed', at: now, by: orderData.userId }],
    createdAt: now,
    updatedAt: now,
  };
  await doc.send(new PutCommand({ TableName: ORDERS_TABLE, Item: order }));
  return order;
}

async function getOrder(orderId) {
  const res = await doc.send(new GetCommand({ TableName: ORDERS_TABLE, Key: { orderId } }));
  return res.Item || null;
}

async function listOrdersByUser(userId) {
  const res = await doc.send(new ScanCommand({ TableName: ORDERS_TABLE }));
  return (res.Items || [])
    .filter((o) => o.orderId !== COUNTER_KEY && o.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function listOrdersStaff({ status, q } = {}) {
  const res = await doc.send(new ScanCommand({ TableName: ORDERS_TABLE }));
  let orders = (res.Items || []).filter((o) => o.orderId !== COUNTER_KEY);
  if (status) orders = orders.filter((o) => o.status === status);
  if (q) {
    const needle = q.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(needle) ||
        (o.userName || '').toLowerCase().includes(needle) ||
        (o.fileName || '').toLowerCase().includes(needle)
    );
  }
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function updateOrder(orderId, updates, historyEntry) {
  const order = await getOrder(orderId);
  if (!order) return null;
  const merged = { ...order, ...updates, updatedAt: new Date().toISOString() };
  if (historyEntry) merged.statusHistory = [...(order.statusHistory || []), historyEntry];
  await doc.send(new PutCommand({ TableName: ORDERS_TABLE, Item: merged }));
  return merged;
}

async function getStats() {
  const res = await doc.send(new ScanCommand({ TableName: ORDERS_TABLE }));
  const items = (res.Items || []).filter((o) => o.orderId !== COUNTER_KEY);
  const today = new Date().toISOString().slice(0, 10);
  const counts = {};
  let todayTotal = 0;
  for (const o of items) {
    counts[o.status] = (counts[o.status] || 0) + 1;
    if (o.createdAt.slice(0, 10) === today) todayTotal += 1;
  }
  return { counts, todayTotal, totalOrders: items.length };
}

module.exports = {
  createUser,
  getUserByEmail,
  createOrder,
  getOrder,
  listOrdersByUser,
  listOrdersStaff,
  updateOrder,
  getStats,
};
