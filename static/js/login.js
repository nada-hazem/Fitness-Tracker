document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".password-toggle");
  
    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const targetId = button.getAttribute("data-target");
            const passwordInput = document.getElementById(targetId);
  
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                button.classList.add("visible");
            } else {
                passwordInput.type = "password";
                button.classList.remove("visible");
            }
        });
    });
  });