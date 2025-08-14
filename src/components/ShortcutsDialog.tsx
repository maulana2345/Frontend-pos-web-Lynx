// import React from "react";
export default function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;
    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">Keyboard Shortcuts</div>
                <div className="modal-body">
                    <ul style={{ lineHeight: 1.8 }}>
                        <li><b>Ctrl + F</b> – Fokus ke Search Produk</li>
                        <li><b>Ctrl + B</b> – Fokus ke Input Barcode/SKU</li>
                        <li><b>Ctrl + P</b> – Buka Pembayaran</li>
                        <li><b>Delete</b> – Kosongkan Keranjang</li>
                    </ul>
                    <div className="info">Tip: scanner barcode fisik biasanya kirim “Enter” setelah kode → langsung masuk ke keranjang.</div>
                </div>
                <div className="modal-actions">
                    <button className="btn" onClick={onClose}>Tutup</button>
                    <button className="btn primary" onClick={onClose}>OK</button>
                </div>
            </div>
        </div>
    );
}