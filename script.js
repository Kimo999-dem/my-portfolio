// Function to check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
    // Check if the top of the element is within the viewport and not too far down
    // Also check if the bottom of the element is above the viewport top
    return (
        rect.top <= viewportHeight * 0.8 && // Element starts before 80% down the viewport
        rect.bottom >= viewportHeight * 0.2 // Element ends after 20% up the viewport
    );
}

// Keep track of animated sections to avoid re-animating on every scroll
const animatedSections = new Set();

// Function to add 'is-visible' class to sections when they are in viewport and trigger inner animations
function animateOnScroll() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        // Only animate if the section is in viewport and hasn't been animated before
        if (isInViewport(section) && !animatedSections.has(section.id)) {
            section.classList.add('is-visible');
            animatedSections.add(section.id); // Mark section as animated

            // Trigger specific animations for sections after a delay if needed
            if (section.id === 'skills') {
                 // Skill bar animation is triggered by CSS transition on is-visible
                 // No need for separate JS animation trigger here if CSS is set up correctly
                 // Wait for section to be visible then trigger bars if they need JS nudge
                 setTimeout(() => {
                     animateSkillBars(section); // Call function to set final width, CSS transitions it
                 }, 600); // Delay slightly after section fade-in

            } else if (section.id === 'projects') {
                 // Animate project items with staggered delay
                 animateProjectItems(section);
            } else if (section.id === 'personal-strengths') {
                // Animate personal strength items with a staggered delay
                animatePersonalStrengths(section);
            }
             // Add similar logic for other sections if they have inner animations

        }
         // Optional: remove class when out of view if you want repeated animation
         // For most portfolios, animating once is preferred.
    });
}

// Function to animate skill bars within the skills section
function animateSkillBars(skillsSection) {
    const progressBars = skillsSection.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        // Get the target width from the inline style (e.g., 'width: 90%;')
        const targetWidth = bar.style.width;
        // Set the width to the target width. CSS transition handles the animation.
        bar.style.width = targetWidth;
    });

     // Also animate the skill headers and paragraphs within each item with a staggered delay
     const skillItems = skillsSection.querySelectorAll('.skill-item');
     skillItems.forEach((item, index) => {
         // Delay the animation for the skill item container and its immediate children
         setTimeout(() => {
             // Add a class to trigger the visibility animation
             item.classList.add('is-in-view');

             // Animate header, paragraph, and progress bar container within the item
             const header = item.querySelector('.skill-header');
             const paragraph = item.querySelector('p');
             const progressBarContainer = item.querySelector('.progress-bar-container');

             if (header) { 
                 header.style.opacity = '1'; 
                 header.style.transform = 'translateY(0)'; 
                 header.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Ensure transition is applied
             }
             if (paragraph) { 
                 // Add a slight delay for the paragraph after the header
                 setTimeout(() => {
                     paragraph.style.opacity = '1';
                     paragraph.style.transform = 'translateY(0)';
                     paragraph.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Ensure transition
                 }, 100); // Short delay
             }
              if (progressBarContainer) {
                  // Add a slight delay for the progress bar container after the paragraph
                  setTimeout(() => {
                     progressBarContainer.style.opacity = '1';
                     progressBarContainer.style.transform = 'translateY(0)';
                      progressBarContainer.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Ensure transition
                  }, 200); // Short delay
              }

         }, 600 + (index * 150)); // Base delay (after section appears) + 150ms for each item container
     });
}

// Function to animate project items within the projects section
function animateProjectItems(projectsSection) {
    const projectItems = projectsSection.querySelectorAll('.project-item');
    projectItems.forEach((item, index) => {
        // Add a staggered delay for each project item
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
             // Add a class if needed for more complex animations defined in CSS
             // item.classList.add('is-visible-item');
        }, 300 + (index * 150)); // Base delay + 150ms for each subsequent item
    });
}

// Function to animate personal strength items within their section
function animatePersonalStrengths(strengthsSection) {
    const strengthItems = strengthsSection.querySelectorAll('li');
    strengthItems.forEach((item, index) => {
        // Add a staggered delay for each strength item
        setTimeout(() => {
            item.classList.add('is-in-view');
        }, 300 + (index * 100)); // Base delay + 100ms for each subsequent item
    });
}

// Add event listener for scroll and load for section animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Initial check on page load for section animations
animateOnScroll();

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// --- Navigation Bar Scroll Effect ---
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('nav');
    const scrollThreshold = 50; // Distance in pixels to scroll before adding the 'scrolled' class

    function updateNavbarScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateNavbarScroll);

    // Initial check in case the page is loaded already scrolled
    updateNavbarScroll();
});

// --- Hero Pulsing Light Observer ---
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                hero.classList.add('is-pulsing');
            } else {
                hero.classList.remove('is-pulsing');
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the hero is visible

    observer.observe(hero);
});

// --- Scroll to Top Button functionality ---
// Wait for the DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // Check if the button element exists before proceeding
    if (!scrollToTopBtn) {
        console.error("Scroll to top button element not found!");
        return; // Exit if the element is not found
    }

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// --- Language Switcher functionality ---
// Removed Language Switcher functionality

// Note: The initial call to animateOnScroll in the main part of the script
// and the calls within switchLanguage should handle the animations properly. 