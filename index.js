import { Triangle } from './triangle.js';
import { Vertex } from './vertex.js';
import { Parser } from './parser.js';

const canvas = document.getElementsByTagName('canvas')[0];    //get canvas
canvas.width = window.innerWidth;        //set canvas to window height/width
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');      //get context to write on canvas

const fps = 2



document.getElementById('input').addEventListener('change', function () {
    const reader = new FileReader();
    var intervalID;
    reader.onload = function fileReadCompleted() {
        clearInterval(intervalID);

        let parser = new Parser(reader.result);
        let triangles = parser.getTriangles();
        console.log(triangles);
        
        // intervalID = setInterval(render, 1000 / fps);
        render(triangles);
        
    };
    reader.readAsText(this.files[0]);

});

document.addEventListener('keydown', function(event) {
    switch(event.key) {

    }
});


function render(triangles) {
    for (let i = 0; i < triangles.length; i++) {
        let triangle = triangles[i];

        //2D points        
        p1 = perspectiveProject(triangle.v1);
        p2 = perspectiveProject(triangle.v2);
        p3 = perspectiveProject(triangle.v3);

        //[xmin, xmax, ymin, ymax]
        minmax = minMax(p1, p2, p3);

        for (let y = minmax[2]; y <= minmax[3]; y++) {
            
            for (let x = minmax[0]; x <= minmax[1]; x++) {
                
                if (triangleContainsPixel(x, y, p1, p2, p3)) {
                    ctx.fillStyle = "rgb(255, 255, 255)";
                    ctx.fillRect(x, y, 1, 1);
                }


            }
        }


    }
}