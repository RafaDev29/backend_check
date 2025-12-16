import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/security/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/security/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ListUsersUseCase } from 'src/modules/users/application/use-cases/list-user.use-case';

@Controller('users')
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROOT')
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUser.execute(dto);
    return UserResponseDto.fromDomain(user);
  }

  @Get()
  async findAll() {
    return this.listUsersUseCase.execute();
  }

}
