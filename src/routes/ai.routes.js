
import express from 'express';
import aiController from '../controllers/ai.controller.js';

const router = express.Router();

// Define the route for generating the AI response
router.post('/get-review', aiController.getReview);

export default router;
