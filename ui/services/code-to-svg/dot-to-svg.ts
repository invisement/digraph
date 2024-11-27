import { instance } from "@viz-js/viz";

const graphViz = await instance();
type ImageReference = {
	name: string; // absolute address to image
	height: string;
	width: string;
};

type Code = string;
type SVG = string;

/**
 * Transform our coding language to standard DOT like () => table, ! => image, classes, etc
 */
export class DotToSVG {
	private extractImageList = (code: Code): ImageReference[] => {
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

	public svgString = (dot: string): SVG => {
		const images = this.extractImageList(dot);

		const svg = graphViz.renderString(dot, {
			format: "svg",
			images,
		}) as string;

		return svg;
	};
}
