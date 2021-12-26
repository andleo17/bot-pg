import {
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageOptions,
} from 'discord.js';
import DisTube, { DisTubeOptions, Queue, Song } from 'distube';
import { MyBot } from './MyBot';

export default class MyDistubeClient extends DisTube {
	private mPlayer: Message;

	public constructor(discordClient: MyBot, options?: DisTubeOptions) {
		super(discordClient, options);

		this.on('error', (_, e) => {
			console.error(e);
		});

		this.on('playSong', (_, e) => {
			console.log('Reproduciendo:', e.name);
		});
	}

	public set messagePlayer(v: Message) {
		if (v.inGuild()) this.mPlayer = v;
	}

	public get messagePlayer(): Message {
		return this.mPlayer;
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
