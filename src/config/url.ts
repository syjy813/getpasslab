export const withBase = (p: string) =>
  (import.meta.env.BASE_URL.replace(/\/$/, '') + p) || '/';
