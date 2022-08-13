import { MessageEmbed } from 'discord.js';
import { Command } from '../../structures/SlashCommand';

export default new Command({
	name: 'avatar',
	description: 'Muestra la foto de perfil de un usuario',
	options: [
		{
			name: 'usuario',
			description: 'Usuario del que quieres ver la foto',
			type: 'USER',
			required: true,
		},
	],
	run: ({ interaction }) => {
		const selectedUser = interaction.options.getUser('usuario');
		const userAvatarEmbed = new MessageEmbed()
			.setAuthor(`Foto de ${selectedUser.username}`)
			.setImage(selectedUser.displayAvatarURL({ size: 600 }))
			.setFooter(
				`La persona que pidió la foto: ${interaction.member.displayName}`,
				interaction.member.displayAvatarURL()
			);

		interaction.reply({ embeds: [userAvatarEmbed] });
	},
});
