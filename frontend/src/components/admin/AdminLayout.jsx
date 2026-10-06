import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Inbox, FileUser, FileText, FileDown, Quote, BriefcaseBusiness, Briefcase, Layers, Type, MessageSquare, Mail, Globe, SlidersHorizontal, LogOut, KeyRound, Menu, ArrowUpRight, MousePointer2, ShieldCheck, Search, X, Code2, DatabaseBackup } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Sheet, SheetPortal, SheetOverlay, SheetTitle, SheetDescription, SheetClose } from '../ui/sheet';
import { Button } from '../ui/button';
import logoWhite from '../../assets/logo-white.png';
import './admin.css';

const GROUPS = [
  { label: 'Workspace', items: [['overview', 'Overview', LayoutDashboard], ['inquiries', 'Inquiries', Inbox], ['applications', 'Job applications', FileUser]] },
  { label: 'Website content', items: [['blogs', 'Blogs', FileText], ['service-briefs', 'Service briefs', FileDown], ['case-studies', 'Case studies', BriefcaseBusiness], ['testimonials', 'Testimonials', Quote], ['jobs', 'Job listings', Briefcase], ['site', 'Hero & text', Layers]] },
  { label: 'Manage', items: [['typography', 'Typography', Type], ['custom-css', 'Custom CSS', Code2], ['feedback', 'Feedback', MessageSquare], ['email', 'Email settings', Mail], ['seo', 'SEO & GEO', Globe], ['modes', 'Editor & review', SlidersHorizontal], ['migration', 'Export / Import', DatabaseBackup]] },
];
export const ADMIN_TABS = GROUPS.flatMap(group => group.items.map(([key]) => key));

const Navigation = ({ tab, onSelect, mobile = false }) => (
  <nav className="ad-nav" aria-label="Admin navigation" data-testid={mobile ? 'mobile-admin-navigation' : 'admin-navigation'}>
    {GROUPS.map(group => <div className="ad-nav-group" key={group.label}>
      <p className="ad-nav-label">{group.label}</p>
      {group.items.map(([key, label, Icon]) => <button key={key} onClick={() => onSelect(key)} data-testid={`${mobile ? 'mobile-' : ''}tab-${key}`} aria-current={tab === key ? 'page' : undefined} className={`ad-nav-item ${tab === key ? 'is-active' : ''}`}>
        <Icon size={17} strokeWidth={1.7} /><span>{label}</span>{tab === key && <span className="ad-active-dot" />}
      </button>)}
    </div>)}
  </nav>
);

const SidebarContents = ({ tab, onSelect, onPassword, onLogout, mobile = false }) => <>
  <div className="ad-brand"><img src={logoWhite} alt="Intrinsic" /><span>ADMIN WORKSPACE</span></div>
  <Navigation tab={tab} onSelect={onSelect} mobile={mobile} />
  <div className="ad-sidebar-footer">
    <div className="ad-account"><span className="ad-avatar">A</span><div><strong>Administrator</strong><small>Website management</small></div><ShieldCheck size={17} /></div>
    <div className="ad-account-actions">
      <button data-testid={`${mobile ? 'mobile-' : ''}open-change-password`} onClick={onPassword}><KeyRound size={14} />Password</button>
      <button data-testid={`${mobile ? 'mobile-' : ''}logout`} onClick={onLogout}><LogOut size={14} />Log out</button>
    </div>
  </div>
</>;

const Clock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return <time className="ad-clock" data-testid="admin-clock">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time>;
};

const SectionSearch = ({ onSelect }) => {
  const [q, setQ] = useState('');
  const items = GROUPS.flatMap(g => g.items);
  const hits = q.trim() ? items.filter(([, label]) => label.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6) : [];
  return <div className="ad-search" data-testid="admin-search">
    <Search size={16} />
    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search sections, inquiries, or content…" aria-label="Search admin sections" data-testid="admin-search-input"
      onKeyDown={e => { if (e.key === 'Enter' && hits[0]) { onSelect(hits[0][0]); setQ(''); } if (e.key === 'Escape') setQ(''); }} />
    {hits.length > 0 && <ul className="ad-search-results" data-testid="admin-search-results">{hits.map(([key, label, Icon]) => <li key={key}><button data-testid={`admin-search-hit-${key}`} onClick={() => { onSelect(key); setQ(''); }}><Icon size={14} />{label}</button></li>)}</ul>}
  </div>;
};

export const AdminLayout = ({ tab, onSelect, onPassword, onLogout, children }) => {
  const [open, setOpen] = useState(false);
  const label = GROUPS.flatMap(g => g.items).find(([key]) => key === tab)?.[1];
  const select = key => { onSelect(key); setOpen(false); window.scrollTo(0, 0); };
  return <div className="ad-root" data-admin-page data-testid="admin-dashboard">
    <aside className="ad-sidebar ad-desktop-sidebar" data-testid="admin-sidebar"><SidebarContents tab={tab} onSelect={select} onPassword={onPassword} onLogout={onLogout} /></aside>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetPortal><SheetOverlay /><DialogPrimitive.Content className="ad-sidebar ad-mobile-sidebar" data-testid="admin-mobile-menu">
        <SheetTitle className="sr-only">Admin navigation</SheetTitle><SheetDescription className="sr-only">Choose a workspace section.</SheetDescription>
        <SheetClose className="ad-drawer-close" data-testid="admin-menu-close" aria-label="Close navigation"><X size={20} /></SheetClose>
        <SidebarContents mobile tab={tab} onSelect={select} onPassword={() => { setOpen(false); onPassword(); }} onLogout={onLogout} />
      </DialogPrimitive.Content></SheetPortal>
    </Sheet>
    <div className="ad-workspace">
      <header className="ad-topbar" data-testid="admin-header">
        <div className="ad-breadcrumb"><Button variant="ghost" size="icon" className="ad-mobile-trigger" onClick={() => setOpen(true)} aria-label="Open navigation" data-testid="admin-menu-open"><Menu /></Button><SectionSearch onSelect={select} /><strong className="sr-only" data-testid="admin-current-section">{label}</strong></div>
        <div className="ad-header-actions"><span className="ad-live" data-testid="admin-live"><i />LIVE</span><span className="ad-private-label">Website Workspace</span><Clock /><a className="ad-button" href="/" target="_blank" rel="noreferrer" data-testid="view-site">View website<ArrowUpRight size={15} /></a></div>
      </header>
      <main className={`ad-main ${tab !== 'overview' ? 'ad-editor' : ''}`} data-testid="admin-main-content">
        {tab !== 'overview' && <div className="ad-section-intro"><h1 className="ad-section-title">{label}</h1><a href="/services/security-governance-compliance?edit=1" data-testid="admin-click-to-edit" className="ad-text-link"><MousePointer2 size={15} />Open visual editor<ArrowUpRight size={14} /></a></div>}
        {children}
      </main>
      <footer className="ad-footer"><span>Intrinsic <span className="ad-footer-divider">/</span> Website workspace</span><span>Built for a clearer overview.</span></footer>
    </div>
  </div>;
};
