import express from 'express';
import positionsController from '../controllers/positions.controller.js';

const router = express.Router();

router.post('/', positionsController.createPositions);
router.get('/', positionsController.positions);

export default router;