import * as bcrypt from 'bcrypt';

export class PasswordHasherService {
  static async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
