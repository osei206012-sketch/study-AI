STUDY DESK AI — NETLIFY PACKAGE
================================

WHAT IS INCLUDED
- index.html: the Study Desk web application
- netlify/functions/chat.mjs: secure server-side Groq API connection
- netlify.toml: tells Netlify where the website and function are located

IMPORTANT SECURITY CHANGE
The Groq API key is no longer entered into the web page or stored in browser local storage. The server function reads it from Netlify's environment variables.

SETUP ON NETLIFY
1. In your website's GitHub repository, upload/replace index.html at the repository root.
2. Upload the netlify.toml file at the repository root.
3. Create the folder netlify/functions and upload chat.mjs inside it. Keep the exact folder names and file names.
4. In Netlify, open your site, then go to Site configuration (or Project configuration) > Environment variables.
5. Add a variable:
   Name: GROQ_API_KEY
   Value: your NEW Groq API key
   Make sure it is available to Functions. Do not paste the key into HTML or commit it to GitHub.
6. Save the variable, then trigger a fresh deploy/redeploy. Netlify environment-variable changes require a new deploy to take effect.
7. Open the deployed site and ask: “Explain supply chain management in simple terms.”

TEST THE FUNCTION
After deployment, open this path on your website:
/.netlify/functions/chat
A GET request should show a short message saying POST is required. That is expected. The website itself sends POST requests when you ask a question.

TROUBLESHOOTING
- “API key is not configured”: add GROQ_API_KEY in Netlify and redeploy.
- “Groq rejected the server API key”: create a new key, replace the environment variable, and redeploy.
- HTTP 429/rate limit: wait a little and try again; review your Groq usage and limits.
- Function not found: verify netlify.toml is at the repository root and chat.mjs is inside netlify/functions, then redeploy.

SECURITY NOTE
This setup keeps the secret key out of the public HTML, but a public website can still receive excessive requests. Before advertising the site widely or charging users, add authentication and request-rate limiting/usage controls.

The page was statically checked for JavaScript syntax. A real live AI test still requires deployment with a valid GROQ_API_KEY.
