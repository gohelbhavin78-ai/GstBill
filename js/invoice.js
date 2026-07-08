/**
 * BG Invoice Pro - Transaction Operations Invoice Module Layer
 */

document.addEventListener('DOMContentLoaded', () => InvoiceModule.init());

const InvoiceModule = {
    init() {
        this.customerSelect = document.getElementById('invCustomer');
        this.dateInput = document.getElementById('invDate');
        this.numInput = document.getElementById('invNum');
        this.rowsContainer = document.getElementById('invoiceItemRows');

        if (this.customerSelect) {
            this.dateInput.value = new Date().toISOString().split('T')[0];
            this.generateInvoiceNumber();
            this.populateSelectors();
            this.addNewRow();
        }
    },

    generateInvoiceNumber() {
        const invoices = StorageEngine.get('invoices');
        this.numInput.value = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    },

    populateSelectors() {
        const customers = StorageEngine.get('customers');
        this.customerSelect.innerHTML = '<option value="">-- Choose Target Account Profile --</option>';
        customers.forEach(c => {
            this.customerSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        });
    },

    addNewRow() {
        const products = StorageEngine.get('products');
        const rowId = `row_${Date.now()}`;
        const tr = document.createElement('tr');
        tr.id = rowId;

        let options = '<option value="">-- Choose Product Asset --</option>';
        products.forEach(p => {
            options += `<option value="${p.id}">${p.name}</option>`;
        });

        tr.innerHTML = `
            <td><select class="form-select font-sm-custom" onchange="InvoiceModule.handleProductSelect('${rowId}', this.value)">${options}</select></td>
            <td><input type="number" class="form-control qty" value="1" min="1" oninput="InvoiceModule.recalculateInvoice()"></td>
            <td><input type="number" class="form-control rate" value="0" step="0.01" oninput="InvoiceModule.recalculateInvoice()"></td>
            <td><input type="number" class="form-control disc" value="0" min="0" max="100" oninput="InvoiceModule.recalculateInvoice()"></td>
            <td><select class="form-select gst" onchange="InvoiceModule.recalculateInvoice()"><option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18" selected>18%</option><option value="28">28%</option></select></td>
            <td class="text-end fw-bold pt-3 rowNet">₹0.00</td>
            <td class="text-center"><button class="btn btn-sm btn-link text-danger" onclick="document.getElementById('${rowId}').remove(); InvoiceModule.recalculateInvoice();"><i class="fa-solid fa-trash"></i></button></td>
        `;
        this.rowsContainer.appendChild(tr);
    },

    handleProductSelect(rowId, productId) {
        const product = StorageEngine.get('products').find(p => p.id === productId);
        if (!product) return;

        const row = document.getElementById(rowId);
        row.querySelector('.rate').value = product.price;
        row.querySelector('.gst').value = product.gst;
        this.recalculateInvoice();
    },

    recalculateInvoice() {
        const companySettings = StorageEngine.get('settings');
        const customerId = this.customerSelect.value;
        const customer = StorageEngine.get('customers').find(c => c.id === customerId);
        const customerState = customer ? customer.state : companySettings.state;

        let totalTaxable = 0, totalCgst = 0, totalSgst = 0, totalIgst = 0, overallGrandTotal = 0;
        const rows = this.rowsContainer.querySelectorAll('tr');

        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.qty').value) || 0;
            const rate = parseFloat(row.querySelector('.rate').value) || 0;
            const disc = parseFloat(row.querySelector('.disc').value) || 0;
            const gstPercent = parseFloat(row.querySelector('.gst').value) || 0;

            const rowMetrics = GstEngine.calculateRow(qty, rate, disc, gstPercent);
            row.querySelector('.rowNet').textContent = `₹${rowMetrics.grossTotal.toFixed(2)}`;

            totalTaxable += rowMetrics.taxable;
            const distributions = GstEngine.evaluateTaxDistribution(rowMetrics.taxable, gstPercent, companySettings.state, customerState);

            totalCgst += distributions.cgst;
            totalSgst += distributions.sgst;
            totalIgst += distributions.igst;
            overallGrandTotal += rowMetrics.grossTotal;
        });

        document.getElementById('lblTaxable').textContent = `₹${totalTaxable.toFixed(2)}`;
        document.getElementById('lblCgst').textContent = `₹${totalCgst.toFixed(2)}`;
        document.getElementById('lblSgst').textContent = `₹${totalSgst.toFixed(2)}`;
        document.getElementById('lblIgst').textContent = `₹${totalIgst.toFixed(2)}`;
        document.getElementById('lblGrandTotal').textContent = `₹${overallGrandTotal.toFixed(2)}`;
    },

    handleCustomerChange() {
        this.recalculateInvoice();
    },

    commitInvoice() {
        if (!this.customerSelect.value) return alert("Assign a target client account before issuing dispatch validations.");
        
        const invoices = StorageEngine.get('invoices');
        const invoiceData = {
            id: this.numInput.value,
            customerId: this.customerSelect.value,
            date: this.dateInput.value,
            total: document.getElementById('lblGrandTotal').textContent,
            status: "Awaiting"
        };
        
        invoices.push(invoiceData);
        StorageEngine.save('invoices', invoices);
        alert(`Document ${invoiceData.id} successfully locked into system ledger arrays.`);
        window.location.href = 'dashboard.html';
    }
};