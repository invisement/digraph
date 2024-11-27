export type Code = string;
export type Svg = string;
export type Dot = string;

export interface CodeToSvgConvertor {
	toShow(code: Code): Svg;
	toDownload(code: Code): Promise<Svg>;
}
