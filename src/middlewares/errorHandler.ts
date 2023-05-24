import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error.stack);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An internal server error occurred",
  });
}
