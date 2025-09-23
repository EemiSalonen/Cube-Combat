// Coordinate init functions and mouse position debugger

export function mouseLocation(event: any) {
	console.log(`x: ${event.clientX}, y: ${event.clientY}`);
}

interface Point {
	x: number;
	y: number;
}

export function drawLine(start: Point, target: Point, ctx: any, color: string) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(target.x, target.y);
	ctx.stroke();
}

export function createTiles(c: any, tileSize: number) {
	const tiles = new Map();
	let xKey = 0;

	for (let x = 0; x <= c.width; x += tileSize) {
		let yKey = 0;

		for (let y = 0; y <= c.height; y += tileSize) {
			const tile = { x, y, passable: true };
			tiles.set(JSON.stringify({ x: xKey, y: yKey }), tile);
			yKey++;
		}
		xKey++;
	}
	return {
		tiles,
		getTile(coordinates: Point) {
			return this.tiles.get(JSON.stringify(coordinates));
		},
	};
}

export function drawField(c: any, ctx: any, tileSize: number) {
	const lineColor = "rgb(230,230,230)";

	for (let y = 0; y <= c.height; y += tileSize) {
		const currentStart = { x: 0, y };
		const currentTarget = { x: c.width, y };
		drawLine(currentStart, currentTarget, ctx, lineColor);
	}
	for (let x = 0; x <= c.width; x += tileSize) {
		const currentStart = { x, y: 0 };
		const currentTarget = { x, y: c.height };
		drawLine(currentStart, currentTarget, ctx, lineColor);
	}
}
