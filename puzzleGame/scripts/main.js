import { Board } from "./Board.js";
import { generateSolvablePermutation } from "./utils.js";


// 0, 0 is in the top left corner of the game
// indexes are from 0 and last number is empty


var boardWidth = 2
var boardHeight = 2
const defaultImgUrl = "ressources/city.jpg";
var customImg = "";
var canvas;
var baseWidth = 700;
var baseHeight = 700;
var canvasWidth = 700;
var canvasHeight = 700;
var board = null;

function loadImage(fileName) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = fileName;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
}

function addUploadButton() {
    var uploadButton = document.getElementById("fileInput");
    var uploadButtonLabel = document.getElementById("fileLabel");
    uploadButton.type = "file";
    uploadButton.accept = "image/*";
    uploadButton.addEventListener("change", function (event) {
        const file = event.target.files[0];
        uploadButtonLabel.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            customImg = img;
        };
        reader.readAsDataURL(file);
    });
    document.body.appendChild(uploadButton);
}

function startGame(img, boardWidth, boardHeight) {
    board = new Board(boardWidth, boardHeight, canvas);
    console.log("Starting game with img sizes: " + img.width + " " + img.height)
    var initCompleted = board.initFields(img).then(() => board.drawBoard()).catch((err) => {
        console.error("Error loading image: ", err);
    });

    initCompleted.then(function () {
        board.addHoverListener();
        board.addClickListener();
        board.randomizeBoard();
        board.drawBoard();
    })
}

function rescaleImage(img, width, height) {
    console.log("width: " + width + "height" + height)
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const scaledImg = new Image();
    scaledImg.src = canvas.toDataURL();
    return scaledImg;
}

async function prepareImg() {
    let img = new Image();
    if (customImg === "") {
        img = await loadImage(defaultImgUrl);
    }
    else {
        img = customImg;
    }
    let width = img.width;
    let height = img.height;
    let newHeight = width * boardHeight / boardWidth;
    if (width / height != boardWidth / boardHeight) {
        console.log("rescaling img")
        img = rescaleImage(img, width, newHeight)
    }
    canvas.width = width;
    canvas.height = newHeight
    return img;
}

function clearBoardIfNeeded() {
    if (board != null) {
        for (let i = 0; i < board.fields.length; i++) {
            board.fields[i].length = 0; // Clear each row
        }
        board.fields.length = 0;
        board.canvas = null;
    }
    const oldCanvas = document.getElementById("puzzleCanvas");
    const newCanvas = oldCanvas.cloneNode(true); // clone with same attributes but NO event listeners

    oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
    canvas = newCanvas;
}

function addStartButton() {
    const form = document.getElementById("gameOptions");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("Form submitted");
        const formData = new FormData(form);

        const rows = formData.get("rows");
        const columns = formData.get("columns");
        boardWidth = columns;
        boardHeight = rows;
        const fileButton = document.getElementById("fileInput")

        const keys = Array.from(formData.keys());
        console.log(keys);
        clearBoardIfNeeded();
        let imgPromise = prepareImg()
        imgPromise.then((img) => startGame(img, boardWidth, boardHeight));
    });

}


document.addEventListener("DOMContentLoaded", function () {
    canvas = document.getElementById("puzzleCanvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    addStartButton();
    addUploadButton();
    // startGame(customImgUrl, boardWidth, boardHeight);

    generateSolvablePermutation(16);
    var button = document.createElement("button");
    button.textContent = "Log Permutation";
    button.addEventListener("click", function () {
        board.logPermutation();
    });
    document.body.appendChild(button);


});

