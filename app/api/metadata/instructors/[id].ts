// pages/api/metadata/instructors/[id].ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await prisma.instructor.delete({
        where: { id: Number(id) }, // Asumiendo que tu ID es numérico
      });
      res.status(200).json({ message: 'Instructor eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error eliminando instructor', error });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
