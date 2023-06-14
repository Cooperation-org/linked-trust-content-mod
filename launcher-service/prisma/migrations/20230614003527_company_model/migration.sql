-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "contactPersonEmail" TEXT,
ADD COLUMN     "contactPersonName" TEXT,
ADD COLUMN     "webhook" TEXT;

-- AlterTable
ALTER TABLE "JobCreator" ADD COLUMN     "companyId" INTEGER;

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER,
    "avgMonthlyVolume" INTEGER,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- AddForeignKey
ALTER TABLE "JobCreator" ADD CONSTRAINT "JobCreator_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
