export class UsernameVO {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error('Username must have at least 3 characters');
    }
  }

  static create(value: string): UsernameVO {
    return new UsernameVO(value.trim());
  }

  getValue(): string {
    return this.value;
  }
}
