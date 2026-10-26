# Truth Table Lab

Independent, buildless private prototype for idea S008. Serve `dist/` using any static HTTP server. Six complete routes: `/` (Korean), `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/`. Language navigation resolves against each page's base URL. No dependencies, network requests, ads, analytics or input persistence.

## Scope

Safe recursive-descent Boolean parser; six variables maximum, names of 1–16 ASCII identifier characters, expressions up to 300 characters. NOT, AND, XOR, OR, implication and equivalence, constants, parentheses. Truth table, classification, equivalent sum of products, 2–4 variable Gray-order Karnaugh map, copy and UTF-8 CSV export. Implication is right-associative. All other binary operators are left-associative. A Quine–McCluskey-style merge followed by essential implicants and greedy coverage produces equivalent SOP; global minimality is explicitly not promised. Generated expressions can exceed the input character limit.

All UI, examples' labels, validation, output status and help are localized in six static catalogs. User variable names are retained. No `eval`, `Function` or user HTML rendering.

## Verification

Run from this directory using Node 24+. The workspace owner used the explicit RTK executable with these runtime arguments:

```text
rtk.exe proxy node.exe build-pages.mjs
rtk.exe proxy node.exe --check dist/core.js
rtk.exe proxy node.exe --check dist/app.js
rtk.exe proxy node.exe --check dist/i18n.js
rtk.exe proxy node.exe tests.mjs
```

Actual result: all commands exited 0. Fixture output: `PASS: 7 known truth fixtures, 8 invalid inputs, 5 equivalent SOP fixtures including 64 rows, 6 complete locale catalogs/routes.` Tests use known XOR, implication, contradiction, tautology, reduction, De Morgan and precedence results. Reduced SOP is checked by a separate sum/product interpreter rather than reparsing with the implementation under test. Language catalog keys and generated static routes are checked. Browser interaction and visual QA remain for the publishing owner.

## Attribution

Original implementation, design, examples and prose. Formula reference: Princeton University, [Boolean Logic](https://introcs.cs.princeton.edu/java/71boolean/), describing Boolean truth tables and the sum-of-products construction. No third-party prose, images, code, fonts or other assets are copied.

## Public GitHub Pages release

Launch: https://nanalab.kr/truth-table-lab/

Korean is at the root. English, Spanish, Chinese, Japanese and German use `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/`.
GitHub Pages serves `main` → `/docs` using the branch build. No project CNAME is used.

Build: `node scripts/build-public.mjs`. The `dist/` snapshot and its original generators/tests are preserved as the application source. The public build adds metadata, six-locale sitemaps, original JPEG cards, More Apps styling and the existing NaNa publisher integrations. It does not upload selected user files.

Publisher integrations: AdSense, Google Tag Manager, Google Analytics and Cloudflare Web Analytics, with the same publisher settings as the NaNa Lab homepage. These scripts can make network requests independently of local file processing.

Original JPEG cards are rendered from original text and geometry using an installed system font; no font files are redistributed. Existing source references and third-party notices remain applicable.
