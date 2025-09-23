import React, { useEffect, useRef, useState } from "react";
import { createTiles, drawField } from "./init/init";
import { Food, Rectangle } from "~/entities/rectangle";
import { FRAMES_PER_SECOND } from "~/contants/constants";
import { Header } from "../header/Header";
import { calculateEntities } from "./util/calculateEntities";
import { chooseFromRangeRandomly } from "./util/range";

export const Canvas = ({ props }: any) => {
	const field = new Map();
	const [factions, setFactions] = useState({});

	useEffect(() => {
		const c = document.querySelector("canvas");
		const ctx = c!.getContext("2d");

		c!.width = innerWidth;
		c!.height = innerHeight;

		const tileSize = 10;
		const tiles = createTiles(c, tileSize);

		const redData = { spawnpoint: { x: 0, y: 0 } };
		const blueData = { spawnpoint: { x: 0, y: 90 } };
		const yellowData = { spawnpoint: { x: 190, y: 0 } };
		const greenData = { spawnpoint: { x: 190, y: 90 } };

		const square = (id: number, color: string, spawn: any, warrior = false) =>
			new Rectangle(
				ctx,
				tiles,
				spawn.spawnpoint.x,
				spawn.spawnpoint.y,
				color,
				2,
				2,
				id,
				warrior,
				tileSize
			);

		let id = 1;
		field.set(id, square(id, "red", redData));
		id++;
		field.set(id, square(id, "blue", blueData));
		id++;
		field.set(id, square(id, "orange", yellowData));
		id++;
		field.set(id, square(id, "green", greenData));

		field.forEach((entity: any) => entity.draw());

		const render = () => {
			if (true) {
				ctx!.clearRect(0, 0, c!.width, c!.height);
				drawField(c, ctx, tileSize);

				field.forEach((entity: any) => {
					const deletable = entity.checkSurroundings(field);

					if (!field.get("red")) {
						field.set(
							"red",
							new Food(
								ctx,
								tiles,
								chooseFromRangeRandomly(0, 190),
								chooseFromRangeRandomly(0, 90),
								"brown",
								"red",
								tileSize
							)
						);
					}

					if (!field.get("blue")) {
						field.set(
							"blue",
							new Food(
								ctx,
								tiles,
								chooseFromRangeRandomly(0, 190),
								chooseFromRangeRandomly(0, 90),
								"brown",
								"blue",
								tileSize
							)
						);
					}

					if (!field.get("orange")) {
						field.set(
							"orange",
							new Food(
								ctx,
								tiles,
								chooseFromRangeRandomly(0, 190),
								chooseFromRangeRandomly(0, 90),
								"brown",
								"orange",
								tileSize
							)
						);
					}

					if (!field.get("green")) {
						field.set(
							"green",
							new Food(
								ctx,
								tiles,
								chooseFromRangeRandomly(0, 190),
								chooseFromRangeRandomly(0, 90),
								"brown",
								"green",
								tileSize
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

					setFactions(calculateEntities(field));
				});

				field.forEach((entity: any) => entity.draw());
				setTimeout(() => {
					requestAnimationFrame(render);
				}, 1000 / FRAMES_PER_SECOND);
			}
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
