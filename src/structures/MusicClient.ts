import {
	Collection,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageOptions,
} from 'discord.js';
import DisTube, { DisTubeOptions, Queue, Song } from 'distube';
import { MyBot } from './MyBot';

export default class MyDistubeClient extends DisTube {
	private messagePlayers: Collection<string, Message>;

	public constructor(discordClient: MyBot, options?: DisTubeOptions) {
		super(discordClient, options);
		this.messagePlayers = new Collection();

		this.on('error', (_, e) => {
			console.error(e);
		});

		this.on('playSong', (q, _) => {
			const message = this.messagePlayers.get(q.id);
			if (message) message.edit(this.getPlayer(q.id));
		});

		this.on('deleteQueue', async (q) => {
			const message = this.messagePlayers.get(q.id);
			if (message) await message.delete();
		});
	}

	public getMessagePlayer(guildId: string): Message {
		return this.messagePlayers.get(guildId);
	}

	public setMessagePlayer(guildId: string, message: Message) {
		this.messagePlayers.set(guildId, message);
	}

	public getPlayer(guildId: string): MessageOptions {
		const queue = this.getQueue(guildId);
		return {
			embeds: [this.generatePlayerEmbed(queue)],
			components: [this.generatePlayerButtons()],
		};
	}

	private listQueue(queue: Queue): string {
		const maxLength = 45;
		return queue.songs
			.map((q, i) => {
				const title =
					q.name.length <= maxLength
						? q.name
						: q.name.substring(0, maxLength) + '...';
				return `**[${i + 1}]** [${title}](${q.url}) [${q.formattedDuration}]`;
			})
			.join('\n');
	}

	private generateCurrentSongFormat(song: Song): string {
		return song.name;
	}

	private generatePlayerEmbed(queue: Queue): MessageEmbed {
		return new MessageEmbed()
			.setTitle('Lista de reproducción 🎵')
			.setDescription(this.listQueue(queue))
			.setColor('DARK_BLUE')
			.addField('Sonando ahora', this.generateCurrentSongFormat(queue.songs[0]))
			.addFields([
				{
					name: 'Duración total',
					value: queue.formattedDuration,
				},
			]);
	}

	private generatePlayerButtons(): MessageActionRow {
		return new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel('Pausar')
				.setStyle('SUCCESS')
				.setCustomId('MUSIC_PAUSE'),
			new MessageButton()
				.setLabel('Saltar')
				.setStyle('PRIMARY')
				.setCustomId('MUSIC_SKIP'),
			new MessageButton()
				.setLabel('Detener')
				.setStyle('DANGER')
				.setCustomId('MUSIC_STOP'),
			new MessageButton()
				.setLabel('Mostrar letra')
				.setStyle('SECONDARY')
				.setCustomId('MUSIC_SHOWLYRICS')
		);
	}
}
