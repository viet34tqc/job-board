import { PERMISSION_METHOD } from '@base/shared';

export const mockPermissions = [
  // User-related permissions
  {
    name: 'View Users',
    apiPath: '/api/v1/users',
    method: PERMISSION_METHOD.GET,
    module: 'USERS',
    isDeleted: false,
  },
  {
    name: 'Create User',
    apiPath: '/api/v1/users',
    method: PERMISSION_METHOD.POST,
    module: 'USERS',
    isDeleted: false,
  },
  {
    name: 'Update User',
    apiPath: '/api/v1/users/:id',
    method: PERMISSION_METHOD.PUT,
    module: 'USERS',
    isDeleted: false,
  },
  {
    name: 'Delete User',
    apiPath: '/api/v1/users/:id',
    method: PERMISSION_METHOD.DELETE,
    module: 'USERS',
    isDeleted: false,
  },

  // Role-related permissions
  {
    name: 'View Roles',
    apiPath: '/api/v1/roles',
    method: PERMISSION_METHOD.GET,
    module: 'ROLES',
    isDeleted: false,
  },
  {
    name: 'Manage Role Permissions',
    apiPath: '/api/v1/roles/:id/permissions',
    method: PERMISSION_METHOD.POST,
    module: 'ROLES',
    isDeleted: false,
  },

  // Permission-related permissions
  {
    name: 'View Permissions',
    apiPath: '/api/v1/permissions',
    method: PERMISSION_METHOD.GET,
    module: 'PERMISSIONS',
    isDeleted: false,
  },
  {
    name: 'Create Permission',
    apiPath: '/api/v1/permissions',
    method: PERMISSION_METHOD.POST,
    module: 'PERMISSIONS',
    isDeleted: false,
  },
  {
    name: 'Update Permission',
    apiPath: '/api/v1/permissions/:id',
    method: PERMISSION_METHOD.PUT,
    module: 'PERMISSIONS',
    isDeleted: false,
  },
  {
    name: 'Delete Permission',
    apiPath: '/api/v1/permissions/:id',
    method: PERMISSION_METHOD.DELETE,
    module: 'PERMISSIONS',
    isDeleted: false,
  },

  // Job-related permissions
  {
    name: 'View Jobs',
    apiPath: '/api/v1/jobs',
    method: PERMISSION_METHOD.GET,
    module: 'JOBS',
    isDeleted: false,
  },
  {
    name: 'Create Job',
    apiPath: '/api/v1/jobs',
    method: PERMISSION_METHOD.POST,
    module: 'JOBS',
    isDeleted: false,
  },
  {
    name: 'Update Job',
    apiPath: '/api/v1/jobs/:id',
    method: PERMISSION_METHOD.PUT,
    module: 'JOBS',
    isDeleted: false,
  },
  {
    name: 'Delete Job',
    apiPath: '/api/v1/jobs/:id',
    method: PERMISSION_METHOD.DELETE,
    module: 'JOBS',
    isDeleted: false,
  },

  // Resume-related permissions
  {
    name: 'View Resumes',
    apiPath: '/api/v1/resumes',
    method: PERMISSION_METHOD.GET,
    module: 'RESUMES',
    isDeleted: false,
  },
  {
    name: 'Upload Resume',
    apiPath: '/api/v1/resumes',
    method: PERMISSION_METHOD.POST,
    module: 'RESUMES',
    isDeleted: false,
  },
  {
    name: 'Update Resume Status',
    apiPath: '/api/v1/resumes/:id/status',
    method: PERMISSION_METHOD.PUT,
    module: 'RESUMES',
    isDeleted: false,
  },
  {
    name: 'Delete Resume',
    apiPath: '/api/v1/resumes/:id',
    method: PERMISSION_METHOD.DELETE,
    module: 'RESUMES',
    isDeleted: false,
  },
];
