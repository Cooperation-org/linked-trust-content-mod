import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import { authRoutes, apiRoutes } from './routes';
import cors from 'cors';
import logger from 'morgan';

const port = process.env.PORT || 8082;

const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');
const file = fs.readFileSync('./docs/swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(
    YAML.parse(fs.readFileSync('./docs/swagger-external.yaml', 'utf8'))
  )
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (typeof err === 'object' && err !== null && 'message' in err) {
    let status: number;
    if ('statusCode' in err && typeof err.statusCode === 'number') {
      status = err.statusCode;
    } else {
      status = 500;
    }
    const { message } = err;
    res.status(status).json({ message });
  }
});

app.listen(port, async () => {
  console.log(`Running on port ${port}`);
});
