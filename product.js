/**
 * BG Invoice Pro - Asset Product Master Data Logic Layer
 */

document.addEventListener('DOMContentLoaded', () => ProductModule.init());

const ProductModule = {
    init() {
        this.form = document.getElementById('productForm');
        this.tableBody = document.getElementById('productTableBody');
        this.searchInput = document.getElementById('searchProduct');
        this.modal = new bootstrap.Modal(document.getElementById('productModal'));

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.searchInput.addEventListener('input', () => this.render());
            this.render();
        }
    },

    render() {
        const products = StorageEngine.get('products');
        const search = this.searchInput.value.toLowerCase();
        this.tableBody.innerHTML = '';

        products.filter(p => p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search))
        .forEach(p => {
            this.tableBody.innerHTML += `
                <tr>
                    <td class="fw-bold">${p.id}</td>
                    <td>${p.name}</td>
                    <td><span class="badge bg-light text-dark border">${p.hsn}</span></td>
                    <td><small class="fw-semibold text-muted">${p.unit}</small></td>
                    <td>${p.gst}%</td>
                    <td class="fw-semibold">₹${parseFloat(p.price).toFixed(2)}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-light border me-1" onclick="ProductModule.edit('${p.id}')"><i class="fa-solid fa-pencil text-secondary"></i></button>
                        <button class="btn btn-sm btn-light border" onclick="ProductModule.delete('${p.id}')"><i class="fa-solid fa-trash text-danger"></i></button>
                    </td>
                </tr>`;
        });
    },

    resetForm() {
        this.form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('prodModalTitle').textContent = "Add Product Asset";
    },

    handleSubmit(e) {
        e.preventDefault();
        if (!this.form.checkValidity()) return this.form.classList.add('was-validated');

        const products = StorageEngine.get('products');
        const id = document.getElementById('productId').value;

        const data = {
            id: id || `PROD-${String(products.length + 1).padStart(3, '0')}`,
            name: document.getElementById('prodName').value,
            hsn: document.getElementById('prodHsn').value,
            unit: document.getElementById('prodUnit').value,
            gst: document.getElementById('prodGst').value,
            price: document.getElementById('prodPrice').value
        };

        if (id) {
            const index = products.findIndex(p => p.id === id);
            products[index] = data;
        } else {
            products.push(data);
        }

        StorageEngine.save('products', products);
        this.modal.hide();
        this.render();
    },

    edit(id) {
        const item = StorageEngine.get('products').find(p => p.id === id);
        if (!item) return;

        document.getElementById('productId').value = item.id;
        document.getElementById('prodName').value = item.name;
        document.getElementById('prodHsn').value = item.hsn;
        document.getElementById('prodUnit').value = item.unit;
        document.getElementById('prodGst').value = item.gst;
        document.getElementById('prodPrice').value = item.price;

        document.getElementById('prodModalTitle').textContent = "Modify Asset Specifications";
        this.modal.show();
    },

    delete(id) {
        if (!confirm("Confirm structural purge of selected hardware inventory line ledger entry?")) return;
        const filtered = StorageEngine.get('products').filter(p => p.id !== id);
        StorageEngine.save('products', filtered);
        this.render();
    }
};