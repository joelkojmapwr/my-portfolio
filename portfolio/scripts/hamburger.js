function toggleMenu() {
    const navbar = document.querySelector("nav");
    const hamburger = document.getElementById("hamburger-menu");
    if (navbar.style.display === "none" || navbar.style.display === "") {
        navbar.style.display = "block";

        // navbar.style.display = "block";

        hamburger.innerHTML = `&#10005;`; // Change to close icon
        setTimeout(() => {
            navbar.style.opacity = "1";

        }, 0); // Trigger the transition

    } else {
        navbar.style.opacity = "0";
        setTimeout(() => {
            navbar.style.display = "none";
        }, 300); // Match the transition duration
        hamburger.innerHTML = `&#9776;`; // Change to hamburger icon
    }
}

var hamburger = document.createElement("div");

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
    
    // const navItems = navbar.querySelectorAll("li");
    const oldNavbarBackground = window.getComputedStyle(navbar).backgroundColor;
    navbar.addEventListener("mouseenter", () => {
        navbar.style.backgroundColor = "linear-gradient(to right, blue, transparent)";
        console.log(oldNavbarBackground)
        const handleMouseMove = (event) => {
            const rect = navbar.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            navbar.style.background = `radial-gradient(circle at ${x}px ${y}px, rgb(187, 255, 0), ${oldNavbarBackground}, ${oldNavbarBackground}, ${oldNavbarBackground})`;
        };
        navbar.addEventListener("mousemove", handleMouseMove);

        navbar.addEventListener("mouseleave", () => {
            navbar.style.background = oldNavbarBackground;
            navbar.removeEventListener("mousemove", handleMouseMove);
        }, { once: true });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");
    initHamburger();
    loadHamburger();
    responsiveGradient(navbar);
    responsiveGradient(footer);
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            navbar.style.display = "block";
            navbar.style.opacity = "1";
            hamburger.style.display = "none"; // Hide hamburger ico
        } else {
            loadHamburger();
        }
    });
});