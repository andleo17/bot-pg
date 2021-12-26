import { MessageEmbed } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
	name: '8ball',
	description: 'Deja que el bot responda a tu pregunta.',
	options: [
		{
			name: 'pregunta',
			description: 'Lo que quieres preguntar',
			type: 'STRING',
			required: true,
		},
	],
	run: async ({ client, interaction }) => {
		await interaction.deferReply();
		const defaultAnswers = ['Sí :D', 'No :('];
		const guildConfig = await client.db.guildConfig.findUnique({
			where: { guildId: interaction.guildId },
		});
		const question = interaction.options.getString('pregunta');
		const answers =
			guildConfig?.eightBallAnswers.length > 0
				? guildConfig.eightBallAnswers
				: defaultAnswers;

		const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

		const answerEmbed = new MessageEmbed()
			.setAuthor({
				name: `${interaction.member.displayName} preguntó`,
				iconURL: interaction.member.displayAvatarURL(),
			})
			.setDescription(question)
			.addField('Respuesta:', randomAnswer);

		await interaction.editReply({ embeds: [answerEmbed] });
	},
});
