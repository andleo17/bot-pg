require('dotenv').config();

import { PrismaClient } from '@prisma/client';
import { MyBot } from './structures/MyBot';

const prisma = new PrismaClient();

new MyBot({
	discordOptions: {
		intents: [
			'GUILDS',
			'GUILD_MESSAGES',
			'GUILD_MEMBERS',
			'GUILD_VOICE_STATES',
		],
	},
	prisma,
	withPlugins: true,
}).start();
