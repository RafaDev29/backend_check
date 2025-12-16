import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../../infrastructure/persistence/user.model';

export class UserMapper {
  static toDomain(model: UserModel): User {
    return User.reconstitute(
      model.id,
      model.username,
      model.password,
      model.role,
    );
  }

  static toModel(entity: User): UserModel {
    const model = new UserModel();
    model.id = entity.getId();
    model.username = entity.getUsername();
    model.password = entity.getPassword();
    model.role = entity.getRole();
    return model;
  }
}
