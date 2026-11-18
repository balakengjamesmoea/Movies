# LesothoStream — BIWD1110/DIWD1110 Principles of Web Design

## Run the project
1. Extract the ZIP folder.
2. Open the `LesothoStream_BIWD1110_Project` folder in VS Code.
3. Run it with the VS Code Live Server extension, or from a terminal:
   `python -m http.server 8000`
4. Visit `http://localhost:8000`.

A local web server is recommended because the catalogue is loaded with the Fetch API from `data/titles.json`. If the JSON request fails, the JavaScript includes a built-in fallback catalogue.

## Account access and security limitation
The website opens on a dedicated sign-in / registration screen. The catalogue and all other sections remain hidden until a visitor signs in or creates an account. Registration includes a name, email, password confirmation and English/Sesotho language preference. Passwords are processed with a salted PBKDF2 hash before being saved in this browser; the original password is not stored. Account records are kept in this browser only, and the signed-in session ends when the browser session ends. There is no server-side authentication, password recovery or cross-device account synchronisation. This is a front-end academic project and must not be used with a password that protects another account or with sensitive personal information. A production service requires a secure backend, HTTPS, server-side authentication, rate limiting, recovery and account-management processes.

## Features
- Responsive Bootstrap 5 navigation and layout.
- Home/discover hero section.
- 12 catalogue records in `data/titles.json`, across four genres.
- Dynamic catalogue cards generated from an array of objects.
- Search by title or description.
- Genre and content-type filters.
- Title details modal and external sample trailer links.
- Add/remove, search, sort and clear My List with per-account `localStorage` persistence.
- Contact form with HTML and JavaScript validation.
- Full-screen sign-in and registration gate with validation, password confirmation, salted password hashing, language preference, profile view and sign-out.
- Bootstrap toast notifications for success and error/status feedback.
- Fetch API loading state, error handling and built-in fallback.
- Expanded About, platform values, feature highlights, contact form and FAQ sections.
- Responsive mobile, tablet and desktop layout.

## Lesotho context
The platform concept is aimed at viewers in Lesotho and references the Mountain Kingdom, Basotho audiences, local stories and different levels of connectivity. The interface is designed to be mobile-friendly. The project is a demonstration catalogue, not a paid streaming service.

## Content and attribution
Poster thumbnails are remote Unsplash image URLs and require an internet connection. Trailer buttons link to public sample videos on YouTube; verify the chosen trailer and its reuse suitability before presenting. Third-party assets remain the property of their respective owners.

## Hosting
Upload the extracted project to a static host such as GitHub Pages, Netlify or Vercel. Ensure `index.html`, `styles.css`, `app.js` and the `data` folder are deployed together. Test the public URL in a private/incognito window and on a phone. The public website begins at the sign-in / registration screen; provide the lecturer with instructions to create an account for assessment.

## Files
- `index.html` — semantic page structure and Bootstrap components.
- `styles.css` — external styling, layout, states and media queries.
- `app.js` — catalogue rendering, search, filters, forms, account access, watchlist and notifications.
- `data/titles.json` — catalogue data fetched by the Fetch API.
- `REPORT.md` — assignment response and implementation report.
