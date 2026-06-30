import { NextResponse } from 'next/server';

// Mock DSWD Database for the Hackathon
const mockDswdRegistry: Record<string, {
  householdId: string;
  name: string;
  dob: string;
  status: string;
}> = {
  '12345-6789': {
    householdId: '12345-6789',
    name: 'Juan Dela Cruz',
    dob: '1980-01-01',
    status: 'ACTIVE_BENEFICIARY'
  },
  '98765-4321': {
    householdId: '98765-4321',
    name: 'Maria Clara',
    dob: '1990-05-15',
    status: 'ACTIVE_BENEFICIARY'
  }
};

export async function POST(request: Request) {
  try {
    const { householdId, dob } = await request.json();

    if (!householdId || !dob) {
      return NextResponse.json(
        { success: false, error: 'Missing householdId or dob' },
        { status: 400 }
      );
    }

    const beneficiary = mockDswdRegistry[householdId];

    if (!beneficiary) {
      return NextResponse.json(
        { success: false, error: 'Household ID not found in DSWD registry' },
        { status: 404 }
      );
    }

    if (beneficiary.dob !== dob) {
      return NextResponse.json(
        { success: false, error: 'Invalid Date of Birth' },
        { status: 401 }
      );
    }

    if (beneficiary.status !== 'ACTIVE_BENEFICIARY') {
      return NextResponse.json(
        { success: false, error: 'Beneficiary status is not active' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: beneficiary
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
