import { SlashCommand } from '@SlashCommand';
import { MessageEmbed } from 'discord.js';

export default new SlashCommand({
	name: 'mute',
	description: 'Mutea a alguien.',
	options: [
		{
			name: 'usuario',
			description: 'Usuario al que quieres mutear',
			type: 'USER',
			required: true,
		},
		{
			name: 'tiempo',
			description: 'Tiempo en minutos',
			type: 'NUMBER',
			required: true,
		},
		{
			name: 'razón',
			description: '¿Por qué lo vas a mutear?',
			type: 'STRING',
			required: true,
		},
	],
	userPermissions: ['MODERATE_MEMBERS', 'ADMINISTRATOR'],
	run: async ({ interaction }) => {
		const user = interaction.options.getUser('usuario');
		const time = interaction.options.getNumber('tiempo');
		const reason = interaction.options.getString('razón');

		if (time <= 0)
			return interaction.reply({
				ephemeral: true,
				content: 'Debes colocar un tiempo válido',
			});

		const userInGuild = interaction.guild.members.resolve(user.id);
		await userInGuild.timeout(time * 60 * 1000, reason);

		const timeoutEmbed = new MessageEmbed()
			.setTitle('Usuario muteado')
			.addField('Usuario', user.username)
			.addField('Razón', reason, true)
			.addField('Tiempo', time + ' minutos')
			.setFooter(
				`Muteado por: ${interaction.user.username}`,
				interaction.user.displayAvatarURL()
			);

		await interaction.reply({
			embeds: [timeoutEmbed],
		});
	},
});
