import { Parser } from './parser.js';
import { Triangle } from './triangle.js';

class Vertex {
    x;
    y;
    z;

    constructor (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get x() {
        return this.x;
    }


    get y() {
        return this.y;
    }


    get z() {
        return this.z;
    }

}

export { Vertex };