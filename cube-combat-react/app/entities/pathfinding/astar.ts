function getLowestFValueAndLowestHValue(map: any, goal: any) {
	const valueObj: any = {};
	let lowestF = Number.MAX_SAFE_INTEGER;
	let lowestH = Number.MAX_SAFE_INTEGER;
	let node = null;
	map.forEach((value: any, key: any) => {
		if (!valueObj[value]) {
			valueObj[value] = [key];
		} else {
			valueObj[value].push(key);
		}
		if (value < lowestF) {
			lowestF = value;
			node = key;
		}
	});
	const candidateNodes = valueObj[lowestF];
	for (let i = 0; i < candidateNodes.length; i++) {
		if (heuristicCostEstimation(candidateNodes[i], goal, 1) < lowestH) {
			node = candidateNodes[i];
		}
	}
	return node;
}

export function heuristicCostEstimation(node: any, goal: any, nodeLength: any) {
	const dx = Math.abs(node.x - goal.x);
	const dy = Math.abs(node.y - goal.y);

	return (
		nodeLength * (dx + dy) + (Math.sqrt(2) - 2 * nodeLength) * Math.min(dx, dy)
	);
}

function reconstructPath(cameFrom: any, current: any, start: any) {
	const totalPath = [current];
	while (current !== start) {
		current = cameFrom.get(current);
		totalPath.unshift(current);
	}
	return totalPath;
}
export function aStar(start: any, goal: any) {
	const open = new Map();
	const cameFrom = new Map();

	open.set(start, start);

	const gScore = new Map();
	gScore.set(start, 0);

	const fScore = new Map();
	fScore.set(start, heuristicCostEstimation(start, goal, 1));
	while (open.size > 0) {
		let current = getLowestFValueAndLowestHValue(fScore, goal);
		if (current === goal) return reconstructPath(cameFrom, current, start);
		open.delete(current);
		fScore.delete(current);
		for (const neighbor of current.neighbors) {
			if (!neighbor.passable) continue;

			const tentativeGScore = gScore.get(current) + 1;

			if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
				cameFrom.set(neighbor, current);
				gScore.set(neighbor, tentativeGScore);
				fScore.set(
					neighbor,
					tentativeGScore + heuristicCostEstimation(neighbor, goal, 1)
				);
				if (!open.has(neighbor)) {
					open.set(neighbor, neighbor);
				}
			}
		}
	}

	return false;
}
