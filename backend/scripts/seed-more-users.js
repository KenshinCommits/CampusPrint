import bcrypt from 'bcryptjs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION || 'ap-south-1';
const usersTable = process.env.USERS_TABLE || 'campusprint-users';
const ordersTable = process.env.ORDERS_TABLE || 'campusprint-orders';

const client = new DynamoDBClient({ region });
const doc = DynamoDBDocumentClient.from(client);

const demoUsers = [
  { name: 'Shop Staff (Manager)', email: 'staff@campusprint.demo', password: 'staff123', role: 'staff' },
  { name: 'Xerox Desk Operator', email: 'staff2@campusprint.demo', password: 'staff123', role: 'staff' },
  { name: 'Demo Student', email: 'student@campusprint.demo', password: 'student123', role: 'student' },
  { name: 'Rahul Verma', email: 'rahul@campusprint.demo', password: 'demo123', role: 'student' },
  { name: 'Ananya Iyer', email: 'ananya@campusprint.demo', password: 'demo123', role: 'student' },
  { name: 'Karthik Rao', email: 'karthik@campusprint.demo', password: 'demo123', role: 'student' },
  { name: 'Sneha Kapoor', email: 'sneha@campusprint.demo', password: 'demo123', role: 'student' },
  { name: 'Vikram Singh', email: 'vikram@campusprint.demo', password: 'demo123', role: 'student' },
  { name: 'Priya Sharma', email: 'priya@campusprint.demo', password: 'demo123', role: 'student' },
  { name: 'Amit Patel', email: 'amit@campusprint.demo', password: 'demo123', role: 'student' },
  { name: 'Neha Gupta', email: 'neha@campusprint.demo', password: 'demo123', role: 'student' },
  { name: 'Rohan Mehta', email: 'rohan@campusprint.demo', password: 'demo123', role: 'student' },
];

async function seedUsers() {
  console.log(`Seeding demo users into DynamoDB (${usersTable})...`);
  for (const u of demoUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const item = {
      email: u.email,
      name: u.name,
      passwordHash,
      role: u.role,
      createdAt: new Date().toISOString(),
    };
    await doc.send(new PutCommand({ TableName: usersTable, Item: item }));
    console.log(`  ? Created user [${u.role}]: ${u.email} (${u.name})`);
  }
}

async function seedOrders() {
  console.log(`Seeding realistic demo orders into DynamoDB (${ordersTable})...`);
  const now = Date.now();
  const sampleOrders = [
    {
      orderId: 'CP-101',
      userId: 'student@campusprint.demo',
      userName: 'Demo Student',
      fileName: 'DSA_Lecture_Notes_Unit1.pdf',
      fileKey: 'demo-dsa-notes.pdf',
      fileSizeBytes: 245760,
      pages: 14,
      options: { copies: 1, colorMode: 'bw', sided: 'double', paperSize: 'A4', binding: 'none', notes: 'Double sided, clear print' },
      cost: { perPage: 2, pages: 14, copies: 1, printCost: 28, bindingCost: 0, total: 28, currency: 'INR' },
      paymentMethod: 'online',
      paymentStatus: 'paid',
      status: 'processing',
      rejectionReason: null,
      estimatedReadyAt: new Date(now + 15 * 60000).toISOString(),
      statusHistory: [
        { status: 'placed', at: new Date(now - 30 * 60000).toISOString(), by: 'student@campusprint.demo' },
        { status: 'accepted', at: new Date(now - 20 * 60000).toISOString(), by: 'staff@campusprint.demo' },
        { status: 'processing', at: new Date(now - 5 * 60000).toISOString(), by: 'staff@campusprint.demo' },
      ],
      createdAt: new Date(now - 30 * 60000).toISOString(),
      updatedAt: new Date(now - 5 * 60000).toISOString(),
    },
    {
      orderId: 'CP-102',
      userId: 'ananya@campusprint.demo',
      userName: 'Ananya Iyer',
      fileName: 'Campus_Placement_Resume.pdf',
      fileKey: 'demo-resume.pdf',
      fileSizeBytes: 102400,
      pages: 2,
      options: { copies: 5, colorMode: 'color', sided: 'single', paperSize: 'A4', binding: 'none', notes: 'High quality bond paper please' },
      cost: { perPage: 8, pages: 2, copies: 5, printCost: 80, bindingCost: 0, total: 80, currency: 'INR' },
      paymentMethod: 'online',
      paymentStatus: 'paid',
      status: 'ready',
      rejectionReason: null,
      estimatedReadyAt: new Date(now - 2 * 60000).toISOString(),
      statusHistory: [
        { status: 'placed', at: new Date(now - 45 * 60000).toISOString(), by: 'ananya@campusprint.demo' },
        { status: 'accepted', at: new Date(now - 35 * 60000).toISOString(), by: 'staff@campusprint.demo' },
        { status: 'processing', at: new Date(now - 20 * 60000).toISOString(), by: 'staff@campusprint.demo' },
        { status: 'ready', at: new Date(now - 2 * 60000).toISOString(), by: 'staff@campusprint.demo' },
      ],
      createdAt: new Date(now - 45 * 60000).toISOString(),
      updatedAt: new Date(now - 2 * 60000).toISOString(),
    },
    {
      orderId: 'CP-103',
      userId: 'karthik@campusprint.demo',
      userName: 'Karthik Rao',
      fileName: 'Final_Year_Capstone_Project_Report.pdf',
      fileKey: 'demo-capstone.pdf',
      fileSizeBytes: 1540000,
      pages: 42,
      options: { copies: 2, colorMode: 'bw', sided: 'double', paperSize: 'A4', binding: 'spiral', notes: 'Spiral binding with transparent front cover' },
      cost: { perPage: 2, pages: 42, copies: 2, printCost: 168, bindingCost: 40, total: 208, currency: 'INR' },
      paymentMethod: 'counter',
      paymentStatus: 'unpaid',
      status: 'placed',
      rejectionReason: null,
      estimatedReadyAt: null,
      statusHistory: [
        { status: 'placed', at: new Date(now - 10 * 60000).toISOString(), by: 'karthik@campusprint.demo' },
      ],
      createdAt: new Date(now - 10 * 60000).toISOString(),
      updatedAt: new Date(now - 10 * 60000).toISOString(),
    },
    {
      orderId: 'CP-104',
      userId: 'priya@campusprint.demo',
      userName: 'Priya Sharma',
      fileName: 'Microeconomics_Question_Bank.pdf',
      fileKey: 'demo-econ.pdf',
      fileSizeBytes: 520000,
      pages: 20,
      options: { copies: 1, colorMode: 'bw', sided: 'double', paperSize: 'A4', binding: 'staple', notes: 'Staple at top-left' },
      cost: { perPage: 2, pages: 20, copies: 1, printCost: 40, bindingCost: 0, total: 40, currency: 'INR' },
      paymentMethod: 'online',
      paymentStatus: 'paid',
      status: 'completed',
      rejectionReason: null,
      estimatedReadyAt: new Date(now - 120 * 60000).toISOString(),
      statusHistory: [
        { status: 'placed', at: new Date(now - 180 * 60000).toISOString(), by: 'priya@campusprint.demo' },
        { status: 'accepted', at: new Date(now - 170 * 60000).toISOString(), by: 'staff@campusprint.demo' },
        { status: 'processing', at: new Date(now - 150 * 60000).toISOString(), by: 'staff@campusprint.demo' },
        { status: 'ready', at: new Date(now - 120 * 60000).toISOString(), by: 'staff@campusprint.demo' },
        { status: 'completed', at: new Date(now - 60 * 60000).toISOString(), by: 'staff@campusprint.demo' },
      ],
      createdAt: new Date(now - 180 * 60000).toISOString(),
      updatedAt: new Date(now - 60 * 60000).toISOString(),
    },
    {
      orderId: 'CP-105',
      userId: 'sneha@campusprint.demo',
      userName: 'Sneha Kapoor',
      fileName: 'Architectural_Floorplans_A3.pdf',
      fileKey: 'demo-plans.pdf',
      fileSizeBytes: 890000,
      pages: 6,
      options: { copies: 2, colorMode: 'color', sided: 'single', paperSize: 'A4', binding: 'none', notes: 'Needs color clarity for legends' },
      cost: { perPage: 8, pages: 6, copies: 2, printCost: 96, bindingCost: 0, total: 96, currency: 'INR' },
      paymentMethod: 'online',
      paymentStatus: 'paid',
      status: 'accepted',
      rejectionReason: null,
      estimatedReadyAt: new Date(now + 40 * 60000).toISOString(),
      statusHistory: [
        { status: 'placed', at: new Date(now - 12 * 60000).toISOString(), by: 'sneha@campusprint.demo' },
        { status: 'accepted', at: new Date(now - 4 * 60000).toISOString(), by: 'staff@campusprint.demo' },
      ],
      createdAt: new Date(now - 12 * 60000).toISOString(),
      updatedAt: new Date(now - 4 * 60000).toISOString(),
    }
  ];

  for (const o of sampleOrders) {
    await doc.send(new PutCommand({ TableName: ordersTable, Item: o }));
    console.log(`  ? Created order: ${o.orderId} (${o.fileName} - ${o.status})`);
  }
}

async function main() {
  await seedUsers();
  await seedOrders();
  console.log('\n? All demo users and orders successfully seeded into AWS DynamoDB!');
}

main().catch((err) => {
  console.error('Error seeding DynamoDB:', err);
  process.exit(1);
});
