import * as crypto from "crypto";
import { Collection, Db } from "mongodb";
import { SHA3 } from "sha3";
import base64url from "base64url";
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

    if (
      user != null &&
      user.passwordHash != null &&
      validatePassword(password, user.passwordHash)
    ) {
      return user;
    }

    return null;
  }
}

export function hashPassword(password: string): string {
  // generate random 12-byte salt
  const salt = crypto.randomBytes(12);
  const saltString = base64url.encode(salt);

  // generate SHA3-512 hash
  const hashType = "S5";
  const hash = new SHA3(512);
  hash.update(salt);
  hash.update(password);
  const hashString = base64url.encode(hash.digest());

  // generate string with the following components:
  // - '$'
  // - hash type ('S5' for SHA3-512)
  // - '$'
  // - base64url encoded salt
  // - '$'
  // - base64url encoded hash
  return `$${hashType}$${saltString}$${hashString}`;
}

export function validatePassword(
  password: string,
  passwordHash: string
): boolean {
  // parse hash format
  const m = /^\$([^\$]+)\$([^\$]+)\$([^\$]+)$/.exec(passwordHash);
  if (m == null) return false;

  const hashType = m[1];

  switch (hashType) {
    case "S5": {
      const saltString = m[2];
      const hashString = m[3];

      const salt = base64url.toBuffer(saltString);
      const hash = base64url.toBuffer(hashString);

      const computedHash = new SHA3(512);
      computedHash.update(salt);
      computedHash.update(password);
      const computedHashDigest = computedHash.digest();

      return Buffer.compare(computedHashDigest, hash) === 0;
    }

    default:
      // unknown hash type
      return false;
  }
}
