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
//Generate new colors
generateBtn.addEventListener('click', randomColors)

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

// For copying the color name
currentHexes.forEach(hex => {
	hex.addEventListener('click', () => {
		copyToClipboard(hex)
	})
})

//Remove the copy popup animation
popup.addEventListener('transitionend', () => {
	const popupBox = popup.children[0]
	popup.classList.remove('active')
	popupBox.classList.remove('active')
})


//Bring slider animation
adjustButton.forEach((button, index) => {
	button.addEventListener('click', () => {
		openAdjustmentPanel(index)
	})
})

//Close slider
closeAdjustments.forEach((button, index) => {
	button.addEventListener("click", () => {
		closeAdjustmentPanel(index);
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

	resetInput()
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
	const noSaturation = color.set("hsl.s", 0)
	const fullSaturation = color.set("hsl.s", 1)
	const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation])

	//Brightness range
	const midBright = color.set("hsl.s", 0.5)
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
		.set("hsl.s", saturation.value)
		.set("hsl.l", brightness.value)
		.set("hsl.h", hue.value)

	colorDivs[index].style.backgroundColor = color

	//Colorize sliders
	colorizeSliders(color, hue, brightness, saturation)
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

//Fixing the sliders pointer
function resetInput() {
	const sliders = document.querySelectorAll(".sliders input");
	sliders.forEach(slider => {
		if (slider.name === "hue") {
			const hueColor = initialColors[slider.getAttribute("data-hue")];
			const hueValue = chroma(hueColor).hsl()[0];
			slider.value = Math.floor(hueValue);
		}
		if (slider.name === "brightness") {
			const brightColor = initialColors[slider.getAttribute("data-bright")];
			const brightValue = chroma(brightColor).hsl()[2];
			slider.value = Math.floor(brightValue * 100) / 100;
		}
		if (slider.name === "saturation") {
			const satColor = initialColors[slider.getAttribute("data-saturation")];
			const satValue = chroma(satColor).hsl()[1];
			slider.value = Math.floor(satValue * 100) / 100;
		}
	});
}


function copyToClipboard(hex) {
	//Create a text area
	const el = document.createElement("textarea");
	el.value = hex.innerText;
	document.body.appendChild(el);
	el.select();

	//Copy from the text area
	document.execCommand("copy");

	//destroy the text area
	document.body.removeChild(el);

	//Pop up animation
	const popupBox = popup.children[0];
	popup.classList.add("active");
	popupBox.classList.add("active");
}


//Slider animation functions
function openAdjustmentPanel(index) {
	sliderContainers[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
	sliderContainers[index].classList.remove("active");
}
randomColors()