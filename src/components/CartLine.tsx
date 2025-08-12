// import React from "react";
import { formatIDR, clampPct } from "../utils/format";
import type { CartLine as CartLineType } from "../types";

export default function CartLine({ line, onQty, onDiscount, onRemove }: {
    line: CartLineType;
    onQty: (delta: number) => void;
    onDiscount: (pct: number) => void;
    onRemove: () => void;
}) {
    const lineTotal = line.price * line.qty * (1 - (line.discountPct ?? 0) / 100);
    return (
        <div className="cartrow">
            <div>
                <div style={{ fontWeight: 700 }}>{line.name}</div>
                <div className="meta">{formatIDR(line.price)} / item</div>
            </div>
            <div>
                <div className="qtybox">
                    <button onClick={() => onQty(-1)}>-</button>
                    <span>{line.qty}</span>
                    <button onClick={() => onQty(+1)}>+</button>
                </div>
            </div>
            <div>
                <div className="meta" style={{ marginBottom: 4 }}>Disc %</div>
                <input
                    type="number"
                    value={line.discountPct ?? 0}
                    min={0}
                    max={100}
                    className="input small"
                    onChange={(e) => onDiscount(clampPct(Number(e.target.value)))}
                />
            </div>
            <div className="right">{formatIDR(lineTotal)}</div>
            <button onClick={onRemove} className="btn danger">×</button>
        </div>
    );
}
