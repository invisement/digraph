import { CodeJar } from "codejar";

export class CodeEditor extends HTMLElement {
	private editor: ReturnType<typeof CodeJar>;

	html = /*html*/ `
		<div id="editor"></div>
		<style>
			div {
				height: 100%;
			}
		</style>
	`;

	constructor() {
		super();

		const shadow = this.attachShadow({ mode: "open" });
		shadow.innerHTML = this.html;
		this.editor = CodeJar(shadow.querySelector("#editor"), (x: string) => x);
	}

	getCode = () => {
		return this.editor.toString();
	};
}
