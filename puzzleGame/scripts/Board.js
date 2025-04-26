import { Field } from './Field.js';


class Board {
    constructor(width, height, canvas) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.fields = Array.from({ length: width }, () => Array(height).fill(null));
        this.emptyIndex = [0, 0];
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

            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
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
                }
            }
            resolve();
        });
    }

    drawBoard() {
        this.canvas.style.backgroundColor = "lightgray";
        const ctx = this.canvas.getContext('2d');
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
        console.log(this.fields[oldX][oldY]);
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

            }
        };

        requestAnimationFrame(animate);
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