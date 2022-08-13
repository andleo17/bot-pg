import { Tenor } from '@typings';
import axios from 'axios';

export class TenorApi {
	public async getGif(toSearch: string): Promise<string> {
		const { data } = await axios.get<Tenor.Response>(
			'https://g.tenor.com/v1/search',
			{
				params: {
					key: process.env.TENOR_KEY_API,
					q: toSearch,
					limit: 50,
				},
			}
		);

		const results = data.results.map((result) => result.media[0].gif);

		const result = results[Math.floor(Math.random() * results.length)];

		return result.url;
	}

	public async getAnimeGif(toSearch: string): Promise<string> {
		return this.getGif('anime-' + toSearch);
	}
}
