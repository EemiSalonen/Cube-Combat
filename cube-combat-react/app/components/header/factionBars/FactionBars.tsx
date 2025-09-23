import { sortByColor } from "../utils/sortByColor";
import { Bar } from "./bar/Bar";
import { renderBars } from "./utils/renderBars";

export const FactionBars = ({ props }: any) => {
	const { factions } = props;
	const factionBarData = sortByColor(renderBars(factions));

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "110px", // Should be set dynamically based on the maximum length of a bar
				gap: "2px",
			}}
		>
			{factionBarData.map((faction: any) => (
				<Bar key={faction.color} props={{ faction }}></Bar>
			))}
		</div>
	);
};
