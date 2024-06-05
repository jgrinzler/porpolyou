document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navbarLinks = document.querySelectorAll(".navbar a");
    let isScrolling = false;

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
        const scrollDuration = isFirefox ? 380 : 400; // 1000ms for Firefox, 600ms for others

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Use a timeout to match the duration of the smooth scroll
        setTimeout(() => {
            isScrolling = false;
            callback();
        }, scrollDuration); // This timeout should match the duration of the smooth scroll
    }

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
