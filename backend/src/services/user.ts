import { Collection, Db } from "mongodb";
import { User } from "../models";

export type BasicCredentials = {
  username: string;
  password: string;
};

export class UserService {
  constructor(private db: Db) {}

  private get collection(): Collection<User> {
    return this.db.collection("users");
  }

  async getUser(username: string): Promise<User | null> {
    return await this.collection.findOne({
      username: { $eq: username },
    });
  }

  async validateCredentials(
    credentials: BasicCredentials
  ): Promise<User | null> {
    const { username, password } = credentials;

    const user = await this.getUser(username);
    if (user == null) return null;

    // TODO: validate password hash

    return user;
  }
}
