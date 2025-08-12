// import React from "react";
import type { Product } from "../types";
import ProductCard from "./ProductCard";
import { CATEGORIES } from "../data/products";

export default function ProductGrid({ products, query, category, onQuery, onCategory, onAdd }: {
    products: Product[];
    query: string;
    category: typeof CATEGORIES[number];
    onQuery: (v: string) => void;
    onCategory: (c: typeof CATEGORIES[number]) => void;
    onAdd: (p: Product) => void;
}) {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(p => {
        const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
        const matchC = category === "All" || p.category === category;
        return matchQ && matchC;
    });

    return (
        <div>
            <div className="row" style={{ marginBottom: 12 }}>
                <input placeholder="Search name / SKU" className="input" value={query} onChange={(e) => onQuery(e.target.value)} />
                {CATEGORIES.map((c) => (
                    <button key={c} className={"btn " + (c === category ? "primary" : "")} onClick={() => onCategory(c)}>{c}</button>
                ))}
            </div>
            <div className="grid">
                {filtered.map((p) => (<ProductCard key={p.id} p={p} onAdd={onAdd} />))}
            </div>
        </div>
    );
}
