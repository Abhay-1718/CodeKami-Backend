import express from 'express';
import aiController from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/get-review', (req, res, next) => {
  console.log('Received request:', req.body); // Debug log
  aiController.getReview(req, res, next);
});

export default router;