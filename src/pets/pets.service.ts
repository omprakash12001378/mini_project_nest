import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
    constructor(
        @InjectRepository(Pet)
        private petRepository: Repository<Pet>,
    ) { }

    async create(createPetDto: CreatePetDto): Promise<Pet> {
        const pet = this.petRepository.create(createPetDto);
        return this.petRepository.save(pet);
    }

    async findAll(): Promise<Pet[]> {
        return this.petRepository.find();
    }

    async findOne(id: number): Promise<Pet> {
        const pet = await this.petRepository.findOne({ where: { id } });

        if (!pet) {
            throw new NotFoundException('Pet not found');
        }

        return pet;
    }

    async update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
        const pet = await this.findOne(id); // This will throw if not found

        Object.assign(pet, updatePetDto);
        return this.petRepository.save(pet);
    }

    async remove(id: number): Promise<Pet> {
        const pet = await this.findOne(id); // This will throw if not found

        await this.petRepository.remove(pet);
        return pet;
    }
}
