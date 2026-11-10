# ayaansulman.github.io

Ayaan Sulman's portfolio. Plain HTML, CSS and JavaScript: no framework, no build step, no dependencies.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole site, one page. All content lives here. |
| `404.html` | Page shown for broken links. |
| `assets/css/styles.css` | All styles. Colors for light and dark themes are tokens at the top. |
| `assets/js/main.js` | Theme toggle, copy-email button, footer year. |
| `assets/fonts/` | Schibsted Grotesk (SIL Open Font License, see `OFL.txt`). |
| `assets/img/` | Portrait and project screenshots. |
| `resume/` | The three resume PDFs linked from the site. |
| `og-image.png` | Preview image for links shared on LinkedIn, Slack, etc. |

## Editing

- **Add a project:** copy one `<li><details class="row">…</details></li>` block in `index.html` and change its text.
  Add a screenshot by putting a JPEG in `assets/img/work/`, adding `has-shot` to the `row-body` div and copying a `<figure class="shot">`.
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
