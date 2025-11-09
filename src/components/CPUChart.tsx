"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { core } from "@tauri-apps/api"
import type { TooltipProps } from "recharts"
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface CPUChartProps {
  className?: string
}

function ChartContainer({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`w-full rounded-xl border border-border bg-background p-4 text-foreground shadow-sm ${className}`}
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
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
      <p className="text-muted-foreground">Usage</p>
      <p className="font-semibold">{item.value?.toFixed(1)}%</p>
    </div>
  )
}

export function CPUChart({ className = "h-[260px]" }: CPUChartProps) {
  const [history, setHistory] = useState<number[]>([])
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const fetchHistory = async () => {
      try {
        const response = await core.invoke<number[]>("get_cpu_usage_history")
        if (mountedRef.current) {
          setHistory(response)
        }
      } catch (error) {
        console.error("Failed to fetch CPU usage history", error)
      }
    }

    fetchHistory()
    const id = setInterval(fetchHistory, 1000)

    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [])

  const chartData = useMemo(
    () =>
      (history.length ? history : [0]).map((usage, idx) => ({
        idx,
        usage: Number(usage.toFixed(1)),
      })),
    [history],
  )

  return (
    <ChartContainer className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cpu-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="rgba(148, 163, 184, 0.12)"
            vertical={false}
            strokeDasharray="4 8"
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
            animationDuration={500}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
