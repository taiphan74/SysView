"use client";

import * as React from "react";
import { invoke } from "@tauri-apps/api/core";

import { cn } from "@/lib/utils";

type HardwareDevice = {
  id: string;
  name: string;
  desc?: string;
  value?: string;
};

interface HardwareSidebarListProps {
  list: HardwareDevice[];
  activeId?: string;
  onSelect?: (deviceId: string) => void;
}

type MetricConfig = {
  key: string;
  historyCommand: string;
  latestCommand: string;
  color: string;
  sampleSize?: number;
  intervalMs?: number;
};

const METRIC_CONFIGS: Record<string, MetricConfig> = {
  cpu: {
    key: "cpu",
    historyCommand: "get_cpu_history",
    latestCommand: "get_cpu_latest",
    color: "#60a5fa",
    sampleSize: 32,
  },
  memory: {
    key: "memory",
    historyCommand: "get_ram_history",
    latestCommand: "get_ram_latest",
    color: "#34d399",
    sampleSize: 32,
  },
};

export function HardwareSidebarList({
  list,
  activeId,
  onSelect,
}: HardwareSidebarListProps) {
  return (
    <div className="flex flex-col gap-2">
      {list.map((item) => (
        <SidebarMetricCard
          key={item.id}
          item={item}
          isActive={item.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

interface SidebarMetricCardProps {
  item: HardwareDevice;
  isActive: boolean;
  onSelect?: (deviceId: string) => void;
}

function SidebarMetricCard({
  item,
  isActive,
  onSelect,
}: SidebarMetricCardProps) {
  const metricConfig = React.useMemo(() => pickMetricConfig(item.id), [item.id]);
  const { history, latest } = useMetricHistory(metricConfig);

  const displayValue = React.useMemo(() => {
    if (item.value) return item.value;
    if (typeof latest === "number") {
      return `${latest.toFixed(0)}%`;
    }
    return "Đang cập nhật...";
  }, [item.value, latest]);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.id)}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
        isActive
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-background/30 hover:border-primary/40",
      )}
      aria-pressed={isActive}
    >
      <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-border/50 bg-muted/30">
        <MiniSparkline data={history} color={metricConfig?.color} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{item.name}</p>
        {item.desc ? (
          <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
        ) : null}
        <p className="text-xs font-semibold text-muted-foreground">
          {displayValue}
        </p>
      </div>
    </button>
  );
}

function pickMetricConfig(deviceId: string): MetricConfig | undefined {
  const id = deviceId.toLowerCase();
  if (id.startsWith("cpu")) return METRIC_CONFIGS.cpu;
  if (id.startsWith("memory") || id.startsWith("ram"))
    return METRIC_CONFIGS.memory;
  return undefined;
}

function useMetricHistory(config?: MetricConfig) {
  const [history, setHistory] = React.useState<number[]>([]);
  const [latest, setLatest] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!config) return;
    let mounted = true;

    const limit = config.sampleSize ?? 32;
    const intervalMs = config.intervalMs ?? 1000;

    const fetchHistory = async () => {
      try {
        const response = await invoke<number[]>(config.historyCommand);
        if (!mounted || !Array.isArray(response)) return;
        const trimmed = response.slice(-limit);
        setHistory(trimmed);
        const last = trimmed[trimmed.length - 1];
        if (typeof last === "number") {
          setLatest(last);
        }
      } catch (error) {
        console.error(`Failed to fetch ${config.key} history`, error);
      }
    };

    const fetchLatest = async () => {
      try {
        const result = await invoke<number | null>(config.latestCommand);
        if (!mounted || typeof result !== "number") return;
        setHistory((prev) => {
          const next = [...prev, result];
          return next.slice(-limit);
        });
        setLatest(result);
      } catch (error) {
        console.error(`Failed to fetch ${config.key} latest`, error);
      }
    };

    fetchHistory();
    const timer = setInterval(fetchLatest, intervalMs);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [config?.key]);

  return { history, latest };
}

function MiniSparkline({
  data,
  color = "#94a3b8",
}: {
  data: number[];
  color?: string;
}) {
  const samples = data.length ? data : [0];
  const points = React.useMemo(() => {
    if (samples.length === 1) {
      return [
        { x: 0, y: 100 - clamp(samples[0]) },
        { x: 100, y: 100 - clamp(samples[0]) },
      ];
    }
    return samples.map((value, index) => {
      const x =
        samples.length <= 1
          ? 0
          : (index / (samples.length - 1)) * 100;
      const y = 100 - clamp(value);
      return { x, y };
    });
  }, [samples]);

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${linePoints} 100,100 0,100`;

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-full">
      <polygon
        points={areaPoints}
        fill={color}
        fillOpacity={0.12}
        stroke="none"
      />
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function clamp(value: number) {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}
