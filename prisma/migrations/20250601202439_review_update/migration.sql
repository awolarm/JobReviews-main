/*
  Warnings:

  - You are about to drop the column `comment` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "comment",
DROP COLUMN "company",
DROP COLUMN "rating",
DROP COLUMN "source";
