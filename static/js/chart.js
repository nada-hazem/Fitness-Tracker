import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', function() {
    const chartCanvases = document.querySelectorAll('.activity-chart');
    
    chartCanvases.forEach(canvas => {
        const activityName = canvas.dataset.activity;
        const calories = parseInt(canvas.dataset.calories);
        
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: [activityName],
                datasets: [{
                    label: 'Calories Burned per Hour',
                    data: [calories],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Calories'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Calories Burned per Hour'
                    }
                }
            }
        });
    });
});