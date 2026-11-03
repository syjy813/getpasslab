/** URL is the source of truth; service switching never depends on browser storage. */
export function getServiceArea(pathname: string): 'facility' | 'certifications' {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && (pathname === base || pathname.startsWith(`${base}/`))
    ? pathname.slice(base.length) : pathname;
  return path === '/facility-management' || path.startsWith('/facility-management/')
    ? 'facility' : 'certifications';
}
