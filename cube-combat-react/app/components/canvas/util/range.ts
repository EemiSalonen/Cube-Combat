export function range(lowest: number, highest: number) {
	if (lowest >= highest) throw Error("Lowest cannot be higher than highest");

	const range: number[] = [];

	for (let i = lowest; i <= highest; i++) {
		range.push(i);
	}

	return range;
}

export function chooseFromRangeRandomly(...rangeValues: number[]) {
	const newRange = range(rangeValues[0], rangeValues[1]);
	return newRange[Math.floor(Math.random() * newRange.length)];
}
