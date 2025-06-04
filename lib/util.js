'use server'
import { prisma } from '@/lib/prisma';

// getCountries is not used, replaced with API call to match infinite scroll relies on progressively fetching data as the user scrolls.
export async function getCountries() {
  try {
    const countries = await prisma.country.findMany();
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Failed to fetch countries');
  }
}