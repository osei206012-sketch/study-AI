Study Desk AI — Multiple Image Upload Update

This build allows selecting up to 24 images in one selection. The browser compresses each image before sending. Because the vision service supports a limited number of images per request, the app submits images in batches of up to three and combines the answers. Each batch is analysed separately, so users should review the combined response and ensure important details are not missed.

Deployment:
1. Replace index.html in your existing GitHub repository with this file.
2. Keep netlify.toml and netlify/functions/chat.mjs in their existing locations.
3. Keep GROQ_API_KEY configured in Netlify environment variables; never commit the key.
4. Commit changes and wait for Netlify deployment.
5. Test 1, 3, 4, 20 and 24 images. Test files should be clear, readable images.

Limitations:
- Maximum 24 images per selection.
- Images are analysed in batches of up to three, so the AI does not compare all images in a single model request. Combined results are provided in the final response.
- Large batches may take longer and consume more API usage. Individual images over 7 MB before compression are rejected.
- Live deployment must be tested after updating GitHub/Netlify.
