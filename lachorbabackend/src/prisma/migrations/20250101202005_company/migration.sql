/*
  Warnings:

  - You are about to drop the column `Company` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Company",
ADD COLUMN     "company" TEXT;
