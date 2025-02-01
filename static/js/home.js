
document.addEventListener("DOMContentLoaded", function () {
  fetch("/data/activities.json")
    .then((response) => response.json())
    .then((data) => {
      displayActivities(data.activities);
    })
    .catch((error) => console.error("Error loading activities:", error));
});

function displayActivities(activities) {
  const activitiesContainer = document.getElementById("activities-container");

  activities.forEach((activity) => {
    const activityCard = document.createElement("div");
    activityCard.classList.add("activity-card");

    activityCard.innerHTML = `
            <img src="${activity.photo}" alt="${activity.name}" class="activity-photo">
            <h3>${activity.name}</h3>
            <div class="description">
            <p class="description"> ${activity.description}</p>
            <p class="test"><strong>Category:</strong> ${activity.category}</p>
            <p><strong>Duration:</strong> ${activity.duration_minutes} min</p>
            <p><strong>Calories Burned:</strong> ${activity.calories_burned_per_hour} cal/hour</p>
            <p><strong>Difficulty:</strong> ${activity.difficulty}</p>
            <button class="addBtn" type="button">Add to my activities</button>
            </div>
        `;

    activitiesContainer.appendChild(activityCard);
  });
}
