export function parseMoney(value: string): number {
  if (!value.trim()) return 0
  const normalized = value.replace(/\./g, '').replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}
