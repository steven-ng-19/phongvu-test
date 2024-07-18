-- CreateTable
CREATE TABLE "addresses" (
    "id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "address" VARCHAR(50) NOT NULL,
    "ward" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "latitude" INTEGER,
    "longitude" INTEGER,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefits" (
    "id" VARCHAR(36) NOT NULL,
    "discount_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "pm" VARCHAR(255) NOT NULL,
    "type" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "product_id" VARCHAR(36) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image" VARCHAR(100) NOT NULL,
    "isDeprecated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conditions" (
    "id" VARCHAR(36) NOT NULL,
    "order_value_min" DOUBLE PRECISION NOT NULL,
    "order_value_max" DOUBLE PRECISION NOT NULL,
    "min_quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" VARCHAR(36) NOT NULL,
    "percent" INTEGER NOT NULL,
    "maxAmount" DOUBLE PRECISION NOT NULL,
    "flat" INTEGER,
    "max_amount_per_order" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" VARCHAR(36) NOT NULL,
    "productId" VARCHAR(36) NOT NULL,
    "label" VARCHAR(50),
    "url" TEXT NOT NULL,
    "type" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gifts" (
    "id" VARCHAR(36) NOT NULL,
    "benefitId" VARCHAR(36) NOT NULL,
    "sku" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "image" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "max_quantity_per_order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_id" VARCHAR(36) NOT NULL,
    "product_id" VARCHAR(36) NOT NULL,
    "product_data" JSONB NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION,
    "total_price" DOUBLE PRECISION NOT NULL,
    "total_price_with_discount" DOUBLE PRECISION,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "addressId" VARCHAR(36) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "payment_method" VARCHAR(20) NOT NULL,
    "payment_id" VARCHAR(255),
    "paymentDetails" JSONB,
    "notes" VARCHAR(255) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR(36) NOT NULL,
    "categoryId" VARCHAR(36) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "sku" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "discount" INTEGER DEFAULT 0,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" VARCHAR(36) NOT NULL,
    "condition_id" VARCHAR(36) NOT NULL,
    "benefit_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image" VARCHAR(100) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "apply_on" TEXT,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "userName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "is_email_verifiled" BOOLEAN NOT NULL DEFAULT false,
    "is_phone_verifiled" BOOLEAN NOT NULL DEFAULT false,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50),
    "avatar" TEXT,
    "cover" TEXT,
    "role" VARCHAR(10) NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" VARCHAR(10) NOT NULL,
    "email_verification_token" TEXT,
    "reset_password_token" TEXT,
    "customer_id" VARCHAR(100),
    "registration_tokens" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "benefits_discount_id_key" ON "benefits"("discount_id");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_condition_id_key" ON "promotions"("condition_id");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_benefit_id_key" ON "promotions"("benefit_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefits" ADD CONSTRAINT "benefits_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_benefit_id_fkey" FOREIGN KEY ("benefit_id") REFERENCES "benefits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
