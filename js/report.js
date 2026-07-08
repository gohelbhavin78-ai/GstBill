/**
 * BG Invoice Pro - Dynamic Graphical Reporting Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', () => AnalyticalReportingEngine.init());

const AnalyticalReportingEngine = {
    init() {
        this.renderCharts();
    },

    renderCharts() {
        const revCtx = document.getElementById('revenueAnalyticsChart');
        const gstCtx = document.getElementById('gstDistributionChart');

        if (revCtx) {
            new Chart(revCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Gross Combined Invoiced Yield (₹)',
                        data: [450000, 710000, 520000, 890000, 630000, 1150000, 1284350],
                        borderColor: '#0F4C81',
                        backgroundColor: 'rgba(15, 76, 129, 0.05)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }

        if (gstCtx) {
            new Chart(gstCtx, {
                type: 'doughnut',
                data: {
                    labels: ['CGST Accruals', 'SGST Accruals', 'IGST Collections'],
                    datasets: [{
                        data: [42500, 42500, 89000],
                        backgroundColor: ['#2563EB', '#16A34A', '#F59E0B']
                    }]
                },
                options: { responsive: true }
            });
        }
    }
};