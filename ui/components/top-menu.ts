import { codeEditor, graphDrawer } from "../index.ts";

export class TopMenu extends HTMLElement {
	//static observedAttributes = [];

	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });

		shadow.innerHTML = this.html();

		shadow.getElementById("draw")?.addEventListener("click", this.showGraph);
		shadow.getElementById("open")?.addEventListener("click", this.openGraph);
		shadow.getElementById("download")?.addEventListener(
			"click",
			this.downloadGraph,
		);
	}

	private html = () => /*html*/ `
		<span id=draw> Draw </span>
		<span id=open> Open </span>
		<span id=download> Download </span>
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
	</style>`;

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
}
