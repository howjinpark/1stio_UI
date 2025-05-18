import express, { Request, Response } from 'express';
import { KubernetesService } from '../services/kubernetes';

const router = express.Router();
const k8sService = new KubernetesService();

// Get all services
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await k8sService.listServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service details
router.get('/:namespace/:name', async (req: Request, res: Response) => {
  try {
    const { namespace, name } = req.params;
    const service = await k8sService.getServiceDetails(namespace, name);
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service details' });
  }
});

// Update traffic weights
router.patch('/:namespace/:name/traffic', async (req: Request, res: Response) => {
  try {
    const { namespace, name } = req.params;
    const { weights } = req.body;
    await k8sService.updateTrafficWeights(namespace, name, weights);
    res.json({ message: 'Traffic weights updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update traffic weights' });
  }
});

export const servicesRouter = router; 