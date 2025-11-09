"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { invoke } from "@tauri-apps/api/core"
import type { TooltipProps } from "recharts"
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface RAMChartProps {
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
      <p className="text-muted-foreground">RAM usage</p>
      <p className="font-semibold">{item.value?.toFixed(1)}%</p>
    </div>
  )
}

export function RAMChart({ className = "h-[260px]" }: RAMChartProps) {
  const [history, setHistory] = useState<number[]>([])
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    // 1) lấy nguyên history khi mount
    const fetchInitialHistory = async () => {
      try {
        const response = await invoke<number[]>("get_ram_history")
        if (mountedRef.current && Array.isArray(response)) {
          setHistory(response)
        }
      } catch (error) {
        console.error("Failed to fetch RAM history", error)
      }
    }

    fetchInitialHistory()

    // 2) sau đó mỗi 1s chỉ lấy điểm mới nhất
    const id = setInterval(async () => {
      try {
        const latest = await invoke<number | null>("get_ram_latest")
        if (!mountedRef.current) return
        if (typeof latest === "number") {
          setHistory(prev => {
            const next = [...prev, latest]
            return next.slice(-200) // giữ tối đa 200 mẫu
          })
        }
      } catch (error) {
        console.error("Failed to fetch latest RAM usage", error)
      }
    }, 1000)

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
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="ram-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.15} />
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
          <Area
            type="monotone"
            dataKey="usage"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#ram-gradient)"
            animationDuration={500}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
