import { ClientEvents } from 'discord.js';
import { MyBot } from './MyBot';

export class Event<Key extends keyof ClientEvents> {
	public constructor(
		public name: Key,
		public run: (client: MyBot, ...args: ClientEvents[Key]) => any
	) {}
}
