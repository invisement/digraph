/**
 * modification: convert !url to image url in table and out
 */

import { instance } from "@viz-js/viz";

const rowSeparator = "\n";
const colSeperator = "|";

const graphViz = await instance();
type ImageReference = {
	name: string; // absolute address to image
	height: string;
	width: string;
};

export class DrawGraph extends HTMLElement {
	shadow: ShadowRoot = this.attachShadow({ mode: "open" });

	html = () => /*html*/ `
		<div> </div>
	`;

	constructor() {
		super();
		this.shadow.innerHTML = this.html();
	}

	private extractImageList = (code: string): ImageReference[] => {
		const images = [];

		// for image attribute
		for (const match of code.matchAll(/image="(.*?)"/g)) {
			images.push({
				name: match[1],
				width: "20mm",
				height: "20mm",
			});
		}

		// for img inside table label
		for (const match of code.matchAll(/img src="(.*?)"/g)) {
			images.push({
				name: match[1],
				width: "20mm",
				height: "20mm",
			});
		}

		return images;
	};

	replaceTables = (code: string) => {
		const labelToTable = (label: string) => {
			label = label.trim();

			label = label.replaceAll(
				/!(\/.*?)[^a-zA-Z0-9_\-.:/]/g,
				`<IMG SRC="$1" />`,
			);

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

	svgString = (code: string) => {
		code = this.replaceTables(code);

		code = code.replaceAll(
			/!(\/.*?)([^a-zA-Z0-9_\-.:/])/g,
			`image="$1"$2`,
		);

		const images = this.extractImageList(code);

		let svg = graphViz.renderString(code, {
			format: "svg",
			images,
		}) as string;

		return svg;
	};

	oneBigSvg = async (code: string) => {
		let svg = this.svgString(code);

		const regex = /<image xlink:href="(?<url>.*?)" (?<attributes>.*?)\/>/g;

		const matches = svg.matchAll(regex);

		const innerSvgPromises = matches.map(async (match) => {
			const url = match.groups!.url;
			let innerSvg = await fetch(url).then((r) => r.text());
			svg = svg.replace(
				match[0],
				`<use href="#${url}" ${match.groups!.attributes}/>`,
			);
			return innerSvg.replace("<svg ", `<svg id="${url}" `);
			// innerSvg = innerSvg.replace(
			// 	/<svg .*?viewBox="(?<viewbox>.*?)".*?>/g,
			// 	`<svg id="${url}" viewBox="$<viewbox>" ${match.groups!.attributes}>`,
			// );
			//svg = svg.replace(match[0], innerSvg);
		});

		const defs = (await Promise.all(innerSvgPromises)).join("");

		return defs + svg;

		//this.shadow.querySelector("div")!.innerHTML = svg;
	};

	show = (code: string) => {
		this.shadow.querySelector("div")!.innerHTML = this.svgString(code);
	};

	open = (code: string) => {
		// Create a new window/tab
		const newWindow = window.open()!;

		// Write the SVG content to the new window
		newWindow.document.write(this.svgString(code));

		// Optional: Set MIME type for SVG
		newWindow.document.documentElement.setAttribute(
			"xmlns",
			"http://www.w3.org/2000/svg",
		);
	};

	download = async (code: string, filename: string = "graph.svg") => {
		const svgString = await this.oneBigSvg(code);

		const blob = new Blob([svgString], {
			type: "image/svg+xml",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename; // Suggested filename
		link.click();
		URL.revokeObjectURL(url);
	};

	downloadPng = async (code: string, filename: string = "graph.png") => {
		const svgString = await this.oneBigSvg(code);

		// Create canvas and context
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			console.error("Unable to get canvas context");
			return;
		}

		// Create image from SVG
		const img = new Image();
		const svg = new Blob([svgString], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svg);

		img.onload = function () {
			// Set canvas size to match image
			canvas.width = img.width;
			canvas.height = img.height;

			// Draw image on canvas
			ctx.drawImage(img, 0, 0);

			// Create download link
			const png = canvas.toDataURL("image/png");
			const downloadLink = document.createElement("a");
			downloadLink.href = png;
			downloadLink.download = filename;
			downloadLink.click();

			// Clean up
			URL.revokeObjectURL(url);
		};

		img.src = url;
	};
}
