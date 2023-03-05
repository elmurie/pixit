import { COLORS } from "./colors.js";

const canvas = document.getElementById('drawingBoard');
const ctx = canvas.getContext('2d');

let squareSize = 20;
let numRows = 30;
let numCols = 60;

const widthInput = document.getElementById('grid-width');
const heightInput = document.getElementById('grid-height');
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
    drawGrid(numCols, numRows);
})

function validateNumber(event) {
    let key = event.key;
    // prevent non numerical chars or dashes from being entered
    let numberRegex = /^[-0-9]+$/;
    if (key === '-' || !numberRegex.test(key) || widthInput.value.length >= 2) {
        event.preventDefault();
    }
}

widthInput.addEventListener('input', (event) => {
    validateNumber(event);
    let value = widthInput.value;
    if (value.length > 2) {
        value = value.slice(0, 2);
        widthInput.value = value;
    }
    numCols = value;
    drawGrid(numCols, numRows)
})

heightInput.addEventListener('input', (event) => {
    validateNumber(event);
    let value = heightInput.value;
    if (value.length > 2) {
        value = value.slice(0, 2);
        heightInput.value = value;
    }
    numRows = value;
    drawGrid(numCols, numRows)
})

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

let isColorActive = true;

let isMouseDown = false;

function handleMouseDown(event) {
    isMouseDown = true;
}

function handleMouseUp(event) {
    isMouseDown = false;
}

function handleMouseMove(event) {
    if (isMouseDown && isColorActive) {
        const row = Math.floor(event.offsetY / squareSize);
        const col = Math.floor(event.offsetX / squareSize);
        ctx.fillStyle = chosenColor;
        ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
    }
}

function drawGrid(width, height) {
    
    canvas.setAttribute('width', width * squareSize)
    canvas.setAttribute('height', height * squareSize)
    ctx.fillStyle = '#f3f4f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            ctx.beginPath();
            ctx.rect(j * squareSize, i * squareSize, squareSize, squareSize);
            ctx.strokeStyle = '#dedede';
            ctx.stroke();
        }
    }
}

const colorPicker = document.getElementById('color-picker');

function createPalette() {
    COLORS.forEach((color) => {
        let colorBox = document.createElement('div');
        colorBox.classList.add('color-box')
        colorBox.setAttribute("data-color", color);
        let colorCore;
        colorCore = document.createElement('div');
        colorCore.style.backgroundColor = color;
        colorCore.classList.add('color-core')
        if (color == 'none') {
            let colorIcon = document.createElement('i');
            colorIcon.classList.add('fa-solid');
            colorIcon.classList.add('fa-ban');
            colorIcon.style.color = 'red';
            colorCore.appendChild(colorIcon)
        }
        colorBox.appendChild(colorCore);
        colorPicker.appendChild(colorBox);

        colorBox.addEventListener('click', () => {
            if (color == 'none') {
                isColorActive = false;
            } else {
                isColorActive = true;
            }
            chosenColor = color;
            colorChecker();
        })
    })
}

drawGrid(numCols, numRows)
createPalette();


let chosenColor = '#000';
const colorBoxes = document.querySelectorAll('[data-color]')

function colorChecker() {
    colorBoxes.forEach((colorBox) => {
        let boxColor = colorBox.dataset.color;
        colorBox.classList.remove('active')
        if (chosenColor == boxColor) {
            colorBox.classList.add('active');
        }
    })
}

colorChecker();

let downloadBtn = document.querySelector('[data-download]');

downloadBtn.addEventListener('click', () => {
    downloadBtn.setAttribute('download', 'canvas.jpg');
    downloadBtn.setAttribute('href', canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream"));
})
