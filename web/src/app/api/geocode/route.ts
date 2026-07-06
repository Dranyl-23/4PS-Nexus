import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': '4P-Nexus-Stellar-App-Backend/1.0',
        },
      }
    );
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Nominatim error:', text);
      return NextResponse.json({ error: 'Geocoding provider returned error' }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding proxy error:', error);
    return NextResponse.json({ error: 'Failed to geocode' }, { status: 500 });
  }
}
