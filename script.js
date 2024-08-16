document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navbarLinks = document.querySelectorAll(".navbar a");
    let isScrolling = false;
    const firstText = document.querySelector('.typing-animation.first');
    const phrases = [
        "Hi, I'm Gem.",
        "This is my Website.",
        "I'm a BSIT Student.",
        "I play Basketball.",
        "I'm a Beginner Dev.",
        "I'm a SysAd at The Bear Insight.",
    ];
    let currentPhraseIndex = 0;
    let isDeleting = false;
    let charIndex = 0;
    let typingSpeed = 100; // Speed of typing effect
    let deletingSpeed = 50; // Speed of backspacing effect
    let pauseTime = 2000; // Pause time between phrases
    let scrollTimeout;
    const icons = document.querySelectorAll('.socials i');
    // Detect Firefox browser
    const isFirefox = typeof InstallTrigger !== 'undefined';

    // Create an intersection observer
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        if (isScrolling) return;

        entries.forEach(entry => {
            const navLink = document.querySelector(`.navbar a[href="#${entry.target.id}"]`);
            if (entry.isIntersecting) {
                navLink.classList.add("active");
                entry.target.classList.add("fade-in");
                entry.target.classList.remove("fade-out");
            } else {
                navLink.classList.remove("active");
                entry.target.classList.add("fade-out");
                entry.target.classList.remove("fade-in");
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    icons.forEach(icon => {
        icon.addEventListener('mousedown', () => {
          icon.classList.add('bounce'); // Start bounce animation on press
        });
    
        icon.addEventListener('mouseup', () => {
          icon.classList.remove('bounce'); // Stop bounce animation on release
        });
    
        icon.addEventListener('mouseleave', () => {
          icon.classList.remove('bounce'); // Stop bounce animation if the mouse leaves the icon
        });
      });

      

    function smoothScroll(target, callback) {
        isScrolling = true;
        const scrollDuration = isFirefox ? 380 : 400;

        // Disable pointer events on navbar links
        navbarLinks.forEach(link => {
            link.style.pointerEvents = 'none';
        });

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            // Re-enable pointer events on navbar links
            navbarLinks.forEach(link => {
                link.style.pointerEvents = 'auto';
            });
            callback();
        }, scrollDuration);
    }

    function typeText() {
        const currentPhrase = phrases[currentPhraseIndex];
    
        if (isDeleting) {
            // Remove characters
            firstText.textContent = currentPhrase.substring(0, charIndex);
            charIndex--;
            if (charIndex < 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                setTimeout(typeText, pauseTime); // Pause before typing next phrase
            } else {
                setTimeout(typeText, deletingSpeed);
            }
        } else {
            // Add characters
            firstText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex >= currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeText, pauseTime); // Pause before backspacing
            } else {
                setTimeout(typeText, typingSpeed);
            }
        }
    
        // Ensure border-right is always visible
        firstText.style.borderRight = '2px solid white';
    }

    // Start typing animation
    typeText();
    
    navbarLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            if (isScrolling) return;
            event.preventDefault();
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            smoothScroll(targetSection, () => {
                // Trigger highlighting after scrolling
                const navLink = document.querySelector(`.navbar a[href="${targetId}"]`);
                navbarLinks.forEach(link => link.classList.remove("active"));
                navLink.classList.add("active");

                sections.forEach(section => {
                    if (section.id === targetId.substring(1)) {
                        section.classList.add("fade-in");
                        section.classList.remove("fade-out");
                    } else {
                        section.classList.remove("fade-in");
                        section.classList.add("fade-out");
                    }
                });
            });
        });
    });

    // Initially trigger the observer to highlight the correct link and fade in sections
    window.addEventListener("load", () => {
        sections.forEach(section => observer.observe(section));
    });
});
