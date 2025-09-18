# Job Board

A platform for job posting and recruitment with role-based access control.

## Features

- **Job Posting**
  Employers can post job listings, with permissions managed via role-based access control.

- **Job Search by Skills**
  Candidates can search for jobs based on specific skill tags.

- **Scheduled Email Notifications**
  Weekly job recommendation emails are sent to subscribers based on their chosen skills.

## Entities

Who uses the system:

- **User**: Represents a user with properties such as email, password, role, and subscription status.
- **Company**: Represents a company with properties such as name, description, and logo.
- **Admin**: Represents an admin with properties such as email, password, role, and subscription status.

Other entities:

- **Job**: Represents a job listing with properties such as title, description, company, and skills.
- **Subscription**: Represents a subscription with properties such as user, skill, and start date.
- **CV**: Represents a CV with properties such as user, job, and file.
- **Skills**: Represents a skill such as "React", "Node.js", "Python", etc.
- **Roles**: Represents a role such as "Candidate", "Employer", "Admin", etc.
- **Permissions**: Represents a permission such as "Create", "Read", "Update", "Delete", etc.

## Relationships

- **Candidate** has many **CVs**.
- **CV** belongs to one **Candidate**.
- **Company** has many **Jobs**.
- **Job** belongs to one **Company**.
- **Job** has many **Skills**.
- **Skill** belongs to many **Job**.
- **Role** has many **Permissions**.
- **Permission** belongs to many **Role**.
- **User** has one **Role**.
- **Role** belongs to one **User**.

## User Roles and Functionalities

### 1. **Candidate**

- Register and log in.
- Search for jobs by skills.
- View job postings.
- Submit CVs to job postings (via S3 or saved in disk).
- Subscribe to specific skills to receive weekly job updates via email.

### 2. **Employer**

- Register and log in.
- Post new job postings.
- Manage job postings.
- Add company profile and introduction.
- Review and approve submitted CVs before they are forwarded to employers.

### 3. **Admin**

- Manage users, job postings, and system settings.

## Skill-Based Subscription System

Candidates can subscribe to one or more skills. The system will automatically send them a weekly email containing job postings that match their subscribed skills.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (v20 or later) & Docker Compose
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:viet34tqc/base-vite-nestjs.git
   cd base-vite-nestjs
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

## Development

```bash
pnpm docker:dev
```

This will start:

- Frontend dev server: `http://localhost:5173`
- Backend server: `http://localhost:3000`
- MongoDB: `27017`

How it works:

- Server (NestJS):
  - Need to pre-built JS in shared module first because when we import runtime constant from shared module, Node.js in server container can't execute TypeScript directly.
  - When we install all the packages using pnpm workspace, pnpm sees `@base/shared` in `packages/server/package.json` and creates a symlink from `node_modules/@base/shared` to `/app/packages/shared
  - When we have change in the shared module, we use watch to sync code from local `packages/shared` to `/app/packages/shared`. So the flow of change is `package/shared` => `/app/packages/shared` => `packages/server/node_modules/@base/shared`.
- Client (Vite - WIP): Using `esbuild` and handles TypeScript natively during development. It transform TypeScript syntax to JavaScript on the fly. So we don't need to pre-build JS in shared folder

## Codebase and Feature documentation

### Transform data using `transformData.decorator.ts`

The response from the server will be in the following format:

```json
{
  "statusCode": 200,
  "data": T
}
```
