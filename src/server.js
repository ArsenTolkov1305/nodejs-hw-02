import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = Number(process.env.PORT);

export const setupServer = () => {
  const app = express();

  // Спочатку всі middleware
  app.use(cors());
  app.use(express.json({
    type: ['application/json', 'application/vnd.api+json'],
  }));
  app.use(pino({
    transport: {
      target: 'pino-pretty',
    },
  }));

  // Маршрути
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });
  app.use('/contacts', contactsRouter);

  // Обробники помилок - змінюємо на використання звичайного use
  app.use((req, res, next) => {
    notFoundHandler(req, res, next);
  });
  app.use(errorHandler);

  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      resolve(app);
    });
  });
};