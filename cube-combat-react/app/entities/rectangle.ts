import { warrior, worker } from "~/canvas-api/api";
import { aStar, heuristicCostEstimation } from "./pathfinding/astar";
import { chooseFromRangeRandomly } from "~/components/canvas/util/range";

export class Rectangle {
	constructor(
		public context: any,
		public tiles: any,
		public x: number,
		public y: number,
		public color: string,
		public attack: number,
		public defense: number,
		public id: number | string,
		public warrior = false,
		public size: number,
		public fill: boolean = true,
		public combatValue = 0,
		private target: Rectangle | null = null
	) {}
	static instanceAmount = 0;

	addInstanceAmount() {
		Rectangle.instanceAmount++;
	}

	draw() {
		if (this.warrior) {
			this.drawWarrior();
		} else {
			worker(
				this.context,
				this.tiles.getTile({ x: this.x, y: this.y }),
				this.size,
				this.color,
				this.fill
			);
		}
	}

	drawWarrior() {
		warrior(
			this.context,
			this.tiles.getTile({ x: this.x, y: this.y }),
			this.size,
			this.color
		);
	}

	occupied(field: any) {
		let found;
		field.forEach((entity: Rectangle) => {
			if (entity.x === this.x + 1 && entity.y === this.y) {
				found = entity;
			}

			if (entity.x === this.x + 1 && entity.y === this.y + 1) {
				found = entity;
			}

			if (entity.x === this.x + 1 && entity.y === this.y - 1) {
				found = entity;
			}

			if (entity.x === this.x - 1 && entity.y === this.y) {
				found = entity;
			}

			if (entity.x === this.x - 1 && entity.y === this.y + 1) {
				found = entity;
			}

			if (entity.x === this.x - 1 && entity.y === this.y - 1) {
				found = entity;
			}

			if (entity.y === this.y + 1 && entity.x === this.x) {
				found = entity;
			}

			if (entity.y === this.y - 1 && entity.x === this.x) {
				found = entity;
			}
		});

		if (found) {
			return found;
		} else {
			return false;
		}
	}
	// Change to use a*
	warriorSearch(field: any) {
		let nearestDistX = Number.MAX_SAFE_INTEGER;
		let nearestDistY = Number.MAX_SAFE_INTEGER;

		let nearestX: number | Rectangle = 0;
		let nearestY: number | Rectangle = 0;
		let targetedEnemy: Rectangle | null | number = null;

		field.forEach((entity: Rectangle) => {
			if (
				entity instanceof Food === false &&
				entity !== this &&
				entity.color !== this.color
			) {
				const distCalcEntityX = entity.x <= 0 ? -entity.x : entity.x;
				const distCalcThisX = this.x <= 0 ? -this.x : this.x;
				const distCalcEntityY = entity.y <= 0 ? -entity.y : entity.y;
				const distCalcThisY = this.y <= 0 ? -this.y : this.y;

				if (distCalcEntityX - distCalcThisX < nearestDistX) {
					nearestDistX = distCalcEntityX - distCalcThisX;
					nearestDistX = nearestDistX < 0 ? -nearestDistX : nearestDistX;
					nearestX = entity;
				}

				if (distCalcEntityY - distCalcThisY < nearestDistY) {
					nearestDistY = distCalcEntityY - distCalcThisY;
					nearestDistY = nearestDistY < 0 ? -nearestDistY : nearestDistY;
					nearestY = entity;
				}

				if (nearestX === nearestY) {
					targetedEnemy = nearestX;
				}
			}
		});
		return targetedEnemy;
	}

	searchForFood(field: any) {
		let lowestDistance = Infinity;
		let target: any = null;
		field.forEach((entity: any) => {
			if (entity !== this) {
				const currentDistance = heuristicCostEstimation(
					{ x: this.x, y: this.y },
					{ x: entity.x, y: entity.y },
					1
				);

				if (currentDistance < lowestDistance && entity.color === "brown") {
					lowestDistance = currentDistance;
					target = entity;
				}
			}
		});

		return target;
	}

	move(tiles: any, field: any) {
		if (this instanceof Food) {
		} else {
			this.target = this.searchForFood(field);

			const currentDistanceToTarget = heuristicCostEstimation(
				{ x: this.x, y: this.y },
				{ x: this.target?.x, y: this.target?.y },
				1
			);

			if (currentDistanceToTarget < 2) {
				const eaten = this.eat(this.target);
				field.delete(eaten.food);
				this.target = this.searchForFood(field);
			}

			const result: any = aStar(
				tiles.getTile({ x: this.x, y: this.y }),
				tiles.getTile({ x: this.target?.x, y: this.target?.y })
			);

			if (result[1]) {
				this.x = result[1].location.x;
				this.y = result[1].location.y;
			}
		}
	}

	fight(enemy: any) {
		// 50% chance for either to attack upon seeing each other
		const starter = Math.round(Math.random());
		if (starter) {
			const currentAttack = Math.floor(Math.random() * this.attack);
			const currentDefense = Math.floor(Math.random() * enemy.defense);

			if (currentAttack > currentDefense) {
				if (this.warrior) this.target = null;
				return enemy.id;
			} else {
				return false;
			}
		} else {
			const currentAttack = Math.floor(Math.random() * enemy.attack);
			const currentDefense = Math.floor(Math.random() * this.defense);

			if (currentAttack > currentDefense) {
				if (this.warrior) this.target = null;
				return this.id;
			} else {
				return false;
			}
		}
	}

	checkSurroundings(field: any) {
		const opponent: any = this.occupied(field);

		if (this instanceof Food) return;

		if (opponent instanceof Food) {
			return this.eat(opponent);
		} else {
			if (opponent && opponent.color !== this.color) {
				const dest = this.fight(opponent);
				if (dest) {
					return dest;
				}
			}
		}
	}

	eat(foodPiece: any) {
		return { food: foodPiece.id, color: this.color };
	}
}

export class Food extends Rectangle {
	constructor(
		context: any,
		tiles: any,
		x: number,
		y: number,
		color: string,
		id: string,
		size: number,
		fill?: any
	) {
		super(context, tiles, x, y, color, 0, 0, id, false, size);
	}
}
