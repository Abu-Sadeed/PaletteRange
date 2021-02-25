//Variables:
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButton = document.querySelectorAll(".adjust");
const lockButton = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;


//Functions:
//Get a random hex value
function generateHex() {
	const hexColor = chroma.random();
	return hexColor;
}

//Select random colors for each color div
function randomColors() {
	colorDivs.forEach((div, index) => {
		//select hex text and get random color
		const hexText = div.children[0]
		const randomColor = generateHex()

		//assign bg and change hex text
		div.style.backgroundColor = randomColor
		hexText.innerText = randomColor
	})
}

randomColors()