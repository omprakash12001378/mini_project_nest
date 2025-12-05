import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AgeValidationPipe implements PipeTransform {
    transform(value: any) {
        // Convert to number if it's a string
        const age = typeof value === 'string' ? parseInt(value, 10) : value;

        // Check if it's a valid number
        if (isNaN(age)) {
            throw new BadRequestException('Age must be a valid number');
        }

        // Check range
        if (age < 0 || age > 30) {
            throw new BadRequestException('Age must be between 0 and 30');
        }

        return age;
    }
}
