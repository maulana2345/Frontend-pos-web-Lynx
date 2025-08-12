import { useEffect, useMemo, useState } from "react";
import { formatIDR } from "../utils/format";

export type PaymentMethod = "cash" | "card" | "qris";

export default function PaymentDialog({
    open, total, onClose, onComplete,
}: {
    open: boolean;
    total: number;
    onClose: () => void;
    onComplete: (method: PaymentMethod, paidAmount: number) => void;
}) {
    const [method, setMethod] = useState<PaymentMethod>("cash");
    const [amount, setAmount] = useState<number>(total);

    useEffect(() => {
        if (open) {
            setMethod("cash");
            setAmount(total);
        }
    }, [open, total]);

    const change = useMemo(() => Math.max(0, amount - total), [amount, total]);
    const canComplete = method === "cash" ? amount >= total : true;

    if (!open) return null;

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">Payment</div>
                <div className="modal-body">
                    <div>
                        <div className="info">Total to Pay</div>
                        <div style={{ fontSize: 24, fontWeight: 800 }}>{formatIDR(total)}</div>
                    </div>

                    <div className="paygrid">
                        <button className={"btn " + (method === "cash" ? "primary" : "")} onClick={() => setMethod("cash")}>Cash</button>
                        <button className={"btn " + (method === "card" ? "primary" : "")} onClick={() => setMethod("card")}>Card</button>
                        <button className={"btn " + (method === "qris" ? "primary" : "")} onClick={() => setMethod("qris")}>QRIS</button>
                    </div>

                    <div>
                        <div className="info">Paid Amount {method !== "cash" && "(auto exact in non-cash)"}</div>
                        <input
                            type="number"
                            className="input"
                            value={method === "cash" ? amount : total}
                            onChange={(e) => setAmount(Number(e.target.value || 0))}
                            disabled={method !== "cash"}
                        />
                        <div className="info">Change: <b>{formatIDR(method === "cash" ? change : 0)}</b></div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button className={"btn primary"} disabled={!canComplete}
                        onClick={() => onComplete(method, method === "cash" ? amount : total)}>
                        Complete
                    </button>
                </div>
            </div>
        </div>
    );
}
