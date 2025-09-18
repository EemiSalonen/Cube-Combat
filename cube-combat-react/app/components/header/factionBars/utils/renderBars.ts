import { calculateFraction } from "./calculateFractions";

export function renderBars(factions: any) {
	const bars = [];

	if (factions.brown) delete factions.brown;

	for (const faction in factions) {
		if (faction === "totalEntities") continue;
		bars.push({
			color: faction,
			fraction: calculateFraction(
				factions[faction].total,
				factions.totalEntities
			),
		});
	}

	return bars;
}
