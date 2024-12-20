/** GraphViz converts DOT to JSON format/type and
this module convert that JSON format into Graph type.
We can manipulate this Graph format for sugar coatings.
GraphViz accepts Graph type to produce svg format
*/

import { Attributes, Edge, Graph, Node, Subgraph } from "viz/types";

export type _GVID = number;

export type JsonNode = {
	_gvid: _GVID;
	name: string;
} & Attributes;

export type JsonSubgraph = {
	_gvid: _GVID;
	name: string;

	nodes?: _GVID[];
	edges?: _GVID[];
	subgraphs?: _GVID[];
} & Attributes;

export type PreFlatSubgraph = {
	_gvid: _GVID;
	name: string;
	nodes?: _GVID[];
	edges?: _GVID[];
	subgraphs?: _GVID[];
	graphAttributes?: Attributes;
};

export type FlatSubgraph = {
	_gvid: _GVID;
	name: string;
	nodes?: Node[];
	edges?: _GVID[];
	subgraphs?: _GVID[];
	graphAttributes?: Attributes;
};

export type JsonEdge = Attributes & {
	_gvid: _GVID;
	head: _GVID;
	tail: _GVID;
};

export type JsonGraph = Attributes & {
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

export interface JsonToGraphConverter {
	convert(jsonGraph: JsonGraph): Graph;
	edgeToGraphEdge(jsonEdge: JsonEdge): Edge;
	objectToNode(jsonNode: JsonNode): Node;
	objectToSubgraph(jsonObject: JsonSubgraph): PreFlatSubgraph;
	nestSubgraphs(flatSubgraphs: FlatSubgraph[]): Subgraph[];
}

export class JsonToGraph implements JsonToGraphConverter {
	// Graph uses name instead of _gvid in json output
	objectIdToName: Map<_GVID, string> = new Map();

	objectToSubgraph = (
		{ _gvid, name, nodes, subgraphs, edges, ...graphAttributes }:
			JsonSubgraph,
	): PreFlatSubgraph => {
		if (graphAttributes.label) {
			graphAttributes.label = {
				html: graphAttributes.label as string,
			};
		}

		return {
			_gvid,
			name,
			nodes,
			edges,
			subgraphs,
			graphAttributes,
		};
	};

	objectToNode = (
		{ name, ...attributes }: { name: string } & Attributes,
	): Node => {
		if (attributes.shape != "record") {
			attributes.label = {
				html: attributes.label as string,
			};
		}

		return {
			name,
			attributes,
		};
	};

	edgeToGraphEdge = ({ tail, head, ...attributes }: JsonEdge): Edge => {
		if (attributes.label) {
			attributes.label = { html: attributes.label as string };
		}
		return {
			//				_gvid,
			tail: this.objectIdToName.get(tail) || "",
			head: this.objectIdToName.get(head) || "",
			attributes,
		};
	};

	nestSubgraphs = (subgraphs: FlatSubgraph[]): Subgraph[] => {
		const nameMap = new Map<number, Subgraph>();

		// Create nodes for all subgraphs first
		for (const subgraph of subgraphs) {
			nameMap.set(subgraph._gvid, {
				...subgraph,
				subgraphs: [],
				edges: undefined,
			});
		}

		// Build the parent-child relationships
		for (const subgraph of subgraphs) {
			if (!subgraph.subgraphs) continue;
			const parentNode = nameMap.get(subgraph._gvid)!;

			for (const _gvid of subgraph.subgraphs) {
				const childNode = nameMap.get(_gvid)!;
				parentNode.subgraphs!.push(childNode);
			}
		}

		// Find root nodes (those not listed as subgraph of any other one)
		const rootSubgraphs: Subgraph[] = [];

		const subgraph_gvids = subgraphs.flatMap((s) => s.subgraphs || []);
		for (const [_gvid, subgraph] of nameMap) {
			if (subgraph_gvids.includes(_gvid)) continue;

			rootSubgraphs.push(subgraph);
		}

		return rootSubgraphs;
	};

	public convert({
		name,
		directed,
		strict,
		_subgraph_cnt,

		objects,
		edges,
		nodeAttributes,
		edgeAttributes,

		...graphAttributes
	}: JsonGraph): Graph {
		for (const { _gvid, name } of objects) {
			this.objectIdToName.set(_gvid, name);
		}

		const allSubgraphs = objects
			.splice(0, _subgraph_cnt)
			.map(this.objectToSubgraph);

		const nodes: Node[] = objects
			.map(this.objectToNode);

		const graphEdges: Edge[] = edges
			?.map(this.edgeToGraphEdge);

		// convert subgraph nodes from _gvid to full node
		const flatSubgraphs: FlatSubgraph[] = allSubgraphs.map(
			(subgraph: PreFlatSubgraph) => {
				const subgraphNodes: Node[] | undefined = subgraph.nodes?.map(
					(_gvid: number) => {
						return nodes.find((node) =>
							node.attributes?._gvid == _gvid
						) as Node;
					},
				);
				return { ...subgraph, nodes: subgraphNodes };
			},
		);

		const subgraphs = this.nestSubgraphs(flatSubgraphs);

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
}
