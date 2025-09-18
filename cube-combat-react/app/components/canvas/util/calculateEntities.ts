export function calculateEntities(field: Map<string, any>) {
	const amounts: any = { totalEntities: 0 };

	field.forEach((entity: any) => {
		if (!amounts[entity.color]) {
			if (entity.warrior) {
				amounts[entity.color] = { total: 1, workers: 0, warriors: 1 };
			} else {
				amounts[entity.color] = { total: 1, workers: 1, warriors: 0 };
			}
		} else {
			amounts[entity.color].total += 1;

			if (entity.warrior) {
				amounts[entity.color].warriors++;
			} else {
				amounts[entity.color].workers++;
			}
		}
		if (entity.color !== "brown") amounts.totalEntities++;
	});
	return amounts;
}
