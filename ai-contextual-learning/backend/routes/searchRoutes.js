import express from 'express';
import { searchTranscript } from '../controllers/searchController.js';

const router = express.Router();

router.post('/', searchTranscript);

export default router;
