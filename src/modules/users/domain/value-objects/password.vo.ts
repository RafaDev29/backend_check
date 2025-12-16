export class PasswordVO {
  private constructor(private readonly value: string) {
    if (!value || value.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  static create(raw: string): PasswordVO {
    return new PasswordVO(raw);
  }

  getValue(): string {
    return this.value;
  }
}
