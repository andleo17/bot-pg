import { MyBot } from '@structures/MyBot';
import {
	ChatInputApplicationCommandData,
	CommandInteraction,
	Message,
	PermissionResolvable,
} from 'discord.js';

declare namespace Commands {
	enum CategoryCommand {
		MISC,
		BOT_CONFIG,
		MODERATION,
	}

	type BaseCommand<T> = {
		userPermissions?: PermissionResolvable[];
		cooldown?: number;
		category?: CategoryCommand;
		run: (options: T) => any;
	};

	type PrefixCommandRunOptions = {
		client: MyBot;
		message: Message<true>;
		args: string[];
	};

	type SlashCommandRunOptions = {
		client: MyBot;
		interaction: CommandInteraction<'cached'>;
	};

	type SlashCommandType = ChatInputApplicationCommandData &
		BaseCommand<SlashCommandRunOptions>;

	type PrefixCommandType = {
		name: string;
		description: string;
		aliases?: string[];
	} & BaseCommand<PrefixCommandRunOptions>;
}

declare namespace Tenor {
	type Response = {
		results: Gif[];
		next: string;
	};

	type Gif = {
		id: string;
		title: string;
		content_description: string;
		content_rating: string;
		h1_title: string;
		media: GifSource[];
		bg_color: string;
		created: number;
		itemurl: string;
		url: string;
		tags: string[];
		flags: string[];
		shares: number;
		hasaudio: boolean;
		hascaption: boolean;
		source_id: string;
		composite: any;
	};

	type GifSource = {
		loopedmp4: GifSourceInfo;
		mp4: GifSourceInfo;
		nanomp4: GifSourceInfo;
		nanogif: GifSourceInfo;
		tinywebm: GifSourceInfo;
		nanowebm: GifSourceInfo;
		tinygif: GifSourceInfo;
		mediumgif: GifSourceInfo;
		webm: GifSourceInfo;
		tinymp4: GifSourceInfo;
		gif: GifSourceInfo;
	};

	type GifSourceInfo = {
		dims: number[];
		duration?: number;
		size: number;
		preview: string;
		url: string;
	};
}

declare namespace Moderation {
	type IndexOptions = number | 'first' | 'latest';
}
