import { useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES } from "../data/products";
import type { CartLine, Product } from "../types";
import { clampPct, formatIDR } from "../utils/format";
import ProductGrid from "../components/ProductGrid";
// import BarcodeInput from "../components/BarcodeInput";
import CartLineView from "../components/CartLine";
import CartTotals from "../components/CartTotals";
import PaymentDialog, { type PaymentMethod } from "../components/PaymentDialog";
import "../styles/theme.css";

export default function POSPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<typeof CATEGORIES[number]>("All");
    const [cart, setCart] = useState<CartLine[]>([]);
    const [globalDiscountPct, setGlobalDiscountPct] = useState<number>(0);
    const [taxPct, setTaxPct] = useState<number>(11);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentTotal, setPaymentTotal] = useState(0);

    const filteredProducts = useMemo(() => {
        const q = query.trim().toLowerCase();
        return PRODUCTS.filter(p => {
            const mq = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
            const mc = category === "All" || p.category === category;
            return mq && mc;
        });
    }, [query, category]);

    const subtotal = useMemo(() => cart.reduce((s, l) => s + l.price * l.qty * (1 - (l.discountPct ?? 0) / 100), 0), [cart]);

    const addToCart = (p: Product) => {
        setCart(prev => {
            const found = prev.find(l => l.id === p.id);
            if (found) return prev.map(l => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l));
            return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
        });
    };

    const changeQty = (id: string, delta: number) => {
        setCart(prev => prev.map(l => (l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l)).filter(l => l.qty > 0));
    };
    const removeLine = (id: string) => setCart(prev => prev.filter(l => l.id !== id));
    const setLineDiscount = (id: string, pct: number) => setCart(prev => prev.map(l => (l.id === id ? { ...l, discountPct: clampPct(pct) } : l)));

    const handleScanEnter = (value: string) => {
        const v = value.trim();
        if (!v) return;
        const p = PRODUCTS.find(x => x.barcode === v || x.sku.toLowerCase() == v.toLowerCase());
        if (p) addToCart(p);
    };

    const afterGlobal = subtotal * (1 - globalDiscountPct / 100);
    const tax = Math.round(afterGlobal * (taxPct / 100));
    const grandTotal = Math.max(0, Math.round(afterGlobal + tax));

    return (
        <div className="container">
            <div className="card">
                <div className="header">Browse Products</div>
                <div className="body">
                    <ProductGrid
                        products={filteredProducts}
                        query={query}
                        category={category}
                        onQuery={setQuery}
                        onCategory={setCategory}
                        onAdd={addToCart}
                    />
                </div>
            </div>

            <div className="card">
                <div className="header">Current Cart</div>
                <div className="body">
                    <div className="row" style={{ marginBottom: 12 }}>
                        <input
                            className="input"
                            placeholder="Scan / input barcode atau SKU lalu Enter"
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                const v = (e.target as HTMLInputElement).value.trim();
                                if (!v) return;
                                handleScanEnter(v);
                                (e.target as HTMLInputElement).value = "";
                            }}
                        />
                    </div>

                    {cart.length === 0 ? (
                        <div className="empty">Cart is empty. Add product atau scan.</div>
                    ) : (
                        <div className="cartlist">
                            {cart.map((l) => (
                                <CartLineView
                                    key={l.id}
                                    line={l}
                                    onQty={(d) => changeQty(l.id, d)}
                                    onDiscount={(pct) => setLineDiscount(l.id, pct)}
                                    onRemove={() => removeLine(l.id)}
                                />
                            ))}
                        </div>
                    )}

                    <CartTotals
                        subtotal={subtotal}
                        globalDiscountPct={globalDiscountPct}
                        taxPct={taxPct}
                        onGlobalDiscount={setGlobalDiscountPct}
                        onTax={setTaxPct}
                        onPay={() => { setPaymentTotal(grandTotal); setShowPayment(true); }}
                    />

                    <PaymentDialog
                        open={showPayment}
                        total={paymentTotal}
                        onClose={() => setShowPayment(false)}
                        onComplete={(method: PaymentMethod, paidAmount: number) => {
                            // TODO: call API create-sale di sini
                            alert(`Payment success via ${method}. Change: ${formatIDR(
                                method === "cash" ? paidAmount - paymentTotal : 0
                            )}`);
                            // reset cart
                            setCart([]);
                            setShowPayment(false);
                        }}
                    />

                </div>
            </div>
        </div>
    );
}
