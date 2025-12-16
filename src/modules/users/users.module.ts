import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './infrastructure/persistence/user.model';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserController } from './infrastructure/http/controller/users.controller';
import { ListUsersUseCase } from './application/use-cases/list-user.use-case';


const REPOSITORY = 'IUserRepository';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    { provide: REPOSITORY, useClass: UserRepository },
    CreateUserUseCase,
    ListUsersUseCase
  ],
  exports: [REPOSITORY],
})
export class UsersModule { }
