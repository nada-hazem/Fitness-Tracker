document.addEventListener("DOMContentLoaded", function () {
  fetch("/data/activities.json")
      .then((response) => response.json())
      .then((data) => {
          fetch("/data/user_activities.json")
              .then((response) => response.json())
              .then((userData) => {
                  displayActivities(data.activities, userData.user_activities);
              })
              .catch((error) => console.error("Error loading user activities:", error));
      })
      .catch((error) => console.error("Error loading activities:", error));
});

function displayActivities(activities, userActivities) {
  const activitiesContainer = document.getElementById("activities-container");

  activities.forEach((activity) => {
      const activityCard = document.createElement("div");
      activityCard.classList.add("activity-card");

      const isAdded = userActivities.some((userActivity) => userActivity.id === activity.id);
      const buttonText = isAdded ? "Remove from My Activities" : "Add to My Activities";
      const buttonClass = isAdded ? "removeBtn" : "addBtn";
      

      activityCard.innerHTML = `
          <img src="${activity.photo}" alt="${activity.name}" class="activity-photo">
          <div class="activity-content">
              <h3>${activity.name}</h3>
              <p class="description">${activity.description}</p>
              <div class="activity-details">
                  <p><strong>Category:</strong> ${activity.category}</p>
                  <p><strong>Duration:</strong> ${activity.duration_minutes} min</p>
                  <p><strong>Calories:</strong> ${activity.calories_burned_per_hour} cal/hour</p>
                  <p><strong>Difficulty:</strong> ${activity.difficulty}</p>
              </div>
              <button class="${buttonClass}" type="button" data-id="${activity.id}">${buttonText}</button>
          </div>
      `;

      const button = activityCard.querySelector("button");
      button.addEventListener("click", () => toggleActivity(activity.id, button));

      activitiesContainer.appendChild(activityCard);
  });
}

function toggleActivity(activityId, button) {
  const isRemoving = button.classList.contains("removeBtn");
  const url = isRemoving ? "/remove_activity" : "/add_activity";
  const method = "POST";

  fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activityId }),
  })
      .then((response) => response.json())
      .then((data) => {
          if (data.message.includes("successfully")) {
              button.textContent = isRemoving ? "Add to My Activities" : "Remove from My Activities";
              button.classList.toggle("removeBtn");
              button.classList.toggle("addBtn");
              showNotification(data.message, "success");
          }
      })
      .catch((error) => {
          console.error("Error updating activities:", error);
          showNotification("An error occurred. Please try again.", "error");
      });
}

