export class User {
  constructor(
    private id: number,
    private displayName: string,
    private email: string,
    private token: string = ''
  ) {}

  getToken(): string {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getId(): number {
    return this.id;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  setDisplayName(displayName: string): void {
    this.displayName = displayName;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  static fromJson(json: any): User {
    return new User(json.id, json.displayName, json.email);
  }

  static toJson(user: User): any {
    return {
      id: user.getId(),
      displayName: user.getDisplayName(),
      email: user.getEmail(),
    };
  }
}
