import express from 'express';
import tokenController from '../controllers/token.controller.js';

const router = express.Router();

router.get('/', tokenController.generateToken);

export default router;