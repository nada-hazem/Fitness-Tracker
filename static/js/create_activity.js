document.addEventListener("DOMContentLoaded", function () {
    const activityForm = document.getElementById("activityForm");

    activityForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(activityForm); // Handles file upload

        try {
            const response = await fetch("/create_activity", {
                method: "POST",
                body: formData, // Send form data including the file
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
