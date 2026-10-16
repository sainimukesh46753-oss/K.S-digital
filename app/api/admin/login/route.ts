import { NextRequest, NextResponse } from "next/server";
import { adminSetupReady, createAdminSession, safePasswordMatch } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!adminSetupReady()) {
    return NextResponse.json({ error: "Admin login is not configured. Add KS_ADMIN_PASSWORD and KS_ADMIN_SESSION_SECRET in Vercel Environment Variables." }, { status: 503 });
  }
  let body: { password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof body.password !== "string" || !safePasswordMatch(body.password)) {
    return NextResponse.json({ error: "Incorrect admin password." }, { status: 401 });
  }
  const session = createAdminSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(session.cookieName, session.cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("ksd_admin_session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
