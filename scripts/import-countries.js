import { prisma } from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';

async function main() {
  const filePath = path.resolve('./scripts/data.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const countries = JSON.parse(fileContent);

  for (const country of countries) {
    // Defensive checks
    const svgFlag = country.flags?.svg || null;
    const currencyNames = Array.isArray(country.currencies)
      ? country.currencies.map(c => c.name).filter(Boolean)
      : [];
    const languageNames = Array.isArray(country.languages)
      ? country.languages.map(l => l.name).filter(Boolean)
      : [];

    try {
      // await prisma.country.create({
      //   data: {
      //     alpha3Code: country.alpha3Code,
      //     name: country.name,
      //     nativeName: country.nativeName,
      //     capital: country.capital || null,
      //     population: country.population,
      //     region: country.region,
      //     subregion: country.subregion,
      //     topLevelDomain: country.topLevelDomain || [],
      //     borders: country.borders || [],
      //     flagSvg: svgFlag,
      //     currencies: currencyNames,
      //     languages: languageNames,
      //   },
      // });
      await prisma.country.upsert({
        where: { alpha3Code: country.alpha3Code },
        update: {}, // Leave empty to skip updating existing ones
        create: {
          alpha3Code: country.alpha3Code,
          name: country.name,
          nativeName: country.nativeName || "",
          capital: country.capital || "",
          population: country.population || 0,
          region: country.region || "",
          subregion: country.subregion || "",
          topLevelDomain: country.topLevelDomain || [],
          borders: country.borders || [],
          flagSvg: svgFlag,
          currencies: currencyNames,
          languages: languageNames,
        },
      });
    } catch (err) {
      console.error(`Failed to import ${country.name}:`, err.message);
    }
  }

  console.log('✅ All countries imported.');
}

main()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });