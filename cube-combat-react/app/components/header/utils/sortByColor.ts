export function sortByColor(array: any) {
	return array.sort(function (a: any, b: any) {
		if (a.color < b.color) {
			return -1;
		}
		if (a.color > b.color) {
			return 1;
		}
		return 0;
	});
}
