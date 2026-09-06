const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Prefix an absolute site path with the configured base. Pages end with "/". */
export const url = (path: string) => base + path;
