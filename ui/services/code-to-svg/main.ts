import { GraphViz } from "./graph-viz.ts";
import { DotSugar } from "./dot-sugar.ts";
//import { JsonSugar } from "./json-sugar.ts";

const dotSugar = new DotSugar();
//const jsonSugar = new JsonSugar();
const graphViz = new GraphViz();

import { Code, CodeToSvgConvertor, Svg } from "./interface.ts";
import { Graph } from "viz/types";

export class CodeToSVG implements CodeToSvgConvertor {
	public toShow(code: Code): Svg {
		const dot = dotSugar.unCoat(code);
		const graph = graphViz.dotToGraph(dot);
		const svg = graphViz.graphToSvg(graph);
		return svg;
	}

	public toDot(code: Code): Code {
		const dot = dotSugar.unCoat(code);
		const graph = graphViz.dotToGraph(dot);
		console.log(graph);
		return graphViz.graphToDot(graph);
	}

	public toGraph(code: Code): Graph {
		const dot = dotSugar.unCoat(code);
		const graph = graphViz.dotToGraph(dot);
		return graph;
	}

	public async toDownload(code: Code): Promise<Svg> {
		const svg = this.toShow(code);
		return await this.sprite(svg);
	}

	private urlToID = (url: string): string =>
		(url.split("/").pop() || "").split(".").at(0) || "";

	/** Downloads all innerSVGs and creates one big svg, mainly for downloading*/
	private sprite = async (svg: Svg): Promise<Svg> => {
		//let svg = this.svgString(code);
		const imageUrls = new Set<string>();

		const regex = /<image xlink:href="(?<url>.*?)" (?<attributes>.*?)\/>/g;
		const matches = svg.matchAll(regex);

		for (const match of matches) {
			const url = match.groups!.url;
			imageUrls.add(url);

			svg = svg.replace(
				match[0],
				`<use href="#${this.urlToID(url)}" ${
					match.groups!.attributes
				}/>`,
			);
		}

		const defs = await this.downloadInnerSVGs(imageUrls);

		return svg.replace(`</svg>`, `${defs} </svg>`);
	};

	private async downloadInnerSVGs(svgUrls: Set<string>): Promise<string> {
		const svgPromises = Array.from(svgUrls).map(async (url) => {
			const id = this.urlToID(url);
			let svgString = await fetch(url).then((r) => r.text());
			svgString = svgString
				.replace(/id\s*=\s*".*?"/, "")
				.replace("<svg ", `<symbol id="${id}" `)
				.replace(
					"</svg>",
					"</symbol>",
				);

			// Add svg id to each class so we can isolate it from other classes with the same name
			// const parts = svgString.split("<style");
			// parts.at(1) &&
			// 	(parts[1] = parts[1].replaceAll(
			// 		/\.\w/g,
			// 		(match) => `#${id} ${match}`,
			// 	));
			// return parts.join("<style");
			return svgString;
		});
		const svgSprite = `<defs style="display: none"> ${
			(await Promise.all(svgPromises)).join("\n")
		} </defs>`;
		return svgSprite;
	}
}
