// These defaults match the CURRENT rendered Governance & Compliance reference.
// Authored utility classes on that page were superseded by its global stylesheet.
const serif = "'Playfair Display', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";
const preset = (family, sizes, weight, color, lineHeight, letterSpacing = 0, darkColor = '#ffffff') =>
  ({ family, mobile: sizes[0], tablet: sizes[1], desktop: sizes[2], weight, color, darkColor, lineHeight, letterSpacing, style: 'normal' });
export const TYPOGRAPHY_DEFAULTS = {
  header: preset(serif, [18, 18, 16], 400, '#1a1a2e', 1.5),
  hero: preset(serif, [34, 40, 46], 450, '#00388e', 1.12, -0.01),
  section: preset(serif, [28, 34, 38], 450, '#00388e', 1.18, -0.005),
  subheading: preset(sans, [14, 15, 15], 700, '#00388e', 1.3, 0.03),
  body: preset(sans, [16, 16, 16], 400, '#2e3745', 1.62, 0, '#eef1f7'),
  small: preset(sans, [14, 14, 14], 400, '#4b5766', 1.55, 0, '#e0e6ef'),
  eyebrow: preset(sans, [11, 11, 11], 700, '#895600', 1.5, 0.2, '#f2a91c'),
};
export const TYPE_LABELS = { header: 'Header navigation', hero: 'Main hero heading', section: 'Section titles', subheading: 'Subheadings', body: 'Body text', small: 'Small supporting text', eyebrow: 'Section labels' };
export const resolveTypography = (theme = {}) => Object.fromEntries(Object.entries(TYPOGRAPHY_DEFAULTS).map(([k, defaults]) => [k, { ...defaults, ...theme.typography?.[k] }]));

// One scope class beats authored utility overrides; live edits have higher priority.
const scope = ':is(.page-in, .typography-preview)';
const eyebrow = ':is([class*="eyebrow"], [data-type-role="eyebrow"])';
const body = ':where(:is(p, li):not([class*="eyebrow"]):not([class*="tracking-"]):not([class*="uppercase"]):not(.font-serif):not([class*="-num"]):not([class*="-label"]):not([class*="-desc"]):not([data-type-role]))';
const selectors = {
  header: `${scope} :is(.nav-link, [data-testid^="mobile-nav-"], .mega-item-title, .foot-heading), ${scope} [data-type-role="header"]`,
  hero: `${scope} main h1, ${scope} [data-type-role="hero"]`,
  section: `${scope} main h2, ${scope} [data-type-role="section"]`,
  subheading: `${scope} main :is(h3,h4), ${scope} [data-type-role="subheading"]`,
  body: `${scope} main ${body}, ${scope} [data-type-role="body"]`,
  small: `${scope} main :where(:is(p[class*="text-[13"],p[class*="text-[14px]"],p.text-sm):not([class*="eyebrow"]):not([class*="uppercase"])), ${scope} [data-type-role="small"]`,
  eyebrow: `${scope} ${eyebrow}`,
};
const contexts = ':where(.page-in, .typography-preview, .page-in section, .bg-white, .bg-ice, .bg-white\\/95, .ab-cream, .ab-lightblue, .ai-cream, .ai-sage-light, .va-cream, .gc-hero, .m3-hero, .sm-hero, [data-type-tone="light"])';
const dark = ':where(.page-in .text-white, .page-in .hero-grain, .page-in .bg-royal, .page-in .bg-navy, .page-in .bg-midnight, .page-in .bg-slatesage, .page-in .ab-green, .page-in .ai-moss, .page-in .ai-sage, .page-in .ct-hero, .page-in .m3-blue, .page-in .sm-green, .page-in .rp-band, .page-in .cm-aside, .page-in .foot-surface, [data-type-tone="dark"])';
// Opaque pale cards nested inside a dark section reset the inherited color tokens.
const light = ':where(.page-in .bg-white, .page-in .bg-ice, .page-in .bg-white\\/95, .page-in .ab-lightblue, .page-in .ai-cream, [data-type-tone="light"])';

export function typographyCss(theme = {}) {
  const styles = resolveTypography(theme);
  if (theme.headingFont) ['hero', 'section'].forEach(k => { styles[k].family = theme.headingFont; });
  if (theme.bodyFont) ['body', 'small'].forEach(k => { styles[k].family = theme.bodyFont; });
  const priority = theme.typographyPublished ? '!important' : '';
  const lightVars = Object.keys(styles).map(k => `--type-${k}-ink:var(--type-${k}-color)${priority}`).join(';');
  const darkVars = Object.keys(styles).map(k => `--type-${k}-ink:var(--type-${k}-darkColor)${priority}`).join(';');
  const vars = Object.entries(styles).flatMap(([k, s]) => Object.entries(s).map(([prop, value]) => `--type-${k}-${prop}:${value}`)).join(';');
  const css = [`:root{${vars}}`, `${contexts}{${lightVars}}`, `${dark}{${darkVars}}`, `${light}{${lightVars}}`];
  Object.keys(styles).forEach(k => {
    const size = breakpoint => theme.typographyPublished ? styles[k][breakpoint] : `var(--type-${k}-${breakpoint})`;
    const font = `font-family:var(--type-${k}-family)!important;font-weight:var(--type-${k}-weight)!important;font-style:var(--type-${k}-style)!important;font-size:calc(${size('mobile')}*1px)!important;line-height:var(--type-${k}-lineHeight)!important;letter-spacing:calc(var(--type-${k}-letterSpacing)*1em)!important;color:var(--type-${k}-ink,var(--type-${k}-color))!important`;
    css.push(`${selectors[k]}{${font}}`);
    css.push(`@media(min-width:640px){${selectors[k]}{font-size:calc(${size('tablet')}*1px)!important}}`);
    css.push(`@media(min-width:1024px){${selectors[k]}{font-size:calc(${size('desktop')}*1px)!important}}`);
  });
  css.push(`${scope} main :is(h1,h2,h3,h4) :is(span,em,strong){font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;color:inherit!important}`);
  css.push(`${scope} main ${eyebrow}{text-transform:uppercase}`);
  css.push(`${scope} main :is([role="alert"],[data-testid$="-error"],.text-red-600){color:#b91c1c!important}`);
  css.push(':where([data-admin-page]) :is(h1,h2,h3){font-family:var(--type-section-family);font-weight:var(--type-section-weight);color:var(--type-section-color)}');
  return css.join('\n');
}
