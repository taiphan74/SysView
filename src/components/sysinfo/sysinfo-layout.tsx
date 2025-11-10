import type { ReactNode } from "react"

interface SysInfoLayoutProps {
  chart: ReactNode
  infoPanel: ReactNode
  className?: string
}

/**
 * Splits the screen into a main chart (left) and a stacked info panel (right).
 */
export function SysInfoLayout({
  chart,
  infoPanel,
  className = "",
}: SysInfoLayoutProps) {
  return (
    <div
      className={`flex h-full flex-col gap-4 lg:flex-row ${className}`.trim()}
    >
      <div className="flex-1 min-h-[320px] lg:min-h-[420px]">{chart}</div>
      <div className="w-full lg:w-[320px]">{infoPanel}</div>
    </div>
  )
}
