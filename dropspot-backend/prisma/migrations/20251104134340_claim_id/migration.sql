/*
  Warnings:

  - The primary key for the `Claim` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClaimsLog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dropId" TEXT NOT NULL,
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Claim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Claim_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Claim" ("claimedAt", "dropId", "id", "userId") SELECT "claimedAt", "dropId", "id", "userId" FROM "Claim";
DROP TABLE "Claim";
ALTER TABLE "new_Claim" RENAME TO "Claim";
CREATE UNIQUE INDEX "Claim_userId_dropId_key" ON "Claim"("userId", "dropId");
CREATE TABLE "new_ClaimsLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dropId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedCode" TEXT NOT NULL
);
INSERT INTO "new_ClaimsLog" ("claimedAt", "claimedCode", "dropId", "id", "userId") SELECT "claimedAt", "claimedCode", "dropId", "id", "userId" FROM "ClaimsLog";
DROP TABLE "ClaimsLog";
ALTER TABLE "new_ClaimsLog" RENAME TO "ClaimsLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
