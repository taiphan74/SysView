"use client"

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import { invoke } from "@tauri-apps/api/core"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts"
import {
  createEmptyHistory,
  hasHistorySamples,
  normalizeHistory,
  pushHistoryValue,
} from "./history-buffer"

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
      className={`h-full w-full rounded-xl border border-border bg-background p-4 text-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

type ChartTooltipProps = {
  active?: boolean
  payload?: Array<{ value?: number | null }>
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  const item = payload[0]
  if (typeof item.value !== "number") return null

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
      <p className="text-muted-foreground">Usage</p>
      <p className="font-semibold">{item.value.toFixed(1)}%</p>
    </div>
  )
}

export function CPUChart({ className = "h-full" }: CPUChartProps) {
  const [history, setHistory] = useState<(number | null)[]>(() =>
    createEmptyHistory(),
  )
  const mountedRef = useRef(true)
  const gradientId = useId()

  useEffect(() => {
    mountedRef.current = true

    // 1) lấy nguyên history khi mount
    const fetchInitialHistory = async () => {
      try {
        // tên command trong Rust: get_cpu_history
        const response = await invoke<number[]>("get_cpu_history")
        if (mountedRef.current) {
          setHistory(normalizeHistory(response))
        }
      } catch (error) {
        console.error("Failed to fetch CPU history", error)
      }
    }

    fetchInitialHistory()

    // 2) sau đó mỗi 1s chỉ lấy điểm mới nhất
    const id = setInterval(async () => {
      try {
        // tên command trong Rust: get_cpu_latest
        const latest = await invoke<number | null>("get_cpu_latest")
        if (!mountedRef.current || typeof latest !== "number") return
        setHistory(prev => pushHistoryValue(prev, latest))
      } catch (error) {
        console.error("Failed to fetch latest CPU usage", error)
      }
    }, 1000)

    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [])

  const chartData = useMemo(
    () => history.map((usage, idx) => ({ idx, usage })),
    [history],
  )
  const hasSamples = hasHistorySamples(history)

  return (
    <ChartContainer className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
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
          <Tooltip content={<ChartTooltip />} cursor={false} />
          {hasSamples && (
            <Area
              type="monotone"
              dataKey="usage"
              stroke="#3B82F6"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              animationDuration={500}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
