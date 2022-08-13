import { Commands } from '@typings';

export class SlashCommand {
	constructor(options: Commands.SlashCommandType) {
		Object.assign(this, options);
	}
}
