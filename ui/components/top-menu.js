import { draw } from "./state-management.js"

class TopMenu extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });

		shadow.innerHTML = this.html() + `<style> ${this.style()} </style>`;

		shadow.getElementById('draw').addEventListener('click', draw)
	}

	html = () => `
		<span id=draw> Draw </span>
	`

	style = () => `<style>
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
	</style>`



}

customElements.define('top-menu', TopMenu);

