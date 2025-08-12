// src/utils/format.ts
import { clampPct, formatIDR } from "../utils/format";

export const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const clampPct = (v: number) => Math.min(100, Math.max(0, Number.isFinite(v) ? v : 0));
