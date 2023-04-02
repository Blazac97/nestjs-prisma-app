/*
  Warnings:

  - A unique constraint covering the columns `[pictureId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "pictureId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Block_pictureId_key" ON "Block"("pictureId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
