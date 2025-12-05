import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SpeciesTransformPipe implements PipeTransform {
    private readonly allowedSpecies = ['dog', 'cat', 'bird'];

    transform(value: any) {
        if (!value) {
            throw new BadRequestException('Species is required');
        }

        // Normalize to lowercase
        const normalized = value.toString().toLowerCase();

        // Validate against allowed species
        if (!this.allowedSpecies.includes(normalized)) {
            throw new BadRequestException(
                `Species must be one of: ${this.allowedSpecies.join(', ')}`,
            );
        }

        return normalized;
    }
}
