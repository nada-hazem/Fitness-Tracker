function openEditModal(id, name, category, duration, calories, difficulty) {
  console.log("Opening Modal with Data:", {
    id,
    name,
    category,
    duration,
    calories,
    difficulty,
  });

  document.getElementById("editActivityId").value = id || "";
  document.getElementById("editActivityName").value = name || "";
  document.getElementById("editActivityCategory").value = category || "";
  document.getElementById("editActivityDuration").value = duration || 0;
  document.getElementById("editActivityCalories").value = calories || 0;
  document.getElementById("editActivityDifficulty").value = difficulty || "";

  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

document
  .getElementById("editActivityForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedActivity = {
      id: document.getElementById("editActivityId").value,
      name: document.getElementById("editActivityName").value,
      category: document.getElementById("editActivityCategory").value,
      duration_minutes: document.getElementById("editActivityDuration").value,
      calories_burned_per_hour: document.getElementById("editActivityCalories")
        .value,
      difficulty: document.getElementById("editActivityDifficulty").value,
    };

    fetch("/update_activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedActivity),
    })
      .then((response) => response.json())
      .then((data) => {
        showNotification(data.message, "success");

        location.reload();
      })
      .catch((error) => console.error("Error:", error));
  });

function removeActivity(activityId, button) {
  let userActivities =
    JSON.parse(localStorage.getItem("user_activities")) || [];
  userActivities = userActivities.filter((id) => id !== activityId);
  localStorage.setItem("user_activities", JSON.stringify(userActivities));

  fetch("/remove_activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: activityId }),
  })
    .then((response) => response.json())
    .then(() => button.parentElement.remove());
}

// Function to handle adding an activity to goals
function addToGoals(activityId) {
  fetch("/add_to_goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: activityId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        showNotification(data.message, "success");

        const button = document.querySelector(
          `.add-to-goals[data-id="${activityId}"]`
        );
        if (button) {
          button.disabled = true;
          button.textContent = "Added to Goals";
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification("Failed to add activity to goals", "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-goals").forEach((button) => {
    button.addEventListener("click", function () {
      const activityId = this.getAttribute("data-id");
      addToGoals(activityId);
    });
  });
});

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
  notification.style.backgroundColor =
    type === "success" ? "green" : type === "error" ? "red" : "red";
  notification.style.color = "white";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "1000";
  notification.style.fontSize = "14px";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
