import { Command } from '../../structures/Command';
import path from 'path';

export default new Command({
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
