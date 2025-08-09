const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Lazy init OpenAI to avoid requiring the package if not installed or key not present
let openai = null;
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openai) {
    try {
      const OpenAI = require('openai');
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch (e) {
      console.warn('OpenAI SDK not available; falling back to heuristic.');
      return null;
    }
  }
  return openai;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

function buildHeuristicSuggestions(issueText) {
  const suggestions = [];
  const normalizedIssue = (issueText || '').toLowerCase();
  if (normalizedIssue.includes('leak') || normalizedIssue.includes('drip')) {
    suggestions.push(
      'Turn off the water supply under the sink.',
      'Remove handle and inspect cartridge/O-rings for wear.',
      'Replace worn O-rings or the cartridge (match brand/model).',
      'Reassemble and test for leaks.'
    );
  } else if (normalizedIssue.includes('no water') || normalizedIssue.includes('no flow')) {
    suggestions.push(
      'Confirm water supply valves are fully open.',
      'Unscrew and clean the aerator to remove debris.',
      'Check supply lines for kinks or blockages.',
      'If still no flow, inspect/replace the cartridge.'
    );
  } else {
    suggestions.push(
      'Identify faucet brand/model (look under the sink or on the handle).',
      'Check for obvious wear on seals and cartridge.',
      'Consult the brand-specific repair guide for replacement parts.'
    );
  }
  return {
    summary: 'Preliminary troubleshooting steps generated (heuristic).',
    suggestions,
    confidence: 0.5,
  };
}

async function analyzeWithOpenAI({ issue, intakeData, photoBase64 }) {
  const client = getOpenAI();
  if (!client) {
    const issueText = issue || intakeData?.issueDescription || '';
    return buildHeuristicSuggestions(issueText);
  }

  const userTextParts = [];
  if (issue) userTextParts.push(`Selected issue: ${issue}`);
  if (intakeData?.issueDescription) userTextParts.push(`User description: ${intakeData.issueDescription}`);
  if (intakeData?.fullName) userTextParts.push(`Name: ${intakeData.fullName}`);
  if (intakeData?.email) userTextParts.push(`Email: ${intakeData.email}`);
  const userText = userTextParts.join('\n');

  const content = [];
  if (userText) {
    content.push({ type: 'text', text: `${userText}\n\nReturn a JSON object with keys: summary (string), suggestions (string[]), confidence (0-1).` });
  } else {
    content.push({ type: 'text', text: 'Analyze the attached faucet photo and provide repair steps. Return JSON with keys: summary, suggestions[], confidence (0-1).' });
  }
  if (photoBase64) {
    const dataUrl = `data:image/jpeg;base64,${photoBase64}`;
    content.push({ type: 'image_url', image_url: { url: dataUrl } });
  }

  try {
    // Use Chat Completions with multimodal-capable model
    const resp = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a plumbing troubleshooting assistant. Analyze faucet issues (leaks, no-flow, others). Output only valid JSON with keys: summary (string), suggestions (string[]), confidence (0-1). Keep suggestions concrete and safe.'
        },
        { role: 'user', content }
      ],
      temperature: 0.2,
    });

    const text = resp.choices?.[0]?.message?.content || '';
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Try to recover JSON from fenced blocks
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }
    if (!parsed || !Array.isArray(parsed.suggestions)) {
      const fallback = buildHeuristicSuggestions(`${issue || ''} ${intakeData?.issueDescription || ''}`);
      return fallback;
    }
    // Coerce fields
    return {
      summary: String(parsed.summary || 'Suggested steps generated.'),
      suggestions: parsed.suggestions.map((s) => String(s)).slice(0, 10),
      confidence: Math.max(0, Math.min(1, Number(parsed.confidence ?? 0.7))),
    };
  } catch (err) {
    console.error('OpenAI error:', err?.response?.data || err?.message || err);
    const fallback = buildHeuristicSuggestions(`${issue || ''} ${intakeData?.issueDescription || ''}`);
    return fallback;
  }
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { issue, intakeData, photoBase64 } = req.body || {};

    if (!issue && !intakeData?.issueDescription && !photoBase64) {
      return res.status(400).json({ error: 'Please provide issue, issueDescription or a photo.' });
    }

    const result = await analyzeWithOpenAI({ issue, intakeData, photoBase64 });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze. Please try again.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI analysis server running on http://localhost:${PORT}`);
});