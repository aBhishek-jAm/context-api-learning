import express from 'express';
import { ingestTranscript, getTranscript } from '../controllers/transcriptController.js';

const router = express.Router();

router.post('/ingest', ingestTranscript);
router.get('/:videoId', getTranscript);

export default router;
