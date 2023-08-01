-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_screeningId_fkey";

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("id") ON DELETE CASCADE ON UPDATE CASCADE;
