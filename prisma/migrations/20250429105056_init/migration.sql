/*
  Warnings:

  - You are about to drop the `_permissiontorole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_permissiontorole` DROP FOREIGN KEY `_PermissionToRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_permissiontorole` DROP FOREIGN KEY `_PermissionToRole_B_fkey`;

-- DropTable
DROP TABLE `_permissiontorole`;

-- CreateTable
CREATE TABLE `_RolePermission` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RolePermission_AB_unique`(`A`, `B`),
    INDEX `_RolePermission_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RolePermission` ADD CONSTRAINT `_RolePermission_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RolePermission` ADD CONSTRAINT `_RolePermission_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
