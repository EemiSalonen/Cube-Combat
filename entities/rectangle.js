import { rectangle, triangle } from "../lib/api.js";

export class Rectangle {
	constructor(
		corr,
		posX,
		posY,
		color,
		attack,
		defense,
		id,
		warrior = false,
		sizeX = 1,
		sizeY = 1,
		fill = true
	) {
		this.corr = corr;
		this.posX = posX;
		this.posY = posY;
		this.id = id;
		this.color = color;
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.fill = fill;
		this.attack = attack;
		this.defense = defense;
		this.combatValue = 0;
		this.addInstanceAmount();
		this.warrior = warrior;
		this.target;
	}
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

	occupied(field) {
		let found;
		field.forEach((entity) => {
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

	warriorSearch(field) {
		let nearestDistX = Number.MAX_SAFE_INTEGER;
		let nearestDistY = Number.MAX_SAFE_INTEGER;

		let nearestX = 0;
		let nearestY = 0;
		let targetedEnemy;

		field.forEach((entity) => {
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

	move(field, opponent) {
		if (this.warrior) {
			if (!this.target) {
				console.log("test");
				this.target = this.warriorSearch(field);
			} else {
				this.target = field.get(this.target.id);
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

	fight(enemy) {
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

	checkSurroundings(field) {
		const opponent = this.occupied(field);

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

	eat(foodPiece) {
		return { food: foodPiece.id, color: this.color };
	}
}

export class Food extends Rectangle {
	constructor(corr, posX, posY, color, id, sizeX, sizeY, fill) {
		super(corr, posX, posY, color, 0, 0, id, sizeX, sizeY, fill);
	}
}
