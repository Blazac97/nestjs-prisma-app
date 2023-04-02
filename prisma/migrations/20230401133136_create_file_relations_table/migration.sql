-- CreateTable
CREATE TABLE "FileRelations" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "resourceName" TEXT NOT NULL,
    "resourceId" INTEGER NOT NULL,

    CONSTRAINT "FileRelations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileRelations_fileId_key" ON "FileRelations"("fileId");

-- AddForeignKey
ALTER TABLE "FileRelations" ADD CONSTRAINT "FileRelations_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
