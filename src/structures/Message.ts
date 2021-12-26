import { Message } from 'discord.js';
import { MyBot } from './MyBot';

type RunOptions = {
	message: Message<true>;
	client: MyBot;
};

export type MessageType = {
	text: string;
	exact?: boolean;
	ignoreCase?: boolean;
	run: (options: RunOptions) => any;
};

export class CustomMessage {
	constructor({ exact = true, ignoreCase = true, ...rest }: MessageType) {
		const options = { ...rest, exact, ignoreCase };
		Object.assign(this, options);
	}
}
