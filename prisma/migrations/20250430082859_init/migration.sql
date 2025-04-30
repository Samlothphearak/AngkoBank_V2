/*
  Warnings:

  - You are about to alter the column `accountType` on the `account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `accountStatus` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `account` ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    ADD COLUMN `status` ENUM('active', 'frozen', 'closed', 'pending') NOT NULL DEFAULT 'active',
    MODIFY `accountType` ENUM('checking', 'savings', 'investment', 'credit') NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`,
    MODIFY `accountStatus` ENUM('active', 'frozen', 'closed', 'pending') NOT NULL DEFAULT 'active',
    MODIFY `profileImage` VARCHAR(191) NULL DEFAULT '/public/images/default-profile.png';

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `commune` VARCHAR(191) NOT NULL,
    `village` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Address_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
