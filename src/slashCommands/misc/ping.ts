import { SlashCommand } from '@SlashCommand';

export default new SlashCommand({
	name: 'ping',
	description: 'replies with pong',
	run: async ({ interaction }) => {
		interaction.reply('pong');
		interaction.member;
	},
});
