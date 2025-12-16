import { User } from "src/modules/users/domain/entities/user.entity";

export class UserResponseDto {
  id: string;
  username: string;
  role: string;

  static fromDomain(user: User): UserResponseDto {
    return {
      id: user.getId(),
      username: user.getUsername(),
      role: user.getRole(),
    };
  }
}
