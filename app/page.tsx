"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, Code2, Compass, Layers3, Menu, MessageCircle, MonitorSmartphone, Palette, ShieldCheck, Sparkles, X, Zap } from "lucide-react";

const services = [
  { icon: Code2, title: "Websites & web apps", text: "Fast, responsive digital experiences designed around what your customers need to do.", tone: "lavender", items: ["Business websites", "Dashboards & portals", "Web app development"] },
  { icon: Palette, title: "Product & UI design", text: "Clear journeys, thoughtful interfaces and visual systems that feel effortless to use.", tone: "mint", items: ["UX & interface design", "Design systems", "Responsive prototypes"] },
  { icon: Layers3, title: "Digital foundations", text: "The reliable building blocks behind a product—from integrations to launch readiness.", tone: "peach", items: ["API integrations", "Authentication planning", "Deployment & performance"] },
];

const projects = [
  { title: "KS Digital workspace", type: "Product interface", description: "A clean starting point for a digital-services dashboard, designed for clarity across desktop and mobile.", image: "photo-1460925895917-afdab827c52f", tag: "In development", kind: "Product UI" },
  { title: "Commerce experience", type: "Web experience concept", description: "A product-led storefront direction with a simple browsing flow, product discovery and responsive layouts.", image: "photo-1556742049-0cfed4f6a45d", tag: "Concept", kind: "Commerce" },
  { title: "Insights dashboard", type: "Dashboard concept", description: "A data dashboard concept that puts key information first and keeps complex screens easy to scan.", image: "photo-1551288049-bebda4e38f71", tag: "Concept", kind: "Dashboard" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState("All");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", goal: "Website or web app", message: "" });
  const [installPrompt, setInstallPrompt] = useState(false);
  const filteredProjects = activeService === "All" ? projects : projects.filter(p => p.kind === activeService);

  function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent("KS Digital project enquiry — " + form.goal);
    const body = encodeURIComponent("Name: " + form.name + "\nEmail: " + form.email + "\nProject type: " + form.goal + "\n\n" + form.message);
    setSent(true);
    window.location.href = "mailto:hello@ksdigital.example?subject=" + subject + "&body=" + body;
  }

  return <main>
    <header className="nav">
      <div className="wrap navin">
        <a className="brand" href="#home" aria-label="KS Digital home"><span className="mark">KS</span><span>KS Digital<span className="brand-period">.</span></span></a>
        <nav className={menuOpen ? "links open" : "links"} aria-label="Main navigation">
          <a onClick={() => setMenuOpen(false)} href="#services">Services</a><a onClick={() => setMenuOpen(false)} href="#work">Our work</a><a onClick={() => setMenuOpen(false)} href="#approach">Approach</a><a onClick={() => setMenuOpen(false)} href="#contact">Contact</a>
          <a className="btn small nav-cta" onClick={() => setMenuOpen(false)} href="#contact">Let’s talk <ArrowUpRight size={16}/></a>
        </nav>
        <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <section className="hero" id="home">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><span className="dot"/> DIGITAL EXPERIENCES, THOUGHTFULLY BUILT</span>
          <h1>Good ideas deserve <span className="gradient">great digital</span> experiences.</h1>
          <p className="lead">KS Digital helps turn ideas into clear, useful and beautifully crafted websites and digital products—made to work brilliantly on every screen.</p>
          <div className="actions"><a className="btn" href="#contact">Start a project <ArrowRight size={17}/></a><a className="btn ghost" href="#work">Explore our work <ArrowDownRight size={17}/></a></div>
          <div className="trust"><span className="trust-icon"><ShieldCheck size={17}/></span><span>Thoughtful design. Reliable foundations. No shortcuts.</span></div>
        </div>
        <div className="hero-visual" aria-label="Illustration of a digital product dashboard">
          <div className="orb"/>
          <div className="mock">
            <div className="mock-top"><span className="mock-brand"><span className="mini-mark">KS</span> Your workspace</span><span className="live"><span/> Preview</span></div>
            <div className="dash">
              <div className="tile"><label>Projects</label><strong>Organised.</strong><small>↗ One clear overview</small></div>
              <div className="tile"><label>Experience</label><strong>Responsive.</strong><small>✓ Ready for every screen</small></div>
              <div className="chart"><div className="chart-head"><span>Built around your goals</span><span className="chart-dots">•••</span></div><div className="bars"><i style={{height:"32%"}}/><i style={{height:"52%"}}/><i style={{height:"43%"}}/><i style={{height:"75%"}}/><i style={{height:"61%"}}/><i style={{height:"91%"}}/><i style={{height:"70%"}}/><i style={{height:"100%"}}/></div><div className="chart-foot"><span>Plan</span><span>Design</span><span>Build</span><span>Launch</span></div></div>
            </div>
            <div className="mock-bottom"><span><Sparkles size={14}/> Designed with purpose</span><span>KS Digital ↗</span></div>
          </div>
          <div className="floating float1"><b><Zap size={17}/></b><span>Built for real people<br/><small>Simple by design</small></span></div>
          <div className="floating float2"><b><MonitorSmartphone size={17}/></b><span>One experience<br/><small>Every screen</small></span></div>
        </div>
      </div>
    </section>

    <section className="strip"><div className="wrap strip-inner"><span>IDEA TO LAUNCH</span><i/><span>DESIGN THAT MAKES SENSE</span><i/><span>RESPONSIVE BY DEFAULT</span><i/><span>BUILT TO GROW</span></div></section>

    <section className="section white" id="services"><div className="wrap">
      <div className="section-head"><span className="kicker">WHAT WE DO</span><h2>Everything you need to move<br className="desktop-only"/> from idea to online.</h2><p className="sub">The right mix of design, development and practical thinking to make your next digital step feel simple.</p></div>
      <div className="services">{services.map(({icon: Icon,title,text,tone,items}) => <article className="service" key={title}><div className={"ico "+tone}><Icon size={23}/></div><h3>{title}</h3><p>{text}</p><ul>{items.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul><a href="#contact" className="arrow">Discuss your project <ArrowUpRight size={15}/></a></article>)}</div>
    </div></section>

    <section className="section work-section" id="work"><div className="wrap">
      <div className="work-head"><div className="section-head"><span className="kicker">SELECTED WORK</span><h2>Thoughtful work, made visible.</h2><p className="sub">A first look at the product directions and interface work taking shape at KS Digital.</p></div><a className="text-link" href="#contact">Have a project in mind? <ArrowUpRight size={16}/></a></div>
      <div className="filters" role="group" aria-label="Filter projects">{["All","Product UI","Commerce","Dashboard"].map(f=><button key={f} onClick={()=>setActiveService(f)} className={activeService===f?"filter active":"filter"}>{f}</button>)}</div>
      <div className="projects">{filteredProjects.map(p=><article className="project" key={p.title}><div className="project-image"><img src={"https://images.unsplash.com/"+p.image+"?auto=format&fit=crop&w=900&q=85"} alt={p.title+" visual reference"} loading="lazy"/><span className="project-tag">{p.tag}</span></div><div className="project-body"><span className="project-type">{p.type}</span><h3>{p.title}</h3><p>{p.description}</p><div className="project-foot"><span>{p.kind}</span><a href="#contact" aria-label={"Discuss a project like "+p.title}>Discuss a similar project <ArrowUpRight size={15}/></a></div></div></article>)}</div>
      <p className="note"><ShieldCheck size={14}/> Transparency note: concepts and in-progress work are labelled clearly. These are not presented as completed client case studies or client endorsements.</p>
    </div></section>

    <section className="section white" id="approach"><div className="wrap split">
      <div className="feature-art"><div className="phone"><div className="phone-head"><span className="mini-mark">KS</span><span>YOUR DIGITAL SPACE　☰</span></div><h4>Make room<br/>for better ideas.</h4><p>Useful tools. Clear information. Less friction.</p><div className="phone-card"><span>Project overview</span><strong>Moving forward ✦</strong><p>A clear view of what matters next.</p></div><div className="mini-row"><i/><i/><i/></div><div className="phone-nav"><span>⌂</span><span>◫</span><span>◎</span><span>☻</span></div></div></div>
      <div className="approach-copy"><span className="kicker">THE KS APPROACH</span><h2>Professional doesn’t have to mean complicated.</h2><p className="sub">The best digital experiences feel natural. We focus on clear structure, accessible design and reliable technology—so people can get where they need to go.</p><div className="checks"><div className="check"><span><Check size={17}/></span><div><strong>Clarity first</strong><p>Simple navigation and content that answers real questions.</p></div></div><div className="check"><span><Check size={17}/></span><div><strong>Mobile from day one</strong><p>Layouts and interactions designed for small screens as well as large ones.</p></div></div><div className="check"><span><Check size={17}/></span><div><strong>Built with care</strong><p>Performance, accessibility and maintainable code are part of the plan.</p></div></div></div><a className="btn" href="#contact">Let’s build something useful <ArrowRight size={17}/></a></div>
    </div></section>

    <section className="section process-section"><div className="wrap"><div className="section-head center"><span className="kicker">A CLEAR PROCESS</span><h2>From first conversation to launch.</h2><p className="sub">A practical, collaborative path with clear next steps at every stage.</p></div><div className="process">{[{n:"01",t:"Discover",d:"Understand your goals, users and what success should look like."},{n:"02",t:"Shape",d:"Agree on the structure, priorities and visual direction."},{n:"03",t:"Build",d:"Turn the plan into a responsive, testable digital experience."},{n:"04",t:"Launch",d:"Check the details, prepare the handover and plan what comes next."}].map(s=><article className="step" key={s.n}><span>{s.n}</span><h3>{s.t}</h3><p>{s.d}</p></article>)}</div></div></section>

    <section className="section contact-section" id="contact"><div className="wrap contact-grid"><div><span className="kicker">LET’S TALK</span><h2>Have an idea?<br/><span className="gradient">Let’s make it real.</span></h2><p className="sub">Tell us a little about what you’re building. We’ll use that to start a useful conversation.</p><div className="contact-promise"><span><MessageCircle size={18}/></span><p><strong>No pressure. Just a good first conversation.</strong><br/>Share the goal, even if the details aren’t figured out yet.</p></div></div>
      <form className="contact-form" onSubmit={submitContact}><div className="form-heading"><div><h3>Tell us about your project</h3><p>Fields marked * are required.</p></div><span className="form-spark"><Compass size={21}/></span></div><label>Your name *<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="How should we call you?"/></label><label>Email address *<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>What do you need?<span className="select-wrap"><select value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})}><option>Website or web app</option><option>Mobile-first product / PWA</option><option>UI / UX design</option><option>Dashboard or portal</option><option>Something else</option></select><ChevronDown size={16}/></span></label><label>Tell us a little more *<textarea required rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="What are you hoping to create?"/></label><button className="btn submit-btn" type="submit">Send project enquiry <ArrowRight size={17}/></button>{sent&&<p className="form-success"><Check size={16}/> Your email app should open with the enquiry prepared. Please replace the placeholder email before launch.</p>}<p className="form-note">This starter opens your email app. A secure backend contact service can be connected before production.</p></form>
    </div></section>

    <footer className="footer"><div className="wrap"><div className="footer-top"><a className="brand" href="#home"><span className="mark">KS</span><span>KS Digital<span className="brand-period">.</span></span></a><p>Thoughtful digital experiences for what comes next.</p><a href="#home" className="back-top">Back to top ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} KS Digital. Built with care.</span><span>Light by design <span className="footer-heart">✦</span></span><span className="footer-links"><a href="#services">Services</a><a href="#work">Work</a><a href="#contact">Contact</a></span></div></div></footer>
    <button className="install-hint" onClick={()=>setInstallPrompt(!installPrompt)} aria-label="App installation information"><MonitorSmartphone size={17}/><span>{installPrompt?"Add to Home Screen":"App-ready design"}</span>{installPrompt&&<span className="install-pop">Use your browser menu and choose “Install app” or “Add to Home Screen” when available.</span>}</button>
  </main>;
}
