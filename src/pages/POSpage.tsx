import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES } from "../data/products";
import type { CartLine, Product } from "../types";
import { clampPct, formatIDR } from "../utils/format";
import ProductGrid from "../components/ProductGrid";
import BarcodeInput from "../components/BarcodeInput";
import CartLineView from "../components/CartLine";
import CartTotals from "../components/CartTotals";
import PaymentDialog, { type PaymentMethod } from "../components/PaymentDialog";
import ShortcutsDialog from "../components/ShortcutsDialog";
import CustomerDialog from "../components/CustomerDialog";
import HoldDialog, { saveHold } from "../components/HoldDialog";
// import { CUSTOMERS, type Customer } from "../data/customers";
import type { Customer } from "../data/customerStore";
import { loadCustomers } from "../data/customerStore";
import "../styles/theme.css";

export default function POSPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
    const [cart, setCart] = useState<CartLine[]>([]);
    const [globalDiscountPct, setGlobalDiscountPct] = useState<number>(0);
    const [taxPct, setTaxPct] = useState<number>(11);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentTotal, setPaymentTotal] = useState(0);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showCustomer, setShowCustomer] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [showHold, setShowHold] = useState(false);

    // Hotkeys: Ctrl+F, Ctrl+B, Ctrl+P, Delete
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const key = `${e.ctrlKey ? "Ctrl+" : ""}${e.key.toUpperCase()}`;
            if (key === "CTRL+P") {
                e.preventDefault();
                if (cart.length) setShowPayment(true);
            }
            if (e.key === "Delete") {
                if (cart.length) setCart([]);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [cart.length]);

    const filteredProducts = useMemo(() => {
        const q = query.trim().toLowerCase();
        return PRODUCTS.filter((p) => {
            const mq =
                !q ||
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q);
            const mc = category === "All" || p.category === category;
            return mq && mc;
        });
    }, [query, category]);

    const subtotal = useMemo(
        () =>
            cart.reduce(
                (s, l) => s + l.price * l.qty * (1 - (l.discountPct ?? 0) / 100),
                0
            ),
        [cart]
    );

    const addToCart = (p: Product) => {
        setCart((prev) => {
            const found = prev.find((l) => l.id === p.id);
            if (found)
                return prev.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l));
            return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
        });
    };

    const changeQty = (id: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((l) =>
                    l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l
                )
                .filter((l) => l.qty > 0)
        );
    };
    const removeLine = (id: string) =>
        setCart((prev) => prev.filter((l) => l.id !== id));
    const setLineDiscount = (id: string, pct: number) =>
        setCart((prev) =>
            prev.map((l) => (l.id === id ? { ...l, discountPct: clampPct(pct) } : l))
        );

    const handleScanEnter = (value: string) => {
        const v = value.trim();
        if (!v) return;
        const p = PRODUCTS.find(
            (x) => x.barcode === v || x.sku.toLowerCase() == v.toLowerCase()
        );
        if (p) addToCart(p);
    };

    const afterGlobal = subtotal * (1 - globalDiscountPct / 100);
    const tax = Math.round(afterGlobal * (taxPct / 100));
    const grandTotal = Math.max(0, Math.round(afterGlobal + tax));

    // Hold current order to localStorage
    const doHold = () => {
        if (!cart.length) return alert("Keranjang kosong");
        const h = saveHold({
            cart,
            globalDiscountPct,
            taxPct,
            customerName: customer?.name ?? null,
        });
        alert(`Order di-hold: #${h.id.slice(-6).toUpperCase()}`);
        setCart([]);
    };

    // Restore from hold dialog
    const onRestoreHold = (h: any) => {
        setCart(h.cart);
        const list = loadCustomers();
        setCustomer(
            h.customerName
                ? list.find((c) => c.name === h.customerName) ?? null
                : null
        );
        setGlobalDiscountPct(h.globalDiscountPct);
        setTaxPct(h.taxPct);
        setShowHold(false);
    };

    // Print: very simple receipt
    const printReceipt = (
        saleId: string,
        method: PaymentMethod,
        paid: number,
        change: number
    ) => {
        const w = window.open("", "PRINT", "height=650,width=380");
        if (!w) return;
        const lines = cart
            .map(
                (l) =>
                    `<tr><td>${l.name} x${l.qty
                    }</td><td style="text-align:right">${formatIDR(
                        l.price * l.qty * (1 - (l.discountPct ?? 0) / 100)
                    )}</td></tr>`
            )
            .join("");
        w.document.write(
            `<!doctype html><html><head><title>Receipt</title><style>body{font:12px monospace;padding:8px} table{width:100%}</style></head><body>`
        );
        w.document.write(
            `<h3>LYNX POS</h3><div>ID: ${saleId}</div><hr/><table>${lines}</table><hr/>`
        );
        w.document.write(`<div>Subtotal: <b>${formatIDR(subtotal)}</b></div>`);
        w.document.write(
            `<div>Disc Global ${globalDiscountPct}%: <b>-${formatIDR(
                Math.round(subtotal - afterGlobal)
            )}</b></div>`
        );
        w.document.write(`<div>PPN ${taxPct}%: <b>${formatIDR(tax)}</b></div>`);
        w.document.write(`<div>Grand Total: <b>${formatIDR(grandTotal)}</b></div>`);
        w.document.write(`<div>Payment: ${method.toUpperCase()}</div>`);
        w.document.write(
            `<div>Paid: ${formatIDR(paid)} | Change: ${formatIDR(change)}</div>`
        );
        w.document.write(
            `<hr/><div>Terima kasih${customer ? ", " + customer.name : ""}!</div>`
        );
        w.document.write(`</body></html>`);
        w.document.close();
        w.focus();
        w.print();
        w.close();
    };

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
                        <BarcodeInput onEnter={handleScanEnter} />
                    </div>

                    <div
                        className="row"
                        style={{ justifyContent: "space-between", marginBottom: 8 }}
                    >
                        <div className="row" style={{ gap: 8 }}>
                            <button className="btn" onClick={() => setShowCustomer(true)}>
                                {customer ? `Customer: ${customer.name}` : "Pilih Customer"}
                            </button>
                            <button className="btn" onClick={() => setShowShortcuts(true)}>
                                Shortcuts
                            </button>
                        </div>
                        <div className="row" style={{ gap: 8 }}>
                            <button className="btn" onClick={() => setShowHold(true)}>
                                Recall
                            </button>
                            <button className="btn ghost" onClick={doHold}>
                                Hold
                            </button>
                        </div>
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
                        onPay={() => {
                            setPaymentTotal(grandTotal);
                            setShowPayment(true);
                        }}
                    />

                    {/* Dialogs */}
                    <PaymentDialog
                        open={showPayment}
                        total={paymentTotal}
                        onClose={() => setShowPayment(false)}
                        onComplete={(method: PaymentMethod, paidAmount: number) => {
                            const change = method === "cash" ? paidAmount - paymentTotal : 0;
                            const saleId = crypto.randomUUID(); // TODO: ganti dari API response
                            printReceipt(saleId, method, paidAmount, change);
                            setCart([]);
                            setShowPayment(false);
                        }}
                    />

                    <ShortcutsDialog
                        open={showShortcuts}
                        onClose={() => setShowShortcuts(false)}
                    />

                    <CustomerDialog
                        open={showCustomer}
                        onClose={() => setShowCustomer(false)}
                        value={customer}
                        onSelect={setCustomer}
                    />

                    <HoldDialog
                        open={showHold}
                        onClose={() => setShowHold(false)}
                        onRestore={onRestoreHold}
                    />
                </div>
            </div>
        </div>
    );
}
