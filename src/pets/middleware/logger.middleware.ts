import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];

        console.log(`[PetsAPI] ${req.method} ${req.path} at ${time}`);

        next();
    }
}
