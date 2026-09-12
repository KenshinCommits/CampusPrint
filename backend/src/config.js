import 'dotenv/config';

export const config = {
  dbDriver: process.env.DB_DRIVER || 'local',
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  corsOrigin: process.env.CORS_ORIGIN || '*',

  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  usersTable: process.env.USERS_TABLE || 'campusprint-users',
  ordersTable: process.env.ORDERS_TABLE || 'campusprint-orders',

  rates: {
    bw: Number(process.env.RATE_BW_PER_PAGE || 2),
    color: Number(process.env.RATE_COLOR_PER_PAGE || 8),
    bindingStaple: Number(process.env.BINDING_FEE_STAPLE || 0),
    bindingSpiral: Number(process.env.BINDING_FEE_SPIRAL || 20),
  },
};
