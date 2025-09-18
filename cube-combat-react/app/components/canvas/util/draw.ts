import { rectangle } from "~/canvas-api/api";
import type { Rectangle } from "~/entities/rectangle";

export function draw(corr: any, entity: Rectangle) {
	rectangle(
		corr,
		entity.posX,
		entity.posY,
		entity.sizeX,
		entity.sizeY,
		entity.color,
		entity.fill
	);
}
