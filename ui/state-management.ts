import { ReadFile } from "./components/read-file.ts";
export const readFile = new ReadFile();

import { CodeEditor } from "./components/code-editor.ts";
customElements.define("code-editor", CodeEditor);
const codeEditor = document.querySelector("code-editor") as CodeEditor;

let codeSource: "file" | "editor" = "editor";

export function getCode(): Promise<string> {
	if (codeSource == "editor") return codeEditor.getCode();

	return readFile.readFile();
}

export function setCode(newValue: string) {
	codeSource = "editor";
	codeEditor.classList.remove("hidden");

	codeEditor.setCode(newValue);
}

export async function hideEditor() {
	await readFile.selectFile();

	if (codeSource == "file") return;

	codeEditor.classList.add("hidden");
	codeSource = "file";
}
