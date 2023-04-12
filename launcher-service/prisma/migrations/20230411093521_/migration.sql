/*
  Warnings:

  - A unique constraint covering the columns `[escrowAddress]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_escrowAddress_key" ON "Job"("escrowAddress");
