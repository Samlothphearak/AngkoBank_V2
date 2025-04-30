/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `accountNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_accountNumber_key` ON `User`(`accountNumber`);
