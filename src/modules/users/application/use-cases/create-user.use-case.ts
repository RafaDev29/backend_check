import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

const REPOSITORY = 'IUserRepository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(REPOSITORY)
    private readonly repository: IUserRepository,
  ) {}

  async execute(data: { username: string; password: string; role?: string }): Promise<User> {
    const exists = await this.repository.findByUsername(data.username);
    if (exists) {
      throw new ConflictException(`Username '${data.username}' already exists`);
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = User.create(data.username, hash, data.role);

    return this.repository.save(user);
  }
}
