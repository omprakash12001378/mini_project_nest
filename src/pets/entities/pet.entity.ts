import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pets')
export class Pet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({
        type: 'enum',
        enum: ['dog', 'cat', 'bird'],
    })
    species: 'dog' | 'cat' | 'bird';

    @Column({ type: 'int' })
    age: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
