///import { graphDrawer } from "../index.ts";
import { hideEditor, setCode } from "../state-management.ts";

export const graphDrawer = document.querySelector("draw-graph") as DrawGraph;

export class TopMenu extends HTMLElement {
	//static observedAttributes = [];

	shadow: ShadowRoot;
	examples: Record<string, string> = {};

	private html = () => /*html*/ `
		<select id=select-example placeholder = "Examples"></select>
		<span id=draw> Draw </span>
		<span id=open> Open </span>
		<span id=download> Download </span>
		<span id=png> Save.png </span>
		<span id=dot> DOT </span>
		<span id=json> JSON </span>
		<span id="select-file">Select File</span>
		<span id="draw-file">Draw File </span>


		<style>
			:host {
				display: flex;
				gap: 1em;
				align-items: center;
				text-align: center;
				font-family: "system-ui";
			}
			span {
				cursor: pointer;
			}
		</style>
	`;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });

		this.shadow.innerHTML = this.html();

		this.initialSetup();

		this.shadow.getElementById("draw")?.addEventListener(
			"click",
			this.showGraph,
		);
		this.shadow.getElementById("open")?.addEventListener(
			"click",
			this.openGraph,
		);
		this.shadow.getElementById("download")?.addEventListener(
			"click",
			this.downloadGraph,
		);
		this.shadow.getElementById("png")?.addEventListener(
			"click",
			this.downloadPng,
		);
		this.shadow.getElementById("select-example")?.addEventListener(
			"change",
			this.showExample,
		);
		this.shadow.getElementById("dot")?.addEventListener(
			"click",
			this.showDOT,
		);
		this.shadow.getElementById("json")?.addEventListener(
			"click",
			() => graphDrawer.showJSON(),
		);

		this.shadow.getElementById("select-file")?.addEventListener(
			"click",
			async () => {
				await hideEditor();
				graphDrawer.show();
			},
		);
		this.shadow.getElementById("draw-file")?.addEventListener(
			"click",
			() => {
				graphDrawer.show();
			},
		);
	}

	async initialSetup() {
		const exampleNames = await this.populateSelectExamples();

		const select = this.shadow.getElementById(
			"select-example",
		) as HTMLInputElement;
		select.value = exampleNames[0];
		select.dispatchEvent(new Event("change"));
	}

	showExample = (e: Event) => {
		const exampleName = (e.currentTarget as HTMLInputElement)?.value;
		const example = this.examples[exampleName];
		setCode(example);

		this.showGraph();
	};

	populateSelectExamples = async () => {
		this.examples = await fetch("/examples").then((r) => r.json());

		const exampleNames = Object.keys(this.examples);
		const options = exampleNames.map((name) =>
			`<option id=${name}>${name}</option>`
		).join("\n");
		this.shadow.getElementById("select-example")!.innerHTML = options;

		return exampleNames;
	};

	showGraph = () => {
		graphDrawer!.show();
	};
	openGraph = () => {
		graphDrawer!.open();
	};
	downloadGraph = () => {
		graphDrawer!.download();
	};
	downloadPng = () => {
		graphDrawer!.downloadPng();
	};
	showDOT() {
		graphDrawer.showDOT();
	}
}
