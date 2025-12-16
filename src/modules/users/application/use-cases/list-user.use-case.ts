import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly repository: IUserRepository,
  ) {}

  async execute() {
    const users = await this.repository.findAll();

    return users
      .filter(user => user.getRole() !== 'ROOT')
      .map(user => ({
        id: user.getId(),
        username: user.getUsername(),
        role: user.getRole(),
      }));
  }
}
