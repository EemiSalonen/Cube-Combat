import React, { useEffect, useRef, useState } from "react";
import { createTiles, drawField, renderTiles } from "./init/init";
import { Food, Rectangle } from "~/entities/rectangle";
import {
	FRACTAL_OPTIONS,
	FRAMES_PER_SECOND,
	NOISE_PASSABLE_THRESHOLD,
	NOISE_SCALE,
	TILE_SIZE,
} from "~/constants/constants";
import { Header } from "../header/Header";
import { chooseFromRangeRandomly } from "./util/range";
import { calculateEntities } from "./util/calculateEntities";

export const Canvas = ({ props }: any) => {
	const field = new Map();
	const [factions, setFactions] = useState({});

	useEffect(() => {
		const c = document.querySelector("canvas");
		const ctx = c!.getContext("2d");

		c!.width = innerWidth;
		c!.height = innerHeight;

		const tiles = createTiles(
			c,
			TILE_SIZE,
			NOISE_PASSABLE_THRESHOLD,
			NOISE_SCALE,
			FRACTAL_OPTIONS
		);

		for (const passableTile of tiles.passableTiles) {
			const { x, y } = passableTile.location;

			const spawnToken = chooseFromRangeRandomly(0, 1000);
			const foodId = JSON.stringify(passableTile.location);

			if (spawnToken < 2)
				field.set(
					foodId,
					new Food(ctx, tiles, x, y, "brown", foodId, TILE_SIZE)
				);
		}

		const render = () => {
			ctx!.clearRect(0, 0, c!.width, c!.height);
			renderTiles(ctx, tiles, TILE_SIZE);
			field.forEach((entity: any) => {
				entity.move(tiles, field);
				entity.draw();
			});

			// setFactions(calculateEntities(field));

			setTimeout(() => {
				requestAnimationFrame(render);
			}, 1000 / FRAMES_PER_SECOND);
		};
		let animationFrameId = requestAnimationFrame(render);

		return () => cancelAnimationFrame(animationFrameId);
	}, []);

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<Header props={{ factions }}></Header>
			<canvas></canvas>
		</div>
	);
};
