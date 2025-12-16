export class RoleVO {
  private static ALLOWED = ['ROOT', 'TECHNICIAN'];

  private constructor(private readonly value: string) {}

  static create(role?: string): RoleVO {
    const finalRole = role ?? 'ROOT';

    if (!this.ALLOWED.includes(finalRole)) {
      throw new Error(`Invalid role '${finalRole}'. Allowed: ${this.ALLOWED.join(', ')}`);
    }

    return new RoleVO(finalRole);
  }

  getValue(): string {
    return this.value;
  }
}
