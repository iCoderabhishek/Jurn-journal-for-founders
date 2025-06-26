import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Async wrapper for route handlers to catch errors
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Authentication middleware
 * For now, sets userId to "1" for testing purposes
 * In production, this would validate JWT tokens or session cookies
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // TODO: Implement real authentication logic
    // For now, setting a mock user ID
    req.userId = "1";
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// /**
//  * Error handling middleware
//  */
// export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
//   console.error('Error:', error);

//   if (error.name === 'ValidationError') {
//     res.status(400).json({
//       success: false,
//       message: 'Validation error',
//       error: error.message
//     });
//     return;
//   }

//   if (error.name === 'PrismaClientKnownRequestError') {
//     res.status(400).json({
//       success: false,
//       message: 'Database error',
//       error: error.message
//     });
//     return;
//   }

//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
//   });
// };

// /**
//  * Request logging middleware
//  */
// export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
//   const timestamp = new Date().toISOString();
//   console.log(`[${timestamp}] ${req.method} ${req.path} - User: ${req.userId}`);
//   next();
// };