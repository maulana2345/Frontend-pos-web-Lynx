export type Product = {
    id: string;
    sku: string;
    barcode?: string;
    name: string;
    price: number;
    stock: number;
    category?: string;
};

export type CartLine = {
    id: string;
    name: string;
    price: number;
    qty: number;
    discountPct?: number;
};
