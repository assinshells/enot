import pino from 'pino';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logsDir = join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isDev = process.env.NODE_ENV !== 'production';

let logger;

if (isDev) {
  logger = pino({
    level: process.env.LOG_LEVEL || 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  });
} else {
  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      targets: [
        {
          target: 'pino/file',
          level: 'info',
          options: {
            destination: join(logsDir, 'app.log'),
            mkdir: true,
          },
        },
        {
          target: 'pino/file',
          level: 'error',
          options: {
            destination: join(logsDir, 'errors.log'),
            mkdir: true,
          },
        },
      ],
    },
  });
}

logger.info(
  { env: process.env.NODE_ENV },
  `🚀 Logger initialized in ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} mode`
);

export default logger;