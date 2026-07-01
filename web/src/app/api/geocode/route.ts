import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    // Switching to Photon (Komoot) because OSM Nominatim strictly rate limits (429) very quickly.
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Photon API' }, { status: response.status });
    }

    const data = await response.json();
    
    // Map Photon GeoJSON response to match the older Nominatim format expected by the frontend
    if (data && data.features && data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates; // [lon, lat]
      return NextResponse.json([
        {
          lat: coords[1].toString(),
          lon: coords[0].toString()
        }
      ]);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
