export const Bar = ({ props }: any) => {
	const { faction } = props;

	return (
		<div
			style={{
				width: `${faction.fraction + 10}px`,
				height: "20%",
				backgroundColor: `${faction.color}`,
			}}
		></div>
	);
};
