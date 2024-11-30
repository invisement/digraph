import type { Json, Sugar } from "./interface.ts";

export class JsonSugar implements Sugar<Json> {
	public unCoat(json: Json): Json {
		return json;
	}
}
