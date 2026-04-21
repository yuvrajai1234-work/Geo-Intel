import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Fetch Frankfurter Currency Data
    const currencyRes = await fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,CNY,JPY,TRY,BRL,INR", {
       next: { revalidate: 60 } // Cache for 60 seconds
    });
    const currencyData = currencyRes.ok ? await currencyRes.json() : null;

    // 2. Fetch GDELT Threat Data
    const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=conflict%20OR%20crisis%20OR%20%22security%20threat%22%20OR%20sanctions&mode=artlist&format=json&maxrecords=12&sort=datedesc`;
    const gdeltRes = await fetch(gdeltUrl, {
       next: { revalidate: 60 }
    });
    const gdeltData = gdeltRes.ok ? await gdeltRes.json() : null;

    return NextResponse.json({
      currency: currencyData,
      threats: gdeltData
    });
  } catch (error) {
    console.error("Internal Proxy Error:", error);
    return NextResponse.json({ error: "Failed to fetch tactical data" }, { status: 500 });
  }
}
