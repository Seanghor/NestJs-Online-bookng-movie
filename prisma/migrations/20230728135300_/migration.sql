-- CreateEnum
CREATE TYPE "PaymentMethodEnum" AS ENUM ('ABA', 'PAYPAL', 'ACLEDA', 'PHILIP');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "purchaseId" INTEGER;

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "total" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT true,
    "phoneNumber" TEXT NOT NULL,
    "payMentMethod" "PaymentMethodEnum" NOT NULL DEFAULT 'PAYPAL',
    "remark" TEXT,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
