-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClaimsLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dropId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedCode" TEXT NOT NULL,
    CONSTRAINT "ClaimsLog_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClaimsLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClaimsLog" ("claimedAt", "claimedCode", "dropId", "id", "userId") SELECT "claimedAt", "claimedCode", "dropId", "id", "userId" FROM "ClaimsLog";
DROP TABLE "ClaimsLog";
ALTER TABLE "new_ClaimsLog" RENAME TO "ClaimsLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
