/*
  Warnings:

  - Made the column `updated_at` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `benefits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `cards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `conditions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `discounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `galleries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `gifts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `promotions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "benefits" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "conditions" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "discounts" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "galleries" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "gifts" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "promotions" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;
