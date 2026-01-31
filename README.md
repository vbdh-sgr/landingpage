<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1y8UXvm52xYjQu-xIACPCh7Q5EsdQ0YJf

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

Server endpoint

- A small Express server was added at `server/index.mjs`. Run it locally with:

  npm run start:api

- POST to `http://localhost:8787/api/generate` with JSON: `{ "text": "Your question here", "webhook": "https://your-webhook.example/" }`.
- The server will call Gemini `gemini-2.5-flash` in streaming mode and send incremental JSON payloads to the webhook with the shape `{ "output": "...partial or full response..." }`.

Security note

- Keep `GEMINI_API_KEY` secret. Do not put it in client-side code. Revoke any keys you exposed and generate a new one for this server.
3. Run the app:
   `npm run dev`
