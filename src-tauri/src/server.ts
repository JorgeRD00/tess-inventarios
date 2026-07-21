import express from 'express';
import cors from 'cors';
import { commands } from './main';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, _res, next) => {
  console.log(`[backend] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

app.post('/invoke', async (req, res) => {
  const { command, args } = req.body;
  const camelCommand = toCamelCase(command);
  const fn = (commands as Record<string, Function>)[camelCommand];

  if (!fn || typeof fn !== 'function') {
    return res.status(404).json({ error: `Command '${command}' not found` });
  }

  try {
    let result: any;
    if (!args || Object.keys(args).length === 0) {
      result = await fn();
    } else if (Object.keys(args).length === 1) {
      const key = Object.keys(args)[0];
      result = await fn(args[key]);
    } else {
      result = await fn(args);
    }
    return res.json(result ?? null);
  } catch (error: any) {
    console.error(`Error invoking command '${command}':`, error);
    return res.status(400).json({ error: error.message || String(error) });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler to avoid crashes from invalid JSON or unexpected errors
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(400).json({ error: err.message || 'Error en el servidor' });
});

app.listen(PORT, () => {
  console.log(`[backend] HTTP server listening on http://127.0.0.1:${PORT}`);
});
