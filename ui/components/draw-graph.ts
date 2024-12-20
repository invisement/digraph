/**
 * modification: convert !url to image url in table and out
 */

type Code = string;

import { CodeToSVG } from "../services/code-to-svg/main.ts";
import { getCode } from "../state-management.ts";

const codeToSvg = new CodeToSVG();

export class DrawGraph extends HTMLElement {
	shadow: ShadowRoot = this.attachShadow({ mode: "open" });

	html = () => /*html*/ `
		<div> </div>
	`;

	constructor() {
		super();
		this.shadow.innerHTML = this.html();
	}

	public show = async () => {
		const code = await getCode();
		const svg = codeToSvg.toShow(code);
		this.shadow.querySelector("div")!.innerHTML = svg;
	};

	public open = async () => {
		const code = await getCode();

		const svg = codeToSvg.toShow(code);
		// Create a new window/tab
		const newWindow = globalThis.open()!;

		// Write the SVG content to the new window
		newWindow.document.write(svg);

		// Optional: Set MIME type for SVG
		newWindow.document.documentElement.setAttribute(
			"xmlns",
			"http://www.w3.org/2000/svg",
		);
	};

	public showDOT = async (): Promise<void> => {
		const code = await getCode();

		const dot = codeToSvg.toDot(code);
		console.log(dot);

		const newWindow = globalThis.open();
		newWindow?.document.write(dot);
	};

	public showJSON = async (): Promise<void> => {
		const code = await getCode();
		const json = codeToSvg.toGraph(code);
		console.log(json);
		const newWindow = globalThis.open();
		newWindow?.document.write(JSON.stringify(json, null, 4));
	};

	public download = async (filename: string = "graph.svg") => {
		const code = await getCode();

		const sprite = await codeToSvg.toDownload(code);

		const blob = new Blob([sprite], {
			type: "image/svg+xml",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename; // Suggested filename
		link.click();
		URL.revokeObjectURL(url);
	};

	public downloadPng = async (filename: string = "graph.png") => {
		const code = await getCode();

		const sprite = await codeToSvg.toDownload(code);

		// Create image from SVG
		const img = new Image();
		const svg = new Blob([sprite], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svg);
		img.src = url;

		// Create canvas and context
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d")!;

		img.onload = function () {
			// Set canvas size to match image
			canvas.width = img.width * 2; //img.width;
			canvas.height = img.height * 2; //img.height;
			console.log("image", canvas.width, canvas.height);

			// Draw image on canvas
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			// Create download link
			const png = canvas.toDataURL("image/png");
			const downloadLink = document.createElement("a");
			downloadLink.href = png;
			downloadLink.download = filename;
			downloadLink.click();

			// Clean up
			URL.revokeObjectURL(url);
		};
	};
}
