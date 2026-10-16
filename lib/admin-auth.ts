import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "ksd_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.KS_ADMIN_SESSION_SECRET || "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const value = String(expires);
  return { cookieName: COOKIE_NAME, cookieValue: value + "." + sign(value), maxAge: SESSION_SECONDS };
}

export function isAdminRequest(request: NextRequest) {
  const key = secret();
  if (!key) return false;
  const raw = request.cookies.get(COOKIE_NAME)?.value || "";
  const [expires, signature, extra] = raw.split(".");
  if (!expires || !signature || extra || !/^\d+$/.test(expires) || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  const expected = sign(expires);
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminSetupReady() {
  return Boolean(process.env.KS_ADMIN_PASSWORD && process.env.KS_ADMIN_SESSION_SECRET);
}

export function safePasswordMatch(candidate: string) {
  const expected = process.env.KS_ADMIN_PASSWORD || "";
  if (!expected || !candidate) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export { COOKIE_NAME, SESSION_SECONDS };
