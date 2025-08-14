// import React from "react";
import { formatIDR, clampPct } from "../utils/format";

export default function CartTotals({ subtotal, globalDiscountPct, taxPct, onGlobalDiscount, onTax, onPay }: {
    subtotal: number;
    globalDiscountPct: number;
    taxPct: number;
    onGlobalDiscount: (pct: number) => void;
    onTax: (pct: number) => void;
    onPay: (grandTotal: number) => void;
}) {
    const afterGlobal = subtotal * (1 - globalDiscountPct / 100);
    const tax = Math.round(afterGlobal * (taxPct / 100));
    const grandTotal = Math.max(0, Math.round(afterGlobal + tax));
    return (
        <>
            <div className="totals">
                <div className="rowBetween"><span>Subtotal</span><span>{formatIDR(subtotal)}</span></div>
                <div className="rowBetween">
                    <div>Diskon Global (%)
                        <input type="number" value={globalDiscountPct} min={0} max={100} className="input small" style={{ marginLeft: 8 }}
                            onChange={(e) => onGlobalDiscount(clampPct(Number(e.target.value)))} />
                    </div>
                    <span>-{formatIDR(Math.round(subtotal - afterGlobal))}</span>
                </div>
                <div className="rowBetween">
                    <div>PPN (%)
                        <input type="number" value={taxPct} min={0} max={100} className="input small" style={{ marginLeft: 8 }}
                            onChange={(e) => onTax(clampPct(Number(e.target.value)))} />
                    </div>
                    <span>{formatIDR(tax)}</span>
                </div>
                <div className="rowBetween" style={{ borderTop: '1px dashed rgba(255,255,255,.16)', paddingTop: 8 }}>
                    <span>Grand Total</span><span>{formatIDR(grandTotal)}</span>
                </div>
            </div>
            <div className="row" style={{ marginTop: 12 }}>
                <button className="btn primary" onClick={() => onPay(grandTotal)}>Pay</button>
                {/* <button className="btn">Shortcuts</button>
                <button className="btn ghost">Hold Order</button> */}
            </div>
        </>
    );
}
