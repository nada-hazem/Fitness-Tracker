// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>FitTrack - Smart Fitness Tracking</title>
//     <style>
//         :root {
//             --dark-green: #0A2818;
//             --neon-green: #B4F94C;
//             --white: #ffffff;
//             --light-green: rgba(180, 249, 76, 0.1);
//         }

//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         }

//         body {
//             background-color: var(--dark-green);
//             color: var(--white);
//             line-height: 1.5;
//         }

//         .navbar {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 1.5rem 5%;
//             position: fixed;
//             width: 100%;
//             top: 0;
//             z-index: 1000;
//             background-color: var(--dark-green);
//         }

//         .logo {
//             display: flex;
//             align-items: center;
//             gap: 0.5rem;
//             text-decoration: none;
//             color: var(--neon-green);
//             font-weight: bold;
//             font-size: 1.25rem;
//         }

//         .nav-links {
//             display: flex;
//             gap: 2rem;
//         }

//         .nav-links a {
//             color: var(--white);
//             text-decoration: none;
//             font-size: 0.9rem;
//             opacity: 0.9;
//         }

//         .nav-buttons {
//             display: flex;
//             gap: 1rem;
//         }

//         .button {
//             padding: 0.6rem 1.2rem;
//             border-radius: 50px;
//             text-decoration: none;
//             font-size: 0.9rem;
//             font-weight: 500;
//             transition: all 0.3s ease;
//         }

//         .button-primary {
//             background: var(--neon-green);
//             color: var(--dark-green);
//         }

//         .button-secondary {
//             border: 1px solid var(--neon-green);
//             color: var(--neon-green);
//         }

//         .hero {
//             min-height: 100vh;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             padding: 8rem 5% 5rem 5%;
//             text-align: center;
//         }

//         .hero-content {
//             max-width: 800px;
//         }

//         .badge {
//             display: inline-flex;
//             align-items: center;
//             gap: 0.5rem;
//             background: var(--light-green);
//             padding: 0.5rem 1rem;
//             border-radius: 50px;
//             color: var(--neon-green);
//             margin-bottom: 2rem;
//         }

//         .hero-title {
//             font-size: 4rem;
//             line-height: 1.2;
//             margin-bottom: 1.5rem;
//         }

//         .hero-description {
//             font-size: 1.1rem;
//             opacity: 0.9;
//             margin-bottom: 2rem;
//             max-width: 600px;
//             margin-left: auto;
//             margin-right: auto;
//         }

//         .hero-buttons {
//             display: flex;
//             gap: 1rem;
//             justify-content: center;
//             margin-bottom: 2rem;
//         }

//         .contact-text {
//             color: var(--white);
//             opacity: 0.7;
//             font-size: 0.9rem;
//         }

//         .contact-text span {
//             color: var(--neon-green);
//         }

//         .hero-image {
//             max-width: 800px;
//             margin: 3rem auto 0;
//             border-radius: 20px;
//             overflow: hidden;
//         }

//         .hero-image img {
//             width: 100%;
//             height: auto;
//             display: block;
//         }

//         @media (max-width: 768px) {
//             .nav-links {
//                 display: none;
//             }

//             .hero-title {
//                 font-size: 2.5rem;
//             }

//             .hero-buttons {
//                 flex-direction: column;
//                 padding: 0 2rem;
//             }

//             .button {
//                 width: 100%;
//                 text-align: center;
//             }
//         }
//     </style>
// </head>
// <body>
//     <nav class="navbar">
//         <a href="#" class="logo">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
//             </svg>
//             MoveMate
//         </a>
       
//         <div class="nav-buttons">
//             <a href="/auth/login" class="button button-secondary">Log in</a>
//             <a href="#register" class="button button-primary">Register</a>
//         </div>
//     </nav>

//     <section class="hero">
//         <div class="hero-content">
//             <div class="badge">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                     <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
//                     <path d="M12 6v6l4 2"/>
//                 </svg>
//                 Fitness Tracking
//             </div>
//             <h1 class="hero-title">Smart fitness tracking for everyone.</h1>
//             <p class="hero-description">
//                 Advanced workout tracking, real-time analytics, personalized coaching, and progress monitoring—all in one powerful platform.
//             </p>
//             <div class="hero-buttons">
//                 <a href="#start" class="button button-primary">Create account</a>
//                 <a href="#contact" class="button button-secondary">Contact sales</a>
//             </div>
//             <p class="contact-text">Talk to a fitness specialist to get started, <span>1-234-567-890</span></p>
//             <div class="hero-image">
//                 <img src="/placeholder.svg?height=400&width=800" alt="Fitness tracking dashboard interface">
//             </div>
//         </div>
//     </section>
// </body>
// </html>