// types.d.ts

export {};

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
