type FileSizeOptions = {
	source: number | Blob;
	digit?: number;
};

const UNIT = ["B", "KB", "MB", "GB", "TB", "PB"];

export function fileSize({ source, digit = 2 }: FileSizeOptions) {
	let bytes = typeof source === "number" ? source : source.size;
	let count = 0;

	while (bytes >= 1024 && count < UNIT.length) {
		bytes /= 1024;
		++count;
	}

	return [bytes.toFixed(digit), UNIT[count]].join(" ");
}
