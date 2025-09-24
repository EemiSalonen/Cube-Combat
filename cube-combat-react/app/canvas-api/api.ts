import { drawLine } from "~/components/canvas/init/init";

export function worker(
	context: any,
	tile: any,
	size: number,
	color: string,
	fill = true
) {
	context.strokeStyle = color;
	context.fillStyle = color;
	context.beginPath();
	context.rect(tile.x, tile.y, size, size);

	fill ? context.fill() : context.stroke();
}

export function warrior(
	context: any,
	tile: any,
	size: number,
	color: string,
	fill = true
) {
	worker(context, tile, size, color, fill);

	drawLine(
		{ x: tile.x + size, y: tile.y + size },
		{ x: tile.x, y: tile.y },
		context,
		"white"
	);

	drawLine(
		{ x: tile.x, y: tile.y + size },
		{ x: tile.x + size, y: tile.y },
		context,
		"white"
	);

	fill ? context.fill() : context.stroke();
}
