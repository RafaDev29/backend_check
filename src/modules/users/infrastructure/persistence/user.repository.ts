import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserModel } from './user.model';
import { UserMapper } from '../../application/mappers/user.mapper';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private repo: Repository<UserModel>,
  ) {}

  async save(user: User): Promise<User> {
    const model = UserMapper.toModel(user);
    const saved = await this.repo.save(model);
    return UserMapper.toDomain(saved);
  }

  async findByUsername(username: string): Promise<User | null> {
    const model = await this.repo.findOne({ where: { username } });
    return model ? UserMapper.toDomain(model) : null;
  }
}
