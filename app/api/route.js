import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.js";

// export async function GET() {
//   try {
//     const countries = await prisma.country.findMany();
//     return NextResponse.json({ countries });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
//   }
// }


// export async function GET(req) {
//   const { searchParams } = new URL(req.url)
//   const page = parseInt(searchParams.get('page') || '0')
//   const limit = parseInt(searchParams.get('limit') || '20')

//   const countries = await prisma.country.findMany({
//     skip: page * limit,
//     take: limit,
//     orderBy: { name: 'asc' },
//   })

//   return NextResponse.json(countries)
// }

// API endpoint to fetch countries with infinite scroll and filtering(search and/or region)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    const q = searchParams.get('q')?.toLowerCase();
    const region = searchParams.get('region')?.toLowerCase();

    const where = {
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { region: { contains: q, mode: 'insensitive' } },
          { subregion: { contains: q, mode: 'insensitive' } },
        ],
      }),
      ...(region && { region: { equals: region, mode: 'insensitive' } }),
    };

    const countries = await prisma.country.findMany({
      where,
      skip,
      take,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ countries });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const newCountry = await prisma.country.create({
      data: {
        alpha3Code: body.alpha3Code,
        name: body.name,
        nativeName: body.nativeName,
        capital: body.capital,
        population: body.population,
        region: body.region,
        subregion: body.subregion,
        topLevelDomain: body.topLevelDomain,
        borders: body.borders,
        flagSvg: body.flags?.svg || body.flag,
        currencies: body.currencies.map(c => c.name),
        languages: body.languages.map(l => l.name),
      },
    });

    return NextResponse.json({ country: newCountry });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create country' }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";

// const data = [];

// export function GET(){
//     return NextResponse.json({data});
// }
// export async function POST(req){
//     const body = await req.json();
//     console.log(body);
//     return NextResponse.json({body});
// }