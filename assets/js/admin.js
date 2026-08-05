// Admin Dashboard JS

document.addEventListener('DOMContentLoaded', function() {
    
    // Shared Tooltip Options
    const tooltipOptions = {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2B5E33',
        bodyColor: '#333333',
        borderColor: 'rgba(43, 94, 51, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: { family: "'Poppins', sans-serif", size: 13, weight: 'bold' },
        bodyFont: { family: "'Poppins', sans-serif", size: 12 }
    };

    // 1. Sales Overview Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx && window.salesData) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: window.salesData.labels,
                datasets: [{
                    label: 'Revenue',
                    data: window.salesData.data,
                    borderColor: '#2B5E33',
                    backgroundColor: 'rgba(43, 94, 51, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#2B5E33',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        ...tooltipOptions,
                        callbacks: {
                            label: function(context) { return '₹' + context.parsed.y.toLocaleString('en-IN'); }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#7A8B7A', font: {family: "'Poppins', sans-serif"} } },
                    y: {
                        border: { display: false },
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        ticks: { 
                            color: '#7A8B7A', 
                            font: {family: "'Poppins', sans-serif"},
                            callback: function(value) {
                                if(value >= 1000) return (value/1000) + 'K';
                                return value;
                            }
                        }
                    }
                },
                interaction: { intersect: false, mode: 'index' },
            }
        });
    }

    // 2. Orders by Status Donut Chart
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx && window.statusData) {
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: window.statusData.labels,
                datasets: [{
                    data: window.statusData.data,
                    backgroundColor: [
                        '#5E8C31', // Completed/Olive
                        '#D4AF37', // Processing/Gold
                        '#1C4023', // Pending/Dark Green
                        '#E53935'  // Cancelled/Red
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { family: "'Poppins', sans-serif", size: 11 },
                            color: '#7A8B7A'
                        }
                    },
                    tooltip: tooltipOptions
                }
            }
        });
    }

    // 3. Customer Growth Bar Chart
    const growthCtx = document.getElementById('growthChart');
    if (growthCtx && window.growthData) {
        new Chart(growthCtx, {
            type: 'bar',
            data: {
                labels: window.growthData.labels,
                datasets: [{
                    label: 'New Customers',
                    data: window.growthData.data,
                    backgroundColor: 'rgba(168, 198, 134, 0.7)',
                    hoverBackgroundColor: '#5E8C31',
                    borderRadius: 4,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: tooltipOptions
                },
                scales: {
                    x: { display: false },
                    y: { display: false, min: 0 }
                },
                interaction: { intersect: false, mode: 'index' },
            }
        });
    }
});
