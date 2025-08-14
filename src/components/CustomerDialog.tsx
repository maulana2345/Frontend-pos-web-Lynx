import  { useEffect, useMemo, useState } from "react";
import {
    loadCustomers,
    saveCustomers,
    upsertCustomer,
    deleteCustomer,
    type Customer,
} from "../data/customerStore";

type Tab = "select" | "manage";

export default function CustomerDialog({
    open,
    onClose,
    value,
    onSelect,
}: {
    open: boolean;
    onClose: () => void;
    value: Customer | null;
    onSelect: (c: Customer | null) => void;
}) {
    const [tab, setTab] = useState<Tab>("select");
    const [q, setQ] = useState("");
    const [list, setList] = useState<Customer[]>([]);
    const [editing, setEditing] = useState<Customer | null>(null);
    const [form, setForm] = useState<{ name: string }>({ name: ""});

    useEffect(() => {
        if (!open) return;
        const l = loadCustomers();
        setList(l);
        setTab("select");
        setEditing(null);
        setForm({ name: "" });
        setQ("");
    }, [open]);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return list.filter(
            (c) =>
            {
                const nama = (c?.name ?? "").toLowerCase();
                return !qq || nama.includes(qq);
            }
        );
    }, [q, list]);

    if (!open) return null;

    const startEdit = (c?: Customer) => {
        if (c) {
            setEditing(c);
            setForm({ name: c?.name ?? ""});
        } else {
            setEditing(null);   
            setForm({ name: "" });
        }
        setTab("manage");
    };

    const saveForm = () => {
        if (!form.name.trim()) {
            alert("Nama wajib diisi");
            return;
        }
        const saved = upsertCustomer({ id: editing?.id, name: form.name.trim()});
        const l = loadCustomers();
        setList(l);
        setEditing(saved);
        setTab("select");
    };

    const remove = (id: string) => {
        if (!confirm("Hapus customer ini?")) return;
        deleteCustomer(id);
        setList(loadCustomers());
        if (value?.id === id) onSelect(null);
    };

    const clearAll = () => {
        if (!confirm("Hapus semua customer?")) return;
        saveCustomers([]);
        setList([]);
        onSelect(null);
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">Customer</div>

                <div className="modal-body" style={{ gap: 10 }}>
                    {/* Tabs */}
                    <div className="row" style={{ gap: 8 }}>
                        <button className={"btn " + (tab === "select" ? "primary" : "")} onClick={() => setTab("select")}>
                            Pilih
                        </button>
                        <button className={"btn " + (tab === "manage" ? "primary" : "")} onClick={() => startEdit()}>
                            Kelola
                        </button>
                        <div style={{ marginLeft: "auto" }} />
                        {tab === "select" && (
                            <button className="btn" onClick={() => startEdit()}>
                                + Tambah
                            </button>
                        )}
                    </div>

                    {tab === "select" ? (
                        <>
                            <input
                                className="input"
                                placeholder="Cari nama / telp"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                            {filtered.length === 0 ? (
                                <div className="info">Belum ada customer. Klik “+ Tambah”.</div>
                            ) : (
                                <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'grid', gap: 8 }}>
                                    {filtered.map((c) => (
                                        <div key={c.id} className="card" style={{ padding: 10 }}>
                                            <div className="row" style={{ justifyContent: "space-between" }}>
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>{c?.name ?? "(tanpa nama)"}</div>
                                                </div>
                                                <div className="row" style={{ gap: 8 }}>
                                                    <button className="btn" onClick={() => onSelect(c)}>
                                                        Pilih
                                                    </button>
                                                    <button className="btn" onClick={() => startEdit(c)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn danger" onClick={() => remove(c.id)}>
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="info">Atau pilih <b>Walk-in</b> untuk tanpa identitas.</div>
                        </>
                    ) : (
                        <>
                            <div className="row" style={{ gap: 8 }}>
                                <input
                                    className="input"
                                    placeholder="Nama *"
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                />
                            </div>
                            <div className="row" style={{ gap: 8 }}>
                                <button className="btn primary" onClick={saveForm}>
                                    {editing ? "Simpan Perubahan" : "Tambah Customer"}
                                </button>
                                <button className="btn" onClick={() => setTab("select")}>
                                    Batal
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-actions">
                    <button className="btn" onClick={() => onSelect(null)}>Walk-in</button>
                    {tab === "select" ? (
                        <button className="btn primary" onClick={onClose}>Selesai</button>
                    ) : (
                        <button className="btn" onClick={clearAll} disabled={!list.length}>
                            Hapus Semua
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
