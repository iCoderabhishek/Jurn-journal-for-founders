import { Request, Response } from 'express';
import { prisma } from '../config/config';

export const getAllEntries = async (req: Request, res: Response) => {
  const entries = await prisma.entry.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(entries);
};

export const createEntry = async (req: Request, res: Response) => {
    const { title, content, mood, tags, moodScore } = req.body;
    
    if (!req.userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if (!title || title.trim() === '') {
        res.status(400).json({ message: 'Title is required' });
        return;
    }

    if (!content || content.trim() === '') {
        res.status(400).json({ message: 'Content is required' });
        return;
    }

  const newEntry = await prisma.entry.create({
    data: { title, content, mood, tags, moodScore, user: {
        connect: {
          clerkUserId: req.userId,
        },
      }
       },
  });
    
  res.status(201).json(newEntry);
};