-- CreateTable
CREATE TABLE "Product" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Option" (
    "option_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ProductOption" (
    "product_option_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "ProductOption_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductOption_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option" ("option_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "memo" TEXT
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "order_detail_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "OrderDetail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("order_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderDetailOption" (
    "order_detail_option_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_detail_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    CONSTRAINT "OrderDetailOption_order_detail_id_fkey" FOREIGN KEY ("order_detail_id") REFERENCES "OrderDetail" ("order_detail_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderDetailOption_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option" ("option_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductOption_product_id_option_id_key" ON "ProductOption"("product_id", "option_id");
