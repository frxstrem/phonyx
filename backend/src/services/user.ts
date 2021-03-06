import { Collection, Db } from "mongodb";
import { User } from "../models";

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
}
