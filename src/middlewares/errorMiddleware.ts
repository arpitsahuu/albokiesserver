// errorMiddleware.ts
import { Request, Response, NextFunction } from "express";

function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let statusCode: number = (err as any).statusCode || 500; // Default to 500 if statusCode is not provided
  let errorMessage: string = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
}

export default errorMiddleware;
