import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "../../../../lib/admin-auth";

export const runtime = "nodejs";
const allowedStatuses = ["New", "In Progress", "Completed", "Cancelled", "Confirmed", "In progress", "Shipped", "Delivered"];

function config() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function deny() {
  return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return deny();
  const { url, key } = config();
  if (!url || !key) return NextResponse.json({ error: "Admin database is not configured. Add SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables." }, { status: 503 });
  const upstream = await fetch(new URL("/rest/v1/project_requests?select=id,client_id,project_name,name,email,service,budget,timeline,business_type,features,details,status,created_at&order=created_at.desc&limit=200", url), {
    headers: { apikey: key, Authorization: "Bearer " + key },
    cache: "no-store",
  });
  if (!upstream.ok) return NextResponse.json({ error: "Could not load order requests from Supabase." }, { status: 502 });
  const rows = await upstream.json();
  return NextResponse.json({ orders: rows });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return deny();
  const { url, key } = config();
  if (!url || !key) return NextResponse.json({ error: "Admin database is not configured." }, { status: 503 });
  let body: { id?: unknown; status?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof body.id !== "string" || typeof body.status !== "string" || !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Valid order ID and status are required." }, { status: 400 });
  }
  const endpoint = new URL("/rest/v1/project_requests?id=eq." + encodeURIComponent(body.id), url);
  const upstream = await fetch(endpoint, {
    method: "PATCH",
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ status: body.status }),
    cache: "no-store",
  });
  if (!upstream.ok) return NextResponse.json({ error: "Could not update order status." }, { status: 502 });
  const rows = await upstream.json();
  if (!rows.length) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order: rows[0] });
}
