import { GraphViz } from "./graph-viz.ts";
import { DotSugar } from "./dot-sugar.ts";
import { JsonSugar } from "./json-sugar.ts";

const dotSugar = new DotSugar();
const jsonSugar = new JsonSugar();
const graphViz = new GraphViz();

import { Code, CodeToSvgConvertor, Svg } from "./interface.ts";

export class CodeToSVG implements CodeToSvgConvertor {
	public toShow(code: Code): Svg {
		const dot = dotSugar.unCoat(code);
		console.log("modified dot is", dot);
		let json = graphViz.dotToJson(dot);
		console.log("json is", json);
		//json = jsonSugar.unCoat(json);
		const svg = graphViz.jsonToSvg(json);
		console.log("svg string is", svg);
		return svg;
	}

	public async toDownload(code: Code): Promise<Svg> {
		const svg = this.toShow(code);
		return await this.sprite(svg);
	}

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
				`<use href="#${url}" ${match.groups!.attributes}/>`,
			);
		}

		const defs = await this.downloadInnerSVGs(imageUrls);

		return svg.replace(`</svg>`, `${defs} </svg>`);
	};

	private async downloadInnerSVGs(svgUrls: Set<string>): Promise<string> {
		const svgPromises = Array.from(svgUrls).map(async (url) => {
			let svgString = await fetch(url).then((r) => r.text());
			svgString = svgString
				.replace("<svg ", `<symbol id="${url}" `)
				.replace(
					"</svg>",
					"</symbol>",
				);
			return svgString;
		});
		const svgSprite = `<defs style="display: none"> ${
			(await Promise.all(svgPromises)).join("\n")
		} </defs>`;
		return svgSprite;
	}
}
