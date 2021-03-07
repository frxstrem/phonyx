import { Db } from "mongodb";
import { User } from "../models";

type Migration = {
  id: number;
  description: string;
  apply(db: Db): Promise<void>;
};

type MigrationDocument = {
  _id: number;
  description: string;
  applied: boolean;
};

const migrations: Migration[] = [
  {
    id: 1,
    description: "Create admin user",
    async apply(db: Db): Promise<void> {
      await db.collection<User>("users").insertOne({
        username: "admin",
        isAdmin: true,
      });
    },
  },
];

export async function applyMigrations(db: Db): Promise<void> {
  const latestMigrationId = await getLatestMigrationId(db);

  for (const migration of migrations) {
    if (latestMigrationId != null && latestMigrationId >= migration.id)
      continue;

    await applyMigration(db, migration);
  }
}

async function applyMigration(db: Db, migration: Migration): Promise<void> {
  const collection = db.collection<MigrationDocument>("_migrations");

  console.log(`Applying migration ${migration.id}: ${migration.description}`);

  // TODO: error if already applied!

  await collection.insertOne({
    _id: migration.id,
    description: migration.description,
    applied: false,
  });

  await migration.apply(db);

  await collection.updateOne(
    {
      _id: { $eq: migration.id },
    },
    {
      $set: {
        applied: true,
      },
    }
  );

  console.log(`Migration ${migration.id} applied`);
}

async function getLatestMigrationId(db: Db): Promise<number | null> {
  const collection = db.collection<MigrationDocument>("_migrations");

  const appliedMigrations = await collection
    .find({
      applied: {
        $eq: true,
      },
    })
    .toArray();

  appliedMigrations.sort((a, b) => a._id - b._id);

  return appliedMigrations.length > 0
    ? appliedMigrations[appliedMigrations.length - 1]._id
    : null;
}
