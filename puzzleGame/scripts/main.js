import {Field, Board } from "./Field.js";
// import Field from './Field.js';

// 0, 0 is in the top left corner of the game
// indexes are from 0 and last number is empty


var boardWidth = 3
var boardHeight = 3
const defaultImgUrl = "ressources/city.jpg";
var canvas;
var canvasWidth = 700;
var canvasHeight = 700;

function loadImage(fileName) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = fileName;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
}


document.addEventListener("DOMContentLoaded", function() {
    canvas = document.getElementById("puzzleCanvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const board = new Board(boardWidth, boardHeight, canvas);

    const gameImg = loadImage(defaultImgUrl);
    gameImg.then((img) => board.initFields(img)).then(() => board.drawBoard()).catch((err) => {
        console.error("Error loading image: ", err);
    });
});