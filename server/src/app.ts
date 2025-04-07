import express, { Request, Response } from 'express';
import http from "http";
import { Server } from "socket.io";
import { ethers } from "ethers";
import cors from "cors";
import router from './routes';
import { specs, swaggerUi } from './swagger';

const PROVIDER_URL = process.env.PROVIDER_URL || 'https://mainnet.infura.io/v3/your_infura_key';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const server = http.createServer(app);

export const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);

app.get('/health', (req: Request, res: Response) => {
  res.send('Server is running');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});