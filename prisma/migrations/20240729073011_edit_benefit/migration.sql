/*
  Warnings:

  - You are about to drop the column `discount_id` on the `benefits` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[benefit_id]` on the table `discounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `benefit_id` to the `discounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "benefits" DROP CONSTRAINT "benefits_discount_id_fkey";

-- DropIndex
DROP INDEX "benefits_discount_id_key";

-- AlterTable
ALTER TABLE "benefits" DROP COLUMN "discount_id";

-- AlterTable
ALTER TABLE "discounts" ADD COLUMN     "benefit_id" VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "discounts_benefit_id_key" ON "discounts"("benefit_id");

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_benefit_id_fkey" FOREIGN KEY ("benefit_id") REFERENCES "benefits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
