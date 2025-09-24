import { useState } from "react";
import { Canvas } from "../canvas/Canvas";

export const Dashboard = () => {
	const [started, setStarted] = useState(false);

	const start = () => {
		setStarted(true);
	};

	if (started) return <Canvas></Canvas>;
	else
		return (
			<div>
				<button onClick={start}>Start</button>
			</div>
		);
};
