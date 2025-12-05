import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Date.now();

        return next.handle().pipe(
            map((data) => {
                const endTime = Date.now();
                const duration = endTime - startTime;

                return {
                    data,
                    duration: `${duration}ms`,
                };
            }),
        );
    }
}
