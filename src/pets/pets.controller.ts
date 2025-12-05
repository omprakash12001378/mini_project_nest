import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { StaffGuard } from './guards/staff.guard';
import { PetNotFoundFilter } from './filters/pet-not-found.filter';
import { TimingInterceptor } from './interceptors/timing.interceptor';
import { AgeValidationPipe } from './pipes/age-validation.pipe';
import { SpeciesTransformPipe } from './pipes/species-transform.pipe';

@Controller('pets')
@UseInterceptors(TimingInterceptor)
export class PetsController {
  constructor(private readonly petsService: PetsService) { }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body(new ValidationPipe({ transform: true })) createPetDto: CreatePetDto) {
    // Apply custom pipes to individual fields
    const petData = {
      ...createPetDto,
      age: new AgeValidationPipe().transform(createPetDto.age),
      species: new SpeciesTransformPipe().transform(createPetDto.species),
    };

    return this.petsService.create(petData);
  }

  @Get()
  async findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  @UseFilters(PetNotFoundFilter)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(StaffGuard)
  @UseFilters(PetNotFoundFilter)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, skipMissingProperties: true })) updatePetDto: UpdatePetDto,
  ) {
    // Apply custom pipes to individual fields if they exist
    const petData: any = { ...updatePetDto };

    if (updatePetDto.age !== undefined) {
      petData.age = new AgeValidationPipe().transform(updatePetDto.age);
    }

    if (updatePetDto.species !== undefined) {
      petData.species = new SpeciesTransformPipe().transform(updatePetDto.species);
    }

    return this.petsService.update(id, petData);
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  @UseFilters(PetNotFoundFilter)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.remove(id);
  }
}