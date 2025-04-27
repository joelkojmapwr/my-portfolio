import { Field } from './Field.js';
import { generateSolvablePermutation } from "./utils.js";

class Board {
    constructor(width, height, canvas) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.fields = Array.from({ length: width }, () => Array(height).fill(null));
        this.emptyIndex = [0, 0];
        this.pieceSize = canvas.width / width;
        console.log("canvas size", canvas.width, canvas.height);
        console.log("board size", width, height);
        console.log("piece size", this.pieceSize);
        console.log(this.width, this.height);
    }

    initFields(gameImg) {
        return new Promise((resolve) => {
            const workingCanvas = document.createElement('canvas');
            const ctx = workingCanvas.getContext('2d');
            workingCanvas.width = gameImg.width;
            workingCanvas.height = gameImg.height;

            ctx.drawImage(gameImg, 0, 0);

            const pieceWidth = gameImg.width / this.width;
            const pieceHeight = gameImg.height / this.height;
            this.pieceSize = pieceWidth;
            console.log(this.width, this.height);
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    if (i === j && j === 0) {
                        // leave empty space
                        continue;
                    }
                    const pieceCanvas = document.createElement('canvas');
                    const pieceCtx = pieceCanvas.getContext('2d');
                    pieceCanvas.width = pieceWidth;
                    pieceCanvas.height = pieceHeight;

                    pieceCtx.drawImage(
                        workingCanvas,
                        j * pieceWidth,
                        i * pieceHeight,
                        pieceWidth,
                        pieceHeight,
                        0,
                        0,
                        pieceWidth,
                        pieceHeight
                    );

                    const pieceImg = new Image();
                    pieceImg.src = pieceCanvas.toDataURL();
                    this.fields[j][i] = new Field(i * this.width + j, pieceImg, j, i);
                    console.log("inited field", j, i);
                }
            }
            resolve();
        });
    }

    fieldsToSavable(fields) {
        const flatFields = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
            flatFields.push(this.fields[x][y]);
        }
        }
        const serializedFields = [];
        for (let i = 0; i < flatFields.length; i++) {
            if (flatFields[i] === null) {
                serializedFields.push(null);
                continue;
            }
            serializedFields.push(flatFields[i] ? {
            id: flatFields[i].id,
            imgBase64: flatFields[i].img.src,
            x: flatFields[i].x,
            y: flatFields[i].y
        } : null);
        }
        return serializedFields;
    }

    saveToLocalStorage() {
        localStorage.setItem('width', this.width);
        localStorage.setItem('height', this.height);
        localStorage.setItem('canvasWidth', this.canvas.width);
        localStorage.setItem('canvasHeight', this.canvas.height);
        localStorage.setItem('fields', JSON.stringify(this.fieldsToSavable(this.fields)));
    }

    loadFieldsFromLocalStorage() {
        const fields = localStorage.getItem('fields');
        if (fields) {
            const parsedFields = JSON.parse(fields);

            for (let i = 0; i < parsedFields.length; i++) {
                if (parsedFields[i] === null) {
                    this.fields[i%this.width][Math.floor(i/this.width)] = null;
                    this.emptyIndex = [Math.floor(i%this.width), Math.floor(i/this.width)];
                    continue;
                }
                const img = new Image();
                img.src = parsedFields[i].imgBase64;
                console.log("initing field ", i%this.width, "  ",i/this.width)
                this.fields[i%this.width][Math.floor(i/this.width)] = new Field(parsedFields[i].id, img, parsedFields[i].x, parsedFields[i].y);
                console.log(this.fields);
            }
        }
        console.log("Empty index: ", this.emptyIndex);
    }


    drawBoard() {
        this.canvas.style.backgroundColor = "blue";
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const pieceWidth = this.canvas.width / this.width;
        const pieceHeight = this.canvas.height / this.height;


        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.fields[i][j] === null) {
                    // leave empty space
                    // console.log("empty space");
                    continue;
                }
                const piece = this.fields[i][j];
                ctx.strokeStyle = "black";
                ctx.lineWidth = 5;
                // ctx.strokeRect(piece.x * pieceWidth, piece.y * pieceHeight, pieceWidth, pieceHeight);
                ctx.drawImage(piece.img, piece.x * pieceWidth, piece.y * pieceHeight, pieceWidth, pieceHeight);
                // console.log(piece.x, piece.y);
            }
        }
    }

    isWon() {
        console.log("Checking if won")
        const flatFields = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
            flatFields.push(this.fields[x][y]);
            }
        }
        if (flatFields[0] != null) {
            console.log("Null on bad position")
            return false;
        }
        for (let i = 1; i < flatFields.length; i++){
            if (flatFields[i].id != i){
                console.log("field " + flatFields[i].id + " is on position " + i)
                return false;
            }
        }
        return true;
    }

    highlightField(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError("Coordinates out of bounds");
        }
        const ctx = this.canvas.getContext('2d');

        ctx.strokeStyle = "lightblue";
        ctx.lineWidth = 5;
        ctx.strokeRect(x * this.pieceSize, y * this.pieceSize, this.pieceSize, this.pieceSize);
    }

    clearAndRedrawCanvas() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBoard();
    }

    moveField(oldX, oldY, duration = 300) {
        console.log("move field", oldX, oldY);
        // console.log(this.fields[oldX][oldY]);
        if (typeof oldX !== 'number' || typeof oldY !== 'number') {
            throw new TypeError("newX and newY must be numbers");
        }
        if (this.fields[oldX][oldY] === null) {
            return;
        }
        if (this.fields[oldX][oldY].isNeighbour(this.emptyIndex[0], this.emptyIndex[1]) === false) {
            console.warn("Field is not a neighbour of empty space");
            return;
        }
        

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error("Failed to get canvas context.");
        }

        const startX = oldX;
        const startY = oldY;
        const deltaX = this.emptyIndex[0] - startX;
        const deltaY = this.emptyIndex[1] - startY;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = startX + deltaX * progress;
            const currentY = startY + deltaY * progress;

            context.clearRect(oldX * this.pieceSize, oldY * this.pieceSize, this.pieceSize, this.pieceSize);
            context.drawImage(this.fields[oldX][oldY].img, currentX * this.pieceSize, currentY * this.pieceSize);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.fields[this.emptyIndex[0]][this.emptyIndex[1]] = this.fields[oldX][oldY];
                this.fields[this.emptyIndex[0]][this.emptyIndex[1]].x = this.emptyIndex[0];
                this.fields[this.emptyIndex[0]][this.emptyIndex[1]].y = this.emptyIndex[1];
                this.emptyIndex = [oldX, oldY];
                
                this.fields[oldX][oldY] = null;
                if (this.isWon()){
                    // print message you won
                    setTimeout(() => {
                        alert("Congratulations! You won!");
                    }, 100);
                }
                this.saveToLocalStorage();
            }
        };

        requestAnimationFrame(animate);
    }

    shuffleTwoRandomIndices(permutation) {
        if (!Array.isArray(permutation)) {
            throw new TypeError("Permutation must be an array");
        }

        const nonNullIndices = permutation
            .map((value, index) => (value !== null ? index : null))
            .filter(index => index !== null);

        if (nonNullIndices.length < 2) {
            throw new Error("Not enough elements to shuffle");
        }

        const [index1, index2] = nonNullIndices
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);

        [permutation[index1], permutation[index2]] = [permutation[index2], permutation[index1]];
    }

    randomizeBoard() {
        const isSolvable = (permutation) => {
            let inversions = 0;
            for (let i = 1; i < permutation.length; i++) {
            for (let j = i + 1; j < permutation.length; j++) {
                if (permutation[i] !== null && permutation[j] !== null && permutation[i] > permutation[j]) {
                inversions++;
                }
            }
            }
            console.log("Inversions: ", inversions);
            if (this.width % 2 === 1) {
            // Odd width: solvable if inversions are even
            return inversions % 2 === 0;
            } else {
            // Even width: solvable if inversions + row index of empty space is odd
            const emptyRow = this.height -1 - Math.floor(permutation.indexOf(null) / this.width);
            console.log("empty row: " + emptyRow)
            return (inversions + emptyRow) % 2 === 1;
            }
        };

        let permutation = generateSolvablePermutation(this.width * this.height);
        while (!isSolvable(permutation)) {
            permutation = generateSolvablePermutation(this.width * this.height);
        }
        console.log("Generated solvable permutation: ", permutation);

        const flatFields = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
            flatFields.push(this.fields[x][y]);
            }
        }

        let index = 1;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                // console.log(index, j, i)
            if (i === 0 && j === 0) {
                this.fields[j][i] = null;
            } else {
                this.fields[j][i] = flatFields[permutation[index]];
                this.fields[j][i].x = j;
                this.fields[j][i].y = i;
                this.fields[j][i].id = permutation[index];
                console.log(permutation[index])
                index++;
            }
            }
        }
        this.emptyIndex = [0, 0];
    }

    logPermutation() {
        const permutation = [];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
            permutation.push(this.fields[j][i] ? this.fields[j][i].id : null);
            }
        }
        console.log("Permutation: ", permutation);
    }

    addHoverListener() {
        // console.log("add hover listener");
        this.canvas.addEventListener('mousemove', (event) => {
            // console.log("mouse move");
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) / this.pieceSize);
            const y = Math.floor((event.clientY - rect.top) / this.pieceSize);
            
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                if (this.fields[x][y] === null) {
                    // Leave empty space
                    this.clearAndRedrawCanvas();
                    return;
                }
                if (this.fields[x][y].isNeighbour(this.emptyIndex[0], this.emptyIndex[1])) {
                    // this piece can be moved so highlight it
                    this.highlightField(x, y);
                }
                else {
                    this.clearAndRedrawCanvas();
                }
            }
            else {
                // Clear the canvas if the mouse is outside the board
                this.clearAndRedrawCanvas();
            }
        });
        this.canvas.addEventListener('mouseleave', () => {
            // Clear the canvas when the mouse leaves the board
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawBoard();
        });
    }

    addClickListener() {
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) / this.pieceSize);
            const y = Math.floor((event.clientY - rect.top) / this.pieceSize);
            console.log(this.pieceSize ,"click")
            console.log("click", x, y);
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                if (this.fields[x][y] === null) {
                    // Leave empty space
                    return;
                }
                this.moveField(x, y);
            }
        });
    }
}

export { Board };