import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserDto } from 'entity-types';

@Entity('users')
export class User extends UserDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  age?: string;

  @Column({ type: 'text', array: true, nullable: true })
  favoriteEvents?: string[];

  @Column({ default: 'User' })
  privileges: 'Admin' | 'Moderator' | 'User';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
