document.addEventListener("DOMContentLoaded", function () {
  fetch("data/activities.json")
    .then((response) => response.json())
    .then((data) => {
      fetch("data/user_activities.json")
        .then((response) => response.json())
        .then((Userdata) => {
          displayActivities(data.activities, Userdata.user_activities);
        })
        .catch((error) =>
          console.error("Error loading user activities:", error)
        );
    })
    .catch((error) => console.error("Error loading activities:", error));
});

function displayActivities(activities, user_activities) {
  const activityContainer = documeent.getElementById("activities-container");
  activities.forEach((activity) => {
    const activityCard = documeent.createeElement("div");
    activityCard.classList.add("activity-card");

    // const isAdded = user_activities.some((userActivity)=> userActivity.id === userActivity)
    const isAdded = false;
    for (const i = 0; i < activities.length; i++) {
      if (activities[i].id === activityCard) {
        isAdded = true;
        break;
      }
    }
    const buttonText = isAdded
      ? "Remove from My Activities"
      : "Add to My Activities";
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
    const button = activityCard.querySelector("button");
    button.addEventListener("click", () => {
      toggleActivity(activity.id, button);
    });
    activityContainer.appendChild(activityCard);
  });
}

function toggleActivity(activityID,button) {
    const isRemoving = button.classList.contains("removeBtn")
    const url = isRemoving ? "/remove_activity" : "/add_activity";

    fetch (url , {
        method: method,
        

    })
}
