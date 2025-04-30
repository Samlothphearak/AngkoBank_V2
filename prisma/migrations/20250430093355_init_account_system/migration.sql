/*
  Warnings:

  - The values [checking,savings,investment,credit] on the enum `Account_accountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `currency` on the `account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to drop the column `accountNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `user` table. All the data in the column will be lost.
  - Made the column `firstName` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_accountNumber_key` ON `user`;

-- AlterTable
ALTER TABLE `account` MODIFY `accountType` ENUM('Wallet', 'Checking', 'Savings', 'Investment', 'Credit') NOT NULL,
    MODIFY `currency` ENUM('KHR', 'USD') NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `accountNumber`,
    DROP COLUMN `balance`,
    MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL;
