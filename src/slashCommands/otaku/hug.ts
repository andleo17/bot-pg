import { MessageEmbed } from 'discord.js';
import { pickRandomAnimeGif } from '@utils/tenorAPI';
import { SlashCommand } from '@SlashCommand';

export default new SlashCommand({
	name: 'abrazo',
	description: 'Abraza a alguien',
	options: [
		{
			name: 'usuario',
			description: 'Usuario al que quieres abrazar',
			type: 'USER',
			required: true,
		},
	],
	run: async ({ interaction }) => {
		const userHug = interaction.options.getUser('usuario');
		const user = interaction.member;
		let hugGif: string;
		let hugEmbed: MessageEmbed;

		if (userHug.id === user.id) {
			hugGif = await pickRandomAnimeGif('cry');
			hugEmbed = new MessageEmbed()
				.setDescription(
					`**${user} se quiere dar un abrazo solo. F en el chat**`
				)
				.setImage(hugGif);
		} else {
			hugGif = await pickRandomAnimeGif('hug');

			hugEmbed = new MessageEmbed()
				.setDescription(`**${user} le da un abrazo a ${userHug}**`)
				.setImage(hugGif);
		}

		await interaction.reply({
			embeds: [hugEmbed],
		});
	},
});
