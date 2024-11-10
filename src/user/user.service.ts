import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, UpdatePrivilegesDto, UserDto } from 'entity-types';
import { User } from './user.entity';
import { RabbitMQService } from '../rabbitmq.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    await this.rabbitMQService.sendMessage('user-queue', user);
    return user;
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.findOne(id);
    await this.userRepository.update(id, updateUserDto);
    return { ...user, ...updateUserDto };
  }

  async updatePrivileges(id: string, updatePrivilegesDto: UpdatePrivilegesDto): Promise<UserDto> {
    const user = await this.findOne(id);
    await this.userRepository.update(id, { privileges: updatePrivilegesDto.privileges });
    return { ...user, privileges: updatePrivilegesDto.privileges };
  }
}
