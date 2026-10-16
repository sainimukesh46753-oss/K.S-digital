"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import OperationsPanel from "./operations-panel";
import { Activity, BarChart3, BriefcaseBusiness, CheckCircle2, ClipboardList, CreditCard, Download, FileText, FolderKanban, Gift, Headset, LayoutDashboard, LogOut, LockKeyhole, Package, QrCode, RefreshCw, Search, ShieldCheck, Users, WalletCards } from "lucide-react";

type OrderRow = {
  id: string; name: string; email: string; service: string; budget: string; status: string;
  created_at: string; project_name: string; details: string | null; timeline?: string;
};
type Tab = "Overview" | "Orders" | "Projects" | "CRM & Leads" | "Services & Portfolio" | "Payments & Invoices" | "Support" | "Analytics" | "QR Business Card";

const tabs: { label: Tab; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard }, { label: "Orders", icon: ClipboardList },
  { label: "Projects", icon: FolderKanban }, { label: "CRM & Leads", icon: Users },
  { label: "Services & Portfolio", icon: BriefcaseBusiness }, { label: "Payments & Invoices", icon: WalletCards },
  { label: "Support", icon: Headset }, { label: "Analytics", icon: BarChart3 },
  { label: "QR Business Card", icon: QrCode },
];
const money = (value: number) => "₹" + value.toLocaleString("en-IN");
function detailsFor(row: OrderRow) {
  try { return JSON.parse(row.details || "{}") as { orderId?: string; phone?: string; address?: string; total?: number; items?: { name: string; price: number }[]; paymentStatus?: string; trackingCode?: string }; }
  catch { return {} as { orderId?: string; phone?: string; address?: string; total?: number; items?: { name: string; price: number }[]; paymentStatus?: string; trackingCode?: string }; }
}
function totalFor(row: OrderRow) {
  const parsed = detailsFor(row);
  if (typeof parsed.total === "number") return parsed.total;
  const number = Number((row.budget || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Overview");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [origin, setOrigin] = useState("https://ks-digital.example");

  async function loadOrders() {
    setChecking(true); setError("");
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load orders.");
      setOrders(data.orders || []); setAuthenticated(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not connect.";
      if (message.includes("Admin authentication required")) { setAuthenticated(false); setError(""); }
      else setError(message);
    } finally { setChecking(false); }
  }
  useEffect(() => { setOrigin(window.location.origin); void loadOrders(); }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      setPassword(""); await loadOrders();
    } catch (e) { setError(e instanceof Error ? e.message : "Login failed."); }
    finally { setLoading(false); }
  }
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false); setOrders([]); setTab("Overview");
  }
  async function updateStatus(id: string, status: string) {
    setNotice(""); setError("");
    try {
      const response = await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Status update failed.");
      setOrders(old => old.map(order => order.id === id ? { ...order, status } : order));
      setNotice("Order status updated.");
    } catch (e) { setError(e instanceof Error ? e.message : "Status update failed."); }
  }
  const filtered = useMemo(() => orders.filter(row => [row.name, row.email, row.service, row.project_name, row.id, detailsFor(row).orderId || ""].join(" ").toLowerCase().includes(query.toLowerCase())), [orders, query]);
  const totalValue = orders.reduce((sum, row) => sum + totalFor(row), 0);
  const pending = orders.filter(row => !["Completed", "Delivered", "Cancelled"].includes(row.status)).length;
  const currencyRows = orders.filter(row => { const status = (detailsFor(row).paymentStatus || "").toLowerCase(); return status.startsWith("paid") && !status.startsWith("not paid"); });
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=" + encodeURIComponent(origin);

  if (!authenticated) return <main style={styles.loginShell}>
    <section style={styles.loginCard}>
      <div style={styles.logo}>KS<span>•</span> DIGITAL</div>
      <div style={styles.lockIcon}><LockKeyhole size={24}/></div>
      <p style={styles.eyebrow}>PRIVATE ADMIN AREA</p>
      <h1 style={styles.loginTitle}>Welcome back.</h1>
      <p style={styles.muted}>Sign in to manage KS Digital orders, customers and operations. This area is separate from the customer workspace.</p>
      <form onSubmit={login} style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <label style={styles.label}>Admin password<input style={styles.input} type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" required /></label>
        <button style={styles.primary} disabled={loading}>{loading ? "Signing in…" : "Secure sign in"}</button>
      </form>
      {error && <p role="alert" style={styles.error}>{error}</p>}
      <div style={styles.securityNote}><ShieldCheck size={17}/><span>Protected by a server-verified session. Admin data is never loaded into the public customer page.</span></div>
      <a href="/customer" style={styles.backLink}>← Back to customer workspace</a>
    </section>
  </main>;

  return <main className="ks-admin-shell" style={styles.shell}>
    <aside className="ks-admin-sidebar" style={styles.sidebar}>
      <a href="/" style={styles.logo}>KS<span>•</span> DIGITAL</a>
      <div style={styles.adminBadge}><ShieldCheck size={15}/> ADMIN CONSOLE</div>
      <p style={styles.sideCaption}>WORKSPACE</p>
      <nav className="ks-admin-nav" style={styles.nav}>{tabs.map(item => { const Icon = item.icon; return <button key={item.label} onClick={() => setTab(item.label)} style={{ ...styles.navItem, ...(tab === item.label ? styles.navActive : {}) }}><Icon size={17}/>{item.label}</button>; })}</nav>
      <div style={styles.sidebarBottom}><span style={styles.secureDot}/> Private admin session <button style={styles.logout} onClick={logout}><LogOut size={15}/> Sign out</button></div>
    </aside>
    <section className="ks-admin-main" style={styles.main}>
      <header style={styles.topbar}><div><p style={styles.eyebrow}>KS DIGITAL / ADMIN</p><h1 style={styles.pageTitle}>{tab}</h1></div><div style={styles.topActions}><span style={styles.status}><span style={styles.secureDot}/> Secure session</span><button style={styles.iconButton} onClick={() => void loadOrders()} title="Refresh orders"><RefreshCw size={17}/></button></div></header>
      {error && <div role="alert" style={styles.errorBanner}>{error}</div>}
      {notice && <div style={styles.successBanner}><CheckCircle2 size={17}/>{notice}</div>}
      {tab === "Overview" && <>
        <div style={styles.hero}><div><p style={styles.heroEyebrow}>YOUR BUSINESS, AT A GLANCE</p><h2 style={styles.heroTitle}>Make every detail<br/>move your business forward.</h2><p style={styles.heroText}>Manage requests, projects and customer operations from one private workspace.</p><button style={styles.heroButton} onClick={() => setTab("Orders")}>Review orders →</button></div><div className="ks-admin-hero-art" style={styles.heroArt}><div style={styles.artCircle}><Activity size={42}/></div><span style={styles.artPill}>KS DIGITAL</span><span style={styles.artLine}/></div></div>
        <div style={styles.stats}>{[{ label:"Order / quote requests", value:orders.length, icon:ClipboardList },{label:"Work in progress",value:pending,icon:FolderKanban},{label:"Request value",value:money(totalValue),icon:BarChart3},{label:"Marked paid in records",value:currencyRows.length,icon:CreditCard}].map(item=>{const Icon=item.icon;return <article key={item.label} style={styles.stat}><span style={styles.statIcon}><Icon size={19}/></span><span style={styles.statLabel}>{item.label}</span><strong style={styles.statValue}>{item.value}</strong><small style={styles.statFoot}>Based on current database records</small></article>;})}</div>
        <section style={styles.panel}><div style={styles.panelHead}><div><h2 style={styles.sectionTitle}>Latest requests</h2><p style={styles.muted}>Real rows from Supabase, newest first.</p></div><button style={styles.textButton} onClick={() => setTab("Orders")}>View all orders →</button></div><OrderTable rows={filtered.slice(0,5)} onStatus={updateStatus}/></section>
        <div style={styles.twoCol}><section style={styles.panel}><h2 style={styles.sectionTitle}>Operations shortcuts</h2><div style={styles.shortcutGrid}>{tabs.slice(2).map(item=>{const Icon=item.icon;return <button key={item.label} style={styles.shortcut} onClick={()=>setTab(item.label)}><Icon size={18}/><span>{item.label}</span><span>↗</span></button>;})}</div></section><section style={styles.panel}><h2 style={styles.sectionTitle}>Security & setup</h2><p style={styles.muted}>Customer and admin interfaces are separated. Order data is fetched only after server-side admin verification. Payment collection, automated email/SMS, cloud file storage and lead persistence need their provider credentials before they can be activated.</p><div style={styles.checkRow}><CheckCircle2 size={17}/> Admin session protection</div><div style={styles.checkRow}><CheckCircle2 size={17}/> Server-side Supabase access</div><div style={styles.checkRow}><CheckCircle2 size={17}/> Separate customer navigation</div></section></div>
      </>}
      {tab === "Orders" && <section style={styles.panel}><div style={styles.panelHead}><div><h2 style={styles.sectionTitle}>Order & quote requests</h2><p style={styles.muted}>Update the workflow status. Payment status is shown as recorded; this page does not collect payments.</p></div><button style={styles.secondary} onClick={() => { const csv = ["Order ID,Customer,Email,Service,Budget,Status,Created", ...filtered.map(r => [detailsFor(r).orderId || r.id,r.name,r.email,r.service,r.budget,r.status,r.created_at].map(v => '"' + String(v || "").replace(/"/g,'""') + '"').join(","))].join("\n"); const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="ks-digital-orders.csv"; a.click(); URL.revokeObjectURL(url); }}><Download size={15}/> Export CSV</button></div><div style={styles.searchWrap}><Search size={17}/><input style={styles.searchInput} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search order, customer, email or service…"/></div><OrderTable rows={filtered} onStatus={updateStatus}/></section>}
      {tab === "Projects" && <OperationsPanel section="Projects" />}
      {tab === "CRM & Leads" && <OperationsPanel section="CRM & Leads" />}
      {tab === "Services & Portfolio" && <OperationsPanel section="Services & Portfolio" />}
      {tab === "Payments & Invoices" && <section style={styles.panel}><div style={styles.panelHead}><div><h2 style={styles.sectionTitle}>Payments & invoices</h2><p style={styles.muted}>No payment gateway is connected. Existing quote requests are not proof of payment.</p></div><CreditCard size={22}/></div><div style={styles.noticeCard}><ShieldCheck size={22}/><div><b>Payment safety first</b><p>Connect a payment provider and verify payment webhooks on the server before marking an order paid. Do not store card details here.</p></div></div><OrderTable rows={filtered} onStatus={updateStatus} showPayment/></section>}
      {tab === "Support" && <OperationsPanel section="Support" />}
      {tab === "Analytics" && <section style={styles.panel}><h2 style={styles.sectionTitle}>Business analytics</h2><p style={styles.muted}>Calculated from the records currently returned by the database. Request value is not recognised revenue.</p><div style={styles.stats}>{[{label:"Total requests",value:orders.length},{label:"Open requests",value:pending},{label:"Request value",value:money(totalValue)},{label:"Completed",value:orders.filter(o=>["Completed","Delivered"].includes(o.status)).length}].map(x=><article key={x.label} style={styles.stat}><span style={styles.statLabel}>{x.label}</span><strong style={styles.statValue}>{x.value}</strong></article>)}</div><div style={styles.chartBars}>{["New","In Progress","Completed","Cancelled"].map(status=>{const count=orders.filter(o=>o.status.toLowerCase()===status.toLowerCase()).length;return <div key={status} style={styles.barRow}><span>{status}</span><div style={styles.barTrack}><div style={{...styles.barFill,width:(orders.length?count/orders.length*100:0)+"%"}}/></div><b>{count}</b></div>;})}</div></section>}
      {tab === "QR Business Card" && <section style={styles.panel}><div style={styles.panelHead}><div><h2 style={styles.sectionTitle}>KS Digital QR & digital business card</h2><p style={styles.muted}>Scan to open the current website URL.</p></div><QrCode size={24}/></div><div className="ks-admin-qr-layout" style={styles.qrLayout}><div style={styles.qrBox}><img src={qrUrl} alt="QR code for the KS Digital website" width="220" height="220"/><small>{origin}</small></div><div><h3 style={styles.sectionTitle}>Share your digital presence</h3><p style={styles.muted}>Print this QR code on a business card or brochure to direct visitors to the website. Check that the deployed domain is correct before printing.</p><button style={styles.primary} onClick={()=>{void navigator.clipboard.writeText(origin);setNotice("Website link copied.");}}>Copy website link</button><button style={styles.secondary} onClick={()=>window.open(origin,"_blank","noopener,noreferrer")}>Open website ↗</button></div></div></section>}
      <footer style={styles.footer}>© {new Date().getFullYear()} KS Digital · Private administrator workspace · <a href="/customer">Customer workspace</a></footer>
    </section>
    <style jsx global>{`
      @media (max-width: 900px) {
        .ks-admin-shell { display: block !important; }
        .ks-admin-sidebar { width: auto !important; padding: 14px !important; border-right: 0 !important; border-bottom: 1px solid #e5eaf2; }
        .ks-admin-sidebar > p { display: none !important; }
        .ks-admin-nav { display: flex !important; gap: 6px !important; overflow-x: auto; padding: 8px 0; }
        .ks-admin-nav button { white-space: nowrap; flex: 0 0 auto; }
        .ks-admin-sidebar > div:last-child { padding-top: 10px !important; }
        .ks-admin-main { padding: 20px 14px !important; }
        .ks-admin-hero-art { display: none !important; }
      }
      @media (max-width: 560px) {
        .ks-admin-qr-layout { grid-template-columns: 1fr !important; }
        .ks-admin-main header { align-items: flex-start !important; }
        .ks-admin-main h1 { font-size: 22px !important; }
        .ks-admin-table-wrap table { min-width: 760px; }
      }
    `}</style>
  </main>;
}

function OrderTable({ rows, onStatus, showPayment = false }: { rows: OrderRow[]; onStatus: (id:string,status:string)=>void; showPayment?: boolean }) {
  if (!rows.length) return <div style={styles.empty}><ClipboardList size={26}/><b>No matching order requests</b><span>Requests saved to Supabase will appear here.</span></div>;
  return <div className="ks-admin-table-wrap" style={styles.tableWrap}><table style={styles.table}><thead><tr><th>ORDER / CUSTOMER</th><th>SERVICE & ITEMS</th><th>AMOUNT</th><th>STATUS</th>{showPayment && <th>PAYMENT</th>}<th>DATE</th></tr></thead><tbody>{rows.map(row=>{const detail=detailsFor(row); const normalizedStatus = row.status.toLowerCase() === "new" ? "New" : row.status.toLowerCase() === "in progress" ? "In Progress" : row.status; return <tr key={row.id}><td><b>{detail.orderId || row.id.slice(0,8)}</b><span style={styles.cellSub}>{row.name || "Customer"}</span><span style={styles.cellSub}>{row.email}</span>{detail.phone && <span style={styles.cellSub}>{detail.phone}</span>}</td><td><b>{row.service}</b><span style={styles.cellSub}>{(detail.items||[]).map(item=>item.name).join(", ") || row.project_name || "Details not available"}</span>{detail.address && <span style={styles.cellSub}>{detail.address}</span>}</td><td><b>{money(totalFor(row))}</b></td><td><select style={styles.statusSelect} aria-label={"Update status for "+row.name} value={normalizedStatus} onChange={e=>onStatus(row.id,e.target.value)}>{["New","In Progress","Completed","Cancelled","Confirmed","Shipped","Delivered"].map(status=><option key={status}>{status}</option>)}</select></td>{showPayment && <td><span style={styles.paymentBadge}>{detail.paymentStatus || "Unverified / not recorded"}</span></td>}<td>{new Date(row.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td></tr>;})}</tbody></table></div>;
}

function FeaturePanel({ icon: Icon, title, text, items }: { icon: typeof LayoutDashboard; title: string; text: string; items: string[] }) {
  return <section style={styles.panel}><div style={styles.featureHero}><span style={styles.featureIcon}><Icon size={24}/></span><div><h2 style={styles.sectionTitle}>{title}</h2><p style={styles.muted}>{text}</p></div></div><div style={styles.featureGrid}>{items.map(item=><article key={item} style={styles.featureItem}><CheckCircle2 size={17}/><span>{item}</span></article>)}</div><div style={styles.noticeCard}><ShieldCheck size={20}/><div><b>Secure-by-design rollout</b><p>These management sections are separated from customer pages. Any write or customer-specific data access should go through authenticated server endpoints.</p></div></div></section>;
}

const styles: Record<string, CSSProperties> = {
  shell:{minHeight:"100vh",display:"flex",background:"#f5f7fb",color:"#182235",fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif"},
  sidebar:{width:260,background:"#fff",borderRight:"1px solid #e5eaf2",padding:"26px 16px",display:"flex",flexDirection:"column",flexShrink:0},
  logo:{fontSize:19,fontWeight:900,letterSpacing:"-.8px",textDecoration:"none",color:"#17233a",padding:"0 12px"},
  adminBadge:{display:"flex",alignItems:"center",gap:7,background:"#eef2ff",color:"#4845a6",fontSize:10,fontWeight:800,letterSpacing:".9px",padding:"10px 12px",borderRadius:10,margin:"25px 4px 30px"},
  sideCaption:{fontSize:10,fontWeight:800,letterSpacing:1.4,color:"#8994a8",padding:"0 12px"},
  nav:{display:"grid",gap:5},
  navItem:{border:0,background:"transparent",color:"#69758a",padding:"11px 12px",borderRadius:10,display:"flex",alignItems:"center",gap:11,textAlign:"left",fontSize:13,fontWeight:650,cursor:"pointer"},
  navActive:{background:"#edf0ff",color:"#4f46e5"},
  sidebarBottom:{marginTop:"auto",padding:"20px 8px 0",borderTop:"1px solid #edf0f5",fontSize:11,color:"#667085",display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"},
  secureDot:{display:"inline-block",width:8,height:8,background:"#16a37a",borderRadius:"50%",flexShrink:0},
  logout:{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,border:0,background:"transparent",color:"#8a4050",cursor:"pointer",fontSize:11},
  main:{flex:1,minWidth:0,padding:"26px clamp(16px,3vw,42px) 18px"},
  topbar:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:18,marginBottom:25},
  eyebrow:{fontSize:10,fontWeight:850,letterSpacing:1.6,color:"#6e72a9",margin:"0 0 8px"},
  pageTitle:{fontSize:27,letterSpacing:"-1px",margin:0,fontWeight:850},
  topActions:{display:"flex",alignItems:"center",gap:12},
  status:{display:"flex",alignItems:"center",gap:7,fontSize:11,color:"#596579",background:"#fff",padding:"9px 12px",borderRadius:999,border:"1px solid #e5eaf2"},
  iconButton:{width:38,height:38,border:"1px solid #e2e7f0",background:"#fff",borderRadius:11,display:"grid",placeItems:"center",cursor:"pointer",color:"#5c6680"},
  hero:{display:"flex",justifyContent:"space-between",gap:20,background:"linear-gradient(120deg,#27295f,#5045a5 62%,#8b75dc)",color:"#fff",borderRadius:22,padding:"clamp(22px,4vw,38px)",overflow:"hidden",position:"relative",minHeight:240,alignItems:"center"},
  heroEyebrow:{fontSize:10,letterSpacing:1.6,fontWeight:800,opacity:.8},
  heroTitle:{fontSize:"clamp(25px,3vw,38px)",letterSpacing:"-1.5px",lineHeight:1.1,margin:"14px 0"},
  heroText:{fontSize:13,lineHeight:1.7,maxWidth:420,opacity:.82},
  heroButton:{background:"#fff",color:"#393579",border:0,borderRadius:10,padding:"12px 15px",fontWeight:800,cursor:"pointer",marginTop:8},
  heroArt:{width:200,height:160,display:"grid",placeItems:"center",position:"relative",flexShrink:0},
  artCircle:{width:100,height:100,border:"1px solid #ffffff80",background:"#ffffff18",borderRadius:30,display:"grid",placeItems:"center",transform:"rotate(-8deg)"},
  artPill:{position:"absolute",bottom:0,right:0,border:"1px solid #ffffff60",borderRadius:999,padding:"8px 12px",fontSize:10,fontWeight:800,letterSpacing:1},
  artLine:{position:"absolute",width:150,height:150,border:"1px dashed #ffffff45",borderRadius:"50%",transform:"rotate(20deg)"},
  stats:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:13,margin:"18px 0"},
  stat:{background:"#fff",border:"1px solid #e8ecf4",borderRadius:16,padding:18,display:"flex",flexDirection:"column",gap:9,minWidth:0},
  statIcon:{width:37,height:37,borderRadius:11,background:"#f0efff",color:"#6259c8",display:"grid",placeItems:"center"},
  statLabel:{fontSize:11,color:"#788397",fontWeight:650},
  statValue:{fontSize:23,letterSpacing:"-.6px",overflowWrap:"anywhere"},
  statFoot:{fontSize:10,color:"#9aa3b3"},
  panel:{background:"#fff",border:"1px solid #e5eaf2",borderRadius:17,padding:"clamp(15px,2vw,24px)",marginBottom:16,minWidth:0},
  panelHead:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,marginBottom:16,flexWrap:"wrap"},
  sectionTitle:{fontSize:17,fontWeight:800,letterSpacing:"-.4px",margin:"0 0 6px"},
  muted:{fontSize:12,lineHeight:1.65,color:"#7b879a",margin:"5px 0"},
  textButton:{background:"transparent",border:0,color:"#5853bf",fontSize:12,fontWeight:750,cursor:"pointer"},
  secondary:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,border:"1px solid #e1e6f0",background:"#fff",color:"#4c5870",padding:"10px 13px",borderRadius:10,fontWeight:700,fontSize:12,cursor:"pointer"},
  primary:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,border:0,background:"#4f46b8",color:"#fff",padding:"12px 15px",borderRadius:10,fontWeight:800,fontSize:12,cursor:"pointer",width:"100%"},
  twoCol:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16},
  shortcutGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8,marginTop:15},
  shortcut:{display:"flex",alignItems:"center",gap:9,border:"1px solid #e8ecf4",background:"#fff",borderRadius:10,padding:12,color:"#59647a",fontSize:11,fontWeight:700,cursor:"pointer",textAlign:"left"},
  checkRow:{display:"flex",alignItems:"center",gap:8,color:"#34816b",fontSize:12,marginTop:12},
  searchWrap:{display:"flex",alignItems:"center",gap:9,border:"1px solid #e4e9f2",borderRadius:10,padding:"0 12px",maxWidth:440,marginBottom:16,color:"#929bad"},
  searchInput:{width:"100%",border:0,outline:"none",padding:"12px 0",fontSize:12,background:"transparent",color:"#273249"},
  tableWrap:{width:"100%",overflowX:"auto"},
  table:{width:"100%",borderCollapse:"collapse",fontSize:12,textAlign:"left"},
  cellSub:{display:"block",fontSize:10,color:"#8490a2",marginTop:4,maxWidth:280,overflowWrap:"anywhere"},
  statusSelect:{maxWidth:135,border:"1px solid #e1e6f0",borderRadius:8,padding:"8px 7px",background:"#fff",color:"#44516a",fontSize:11},
  paymentBadge:{display:"inline-block",fontSize:10,color:"#8a5a25",background:"#fff6e9",borderRadius:7,padding:"6px 8px",maxWidth:150},
  empty:{display:"grid",justifyItems:"center",gap:9,padding:"42px 16px",color:"#8a95a7",fontSize:12},
  featureHero:{display:"flex",gap:15,alignItems:"flex-start",marginBottom:24},
  featureIcon:{width:50,height:50,display:"grid",placeItems:"center",borderRadius:15,background:"#f0efff",color:"#6156c3",flexShrink:0},
  featureGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,margin:"20px 0"},
  featureItem:{display:"flex",gap:10,alignItems:"flex-start",background:"#f8f9fd",border:"1px solid #e9edf5",borderRadius:11,padding:14,fontSize:12,color:"#536078"},
  noticeCard:{display:"flex",gap:12,background:"#f8f9ff",border:"1px solid #e4e8fb",borderRadius:12,padding:16,color:"#5759a4",fontSize:12,marginTop:16},
  chartBars:{display:"grid",gap:15,marginTop:25,maxWidth:650},
  barRow:{display:"grid",gridTemplateColumns:"100px 1fr 30px",alignItems:"center",gap:12,fontSize:12,color:"#657188"},
  barTrack:{height:10,background:"#edf0f7",borderRadius:999,overflow:"hidden"},
  barFill:{height:"100%",background:"linear-gradient(90deg,#5e59c8,#9c8be8)",borderRadius:999},
  qrLayout:{display:"grid",gridTemplateColumns:"minmax(240px,280px) 1fr",gap:26,alignItems:"center"},
  qrBox:{border:"1px solid #e8ecf4",borderRadius:18,padding:18,display:"grid",justifyItems:"center",gap:10,overflowWrap:"anywhere",fontSize:10,color:"#8a94a5"},
  footer:{textAlign:"center",fontSize:10,color:"#99a2b1",padding:"20px 0"},
  loginShell:{minHeight:"100vh",display:"grid",placeItems:"center",padding:20,background:"radial-gradient(circle at 10% 10%,#e8e7ff,transparent 35%),#f5f7fb",fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",color:"#182235"},
  loginCard:{width:"min(100%,430px)",background:"#fff",border:"1px solid #e5eaf2",borderRadius:24,padding:"clamp(24px,5vw,38px)",boxShadow:"0 20px 80px #30345a12"},
  lockIcon:{width:52,height:52,display:"grid",placeItems:"center",borderRadius:16,background:"#efefff",color:"#5850bb",marginTop:36},
  loginTitle:{fontSize:32,letterSpacing:"-1.3px",margin:"8px 0 12px"},
  label:{display:"grid",gap:8,fontSize:12,fontWeight:750,color:"#46516a"},
  input:{width:"100%",boxSizing:"border-box",padding:13,border:"1px solid #dfe5ef",borderRadius:10,outlineColor:"#7069d3",fontSize:13},
  securityNote:{display:"flex",gap:10,alignItems:"flex-start",fontSize:10,lineHeight:1.6,color:"#778398",background:"#f7f8fc",padding:12,borderRadius:10,marginTop:18},
  backLink:{display:"block",textAlign:"center",fontSize:12,color:"#5a55b9",textDecoration:"none",marginTop:22},
  error:{fontSize:12,color:"#b4233d",background:"#fff0f1",padding:11,borderRadius:9},
  errorBanner:{background:"#fff0f1",border:"1px solid #ffd5da",color:"#a52c42",padding:12,borderRadius:10,fontSize:12,marginBottom:14},
  successBanner:{display:"flex",gap:8,alignItems:"center",background:"#edfbf5",border:"1px solid #c8f0df",color:"#26775c",padding:12,borderRadius:10,fontSize:12,marginBottom:14},
  qrBoxDummy:{},
};
