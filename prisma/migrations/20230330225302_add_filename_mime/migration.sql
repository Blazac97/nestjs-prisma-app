/*
  Warnings:

  - Added the required column `fileName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "mime" TEXT NOT NULL;
