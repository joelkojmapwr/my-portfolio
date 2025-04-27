class Field {
    constructor(id, img, x, y) {
        console.log("Creating field with id: " + id + " img: " + img + " x: " + x + " y: " + y);
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

}


export { Field };