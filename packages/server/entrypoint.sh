#!/bin/sh
npx prisma generate
npx prisma db push
# Start the application
exec node dist/main.js
