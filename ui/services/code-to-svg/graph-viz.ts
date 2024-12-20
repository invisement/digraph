import { instance } from "@viz-js/viz";
import { Dot, GraphVizInterface, Svg } from "./interface.ts";
import { JsonToGraph } from "./json-to-graph.ts";
import type { Graph } from "viz/types";

const viz = await instance();

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
		for (const match of dot.matchAll(/IMG SRC="(.*?)"/g)) {
			images.push({
				name: match[1],
				width: "20mm",
				height: "20mm",
			});
		}

		return images;
	};

	public dotToGraph = (dot: Dot): Graph => {
		const json = viz.renderString(dot, {
			format: "dot_json",
			images: this.extractImageList(dot),
		}) as string;

		return new JsonToGraph().convert(json);
	};

	public graphToSvg = (graph: Graph): Svg => {
		const images = graph.nodes?.filter((node) => node.attributes?.image)
			.map((node) => {
				return {
					name: node.attributes?.image,
					height: "2mm",
					width: "2mm",
				};
			});

		const svg = viz.renderString(graph, {
			format: "svg",
			images,
		}) as string;

		return svg;
	};

	public graphToDot = (graph: Graph): string => {
		return viz.renderString(graph, {
			format: "dot",
		}) as string;
	};
}
