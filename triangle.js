import { Parser } from './parser.js';
import { Vertex } from './vertex.js';

class Triangle {
    v1;
    v2;
    v3;
    vertices;

    constructor (v1, v2, v3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.vertices = [v1, v2, v3];
    }

    get vertices () {
        return vertices;
    }

    get v1 () {
        return v1;
    }

    get v2 () {
        return v2;
    }

    get v3 () {
        return v3;
    }


}

export { Triangle };