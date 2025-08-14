// Simple local store for customers (localStorage)
export type Customer = { id: string; name: string | null };

const LS_KEY = "LYNX_POS_CUSTOMERS";

const DEFAULTS: Customer[] = [
    { id: "c1", name: "Naufal" },
    { id: "c2", name: "Budi" },
    { id: "c3", name: "Bintang" },
    { id: "c4", name: "Bayhaqi" },
];

export function loadCustomers(): Customer[] {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) {
            // seed defaults first time
            localStorage.setItem(LS_KEY, JSON.stringify(DEFAULTS));
            return [...DEFAULTS];
        }
        const list = JSON.parse(raw) as Customer[];
        return Array.isArray(list) ? list : [...DEFAULTS];
    } catch {
        return [...DEFAULTS];
    }
}

export function saveCustomers(list: Customer[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function upsertCustomer(payload: Omit<Customer, "id"> & { id?: string }) {
    const list = loadCustomers();
    if (payload.id) {
        const idx = list.findIndex((c) => c.id === payload.id);
        if (idx >= 0) {
            list[idx] = { id: payload.id, name: payload.name ?? null };
            saveCustomers(list);
            return list[idx];
        }
    }
    const c: Customer = { id: crypto.randomUUID(), name: payload.name ?? null };
    list.unshift(c);
    saveCustomers(list);
    return c;
}

export function deleteCustomer(id: string) {
    const list = loadCustomers().filter((c) => c.id !== id);
    saveCustomers(list);
}
