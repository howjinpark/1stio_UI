import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { servicesRouter } from './routes/services';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/services', servicesRouter);

// Default route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Istio Traffic Manager API is running',
    endpoints: {
      services: '/api/services',
      serviceDetails: '/api/services/:namespace/:name',
      updateTraffic: '/api/services/:namespace/:name/traffic'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 