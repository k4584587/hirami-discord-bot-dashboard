import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const DISCORD_API_URL = process.env.DISCORD_API_URL;
  const { siteId } = req.query;

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${DISCORD_API_URL}/api/crawling-data?siteId=${siteId}`);
      if (!response.ok) throw new Error('데이터 조회 실패');
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '데이터 조회 중 오류 발생' });
    }
  } else {
    res.status(405).json({ error: '허용되지 않는 메소드' });
  }
} 