"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness, Check, ChevronDown, CircleHelp, Command, CreditCard, FileText, FolderKanban, Home, LayoutDashboard, Menu, MessageSquare, Plus, Search, Settings, ShieldCheck, Sparkles, TrendingUp, Users, X, Zap } from "lucide-react";

const initialProjects = [
  { id: 1, name: "E-commerce experience", type: "Website", status: "In progress", progress: 72, date: "Oct 18, 2026", image: "photo-1556742049-0cfed4f6a45d", color: "peach" },
  { id: 2, name: "Mobile banking UI", type: "Product design", status: "Review", progress: 88, date: "Oct 14, 2026", image: "photo-1460925895917-afdab827c52f", color: "lavender" },
  { id: 3, name: "Analytics workspace", type: "Dashboard", status: "In progress", progress: 46, date: "Oct 24, 2026", image: "photo-1551288049-bebda4e38f71", color: "mint" },
  { id: 4, name: "Brand refresh", type: "Branding", status: "Completed", progress: 100, date: "Oct 08, 2026", image: "photo-1558655146-d09347e92766", color: "blue" },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "Messages", icon: MessageSquare },
  { label: "Invoices", icon: CreditCard },
  { label: "Settings", icon: Settings },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Website");
  const [tasks, setTasks] = useState([true, false, false]);
  const [range, setRange] = useState("This week");

  const visibleProjects = useMemo(() => projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.type.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const completed = projects.filter(p => p.status === "Completed").length;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function createProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newName.trim()) return;
    const next = { id: Date.now(), name: newName.trim(), type: newType, status: "In progress", progress: 0, date: "Just created", image: "photo-1460925895917-afdab827c52f", color: "lavender" };
    setProjects(prev => [next, ...prev]);
    setNewName("");
    setShowCreate(false);
    setActiveNav("Projects");
    notify("Project created in this preview.");
  }

  return <main className="app-shell">
    <aside className={mobileNav ? "sidebar mobile-open" : "sidebar"}>
      <a className="brand" href="#" onClick={() => setActiveNav("Overview")}><span className="brand-mark">KS<span>.</span></span><span className="brand-copy">KS Digital<small>CREATIVE WORKSPACE</small></span></a>
      <div className="workspace-switch"><span className="workspace-avatar">K</span><span><b>KS Studio</b><small>Free workspace</small></span><ChevronDown size={15}/></div>
      <div className="side-label">WORKSPACE</div>
      <nav className="side-nav">{navItems.map(item => { const Icon = item.icon; return <button key={item.label} className={activeNav === item.label ? "side-link active" : "side-link"} onClick={() => { setActiveNav(item.label); setMobileNav(false); }}><Icon size={18}/><span>{item.label}</span>{item.label === "Messages" && <i className="nav-count">3</i>}</button>; })}</nav>
      <div className="side-label tools-label">QUICK ACCESS</div>
      <button className="side-link" onClick={() => { setActiveNav("Projects"); setMobileNav(false); }}><Zap size={18}/><span>My shortcuts</span></button>
      <button className="side-link" onClick={() => notify("Help centre is a preview feature.")}><CircleHelp size={18}/><span>Help & support</span></button>
      <div className="sidebar-spacer"/>
      <div className="upgrade-card"><span className="upgrade-icon"><Sparkles size={17}/></span><b>Make room for more.</b><p>Your next big idea starts with a clear plan.</p><button onClick={() => notify("Plan upgrades can be connected later.")}>Explore workspace <ArrowUpRight size={14}/></button><div className="upgrade-orb"/></div>
      <button className="profile-row" onClick={() => notify("Profile settings are coming soon.")}><span className="profile-avatar">MS</span><span><b>Workspace owner</b><small>KS Digital admin</small></span><Settings size={16}/></button>
    </aside>

    <section className="main-panel">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation">{mobileNav ? <X size={20}/> : <Menu size={20}/>}</button>
        <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><b>{activeNav}</b></div>
        <div className="top-actions"><label className="search-box"><Search size={17}/><input aria-label="Search projects" placeholder="Search anything..." value={query} onChange={e => { setQuery(e.target.value); if(e.target.value) setActiveNav("Projects"); }}/><kbd>⌘ K</kbd></label><button className={showNotifications ? "icon-btn selected" : "icon-btn"} aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={18}/><i/></button><span className="top-avatar">KS</span></div>
        {showNotifications && <div className="notification-pop"><div className="pop-head"><b>Notifications</b><span>Today</span></div><div className="notification-item"><span className="notice-dot purple"/><div><b>Welcome to KS Digital</b><p>Your workspace is ready to explore.</p><small>Just now</small></div></div><div className="notification-item"><span className="notice-dot green"/><div><b>Project overview</b><p>Keep your next steps in one place.</p><small>Today</small></div></div><button onClick={() => setShowNotifications(false)}>Close notifications</button></div>}
      </header>

      <div className="content">
        {activeNav === "Overview" ? <>
          <div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR SPACE TO CREATE</div><h1>Good afternoon <span className="wave">✳</span></h1><p className="welcome-sub">Here’s what’s happening with your workspace today.</p></div><button className="primary-btn" onClick={() => setShowCreate(true)}><Plus size={18}/> New project</button></div>

          <section className="hero-banner"><div className="hero-content"><span className="banner-pill"><Sparkles size={13}/> YOUR IDEAS, IN MOTION</span><h2>Make your next<br/>big thing <em>happen.</em></h2><p>One calm, clear place to plan projects, follow progress and turn great ideas into real work.</p><button className="banner-btn" onClick={() => setShowCreate(true)}>Create a project <ArrowRight size={16}/></button><div className="banner-foot"><ShieldCheck size={15}/> Built for focus. Designed for momentum.</div></div><div className="banner-art"><div className="art-glow"/><div className="art-window"><div className="window-top"><span/><span/><span/><i>ks / workspace</i></div><div className="window-body"><div className="art-sidebar"><b/><i/><i/><i/><i/></div><div className="art-main"><div className="art-title"/><div className="art-subtitle"/><div className="art-cards"><span/><span/><span/></div><div className="art-chart"><i/><i/><i/><i/><i/><i/><i/><i/></div></div></div></div><div className="art-float float-top"><span className="float-check"><Check size={15}/></span><span><b>Looking good!</b><small>Progress is on track</small></span></div><div className="art-float float-bottom"><span className="float-spark"><Zap size={16}/></span><span><b>Great ideas</b><small>Made into real things</small></span></div><div className="art-star star-one">✳</div><div className="art-star star-two">✦</div></div></section>

          <div className="section-title-row"><div><h2 className="section-title">Your workspace at a glance</h2><p className="section-caption">A little progress goes a long way.</p></div><button className="plain-select" onClick={() => setRange(range === "This week" ? "This month" : "This week")}>{range}<ChevronDown size={15}/></button></div>
          <div className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span className="stat-icon purple-bg"><FolderKanban size={19}/></span><span className="stat-chip purple-chip"><TrendingUp size={12}/> Active</span></div><div className="stat-number">{projects.length.toString().padStart(2,"0")}</div><div className="stat-label">Total projects</div><div className="stat-bottom"><span className="tiny-bars"><i/><i/><i/><i/><i/><i/><i/></span><span>Across your workspace</span></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon green-bg"><Activity size={19}/></span><span className="stat-chip green-chip"><TrendingUp size={12}/> Moving</span></div><div className="stat-number">{projects.filter(p => p.status === "In progress").length.toString().padStart(2,"0")}</div><div className="stat-label">In progress</div><div className="stat-bottom"><span className="mini-progress"><i style={{width:"68%"}}/></span><span>Keep the momentum</span></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon orange-bg"><Check size={19}/></span><span className="stat-chip orange-chip">Done well</span></div><div className="stat-number">{completed.toString().padStart(2,"0")}</div><div className="stat-label">Completed projects</div><div className="stat-bottom"><span className="stat-note-dot"/>Small wins add up</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon blue-bg"><Users size={19}/></span><span className="stat-chip blue-chip">Workspace</span></div><div className="stat-number">01</div><div className="stat-label">Team members</div><div className="stat-bottom"><span className="team-stack"><i>K</i><i>S</i></span><span>Your creative home</span></div></article>
          </div>

          <div className="dashboard-grid">
            <section className="panel projects-panel"><div className="panel-heading"><div><h2>Recent projects</h2><p>Your latest work, all in one place.</p></div><button className="view-all" onClick={() => setActiveNav("Projects")}>View all <ArrowRight size={15}/></button></div><div className="project-list">{projects.slice(0,3).map(p => <article className="project-row" key={p.id}><img src={"https://images.unsplash.com/"+p.image+"?auto=format&fit=crop&w=240&q=80"} alt={p.name+" visual"} loading="lazy"/><div className="project-info"><b>{p.name}</b><span>{p.type} <i>·</i> Updated recently</span><div className="row-progress"><span><i style={{width:p.progress+"%"}}/></span><small>{p.progress}%</small></div></div><span className={"status "+(p.status==="Completed"?"status-done":p.status==="Review"?"status-review":"status-progress")}>{p.status}</span><button className="row-more" aria-label={"Open "+p.name} onClick={() => notify(p.name+" selected in preview.")}>•••</button></article>)}</div><button className="all-projects-btn" onClick={() => setActiveNav("Projects")}>Explore all projects <ArrowRight size={15}/></button></section>
            <section className="panel activity-panel"><div className="panel-heading"><div><h2>Your next steps</h2><p>Keep the little things moving.</p></div><span className="task-count">{tasks.filter(Boolean).length}/3</span></div><div className="task-progress"><span><i style={{width:(tasks.filter(Boolean).length/3*100)+"%"}}/></span><small>{Math.round(tasks.filter(Boolean).length/3*100)}% complete</small></div><div className="task-list">{["Explore your workspace","Create your first project plan","Review project milestones"].map((t,i)=><label className={tasks[i]?"task-item task-checked":"task-item"} key={t}><input type="checkbox" checked={tasks[i]} onChange={() => setTasks(prev => prev.map((v,j)=>i===j?!v:v))}/><span className="custom-check"><Check size={13}/></span><span>{t}</span></label>)}</div><div className="tip-card"><span><Sparkles size={17}/></span><div><b>A small tip for today</b><p>Break a big idea into one small next step. Progress gets easier from there.</p></div></div></section>
          </div>
          <section className="bottom-banner"><div className="bottom-icon"><Command size={20}/></div><div><b>A workspace that works the way you do.</b><p>Keep your projects organised and your next step clear.</p></div><button onClick={() => setActiveNav("Projects")}>See your projects <ArrowUpRight size={15}/></button></section>
        </> : <section className="inner-page"><div className="inner-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> KS DIGITAL WORKSPACE</div><h1>{activeNav}</h1><p className="welcome-sub">{activeNav === "Projects" ? "Browse your projects and keep an eye on what’s moving." : activeNav === "Messages" ? "A home for conversations about your work." : activeNav === "Invoices" ? "Keep billing information organised in one place." : "Make this workspace feel like yours."}</p></div>{activeNav === "Projects" && <button className="primary-btn" onClick={() => setShowCreate(true)}><Plus size={18}/> New project</button>}</div>
          {activeNav === "Projects" ? <><label className="large-search"><Search size={18}/><input placeholder="Search your projects..." value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="project-cards">{visibleProjects.map(p=><article className="large-project-card" key={p.id}><div className="large-project-image"><img src={"https://images.unsplash.com/"+p.image+"?auto=format&fit=crop&w=700&q=85"} alt={p.name} loading="lazy"/><span className={"status "+(p.status==="Completed"?"status-done":p.status==="Review"?"status-review":"status-progress")}>{p.status}</span></div><div className="large-project-body"><span className="project-type">{p.type}</span><h3>{p.name}</h3><p>Next milestone · {p.date}</p><div className="row-progress"><span><i style={{width:p.progress+"%"}}/></span><small>{p.progress}%</small></div></div></article>)}</div>{visibleProjects.length===0&&<div className="empty-state"><FolderKanban size={28}/><b>No matching projects</b><p>Try another search or create a new project.</p><button className="primary-btn" onClick={()=>setShowCreate(true)}><Plus size={17}/> New project</button></div>}</> :
          <div className="coming-panel"><div className="coming-icon"><Sparkles size={25}/></div><h2>{activeNav === "Messages" ? "Good conversations start here." : activeNav === "Invoices" ? "Your finances, kept clear." : "Make it your own."}</h2><p>{activeNav === "Messages" ? "Messaging is a preview area. Connect your preferred messaging service to enable real conversations." : activeNav === "Invoices" ? "Invoice data and payments are not connected yet. This space is ready for a secure billing integration." : "Profile preferences and account security can be connected here as the product grows."}</p><span className="coming-tag">Workspace preview · Integration needed</span><button className="secondary-btn" onClick={() => setActiveNav("Overview")}>Back to overview <ArrowRight size={15}/></button></div>}
        </section>}
        <footer className="app-footer"><span>© {new Date().getFullYear()} KS Digital</span><span><span className="footer-status"/> All systems designed with care</span><button onClick={() => notify("Support contact can be configured before launch.")}>Need help?</button></footer>
      </div>
    </section>

    {showCreate && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCreate(false)}}><form className="create-modal" onSubmit={createProject}><button type="button" className="modal-close" onClick={()=>setShowCreate(false)} aria-label="Close"><X size={19}/></button><span className="modal-icon"><Plus size={22}/></span><div className="eyebrow"><span className="eyebrow-dot"/> START SOMETHING NEW</div><h2>Create a project</h2><p>Give your next idea a name and a place to grow.</p><label>Project name<input required autoFocus value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. My new website"/></label><label>Project type<select value={newType} onChange={e=>setNewType(e.target.value)}><option>Website</option><option>Product design</option><option>Dashboard</option><option>Branding</option><option>Mobile app</option></select></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setShowCreate(false)}>Cancel</button><button type="submit" className="primary-btn"><Plus size={16}/> Create project</button></div><small>Demo data is saved only in this open session. A database is needed for permanent storage.</small></form></div>}
    {toast && <div className="toast"><Check size={17}/>{toast}</div>}
  </main>;
}
