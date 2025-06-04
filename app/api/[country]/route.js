import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
  try {
    const { country } = await params;

    const selectedCountry = await prisma.country.findUnique({
      where: {
        alpha3Code: country.toUpperCase(),
      },
    });

    if (!selectedCountry) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json(selectedCountry);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch country' }, { status: 500 });
  }
}