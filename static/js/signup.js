const passwordInput = document.getElementById("user-password"); 
const strengthLabel = document.getElementById("strength-label");
const passwordRequirements = document.getElementById("password-requirements");
const passwordStrengthText = document.getElementById("password-strength");

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

const passwordStrength = (password) => {
  let strength = "Weak";

  if (password.length > 0) {
    passwordRequirements.classList.remove("hidden");
    passwordStrengthText.classList.remove("hidden"); 
  } else {
    passwordRequirements.classList.add("hidden");
    passwordStrengthText.classList.add("hidden");
  }

  let passedConditions = 0;

  for (const key in regex) {
    const meetsCondition = regex[key].test(password);
    requirements[key].classList.toggle("met", meetsCondition);
    requirements[key].classList.toggle("unmet", !meetsCondition);
    if (meetsCondition) passedConditions++;
  }

  if (passedConditions === 5) {
    // strength = "Strong";
    strengthLabel.style.color = "green";
  } else if (passedConditions >= 3) {
    // strength = "Medium";
    strengthLabel.style.color = "orange";
  } else {
    // strength = "Weak";
    strengthLabel.style.color = "red";
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
