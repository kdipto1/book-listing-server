import { Server } from 'http';
import app from './app';
import config from './config';

async function bootstrap() {
  const server: Server = app.listen(config.port, () => {
    console.info(`Server running on port ${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();

//  "devDependencies": {
//     "@types/cors": "^2.8.13",
//     "@types/express": "^4.17.17",
//     "@typescript-eslint/eslint-plugin": "^4.0.0",
//     "@typescript-eslint/parser": "^4.0.0",
//     "eslint": "^7.0.0",
//     "eslint-config-prettier": "^8.8.0",
//     "husky": "^8.0.3",
//     "lint-staged": "^13.2.2",
//     "prettier": "^2.8.8",
//     "ts-node-dev": "^2.0.0",
//     "typescript": "^5.0.4"
//   },
//   "dependencies": {
//     "@types/bcrypt": "^5.0.0",
//     "@types/cookie-parser": "^1.4.3",
//     "@types/jsonwebtoken": "^9.0.2",
//     "bcrypt": "^5.1.0",
//     "cookie-parser": "^1.4.6",
//     "cors": "^2.8.5",
//     "dotenv": "^16.0.3",
//     "express": "^4.18.2",
//     "http-status": "^1.6.2",
//     "jsonwebtoken": "^9.0.0",
//     "zod": "^3.21.4"
//   }
