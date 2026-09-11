# A&E Cleaning Solutions — Website

A responsive, single-page marketing site for **A&E Cleaning Solutions**, an owner-operated
pressure washing and exterior cleaning business in Altamonte Springs, Florida.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no external APIs.

## Files

| File          | Purpose                                                          |
| ------------- | ---------------------------------------------------------------- |
| `index.html`  | Entry point — all page sections and structured data               |
| `styles.css`  | Design tokens, layout, components and responsive rules            |
| `script.js`   | Mobile nav, sticky header, scroll reveal, contact form validation |
| `favicon.svg` | Site icon                                                        |
| `robots.txt`  | Crawler directives                                                |

## Sections

1. **Hero** — business name, tagline and primary "Call Now" / free report calls to action
2. **Stats strip** — jobs completed, rating, quote turnaround, owner-on-site
3. **Services** — house washing, driveway & concrete, roof soft washing, pavers & pool deck,
   deck/patio/fence, commercial & storefront
4. **Needs Attention** — five signs a property is overdue for a wash
5. **About** — Dan, the owner-operator
6. **How It Works** — three-step process ending in a free written property report
7. **Testimonials** — reviews from Altamonte Springs, Longwood, Casselberry and Maitland
8. **Service Area** — Seminole County and north Orange County communities
9. **Contact** — phone, email, address, hours and a validated quote request form

## Contact form behaviour

The site is fully static, so the form performs client-side validation and then hands the
completed request off to the visitor's own email client via a pre-filled `mailto:` link.
No data is transmitted to any third-party service. To wire it to a real backend, replace the
submit handler in `script.js` with a `fetch()` call to your endpoint.

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Image credits

All photography is sourced from [Pexels](https://www.pexels.com) under the Pexels License and
is referenced directly from the Pexels CDN.
