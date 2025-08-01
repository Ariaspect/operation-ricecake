-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderDetail" (
    "order_detail_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "OrderDetail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("order_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("product_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderDetail" ("order_detail_id", "order_id", "product_id", "quantity") SELECT "order_detail_id", "order_id", "product_id", "quantity" FROM "OrderDetail";
DROP TABLE "OrderDetail";
ALTER TABLE "new_OrderDetail" RENAME TO "OrderDetail";
CREATE TABLE "new_OrderDetailOption" (
    "order_detail_option_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_detail_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    CONSTRAINT "OrderDetailOption_order_detail_id_fkey" FOREIGN KEY ("order_detail_id") REFERENCES "OrderDetail" ("order_detail_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderDetailOption_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option" ("option_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderDetailOption" ("option_id", "order_detail_id", "order_detail_option_id") SELECT "option_id", "order_detail_id", "order_detail_option_id" FROM "OrderDetailOption";
DROP TABLE "OrderDetailOption";
ALTER TABLE "new_OrderDetailOption" RENAME TO "OrderDetailOption";
CREATE TABLE "new_ProductOption" (
    "product_option_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "ProductOption_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("product_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductOption_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option" ("option_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductOption" ("option_id", "price", "product_id", "product_option_id") SELECT "option_id", "price", "product_id", "product_option_id" FROM "ProductOption";
DROP TABLE "ProductOption";
ALTER TABLE "new_ProductOption" RENAME TO "ProductOption";
CREATE UNIQUE INDEX "ProductOption_product_id_option_id_key" ON "ProductOption"("product_id", "option_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
