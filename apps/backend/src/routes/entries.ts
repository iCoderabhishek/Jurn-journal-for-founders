import express from 'express';
import * as entriesController from '../controllers/entries';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(authenticate);

router.get('/', entriesController.getAllEntries);
router.post('/create', entriesController.createEntry);

export default router;