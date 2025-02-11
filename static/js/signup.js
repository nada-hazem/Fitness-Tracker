//select elements
const passwordInput = document.getElementById("user-password"); 
const strengthLabel = document.getElementById("strength-label");
const passwordRequirements = document.getElementById("password-requirements");
const passwordStrengthText = document.getElementById("password-strength");

//obkect to store elements
const requirements = {
  uppercase: document.getElementById("uppercase"),
  lowercase: document.getElementById("lowercase"),
  number: document.getElementById("number"),
  special: document.getElementById("special"),
  length: document.getElementById("length"),
};

const regex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  special: /[!@#$%^&*()\-_=+{};:,<>\[\]]/,
  length: /.{8,}/,
};

// Function to evaluate password strength and update UI
const passwordStrength = (password) => {
  let strength = "Weak";

// Show or hide password requirements section based on input presence
  if (password.length > 0) {
    passwordRequirements.classList.remove("hidden");
    passwordStrengthText.classList.remove("hidden"); 
  } else {
    passwordRequirements.classList.add("hidden");
    passwordStrengthText.classList.add("hidden");
  }

  let passedConditions = 0;

  // Loop through each requirement and check if the password meets it
  for (const key in regex) {
    const meetsCondition = regex[key].test(password);
    requirements[key].classList.toggle("met", meetsCondition);
    requirements[key].classList.toggle("unmet", !meetsCondition);
    if (meetsCondition) passedConditions++;
  }

 

  strengthLabel.textContent = strength;
};

passwordInput.addEventListener("input", (e) => {
  passwordStrength(e.target.value);
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleButtons = document.querySelectorAll(".password-toggle");

  toggleButtons.forEach(button => {
      button.addEventListener("click", function () {
          const targetId = button.getAttribute("data-target");
          const passwordInput = document.getElementById(targetId);
          
          // Toggle password visibility between "password" and "text"
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
