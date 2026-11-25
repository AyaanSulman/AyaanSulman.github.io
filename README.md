# ayaansulman.github.io

Ayaan Sulman's portfolio. Plain HTML, CSS and JavaScript: no framework, no build step. The animated controls are [Sakuga VFX](https://github.com/finktheartist/sakuga-vfx) (MIT), kept in the repo.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole site, one page. All content lives here. |
| `404.html` | Page shown for broken links. |
| `assets/css/styles.css` | All styles. Colors for light and dark themes are tokens at the top. |
| `assets/js/main.js` | Theme switch, project filters, contact note, buttons, footer year. |
| `assets/js/loader.js` | The intro: full on a first visit, about a second after that. Delete its script tag, the `#loader` div and the `is-loading` lines in the `<head>` to remove it. |
| `assets/js/sky.js` | The day and night sky behind the page. Remove its script tags for a plain background. |
| `assets/vendor/sakuga/` | Sakuga VFX: `sakuga.js` (core and ten controls, with one line changed so the words can be replaced) and `toggle.js` (the painted switch). `words-ur.js` holds the Urdu sound effects; remove its script tags to get the Japanese back. |
| `assets/fonts/` | Schibsted Grotesk (SIL Open Font License, see `OFL.txt`). |
| `assets/img/` | Portrait and project screenshots. |
| `resume/` | The three resume PDFs linked from the site. |
| `og-image.png` | Preview image for links shared on LinkedIn, Slack, etc. |

## Editing

- **Add a project:** it needs a panel and a story with the same id. Copy one `<li class="panel">` in `#panels` (set `data-for`
  and the link to the id; use a screenshot or a small SVG drawing), then copy one `<li class="project">…</li>` block in `index.html` and change its text. Set `data-kind`
  to `client`, `university` or `personal`; the filter tabs read it.
  Add a screenshot by putting a WebP (1440 wide, plus an 800 wide copy named `-800.webp`) in `assets/img/work/`, adding `has-shot` to the `project-body` div and copying a `<figure class="shot">`.
- **Update a resume:** replace the PDF in `resume/`, keeping the same file name.
- **Change colors:** edit the `--bg`, `--ink`, `--accent` (etc.) tokens at the top of `styles.css`. Light and dark each have their own set.

Preview locally:

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploying

**GitHub Pages (current):** push to `main`. Pages serves the repo root. `.nojekyll` stops Jekyll from processing the files.

**Vercel:** import the repo, set Framework Preset to **Other**, leave the build command empty and set the output directory to `.`.

**Netlify or Cloudflare Pages:** no build command; publish directory is the repo root.

If the site moves to a custom domain, update the `canonical` and `og:` URLs in `index.html`, plus `robots.txt` and `sitemap.xml`.
