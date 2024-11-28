import { Router } from "@invisement/husk";

export const router = new Router({});

import * as examples from "../test/data-samples/examples.ts";
const examplesJson = JSON.stringify(examples);

new class {
	@router.assign("/examples", { method: "GET" })
	getExamples() {
		return examplesJson;
	}
}();
