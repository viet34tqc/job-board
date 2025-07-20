export default () => ({
  backendPort: process.env.BACKEND_PORT
    ? parseInt(process.env.BACKEND_PORT)
    : 3001,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  databaseUrl:
    process.env.DATABASE_URL ??
    'mongodb://root:admin123@localhost:27017/mydb?authSource=admin',
  jwtSecret: process.env.JWT_SECRET ?? 'your-jwt-secret-key-here',
});
