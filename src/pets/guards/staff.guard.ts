import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StaffGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const staffHeader = request.headers['x-staff'];

        if (staffHeader !== 'true') {
            throw new UnauthorizedException('Staff authorization required. Include x-staff: true header');
        }

        return true;
    }
}
