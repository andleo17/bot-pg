import {
	Client,
	ClientEvents,
	ClientOptions,
	Collection,
	ShardingManager,
} from 'discord.js';
import path from 'path';
import { getFiles } from '../utils/getFiles';
import { ActionType } from './Action';
import { Event } from './Event';
import { PrismaClient } from '@prisma/client';
import { TenorApi } from './Tenor';
import { ModerationClient } from './Moderation';
import { Commands } from '@typings';

export class MyBot extends Client {
	private prefixCommands: Commands.PrefixCommandType[];
	private slashCommands: Collection<string, Commands.SlashCommandType>;
	private customActions: Collection<string, ActionType>;
	public prefixes: Collection<string, string>;
	public db: PrismaClient;
	public tenor: TenorApi;
	public moderation: ModerationClient;

	public constructor(options: ClientOptions) {
		super(options);
		this.prefixCommands = [];
		this.slashCommands = new Collection();
		this.customActions = new Collection();
		this.prefixes = new Collection();
	}

	public async start(): Promise<void> {
		await this.readSlashCommands();
		await this.readPrefixCommands();
		await this.readEvents();
		await this.login(process.env.BOT_TOKEN);
		await this.readPrefixes();

		if (process.env.NODE_ENV === 'production') {
			const execArgv = [
				'--experimental-json-modules',
				'--expose-gc',
				'--optimize_for_size',
			];
			const manager = new ShardingManager('../index.js', {
				token: process.env.BOT_TOKEN,
				totalShards: 'auto',
				execArgv,
			});

			manager.on('shardCreate', (shard) => {
				console.log(`Shard ${shard.id} lanzada`);
			});

			manager.spawn({ timeout: Infinity });
		}
	}

	public setPrismaClient(prisma: PrismaClient) {
		this.db = prisma;
	}

	public setTenorApi(tenor: TenorApi) {
		this.tenor = tenor;
	}

	public setModerationClient(moderation: ModerationClient) {
		this.moderation = moderation;
	}

	public getPrefix(guildId: string): string {
		return this.prefixes.get(guildId);
	}

	public async setPrefix(guildId: string, prefix: string) {
		try {
			await this.db.guilds.upsert({
				where: { guildId },
				create: { guildId, prefix },
				update: { prefix },
			});
			this.prefixes.set(guildId, prefix);
		} catch (error) {
			console.error(error);
		}
	}

	private async readPrefixes() {
		try {
			const guildIds = this.guilds.cache.map((g) => g.id);
			const guildConfigs = await this.db.guilds.findMany();
			for (const guildId of guildIds) {
				const prefix = guildConfigs.find((g) => g.guildId === guildId)?.prefix;
				this.prefixes.set(guildId, prefix || process.env.BOT_PREFIX);
			}
			console.log('Prefijos cargados!');
		} catch (error) {
			console.error(error);
		}
	}

	public async registerCommands(guildId?: string): Promise<void> {
		try {
			await this.login(process.env.BOT_TOKEN);
			await this.readSlashCommands();
			const slashCommands = this.slashCommands.map((c) => c);
			if (guildId) {
				const slashCommands = this.slashCommands.map((c) => c);
				await this.guilds.cache.get(guildId)?.commands.set(slashCommands);
				console.log(`Registrando comandos en: ${guildId}`);
			} else {
				this.application.commands.set(slashCommands);
				console.log('Comandos registrados de manera global');
			}
			this.destroy();
		} catch (error) {
			console.error(error);
		}
	}

	public getSlashCommandHandler(name: string): Commands.SlashCommandType {
		return this.slashCommands.get(name);
	}

	public getPrefixCommandHandler(name: string): Commands.PrefixCommandType {
		return this.prefixCommands.find((c) => {
			const search = [c.name];
			if (c.aliases) search.push(...c.aliases);
			return search.includes(name);
		});
	}

	public getActionHandler(id: string): ActionType {
		return this.customActions.get(id);
	}

	private async importFile(filePath: string) {
		const file = await import(filePath);
		return file?.default;
	}

	private async readSlashCommands(): Promise<void> {
		try {
			for await (const file of getFiles(
				path.join(__dirname, '../slashCommands')
			)) {
				const slashCommand: Commands.SlashCommandType = await this.importFile(
					file
				);
				if (!slashCommand.name) return;
				this.slashCommands.set(slashCommand.name, slashCommand);
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async readPrefixCommands(): Promise<void> {
		try {
			for await (const file of getFiles(path.join(__dirname, '../commands'))) {
				const command: Commands.PrefixCommandType = await this.importFile(file);
				if (!command.name) return;
				this.prefixCommands.push(command);
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async readEvents(): Promise<void> {
		try {
			for await (const file of getFiles(path.join(__dirname, '../events'))) {
				const event: Event<keyof ClientEvents> = await this.importFile(file);
				this.on(event.name, (...args) => event.run(this, ...args));
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async readActions(): Promise<void> {
		try {
			for await (const file of getFiles(path.join(__dirname, '../actions'))) {
				const action: ActionType = await this.importFile(file);
				if (!action.id) return;
				this.customActions.set(action.id, action);
			}
		} catch (error) {
			console.error(error);
		}
	}
}
