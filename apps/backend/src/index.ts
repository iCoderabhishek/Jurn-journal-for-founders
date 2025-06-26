import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { authMiddleware,  asyncHandler } from './middleware/middleware';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// app.use(requestLogger);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// =============================================================================
// USER ROUTES
// =============================================================================

// Get current user profile
app.get('/api/v1/user/profile', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  
  const user = await prisma.user.findFirst({
    where: { id: userId },
    // include: {
    //   _count: {
    //     select: {
    //       entries: true,
    //       goals: true,
    //       tags: true
    //     }
    //   }
    // }
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, data: user });
}));

// Update user profile
app.put('/api/v1/user/profile', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { name, avatar, theme, timezone, reminderEnabled, reminderTime } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(avatar !== undefined && { avatar }),
      ...(theme && { theme }),
      ...(timezone && { timezone }),
      ...(reminderEnabled !== undefined && { reminderEnabled }),
      ...(reminderTime !== undefined && { reminderTime })
    }
  });

  res.json({ success: true, data: updatedUser });
}));

// =============================================================================
// ENTRY ROUTES
// =============================================================================

// Get all entries for user
app.get('/api/v1/entries', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { page = 1, limit = 10, search, mood, isFavorite } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  
  const where: any = { userId };
  
  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { content: { contains: String(search), mode: 'insensitive' } }
    ];
  }
  
  if (mood) where.mood = String(mood);
  if (isFavorite !== undefined) where.isFavorite = isFavorite === 'true';

  const [entries, total] = await Promise.all([
    prisma.entry.findMany({
      where,
      include: {
        entryTags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    }),
    prisma.entry.count({ where })
  ]);

  res.json({ 
    success: true, 
    data: entries,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// Get single entry
app.get('/api/v1/entries/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  const entry = await prisma.entry.findFirst({
    where: { id, userId },
    include: {
      entryTags: {
        include: {
          tag: true
        }
      }
    }
  });

  if (!entry) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }

  res.json({ success: true, data: entry });
}));

// Create new entry
app.post('/api/v1/entries', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { title, content, mood, isPrivate, isFavorite, tagIds = [] } = req.body;

  if (!title || !content) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and content are required' 
    });
  }

  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  const entry = await prisma.entry.create({
    data: {
      title,
      content,
      mood,
      wordCount,
      readingTime,
      isPrivate: isPrivate || false,
      isFavorite: isFavorite || false,
      userId,
      entryTags: {
        create: tagIds.map((tagId: string) => ({
          tagId
        }))
      }
    },
    include: {
      entryTags: {
        include: {
          tag: true
        }
      }
    }
  });

  // Update user stats
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalEntries: { increment: 1 }
    }
  });

  res.status(201).json({ success: true, data: entry });
}));

// Update entry
app.put('/api/v1/entries/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { title, content, mood, isPrivate, isFavorite, tagIds } = req.body;

  // Check if entry exists and belongs to user
  const existingEntry = await prisma.entry.findFirst({
    where: { id, userId }
  });

  if (!existingEntry) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }

  const updateData: any = {};
  
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) {
    updateData.content = content;
    updateData.wordCount = content.split(/\s+/).length;
    updateData.readingTime = Math.ceil(updateData.wordCount / 200);
  }
  if (mood !== undefined) updateData.mood = mood;
  if (isPrivate !== undefined) updateData.isPrivate = isPrivate;
  if (isFavorite !== undefined) updateData.isFavorite = isFavorite;

  const entry = await prisma.entry.update({
    where: { id },
    data: updateData,
    include: {
      entryTags: {
        include: {
          tag: true
        }
      }
    }
  });

  // Update tags if provided
  if (tagIds !== undefined) {
    await prisma.entryTag.deleteMany({
      where: { entryId: id }
    });

    if (tagIds.length > 0) {
      await prisma.entryTag.createMany({
        data: tagIds.map((tagId: string) => ({
          entryId: id,
          tagId
        }))
      });
    }
  }

  res.json({ success: true, data: entry });
}));

// Delete entry
app.delete('/api/v1/entries/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  const entry = await prisma.entry.findFirst({
    where: { id, userId }
  });

  if (!entry) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }

  await prisma.entry.delete({
    where: { id }
  });

  // Update user stats
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalEntries: { decrement: 1 }
    }
  });

  res.json({ success: true, message: 'Entry deleted successfully' });
}));

// =============================================================================
// TAG ROUTES
// =============================================================================

// Get all tags for user
app.get('/api/v1/tags', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;

  const tags = await prisma.tag.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          entryTags: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  res.json({ success: true, data: tags });
}));

// Create new tag
app.post('/api/v1/tags', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { name, color } = req.body;

  if (!name) {
    return res.status(400).json({ 
      success: false, 
      message: 'Tag name is required' 
    });
  }

  const tag = await prisma.tag.create({
    data: {
      name,
      color,
      userId
    }
  });

  res.status(201).json({ success: true, data: tag });
}));

// Update tag
app.put('/api/v1/tags/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { name, color } = req.body;

  const tag = await prisma.tag.findFirst({
    where: { id, userId }
  });

  if (!tag) {
    return res.status(404).json({ success: false, message: 'Tag not found' });
  }

  const updatedTag = await prisma.tag.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(color !== undefined && { color })
    }
  });

  res.json({ success: true, data: updatedTag });
}));

// Delete tag
app.delete('/api/v1/tags/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  const tag = await prisma.tag.findFirst({
    where: { id, userId }
  });

  if (!tag) {
    return res.status(404).json({ success: false, message: 'Tag not found' });
  }

  await prisma.tag.delete({
    where: { id }
  });

  res.json({ success: true, message: 'Tag deleted successfully' });
}));

// =============================================================================
// GOAL ROUTES
// =============================================================================

// Get all goals for user
app.get('/api/v1/goals', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { status, category } = req.query;

  const where: any = { userId };
  if (status) where.status = String(status);
  if (category) where.category = String(category);

  const goals = await prisma.goal.findMany({
    where,
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  res.json({ success: true, data: goals });
}));

// Create new goal
app.post('/api/v1/goals', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { title, description, category, priority, targetDate, targetValue } = req.body;

  if (!title || !category) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and category are required' 
    });
  }

  const goal = await prisma.goal.create({
    data: {
      title,
      description,
      category,
      priority: priority || 'medium',
      targetDate: targetDate ? new Date(targetDate) : null,
      targetValue,
      userId
    }
  });

  res.status(201).json({ success: true, data: goal });
}));

// Update goal
app.put('/api/v1/goals/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { title, description, category, status, priority, targetDate, progress, targetValue, currentValue } = req.body;

  const goal = await prisma.goal.findFirst({
    where: { id, userId }
  });

  if (!goal) {
    return res.status(404).json({ success: false, message: 'Goal not found' });
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;
  if (targetDate !== undefined) updateData.targetDate = targetDate ? new Date(targetDate) : null;
  if (progress !== undefined) updateData.progress = progress;
  if (targetValue !== undefined) updateData.targetValue = targetValue;
  if (currentValue !== undefined) updateData.currentValue = currentValue;

  const updatedGoal = await prisma.goal.update({
    where: { id },
    data: updateData
  });

  res.json({ success: true, data: updatedGoal });
}));

// Delete goal
app.delete('/api/v1/goals/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  const goal = await prisma.goal.findFirst({
    where: { id, userId }
  });

  if (!goal) {
    return res.status(404).json({ success: false, message: 'Goal not found' });
  }

  await prisma.goal.delete({
    where: { id }
  });

  res.json({ success: true, message: 'Goal deleted successfully' });
}));

// =============================================================================
// MILESTONE ROUTES
// =============================================================================

// Get all milestones for user
app.get('/api/v1/milestones', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { achieved } = req.query;

  const where: any = { userId };
  if (achieved !== undefined) where.achieved = achieved === 'true';

  const milestones = await prisma.milestone.findMany({
    where,
    orderBy: [
      { achieved: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  res.json({ success: true, data: milestones });
}));

// Create new milestone
app.post('/api/v1/milestones', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { title, description, type, targetValue } = req.body;

  if (!title || !type) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and type are required' 
    });
  }

  const milestone = await prisma.milestone.create({
    data: {
      title,
      description,
      type,
      targetValue,
      userId
    }
  });

  res.status(201).json({ success: true, data: milestone });
}));

// Update milestone
app.put('/api/v1/milestones/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { title, description, achieved, currentValue } = req.body;

  const milestone = await prisma.milestone.findFirst({
    where: { id, userId }
  });

  if (!milestone) {
    return res.status(404).json({ success: false, message: 'Milestone not found' });
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (currentValue !== undefined) updateData.currentValue = currentValue;
  
  if (achieved !== undefined) {
    updateData.achieved = achieved;
    if (achieved && !milestone.achieved) {
      updateData.achievedAt = new Date();
    }
  }

  const updatedMilestone = await prisma.milestone.update({
    where: { id },
    data: updateData
  });

  res.json({ success: true, data: updatedMilestone });
}));

// =============================================================================
// MOOD ENTRY ROUTES
// =============================================================================

// Get mood entries for user
app.get('/api/v1/moods', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { startDate, endDate, limit = 30 } = req.query;

  const where: any = { userId };
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(String(startDate));
    if (endDate) where.createdAt.lte = new Date(String(endDate));
  }

  const moodEntries = await prisma.moodEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: Number(limit)
  });

  res.json({ success: true, data: moodEntries });
}));

// Create mood entry
app.post('/api/v1/moods', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { mood, intensity, notes, triggers, activities } = req.body;

  if (!mood) {
    return res.status(400).json({ 
      success: false, 
      message: 'Mood is required' 
    });
  }

  const moodEntry = await prisma.moodEntry.create({
    data: {
      mood,
      intensity: intensity || 5,
      notes,
      triggers: triggers || [],
      activities: activities || [],
      userId
    }
  });

  res.status(201).json({ success: true, data: moodEntry });
}));

// =============================================================================
// INSIGHTS ROUTES
// =============================================================================

// Get insights for user
app.get('/api/v1/insights', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { type, category, timeframe } = req.query;

  const where: any = { userId };
  if (type) where.type = String(type);
  if (category) where.category = String(category);
  if (timeframe) where.timeframe = String(timeframe);

  const insights = await prisma.insight.findMany({
    where,
    orderBy: [
      { confidence: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  res.json({ success: true, data: insights });
}));

// =============================================================================
// AI QUERY ROUTES
// =============================================================================

// Get AI queries for user
app.get('/api/v1/ai-queries', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { status, category } = req.query;

  const where: any = { userId };
  if (status) where.status = String(status);
  if (category) where.category = String(category);

  const queries = await prisma.aIQuery.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  res.json({ success: true, data: queries });
}));

// Create AI query
app.post('/api/v1/ai-queries', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { question, category } = req.body;

  if (!question) {
    return res.status(400).json({ 
      success: false, 
      message: 'Question is required' 
    });
  }

  const aiQuery = await prisma.aIQuery.create({
    data: {
      question,
      category,
      userId
    }
  });

  // TODO: Process AI query in background
  // For now, just return the created query
  res.status(201).json({ success: true, data: aiQuery });
}));

// =============================================================================
// QUOTES ROUTES
// =============================================================================

// Get daily quote
app.get('/api/v1/quotes/daily', asyncHandler(async (req: Request, res: Response) => {
  const today = new Date().getDay(); // 0-6

  const quote = await prisma.quote.findFirst({
    where: {
      isActive: true,
      OR: [
        { dayOfWeek: today },
        { dayOfWeek: null }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!quote) {
    // Fallback quote
    const defaultQuote = {
      text: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
      category: "motivation"
    };
    return res.json({ success: true, data: defaultQuote });
  }

  res.json({ success: true, data: quote });
}));

// =============================================================================
// ANALYTICS ROUTES
// =============================================================================

// Get user analytics
app.get('/api/v1/analytics', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { timeframe = 'month' } = req.query;

  let dateFilter = new Date();
  switch (timeframe) {
    case 'week':
      dateFilter.setDate(dateFilter.getDate() - 7);
      break;
    case 'month':
      dateFilter.setMonth(dateFilter.getMonth() - 1);
      break;
    case 'year':
      dateFilter.setFullYear(dateFilter.getFullYear() - 1);
      break;
  }

  const [
    totalEntries,
    recentEntries,
    totalWords,
    moodStats,
    goalStats
  ] = await Promise.all([
    prisma.entry.count({ where: { userId } }),
    prisma.entry.count({ 
      where: { 
        userId, 
        createdAt: { gte: dateFilter } 
      } 
    }),
    prisma.entry.aggregate({
      where: { userId },
      _sum: { wordCount: true }
    }),
    prisma.moodEntry.groupBy({
      by: ['mood'],
      where: { 
        userId,
        createdAt: { gte: dateFilter }
      },
      _count: true
    }),
    prisma.goal.groupBy({
      by: ['status'],
      where: { userId },
      _count: true
    })
  ]);

  const analytics = {
    entries: {
      total: totalEntries,
      recent: recentEntries
    },
    words: {
      total: totalWords._sum.wordCount || 0
    },
    moods: moodStats,
    goals: goalStats,
    timeframe
  };

  res.json({ success: true, data: analytics });
}));

// Error handling middleware (must be last)
// app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});