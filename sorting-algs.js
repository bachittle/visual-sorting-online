import {init, animate} from './canvas.js';
import {shuffle, sleep} from './utils.js';

let time = 30;
var speedInput = document.getElementById('speed');
speedInput.onchange = function() {
    time = 200 - Math.floor(Math.abs(+speedInput.value)) * 2;
    console.log("time: "+time);
}


// function that has to be run after every iteration in the sorting algorithm
// ex: in bubble sort, the inner for loop should run this for the best looking visuals
function iterationUpdate(visuals, i, option, j) {
    init(option.val);
    if (visuals[option.val])
        if (i < visuals[option.val].length && i >= 0) {
            if (j) {
                visuals[option.val][j].color = 'blue';
            }
            visuals[option.val][i].color = 'red';
        }
    animate();
    return new Promise(resolve => setTimeout(resolve, time));
}

// Will comment this function for template. Use this as reference for making a new function
// sorting algorithms

// must be async so it can pause execution on the set interval in iterationUpdates returned promise
async function mattSort(numArr, visuals, option) {
    for (let i = 0; i < numArr.length;) {
        if (option.val === 'stop') break;
        if (numArr[i] > numArr[i + 1]) {
            let x = numArr[i];
            numArr[i] = numArr[i + 1];
            numArr[i + 1] = x;
            // animate just the swaps when array size is large
            if (numArr.length >= 200){
                // waits for a returned promise, which is a timeout for the set time variable
                await iterationUpdate(visuals, i, option);
            }
            i = -1;
        }
        i++;
        // animate minor details when array is small. Don't do so when array is larger, just animate swaps for performance
        if (numArr.length < 200){
            // waits for a returned promise, which is a timeout for the set time variable
            await iterationUpdate(visuals, i, option);
        }
    }
    // return a promise for canvas to use
    return new Promise((resolve, reject) => {resolve()});
}

async function bubbleSort(numArr, visualArr, option) {
    for (let i = 0; i < numArr.length; i++) {
        for (let j = numArr.length - 1; j >= i;) {
            if (option.val === 'stop') break;
            if (numArr[j-1] > numArr[j]) {
                let x = numArr[j];
                numArr[j] = numArr[j - 1]; 
                numArr[j-1] = x;
            }
            j--;
            await iterationUpdate(visualArr, j, option);
        }
    }
    return new Promise((resolve, reject) => {resolve()});
}

async function selectionSort(numArr, visualArr, option) {
    for (let i = 0; i < numArr.length-1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < numArr.length; j++) {
            if (option.val === 'stop') break;
            if (numArr[j] < numArr[minIndex]) {
                minIndex = j;
            }
            if (numArr.length <= 600) {
                await iterationUpdate(visualArr, j, option, minIndex);
            }
        }
        if (numArr.length > 600) {
            await iterationUpdate(visualArr, i, option);
            await sleep(500);
        }
        let x = numArr[i];
        numArr[i] = numArr[minIndex]; 
        numArr[minIndex] = x;
    }
    return new Promise((resolve, reject) => {resolve()});
}

async function partition(items, visualArr, option, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;

    while (i <= j) {
        if (option.val === 'stop') return new Promise((resolve, reject) => {resolve()});
        while (items[i] < pivot) {
            // lower unnecessary draws for speed at larger values
            if (items.length <= 200) {
                await iterationUpdate(visualArr, i, option);
            }
            i++;
        }
        while (items[j] > pivot) {
            // lower unnecessary draws for speed at larger values
            if (items.length <= 200) {
                await iterationUpdate(visualArr, j, option);
            }
            j--;
        }
        if (i <= j) {
            let x = items[i];
            items[i] = items[j]; 
            items[j] = x;
            i++;
            j--;
        }
        if (time !== 0)
        await iterationUpdate(visualArr, i, option);
    }
    if (time === 0)
    await iterationUpdate(visualArr, i, option);

    return i;
}

async function quickSort(items, visualArr, option, left=0, right=items.length - 1) {

    let index;

    if (items.length > 1) {

        index = await partition(items, visualArr, option, left, right);

        if (option.val === 'stop') return new Promise((resolve, reject) => {resolve()});
        if (left < index - 1) {
            // even more efficiencies at larger values
            if (items.length <= 400) {
                await quickSort(items, visualArr, option, left, index - 1);
            }
            else {
                quickSort(items, visualArr, option, left, index - 1);
            }
        }

        if (index < right) {
            // even more efficiencies at larger values
            if (items.length <= 400) {
                await quickSort(items, visualArr, option, index, right);
            }
            else {
                quickSort(items, visualArr, option, index, right);
            }
        }

    }

    return items;
}

async function insertionSort(numArr, visualArr, option) {
    for (let i = 0; i < numArr.length; i++) {
        for (let j = 0; j < i; j++) {
            if (numArr[i] < numArr[j]) {
                if (option.val === 'stop') 
                    return new Promise((resolve, reject) => {resolve()});

                let x = numArr[i];
                numArr[i] = numArr[j];
                numArr[j] = x;

                // lower the amount of draws to swaps only for speed
                if (numArr.length > 200 && time !== 0) {
                    await iterationUpdate(visualArr, j, option, i);
                }
            }
            
        }
        if (numArr.length <= 200 || time === 0) {
            await iterationUpdate(visualArr, i, option);
        }
    }
}

async function bogoSort(numArr, visualArr, option) {
    for (let i = 0; i < numArr.length; i++) {
        if (option.val === 'stop') break;
        if (numArr[i] > numArr[i+1]) {
            shuffle(numArr);
            i = -1;
        }
        await iterationUpdate(visualArr, i, option);
    }
    return new Promise((resolve, reject) => {resolve()});
}

export {mattSort, bogoSort, bubbleSort, selectionSort, quickSort, insertionSort};