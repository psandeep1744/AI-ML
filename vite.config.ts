import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function geminiTriageApiPlugin(): Plugin {
  return {
    name: 'gemini-triage-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/triage' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const input = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'fallback', message: 'No API key, fallback used' }));
                return;
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `You are Kynovia Diagnostic Copilot, an advanced clinical decision-support engine under FDA SaMD Class II evaluation frameworks.
Analyze the following patient intake presentation and return STRICT JSON with no markdown wrapping:
Symptoms: ${JSON.stringify(input.symptoms || [])}
NRS Pain Rating (1-10): ${input.painScore || 6}
Episodic Duration: ${input.duration || '2-3 Days'}
Associated Triggers: ${JSON.stringify(input.triggers || [])}

Return a valid JSON object matching this schema:
{
  "impression": "Primary Probabilistic Impression name",
  "matchPercent": 89,
  "icd10": "ICD-10 Code Equivalent",
  "evidenceGrade": "Evidence Grade B+ / A-",
  "cohortBasis": "Cross-referenced against 1.2M peer-reviewed clinical cohorts",
  "primaryDrivers": "Concise summary of contributing physiological factors",
  "clinicalReasoning": "Professional clinical decision logic explaining attribution",
  "differentialExclusions": [
    { "name": "Condition 1", "reason": "Clinical reason for de-prioritization", "prob": 20 },
    { "name": "Condition 2", "reason": "Clinical reason for exclusion", "prob": 10 }
  ],
  "urgencyGrade": "Routine (3–5 Days) OR Priority (1–2 Days) OR Emergency (Immediate)",
  "recommendedSpecialty": "Neurology / Cardiology / Dermatology / Orthopedics",
  "matchedDoctorId": "doc-elena-rostova OR doc-marcus-chen OR doc-tariq-almansoor"
}`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                },
              });

              const text = response.text || '';
              const parsed = JSON.parse(text);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(parsed));
            } catch (err: unknown) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'error', error: err instanceof Error ? err.message : String(err) }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiTriageApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
