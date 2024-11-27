const rowSeparator = "\n";
const colSeperator = "|";

export class LabelToTable {
	private imageUrlConvertInsideTable(label: string): string {
		return label.replaceAll(
			/!(\/.*?)[^a-zA-Z0-9_\-.:/]/g,
			`<IMG SRC="$1" />`,
		);
	}

	private replaceTables = (code: string): string => {
		const labelToTable = (label: string) => {
			label = label.trim();

			const transposeTable: string[][] = label.split(rowSeparator).filter(
				(x) => x.trim(),
			).map((
				row,
			) => row.split(colSeperator));

			const tableHtml = transposeTable.map((row) =>
				`<TR>${row.map((cell) => `<TD>${cell.trim()}</TD>`)}</TR>`
			).join("");

			return `label = < <TABLE> ${tableHtml} </TABLE> >`;
		};

		const labelsPlus = code.split(/label\s*=\s*\(/);
		const firstPart = labelsPlus.shift();
		const transformedCode = labelsPlus.map((labelPlus) => {
			const [label, plus] = labelPlus.split(")", 2);
			const table = labelToTable(label);
			return table + plus;
		}).join("label = ");

		return `${firstPart} ${transformedCode}`;
	};
}
