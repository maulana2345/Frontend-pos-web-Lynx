// src/data/products.ts
import type { Product } from "../types";

export const PRODUCTS: Product[] = [
    { id: "p1", sku: "SKU-001", barcode: "8998880001", name: "Mineral Water 600ml", price: 5000, stock: 120, category: "Drinks" },
    { id: "p2", sku: "SKU-002", barcode: "8998880002", name: "Mineral Water 1.5L", price: 9000, stock: 88, category: "Drinks" },
    { id: "p3", sku: "SKU-003", barcode: "8998880003", name: "Lemon Water 300mL", price: 7500, stock: 54, category: "Drinks" },
    { id: "p4", sku: "SKU-004", barcode: "8997770003", name: "Cup Noodles Chicken", price: 8500, stock: 62, category: "Food" },
    { id: "p5", sku: "SKU-005", barcode: "8997770004", name: "Chocolate Wafer", price: 6000, stock: 33, category: "Snacks" },
    { id: "p6", sku: "SKU-006", barcode: "8997770005", name: "Cheese Wafer", price: 6000, stock: 14, category: "Snacks" },
    { id: "p7", sku: "SKU-007", barcode: "8996660006", name: "Fresh Milk 250ml", price: 11000, stock: 41, category: "Dairy" },
    { id: "p8", sku: "SKU-008", barcode: "8996660007", name: "Fresh Milk 500ml", price: 20000, stock: 21, category: "Dairy" },
    { id: "p9", sku: "SKU-009", barcode: "8996660008", name: "Matcha Milk 250ml", price: 15000, stock: 10, category: "Dairy" },
    // { id: "p10", sku: "SKU-010", barcode: "8996660009", name: "Matcha Milk 500ml", price: 29000, stock: 11, category: "Dairy" },
];

export const CATEGORIES = ["All", "Drinks", "Food", "Snacks", "Dairy"] as const;
