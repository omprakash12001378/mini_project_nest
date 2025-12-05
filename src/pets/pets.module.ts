import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { Pet } from './entities/pet.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([Pet])],
    controllers: [PetsController],
    providers: [PetsService],
})
export class PetsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('pets');
    }
}
