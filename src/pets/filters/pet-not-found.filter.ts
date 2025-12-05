import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class PetNotFoundFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        // Only handle "Pet not found" exceptions
        if (exception.message.includes('Pet not found')) {
            response.status(404).json({
                error: 'Pet Not Found',
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        } else {
            // Let other NotFoundExceptions pass through normally
            response.status(404).json({
                statusCode: 404,
                message: exception.message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
