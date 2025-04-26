/*global console, document, window */


function initGallery() {
    const gallery = document.getElementById("Gallery");

    const images = [
        "ressources/joel_in_jerusalem.jpg",
        "ressources/PWR-Racing-Team.jpg",
        "ressources/zeby.jpg",
        "ressources/barania.jpg",
        "https://picsum.photos/700/500?random=1",
        "https://picsum.photos/700/500?random=2",
        "https://picsum.photos/700/500?random=3",
        "https://picsum.photos/700/500?random=4",
        "https://picsum.photos/700/500?random=5",
        "https://picsum.photos/700/500?random=6",
        "https://picsum.photos/700/500?random=7"
        // Add more image paths or URLs here
    ];

    let counter = 0;
    const promises = images.map(function (src) {
        return new Promise(function (resolve, reject) {
            const img = document.createElement("img");
            const privateId = counter;
            counter += 1;
            img.src = src;
            img.alt = "Gallery image";
            img.onload = function () {
                console.log("img " + privateId + " loaded");
                resolve(img);
            };
            img.onerror = function () {
                reject(new Error("Failed to load image: " + src));
            };
            gallery.appendChild(img);
        });
    });

    Promise.all(promises).then(function () {
        console.log("all images loaded");
    });
}

function addHoverEffect() {
    const gallery = document.getElementById("Gallery");
    gallery.addEventListener("mouseover", function (event) {
        if (event.target.tagName === "IMG") {
            event.target.style.transform = "scale(1.6)";
            event.target.style.transition = "transform 0.3s ease";
            event.target.style.zIndex = "200";
        }
    });

    gallery.addEventListener("mouseout", function (event) {
        if (event.target.tagName === "IMG") {
            event.target.style.transform = "scale(1)";
            event.target.style.zIndex = "100";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initGallery();
    addHoverEffect();
});