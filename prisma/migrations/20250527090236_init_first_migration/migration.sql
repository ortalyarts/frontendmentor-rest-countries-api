-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "alpha3Code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "subregion" TEXT NOT NULL,
    "topLevelDomain" TEXT[],
    "borders" TEXT[],
    "flagSvg" TEXT NOT NULL,
    "currencies" TEXT[],
    "languages" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_alpha3Code_key" ON "Country"("alpha3Code");
