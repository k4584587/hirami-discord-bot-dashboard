// pages/api/crawling-sites.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const DISCORD_API_URL = process.env.DISCORD_API_URL;

  switch (req.method) {
	case 'GET':
	  try {
		const response = await fetch(`${DISCORD_API_URL}/api/crawling-sites`);
		if (!response.ok) throw new Error('Failed to fetch data');
		const data = await response.json();
		res.status(200).json(data);
	  } catch (error) {
		res.status(500).json({ error: 'Failed to fetch data' });
	  }
	  break;

	case 'POST':
	  try {
		// req.body는 클라이언트에서 전달한 site 데이터
		const response = await fetch(`${DISCORD_API_URL}/api/crawling-sites`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(req.body),
		});

		if (!response.ok) {
		  throw new Error('Failed to create site');
		}

		const data = await response.json();
		res.status(201).json(data);
	  } catch (error) {
		res.status(500).json({ error: 'Failed to create site' });
	  }
	  break;

	default:
	  res.status(405).json({ error: 'Method not allowed' });
	  break;
  }
}
