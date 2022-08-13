import { Commands } from '@typings';

export class PrefixCommand {
	constructor(options: Commands.PrefixCommandType) {
		Object.assign(this, options);
	}
}
