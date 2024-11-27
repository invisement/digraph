import type { Code } from "./interface.ts";

export class CodeToDot {
	rowSeparator = "\n";
	colSeperator = "|";

	public convert(code: Code): Code {
		code = this.replaceTables(code);
		code = this.urlImages(code);
		return code;
	}

	private urlImages(code: Code) {
		return code.replaceAll(
			/!(\/.*?)([^a-zA-Z0-9_\-.:/])/g,
			`image="$1"$2`,
		);
	}

	private imageUrlConvertInsideTable(label: string): string {
		return label.replaceAll(
			/!(\/.*?)[^a-zA-Z0-9_\-.:/]/g,
			`<IMG SRC="$1" />`,
		);
	}

	private labelToTable = (label: string) => {
		label = this.imageUrlConvertInsideTable(label);

		label = label.trim();

		const transposeTable: string[][] = label.split(this.rowSeparator)
			.filter(
				(x) => x.trim(),
			).map((
				row,
			) => row.split(this.colSeperator));

		const tableHtml = transposeTable.map((row) =>
			`<TR>${row.map((cell) => `<TD>${cell.trim()}</TD>`)}</TR>`
		).join("");

		return `label = < <TABLE> ${tableHtml} </TABLE> >`;
	};

	private replaceTables = (code: string): string => {
		const labelsPlus = code.split(/label\s*=\s*\(/);
		const firstPart = labelsPlus.shift();
		const transformedCode = labelsPlus.map((labelPlus) => {
			const [label, plus] = labelPlus.split(")", 2);
			const table = this.labelToTable(label);
			return table + plus;
		}).join("label = ");

		return `${firstPart} ${transformedCode}`;
	};
}
