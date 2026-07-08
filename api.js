/**
 * BG Invoice Pro - API Synchronization Engine Core
 * Intercepts CRUD requests and hooks them directly to Google Sheets Web App
 */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZiMGvf7nhujcXUz2Y8RKRKPRa-cuCUfTabNWpIEfKi8JyNkmGMOVXOkSeFF7NXaD2/exec";

const StorageEngine = {
    // Mapping model keys to respective Google Sheet collection structures
    keys: {
        customers: 'customers',
        products: 'products',
        invoices: 'invoices',
        settings: 'settings'
    },

    /**
     * Initializes data from the Cloud Database into your app session on load
     */
    async initDatabase() {
        console.log("Syncing Local Engine with Google Sheets...");
        for (const key of Object.values(this.keys)) {
            try {
                const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=${key}`);
                const result = await response.json();
                
                if (result.status === "success" && result.data) {
                    // Update the local browser cache layout for fluid UI render speeds
                    localStorage.setItem(`bg_${key}`, JSON.stringify(result.data));
                }
            } catch (error) {
                console.warn(`Fallback active for collection [${key}]: using cache.`, error);
            }
        }
    },

    /**
     * Pulls data collections down to the calling page UI
     */
    get(collectionKey) {
        const localData = localStorage.getItem(`bg_${collectionKey}`);
        return localData ? JSON.parse(localData) : [];
    },

    /**
     * Stores updated collections locally and fires a network transmission to sync with Google Sheets
     */
    async save(collectionKey, dataArray) {
        // Step A: Keep UI instantly updated by saving locally
        localStorage.setItem(`bg_${collectionKey}`, JSON.stringify(dataArray));

        // Step B: Push collection changes directly up to the Cloud Spreadsheet sheet row matrix
        try {
            const syncPayload = {
                action: collectionKey,
                payload: dataArray
            };

            // Use 'no-cors' mode safely if browser validation policies interfere
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(syncPayload)
            });
            
            console.log(`Cloud Collection Sync complete: [${collectionKey}]`);
            return true;
        } catch (error) {
            console.error(`Cloud Sync Failed for [${collectionKey}]. Data remains cached locally.`, error);
            return false;
        }
    }
};

// Hook initialization directly into page boot-up sequence asynchronously
document.addEventListener("DOMContentLoaded", () => {
    StorageEngine.initDatabase();
});
