export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const trackingNumber = searchParams.get("trackingNumber");
  // ✅ Allowed origin(s)
  const allowedOrigins = [
    "https://baghhoney.com", // replace with your store domain
  ];

  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : "*", // set "*" if you want open access
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // ✅ Handle preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (!trackingNumber) {
    return new Response(
      JSON.stringify({ error: "Tracking number is required" }),
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
  if (!trackingNumber) {
    return new Response(
      JSON.stringify({ error: "Tracking number is required" }),
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.LEOPARDS_API_KEY;
    const apiPassword = process.env.LEOPARDS_API_PASSWORD;
    console.log("key -> ", apiKey);
    console.log("password -> ", apiPassword);
    const apiUrl = `https://merchantapi.leopardscourier.com/api/trackBookedPacket/format/json/?api_key=${apiKey}&api_password=${apiPassword}&track_numbers=${trackingNumber}`;

    const apiRes = await fetch(apiUrl);
    if (!apiRes.ok) {
      throw new Error("Failed to fetch from Leopards API");
    }

    const data = await apiRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
