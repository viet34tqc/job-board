export default () => ({
  backendPort: process.env.BACKEND_PORT
    ? parseInt(process.env.BACKEND_PORT)
    : 3001,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  databaseUrl:
    process.env.DATABASE_URL ??
    'mongodb://root:admin123@localhost:27017/mydb?authSource=admin',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'your-jwt-secret-key-here',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ?? 'your-jwt-secret-key-here',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '10d',
  emailHost: process.env.EMAIL_HOST ?? 'smtp.example.com',
  smtpUser: process.env.SMTP_USER ?? 'your-smtp-user',
  smtpPassword: process.env.SMTP_PASSWORD ?? 'your-smtp-password',
  awsRegion: process.env.AWS_REGION ?? 'your-s3-region',
  awsBucketName: process.env.AWS_BUCKET_NAME ?? 'your-s3-bucket-name',
  awsAccessKey: process.env.AWS_ACCESS_KEY ?? 'your-s3-access-key',
  awsSecretAccessKey:
    process.env.AWS_SECRET_ACCESS_KEY ?? 'your-s3-secret-access-key',
});
