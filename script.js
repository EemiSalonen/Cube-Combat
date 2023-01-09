import { mouseLocation, drawField } from "./lib/init.js";
import { line, rectangle, triangle } from "./lib/api.js";
import { Rectangle, Food } from "./entities/rectangle.js";

// UI
const rPelem = document.querySelector("#red");
rPelem.style.color = "red";
const bPelem = document.querySelector("#blue");
bPelem.style.color = "blue";
const oPelem = document.querySelector("#orange");
oPelem.style.color = "orange";
const gPelem = document.querySelector("#green");
gPelem.style.color = "green";
const pauseButton = document.querySelector("#pause");
pauseButton.onclick = () => pause(); // Temporary debugging device

let paused = false;
function getAmount(color) {
	let total = 0;
	field.forEach((entity) => {
		if (entity.color === color) total++;
	});
	return total;
}

function pause() {
	paused = !paused;
}

// Canvas setup
const c = document.querySelector("canvas");
c.width = innerWidth;
c.height = innerHeight;

// Debug function to see mouse location when clicking
c.onclick = (e) => mouseLocation(e);

// Draw the coordinates and create pixel-to-coord data. Also defines the 2d context of the canvas which is stored in the correlation object
const corr = drawField(c, c.getContext("2d"), 10);

const redData = { spawnpoint: { x: -90, y: -41 } };
const blueData = { spawnpoint: { x: 90, y: 41 } };
const yellowData = { spawnpoint: { x: -90, y: 40 } };
const greenData = { spawnpoint: { x: 90, y: -40 } };

const square = (id, color, spawn, warrior = false) =>
	new Rectangle(
		corr,
		spawn.spawnpoint.x,
		spawn.spawnpoint.y,
		color,
		2,
		2,
		id,
		warrior
	); // Should test around with the attack and defense values
let field = new Map();

let id = 1;
for (let i = 0; i < 1; i++) {
	field.set(id, square(id, "red", redData));
	id++;
	field.set(id, square(id, "blue", blueData));
	id++;
	field.set(id, square(id, "orange", yellowData));
	id++;
	field.set(id, square(id, "green", greenData));
}

console.log(field);

field.forEach((entity) => entity.draw());

const intervalId = setInterval(() => {
	corr.context.clearRect(0, 0, c.width, c.height);
	drawField(c, c.getContext("2d"), 10);

	field.forEach((entity) => {
		const deletable = entity.checkSurroundings(field);

		if (!field.get("red")) {
			field.set(
				"red",
				new Food(
					corr,
					Math.floor((Math.random() - 0.5) * 40),
					Math.floor((Math.random() - 0.5) * 40),
					"brown",
					"red"
				)
			);
		}

		if (!field.get("blue")) {
			field.set(
				"blue",
				new Food(
					corr,
					Math.floor((Math.random() - 0.5) * 40),
					Math.floor((Math.random() - 0.5) * 40),
					"brown",
					"blue"
				)
			);
		}

		if (!field.get("orange")) {
			field.set(
				"orange",
				new Food(
					corr,
					Math.floor((Math.random() - 0.5) * 40),
					Math.floor((Math.random() - 0.5) * 40),
					"brown",
					"orange"
				)
			);
		}

		if (!field.get("green")) {
			field.set(
				"green",
				new Food(
					corr,
					Math.floor((Math.random() - 0.5) * 40),
					Math.floor((Math.random() - 0.5) * 40),
					"brown",
					"green"
				)
			);
		}

		if (typeof deletable === "object") {
			id++;

			if (deletable.color === "red") {
				field.set(
					id,
					square(
						id,
						deletable.color,
						redData,
						Math.floor(Math.random() + 0.5) === 1 ? true : false
					)
				);
			} else if (deletable.color === "blue") {
				field.set(
					id,
					square(
						id,
						deletable.color,
						blueData,
						Math.floor(Math.random() + 0.5) === 1 ? true : false
					)
				);
			} else if (deletable.color === "orange") {
				field.set(
					id,
					square(
						id,
						deletable.color,
						yellowData,
						Math.floor(Math.random() + 0.5) === 1 ? true : false
					)
				);
			} else {
				field.set(
					id,
					square(
						id,
						deletable.color,
						greenData,
						Math.floor(Math.random() + 0.5) === 1 ? true : false
					)
				);
			}

			field.delete(deletable.food);
		} else {
			field.delete(deletable);
		}
	});

	field.forEach((entity) => entity.draw());

	// UI element refresh
	rPelem.innerHTML = getAmount("red");
	bPelem.innerHTML = getAmount("blue");
	oPelem.innerHTML = getAmount("orange");
	gPelem.innerHTML = getAmount("green");

	if (paused) clearInterval(intervalId);
}, 100);
