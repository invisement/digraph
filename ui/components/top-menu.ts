import { codeEditor, graphDrawer } from "../index.ts";

export class TopMenu extends HTMLElement {
	//static observedAttributes = [];

	shadow: ShadowRoot;
	examples: Record<string, string> = {};

	private html = () => /*html*/ `
		<input id=select-example list=example-list placeholder = "Examples">
		<span id=draw> Draw </span>
		<span id=open> Open </span>
		<span id=download> Download </span>
		<span id=png> save.png </span>

		<datalist id="example-list">
		</datalist>

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
	}

	async initialSetup() {
		const exampleNames = await this.populateDatalist();

		console.log("inital");
		const select = this.shadow.getElementById(
			"select-example",
		) as HTMLInputElement;
		select.value = exampleNames[0];
		select.dispatchEvent(new Event("change"));
		console.log(exampleNames[0]);
	}

	showExample = (e: Event) => {
		const exampleName = (e.currentTarget as HTMLInputElement)?.value;
		const example = this.examples[exampleName];
		codeEditor.setCode(example);

		this.showGraph();
	};

	populateDatalist = async () => {
		this.examples = await fetch("/examples").then((r) => r.json());

		const exampleNames = Object.keys(this.examples);
		const options = exampleNames.map((name) =>
			`<option id=${name}>${name}</option>`
		).join("\n");
		this.shadow.getElementById("example-list")!.innerHTML = options;

		return exampleNames;
	};

	showGraph = () => {
		const code = codeEditor!.getCode();
		graphDrawer!.show(code);
	};
	openGraph = () => {
		const code = codeEditor!.getCode();
		graphDrawer!.open(code);
	};
	downloadGraph = () => {
		const code = codeEditor!.getCode();
		graphDrawer!.download(code);
	};
	downloadPng = () => {
		const code = codeEditor!.getCode();
		graphDrawer!.downloadPng(code);
	};
}
