import type { Dot, Sugar } from "./interface.ts";

export class DotSugar implements Sugar<Dot> {
	private rowSeparator = /\n|\\n/;
	private colSeparator = "|";
	private urlRegex = /!(\/.*?)(?=[,;}\s\)\]])/gm;
	private idRegex = "(?<id>!\\w+)";
	private equalRegex = "[ ]*=[ ]*";
	private valueRegex = "`(?<value>.*?)`";
	private cellPortRegex = /<(\w+)>/;
	private cellStyleRegex = /`(.*?)`/;
	private tableStyleRegex = /^\s*`(.*?)`/;
	private tableRegex = /label\s*=\s*\((?<tableLabel>.*?)\)/gs;

	public unCoat(dot: Dot): Dot {
		dot = this.findAndReplaceVariables(dot);

		dot = this.findAndReplaceTables(dot);
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
		const cellPort = (cell: string): [string, string] => {
			const parts = cell.split(this.cellPortRegex);
			const port = parts.splice(1, 1).at(0) || "";
			cell = parts.join("").trim();
			return [cell, port];
		};

		const cellStyle = (cell: string): [string, string] => {
			const parts = cell.split(this.cellStyleRegex);
			const style = parts.splice(1, 1).at(0) || "";
			cell = parts.join("").trim();
			return [cell, style];
		};

		const tableStyle = (table: string): [string, string] => {
			const parts = table.split(this.tableStyleRegex);
			const style = parts.splice(1, 1).at(0) || "";
			table = parts.join("").trim();
			return [table, style];
		};

		label = this.imageUrlConvertInsideTable(label);
		let [tableString, tStyle] = tableStyle(label);

		const table: string[][] = tableString.split(this.rowSeparator)
			.filter(
				(x) => x.trim(),
			).map((
				row,
			) => row.split(this.colSeparator));

		const tableHtml = table.map((row) => {
			let colspan = 1;
			return `<TR>${
				row.map((cell) => {
					const [cell2, style] = cellStyle(cell);
					const [trimCell, port] = cellPort(cell2 || "");
					if (!trimCell) {
						colspan += 1;
						return "";
					}

					const colspanText = colspan > 1
						? `colspan="${colspan}"`
						: "";
					const portText = port ? `port="${port}"` : "";
					colspan = 1;

					return `<TD ${portText} ${colspanText} ${style}>${trimCell}</TD>`;
				}).join("")
			}</TR>`;
		}).join("");

		return `label = < <TABLE cellspacing="0" ${tStyle}> ${tableHtml} </TABLE> > shape="none"`;
	};

	private findAndReplaceTables = (dot: string): string => {
		const parts = dot.split(this.tableRegex);

		// every other (evens) are table labels
		for (let i = 1; i < parts.length; i += 2) {
			parts[i] = this.labelToTable(parts[i]);
		}
		return parts.join("");
	};
}
