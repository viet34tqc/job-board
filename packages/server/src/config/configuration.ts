export default () => ({
  BACKEND_PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  DATABASE_URL:
    process.env.DATABASE_URL ??
    'mongodb://root:admin123@localhost:27017/mydb?authSource=admin',
});
