/*
  Warnings:

  - You are about to drop the column `from` on the `UserSettings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_memoryId_fkey";

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "from",
ADD COLUMN     "location" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
