import type { 
  VercelRequest, 
  VercelResponse 
} from '@vercel/node';
import { verifyFB } from "./../func/messenger";

export default async function handler
(
  req: VercelRequest, 
  res: VercelResponse
) {
  verifyFB(req, res);
};
