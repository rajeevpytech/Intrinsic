import "./App.css";
import { useState, useEffect, useLayoutEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useNavigationType, Navigate } from "react-router-dom";
import AutoReveal from "./components/AutoReveal";
import HomePage from "./pages/HomePage";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import ServiceAreaPage from "./pages/ServiceAreaPage";
// Admin + editor are code-split out of the public bundle (loaded only when needed).
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
import { VisitorTracker } from "./components/VisitorTracker";
import TextReveal from "./components/TextReveal";
import AboutUs from "./pages/AboutUs";
import AiHome from "./pages/AiHome";
import AiReadiness from "./pages/AiReadiness";
import ManagedAi from "./pages/ManagedAi";
import AiGovernance from "./pages/AiGovernance";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import Resources from "./pages/Resources";
import ContactPage from "./pages/ContactPage";
import LegalPage from "./pages/LegalPage";
import Cybersecurity from "./pages/Cybersecurity";
import Verticals from "./pages/Verticals";
import IndustryPage from "./pages/IndustryPage";
import ConstructionPage from "./pages/ConstructionPage";
import ProfessionalServicesPage from "./pages/ProfessionalServicesPage";
import FinancialServicesPage from "./pages/FinancialServicesPage";
import NonProfitPage from "./pages/NonProfitPage";
import HealthcarePage from "./pages/HealthcarePage";
import Networking from "./pages/Networking";
import NetworkPerimeterSecurity from "./pages/NetworkPerimeterSecurity";
import Microsoft365 from "./pages/Microsoft365";
import ManagedSupport from "./pages/ManagedSupport";
import VcioVciso from "./pages/VcioVciso";
import CaseStudy from "./pages/CaseStudy";
import BlogPost from "./pages/BlogPost";
import SecurityGovernance from "./pages/SecurityGovernance";
import CoManagedIT from "./pages/CoManagedIT";
import SecurityMonitoring from "./pages/SecurityMonitoring";
import SecurityAssessments from "./pages/SecurityAssessments";
import RemoteMonitoring from "./pages/RemoteMonitoring";
import ThreatDetection from "./pages/ThreatDetection";
import UserEndpointSecurity from "./pages/UserEndpointSecurity";
import CloudHome from "./pages/CloudHome";
import CloudInfrastructure from "./pages/CloudInfrastructure";
import BackupRecovery from "./pages/BackupRecovery";
import ContactModal from "./components/ContactModal";
import SampleReportModal from "./components/SampleReportModal";
import AssessmentPage from "./pages/AssessmentPage";
import ReviewMode from "./components/review/ReviewMode";
import LiveEditProvider from "./components/editor/LiveEditProvider";
const LiveEditor = lazy(() => import("./components/editor/LiveEditor"));
import { SeoProvider, SeoController } from "./lib/SeoContext";
import ImageReveal from "./components/ImageReveal";
import HeroWipe from "./components/HeroWipe";

const SCROLL_KEY = "intr_scroll_positions";
const readScrolls = () => { try { return JSON.parse(sessionStorage.getItem(SCROLL_KEY)) || {}; } catch { return {}; } };

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    let t;
    const save = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if ((window.history.state?.key || "default") !== key) return;
        const s = readScrolls(); s[key] = window.scrollY; sessionStorage.setItem(SCROLL_KEY, JSON.stringify(s));
      }, 100);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", save); };
  }, [key]);
  useLayoutEffect(() => {
    const saved = navType === "POP" ? readScrolls()[key] : undefined;
    if (saved != null) {
      let tries = 0, timer;
      const restore = () => {
        window.scrollTo({ top: saved, left: 0, behavior: "instant" });
        if (Math.abs(window.scrollY - saved) > 2 && tries++ < 30) timer = setTimeout(restore, 50);
      };
      restore();
      return () => clearTimeout(timer);
    }
    if (hash) {
      const go = () => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
        return !!el;
      };
      if (!go()) {
        const t = setTimeout(go, 350);
        return () => clearTimeout(t);
      }
      return undefined;
    }
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    requestAnimationFrame(() => { window.scrollTo(0, 0); html.style.scrollBehavior = prev; });
  }, [pathname, hash, key, navType]);
  return null;
}

const BASE_WIDTH = 1366;
function ViewportScale() {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const w = root.clientWidth;
      const scaled = !pathname.startsWith("/admin") && w > BASE_WIDTH;
      const z = scaled ? (w / BASE_WIDTH).toFixed(4) : "1";
      root.style.setProperty("--z", z);
      document.body.style.zoom = scaled ? z : "";
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [pathname]);
  return null;
}

function CtaInterceptor({ onContact, onSample }) {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e) => {
      const sample = e.target.closest('[data-sample-report]');
      if (sample) { e.preventDefault(); onSample(); return; }
      const assess = e.target.closest('[data-assessment]');
      if (assess) { e.preventDefault(); navigate("/contact#contact-form-section"); return; }
      const contact = e.target.closest('a[href="#contact"], [data-contact-trigger]');
      if (contact) { e.preventDefault(); navigate("/contact#contact-form-section"); }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate, onContact, onSample]);
  return null;
}

function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <SeoProvider>
        <SeoController />
        <ImageReveal />
        <HeroWipe />
        <AutoReveal />
        <TextReveal />
        <ViewportScale />
        <VisitorTracker />
        <CtaInterceptor onContact={() => setContactOpen(true)} onSample={() => setSampleOpen(true)} />
        <LiveEditProvider>
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:slug" element={<JobDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms-of-service" element={<LegalPage kind="terms" />} />
          <Route path="/security-risk-assessment" element={<AssessmentPage />} />
          <Route path="/services/cybersecurity" element={<Cybersecurity />} />
          <Route path="/services/networking" element={<Networking />} />
          <Route path="/services/network-perimeter-security" element={<NetworkPerimeterSecurity />} />
          <Route path="/services/microsoft-365" element={<Microsoft365 />} />
          <Route path="/services/managed-it" element={<ManagedSupport />} />
          <Route path="/services/vcio-vciso" element={<VcioVciso />} />
          <Route path="/resources/service-briefs" element={<Navigate to="/resources#service-briefs" replace />} />
          <Route path="/case-studies/:slug" element={<CaseStudy />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/services/security-governance-compliance" element={<SecurityGovernance />} />
          <Route path="/services/co-managed-it" element={<CoManagedIT />} />
          <Route path="/services/security-monitoring-siem" element={<SecurityMonitoring />} />
          <Route path="/services/security-assessments" element={<SecurityAssessments />} />
          <Route path="/services/remote-monitoring-management" element={<RemoteMonitoring />} />
          <Route path="/services/threat-detection-response" element={<ThreatDetection />} />
          <Route path="/services/identity-endpoint-security" element={<UserEndpointSecurity />} />
          <Route path="/services/cloud" element={<CloudHome />} />
          <Route path="/services/cloud-infrastructure-migration" element={<CloudInfrastructure />} />
          <Route path="/services/ai" element={<AiHome />} />
          <Route path="/services/ai-readiness-assessment" element={<AiReadiness />} />
          <Route path="/services/managed-ai" element={<ManagedAi />} />
          <Route path="/services/ai-governance-compliance" element={<AiGovernance />} />
          <Route path="/services/backup-disaster-recovery" element={<BackupRecovery />} />
          <Route path="/services/:slug" element={<ComingSoon />} />
          <Route path="/industries" element={<Verticals />} />
          <Route path="/industries/construction" element={<ConstructionPage />} />
          <Route path="/industries/professional-services" element={<ProfessionalServicesPage />} />
          <Route path="/industries/financial-services" element={<FinancialServicesPage />} />
          <Route path="/industries/non-profit" element={<NonProfitPage />} />
          <Route path="/industries/healthcare" element={<HealthcarePage />} />
          <Route path="/industries/:slug" element={<IndustryPage />} />
          <Route path="/service-areas/:slug" element={<ServiceAreaPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Legacy URL redirects (crawler 301s handled by prerendered stubs) */}
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/help-desk-support" element={<Navigate to="/services/managed-it" replace />} />
          <Route path="/healthcare" element={<Navigate to="/industries/healthcare" replace />} />
          <Route path="/terms-conditions" element={<Navigate to="/terms-of-service" replace />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/jobs" element={<Navigate to="/careers" replace />} />
          <Route path="/jobs/:slug" element={<Navigate to="/careers" replace />} />
          <Route path="/job-openings" element={<Navigate to="/careers" replace />} />
          <Route path="/services/managed-support" element={<Navigate to="/services/managed-it" replace />} />
          <Route path="/services/managed-it-services" element={<Navigate to="/services/managed-it" replace />} />
          <Route path="/services/ai-automation" element={<Navigate to="/services/ai" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <Suspense fallback={null}><LiveEditor /></Suspense>
        </LiveEditProvider>
        <ReviewMode />
        </SeoProvider>
      </BrowserRouter>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <SampleReportModal open={sampleOpen} onClose={() => setSampleOpen(false)} />
    </div>
  );
}

export default App;
