import React, { useEffect, useRef, useState } from "react";
import { drawField } from "./init/init";
import { Food, Rectangle } from "~/entities/rectangle";
import { FRAMES_PER_SECOND } from "~/contants/constants";
import { Header } from "../header/Header";
import { calculateEntities } from "./util/calculateEntities";

export const Canvas = ({ props }: any) => {
	const field = new Map();
	const [factions, setFactions] = useState({});

	useEffect(() => {
		const c = document.querySelector("canvas");
		const ctx = c!.getContext("2d");

		c!.width = innerWidth;
		c!.height = innerHeight;

		const fieldSize = 10;
		const corr = drawField(c, ctx, fieldSize);

		const redData = { spawnpoint: { x: -90, y: -41 } };
		const blueData = { spawnpoint: { x: 90, y: 41 } };
		const yellowData = { spawnpoint: { x: -90, y: 40 } };
		const greenData = { spawnpoint: { x: 90, y: -40 } };

		const square = (id: number, color: string, spawn: any, warrior = false) =>
			new Rectangle(
				corr,
				spawn.spawnpoint.x,
				spawn.spawnpoint.y,
				color,
				2,
				2,
				id,
				warrior
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
				corr.context.clearRect(0, 0, c!.width, c!.height);

				field.forEach((entity: any) => {
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
