document.addEventListener("DOMContentLoaded", function () {
  const activityForm = document.getElementById("activityForm");

  // Handles form submission for creating an activity
  activityForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(activityForm);

    try {
      const response = await fetch("/create_activity", {
        method: "POST",
        body: formData,
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const data = await response.json();
        alert(data.message || "Error adding activity.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});
