function removeGoal(activityId, button) {
    fetch("/remove_goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activityId }),
    })
    .then((response) => response.json())
    .then(() => button.parentElement.remove())
    .catch((error) => console.error("Error:", error));
}
document.addEventListener("DOMContentLoaded", function () {
    // Function to extract data and create the chart
    function generateGoalsChart() {
        const activities = JSON.parse(document.getElementById("goals-data").textContent);

        if (!activities || activities.length === 0) {
            console.log("No data available for chart.");
            return;
        }

        const activityNames = activities.map(activity => activity.name);
        const caloriesBurned = activities.map(activity => activity.calories_burned_per_hour);

        const ctx = document.getElementById("goalsChart").getContext("2d");

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: activityNames,
                datasets: [{
                    label: "Calories Burned Per Hour",
                    data: caloriesBurned,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 159, 64, 0.6)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow resizing
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
        
    }

    generateGoalsChart();
});
