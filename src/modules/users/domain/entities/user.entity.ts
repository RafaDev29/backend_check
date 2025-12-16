import { UsernameVO } from '../value-objects/username.vo';
import { PasswordVO } from '../value-objects/password.vo';
import { RoleVO } from '../value-objects/role.vo';

export class User {
  constructor(
    private readonly id: string,
    private username: UsernameVO,
    private password: string,
    private role: RoleVO,
  ) {}

  static create(username: string, password: string, role?: string): User {
    const id = crypto.randomUUID();
    return new User(
      id,
      UsernameVO.create(username),
      password,
      RoleVO.create(role),
    );
  }

  static reconstitute(id: string, username: string, password: string, role: string): User {
    return new User(
      id,
      UsernameVO.create(username),
      password,
      RoleVO.create(role),
    );
  }

  getId(): string { return this.id; }
  getUsername(): string { return this.username.getValue(); }
  getPassword(): string { return this.password; }
  getRole(): string { return this.role.getValue(); }
}
