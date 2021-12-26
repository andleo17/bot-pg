import axios from 'axios';

const tenor = axios.create({
	baseURL: 'https://g.tenor.com/v1/',
	timeout: 1000,
});

async function getAnimeGifs(search?: string): Promise<string[]> {
	try {
		const { data } = await tenor.get('search', {
			params: {
				key: process.env.TENOR_KEY,
				q: `anime${search && '-' + search}`,
			},
		});

		return data.results.map((d: any) => d.media[0]['mediumgif']['url']);
	} catch (error) {
		console.error(error);
	}
}

export async function pickRandomAnimeGif(search?: string): Promise<string> {
	const animeGifs = await getAnimeGifs(search);
	return animeGifs[Math.floor(Math.random() * animeGifs.length)];
}
