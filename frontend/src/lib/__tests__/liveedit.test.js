/**
 * Regression tests for /services/cybersecurity + /services/ai-governance-compliance
 * live-editor background-swatch bug (iteration 19).
 * Imports live functions from liveedit.js (no copies).
 */
import { buildCss, relatedEditKeys, scopeKey, splitKey } from "../liveedit";

const PATH = "/services/cybersecurity";
const LEGACY_SEL = "#root > div > div:nth-of-type(1) > main > section:nth-of-type(5)";
const STABLE_SEL = '[data-testid="cyber-industry"]';

describe("buildCss – specificity normalization via :where()", () => {
  test("wraps every selector in :where() so legacy #root cannot beat stable [data-testid]", () => {
    const css = buildCss(PATH, [
      { selector: LEGACY_SEL, props: { backgroundColor: "#c8d2de", padding: "70" } },
      { selector: STABLE_SEL, props: { backgroundColor: "#faaf6a" } },
    ]);
    expect(css).toMatch(/:where\(#root > div > div:nth-of-type\(1\) > main > section:nth-of-type\(5\)\)/);
    expect(css).toMatch(/:where\(\[data-testid="cyber-industry"\]\)/);
    expect(css).toContain(':is(#root, #root *):where(');
    // The app-root scope retains priority over authored !important section spacing.
    expect(css).toMatch(/padding:70px !important/);
    // new colour rule present
    expect(css).toMatch(/#faaf6a/);
  });

  test("legacy 70px padding survives when only a new [data-testid] color record exists", () => {
    const css = buildCss(PATH, [
      { selector: LEGACY_SEL, props: { padding: "70", backgroundColor: "#c8d2de" } },
      { selector: STABLE_SEL, props: { backgroundColor: "#faaf6a" } },
    ]);
    expect(css.indexOf("padding:70px")).toBeGreaterThan(-1);
    expect(css.indexOf("#faaf6a")).toBeGreaterThan(-1);
  });

  test("orders by scope so phone comes after tablet after all (later wins on same specificity)", () => {
    const css = buildCss(PATH, [
      { selector: scopeKey(STABLE_SEL, "phone"), props: { backgroundColor: "#111111" } },
      { selector: scopeKey(STABLE_SEL, "tablet"), props: { backgroundColor: "#222222" } },
      { selector: STABLE_SEL, props: { backgroundColor: "#333333" } },
    ]);
    const iAll = css.indexOf("#333333");
    const iTab = css.indexOf("#222222");
    const iPhn = css.indexOf("#111111");
    expect(iAll).toBeGreaterThan(-1);
    expect(iTab).toBeGreaterThan(iAll);
    expect(iPhn).toBeGreaterThan(iTab);
    expect(css).toMatch(/@media \(max-width:1023px\)/);
    expect(css).toMatch(/@media \(max-width:767px\)/);
  });

  test("explicit gradient follows the colour reset until choosing a solid removes the gradient prop", () => {
    const css = buildCss(PATH, [
      { selector: STABLE_SEL, props: { backgroundColor: "#faaf6a", backgroundImage: "linear-gradient(...)" } },
    ]);
    // EditorPanel removes backgroundImage when a solid is chosen. If the user
    // explicitly chooses a gradient instead, it must still win over the reset.
    expect(css).toMatch(/background-color:#faaf6a !important/);
    expect(css).toMatch(/background-image:none !important/);
    expect(css.indexOf('background-image:linear-gradient(...)')).toBeGreaterThan(css.indexOf('background-image:none'));
  });

  test("splitKey correctly separates selector and scope", () => {
    expect(splitKey(scopeKey(STABLE_SEL, "phone"))).toEqual({ selector: STABLE_SEL, scope: "phone" });
    expect(splitKey(STABLE_SEL)).toEqual({ selector: STABLE_SEL, scope: "all" });
  });
});

describe("relatedEditKeys – legacy + stable aliases resolving to same DOM element", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root">
        <div>
          <div>
            <main>
              <section></section>
              <section></section>
              <section></section>
              <section></section>
              <section data-testid="cyber-industry" id="cyber-target"></section>
              <section data-testid="other-sec"></section>
            </main>
          </div>
        </div>
      </div>`;
  });

  test("returns both legacy positional key and stable testid key when they hit same element", () => {
    const edits = [
      { selector: LEGACY_SEL, props: {} },
      { selector: STABLE_SEL, props: {} },
      { selector: '[data-testid="other-sec"]', props: {} },
    ];
    const keys = relatedEditKeys(STABLE_SEL, edits);
    expect(keys).toEqual(expect.arrayContaining([STABLE_SEL, LEGACY_SEL]));
    expect(keys).not.toContain('[data-testid="other-sec"]');
  });

  test("preserves scope when remapping aliases (phone-scope stays phone-scope for both)", () => {
    const phoneKey = scopeKey(STABLE_SEL, "phone");
    const edits = [
      { selector: LEGACY_SEL, props: {} },
      { selector: STABLE_SEL, props: {} },
    ];
    const keys = relatedEditKeys(phoneKey, edits);
    expect(keys).toContain(phoneKey);
    expect(keys).toContain(scopeKey(LEGACY_SEL, "phone"));
    // Never leak into desktop/all
    expect(keys).not.toContain(LEGACY_SEL);
  });

  test("ignores invalid stored selectors instead of throwing/mutating them", () => {
    const edits = [
      { selector: "@@@not-valid-css", props: {} },
      { selector: STABLE_SEL, props: {} },
    ];
    const keys = relatedEditKeys(STABLE_SEL, edits);
    expect(keys).toContain(STABLE_SEL);
    expect(keys).not.toContain("@@@not-valid-css");
  });

  test("skips broad multi-match selectors (querySelectorAll length !== 1)", () => {
    const edits = [
      { selector: "section", props: {} }, // matches many
      { selector: STABLE_SEL, props: {} },
    ];
    const keys = relatedEditKeys(STABLE_SEL, edits);
    expect(keys).not.toContain("section");
    expect(keys).toContain(STABLE_SEL);
  });

  test("target selector matching >1 elements does not create aliases", () => {
    const keys = relatedEditKeys("section", [
      { selector: LEGACY_SEL, props: {} },
      { selector: STABLE_SEL, props: {} },
    ]);
    // Only the original key back – no aliasing when target is broad
    expect(keys).toEqual(["section"]);
  });
});
