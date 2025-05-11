import type { 
  VercelRequest, 
  VercelResponse 
} from '@vercel/node';
import {
  verifyFB,
  FBhandler
} from "../src/func/messenger";

export default async function handler
(
  req: VercelRequest, 
  res: VercelResponse
) {
  console.log("hi!")
  await verifyFB(req, res);
  await FBhandler(req, res);
};
