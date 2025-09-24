// Coordinate init functions

import { worker } from "~/canvas-api/api";
import Perlin from "./perlin";

const perlin = new Perlin();

interface Point {
	x: number;
	y: number;
}

type FractalOptions = {
	octaves?: number;
	lacunarity?: number;
	gain?: number;
	normalize?: boolean;
};

export function drawLine(start: Point, target: Point, ctx: any, color: string) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(target.x, target.y);
	ctx.stroke();
}

export function renderTile(
	context: any,
	tile: any,
	tileSize: number,
	color: string
) {
	if (tile.passable) {
		worker(context, tile, tileSize, color);
	} else {
		worker(context, tile, tileSize, color);
	}
}

export function renderTiles(context: any, tiles: any, tileSize: number) {
	tiles.tiles.forEach((tile: any) => {
		if (tile.passable) {
			renderTile(context, tile, tileSize, "rgb(65,152,10)");
		} else {
			renderTile(context, tile, tileSize, "rgb(0,105,148)");
		}
	});
}

export function getNeighbors(tiles: any) {
	const neighborOffsets: Point[] = [
		{ x: -1, y: 0 }, // left
		{ x: 1, y: 0 }, // right
		{ x: 0, y: -1 }, // up
		{ x: 0, y: 1 }, // down
		{ x: -1, y: -1 }, // up-left
		{ x: 1, y: -1 }, // up-right
		{ x: -1, y: 1 }, // down-left
		{ x: 1, y: 1 }, // down-right
	];
	for (const [key, tile] of tiles.entries()) {
		const coords: Point = JSON.parse(key);

		for (const offset of neighborOffsets) {
			const neighborCoords = {
				x: coords.x + offset.x,
				y: coords.y + offset.y,
			};
			const neighbor = tiles.get(JSON.stringify(neighborCoords));
			if (neighbor) {
				tile.neighbors.push(neighbor);
			}
		}
	}
}

export function createTiles(
	c: any,
	tileSize: number,
	threshold: number,
	scale: number,
	fractalOptions: FractalOptions
) {
	const tiles = new Map();
	const passableTiles = [];
	let xKey = 0;

	for (let x = 0; x <= c.width; x += tileSize) {
		let yKey = 0;

		for (let y = 0; y <= c.height; y += tileSize) {
			const value = perlin.fractalNoise(x / scale, y / scale, fractalOptions);
			const passable = value >= threshold;
			const tile = {
				x,
				y,
				passable,
				noiseValue: value,
				neighbors: [],
				location: { x: xKey, y: yKey },
			};
			if (passable) passableTiles.push(tile);
			tiles.set(JSON.stringify({ x: xKey, y: yKey }), tile);
			yKey++;
		}
		xKey++;
	}

	getNeighbors(tiles);

	return {
		tiles,
		passableTiles,
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
