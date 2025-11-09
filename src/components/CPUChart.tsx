"use client"

import type { ReactNode } from "react"
import type { TooltipProps } from "recharts"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

type CpuDatum = {
  time: string
  usage: number
}

const generateCpuData = (points = 90): CpuDatum[] => {
  let usage = 30 + Math.random() * 20

  return Array.from({ length: points }, (_, idx) => {
    usage = Math.max(5, Math.min(97, usage + (Math.random() - 0.5) * 15))
    const seconds = idx * 2
    const minutes = Math.floor(seconds / 60)
    const remainder = seconds % 60

    return {
      time: `${minutes}:${remainder.toString().padStart(2, "0")}s`,
      usage: Number(usage.toFixed(1)),
    }
  })
}

const data = generateCpuData()

function ChartContainer({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`w-full rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-100 shadow-inner ${className}`}
    >
      {children}
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
}: TooltipProps<number, string | number>) {
  if (!active || !payload?.length) return null

  const item = payload[0]

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs">
      <p className="font-semibold text-slate-200">{item.payload.time}</p>
      <p className="text-slate-400">Usage: {item.value}%</p>
    </div>
  )
}

export function CPUChart() {
  return (
    <ChartContainer className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cpu-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2F7DED" stopOpacity={0.65} />
              <stop offset="90%" stopColor="#1B3A73" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="rgba(148, 163, 184, 0.12)"
            vertical={false}
            strokeDasharray="4 8"
          />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            width={32}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#1d4ed8" }} />
          <Area
            type="monotone"
            dataKey="usage"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#cpu-gradient)"
            animationDuration={1200}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
