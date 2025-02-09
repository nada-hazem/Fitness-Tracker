document.addEventListener("DOMContentLoaded", function () {
  fetch("/data/activities.json")
    .then((response) => response.json())
    .then((data) => {
      fetch("/data/user_activities.json")
        .then((response) => response.json())
        .then((userData) => {
          // Extract the user activities correctly and ensure it's an array
          const userActivities = userData.user_activities?.user_email ?? [];

          // Call displayActivities with the corrected data
          displayActivities(data.activities, userActivities);
        })
        .catch((error) =>
          console.error("Error loading user activities:", error)
        );
    })
    .catch((error) => console.error("Error loading activities:", error));
});

function displayActivities(activities) {
  const activitiesContainer = document.getElementById("activities-container");
  const userActivities =
    JSON.parse(localStorage.getItem("user_activities")) || [];

  activities.forEach((activity) => {
    const activityCard = document.createElement("div");
    activityCard.classList.add("activity-card");

    // Check if the activity is in the user's activities list
    const isAdded = userActivities.includes(activity.id);
    const buttonText = isAdded
      ? "Remove from My Activities"
      : "Add to My Activities";
    const buttonClass = isAdded ? "removeBtn" : "addBtn";

    activityCard.innerHTML = `
            <img src="${activity.photo}" alt="${activity.name}" class="activity-photo">
            <div class="activity-content">
                <h3>${activity.name}</h3>
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
  if (!activityId) {
    console.error("Activity ID is undefined!");
    return;
  }

  const isRemoving = button.classList.contains("removeBtn");
  const url = isRemoving ? "/remove_activity" : "/add_activity";

  console.log("Sending request to:", url);
  console.log("Payload:", JSON.stringify({ id: activityId }));

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: activityId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response Data:", data);

      if (
        data.message.includes("successfully") ||
        data.message.includes("already added")
      ) {
        // Retrieve the activities from localStorage
        let storedActivities =
          JSON.parse(localStorage.getItem("user_activities")) || [];

        // Add or remove the activity ID based on the action
        if (isRemoving) {
          storedActivities = storedActivities.filter((id) => id !== activityId);
        } else {
          storedActivities.push(activityId);
        }

        // Save updated activities list back to localStorage
        localStorage.setItem(
          "user_activities",
          JSON.stringify(storedActivities)
        );

        // Update the button text and class based on the action
        button.textContent = isRemoving
          ? "Add to My Activities"
          : "Remove from My Activities";
        button.classList.toggle("removeBtn");
        button.classList.toggle("addBtn");

        showNotification(data.message,  isRemoving ? "info" : "success");
      }
    })
    .catch((error) => {
      console.error("Error updating activities:", error);
      showNotification("An error occurred. Please try again.", "error");
    });
}

function showNotification(message, type = "success") {
  // Remove any existing notification before adding a new one
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create a new notification
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Style the notification
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.padding = "10px 20px";
  notification.style.backgroundColor =  type === "success" ? "green" : type === "error" ? "red" : "red";
  notification.style.color = "white";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "1000";
  notification.style.fontSize = "14px";

  document.body.appendChild(notification);


  setTimeout(() => {
    notification.remove();
  }, 3000);
}

