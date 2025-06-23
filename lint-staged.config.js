module.exports = {
  'packages/client/**/*.{js,jsx,ts,tsx}': [
    'pnpm --filter client lint',
    'pnpm --filter client format',
  ],
  'packages/server/**/*.{js,ts}': [
    'pnpm --filter server lint',
    'pnpm --filter server format',
  ],
};
