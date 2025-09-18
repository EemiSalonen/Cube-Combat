import { rectangle } from "~/canvas-api/api";

export class Rectangle {
	constructor(
		public corr: any,
		public posX: number,
		public posY: number,
		public color: string,
		public attack: number,
		public defense: number,
		public id: number | string,
		public warrior = false,
		public sizeX: any = 1,
		public sizeY: any = 1,
		public fill = true,
		public combatValue = 0,
		private target: Rectangle | null = null
	) {}
	static instanceAmount = 0;

	addInstanceAmount() {
		Rectangle.instanceAmount++;
	}

	draw() {
		rectangle(
			this.corr,
			this.posX,
			this.posY,
			this.sizeX,
			this.sizeY,
			this.color,
			this.fill
		);

		if (this.warrior) {
			this.drawWarrior();
		}
	}

	drawWarrior() {
		this.corr.context.beginPath();
		this.corr.context.fillStyle = "white";
		this.corr.context.arc(
			this.corr.x.get(this.posX) +
				(this.corr.x.get(2) - this.corr.x.get(1)) / 2,
			this.corr.y.get(this.posY) +
				(this.corr.x.get(2) - this.corr.x.get(1)) / 2,
			(this.corr.x.get(2) - this.corr.x.get(1)) * 0.33,
			0,
			2 * Math.PI
		);
		this.corr.context.fill();
	}

	occupied(field: any) {
		let found;
		field.forEach((entity: Rectangle) => {
			if (entity.posX === this.posX + 1 && entity.posY === this.posY) {
				found = entity;
			}

			if (entity.posX === this.posX + 1 && entity.posY === this.posY + 1) {
				found = entity;
			}

			if (entity.posX === this.posX + 1 && entity.posY === this.posY - 1) {
				found = entity;
			}

			if (entity.posX === this.posX - 1 && entity.posY === this.posY) {
				found = entity;
			}

			if (entity.posX === this.posX - 1 && entity.posY === this.posY + 1) {
				found = entity;
			}

			if (entity.posX === this.posX - 1 && entity.posY === this.posY - 1) {
				found = entity;
			}

			if (entity.posY === this.posY + 1 && entity.posX === this.posX) {
				found = entity;
			}

			if (entity.posY === this.posY - 1 && entity.posX === this.posX) {
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
				const distCalcEntityX = entity.posX <= 0 ? -entity.posX : entity.posX;
				const distCalcThisX = this.posX <= 0 ? -this.posX : this.posX;
				const distCalcEntityY = entity.posY <= 0 ? -entity.posY : entity.posY;
				const distCalcThisY = this.posY <= 0 ? -this.posY : this.posY;

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

	// Change to use a*
	move(field: any, opponent: Rectangle) {
		if (this.warrior) {
			if (!this.target) {
				this.target = this.warriorSearch(field);
			} else {
				this.target = field.get(this.target!.id);
			}
		} else {
			this.target = field.get(this.color);
		}

		if (this.target) {
			if (this.posX < this.target.posX) {
				if (this.posX + 1 === opponent.posX) {
					this.posX -= 1;
				}
				this.posX += 1;
			}

			if (this.posX > this.target.posX) {
				if (this.posX - 1 === opponent.posX) {
					this.posX += 1;
				}
				this.posX -= 1;
			}

			if (this.posY < this.target.posY) {
				if (this.posY + 1 === opponent.posY) {
					this.posY -= 1;
				}
				this.posY += 1;
			}

			if (this.posY > this.target.posY) {
				if (this.posY - 1 === opponent.posY) {
					this.posY += 1;
				}
				this.posY -= 1;
			}
		} else {
			const dir = Math.floor(Math.random() * 4 + 1);
			switch (dir) {
				case 1:
					if (this.corr.y.get(this.posY + 1)) {
						this.posY += 1;
					} else {
						this.posY -= 1;
					}
					break;
				case 2:
					if (this.corr.x.get(this.posX + 1)) {
						this.posX += 1;
					} else {
						this.posX -= 1;
					}
					break;
				case 3:
					if (this.corr.y.get(this.posY - 1)) {
						this.posY -= 1;
					} else {
						this.posY += 1;
					}
					break;
				case 4:
					if (this.corr.x.get(this.posX - 1)) {
						this.posX -= 1;
					} else {
						this.posX += 1;
					}
			}
		}
	}

	fight(enemy: Rectangle) {
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
			} else {
				this.move(field, opponent);
			}
		}
	}

	eat(foodPiece: Rectangle) {
		return { food: foodPiece.id, color: this.color };
	}
}

export class Food extends Rectangle {
	constructor(
		corr: any,
		posX: number,
		posY: number,
		color: string,
		id: string,
		sizeX?: any,
		sizeY?: any,
		fill?: any
	) {
		super(corr, posX, posY, color, 0, 0, id, sizeX, sizeY, fill);
	}
}
