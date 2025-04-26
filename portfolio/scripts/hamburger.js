/*global console, document, window */

const hamburger = document.createElement("div");

function toggleMenu() {
    const navbar = document.querySelector("nav");
    if (navbar.style.display === "none" || navbar.style.display === "") {
        navbar.style.display = "block";

        hamburger.innerHTML = `&#10005;`; // Change to close icon
        setTimeout(function() {
            navbar.style.opacity = "1";
        }, 0);

    } else {
        navbar.style.opacity = "0";
        setTimeout(function() {
            navbar.style.display = "none";
        }, 0);
        hamburger.innerHTML = `&#9776;`; // Change to hamburger icon
    }
}


function initHamburger() {
    hamburger.classList.add("hamburger");
    hamburger.id = "hamburger-menu";
    hamburger.innerHTML = `&#9776;`;
    hamburger.style.position = "fixed";
    hamburger.style.top = "10px";
    hamburger.style.right = "10px";
    hamburger.style.fontSize = "2rem";
    hamburger.style.zIndex = "101"; // Ensure hamburger is above the navbar
    document.body.appendChild(hamburger);
    hamburger.style.display = "none"; // Initially hide the hamburger icon
    hamburger.addEventListener("click", toggleMenu);
}

function loadHamburger() {
    if (window.innerWidth < 768) {
        const navbar = document.querySelector("nav");
        navbar.style.display = "none";
        navbar.style.transition = "opacity 0.6s ease-in-out";
        navbar.style.opacity = "0";
        navbar.style.position = "fixed";
        navbar.style.width = "100%";
        navbar.style.zIndex = "100";
        // console.log(navbar);

        hamburger.style.display = "block"; // Show hamburger icon
    }

}

function responsiveGradient(navbar) {
    const oldNavbarBackground = window.getComputedStyle(navbar).backgroundColor;
    navbar.addEventListener("mouseenter", function() {
        console.log(oldNavbarBackground);
        const handleMouseMove = function(event) {
            const rect = navbar.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            navbar.style.background = `radial-gradient(circle at ${x}px ${y}px, rgb(187, 255, 0), ${oldNavbarBackground}, ${oldNavbarBackground}, ${oldNavbarBackground})`;
        };
        navbar.addEventListener("mousemove", handleMouseMove);

        navbar.addEventListener("mouseleave", function() {
            navbar.style.background = oldNavbarBackground;
            navbar.removeEventListener("mousemove", handleMouseMove);
        }, { once: true });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");
    initHamburger();
    loadHamburger();
    responsiveGradient(navbar);
    responsiveGradient(footer);
    window.addEventListener("resize", function() {
        if (window.innerWidth >= 768) {
            navbar.style.display = "block";
            navbar.style.opacity = "1";
            hamburger.style.display = "none"; // Hide hamburger ico
        } else {
            loadHamburger();
        }
    });
});