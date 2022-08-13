import { SlashCommand } from '@SlashCommand';

export default new SlashCommand({
	name: 'pipilink',
	description: 'Sorpresa',
	run: async ({ interaction }) => {
		try {
			interaction.reply('Comando pipilink en mantenimiento :(');
		} catch (error) {
			console.error(error);
		}
	},
});
