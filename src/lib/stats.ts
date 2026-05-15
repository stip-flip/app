import { formatEther } from "ethers/lib/utils";

export function shortAddress(address?: string | null, size = 6) {
  if (!address) return "unknown";
  if (address.length <= size * 2 + 2) return address;
  return `${address.slice(0, size)}...${address.slice(-4)}`;
}

export function numberValue(value?: number | string | null) {
  if (value === undefined || value === null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function etherValue(value?: number | string | null) {
  if (value === undefined || value === null) return 0;
  try {
    return Number(formatEther(String(value)));
  } catch {
    return numberValue(value);
  }
}

export function compact(value?: number | string | null, decimals = 2) {
  const n = typeof value === "number" ? value : numberValue(value);
  if (!Number.isFinite(n)) return "0";
  return Intl.NumberFormat("en", {
    notation: Math.abs(n) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: decimals,
  }).format(n);
}

export function compactEther(value?: number | string | null, decimals = 2) {
  return compact(etherValue(value), decimals);
}

export function formatDate(timestamp?: number | string | null) {
  const seconds = numberValue(timestamp);
  if (!seconds) return "pending";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(seconds * 1000));
}

export function volumeTotal(snapshot?: {
  enterVolume?: number | string | null;
  exitVolume?: number | string | null;
  swapLiquidityVolume?: number | string | null;
}) {
  if (!snapshot) return 0;
  return (
    etherValue(snapshot.enterVolume) +
    etherValue(snapshot.exitVolume) +
    etherValue(snapshot.swapLiquidityVolume)
  );
}

export function maxOf(values: number[]) {
  return Math.max(1, ...values.filter((value) => Number.isFinite(value)));
}
