import { resolve } from 'path';
import { readdir } from 'fs/promises';

export async function* getFiles(dir: string): AsyncGenerator<string> {
	const dirents = await readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* getFiles(res);
		} else {
			yield res;
		}
	}
}
