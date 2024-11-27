import { DotToSVG } from "./dot-to-svg.ts";
import { CodeToDot } from "./code-to-dot.ts";

const codeToDot = new CodeToDot();
const dotToSvg = new DotToSVG();

import { Code, CodeToSvgConvertor, Svg } from "./interface.ts";

export class CodeToSVG implements CodeToSvgConvertor {
	public toShow(code: Code): Svg {
		const dot = codeToDot.convert(code);
		const svg = dotToSvg.svgString(dot);
		return svg;
	}

	public async toDownload(code: Code): Promise<Svg> {
		const svg = this.toShow(code);
		return await this.sprite(svg);
	}

	/** Downloads all innerSvgs and creates one big svg, mainly for downloading*/
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
