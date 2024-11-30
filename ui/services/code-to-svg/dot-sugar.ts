import type { Dot, Sugar } from "./interface.ts";

export class DotSugar implements Sugar<Dot> {
	private rowSeparator = "\n";
	private colSeparator = "|";
	private urlRegex = /!(\/.*?)(?=[,;}\s\)\]])/gm;
	private idRegex = "(?<id>!\\w+)";
	private equalRegex = "[ ]*=[ ]*";
	private valueRegex = "`(?<value>.*?)`";
	private cellPortRegex = /<(\w+)>/;

	public unCoat(dot: Dot): Dot {
		dot = this.findAndReplaceVariables(dot);

		dot = this.replaceTables(dot);
		dot = this.urlImages(dot);
		return dot;
	}

	private findAndReplaceVariables(dot: Dot): Dot {
		const parts = dot.split(
			new RegExp(
				this.idRegex + this.equalRegex + this.valueRegex,
				"gs",
			),
		);
		const partitions = Object.groupBy(parts, (_, i) => i % 3);
		const texts = partitions[0] || [];
		const ids = partitions[1] || [];
		const values = partitions[2] || [];

		const n = ids?.length;

		const keyValues: Record<string, string> = {};
		for (let i = 0; i < n; i++) {
			keyValues[ids[i]] = values[i];
		}

		dot = texts?.join("");
		dot = this.replaceVariables(dot, keyValues);
		return dot;
	}

	private replaceVariables(dot: Dot, keyValues: Record<string, string>) {
		for (const [id, value] of Object.entries(keyValues)) {
			dot = dot.replaceAll(id, value);
		}
		return dot;
	}

	private urlImages(dot: Dot) {
		return dot.replaceAll(
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
		const cellPort = (cell: string) => {
			const parts = cell.split(this.cellPortRegex);
			const port = parts.splice(1, 1).at(0);
			cell = parts.join("").trim();
			return [cell, port];
		};

		label = this.imageUrlConvertInsideTable(label);
		label = label.trim();

		const transposeTable: string[][] = label.split(this.rowSeparator)
			.filter(
				(x) => x.trim(),
			).map((
				row,
			) => row.split(this.colSeparator));

		const tableHtml = transposeTable.map((row) =>
			`<TR>${
				row.map((cell) => {
					const [trimCell, port] = cellPort(cell);
					return port
						? `<TD port="${port}">${trimCell}</TD>`
						: `<TD>${trimCell}</TD>`;
				}).join("")
			}</TR>`
		).join("");

		return `label = < <TABLE border=0> ${tableHtml} </TABLE> >`;
	};

	private replaceTables = (dot: string): string => {
		const labelsPlus = dot.split(/label\s*=\s*\(/);
		const firstPart = labelsPlus.shift();
		const transformedCode = labelsPlus.map((labelPlus) => {
			const [label, plus] = labelPlus.split(")", 2);
			const table = this.labelToTable(label);
			return table + plus;
		}).join("label = ");

		return `${firstPart} ${transformedCode}`;
	};
}
