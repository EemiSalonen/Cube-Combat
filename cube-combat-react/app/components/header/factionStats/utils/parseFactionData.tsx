export function parseFactionData(factions: any) {
	const stats = [];

	if (factions.brown) delete factions.brown;

	for (const faction in factions) {
		if (faction === "totalEntities") continue;
		stats.push({
			color: faction,
			warriors: factions[faction].warriors,
			workers: factions[faction].workers,
		});
	}
	return stats;
}
