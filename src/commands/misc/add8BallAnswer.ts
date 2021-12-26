import { Command } from '../../structures/Command';

export default new Command({
	name: 'agregar8ball',
	description: 'Agrega una respuesta personalizada',
	options: [
		{
			name: 'respuesta',
			description: 'La respuesta que quieres que diga el bot',
			type: 'STRING',
			required: true,
		},
	],
	userPermissions: ['ADMINISTRATOR'],
	run: async ({ client, interaction }) => {
		try {
			await interaction.deferReply({ ephemeral: true });
			const answer = interaction.options.getString('respuesta');

			const guildConfig = await client.db.guildConfig.findUnique({
				where: { guildId: interaction.guildId },
			});

			if (guildConfig) {
				await client.db.guildConfig.update({
					where: { guildId: interaction.guildId },
					data: { eightBallAnswers: [...guildConfig.eightBallAnswers, answer] },
				});
			} else {
				await client.db.guildConfig.create({
					data: {
						guildId: interaction.guildId,
						musicChannel: '',
						eightBallAnswers: [answer],
					},
				});
			}

			await interaction.editReply('Respuesta agregada correctamente');
		} catch (error) {
			console.error(error);
			await interaction.editReply('Error: ' + error.message);
		}
	},
});
