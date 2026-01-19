import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const logger = new Logger('HTTP');

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const ms = Date.now() - start;
    const { statusCode } = res;
    logger.log(`${method} ${originalUrl} ${statusCode} - ${ms}ms`);
  });

  next();
}

export default loggingMiddleware;
