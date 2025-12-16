import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { PasswordHasherService } from '../../domain/services/password-hasher.service';
import { LoginResponseDto } from '../../infrastructure/http/dto/login.response.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: { username: string; password: string }): Promise<LoginResponseDto> {
    const user = await this.userRepo.findByUsername(input.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await PasswordHasherService.compare(input.password, user.getPassword());
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.getId(),
      username: user.getUsername(),
      role: user.getRole(),
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      id: user.getId(),
      username: user.getUsername(),
      role: user.getRole(),
    };
  }
}
