import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function getGoogleAccessToken(serviceAccountJson: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: serviceAccountJson.client_email, scope: "https://www.googleapis.com/auth/siteverification", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now };
  const header = { alg: "RS256", typ: "JWT" };
  const enc = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const signingInput = `${enc(header)}.${enc(payload)}`;
  const pemKey = serviceAccountJson.private_key.replace(/-----BEGIN PRIVATE KEY-----/g, "").replace(/-----END PRIVATE KEY-----/g, "").replace(/\n/g, "");
  const keyData = Uint8Array.from(atob(pemKey), c => c.charCodeAt(0));
  const privateKey = await crypto.subtle.importKey("pkcs8", keyData.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(signingInput));
  const encodedSig = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const jwt = `${signingInput}.${encodedSig}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }) });
  const td = await tokenRes.json();
  if (!td.access_token) throw new Error(`Google token error: ${JSON.stringify(td)}`);
  return td.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SECRET_KEYS")!);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: corsHeaders });

    const { website_id } = await req.json();
    const { data: website } = await supabase.from("websites").select("*").eq("id", website_id).eq("user_id", user.id).single();
    if (!website) return new Response(JSON.stringify({ error: "Website not found" }), { status: 404, headers: corsHeaders });

    const siteUrl = website.value.startsWith("http") ? website.value : `https://${website.value}`;
    const results = {
      crawl: { our_meta: false, google_meta: false, indexnow_file: false, sitemap: false, robots: false },
      verification: { google: false, indexnow: false },
      errors: [] as string[],
    };

    // ── STEP 1: Crawl ──
    let html = "";
    try {
      const res = await fetch(siteUrl, { signal: AbortSignal.timeout(12000) });
      html = await res.text();
    } catch (e) { results.errors.push("Could not fetch website homepage"); }

    if (html) {
      results.crawl.our_meta = html.includes("indexed-by") && html.includes("Indexly");
      results.crawl.google_meta = html.includes(website.google_token);
      try { const r = await fetch(`${siteUrl}/sitemap.xml`, { signal: AbortSignal.timeout(6000) }); results.crawl.sitemap = r.ok; } catch { results.errors.push("sitemap.xml not found"); }
      try { const r = await fetch(`${siteUrl}/robots.txt`, { signal: AbortSignal.timeout(6000) }); results.crawl.robots = r.ok; } catch { results.errors.push("robots.txt not found"); }
      try {
        const r = await fetch(`${siteUrl}/${website.indexnow_key}.txt`, { signal: AbortSignal.timeout(6000) });
        if (r.ok) { const c = await r.text(); results.crawl.indexnow_file = c.trim() === website.indexnow_key; }
      } catch { results.errors.push("IndexNow key file not found"); }
    }

    // Save crawl results
    await supabase.from("crawl_results").insert({
      website_id: website.id,
      our_meta_found: results.crawl.our_meta,
      google_meta_found: results.crawl.google_meta,
      indexnow_file_found: results.crawl.indexnow_file,
      sitemap_found: results.crawl.sitemap,
      robots_found: results.crawl.robots,
    });

    if (!results.crawl.google_meta) {
      await supabase.from("websites").update({ status: "failed" }).eq("id", website.id);
      return new Response(JSON.stringify({
        success: false, results,
        message: "Google meta tag not found on your website. Please add the code to your <head> and try again.",
      }), { headers: corsHeaders });
    }

    // ── STEP 2: Google Verify ──
    try {
      const serviceJson = JSON.parse(Deno.env.get("GOOGLE_SERVICE_JSON")!);
      const accessToken = await getGoogleAccessToken(serviceJson);
      const siteType = website.input_type === "domain" ? "INET_DOMAIN" : "SITE";
      const identifier = website.input_type === "domain" ? website.normalized_value.split("/")[0] : `https://${website.normalized_value}`;

      const gRes = await fetch(`https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=META`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ site: { type: siteType, identifier } }),
      });

      results.verification.google = gRes.ok;
      await supabase.from("indexing_status").upsert({ website_id: website.id, engine: "google", status: gRes.ok ? "verified" : "failed", last_attempt: new Date().toISOString(), attempts: 1 });
    } catch (e: any) {
      results.errors.push(`Google verification error: ${e.message}`);
    }

    // ── STEP 3: IndexNow (independent — always try) ──
    try {
      const baseUrl = website.input_type === "domain"
        ? `https://${website.normalized_value.split("/")[0]}`
        : (website.value.startsWith("http") ? website.value : `https://${website.value}`);

      const inRes = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: website.normalized_value.split("/")[0],
          key: website.indexnow_key,
          keyLocation: `${siteUrl}/${website.indexnow_key}.txt`,
          urlList: [baseUrl],
        }),
      });

      results.verification.indexnow = inRes.ok || inRes.status === 202;
      await supabase.from("indexing_status").upsert({ website_id: website.id, engine: "indexnow", status: results.verification.indexnow ? "indexed" : "failed", last_attempt: new Date().toISOString(), attempts: 1 });
    } catch (e: any) {
      results.errors.push(`IndexNow error: ${e.message}`);
    }

    // ── STEP 4: Final status ──
    const success = results.verification.google || results.verification.indexnow;
    const status = results.verification.google && results.verification.indexnow ? "indexed" : results.verification.google ? "indexed" : "failed";

    await supabase.from("websites").update({
      status, crawl_passed: results.crawl.google_meta,
      sitemap_found: results.crawl.sitemap, robots_found: results.crawl.robots,
      our_meta_verified: results.crawl.our_meta,
    }).eq("id", website.id);

    let message = "";
    if (results.verification.google && results.verification.indexnow) message = "Successfully indexed on Google + 200+ engines via IndexNow!";
    else if (results.verification.google) message = "Indexed on Google. IndexNow submission had an issue — try again later.";
    else if (results.verification.indexnow) message = "Submitted to 200+ engines via IndexNow. Google verification pending.";
    else message = "Verification failed. Please check the issues below and try again.";

    return new Response(JSON.stringify({ success, results, message }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err: any) {
    console.error("verify-and-index error:", err);
    return new Response(JSON.stringify({ error: "Server error", detail: err.message }), { status: 500, headers: corsHeaders });
  }
});
