import { ButtonInteraction } from 'discord.js';
import { MyBot } from './MyBot';

type RunOptions = {
	interaction: ButtonInteraction<'cached'>;
	client: MyBot;
};

export type ActionType = {
	id: string;
	run: (options: RunOptions) => any;
};

export class Action {
	constructor(options: ActionType) {
		Object.assign(this, options);
	}
}
