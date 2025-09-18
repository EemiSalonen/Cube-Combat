export function line(corr: any, start: any, end: any) {
	corr.context.moveTo(corr.x.get(start.x), corr.y.get(start.y));
	corr.context.lineTo(corr.x.get(end.x), corr.y.get(end.y));
	corr.context.stroke();
}

export function rectangle(
	corr: any,
	locationX: number,
	locationY: number,
	sizeX: number,
	sizeY: number,
	color: string,
	fill = true
) {
	corr.context.strokeStyle = color;
	corr.context.fillStyle = color;
	corr.context.beginPath();
	corr.context.rect(
		corr.x.get(locationX),
		corr.y.get(locationY),
		sizeX * corr.x.get(2) - corr.x.get(1),
		sizeY * corr.x.get(2) - corr.x.get(1)
	);

	fill ? corr.context.fill() : corr.context.stroke();
}
