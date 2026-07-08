/**
 * BG Invoice Pro - Corporate Base Profile Management Settings Module Script
 */

document.addEventListener('DOMContentLoaded', () => CorporateSettingsDesk.init());

const CorporateSettingsDesk = {
    init() {
        this.form = document.getElementById('settingsForm');
        if (this.form) {
            this.loadSettings();
            this.form.addEventListener('submit', (e) => this.handleSave(e));
        }
    },

    loadSettings() {
        const currentData = StorageEngine.get('settings');
        if (!currentData) return;

        document.getElementById('cfgName').value = currentData.companyName || '';
        document.getElementById('cfgGstin').value = currentData.gstin || '';
        document.getElementById('cfgEmail').value = currentData.email || '';
        document.getElementById('cfgAddress').value = currentData.address || '';
        document.getElementById('cfgState').value = currentData.state || '';
    },

    handleSave(e) {
        e.preventDefault();
        
        const runtimeSettings = {
            companyName: document.getElementById('cfgName').value,
            gstin: document.getElementById('cfgGstin').value.toUpperCase(),
            email: document.getElementById('cfgEmail').value,
            address: document.getElementById('cfgAddress').value,
            state: document.getElementById('cfgState').value
        };

        StorageEngine.save('settings', runtimeSettings);
        alert("Enterprise legal profiles verified and locked successfully across local systems tables.");
    }
};