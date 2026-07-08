/**
 * BG Invoice Pro - Customer Registry Management Module logic layer
 */

document.addEventListener('DOMContentLoaded', () => CustomerModule.init());

const CustomerModule = {
    init() {
        this.form = document.getElementById('customerForm');
        this.tableBody = document.getElementById('customerTableBody');
        this.searchInput = document.getElementById('searchCustomer');
        this.modal = new bootstrap.Modal(document.getElementById('customerModal'));

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.searchInput.addEventListener('input', () => this.render());
            this.render();
        }
    },

    render() {
        const customers = StorageEngine.get('customers');
        const search = this.searchInput.value.toLowerCase();
        this.tableBody.innerHTML = '';

        customers.filter(c => c.name.toLowerCase().includes(search) || c.id.toLowerCase().includes(search))
        .forEach(c => {
            this.tableBody.innerHTML += `
                <tr>
                    <td class="fw-bold">${c.id}</td>
                    <td>${c.name}</td>
                    <td><code class="text-dark">${c.gstin || 'N/A'}</code></td>
                    <td>${c.mobile}</td>
                    <td>${c.email}</td>
                    <td>${c.state}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-light border me-1" onclick="CustomerModule.edit('${c.id}')"><i class="fa-solid fa-pencil text-secondary"></i></button>
                        <button class="btn btn-sm btn-light border" onclick="CustomerModule.delete('${c.id}')"><i class="fa-solid fa-trash text-danger"></i></button>
                    </td>
                </tr>`;
        });
    },

    resetForm() {
        this.form.reset();
        document.getElementById('customerId').value = '';
        document.getElementById('modalTitle').textContent = "Register Customer";
    },

    handleSubmit(e) {
        e.preventDefault();
        if (!this.form.checkValidity()) return this.form.classList.add('was-validated');

        const customers = StorageEngine.get('customers');
        const id = document.getElementById('customerId').value;
        
        const data = {
            id: id || `CUST-${String(customers.length + 1).padStart(3, '0')}`,
            name: document.getElementById('custName').value,
            gstin: document.getElementById('custGstin').value.toUpperCase(),
            mobile: document.getElementById('custMobile').value,
            email: document.getElementById('custEmail').value,
            address: document.getElementById('custAddress').value,
            state: document.getElementById('custState').value
        };

        if (id) {
            const index = customers.findIndex(c => c.id === id);
            customers[index] = data;
        } else {
            customers.push(data);
        }

        StorageEngine.save('customers', customers);
        this.modal.hide();
        this.render();
    },

    edit(id) {
        const client = StorageEngine.get('customers').find(c => c.id === id);
        if (!client) return;

        document.getElementById('customerId').value = client.id;
        document.getElementById('custName').value = client.name;
        document.getElementById('custGstin').value = client.gstin;
        document.getElementById('custMobile').value = client.mobile;
        document.getElementById('custEmail').value = client.email;
        document.getElementById('custAddress').value = client.address;
        document.getElementById('custState').value = client.state;

        document.getElementById('modalTitle').textContent = "Update Profile Data Entry";
        this.modal.show();
    },

    delete(id) {
        if (!confirm("Confirm complete eradication of target client account historical matrix profiles?")) return;
        const filtered = StorageEngine.get('customers').filter(c => c.id !== id);
        StorageEngine.save('customers', filtered);
        this.render();
    }
};