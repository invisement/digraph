import { instance } from "@viz-js/viz";
import { Dot, GraphVizInterface, Json, Svg } from "./interface.ts";

const viz = await instance();

console.log("supported graphviz formats", viz.formats);

type ImageReference = {
	name: string; // absolute address to image
	height: string;
	width: string;
};

/**
 * Transform our coding language to standard DOT like () => table, ! => image, classes, etc
 */
export class GraphViz implements GraphVizInterface {
	private extractImageList = (dot: Dot): ImageReference[] => {
		const images = [];

		// for image attribute
		for (const match of dot.matchAll(/image="(.*?)"/g)) {
			images.push({
				name: match[1],
				width: "20mm",
				height: "20mm",
			});
		}

		// for img inside table label
		for (const match of dot.matchAll(/img src="(.*?)"/g)) {
			images.push({
				name: match[1],
				width: "20mm",
				height: "20mm",
			});
		}

		return images;
	};

	public dotToJson = (dot: Dot): Json => {
		const json = viz.renderString(dot, {
			format: "dot_json",
			images: this.extractImageList(dot),
		}) as string;

		const obj = JSON.parse(json);
		obj["nodes"] = obj["objects"].map((node: object) => {
			return {
				name: node.name,
				attributes: node,
			};
		});

		for (const edge of obj["edges"]) {
			edge.tail = obj["nodes"][edge.tail].name;
			edge.head = obj["nodes"][edge.head].name;
		}

		return obj;
	};

	public jsonToSvg = (json: Object): Svg => {
		const images = json.objects.filter((obj) => obj.image).map((obj) => {
			return {
				name: obj.image,
				height: "2mm",
				width: "2mm",
			};
		});

		console.log("images", images);

		const svg = viz.renderString(json, {
			format: "svg",
			images,
		}) as string;

		return svg;
	};
}
