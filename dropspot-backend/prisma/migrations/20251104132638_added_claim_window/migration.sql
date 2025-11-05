-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimWindowStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimWindowEnd" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Drop" ("createdAt", "id", "name", "stock") SELECT "createdAt", "id", "name", "stock" FROM "Drop";
DROP TABLE "Drop";
ALTER TABLE "new_Drop" RENAME TO "Drop";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
