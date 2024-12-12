//src/pages/api/crawling-sites.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const DISCORD_API_URL = process.env.DISCORD_API_URL;

	try {
		const response = await fetch(`${DISCORD_API_URL}/api/crawling-sites`);
		const data = await response.json();
		res.status(200).json(data);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch data' });
	}
}