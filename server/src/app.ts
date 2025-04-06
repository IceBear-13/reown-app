import express, { Express, Request, Response } from 'express';
import http from "http";
import { Server } from "socket.io";
import { ethers, EtherscanProvider } from "ethers";
import cors from "cors";
import { EtherscanTransaction, getAddressTransactions } from './services/getTransactionEtherscan';
import { getTransactionHistoryAlchemy } from './services/getTransactionAlchemy';
import { supabaseAdmin } from './db/config';
import router from './routes';


const PROVIDER_URL = process.env.PROVIDER_URL || 'https://mainnet.infura.io/v3/your_infura_key';

export const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET', 'POST']
  }
});

export const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);

app.get('/health', (req: Request, res: Response) => {
  res.send('Server is running');
});



server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
