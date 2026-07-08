/**
 * BG Invoice Pro - Centralized Data & Storage Engine
 * Uses localStorage for local mock-up. Interchangable with Google Apps Script API calls.
 */

const StorageEngine = {
    // Initial Seed Data for testing when storage is blank
    defaults: {
        customers: [
            { id: "CUST-001", name: "Acme Corporates", gstin: "27AAAAA0000A1Z5", mobile: "9876543210", email: "billing@acme.com", address: "101, Business Zone, BKC", state: "Maharashtra" },
            { id: "CUST-002", name: "Rajesh Enterprises", gstin: "24BBBBB1111B2Z2", mobile: "9123456789", email: "rajesh@enterprises.in", address: "54, Commercial Plaza", state: "Gujarat" }
        ],
        products: [
            { id: "PROD-001", name: "Enterprise ERP Software Development", hsn: "997331", unit: "SAC", gst: "18", price: "75000" },
            { id: "PROD-002", name: "Cloud Server Compute Resource Core", hsn: "84713010", unit: "NOS", gst: "18", price: "4500" }
        ],
        invoices: [
            { id: "INV-2026-001", customerId: "CUST-001", date: "2026-07-01", items: [{ productId: "PROD-001", qty: 1, rate: 75000, gst: 18 }], taxable: 75000, cgst: 6750, sgst: 6750, igst: 0, total: 88500, status: "Settled" }
        ],
        settings: {
            companyName: "BG Business Solutions Ltd",
            gstin: "27COMPANY1234A1Z0",
            email: "finance@bgbusiness.com",
            address: "Tech Hub Tower, Floor 4, Mumbai",
            state: "Maharashtra"
        }
    },

    init() {
        ['customers', 'products', 'invoices', 'settings'].forEach(key => {
            if (!localStorage.getItem(`bg_${key}`)) {
                localStorage.setItem(`bg_${key}`, JSON.stringify(this.defaults[key]));
            }
        });
    },

    get(collection) {
        return JSON.parse(localStorage.getItem(`bg_${collection}`)) || [];
    },

    save(collection, data) {
        localStorage.setItem(`bg_${collection}`, JSON.stringify(data));
    }
};

StorageEngine.init();