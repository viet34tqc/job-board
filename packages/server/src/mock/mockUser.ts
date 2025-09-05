import { Types } from 'mongoose';

export const mockUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2b$10$YourHashedPasswordHere', // Should be a properly hashed password
    role: new Types.ObjectId(), // This will be replaced with actual role ID
    isDeleted: false,
    // These fields will be set during creation
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: {
      _id: new Types.ObjectId(),
      email: 'system@example.com',
    },
  },
  {
    name: 'HR Manager',
    email: 'hr@example.com',
    password: '$2b$10$YourHashedPasswordHere',
    role: new Types.ObjectId(), // This will be replaced with actual role ID
    isDeleted: false,
    company: {
      _id: new Types.ObjectId(),
      name: 'Tech Corp',
    },
    address: '123 Business St, Tech City',
    age: 35,
    gender: 'Female',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: {
      _id: new Types.ObjectId(),
      email: 'admin@example.com',
    },
  },
  {
    name: 'Job Seeker',
    email: 'candidate@example.com',
    password: '$2b$10$YourHashedPasswordHere',
    role: new Types.ObjectId(), // This will be replaced with actual role ID
    isDeleted: false,
    address: '456 Job St, Job City',
    age: 28,
    gender: 'Male',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: {
      _id: new Types.ObjectId(),
      email: 'system@example.com',
    },
  },
];
