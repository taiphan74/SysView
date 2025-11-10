const BYTES_PER_GIB = 1024 ** 3
const BYTES_PER_KIB = 1024

const DEFAULT_PRECISION = 1
const DEFAULT_FALLBACK = "N/A"

type NullableNumber = number | null | undefined

/**
 * Sysinfo changed its memory units from KiB to bytes in v0.30.
 * This helper normalizes either representation into GiB so the UI stays accurate
 * even if the backend version changes again.
 */
export function bytesLikeToGiB(value: NullableNumber): number | null {
  if (typeof value !== "number" || value <= 0) {
    return null
  }

  const gibFromBytes = value / BYTES_PER_GIB
  if (gibFromBytes >= 0.1 && gibFromBytes <= 4096) {
    return gibFromBytes
  }

  const gibFromKib = (value * BYTES_PER_KIB) / BYTES_PER_GIB
  if (gibFromKib >= 0.1 && gibFromKib <= 4096) {
    return gibFromKib
  }

  return gibFromBytes
}

interface FormatOptions {
  precision?: number
  fallback?: string
  includeUnit?: boolean
}

export function formatRamGiB(
  value: NullableNumber,
  { precision = DEFAULT_PRECISION, fallback = DEFAULT_FALLBACK, includeUnit = true }: FormatOptions = {},
): string {
  const gib = bytesLikeToGiB(value)
  if (gib === null) {
    return fallback
  }

  const formatted = gib.toFixed(precision)
  return includeUnit ? `${formatted} GiB` : formatted
}

export function formatRamUsage(
  used: NullableNumber,
  total: NullableNumber,
  options: Omit<FormatOptions, "includeUnit"> = {},
): string | null {
  const usedGiB = bytesLikeToGiB(used)
  const totalGiB = bytesLikeToGiB(total)
  if (usedGiB === null || totalGiB === null) {
    return null
  }

  const precision = options.precision ?? DEFAULT_PRECISION
  return `${usedGiB.toFixed(precision)} / ${totalGiB.toFixed(precision)} GiB`
}
