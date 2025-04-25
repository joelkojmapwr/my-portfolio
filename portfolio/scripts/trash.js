document.addEventListener('DOMContentLoaded', () => {
    // Select all image elements on the page
    const images = document.querySelectorAll('img');
    console.log("working");
    const h1 = document.querySelectorAll('h1');

    // Add an event listener to each image
    images.forEach((img) => {
        img.addEventListener('click', (event) => {
            console.log(`Image clicked: ${event.target.src}`);
            // Add your custom logic here
        });
    });

    h1.forEach((h1) => {
        h1.addEventListener('click', (event) => {
            console.log(`H1 clicked: ${event.target.innerText}`);
            event.target.innerText += " - Clicked!";
            // Add your custom logic here
        });
    });

    const section = document.querySelectorAll('section');
    section.forEach((section) => {
        section.addEventListener('click', (event) => {
            console.log(`Section clicked: ${event.target.innerHTML}`);
            event.target.style.backgroundColor = "lightblue";
            // Add your custom logic here
        });
    });
    const newParagraph = document.createElement('p');
    newParagraph.innerText = "This is a new paragraph created dynamically.";

    const projectsSection = document.getElementById("Projekty")
    projectsSection.insertAdjacentElement('afterend', newParagraph);

    var p1 = new Promise(function (resolve, reject) {
        console.log("Promise 1");
        resolve(10);
    });
    var p2 = new Promise(function (resolve, reject) {
        
        resolve(15);
        console.log("Promise 2");
        resolve(20);
    });

    p2.then(function (result) {
        console.log("Promise 2 resolved with value: " + result);
    });
});