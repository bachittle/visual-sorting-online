/* Name: Bailey Chittle
 * Date: June 17 2019
 * Program description: Canvas boilerplate copied from chriscourse. Used for pretty much every canvas project. 
 */

import {shuffle, getHexColor} from './utils.js'
import {mattSort, bogoSort, bubbleSort, selectionSort, quickSort, insertionSort} from './sorting-algs.js'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = (innerWidth * 0.98 < 800) ? innerWidth * 0.98 : 800;
    canvas.height = innerHeight * 0.85;
}
setCanvasSize();

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

// Event Listeners
window.addEventListener('mousemove', event => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

window.addEventListener('resize', () => {
    setCanvasSize();
    ctx.font = "25px Arial";
    init();
    animate();
});

let sizeOfArr = 30;

class Bar {
    constructor(x, y, height, width=5, color='black') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        if (sizeOfArr < 500) {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    update() {
        this.draw();
    }
}

class Line {
    constructor(x, y, height, width=5, color='black') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        // see each action with a different colored box
        if (sizeOfArr <= 200) {
            if (this.color !== 'black') {
                ctx.fillRect(this.x - this.width / 5, this.y - this.height / 5, this.width * 1.5, this.height * 1.5);
            }
            else {
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        else {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    update() {
        this.draw();
    }
}

let numArray1 = [];
let numArray2 = [];
function initializeNumArray(arr) {
    for(let i = 0; i < sizeOfArr; i++) {
        arr[i] = i+1;
    }
}

initializeNumArray(numArray1);
initializeNumArray(numArray2);

let visuals = {v1: [], v2: []};

// graphicOption options: barchart, line
let graphicOption = "barchart";

function init(name="both") {
    const itemWidth = canvas.width * 0.48 / (sizeOfArr);
    const itemHeight = canvas.height * 0.9 / sizeOfArr;
    if (name==='v1' || name==='both')
        visuals.v1 = [];
    if (name==='v2' || name==='both')
        visuals.v2 = [];
    let j1, j2;
    for (let i = 0; i < sizeOfArr; i++) {
        switch (graphicOption) {
            case "barchart":
                if (name==='v1' || name==='both') {
                    j1 = numArray1[i] * itemHeight;
                    visuals.v1.push(new Bar(i * itemWidth*0.9 + 10, canvas.height - j1, j1, itemWidth));
                }
                if (name==='v2' || name==='both') {
                    j2 = numArray2[i] * itemHeight;
                    visuals.v2.push(new Bar(i * itemWidth*0.9 + itemWidth * (sizeOfArr+(sizeOfArr/20)), canvas.height - j2, j2, itemWidth));
                }
                break;
            case "line":
                if (name==='v1' || name==='both') {
                    j1 = numArray1[i] * itemHeight;
                    visuals.v1.push(new Line(i * itemWidth + 10, canvas.height - j1, itemHeight, itemWidth));
                }
                if (name==='v2' || name==='both') {
                    j2 = numArray2[i] * itemHeight;
                    visuals.v2.push(new Line(i * itemWidth + itemWidth * (sizeOfArr+(sizeOfArr/20)), canvas.height - j2, itemHeight, itemWidth));
                }
                break;
            case "circleline":
                if (name==='v1' || name==='both') {
                    visuals.v1.push(new Line(Math.cos((i / sizeOfArr)*(2 * Math.PI)) * (canvas.width/5) + canvas.width * 0.22, Math.sin((numArray1[i]/sizeOfArr)*(2 * Math.PI)) * (canvas.width / 5) + 300, itemHeight, itemWidth));
                }
                if (name==='v2' || name==='both') {
                    j2 = numArray2[i] * itemHeight;
                    visuals.v2.push(new Line(Math.cos((i / sizeOfArr)*(2 * Math.PI)) * (canvas.width/5) + canvas.width * 0.72, Math.sin((numArray2[i]/sizeOfArr)*(2 * Math.PI)) * (canvas.width / 5) + 300, itemHeight, itemWidth));
                }
                break;
            case "colorline":
                if (name==='v1' || name==='both') {
                    visuals.v1.push(new Bar(i * itemWidth*0.9 + 10, canvas.height - canvas.height * 0.9, canvas.height * 0.9, itemWidth, getHexColor(numArray1[i] / sizeOfArr)));
                }
                if (name==='v2' || name==='both') {
                    visuals.v2.push(new Bar(i * itemWidth*0.9 + itemWidth * (sizeOfArr+(sizeOfArr/20)), canvas.height - canvas.height * 0.9, canvas.height * 0.9, itemWidth, getHexColor(numArray2[i] / sizeOfArr)));
                }
                break;

        }
    }
}



// option is an object so that it can be passed by reference and changed here
// it is used in shuffleArray when wanting to stop execution of any functions
// and it is used in sortArray so that the sorting function knows what array it is
// acting upon


// UI event handlers
let sort1 = document.getElementById('sort1').value;
let sort2 = document.getElementById('sort2').value;

let option1 = {};
let option2 = {};

function shuffleNumArrays() {
    option1.val = 'stop';
    option2.val = 'stop';
    shuffle(numArray1);
    numArray2 = [];
    numArray1.forEach(x => {
        numArray2.push(x);
    });
    init();
    animate();
}

document.getElementById('sort1').onchange = function() {
    option1.val = 'stop';
    option2.val = 'stop';
    sort1 = document.getElementById('sort1').value;
    animate();
}
document.getElementById('sort2').onchange = function() {
    option1.val = 'stop';
    option2.val = 'stop';
    sort2 = document.getElementById('sort2').value;
    animate();
}
document.getElementById('shuffleArray').onclick = function() {
    shuffleNumArrays();
};

var graphicOptionElement = document.getElementById('graphicOption');
graphicOptionElement.onchange = function() {
    graphicOption = graphicOptionElement.value;
    init();
    animate();
}

var numOfArrInput = document.getElementById('numOfArr')
numOfArrInput.onchange = function() {
    option1.val = 'stop';
    option2.val = 'stop';
    sizeOfArr = Math.floor(Math.abs(+numOfArrInput.value));
    console.log(sizeOfArr);
    numArray1 = [];
    numArray2 = [];
    initializeNumArray(numArray1);
    initializeNumArray(numArray2);
    init();
    animate();
}

let initSortValues = {sort1, sort2};
async function sortArray(sort, numArray, option) {
    switch(sort) {
        case 'mattSort':
            await mattSort(numArray, visuals, option);
            break;
        case 'bubbleSort':
            await bubbleSort(numArray, visuals, option);
            break;
        case 'selectionSort':
            await selectionSort(numArray, visuals, option);
            break;
        case 'quickSort':
            numArray = await quickSort(numArray, visuals, option);
            break;
        case 'insertionSort':
            await insertionSort(numArray, visuals, option);
            break;
        case 'bogoSort':
            await bogoSort(numArray, visuals, option);
            break;
    }
    init(option.val);
    animate();
}
document.getElementById("sortArray").onclick = async function() {
    if (option1.val === 'v1') {
        shuffleNumArrays();
    }
    option1.val = 'v1';
    option2.val = 'v2';
    //console.log(option1);
    //console.log(option2);
    
    sortArray(sort1, numArray1, option1);
    sortArray(sort2, numArray2, option2);
}


ctx.font = "25px Arial";
// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ctx.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);
    
    ctx.fillStyle = "black";     // this may be inefficient but it fixes a text colouring bug
    ctx.fillText(sort1, 10, 30);
    visuals.v1.forEach(object => {
      object.update();
    });
    ctx.fillText(sort2, canvas.width / 2 + 10, 30);
    visuals.v2.forEach(object => {
      object.update();
    });
}

init();
animate();

export {init, animate}