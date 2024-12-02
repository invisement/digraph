import { instance } from "@viz-js/viz";
import { Dot, GraphVizInterface, Svg } from "./interface.ts";

import { Attributes, Edge, Graph, Node, Subgraph } from "viz/types";

type _GVID = number;

type JsonNode = {
	_gvid: _GVID;
	name: string;
} & Attributes;

type JsonSubgraph = {
	nodes?: _GVID[];
	edges?: _GVID[];
	subgraphs?: _GVID[];
} & JsonNode;

type JsonSubgraph2 = {
	_gvid: _GVID;
	name: string;
	nodes?: _GVID[];
	edges?: _GVID[];
	subgraphs?: _GVID[];
	graphAttributes?: Attributes;
};

type JsonEdge = Attributes & {
	_gvid: _GVID;
	head: _GVID;
	tail: _GVID;
};

type JsonGraph = Attributes & {
	name: string;
	directed: boolean;
	strict: boolean;
	bb: string;
	_subgraph_cnt: number;
	objects: (JsonNode | JsonSubgraph)[];
	edges: JsonEdge[];

	nodeAttributes?: Attributes;
	edgeAttributes?: Attributes;
};

type GvIdToNameMapper = Record<_GVID, string>;

function json2Graph(dotJson: string): Graph {
	const {
		name,
		directed,
		strict,
		_subgraph_cnt,

		objects,
		edges,
		nodeAttributes,
		edgeAttributes,

		...graphAttributes
	}: JsonGraph = JSON.parse(dotJson);

	// Graph uses name instead of _gvid in json output
	const objectIdToName: GvIdToNameMapper = {};
	for (const { _gvid, name } of objects) {
		objectIdToName[_gvid] = name;
	}

	const allSubgraphs: JsonSubgraph2[] = objects
		.splice(0, _subgraph_cnt)
		.map(
			(
				{ _gvid, name, nodes, subgraphs, edges, ...graphAttributes }:
					JsonSubgraph,
			) => {
				return {
					_gvid,
					name,
					nodes,
					edges,
					subgraphs,
					graphAttributes,
				};
			},
		);

	const nodes: Node[] = objects
		.map(({ name, ...attributes }) => {
			if (attributes.shape != "record") {
				attributes.label = {
					html: attributes.label as string,
				};
			}

			return {
				name,
				attributes,
			};
		});

	const subgraphs: Subgraph[] = allSubgraphs.map((subgraph) => {
		const graphSubgraph: Subgraph = {
			...subgraph,
			nodes: [],
			subgraphs: [],
			edges: undefined,
		};
		graphSubgraph.subgraphs = subgraph.subgraphs?.map((_gvid) =>
			allSubgraphs.find((sub) => sub._gvid == _gvid) as Subgraph
		);

		graphSubgraph.nodes = subgraph.nodes?.map((_gvid) =>
			nodes.find((node) => node.attributes?._gvid == _gvid) as Node
		);

		return graphSubgraph as Subgraph;
	});

	const graphEdges: Edge[] = edges
		?.map(({ tail, head, ...attributes }: JsonEdge) => {
			return {
				//				_gvid,
				tail: objectIdToName[tail],
				head: objectIdToName[head],
				attributes,
			};
		});

	return {
		name,
		directed,
		strict,
		graphAttributes,
		nodeAttributes,
		edgeAttributes,
		nodes,
		edges: graphEdges,
		subgraphs,
	};
}

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
		for (const match of dot.matchAll(/img src="(.*?)"/g)) {
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

		return json2Graph(json);
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
}
