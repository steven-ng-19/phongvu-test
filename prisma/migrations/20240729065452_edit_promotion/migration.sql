/*
  Warnings:

  - You are about to drop the column `benefit_id` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the column `condition_id` on the `promotions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[promotion_id]` on the table `benefits` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[promotion_id]` on the table `conditions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `promotion_id` to the `benefits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotion_id` to the `conditions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_benefit_id_fkey";

-- DropForeignKey
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_condition_id_fkey";

-- DropIndex
DROP INDEX "promotions_benefit_id_key";

-- DropIndex
DROP INDEX "promotions_condition_id_key";

-- AlterTable
ALTER TABLE "benefits" ADD COLUMN     "promotion_id" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "conditions" ADD COLUMN     "promotion_id" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "promotions" DROP COLUMN "benefit_id",
DROP COLUMN "condition_id";

-- CreateIndex
CREATE UNIQUE INDEX "benefits_promotion_id_key" ON "benefits"("promotion_id");

-- CreateIndex
CREATE UNIQUE INDEX "conditions_promotion_id_key" ON "conditions"("promotion_id");

-- AddForeignKey
ALTER TABLE "benefits" ADD CONSTRAINT "benefits_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
