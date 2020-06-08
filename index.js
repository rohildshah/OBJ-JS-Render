import { Triangle } from './triangle.js';
import { Vertex } from './vertex.js';
import { Parser } from './parser.js';

const canvas = document.getElementsByTagName('canvas')[0];    //get canvas
canvas.width = window.innerWidth;        //set canvas to window height/width
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');      //get context to write on canvas

// const fps = 0.1

var mouse;
var mouseBuffer = new Array(0);
var c = new Vertex(0, 0, 0);
var theta = new Vertex(0, 0, 0);  //yaw, pitch, roll
var e = new Vertex(0, 0, 0.1);
var triangles;

document.getElementById('input').addEventListener('change', function () {
    const reader = new FileReader();
    // var intervalID;
    reader.onload = function readComplete() {
        // clearInterval(intervalID);

        let parser = new Parser(reader.result);
        triangles = parser.getTriangles();
        // console.log(triangles);
        
        // render(triangles);
        // intervalID = setInterval(render, 10000, triangles);
        // render(triangles);
        
    };
    reader.readAsText(this.files[0]);

});

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 65:
        case 37://left
            c.x -= Math.sin((90 - theta.x) * Math.PI / 180.0) * 0.1;
            c.z += Math.cos((90 - theta.x) * Math.PI / 180.0) * 0.1;
            e.x -= Math.sin((90 - theta.x) * Math.PI / 180.0) * 0.1;
            e.z += Math.cos((90 - theta.x) * Math.PI / 180.0) * 0.1;
            break;
        case 87:
        case 38://up
            c.z += Math.cos(theta.y * Math.PI / 180.0) * 0.1;
            c.y += Math.sin(theta.y * Math.PI / 180.0) * 0.1;
            e.z += Math.cos(theta.y * Math.PI / 180.0) * 0.1;
            e.y += Math.sin(theta.y * Math.PI / 180.0) * 0.1;
            break;
        case 68:
        case 39://right
            c.x += Math.sin((90 - theta.x) * Math.PI / 180.0) * 0.1;
            c.z -= Math.cos((90 - theta.x) * Math.PI / 180.0) * 0.1;
            e.x += Math.sin((90 - theta.x) * Math.PI / 180.0) * 0.1;
            e.z -= Math.cos((90 - theta.x) * Math.PI / 180.0) * 0.1;
            break;
        case 83:
        case 40://down
            c.z -= Math.cos(theta.y * Math.PI / 180.0) * 0.1;
            c.y -= Math.sin(theta.y * Math.PI / 180.0) * 0.1;
            e.z -= Math.cos(theta.y * Math.PI / 180.0) * 0.1;
            e.y -= Math.sin(theta.y * Math.PI / 180.0) * 0.1;
            break;
        case 82:
            render(triangles);
            break;
    }
});

document.addEventListener('mousedown', function(event) {
    mouse = true;
});

document.addEventListener('mouseup', function(event) {
    mouse = false;
    mouseBuffer.length = 0;
});

document.addEventListener('mousemove', function(event) {
    if (mouse) {
        mouseBuffer.push([event.x, event.y]);
        if (mouseBuffer.length > 2) {
            mouseBuffer.shift();
        }

        let dyaw = 0;
        let dpitch = 0;
        if (mouseBuffer.length > 1) {
            dyaw = (mouseBuffer[0][0] - mouseBuffer[1][0]) / 10;
            dpitch = (mouseBuffer[0][1] - mouseBuffer[1][1]) / -10;
        }
        theta.x = ((theta.x % 360) + dyaw < 0) ? 360 + ((theta.x % 360) + dyaw) : (theta.x % 360) + dyaw;
        theta.y = ((theta.y % 360) + dpitch < 0) ? 360 + ((theta.y % 360) + dpitch) : (theta.y % 360) + dpitch;
        console.log(theta);
        
    }
});

function perspectiveProject(a) {
    // console.log(theta);
    let x = a.x - c.x;
    let y = a.y - c.y;
    let z = a.z - c.z;

    let cx = Math.cos(theta.x * Math.PI / 180.0);
    let cy = Math.cos(theta.y * Math.PI / 180.0);
    let cz = Math.cos(theta.z * Math.PI / 180.0);

    let sx = Math.sin(theta.x * Math.PI / 180.0);
    let sy = Math.sin(theta.y * Math.PI / 180.0);
    let sz = Math.sin(theta.z * Math.PI / 180.0);

    let dx = (cy * ((sz * y) + (cz * x))) - (sy * z);
    let dy = (sx * ((cy * z) + (sy * ((sz * y) + (cz * x))))) + (cx * ((cz * y) - (sz * x)));
    let dz = (cx * ((cy * z) + (sy * ((sz * y) + (cz * x))))) - (sx * ((cz * y) - (sz * x)));


    let bx = ((e.z * dx) / dz) + e.x;
    let by = ((e.z * dy) / dz) + e.y;

    return new Vertex(bx, by, null);

}


function minMax(p1, p2, p3) {
    let minmax = new Array(4);

    minmax[0] = Math.min(p1.x, p2.x, p3.x);
    minmax[1] = Math.max(p1.x, p2.x, p3.x);
    minmax[2] = Math.min(p1.y, p2.y, p3.y);
    minmax[3] = Math.max(p1.y, p2.y, p3.y);

    return minmax
}

function triangleContainsPixel(x, y, p1, p2, p3) {
    let asX = x - p1.x;
    let asY = y - p1.y;
    let sAB = (p2.x - p1.x) * asY - (p2.y - p1.y) * asX > 0;

    if ((p3.x - p1.x) * asY - (p3.y - p1.x) * asX > 0 == sAB) return false;
    if ((p3.x - p2.x) * (y - p2.y) - (p3.y - p2.y) * (x - p2.x) > 0 != sAB) return false;

    return true;
}


function render(triangles) {
    console.log("render");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < triangles.length; i++) {
        let triangle = triangles[i];

        //2D points        
        let p1 = perspectiveProject(triangle.v1);
        let p2 = perspectiveProject(triangle.v2);
        let p3 = perspectiveProject(triangle.v3);

        //[xmin, xmax, ymin, ymax]
        let minmax = minMax(p1, p2, p3);

        for (let y = minmax[2]; y <= minmax[3]; y += 0.001) {
            for (let x = minmax[0]; x <= minmax[1]; x += 0.001) {

                let shiftx = (x * 1000) + (Math.floor(canvas.width / 2));
                let shifty = (y * 1000) + (Math.floor(canvas.height / 2));

                if (triangleContainsPixel(x, y, p1, p2, p3) && 
                    shiftx > 0 && shiftx < canvas.width &&
                    shifty > 0 && shifty < canvas.height) {

                    ctx.fillStyle = "rgb(255, 255, 255)";
                    ctx.fillRect(shiftx, shifty, 1, 1);
                    // console.log(shiftx, shifty);
                }


            }
        }


    }
}