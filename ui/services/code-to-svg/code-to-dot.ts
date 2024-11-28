import type { Code } from "./interface.ts";

export class CodeToDot {
	rowSeparator = "\n";
	colSeparator = "|";
	urlRegex = /!(\/.*?)(?=[,;}\s\)\]])/gm;
	idRegex = "(?<id>\w+)";
	equalRegex = "[ ]*=[ ]*";
	valueRegex = "`(?<value>.*?)`";

	public convert(code: Code): Code {
		code = this.findAndReplaceVariables(code);

		code = this.replaceTables(code);
		code = this.urlImages(code);
		console.log("pure dot:", code);
		return code;
	}

	private findAndReplaceVariables(code: Code): Code {
		const parts = code.split(
			/(?<id>!\w+)[ ]*=[ ]*`(?<value>.*?)`/gs,
			// new RegExp(
			// 	"!" + this.idRegex + this.equalRegex + this.valueRegex,
			// 	"gs",
			// ),
		);
		console.log("parts are", parts);
		const partitions = Object.groupBy(parts, (_, i) => i % 3);
		const texts = partitions[0] || [];
		const ids = partitions[1] || [];
		const values = partitions[2] || [];

		const n = ids?.length;

		const keyValues: Record<string, string> = {};
		for (let i = 0; i < n; i++) {
			keyValues[ids[i]] = values[i];
		}

		code = texts?.join("");
		code = this.replaceVariables(code, keyValues);
		return code;
	}

	replaceVariables(code: Code, keyValues: Record<string, string>) {
		for (const [id, value] of Object.entries(keyValues)) {
			code = code.replaceAll(id, value);
		}
		return code;
	}

	private urlImages(code: Code) {
		return code.replaceAll(
			this.urlRegex,
			`image="$1"`,
		);
	}

	private imageUrlConvertInsideTable(label: string): string {
		return label.replaceAll(
			this.urlRegex,
			`<IMG SRC="$1" />`,
		);
	}

	private labelToTable = (label: string) => {
		console.log("table label is", label);
		label = this.imageUrlConvertInsideTable(label);
		console.log("table label after !/url", label);

		label = label.trim();

		const transposeTable: string[][] = label.split(this.rowSeparator)
			.filter(
				(x) => x.trim(),
			).map((
				row,
			) => row.split(this.colSeparator));

		const tableHtml = transposeTable.map((row) =>
			`<TR>${row.map((cell) => `<TD>${cell.trim()}</TD>`).join("")}</TR>`
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
