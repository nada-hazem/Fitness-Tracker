function openEditModal(
    id,
    name,
    category,
    duration,
    calories,
    difficulty
  ) {
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
    document.getElementById("editActivityDifficulty").value =
      difficulty || "";

    document.getElementById("editModal").style.display = "block";
  }

  function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
  }

  document
    .getElementById("editActivityForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const updatedActivity = {
        id: document.getElementById("editActivityId").value,
        name: document.getElementById("editActivityName").value,
        category: document.getElementById("editActivityCategory").value,
        duration_minutes: document.getElementById("editActivityDuration")
          .value,
        calories_burned_per_hour: document.getElementById(
          "editActivityCalories"
        ).value,
        difficulty: document.getElementById("editActivityDifficulty").value,
      };

      fetch("/update_activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedActivity),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          location.reload();
        })
        .catch((error) => console.error("Error:", error));
    });

  function removeActivity(activityId, button) {
    let userActivities = JSON.parse(localStorage.getItem("user_activities")) || [];
    userActivities = userActivities.filter(id => id !== activityId);
    localStorage.setItem("user_activities", JSON.stringify(userActivities));

    fetch("/remove_activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activityId }),
    })
      .then((response) => response.json())
      .then(() => button.parentElement.remove());
  }