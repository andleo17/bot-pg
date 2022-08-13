require('dotenv').config();

import { PrismaClient } from '@prisma/client';
import { MyBot } from './structures/MyBot';

const prisma = new PrismaClient();

new MyBot({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'GUILD_MEMBERS',
		'GUILD_VOICE_STATES',
		'GUILD_VOICE_STATES',
	],
}).start();

process.on('uncaughtException', (err) => {
	console.log(err);
});

process.on('unhandledRejection', (err) => {
	console.log(err);
});
