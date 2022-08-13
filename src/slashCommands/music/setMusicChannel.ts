import { SlashCommand } from '@SlashCommand';

export default new SlashCommand({
	name: 'setmusicchannel',
	description:
		'Configura un canal para que el bot de música pueda hacer su spam.',
	options: [
		{
			name: 'canal',
			description: 'Canal en cuestión',
			type: 'CHANNEL',
			required: true,
		},
	],
	userPermissions: ['ADMINISTRATOR'],
	run: async ({ client, interaction }) => {
		try {
			await interaction.deferReply({ ephemeral: true });
			const channel = interaction.options.getChannel('canal', true);

			await client.db.guilds.upsert({
				where: { guildId: interaction.guildId },
				create: { guildId: interaction.guildId, musicChannel: channel.id },
				update: { musicChannel: channel.id },
			});

			await interaction.editReply({
				content: 'Canal configurado correctamente',
			});
		} catch (error) {
			console.error(error);
		}
	},
});
