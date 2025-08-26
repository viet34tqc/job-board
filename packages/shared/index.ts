// Shared types and interfaces go here

export interface Example {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ResumeStatus = keyof typeof RESUME_STATUS;

export const RESUME_STATUS = {
  PENDING: 'PENDING',
  REVIEWING: 'REVIEWING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const satisfies Record<string, string>;

export const PERMISSION_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const satisfies Record<string, string>;
