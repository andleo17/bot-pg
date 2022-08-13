import { SlashCommand } from '@SlashCommand';

export default new SlashCommand({
	name: 'suerte',
	description: 'Deséale suerte a tu causa.',
	run: async ({ interaction }) => {
		await interaction.reply({ content: 'Comando en trabajo', ephemeral: true });
	},
});
