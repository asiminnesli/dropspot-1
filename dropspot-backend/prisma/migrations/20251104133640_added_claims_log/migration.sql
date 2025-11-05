/*
  Warnings:

  - Added the required column `claimedCode` to the `ClaimsLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClaimsLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dropId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedCode" TEXT NOT NULL
);
INSERT INTO "new_ClaimsLog" ("claimedAt", "dropId", "id", "userId") SELECT "claimedAt", "dropId", "id", "userId" FROM "ClaimsLog";
DROP TABLE "ClaimsLog";
ALTER TABLE "new_ClaimsLog" RENAME TO "ClaimsLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
