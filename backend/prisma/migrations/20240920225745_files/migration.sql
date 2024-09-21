-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "remaining_downloads" INTEGER NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_key_key" ON "files"("key");
