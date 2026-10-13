const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export type BackendProfile = {
  client_id: string;
  full_name: string;
  email: string | null;
  mobile: string | null;
  company?: string | null;
  country?: string | null;
  role?: string | null;
  about?: string | null;
};

export type BackendQuote = {
  id: string;
  client_id: string;
  project_name: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  timeline: string;
  business_type: string;
  features: string;
  details: string;
  status: string;
  created_at: string;
};

export function backendConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export function getClientToken(): string {
  if (typeof window === "undefined") return "";
  const key = "ksd_client_token";
  let token = window.localStorage.getItem(key);
  if (!token) {
    token = window.crypto?.randomUUID?.() ?? "ks-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.localStorage.setItem(key, token);
  }
  return token;
}

async function request<T>(table: string, options: {
  method?: "GET" | "POST" | "PATCH";
  query?: string;
  body?: unknown;
  prefer?: string;
} = {}): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Database configuration is missing.");
  const token = getClientToken();
  const url = new URL(`/rest/v1/${table}${options.query ? `?${options.query}` : ""}`, SUPABASE_URL);
  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "x-client-id": token,
      "x-ks-token": token,
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Database request failed (${response.status}): ${detail.slice(0, 240)}`);
  }
  if (response.status === 204) return [] as T;
  return response.json() as Promise<T>;
}

export async function loadProfile(): Promise<BackendProfile | null> {
  const token = getClientToken();
  const rows = await request<BackendProfile[]>("client_profiles", {
    query: `select=*&client_id=eq.${encodeURIComponent(token)}&limit=1`,
  });
  return rows[0] ?? null;
}

export async function saveProfile(profile: {
  name: string;
  email: string;
  phone: string;
  address: string;
}): Promise<void> {
  const token = getClientToken();
  await request<BackendProfile[]>("client_profiles?on_conflict=client_id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: {
      client_id: token,
      full_name: profile.name,
      email: profile.email || null,
      mobile: profile.phone || null,
      about: profile.address || null,
    },
  });
}

export async function loadQuotes(): Promise<BackendQuote[]> {
  const token = getClientToken();
  return request<BackendQuote[]>("project_requests", {
    query: `select=*&client_id=eq.${encodeURIComponent(token)}&order=created_at.desc&limit=100`,
  });
}

export async function saveQuote(quote: {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: { id: string; name: string; price: number }[];
  total: number;
  createdAt: string;
}): Promise<BackendQuote> {
  const token = getClientToken();
  const rows = await request<BackendQuote[]>("project_requests", {
    method: "POST",
    prefer: "return=representation",
    body: {
      client_id: token,
      project_name: quote.items.map(item => item.name).join(", ").slice(0, 500) || "KS Digital service enquiry",
      name: quote.name,
      email: quote.email || "not-provided@ks-digital.local",
      service: "Digital package quote",
      budget: `₹${quote.total.toLocaleString("en-IN")}`,
      timeline: "To be confirmed",
      business_type: "KS Digital store customer",
      features: quote.items.map(item => item.name).join("; ").slice(0, 2000),
      details: JSON.stringify({
        orderId: quote.id,
        trackingCode: quote.id,
        phone: quote.phone,
        address: quote.address,
        total: quote.total,
        items: quote.items,
        createdAt: quote.createdAt,
        paymentStatus: "Not paid — quote only",
      }),
      status: "New",
    },
  });
  if (!rows[0]) throw new Error("Quote was not returned by the database.");
  return rows[0];
}

export function mapBackendQuote(row: BackendQuote) {
  let details: {
    orderId?: string;
    trackingCode?: string;
    phone?: string;
    address?: string;
    total?: number;
    items?: { id: string; name: string; price: number }[];
    createdAt?: string;
    paymentStatus?: string;
  } = {};
  try { details = JSON.parse(row.details || "{}"); } catch { /* Older rows may not include structured details. */ }
  const createdAt = details.createdAt || row.created_at;
  return {
    id: details.orderId || row.id,
    trackingCode: details.trackingCode || details.orderId || row.id,
    items: Array.isArray(details.items) ? details.items : [],
    total: Number(details.total ?? 0),
    customerName: row.name,
    email: row.email === "not-provided@ks-digital.local" ? "" : row.email,
    phone: details.phone || "",
    address: details.address || "",
    createdAt,
    status: row.status === "Confirmed" || row.status === "In progress" || row.status === "Shipped" || row.status === "Delivered" || row.status === "Cancelled" ? row.status : "Quote requested",
    paymentStatus: details.paymentStatus || "Not paid — quote only",
  } as const;
}

export async function saveContactMessage(message: { name: string; email: string; message: string }): Promise<void> {
  await request("contact_messages", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      name: message.name.trim(),
      email: message.email.trim(),
      message: message.message.trim(),
    },
  });
}
