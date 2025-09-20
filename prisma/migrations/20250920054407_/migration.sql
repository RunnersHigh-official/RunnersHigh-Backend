/*
  Warnings:

  - You are about to drop the column `steps` on the `running_record` table. All the data in the column will be lost.
  - Added the required column `averageCadence` to the `running_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalType` to the `running_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxHeartRate` to the `running_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `running_record` table without a default value. This is not possible if the table is not empty.
  - Made the column `pace` on table `running_record` required. This step will fail if there are existing NULL values in that column.
  - Made the column `calories` on table `running_record` required. This step will fail if there are existing NULL values in that column.
  - Made the column `averageHeartRate` on table `running_record` required. This step will fail if there are existing NULL values in that column.
  - Made the column `routeData` on table `running_record` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `running_record` DROP COLUMN `steps`,
    ADD COLUMN `averageCadence` INTEGER NOT NULL,
    ADD COLUMN `goalType` ENUM('DISTANCE', 'TIME') NOT NULL,
    ADD COLUMN `maxHeartRate` INTEGER NOT NULL,
    ADD COLUMN `targetDuration` INTEGER NULL,
    ADD COLUMN `title` VARCHAR(255) NOT NULL,
    MODIFY `pace` VARCHAR(191) NOT NULL,
    MODIFY `calories` INTEGER NOT NULL,
    MODIFY `averageHeartRate` INTEGER NOT NULL,
    MODIFY `routeData` JSON NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
