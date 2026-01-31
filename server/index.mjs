import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

// Default webhook (use body.webhook to override per-request)
const DEFAULT_WEBHOOK = 'https://vbdh-sgr.com/webhook/1d622d07-3ae2-4820-8b74-4e53ce0469cb/chat';

function extractTextFromEvent(evt) {
  // Recursively collect strings from possible event shapes
  if (!evt) return '';
  if (typeof evt === 'string') return evt;
  if (typeof evt === 'number' || typeof evt === 'boolean') return String(evt);
  if (Array.isArray(evt)) return evt.map(extractTextFromEvent).join('');
  if (typeof evt === 'object') {
    // common keys from SDK events
    const keysToCheck = ['text', 'content', 'parts', 'candidates', 'message', 'delta'];
    let out = '';
    for (const k of keysToCheck) {
      if (evt[k] !== undefined) out += extractTextFromEvent(evt[k]);
    }
    // fallback: check nested objects
    for (const v of Object.values(evt)) {
      if (typeof v === 'string') out += v;
    }
    return out;
  }
  return '';
}

async function postToWebhook(url, payload) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Webhook POST failed:', err);
  }
}

app.post('/api/generate', async (req, res) => {
  const { text, webhook } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Missing `text` in request body' });

  const webhookUrl = (webhook && typeof webhook === 'string') ? webhook : DEFAULT_WEBHOOK;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  const ai = new GoogleGenAI({ apiKey });

  res.json({ status: 'ok', message: 'Streaming to webhook' });

  try {
    // Start streaming response from Gemini 2.5 flash
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text }] }
      ],
      // Keep config minimal - you can add systemInstruction if you need
    });

    // `stream` is an async iterable of events
    let accumulated = '';

    for await (const event of stream) {
      // Extract text from the event
      const chunk = extractTextFromEvent(event);
      if (chunk && chunk.trim() !== '') {
        accumulated += chunk;
        // Send incremental update to webhook as JSON { output: "..." }
        await postToWebhook(webhookUrl, { output: accumulated });
      }
    }

    // Final post to ensure the webhook has the completed text
    await postToWebhook(webhookUrl, { output: accumulated });
    console.log('Streaming complete, posted final output to webhook.');
  } catch (err) {
    console.error('Streaming error:', err);
    await postToWebhook(webhookUrl, { output: '', error: String(err) });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`AI webhook forwarder listening on http://localhost:${PORT}`));
