import { Triangle } from './triangle.js';
import { Vertex } from './vertex.js';

class Parser {
    rawdata;
    
    constructor (rawdata) {
        this.rawdata = rawdata.split("\n");
    }

    get rawdata() {
        return this.rawdata;
    }



    getVertices() {
        let vertices = [];

        for (let i = 0; i < this.rawdata.length; i++) {
            let line = this.rawdata[i].split(" ");
            if (line[0] === "v") {
                vertices.push(new Vertex(line[1], line[2], line[3]));
            }
        }

        return vertices;
    }

    getTriangles() {
        let triangles = [];
        let vertices = this.getVertices();

        for (let i = 0; i < this.rawdata.length; i++) {
            let line = this.rawdata[i].split(" ");
            if (line[0] === "f") {
                triangles.push(new Triangle(vertices[parseInt(line[1].split("/")[0], 10) - 1],
                                       vertices[parseInt(line[2].split("/")[0], 10) - 1],
                                       vertices[parseInt(line[3].split("/")[0], 10) - 1]));
            }
        }

        return triangles;
    }
}

export { Parser };