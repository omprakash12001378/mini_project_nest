import { IsString, IsNotEmpty, MinLength, IsNumber, Min, Max, IsIn } from 'class-validator';

export class CreatePetDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['dog', 'cat', 'bird'], { message: 'Species must be dog, cat, or bird' })
    species: 'dog' | 'cat' | 'bird';

    @IsNumber()
    @Min(0, { message: 'Age must be at least 0' })
    @Max(30, { message: 'Age must not exceed 30' })
    age: number;
}
