import { SlashCommand } from '@SlashCommand';
import { MessageEmbed, TextChannel } from 'discord.js';

export default new SlashCommand({
	name: 'play',
	description: 'Reproduce música de YouTube',
	options: [
		{
			type: 'STRING',
			name: 'canción',
			description: 'Ingresa el título de la canción o una URL',
			required: true,
		},
		{
			type: 'BOOLEAN',
			name: 'ahora',
			description:
				'Indica si quieres que suene ahora mismo o que se agregue a la cola',
			required: false,
		},
	],
	run: async ({ client, interaction }) => {
		try {
			const { db } = client;
			const distube: any = '';
			await interaction.deferReply();

			const voiceChannel = interaction.member.voice.channel;
			if (!voiceChannel)
				return interaction.editReply({
					content: 'Debes conectarte a un canal de voz pe ctmr',
				});

			const songName = interaction.options.getString('canción');
			const playNow = interaction.options.getBoolean('ahora');
			const searchResults = await distube.search(songName);

			if (searchResults.length === 0) {
				return interaction.reply({
					content: `No se encontraron para *${songName}*`,
					ephemeral: true,
				});
			}

			const song = searchResults[0];

			await distube.playVoiceChannel(voiceChannel, song);

			const messagePlayer = distube.getMessagePlayer(interaction.guildId);
			const player = distube.getPlayer(interaction.guildId);

			if (!messagePlayer) {
				const guildConfig = await db.guilds.findUnique({
					where: { guildId: interaction.guildId },
				});
				let musicChannelInGuild: TextChannel;
				if (guildConfig) {
					const channelMusicInGuild = await interaction.guild.channels.fetch(
						guildConfig.musicChannel
					);

					if (!channelMusicInGuild.isText())
						return interaction.editReply({
							content: '¡Error! El canal configurado no es un canal de texto',
						});

					if (channelMusicInGuild.type === 'GUILD_NEWS')
						return interaction.editReply(
							'¡Error! El canal configurado en un canal de noticias'
						);

					musicChannelInGuild = channelMusicInGuild;
				} else {
					musicChannelInGuild =
						interaction.channel.isText() &&
						interaction.channel.type === 'GUILD_TEXT' &&
						interaction.channel;
				}

				const sentMessagePlayer = await musicChannelInGuild.send(player);
				distube.setMessagePlayer(interaction.guildId, sentMessagePlayer);
			} else {
				messagePlayer.edit(player);
			}

			const songAddedEmbed = new MessageEmbed()
				.setTitle('Canción agregada correctamente')
				.addField('Nombre', song.name)
				.addField('Duración', song.formattedDuration)
				.setFooter(
					`Añadido por: ${interaction.member.displayName}`,
					interaction.member.displayAvatarURL()
				);

			await interaction.editReply({
				embeds: [songAddedEmbed],
			});
		} catch (error) {
			console.error(error);
			interaction.editReply('Hubo un error al ejecutar el comando');
		}
	},
});
