import type { Graph } from "viz/types";

export type Code = string;
export type Svg = string;
export type Dot = string;
export type Json = string;

export interface CodeToSvgConvertor {
	toShow(code: Code): Svg;
	toDownload(code: Code): Promise<Svg>;
}

export interface GraphVizInterface {
	dotToGraph(dot: Dot): Graph;
	graphToSvg(graph: Graph): Svg;
}

/** for unCoating sugar coated stuff */
export interface Sugar<T> {
	unCoat(input: T): T;
}
