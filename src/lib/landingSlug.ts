// Generate a URL-friendly slug from property name + neighborhood + code.
// Guarantees uniqueness by appending the code suffix.
export function makeLandingSlug(input: {
  propertyName?: string;
  neighborhood?: string;
  city?: string;
  code?: string;
}): string {
  const parts = [input.propertyName, input.neighborhood, input.city].filter(Boolean).join(' ');
  const base = (parts || 'imovel')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
  const suffix = (input.code || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(-6);
  return suffix ? `${base}-${suffix}` : base;
}