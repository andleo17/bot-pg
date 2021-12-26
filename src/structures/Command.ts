import {
	ChatInputApplicationCommandData,
	CommandInteraction,
	PermissionResolvable,
} from 'discord.js';
import { MyBot } from '../structures/MyBot';

type RunOptions = {
	client: MyBot;
	interaction: CommandInteraction<'cached'>;
};

export type CommandType = {
	userPermissions?: PermissionResolvable[];
	cooldown?: number;
	run: (options: RunOptions) => any;
} & ChatInputApplicationCommandData;

export class Command {
	constructor(options: CommandType) {
		Object.assign(this, options);
	}
}
