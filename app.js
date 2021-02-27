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


//Event listeners:
//sliders
sliders.forEach(slider => {
	slider.addEventListener('input', hslControls)
})

//Updating text after customization
colorDivs.forEach((div, index) => {
	div.addEventListener('change', () => {
		updateHexText(index)
	})
})


//Functions:
//Get a random hex value
function generateHex() {
	const hexColor = chroma.random();
	return hexColor;
}

//Select random colors for each color div
function randomColors() {
	initialColors = []
	colorDivs.forEach((div, index) => {
		//select hex text and get random color
		const hexText = div.children[0]
		const randomColor = generateHex()

		//add to array
		initialColors.push(chroma(randomColor).hex())

		//assign bg and change hex text
		div.style.backgroundColor = randomColor
		hexText.innerText = randomColor

		//Check contrast
		checkTextContrast(randomColor, hexText)

		//Colorized sliders
		const color = chroma(randomColor)
		const sliders = div.querySelectorAll('.sliders input')
		const hue = sliders[0]
		const brightness = sliders[1]
		const saturation = sliders[2]

		colorizeSliders(color, hue, brightness, saturation)
	})
}

//Set contrast in bg and hex text
function checkTextContrast(color, text) {

	const luminance = chroma(color).luminance()

	if (luminance > 0.5) {
		text.style.color = "black";
	} else {
		text.style.color = "white";
	}

}

//Changing sliders attributes based on the parent div
function colorizeSliders(color, hue, brightness, saturation) {
	//Saturation range
	const noSaturation = color.set('hsl.s', 0)
	const fullSaturation = color.set('hsl.s', 1)
	const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation])

	//Brightness range
	const midBright = color.set('hsl.s', 0.5)
	const scaleBrightness = chroma.scale(['black', midBright, 'white'])

	//Update input colors for sliderContainers
	saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(0)}, ${scaleSaturation(1)})`
	brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0)}, ${scaleBrightness(0.5)}, ${scaleBrightness(1)})`

	//Hue is custom as it is constant
	hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}


function hslControls(e) {
	//getting data types for the sliders
	const index = e.target.getAttribute('data-bright') || e.target.getAttribute('data-hue') || e.target.getAttribute('data-saturation')

	let sliders = e.target.parentElement.querySelectorAll('input[type="range"]')
	const hue = sliders[0]
	const brightness = sliders[1]
	const saturation = sliders[2]

	const bgColor = initialColors[index]

	//Sliders functionality
	let color = chroma(bgColor)
		.set('hsl.s', saturation.value)
		.set('hsl.s', brightness.value)
		.set('hsl.s', hue.value)

	colorDivs[index].style.backgroundColor = color
}

function updateHexText(index) {
	const activeDiv = colorDivs[index]
	const color = chroma(activeDiv.style.backgroundColor)
	const textHex = activeDiv.querySelector('h2')
	const icons = activeDiv.querySelectorAll('.controls button')
	textHex.innerText = color.hex()

	//Check contrast
	checkTextContrast(color, textHex)

	for (icon of icons) {
		checkTextContrast(color, icon)
	}
}

randomColors()