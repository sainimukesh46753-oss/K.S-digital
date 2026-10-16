"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BriefcaseBusiness, CheckCircle2, Download, FolderKanban, Plus, Search, Trash2, Users, Headset, X, Save, ShieldCheck, CircleDollarSign } from "lucide-react";

type Section = "Projects" | "CRM & Leads" | "Services & Portfolio" | "Support";
type Project = { id: string; name: string; customer: string; service: string; dueDate: string; status: string; notes: string; createdAt: string };
type Lead = { id: string; name: string; email: string; phone: string; source: string; status: string; followUp: string; notes: string; createdAt: string };
type Service = { id: string; name: string; price: number; description: string; active: boolean };
type Ticket = { id: string; customer: string; email: string; subject: string; priority: string; status: string; notes: string; createdAt: string };
type LocalData = { projects: Project[]; leads: Lead[]; services: Service[]; tickets: Ticket[] };

const KEY = "ks-digital-admin-workspace-v1";
const starterServices: Service[] = [
  { id: "website", name: "Business Website", price: 69999, description: "Professional responsive business website", active: true },
  { id: "ecommerce", name: "Basic E-commerce Website", price: 59999, description: "Online store setup with product catalogue", active: true },
  { id: "brand", name: "Brand Identity", price: 29999, description: "Logo direction and brand identity system", active: true },
  { id: "seo", name: "SEO Audit", price: 14999, description: "Technical and on-page SEO review", active: true },
  { id: "social", name: "Social Design Pack", price: 12999, description: "Social media creative design package", active: true },
];
const blankData: LocalData = { projects: [], leads: [], services: starterServices, tickets: [] };
const money = (n: number) => "₹" + n.toLocaleString("en-IN");
const makeId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2, 7);
const inputStyle = { width: "100%", boxSizing: "border-box" as const, border: "1px solid #dfe5ef", borderRadius: 9, padding: "11px 12px", background: "#fff", color: "#243047", fontSize: 12 };
const labelStyle = { display: "grid", gap: 6, color: "#5c687e", fontSize: 11, fontWeight: 750 as const };
const buttonStyle = { border: 0, background: "#4f46b8", color: "#fff", borderRadius: 9, padding: "10px 13px", fontSize: 12, fontWeight: 800 as const, cursor: "pointer" };
const secondaryStyle = { border: "1px solid #e1e6f0", background: "#fff", color: "#4c5870", borderRadius: 9, padding: "9px 12px", fontSize: 11, fontWeight: 750 as const, cursor: "pointer" };
const panelStyle = { background: "#fff", border: "1px solid #e5eaf2", borderRadius: 16, padding: "clamp(14px,2vw,22px)", marginBottom: 15 };
const headingStyle = { margin: "0 0 6px", fontSize: 17, fontWeight: 850 as const, letterSpacing: "-.4px" };
const mutedStyle = { margin: "5px 0", fontSize: 12, lineHeight: 1.65, color: "#7b879a" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 11 };
const chipStyle = { display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "5px 8px", background: "#f0efff", color: "#5650b7", fontSize: 10, fontWeight: 800 as const };

export default function OperationsPanel({ section }: { section: Section }) {
  const [data, setData] = useState<LocalData>(blankData);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<LocalData>;
        setData({
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          leads: Array.isArray(parsed.leads) ? parsed.leads : [],
          services: Array.isArray(parsed.services) ? parsed.services : starterServices,
          tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
        });
      }
    } catch { /* Keep the safe starter workspace if stored data is unavailable. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(data)); }
    catch { setNotice("Browser storage is full or unavailable. Export important records as CSV."); }
  }, [data, ready]);

  const setField = (key: string, value: string) => setDraft(old => ({ ...old, [key]: value }));
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    const includes = (row: object) => Object.values(row).some(value => String(value ?? "").toLowerCase().includes(q));
    return { projects: data.projects.filter(includes), leads: data.leads.filter(includes), services: data.services.filter(includes), tickets: data.tickets.filter(includes) };
  }, [data, search]);

  function saveForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = new Date().toISOString();
    if (section === "Projects") {
      const row: Project = { id: makeId(), name: draft.name || "", customer: draft.customer || "", service: draft.service || "Website design", dueDate: draft.dueDate || "", status: "Planning", notes: draft.notes || "", createdAt: now };
      setData(old => ({ ...old, projects: [row, ...old.projects] }));
      setNotice("Project added to this browser's workspace.");
    } else if (section === "CRM & Leads") {
      const row: Lead = { id: makeId(), name: draft.name || "", email: draft.email || "", phone: draft.phone || "", source: draft.source || "Website", status: "New", followUp: draft.followUp || "", notes: draft.notes || "", createdAt: now };
      setData(old => ({ ...old, leads: [row, ...old.leads] }));
      setNotice("Lead saved to this browser's workspace.");
    } else if (section === "Support") {
      const row: Ticket = { id: makeId(), customer: draft.customer || "", email: draft.email || "", subject: draft.subject || "", priority: draft.priority || "Normal", status: "Open", notes: draft.notes || "", createdAt: now };
      setData(old => ({ ...old, tickets: [row, ...old.tickets] }));
      setNotice("Support ticket added to this browser's workspace.");
    } else if (section === "Services & Portfolio") {
      const price = Number(draft.price);
      if (!Number.isFinite(price) || price < 0) { setNotice("Enter a valid service price."); return; }
      const row: Service = { id: makeId(), name: draft.name || "", price, description: draft.description || "", active: true };
      setData(old => ({ ...old, services: [row, ...old.services] }));
      setNotice("Service added to this browser's catalogue.");
    }
    setDraft({});
    setShowForm(false);
  }

  function updateRow(id: string, field: string, value: string) {
    setData(old => ({
      ...old,
      projects: old.projects.map(row => row.id === id ? { ...row, [field]: value } : row),
      leads: old.leads.map(row => row.id === id ? { ...row, [field]: value } : row),
      tickets: old.tickets.map(row => row.id === id ? { ...row, [field]: value } : row),
    }));
    setNotice("Change saved in this browser.");
  }

  function deleteRow(id: string) {
    setData(old => ({ ...old, projects: old.projects.filter(r => r.id !== id), leads: old.leads.filter(r => r.id !== id), services: old.services.filter(r => r.id !== id), tickets: old.tickets.filter(r => r.id !== id) }));
    setNotice("Record removed from this browser's workspace.");
  }

  function exportCsv() {
    const rows: Record<string, unknown>[] = section === "Projects" ? filtered.projects : section === "CRM & Leads" ? filtered.leads : section === "Support" ? filtered.tickets : filtered.services;
    if (!rows.length) { setNotice("There are no records to export yet."); return; }
    const columns = Array.from(new Set(rows.flatMap(row => Object.keys(row))));
    const csv = [columns.join(","), ...rows.map(row => columns.map(key => {
      const value = String(row[key] ?? "").replace(/"/g, '""');
      return '"' + value + '"';
    }).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "ks-digital-" + section.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".csv"; link.click(); URL.revokeObjectURL(url);
    setNotice("CSV export downloaded.");
  }

  const projectRows = filtered.projects;
  const leadRows = filtered.leads;
  const ticketRows = filtered.tickets;
  const serviceRows = filtered.services;

  return <div>
    <section style={{ ...panelStyle, background: "linear-gradient(120deg,#292b64,#554bb0 68%,#8a79dc)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
      <div style={{ maxWidth: 620 }}>
        <div style={{ fontSize: 10, fontWeight: 850, letterSpacing: 1.4, opacity: .8, marginBottom: 9 }}>KS DIGITAL / WORKSPACE TOOLS</div>
        <h2 style={{ margin: "0 0 8px", fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-.8px" }}>{section === "Projects" ? "Keep every project moving." : section === "CRM & Leads" ? "Build stronger client relationships." : section === "Services & Portfolio" ? "Keep your service catalogue organised." : "Give every customer issue a clear next step."}</h2>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, opacity: .85 }}>{section === "Projects" ? "Create work items, set deadlines and track delivery stages." : section === "CRM & Leads" ? "Capture enquiries, record follow-ups and move leads through your pipeline." : section === "Services & Portfolio" ? "Review your current service prices and add catalogue entries." : "Log support requests, set priority and track resolution."}</p>
      </div>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        <button onClick={exportCsv} style={{ ...secondaryStyle, display: "inline-flex", gap: 7, alignItems: "center" }}><Download size={14}/> Export CSV</button>
        <button onClick={() => { setShowForm(v => !v); setNotice(""); }} style={{ ...buttonStyle, display: "inline-flex", gap: 7, alignItems: "center" }}>{showForm ? <X size={15}/> : <Plus size={15}/>} {showForm ? "Close form" : section === "Projects" ? "New project" : section === "CRM & Leads" ? "Add lead" : section === "Support" ? "New ticket" : "Add service"}</button>
      </div>
    </section>

    <section style={panelStyle}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 10 }}>
        <MiniStat icon={FolderKanban} label="Projects" value={String(data.projects.length)} />
        <MiniStat icon={Users} label="Leads" value={String(data.leads.length)} />
        <MiniStat icon={CircleDollarSign} label="Active services" value={String(data.services.filter(s => s.active).length)} />
        <MiniStat icon={Headset} label="Open tickets" value={String(data.tickets.filter(t => t.status !== "Resolved" && t.status !== "Closed").length)} />
      </div>
      <p style={{ ...mutedStyle, marginTop: 12, display: "flex", alignItems: "center", gap: 7 }}><ShieldCheck size={14}/> These tools currently save to this browser only. They are not yet shared with Supabase or other devices.</p>
    </section>

    {notice && <div role="status" style={{ ...panelStyle, padding: 12, color: "#26775c", background: "#edfbf5", borderColor: "#c8f0df", fontSize: 12 }}>{notice}</div>}

    {showForm && <section style={panelStyle}>
      <h3 style={headingStyle}>{section === "Projects" ? "Create project" : section === "CRM & Leads" ? "Capture a lead" : section === "Support" ? "Create support ticket" : "Add service to catalogue"}</h3>
      <form onSubmit={saveForm} style={{ ...gridStyle, marginTop: 15 }}>
        {section === "Projects" && <>
          <Field label="Project name" name="name" value={draft.name || ""} set={setField} required/>
          <Field label="Customer name" name="customer" value={draft.customer || ""} set={setField} required/>
          <Field label="Service / type" name="service" value={draft.service || ""} set={setField} placeholder="Website, branding, SEO…"/>
          <Field label="Target deadline" name="dueDate" value={draft.dueDate || ""} set={setField} type="date"/>
          <Field label="Notes" name="notes" value={draft.notes || ""} set={setField} placeholder="Scope, next step, requirements…"/>
        </>}
        {section === "CRM & Leads" && <>
          <Field label="Contact name" name="name" value={draft.name || ""} set={setField} required/>
          <Field label="Email" name="email" value={draft.email || ""} set={setField} type="email"/>
          <Field label="Phone" name="phone" value={draft.phone || ""} set={setField}/>
          <Field label="Lead source" name="source" value={draft.source || ""} set={setField} placeholder="Website, referral, social media…"/>
          <Field label="Follow-up date" name="followUp" value={draft.followUp || ""} set={setField} type="date"/>
          <Field label="Notes" name="notes" value={draft.notes || ""} set={setField} placeholder="Enquiry details…"/>
        </>}
        {section === "Support" && <>
          <Field label="Customer name" name="customer" value={draft.customer || ""} set={setField} required/>
          <Field label="Email" name="email" value={draft.email || ""} set={setField} type="email"/>
          <Field label="Issue / subject" name="subject" value={draft.subject || ""} set={setField} required/>
          <label style={labelStyle}>Priority<select style={inputStyle} value={draft.priority || "Normal"} onChange={e => setField("priority", e.target.value)}><option>Low</option><option>Normal</option><option>High</option><option>Urgent</option></select></label>
          <Field label="Issue notes" name="notes" value={draft.notes || ""} set={setField} placeholder="What happened and what is needed?"/>
        </>}
        {section === "Services & Portfolio" && <>
          <Field label="Service name" name="name" value={draft.name || ""} set={setField} required/>
          <Field label="Price (₹)" name="price" value={draft.price || ""} set={setField} type="number" required/>
          <Field label="Description" name="description" value={draft.description || ""} set={setField} placeholder="What's included?"/>
        </>}
        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}><button type="submit" style={{ ...buttonStyle, display: "inline-flex", alignItems: "center", gap: 7 }}><Save size={14}/> Save record</button></div>
      </form>
    </section>}

    <section style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 15 }}>
        <div><h3 style={headingStyle}>{section === "Projects" ? "Project tracker" : section === "CRM & Leads" ? "Lead pipeline" : section === "Support" ? "Support queue" : "Service catalogue"}</h3><p style={mutedStyle}>Showing {section === "Projects" ? projectRows.length : section === "CRM & Leads" ? leadRows.length : section === "Support" ? ticketRows.length : serviceRows.length} record(s)</p></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e4e9f2", borderRadius: 9, padding: "0 10px", minWidth: 210 }}><Search size={15} color="#929bad"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records…" style={{ ...inputStyle, border: 0, padding: "10px 0", outline: "none" }}/></div>
      </div>

      {section === "Projects" && <>{projectRows.length ? <div style={{ display: "grid", gap: 10 }}>{projectRows.map(row => <article key={row.id} style={recordStyle}><div style={{ flex: 1, minWidth: 180 }}><b>{row.name}</b><p style={mutedStyle}>{row.customer} · {row.service}</p><p style={mutedStyle}>{row.notes || "No notes added"} {row.dueDate ? " · Due " + row.dueDate : ""}</p></div><select aria-label={"Project status " + row.name} style={{ ...inputStyle, width: "auto", minWidth: 130 }} value={row.status} onChange={e => updateRow(row.id, "status", e.target.value)}>{["Planning", "In Progress", "Waiting for Customer", "Review", "Completed", "On Hold"].map(s => <option key={s}>{s}</option>)}</select><button aria-label="Delete project" onClick={() => deleteRow(row.id)} style={iconButtonStyle}><Trash2 size={15}/></button></article>)}</div> : <Empty icon={FolderKanban} text="No projects added yet. Use New project to create your first tracker entry."/>}</>}

      {section === "CRM & Leads" && <>{leadRows.length ? <div style={{ display: "grid", gap: 10 }}>{leadRows.map(row => <article key={row.id} style={recordStyle}><div style={{ flex: 1, minWidth: 180 }}><b>{row.name}</b><p style={mutedStyle}>{[row.email, row.phone, row.source].filter(Boolean).join(" · ") || "No contact details added"}</p><p style={mutedStyle}>{row.notes || "No notes"} {row.followUp ? " · Follow-up " + row.followUp : ""}</p></div><select aria-label={"Lead status " + row.name} style={{ ...inputStyle, width: "auto", minWidth: 130 }} value={row.status} onChange={e => updateRow(row.id, "status", e.target.value)}>{["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"].map(s => <option key={s}>{s}</option>)}</select><button aria-label="Delete lead" onClick={() => deleteRow(row.id)} style={iconButtonStyle}><Trash2 size={15}/></button></article>)}</div> : <Empty icon={Users} text="No leads added yet. Capture website enquiries or follow-up prospects here."/>}</>}

      {section === "Support" && <>{ticketRows.length ? <div style={{ display: "grid", gap: 10 }}>{ticketRows.map(row => <article key={row.id} style={recordStyle}><div style={{ flex: 1, minWidth: 180 }}><b>{row.subject}</b><p style={mutedStyle}>{row.customer} · {row.email || "No email"} · {row.priority} priority</p><p style={mutedStyle}>{row.notes || "No issue notes"}</p></div><select aria-label={"Ticket status " + row.subject} style={{ ...inputStyle, width: "auto", minWidth: 130 }} value={row.status} onChange={e => updateRow(row.id, "status", e.target.value)}>{["Open", "In Progress", "Waiting for Customer", "Resolved", "Closed"].map(s => <option key={s}>{s}</option>)}</select><button aria-label="Delete ticket" onClick={() => deleteRow(row.id)} style={iconButtonStyle}><Trash2 size={15}/></button></article>)}</div> : <Empty icon={Headset} text="No support tickets yet. Log a customer issue to start tracking its resolution."/>}</>}

      {section === "Services & Portfolio" && <>{serviceRows.length ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 11 }}>{serviceRows.map(row => <article key={row.id} style={{ border: "1px solid #e8ecf4", borderRadius: 13, padding: 15, display: "grid", gap: 9, alignContent: "start" }}><div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 8 }}><span style={chipStyle}>{row.active ? "ACTIVE" : "PAUSED"}</span><button aria-label={"Delete " + row.name} onClick={() => deleteRow(row.id)} style={iconButtonStyle}><Trash2 size={14}/></button></div><b>{row.name}</b><strong style={{ fontSize: 23, letterSpacing: "-.5px" }}>{money(row.price)}</strong><p style={mutedStyle}>{row.description || "No description provided."}</p><button style={secondaryStyle} onClick={() => setData(old => ({ ...old, services: old.services.map(s => s.id === row.id ? { ...s, active: !s.active } : s) }))}>{row.active ? "Pause service" : "Activate service"}</button></article>)}</div> : <Empty icon={BriefcaseBusiness} text="No services match your search. Add a service to build the catalogue."/>}</>}
    </section>
    <p style={{ ...mutedStyle, display: "flex", gap: 7, alignItems: "center" }}><Activity size={14}/> This is a first-stage admin workspace. Records created here are stored locally in this browser; connect authenticated database tables before using it as a shared production CRM or ticket system.</p>
  </div>;
}

function Field({ label, name, value, set, type = "text", placeholder, required = false }: { label: string; name: string; value: string; set: (name: string, value: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return <label style={labelStyle}>{label}<input required={required} type={type} value={value} placeholder={placeholder} min={type === "number" ? "0" : undefined} onChange={e => set(name, e.target.value)} style={inputStyle}/></label>;
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return <div style={{ border: "1px solid #e8ecf4", borderRadius: 12, padding: 13, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: "#f0efff", color: "#6259c8" }}><Icon size={17}/></span><div><div style={{ fontSize: 10, color: "#788397", fontWeight: 700 }}>{label}</div><b style={{ fontSize: 20 }}>{value}</b></div></div>;
}
function Empty({ icon: Icon, text }: { icon: typeof Activity; text: string }) {
  return <div style={{ padding: "36px 15px", display: "grid", justifyItems: "center", gap: 10, textAlign: "center", color: "#8a95a7", fontSize: 12 }}><Icon size={26}/><span>{text}</span></div>;
}
const recordStyle = { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" as const, border: "1px solid #e8ecf4", borderRadius: 12, padding: 13 };
const iconButtonStyle = { display: "grid", placeItems: "center", width: 34, height: 34, border: "1px solid #e1e6f0", background: "#fff", color: "#9a5361", borderRadius: 9, cursor: "pointer" };
