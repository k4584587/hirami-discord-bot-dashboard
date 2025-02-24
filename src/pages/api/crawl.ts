import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const DISCORD_API_URL = process.env.DISCORD_API_URL;

  if (req.method === 'POST') {
    const { url, xpath, assistantName } = req.body;
    try {
      const response = await fetch(`${DISCORD_API_URL}/api/crawl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, xpath, assistantName }),
      });
      if (!response.ok) throw new Error('크롤링 실패');
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '크롤링 중 오류 발생' });
    }
  } else {
    res.status(405).json({ error: '허용되지 않는 메소드' });
  }
}
