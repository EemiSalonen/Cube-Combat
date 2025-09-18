import { FactionBars } from "./factionBars/FactionBars";
import { FactionStats } from "./factionStats/FactionStats";

export const Header = ({ props }: any) => {
	const { factions } = props;
	return (
		<header style={{ display: "flex", justifyContent: "center" }}>
			<FactionBars props={{ factions }}></FactionBars>
			<FactionStats props={{ factions }}></FactionStats>
		</header>
	);
};
