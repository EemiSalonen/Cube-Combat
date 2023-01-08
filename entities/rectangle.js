import { rectangle } from "../lib/api.js";

export class Rectangle {
	constructor(
		corr,
		posX,
		posY,
		color,
		attack,
		defense,
		id,
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
	}

	occupied(field) {
		let found;
		field.forEach((entity) => {
			if (entity.posX === this.posX + 1 && entity.posY === this.posY) {
				found = entity;
			}

			if (entity.posX === this.posX - 1 && entity.posY === this.posY) {
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

	move(field, opponent) {
		const foodLocation = field.get(this.color);

		if (foodLocation) {
			if (this.posX < foodLocation.posX) {
				if (this.posX + 1 === opponent.posX) {
					return;
				}
				this.posX += 1;
			}

			if (this.posX > foodLocation.posX) {
				if (this.posX - 1 === opponent.posX) {
					return;
				}
				this.posX -= 1;
			}

			if (this.posY < foodLocation.posY) {
				if (this.posY + 1 === opponent.posY) {
					return;
				}
				this.posY += 1;
			}

			if (this.posY > foodLocation.posY) {
				if (this.posY - 1 === opponent.posY) {
					return;
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
				return enemy.id;
			} else if (currentAttack < currentDefense) {
				return this.id;
			} else {
				return false;
			}
		} else {
			const currentAttack = Math.floor(Math.random() * enemy.attack);
			const currentDefense = Math.floor(Math.random() * this.defense);

			if (currentAttack > currentDefense) {
				return this.id;
			} else if (currentAttack < currentDefense) {
				return enemy.id;
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
