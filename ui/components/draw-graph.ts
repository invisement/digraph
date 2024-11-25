import { instance } from "@viz-js/viz";

const graphViz = await instance();

export class DrawGraph extends HTMLElement {
	shadow: ShadowRoot = this.attachShadow({ mode: "open" });

	html = () => /*html*/ `
		<div> </div>
	`;

	constructor() {
		super();
		this.shadow.innerHTML = this.html();
	}

	private svgString = (code: string): string => {
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

		return graphViz.renderString(code, {
			format: "svg",
			images,
		}) as string;
	};

	show = (code: string) => {
		this.shadow.querySelector("div")!.innerHTML = this.svgString(code);
	};

	open = (code: string) => {
		const blob = new Blob([this.svgString(code)], { type: "image/svg+xml" });
		// create an URI pointing to that blob
		const url = URL.createObjectURL(blob);
		const win = open(url)!;
		// so the Garbage Collector can collect the blob
		win.onload = () => URL.revokeObjectURL(url);
	};

	download = (code: string, filename: string = "graph.svg") => {
		const blob = new Blob([this.svgString(code)], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename; // Suggested filename
		link.click();
		URL.revokeObjectURL(url);
	};
}
