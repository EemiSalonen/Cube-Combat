export function line(corr, start, end) {
	corr.context.moveTo(corr.x.get(start.x), corr.y.get(start.y));
	corr.context.lineTo(corr.x.get(end.x), corr.y.get(end.y));
	corr.context.stroke();
}

export function triangle(corr, a, b, c) {
	corr.context.moveTo(corr.x.get(a.x), corr.y.get(a.y));
	corr.context.lineTo(corr.x.get(b.x), corr.y.get(b.y));
	corr.context.lineTo(corr.x.get(c.x), corr.y.get(c.y));
	corr.context.lineTo(corr.x.get(a.x), corr.y.get(a.y));

	corr.context.stroke();
}

export function rectangle(
	corr,
	locationX,
	locationY,
	sizeX,
	sizeY,
	color,
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
