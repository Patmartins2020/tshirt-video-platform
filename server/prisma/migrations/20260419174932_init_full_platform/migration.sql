/*
  Warnings:

  - Added the required column `title` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "theme" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL,
ALTER COLUMN "templateName" DROP NOT NULL,
ALTER COLUMN "videoType" DROP NOT NULL;
