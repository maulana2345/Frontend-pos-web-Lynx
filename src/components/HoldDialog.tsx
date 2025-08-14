import { useEffect, useState } from "react";
import type { CartLine } from "../types";

type HoldOrder = {
    id: string;
    at: string; // ISO time
    customerName?: string | null;
    cart: CartLine[];
    globalDiscountPct: number;
    taxPct: number;
};

const LS_KEY = "LYNX_POS_HOLDS";

function loadHolds(): HoldOrder[] {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveHolds(v: HoldOrder[]) { localStorage.setItem(LS_KEY, JSON.stringify(v)); }

export default function HoldDialog({ open, onClose, onRestore }: {
    open: boolean;
    onClose: () => void;
    onRestore: (h: HoldOrder) => void;
}) {
    const [list, setList] = useState<HoldOrder[]>([]);
    useEffect(() => { if (open) setList(loadHolds()); }, [open]);
    if (!open) return null;

    const remove = (id: string) => {
        const next = list.filter(x => x.id !== id);
        setList(next); saveHolds(next);
    };

    const clearAll = () => { setList([]); saveHolds([]); };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">Hold / Recall Orders</div>
                <div className="modal-body">
                    {list.length === 0 ? (
                        <div className="info">Belum ada hold order.</div>
                    ) : (
                        <div style={{ display: 'grid', gap: 8 }}>
                            {list.map(h => (
                                <div key={h.id} className="card" style={{ padding: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>#{h.id.slice(-6).toUpperCase()}</div>
                                            <div className="info">{new Date(h.at).toLocaleString()}</div>
                                        </div>
                                        <div className="info">{h.customerName || 'Walk-in'}</div>
                                    </div>
                                    <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
                                        <button className="btn" onClick={() => onRestore(h)}>Recall</button>
                                        <button className="btn danger" onClick={() => remove(h.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-actions">
                    <button className="btn" onClick={clearAll} disabled={!list.length}>Clear All</button>
                    <button className="btn primary" onClick={onClose}>Tutup</button>
                </div>
            </div>
        </div>
    );
}

export function saveHold(payload: Omit<HoldOrder, 'id' | 'at'>) {
    const h: HoldOrder = { id: crypto.randomUUID(), at: new Date().toISOString(), ...payload };
    const list = loadHolds(); list.unshift(h); saveHolds(list);
    return h;
}