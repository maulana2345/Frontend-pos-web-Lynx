// import React from "react";
import { formatIDR } from "../utils/format";
import type { Product } from "../types";

export default function ProductCard({
    p,
    onAdd,
}: {
    p: Product;
    onAdd: (p: Product) => void;
}) {
    return (
        <div className="product">
            <div className="name">{p.name}</div>
            <div className="meta">
                {p.sku} · Stock {p.stock}
            </div>
            <div className="price">{formatIDR(p.price)}</div>
            <button
                className="btn"
                style={{ width: "100%", marginTop: 8 }}
                onClick={() => onAdd(p)}
            >
                Add
            </button>
        </div>
    );
}
