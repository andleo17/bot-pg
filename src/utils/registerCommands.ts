require('dotenv').config();

import { Intents } from 'discord.js';
import { MyBot } from '../structures/MyBot';

const bot = new MyBot({
	discordOptions: {
		intents: [Intents.FLAGS.GUILDS],
	},
});

bot.registerCommands();
