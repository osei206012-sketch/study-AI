STUDY DESK AI — QUALITY-CHECK BUILD

Included
- index.html: responsive study assistant, document upload and camera capture, copy answer, per-answer PDF/Word/PowerPoint/Excel downloads, and an in-app AI application readiness checklist.
- netlify/functions/chat.mjs: server-side Groq API proxy, vision model routing, request validation, response validation, timeout and readable errors.
- netlify.toml: Netlify publish/function configuration.

DEPLOY
1. Keep the folder structure intact. netlify/functions/chat.mjs must remain at that exact path.
2. Commit index.html, netlify.toml, and netlify/functions/chat.mjs to the connected GitHub repository.
3. In Netlify, set GROQ_API_KEY as an environment variable for the deployed site. Never put the secret in index.html or GitHub.
4. Trigger/retry a deploy after setting the variable.
5. Test on the deployed HTTPS URL: text question, clear camera photo, uploaded text-based PDF/DOCX/XLSX/PPTX, copy, and all four per-answer download formats.

IMPORTANT LIMITATIONS / LAUNCH FEEDBACK
- This is a static front end plus a Netlify function. It does not yet provide user accounts, persistent cloud chat history, billing, a database, admin moderation, analytics, or production-grade rate limiting.
- Document extraction is browser-based and relies on third-party CDN libraries. Internet access is needed for those libraries; scanned PDFs may need OCR or a clear photo.
- PDF and office-format export libraries may fail if their CDN is blocked. Test each download on mobile and desktop. Excel may fall back to CSV depending on library availability; a CSV is not an XLSX workbook.
- AI can be wrong. Users should verify critical facts and must not treat output as professional medical, legal, financial, or safety advice.
- Before public launch, add rate limiting/abuse prevention, usage limits and budget alerts, a privacy notice and data-handling plan, accessible keyboard/screen-reader checks, and monitoring/error reporting.
- Do not claim the live deployment is fully verified until the test plan above passes against the real Netlify URL and API key.
