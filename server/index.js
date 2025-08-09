const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { issue, intakeData, photoBase64 } = req.body || {};

    // Basic validation
    if (!issue && !intakeData?.issueDescription && !photoBase64) {
      return res.status(400).json({ error: 'Please provide issue, issueDescription or a photo.' });
    }

    // Placeholder AI logic: You can integrate with a provider here (OpenAI, etc.)
    // For now, we return a simple heuristic-based suggestion set.
    const suggestions = [];
    const normalizedIssue = (issue || intakeData?.issueDescription || '').toLowerCase();

    if (normalizedIssue.includes('leak') || normalizedIssue.includes('drip')) {
      suggestions.push(
        'Turn off the water supply under the sink.',
        'Remove handle and inspect cartridge/O-rings for wear.',
        'Replace worn O-rings or the cartridge (match brand/model).',
        'Reassemble and test for leaks.',
      );
    } else if (normalizedIssue.includes('no water') || normalizedIssue.includes('no flow')) {
      suggestions.push(
        'Confirm water supply valves are fully open.',
        'Unscrew and clean the aerator to remove debris.',
        'Check supply lines for kinks or blockages.',
        'If still no flow, inspect/replace the cartridge.',
      );
    } else {
      suggestions.push(
        'Identify faucet brand/model (look under the sink or on the handle).',
        'Check for obvious wear on seals and cartridge.',
        'Consult the brand-specific repair guide for replacement parts.',
      );
    }

    // Simulated AI confidence and notes
    const result = {
      summary: 'Preliminary troubleshooting steps generated.',
      suggestions,
      confidence: 0.7,
    };

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