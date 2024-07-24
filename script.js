document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navbarLinks = document.querySelectorAll(".navbar a");
    let isScrolling = false;
    const firstText = document.querySelector('.typing-animation.first');
    const phrases = [
        "Hi, I'm Gem.",
        "This is my Website.",
        "I'm a BSIT Student.",
        "I'm a Basketball Player.",
        "I'm a Beginner Developer.",
        "I'm a System Admin at The Bear Insight.",
        "Never gonna give you up."
  ];
    let currentPhraseIndex = 0;
    let isTyping = true;
    let scrollTimeout;


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
        const textElement = firstText;
        textElement.textContent = phrases[currentPhraseIndex];
        textElement.classList.add('typing');
    
        setTimeout(() => {
          textElement.classList.remove('typing');
          setTimeout(() => {
            textElement.classList.add('backspace');
            setTimeout(() => {
              textElement.classList.remove('backspace');
              currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
              typeText();
            }, 1000); // Duration of backspace effect
          }, 1000); // Duration to wait before starting backspace
        }, 3000); // Duration of typing effect
      }
    
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