import { Command } from '../../structures/Command';

export default new Command({
	name: 'suerte',
	description: 'Deséale suerte a tu causa.',
	run: async ({ interaction }) => {
		await interaction.reply({ content: 'Comando en trabajo', ephemeral: true });
	},
});
