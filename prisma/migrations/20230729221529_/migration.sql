-- AlterTable
ALTER TABLE "Auditorium" ADD COLUMN     "campusId" INTEGER;

-- AddForeignKey
ALTER TABLE "Auditorium" ADD CONSTRAINT "Auditorium_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
