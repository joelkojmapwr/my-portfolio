
function initGallery() {
    const gallery = document.getElementById('Gallery');


    const images = [
        'ressources/joel_in_jerusalem.jpg',
        'ressources/PWR-Racing-Team.jpg',
        'ressources/zeby.jpg',
        'ressources/barania.jpg',
        'https://picsum.photos/700/500?random=1',
        'https://picsum.photos/700/500?random=2',
        'https://picsum.photos/700/500?random=3',
        'https://picsum.photos/700/500?random=4',
        'https://picsum.photos/700/500?random=5',
        'https://picsum.photos/700/500?random=6',
        'https://picsum.photos/700/500?random=7',
        // Add more image paths or URLs here
    ];

    let Promises
    let counter = 0
    Promises = images.map(src => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            let privateId = counter;
            counter++;
            img.src = src;
            img.alt = 'Gallery image';
            img.onload = () => {
                console.log("img " + privateId + " loaded")
                resolve(img);
            } 
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            gallery.appendChild(img);
        });
    });
    Promise.all(Promises).then(function() {
        console.log("all images loaded")
    })
}

function addHoverEffect() {
    const gallery = document.getElementById('Gallery');
    gallery.addEventListener('mouseover', (event) => {
        if (event.target.tagName === 'IMG') {
            event.target.style.transform = 'scale(1.6)';
            event.target.style.transition = 'transform 0.3s ease';
            event.target.style.zIndex = 200;
        }
    });

    gallery.addEventListener('mouseout', (event) => {
        if (event.target.tagName === 'IMG') {
            event.target.style.transform = 'scale(1)';
            event.target.style.zIndex = 100;
        }
    });
}




document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    addHoverEffect();
});