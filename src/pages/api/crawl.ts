// pages/api/crawl.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const DISCORD_API_URL = process.env.DISCORD_API_URL;

  if (req.method === 'POST') {
    try {
      // req.body에서 필요한 데이터 추출 (url, xpath, assistantName)
      const { url, xpath, assistantName } = req.body;

      // 백엔드 API 호출
      const response = await fetch(`${DISCORD_API_URL}/api/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, xpath, assistantName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '크롤링 요청 실패!');
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}