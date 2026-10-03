import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";

const UPDATED = "June 1, 2026";

const PRIVACY = {
  title: "Privacy Policy",
  intro: "Intrinsic respects your privacy. This policy explains what information we collect through our website and services, how we use it, and the choices you have.",
  sections: [
    { h: "Information We Collect", p: ["Contact details you provide through forms (name, email address, phone number, company, and message content).", "Information submitted through the Security Risk Assessment and career application forms, including uploaded documents.", "Technical and usage data such as pages visited, referring URL, browser type, device type, and approximate location, collected through first‑party analytics."] },
    { h: "How We Use Information", p: ["To respond to enquiries, schedule consultations, and deliver requested assessments or reports.", "To evaluate job applications.", "To understand how our website is used so we can improve content, performance, and security.", "To meet legal, regulatory, and contractual obligations."] },
    { h: "Sharing of Information", p: ["We do not sell personal information. We share it only with service providers that help us operate the website and deliver services (for example hosting, email delivery, and analytics), and only to the extent required. These providers are bound by confidentiality obligations.", "We may disclose information where required by law or to protect the rights, property, or safety of Intrinsic, our clients, or others."] },
    { h: "Data Retention & Security", p: ["Information is retained only as long as necessary for the purpose it was collected or as required by law. We apply administrative, technical, and physical safeguards appropriate to the sensitivity of the information, including encryption in transit, access controls, and monitoring."] },
    { h: "Cookies & Analytics", p: ["Our website uses essential cookies for functionality and first‑party analytics to measure page views and visitor trends. You can control cookies through your browser settings."] },
    { h: "Your Rights", p: ["Depending on your jurisdiction, you may have the right to access, correct, or delete your personal information, or to object to certain processing. To make a request, contact us using the details below."] },
    { h: "Contact", p: ["Questions about this policy or your information can be sent through our contact page. We aim to respond within five business days."] },
  ],
};

const TERMS = {
  title: "Terms of Service",
  intro: "These terms govern your use of the Intrinsic website. Services delivered to clients are governed by the applicable master services agreement and statement of work.",
  sections: [
    { h: "Use of the Website", p: ["You may use this website for lawful purposes only. You agree not to interfere with its operation, attempt to gain unauthorized access to any system, or use automated tools to extract content beyond what is publicly indexed."] },
    { h: "Content & Intellectual Property", p: ["All content on this website, including text, graphics, illustrations, logos, and reports, is owned by or licensed to Intrinsic and protected by applicable intellectual property laws. You may view and print content for personal or internal business reference. Any other use requires written permission."] },
    { h: "Assessments & Sample Reports", p: ["Security Risk Assessment results, sample reports, and other materials provided through the website are for general informational purposes. They do not constitute a guarantee of security, a formal audit opinion, or professional advice specific to your environment unless delivered under a signed engagement."] },
    { h: "Third‑Party Links", p: ["The website may link to third‑party sites. Intrinsic is not responsible for the content, policies, or practices of those sites."] },
    { h: "Disclaimer & Limitation of Liability", p: ["The website is provided \"as is\" without warranties of any kind. To the fullest extent permitted by law, Intrinsic is not liable for any indirect, incidental, or consequential damages arising from use of the website or reliance on its content."] },
    { h: "Changes", p: ["We may update these terms from time to time. The date of the latest revision is shown at the top of this page. Continued use of the website after changes are posted constitutes acceptance of the revised terms."] },
    { h: "Contact", p: ["Questions about these terms can be sent through our contact page."] },
  ],
};

const LegalPage = ({ kind }) => {
  const d = kind === "terms" ? TERMS : PRIVACY;
  return (
    <div className="bg-white page-in" data-testid={`legal-${kind}-page`}>
      <ScrollProgress />
      <Navbar />
      <main>
        <section className="ab-lightblue pt-[var(--nav-h)]" style={{ minHeight: "auto" }} data-testid="legal-hero">
          <div className="container-x pt-16 lg:pt-20 pb-12 lg:pb-14 max-w-[820px]">
            <p className="cyber-eyebrow text-royal inline-flex items-center gap-4 animate-fade-up"><span className="inline-block w-8 h-[2px] bg-[#f2a91c]" />Legal</p>
            <h1 className="cyber-h1 text-royal mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>{d.title}</h1>
            <p className="text-[#2e3745] text-[16px] leading-[1.7] mt-6 animate-fade-up" style={{ animationDelay: "200ms" }}>{d.intro}</p>
            <p className="text-[#4b5766] text-[13px] mt-5 animate-fade-up" style={{ animationDelay: "280ms" }} data-testid="legal-updated">Last updated: {UPDATED}</p>
          </div>
        </section>
        <section className="bg-white py-12 lg:py-16" data-testid="legal-body">
          <div className="container-x max-w-[820px] space-y-10">
            {d.sections.map((s) => (
              <Reveal key={s.h} as="article">
                <h2 className="font-serif font-semibold text-royal text-[24px] sm:text-[28px] leading-[1.2]">{s.h}</h2>
                <div className="mt-4 space-y-3 text-[#2e3745] text-[16px] leading-[1.72]">{s.p.map((t, i) => <p key={i}>{t}</p>)}</div>
              </Reveal>
            ))}
            <Reveal className="pt-4 border-t border-[#e6edf6]">
              <p className="text-[#2e3745] text-[15px]">See also: {kind === "terms" ? <Link to="/privacy-policy" className="text-royal underline underline-offset-4" data-testid="legal-link-privacy">Privacy Policy</Link> : <Link to="/terms-of-service" className="text-royal underline underline-offset-4" data-testid="legal-link-terms">Terms of Service</Link>} · <Link to="/contact" className="text-royal underline underline-offset-4" data-testid="legal-link-contact">Contact us</Link></p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
