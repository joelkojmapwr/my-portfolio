class Field {
    constructor(id, img, x, y) {
        this.id = id
        this.img = img
        this.x = x
        this.y = y
    }

    static canvas = null; // Initialize canvas to null

    static setCanvas(canvas) {
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new TypeError("Expected instance of HTMLCanvasElement")
        }
        Field.canvas = canvas;
    }

    isNeighbour(x, y) {
        if (Math.abs(this.x - x) == 1 && this.y == y) {
            // horizontal neighbours
            return true;
        }
        if (Math.abs(this.y - y) == 1 && this.x == x) {
            // vertical neighbours
            return true;
        }
        return false;
    }

    moveTo(newX, newY, duration = 300) {
        if (typeof newX !== 'number' || typeof newY !== 'number') {
            throw new TypeError("newX and newY must be numbers");
        }

        if (!Field.canvas) {
            throw new Error("Canvas is not set. Use Field.setCanvas() to set it.");
        }

        const context = Field.canvas.getContext('2d');
        if (!context) {
            throw new Error("Failed to get canvas context.");
        }

        const startX = this.x;
        const startY = this.y;
        const deltaX = newX - startX;
        const deltaY = newY - startY;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = startX + deltaX * progress;
            const currentY = startY + deltaY * progress;

            context.clearRect(0, 0, Field.canvas.width, Field.canvas.height);
            context.drawImage(this.img, currentX * this.img.width, currentY * this.img.height);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.x = newX;
                this.y = newY;
            }
        };

        requestAnimationFrame(animate);
    }

}

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
                    this.fields[i][j] = new Field(i * this.width + j, pieceImg, j, i);
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


    addHoverListener() {
        // console.log("add hover listener");
        this.canvas.addEventListener('mousemove', (event) => {
            // console.log("mouse move");
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) / this.pieceSize);
            const y = Math.floor((event.clientY - rect.top) / this.pieceSize);
            
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                if (this.fields[y][x] === null) {
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
}

export { Field, Board };