document.addEventListener("DOMContentLoaded", function () {
  fetch("/data/activities.json")
    .then((response) => response.json())
    .then((data) => {
      //after loading activity fetch user activity 
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

    // const isAdded = userActivities.some((userActivity) => userActivity.id === activity.id);
    let isAdded = false;
    for (let i = 0; i < userActivities.length; i++) {
        if (userActivities[i].id === activity.id) {
            isAdded = true;
            break;
        }
    }
    const buttonText = isAdded ? "Remove from My Activities" : "Add to My Activities";
    const buttonClass = isAdded ? "removeBtn" : "addBtn";

    activityCard.innerHTML = `
            <img src="${activity.photo}" alt="${activity.name}" class="activity-photo">
            <h3>${activity.name}</h3>
            <div class="description">
            <p class="description"> ${activity.description}</p>
            <p class="test"><strong>Category:</strong> ${activity.category}</p>
            <p><strong>Duration:</strong> ${activity.duration_minutes} min</p>
            <p><strong>Calories Burned:</strong> ${activity.calories_burned_per_hour} cal/hour</p>
            <p><strong>Difficulty:</strong> ${activity.difficulty}</p>
            <button class="${buttonClass}" type="button" data-id="${activity.id}">${buttonText}</button>
            </div>
        `;

    //Attach an Event Listener to the Button
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
    headers: { "Content-Type": "application/json" }, // tells the server that requst body contain json data
    body: JSON.stringify({ id: activityId }), // Converts the activity ID into a JSON string to send in the request.
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message.includes("successfully")) {
        button.textContent = isRemoving ? "Add to My Activities" : "Remove from My Activities"; //update based on the item removed or added
        button.classList.toggle("removeBtn");
        button.classList.toggle("addBtn");
      }
    })
    .catch((error) => console.error("Error updating activities:", error));
}