STUDY DESK AI — PROFESSIONAL BUILD
=================================

This project contains:
- index.html: responsive Study Desk AI interface
- netlify.toml: Netlify publish and Functions configuration
- netlify/functions/chat.mjs: secure server-side Groq chat endpoint

DEPLOY TO NETLIFY
1. Upload these project files to the root of the GitHub repository connected to your Netlify site.
2. In Netlify, open Site configuration / Environment variables.
3. Add GROQ_API_KEY with your Groq API key as the value. Do not put the key in index.html or commit it to GitHub.
4. Trigger a new deploy and wait until it says Published.
5. Open the deployed site and test Chat, Research, camera capture, and image analysis.

FEATURES
- Clean, responsive blue-and-white interface with SVG icons
- Chat, Research, presentation-outline, and table/spreadsheet modes
- Camera capture and image upload for AI document analysis
- Image resizing/compression before sending to reduce request size
- Readable headings, lists, code blocks, and formatted Markdown tables
- Common LaTeX cleanup for readable chemical and math notation
- Light/dark appearance toggle
- Voice input where the browser supports speech recognition
- Export conversation notes to a Word-compatible document

NOTES
- Camera access requires HTTPS (Netlify's hosted site provides HTTPS) and browser permission.
- Image questions use the vision model configured in netlify/functions/chat.mjs.
- Plain-text files and images can be read directly. PDF and Office document text extraction is not implemented in this build; convert the page to an image or paste the text if you need analysis of those formats.
- Live AI responses require a valid GROQ_API_KEY and successful Netlify deployment.
