import { TopMenu } from "./components/top-menu.ts";
import { CodeEditor } from "./components/code-editor.ts";
import { DrawGraph } from "./components/draw-graph.ts";
import { ReadFile } from "./components/read-file.ts";

customElements.define("top-menu", TopMenu);
customElements.define("code-editor", CodeEditor);
customElements.define("draw-graph", DrawGraph);

export const codeEditor = document.querySelector("code-editor") as CodeEditor;

export const graphDrawer = document.querySelector("draw-graph") as DrawGraph;

export const readFile = new ReadFile();
