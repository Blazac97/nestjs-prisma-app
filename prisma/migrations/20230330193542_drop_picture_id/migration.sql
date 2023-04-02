/*
  Warnings:

  - You are about to drop the column `pictureId` on the `Block` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_pictureId_fkey";

-- DropIndex
DROP INDEX "Block_pictureId_key";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "pictureId";
