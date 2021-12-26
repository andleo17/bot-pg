import { MessageEmbed } from 'discord.js';
import { Command } from '../../structures/Command';
import { pickRandomAnimeGif } from '../../utils/tenorAPI';

export default new Command({
	name: 'beso',
	description: 'Dale un besito a alguien del server uwu.',
	options: [
		{
			name: 'usuario',
			description: 'Usuario al que quieres darle el besito OwO',
			type: 'USER',
			required: true,
		},
	],
	run: async ({ interaction }) => {
		const userKiss = interaction.options.getUser('usuario');
		const user = interaction.member;
		let kissGif: string;
		let kissEmbed: MessageEmbed;

		if (userKiss.id === user.id) {
			kissGif = await pickRandomAnimeGif('cry');
			kissEmbed = new MessageEmbed()
				.setDescription(`**${user} se quiere dar un beso solo xD**`)
				.setImage(kissGif);
		} else {
			kissGif = await pickRandomAnimeGif('kiss');

			kissEmbed = new MessageEmbed()
				.setDescription(`**${user} le da un besito a ${userKiss}**`)
				.setImage(kissGif);
		}

		await interaction.reply({
			embeds: [kissEmbed],
		});
	},
});
