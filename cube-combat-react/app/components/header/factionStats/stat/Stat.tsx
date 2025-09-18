export const Stat = ({ props }: any) => {
	const { faction } = props;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				margin: "10px 50px",
			}}
		>
			<span>Workers:</span>
			<p style={{ color: faction.color }}>{faction.workers || 0}</p>
			<span>Warriors:</span>
			<p style={{ color: faction.color }}>{faction.warriors || 0}</p>
		</div>
	);
};
