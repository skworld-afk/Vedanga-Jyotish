/*
  Warnings:

  - You are about to drop the column `chartType` on the `Chart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chart" DROP COLUMN "chartType",
ADD COLUMN     "ayanamsaDeg" DECIMAL(10,6),
ADD COLUMN     "bhavaChalit" JSONB,
ADD COLUMN     "houses" JSONB,
ADD COLUMN     "moonChart" JSONB,
ADD COLUMN     "panchang" JSONB,
ADD COLUMN     "sunChart" JSONB,
ADD COLUMN     "transit" JSONB,
ADD COLUMN     "vimshottari" JSONB,
ALTER COLUMN "ayanamsa" DROP DEFAULT;
