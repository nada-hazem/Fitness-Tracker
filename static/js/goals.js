function removeGoal(activityId, button) {
    fetch("/remove_goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activityId }),
    })
    .then((response) => response.json())
    .then(() => {
        // Remove the activity element from the UI
        button.parentElement.remove();

        // Update the `goals-data` dataset to reflect the removal
        const goalsDataElement = document.getElementById("goals-data");
        let activities = JSON.parse(goalsDataElement.textContent);

        // Filter out the removed activity
        activities = activities.filter(activity => activity.id !== activityId);

        // Update the dataset with the new activities list
        goalsDataElement.textContent = JSON.stringify(activities);

        // Update stats dynamically
        updateGoalStats();
        generateGoalsChart(); // Also update the chart dynamically
    })
    .catch((error) => console.error("Error:", error));
}

function updateGoalStats() {
    const goalsDataElement = document.getElementById("goals-data");
    const activities = JSON.parse(goalsDataElement.textContent);

    if (!activities || activities.length === 0) {
        console.log("No activities in goals.");
        document.getElementById("total-activities").textContent = "0";
        document.getElementById("total-calories").textContent = "0.00";
        document.getElementById("total-duration").textContent = "0 min";
        document.getElementById("total-burned").textContent = "0.00 cal";
        return;
    }

    let totalActivities = activities.length;
    let totalCalories = 0;
    let totalDuration = 0;
    let totalBurnedCalories = 0;

    activities.forEach(activity => {
        totalCalories += activity.calories_burned_per_hour;
        totalDuration += activity.duration_minutes;
        totalBurnedCalories += (activity.calories_burned_per_hour / 60) * activity.duration_minutes;
    });

    document.getElementById("total-activities").textContent = totalActivities;
    document.getElementById("total-calories").textContent = totalCalories.toFixed(2);
    document.getElementById("total-duration").textContent = totalDuration + " min";
    document.getElementById("total-burned").textContent = totalBurnedCalories.toFixed(2) + " cal";
}

function generateGoalsChart() {
    const goalsDataElement = document.getElementById("goals-data");
    const activities = JSON.parse(goalsDataElement.textContent);

    if (!activities || activities.length === 0) {
        console.log("No data available for chart.");
        document.getElementById("goalsChart").getContext("2d").clearRect(0, 0, 400, 400); // Clear the canvas
        return;
    }

    const activityNames = activities.map(activity => activity.name);
    const caloriesBurned = activities.map(activity => activity.calories_burned_per_hour);

    const ctx = document.getElementById("goalsChart").getContext("2d");

    // Destroy the existing chart if it exists
    if (window.myGoalsChart) {
        window.myGoalsChart.destroy();
    }

    window.myGoalsChart = new Chart(ctx, {
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
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'left'
                }
            }
        }
    });
}

// Initial calls when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    updateGoalStats();
    generateGoalsChart();
});
