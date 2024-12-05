-- DropForeignKey
ALTER TABLE "LikedPhoto" DROP CONSTRAINT "LikedPhoto_memoryId_fkey";

-- DropForeignKey
ALTER TABLE "LikedPhoto" DROP CONSTRAINT "LikedPhoto_userId_fkey";

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "coverIndex" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "LikedPhoto" ADD CONSTRAINT "LikedPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSettings"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPhoto" ADD CONSTRAINT "LikedPhoto_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
