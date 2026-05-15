import express from 'express';
import { chatWithVideo } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', chatWithVideo);

export default router;
