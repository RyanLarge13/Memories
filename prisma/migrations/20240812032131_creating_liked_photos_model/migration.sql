/*
  Warnings:

  - You are about to drop the column `likes` on the `Memory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "LikedPhoto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,

    CONSTRAINT "LikedPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LikedPhoto_id_key" ON "LikedPhoto"("id");

-- AddForeignKey
ALTER TABLE "LikedPhoto" ADD CONSTRAINT "LikedPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPhoto" ADD CONSTRAINT "LikedPhoto_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
