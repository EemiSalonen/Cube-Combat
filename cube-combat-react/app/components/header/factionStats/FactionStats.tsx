import { sortByColor } from "../utils/sortByColor";
import { Stat } from "./stat/Stat";
import { parseFactionData } from "./utils/parseFactionData";

export const FactionStats = ({ props }: any) => {
	const { factions } = props;
	const factionStatData = sortByColor(parseFactionData(factions));
	return (
		<div>
			{factionStatData.map((faction: any) => (
				<Stat key={faction.color} props={{ faction }}></Stat>
			))}
		</div>
	);
};
