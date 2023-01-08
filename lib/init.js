// Coordinate init functions and mouse position debugger

export function mouseLocation(event) {
	console.log(`x: ${event.clientX}, y: ${event.clientY}`);
}

export function drawField(c, ctx, acc) {
	// x-axis zero index
	const xzi = c.width / 2;
	// y-axis zero index
	const yzi = c.height / 2;
	ctx.strokeStyle = "rgb(230,230,230)";

	// Create x-axis
	ctx.beginPath();
	ctx.moveTo(0, yzi);
	ctx.lineTo(c.width, yzi);
	ctx.stroke();

	// Create y-axis
	ctx.beginPath();
	ctx.moveTo(xzi, 0);
	ctx.lineTo(xzi, c.height);
	ctx.stroke();

	return drawMarks(c, xzi, yzi, acc);
}

export function drawMarks(c, xzi, yzi, acc) {
	const markLength = innerHeight;
	const ctx = c.getContext("2d");
	const xCorr = new Map();
	const yCorr = new Map();

	let currentLoc = 1;

	for (let i = xzi + acc; i < c.width; i += acc) {
		ctx.moveTo(i, yzi + markLength);
		ctx.lineTo(i, yzi - markLength);
		ctx.stroke();

		xCorr.set(currentLoc, i);
		currentLoc++;
	}

	currentLoc = 1;

	for (let i = xzi - acc; i > 0; i -= acc) {
		ctx.moveTo(i, yzi + markLength);
		ctx.lineTo(i, yzi - markLength);
		ctx.stroke();

		xCorr.set(-currentLoc, i);
		currentLoc++;
	}

	currentLoc = 1;

	for (let i = yzi + acc; i < c.height; i += acc) {
		ctx.moveTo(xzi + markLength, i);
		ctx.lineTo(xzi - markLength, i);
		ctx.stroke();

		yCorr.set(-currentLoc, i);
		currentLoc++;
	}

	currentLoc = 1;

	for (let i = yzi - acc; i > 0; i -= acc) {
		ctx.moveTo(xzi + markLength, i);
		ctx.lineTo(xzi - markLength, i);
		ctx.stroke();

		yCorr.set(currentLoc, i);
		currentLoc++;
	}
	xCorr.set(0, xzi);
	yCorr.set(0, yzi);

	return {
		x: xCorr,
		y: yCorr,
		context: ctx,
	};
}
