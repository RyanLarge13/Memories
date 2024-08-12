-- DropForeignKey
ALTER TABLE "LikedPhoto" DROP CONSTRAINT "LikedPhoto_userId_fkey";

-- AddForeignKey
ALTER TABLE "LikedPhoto" ADD CONSTRAINT "LikedPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSettings"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
