export class User {
  constructor(
    public id: number,
    public username: string,
    public password_hash: string,
    public role: string = "user",
    public created_at?: Date
  ) {}
}
