import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── RSA JWT signing for Google OAuth ───────────────────────────────
async function getGoogleAccessToken(serviceAccountJson: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccountJson.client_email,
    scope: "https://www.googleapis.com/auth/siteverification",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  // Encode header + payload
  const header = { alg: "RS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // Import private key
  const pemKey = serviceAccountJson.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\n/g, "");

  const keyData = Uint8Array.from(atob(pemKey), c => c.charCodeAt(0));
  const privateKey = await crypto.subtle.importKey(
    "pkcs8", keyData.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["sign"]
  );

  // Sign
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, encoder.encode(signingInput));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const jwt = `${signingInput}.${encodedSignature}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Google token error: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

// ─── Generate Indexly unique ID ─────────────────────────────────────
function generateIndexlyId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "idx-";
  for (let i = 0; i < 16; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ─── Main handler ────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SECRET_KEYS")!);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: corsHeaders });

    // 2. Rate limit — IP
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const oneMinAgo = new Date(Date.now() - 60000).toISOString();
    const { count: recentCount } = await supabase.from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIP).eq("endpoint", "generate-token").gte("window_start", oneMinAgo);

    if ((recentCount || 0) >= 5) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait 1 minute." }), { status: 429, headers: corsHeaders });
    }
    await supabase.from("rate_limits").insert({ ip_address: clientIP, endpoint: "generate-token" });

    // 3. Parse request
    const { url, input_type } = await req.json();
    if (!url || !input_type) return new Response(JSON.stringify({ error: "URL and input_type required" }), { status: 400, headers: corsHeaders });

    // 4. Normalize URL
    const normalized = url.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "").trim();

    // 5. Already indexed check
    const { data: existing } = await supabase.from("websites")
      .select("id, status, google_token, indexnow_key, indexly_id")
      .eq("user_id", user.id).eq("normalized_value", normalized).single();

    if (existing?.status === "indexed") {
      return new Response(JSON.stringify({ error: "already_indexed", message: "This website is already indexed!" }), { headers: corsHeaders });
    }

    // 6. Daily limit check
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabase.from("websites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id).gte("created_at", todayStart.toISOString())
      .neq("id", existing?.id || "00000000-0000-0000-0000-000000000000");

    if ((todayCount || 0) >= 1 && !existing) {
      return new Response(JSON.stringify({ error: "daily_limit", message: "Daily limit reached. Come back tomorrow." }), { status: 429, headers: corsHeaders });
    }

    // 7. URL accessibility check
    const checkUrl = url.startsWith("http") ? url : `https://${url}`;
    try {
      // Try HEAD first, then GET fallback
      let siteOk = false;
      try {
        const headRes = await fetch(checkUrl, { method: "HEAD", signal: AbortSignal.timeout(12000) });
        siteOk = headRes.ok || headRes.status === 405 || headRes.status === 301 || headRes.status === 302;
      } catch {
        // HEAD failed, try GET
        const getRes = await fetch(checkUrl, { method: "GET", signal: AbortSignal.timeout(15000) });
        siteOk = getRes.ok;
      }
      if (!siteOk) {
        return new Response(JSON.stringify({ error: "Website not accessible. Please check the URL and try again." }), { status: 400, headers: corsHeaders });
      }
    } catch {
      return new Response(JSON.stringify({ error: "Could not reach the website. Please check the URL." }), { status: 400, headers: corsHeaders });
    }

    // 8. Reuse tokens or generate new
    let googleToken = existing?.google_token;
    let indexnowKey = existing?.indexnow_key;
    let indexlyId = existing?.indexly_id;

    if (!googleToken) {
      const serviceAccountJson = JSON.parse(Deno.env.get("GOOGLE_SERVICE_JSON")!);
      const accessToken = await getGoogleAccessToken(serviceAccountJson);

      const siteType = input_type === "domain" ? "INET_DOMAIN" : "SITE";
      const identifier = input_type === "domain" ? normalized.split("/")[0] : `https://${normalized}`;

      const verifyRes = await fetch("https://www.googleapis.com/siteVerification/v1/token", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ verificationMethod: "META", site: { type: siteType, identifier } }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.token) throw new Error(`Google verification token error: ${JSON.stringify(verifyData)}`);
      googleToken = verifyData.token;
    }

    if (!indexnowKey) indexnowKey = crypto.randomUUID().replace(/-/g, "");
    if (!indexlyId) indexlyId = generateIndexlyId();

    // 9. Save to DB
    const websiteData = {
      user_id: user.id, input_type, value: url, normalized_value: normalized,
      google_token: googleToken, indexnow_key: indexnowKey, indexly_id: indexlyId,
      status: "code_generated",
    };

    if (existing) {
      await supabase.from("websites").update(websiteData).eq("id", existing.id);
    } else {
      await supabase.from("websites").insert(websiteData);
    }

    // 10. Build response
    const metaTag = `<meta name="google-site-verification" content="${googleToken}">`;
    const ourMetaTag = `<meta name="indexed-by" content="Indexly" data-indexly-id="${indexlyId}">`;

    return new Response(JSON.stringify({
      success: true,
      google_token: googleToken,
      indexnow_key: indexnowKey,
      indexly_id: indexlyId,
      meta_tag: metaTag,
      our_meta_tag: ourMetaTag,
      indexnow_file_name: `${indexnowKey}.txt`,
      indexnow_file_content: indexnowKey,
      combined_meta: `${metaTag}\n${ourMetaTag}`,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err: any) {
    console.error("generate-token error:", err);
    return new Response(JSON.stringify({ error: "Server error", detail: err.message }), { status: 500, headers: corsHeaders });
  }
});
