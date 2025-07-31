// TODO: Replace it with ms package
export function parseDuration(duration: string): number {
  const regex = /^(\d+)([smhdw])$/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error('Invalid duration format');
  }

  const [, value, unit] = matches;
  const num = parseInt(value, 10);

  switch (unit) {
    case 's':
      return num * 1000;
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    case 'w':
      return num * 7 * 24 * 60 * 60 * 1000;
    default:
      throw new Error('Invalid duration unit');
  }
}
