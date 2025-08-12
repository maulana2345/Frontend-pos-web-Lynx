// import React from "react";

export default function BarcodeInput({ onEnter }: { onEnter: (value: string) => void }) {
    return (
        <input
            className="input"
            placeholder="Scan / input barcode atau SKU lalu Enter"
            onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                const v = (e.target as HTMLInputElement).value.trim();
                if (!v) return;
                onEnter(v);
                (e.target as HTMLInputElement).value = "";
            }}
        />
    );
}
