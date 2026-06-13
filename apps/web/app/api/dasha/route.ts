// app/api/dasha/route.ts
import { NextResponse } from 'next/server';
import { calculateVimshottariDasha } from '../../../lib/astrology/dasha';

interface DashaRequest {
  birthDate: string;
  moonLongitude: number;
}

export async function POST(request: Request) {
  try {
    const body: DashaRequest = await request.json();
    const { birthDate, moonLongitude } = body;

    // Validate inputs
    if (!birthDate || isNaN(Date.parse(birthDate))) {
      return NextResponse.json({ error: 'Invalid or missing birthDate. Use ISO string format.' }, { status: 400 });
    }
    
    if (typeof moonLongitude !== 'number' || moonLongitude < 0 || moonLongitude >= 360) {
      return NextResponse.json({ error: 'moonLongitude must be a valid number between 0 and 360' }, { status: 400 });
    }

    const dateOfBirth = new Date(birthDate);
    const dashaPeriods = calculateVimshottariDasha(dateOfBirth, moonLongitude);

    return NextResponse.json({ 
      success: true, 
      data: {
        birthDate: dateOfBirth.toISOString(),
        moonLongitude,
        dashaPeriods 
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
