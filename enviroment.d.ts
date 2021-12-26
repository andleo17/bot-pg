declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string;
			GUILD_ID: string;
			NODE_ENV: 'production' | 'development';
			GENIUS_LYRICS_API_KEY: string;
			DATABASE_URL: string;
			TENOR_KEY: string;
		}
	}
}

export {};
