import { formatEther, parseEther } from "viem";

// v4 TickMath bounds; swap limits must sit strictly inside them
export const MIN_SQRT_PRICE_LIMIT = 4295128739n + 1n;
export const MAX_SQRT_PRICE_LIMIT = 1461446703485210103287273052203988822378723970342n - 1n;

const Q96 = 2 ** 96;
const LOG_BASE = Math.log(1.0001);

/** Both test tokens have 18 decimals, so price (token1 per token0) = 1.0001^tick. */
export const tickToPrice = (tick: number) => Math.pow(1.0001, tick);

export function priceToTick(price: number, spacing: number, mode: "floor" | "ceil" = "floor") {
  if (!(price > 0)) throw new Error("Price must be positive.");
  const raw = Math.log(price) / LOG_BASE;
  const snapped = mode === "floor" ? Math.floor(raw / spacing) * spacing : Math.ceil(raw / spacing) * spacing;
  return snapped === 0 ? 0 : snapped; // avoid -0
}

export function sqrtPriceToPrice(sqrtPriceX96: bigint) {
  const r = Number(sqrtPriceX96) / Q96;
  return r * r;
}

export const fromWad = (v: bigint | undefined | null) => (v == null ? 0 : Number(formatEther(v)));

export function toWad(v: string | number) {
  const s = String(v).trim().replace(/,/g, "");
  if (!/^\d*\.?\d*$/.test(s) || s === "" || s === ".") throw new Error(`"${v}" is not a valid amount.`);
  return parseEther(s);
}

export function fmt(n: number, digits = 2) {
  if (!isFinite(n)) return "–";
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** `x` is a fraction: 0.0123 -> "+1.230%" */
export function fmtPct(x: number, digits = 2) {
  if (!isFinite(x)) return "–";
  const v = x * 100;
  const s = Math.abs(v).toFixed(digits);
  if (Number(s) === 0) return `${(0).toFixed(digits)}%`;
  return `${v > 0 ? "+" : "−"}${s}%`;
}
