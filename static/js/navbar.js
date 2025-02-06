document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');
  
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });
  
    // Close menu when a link is clicked
    document.querySelectorAll('.navbar-menu a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
      });
    });
  });