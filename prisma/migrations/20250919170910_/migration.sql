-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `nickname` VARCHAR(32) NULL,
    `birth` DATE NULL,
    `code` VARCHAR(8) NOT NULL,
    `device` VARCHAR(16) NULL,
    `email` VARCHAR(32) NULL,
    `phone` VARCHAR(64) NULL,
    `profileUrl` VARCHAR(256) NULL,
    `pushId` VARCHAR(256) NULL,
    `webToken` VARCHAR(52) NULL,
    `appToken` VARCHAR(52) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NULL,
    `lastAccess` DATETIME(3) NULL,
    `quitAt` DATETIME(3) NULL,

    UNIQUE INDEX `user_name_key`(`name`),
    UNIQUE INDEX `user_phone_key`(`phone`),
    UNIQUE INDEX `user_webToken_key`(`webToken`),
    UNIQUE INDEX `user_appToken_key`(`appToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_identity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(24) NOT NULL,
    `providedId` VARCHAR(191) NOT NULL,
    `provider` ENUM('kakao', 'apple', 'google', 'guest') NOT NULL,
    `profileImageUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `user_identity_provider_providedId_key`(`provider`, `providedId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `running_record` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(24) NOT NULL,
    `distance` DOUBLE NOT NULL,
    `targetDistance` DOUBLE NULL,
    `duration` INTEGER NOT NULL,
    `pace` VARCHAR(191) NULL,
    `calories` INTEGER NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `averageHeartRate` INTEGER NULL,
    `steps` INTEGER NULL,
    `routeData` JSON NULL,
    `completionRate` DOUBLE NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_identity` ADD CONSTRAINT `user_identity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `running_record` ADD CONSTRAINT `running_record_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
