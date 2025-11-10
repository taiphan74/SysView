import type { CpuStaticInfo } from "@/types/sysinfo"

interface CpuInfoPanelProps {
  data?: CpuStaticInfo
}

const fallback = "N/A"

const formatFrequency = (mhz?: number | null) =>
  typeof mhz === "number" ? `${(mhz / 1000).toFixed(2)} GHz` : fallback

const formatNumber = (value?: number | null) =>
  typeof value === "number" ? String(value) : fallback

const formatCache = (label: string, value?: string | null) =>
  value ? `${label}: ${value}` : `${label}: ${fallback}`

export function CpuInfoPanel({ data }: CpuInfoPanelProps) {
  const caches = [
    { label: "L1", value: data?.caches?.l1 },
    { label: "L2", value: data?.caches?.l2 },
    { label: "L3", value: data?.caches?.l3 },
  ]

  return (
    <div className="rounded-xl border border-border bg-background p-4 text-sm shadow-sm">
      <h3 className="text-base font-semibold">CPU Info</h3>
      <dl className="mt-4 space-y-3">
        <InfoRow label="Brand" value={data?.brand ?? fallback} />
        <InfoRow label="Physical cores" value={formatNumber(data?.physicalCores)} />
        <InfoRow label="Logical processors" value={formatNumber(data?.virtualProcessors)} />
        <InfoRow label="Sockets" value={formatNumber(data?.sockets)} />
        <InfoRow label="Base clock" value={formatFrequency(data?.baseFrequencyMhz)} />
        <InfoRow label="Governor" value={data?.governor ?? fallback} />
        <InfoRow label="Virtualization" value={data?.virtualization ?? fallback} />
        <div>
          <dt className="text-muted-foreground">Cache</dt>
          <dd className="mt-1 grid gap-1">
            {caches.map(cache => (
              <span key={cache.label} className="font-medium text-foreground">
                {formatCache(cache.label, cache.value)}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value || fallback}</dd>
    </div>
  )
}
