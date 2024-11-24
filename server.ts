import { Router } from "@invisement/husk";

const router = new Router()


// const svgString = (await instance()).renderString("digraph { a -> b }", { format: "svg" });

// console.log(svgString)


import { watchUI } from "jsr:@invisement/husk/transpile-ui";
import { uiEntrypoints, uiOutDir, uiSourceDir } from "./config.ts";

const isDev = Deno.args.includes("--watch-ui");
const uiDir = isDev ? await watchUI(uiSourceDir, uiEntrypoints) : uiOutDir;
console.log("UI OUt Directory is", uiDir);


// Serve ui and static files
router.push("/", `${uiDir}/index.html`, {headers: {Location: `${uiDir}/index.html`}});
router.push("/index.:ext", `${uiDir}/index.:ext`);
router.push("/ui/:path*", `${uiDir}/:path`);


Deno.serve(async (req) => {
	// if (req.url == "http://127.0.0.1:8000/") {
	// 	console.log("here")
	// 	return Response.redirect(req.url + "ui/index.html");
	// }

	const resp = await router.serve(req);
	if (resp === null) {
		return new Response("404: Resource Not Found!", { status: 404 });
	}
	return resp;
});