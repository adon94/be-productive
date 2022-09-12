// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const journalEntries = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await prisma.journalEntry.findMany();
  res.status(200).json(result);
};

export default journalEntries;
