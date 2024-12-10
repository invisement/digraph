export class ReadFile {
	fileHandle: FileSystemFileHandle | undefined = undefined;

	public selectFile = async () => {
		const [fileHandle]: FileSystemFileHandle[] = await globalThis
			.showOpenFilePicker({
				types: [{
					description: "Text Files",
					accept: {
						//"text/plain": [".txt", ".log", ".csv", ".json"],
					},
				}],
				multiple: false,
			});

		this.fileHandle = fileHandle;
		return await this.readFile();
	};

	public readFile = async () => {
		if (!this.fileHandle) {
			alert("No file is selected. Select a file please!");
		}
		const file = await this.fileHandle.getFile();
		const contents = await file.text();
		return contents;
	};
}
