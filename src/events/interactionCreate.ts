import { Event } from '../structures/Event';

export default new Event('interactionCreate', async (client, interaction) => {
	if (!interaction.inCachedGuild()) return;
	if (interaction.isCommand()) {
		try {
			const command = client.getSlashCommandHandler(interaction.commandName);
			if (!command) return interaction.reply('El comando no existe');
			command.run({ client, interaction });
		} catch (error) {
			interaction.reply({ ephemeral: true, content: error.message });
		}
	}

	if (interaction.isButton()) {
		const action = client.getActionHandler(interaction.customId);
		if (!action) return console.error('Acción no contemplada');

		action.run({ client, interaction });
	}
});
