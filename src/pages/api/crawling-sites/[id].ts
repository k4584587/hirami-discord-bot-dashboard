// pages/api/crawling-sites/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const DISCORD_API_URL = process.env.DISCORD_API_URL;
  const { id } = req.query; // URL 파라미터에서 id 추출

  switch (req.method) {
	case 'PUT':
	  try {
		const response = await fetch(`${DISCORD_API_URL}/api/crawling-sites/${id}`, {
		  method: 'PUT',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(req.body),
		});

		if (!response.ok) {
		  throw new Error('Failed to update site');
		}

		const data = await response.json();
		res.status(200).json(data);
		  // eslint-disable-next-line @typescript-eslint/no-unused-vars
	  } catch (error) {
		res.status(500).json({ error: 'Failed to update site' });
	  }
	  break;

	case 'DELETE':
	  try {
		const response = await fetch(`${DISCORD_API_URL}/api/crawling-sites/${id}`, {
		  method: 'DELETE',
		});

		if (!response.ok) {
		  throw new Error('Failed to delete site');
		}

		res.status(204).end(); // No Content
		  // eslint-disable-next-line @typescript-eslint/no-unused-vars
	  } catch (error) {
		res.status(500).json({ error: 'Failed to delete site' });
	  }
	  break;

	default:
	  res.status(405).json({ error: 'Method not allowed' });
	  break;
  }
}
