import { instance } from "@viz-js/viz";

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
		const regex = /image="(.*?)"/g; // Matches double-quoted strings

		const images = [];
		for (const match of code.matchAll(regex)) {
			console.log(match);
			images.push({
				name: match[1],
				width: "20mm",
				height: "20mm",
			});
		}

		console.log("images are", images);
		return images;
	};

	svgString = (code: string) => {
		const images = this.extractImageList(code);

		return graphViz.renderString(code, {
			format: "svg",
			images,
		}) as string;
	};

	oneBigSvg = async (code: string) => {
		let svg = this.svgString(code);

		const regex = /<image xlink:href="(?<url>.*?)" (?<attributes>.*?)\/>/g;

		const matches = svg.matchAll(regex);
		console.log("matches", matches);

		const promises = matches.map(async (match) => {
			let innerSvg = await fetch(match.groups!.url).then((r) => r.text());
			innerSvg = innerSvg.replace(
				/<svg .*?viewBox="(?<viewbox>.*?)".*?>/g,
				`<svg viewBox="$<viewbox>" ${match.groups!.attributes}>`,
			);
			svg = svg.replace(match[0], innerSvg);
		});

		await Promise.all(promises);

		return svg;

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
