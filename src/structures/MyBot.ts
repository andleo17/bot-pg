import { PrismaClient } from '@prisma/client';
import {
	ApplicationCommandDataResolvable,
	Client,
	ClientEvents,
	ClientOptions,
	Collection,
} from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { ActionType } from './Action';
import { CommandType } from './Command';
import { Event } from './Event';
import { MessageType } from './Message';
import MyDistubeClient from './MusicClient';

type MyBotOptions = {
	discordOptions?: ClientOptions;
	prisma?: PrismaClient;
	withPlugins?: boolean;
};

export class MyBot extends Client {
	private commands: Collection<string, CommandType>;
	private slashCommands: ApplicationCommandDataResolvable[];
	private messages: MessageType[];
	private customActions: Collection<string, ActionType>;
	public db: PrismaClient;
	public distube: MyDistubeClient;

	public constructor({ discordOptions, prisma, withPlugins }: MyBotOptions) {
		super(discordOptions);
		this.commands = new Collection();
		this.slashCommands = [];
		this.messages = [];
		this.customActions = new Collection();
		if (withPlugins) {
			this.db = prisma;
			this.distube = new MyDistubeClient(this, {
				searchSongs: 1,
				leaveOnStop: true,
				leaveOnEmpty: true,
				leaveOnFinish: true,
				updateYouTubeDL: false,
			});
		}
	}

	public start(): void {
		this.readCommands();
		this.readEvents();
		this.readMessages();
		this.readActions();
		this.login(process.env.BOT_TOKEN);
	}

	public async registerCommands(guildId?: string): Promise<void> {
		try {
			await this.login(process.env.BOT_TOKEN);
			await this.readCommands();
			if (guildId) {
				await this.guilds.cache.get(guildId)?.commands.set(this.slashCommands);
				console.log(`Registrando comandos en: ${guildId}`);
			} else {
				const guilds = this.guilds.cache.map((g) => g);
				for (const g of guilds) {
					await g.commands.set(this.slashCommands);
					console.log(`Registrando comandos en: ${g.name}`);
				}
			}
			this.destroy();
		} catch (error) {
			console.error(error);
		}
	}

	public getCommandHandler(name: string): CommandType {
		return this.commands.get(name);
	}

	public getMessageHandler(text: string): MessageType {
		return null;
		return this.messages.find((m) => {
			let tranformedMessage = text;
			if (m.ignoreCase) {
				tranformedMessage = tranformedMessage.toLowerCase();
				m.text = m.text.toLowerCase();
			}
			if (!m.exact) {
				tranformedMessage = tranformedMessage.replaceAll(' ', '');
			}

			return tranformedMessage.includes(m.text);
		});
	}

	public getActionHandler(id: string): ActionType {
		return this.customActions.get(id);
	}

	private async importFile(filePath: string) {
		const file = await import(filePath);
		return file?.default;
	}

	private async readCommands(): Promise<void> {
		try {
			const commandsPath = path.join(__dirname, '../commands/');
			const commandFolders = await fs.readdir(commandsPath);
			for (const commandFiles of commandFolders) {
				const files = await fs.readdir(path.join(commandsPath, commandFiles));
				for (const file of files) {
					const command: CommandType = await this.importFile(
						path.join(commandsPath, commandFiles, file)
					);
					if (!command.name) return;
					this.commands.set(command.name, command);
					this.slashCommands.push(command);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async readEvents(): Promise<void> {
		try {
			const eventPath = path.join(__dirname, '../events/');
			const eventFiles = await fs.readdir(eventPath);
			for (const filePath of eventFiles) {
				const event: Event<keyof ClientEvents> = await this.importFile(
					path.join(eventPath, filePath)
				);
				this.on(event.name, (...args) => event.run(this, ...args));
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async readMessages(): Promise<void> {
		try {
			const messagePath = path.join(__dirname, '../messages/');
			const messageFiles = await fs.readdir(messagePath);
			for (const filePath of messageFiles) {
				const message: MessageType = await this.importFile(
					path.join(messagePath, filePath)
				);
				if (!message.text) return;
				this.messages.push(message);
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async readActions(): Promise<void> {
		try {
			const actionsPath = path.join(__dirname, '../actions/');
			const actionFolders = await fs.readdir(actionsPath);
			for (const actionFiles of actionFolders) {
				const files = await fs.readdir(path.join(actionsPath, actionFiles));
				for (const file of files) {
					const action: ActionType = await this.importFile(
						path.join(actionsPath, actionFiles, file)
					);
					if (!action.id) return;
					this.customActions.set(action.id, action);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
}
