// src/data/customerStore.ts
export type Customer = { id: string; name: string };

const LS_KEY = "LYNX_POS_CUSTOMERS";
const DEFAULTS: Customer[] = [
    { id: "c1", name: "Andi" },
    { id: "c2", name: "Budi" },
    { id: "c3", name: "Citra" },
    { id: "c4", name: "Dewi" },
];

export function loadCustomers(): Customer[] {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) {
            localStorage.setItem(LS_KEY, JSON.stringify(DEFAULTS));
            return [...DEFAULTS];
        }
        const list = JSON.parse(raw);
        return Array.isArray(list) ? (list as Customer[]) : [...DEFAULTS];
    } catch {
        return [...DEFAULTS];
    }
}

export function saveCustomers(list: Customer[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function upsertCustomer(payload: { id?: string; name: string }) {
    const list = loadCustomers();
    if (payload.id) {
        const i = list.findIndex((c) => c.id === payload.id);
        if (i >= 0) {
            list[i] = { id: payload.id, name: payload.name };
            saveCustomers(list);
            return list[i];
        }
    }
    const c: Customer = { id: crypto.randomUUID(), name: payload.name };
    list.unshift(c);
    saveCustomers(list);
    return c;
}

export function deleteCustomer(id: string) {
    saveCustomers(loadCustomers().filter((c) => c.id !== id));
}
