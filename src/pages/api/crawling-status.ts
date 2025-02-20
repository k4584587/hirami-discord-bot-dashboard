// pages/api/crawling-status.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const DISCORD_API_URL = process.env.DISCORD_API_URL;

  switch (req.method) {
    case 'GET':
      try {
        const response = await fetch(`${DISCORD_API_URL}/api/crawling-status`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
      break;
  }
}