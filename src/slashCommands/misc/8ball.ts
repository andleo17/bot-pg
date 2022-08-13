import { SlashCommand } from '@SlashCommand';
import { MessageEmbed } from 'discord.js';

export default new SlashCommand({
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
		const guildConfig = await client.db.guilds.findUnique({
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
