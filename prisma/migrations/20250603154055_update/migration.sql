/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "updatedAt",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "role" TEXT;
