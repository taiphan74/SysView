import { formatRamGiB } from "@/algorithms/memory-format"
import type { RamStaticInfo } from "@/types/sysinfo"

interface RamInfoPanelProps {
  data?: RamStaticInfo
}

const fallback = "N/A"

const formatNumber = (value?: number | null) =>
  typeof value === "number" ? String(value) : fallback

export function RamInfoPanel({ data }: RamInfoPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 text-sm shadow-sm">
      <h3 className="text-base font-semibold">Memory Info</h3>
      <dl className="mt-4 space-y-3">
        <InfoRow label="Total" value={formatRamGiB(data?.total)} />
        <InfoRow label="Swap total" value={formatRamGiB(data?.swapTotal)} />
        <InfoRow label="Speed" value={data?.speedMtps ? `${data.speedMtps} MT/s` : fallback} />
        <InfoRow label="Slots used" value={formatNumber(data?.slotsUsed)} />
        <InfoRow label="Slots available" value={formatNumber(data?.slotsAvailable)} />
        <InfoRow label="Form factor" value={data?.formFactor ?? fallback} />
        <InfoRow label="Memory type" value={data?.memType ?? fallback} />
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
