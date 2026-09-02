import { processVideoTranscript } from '../services/transcriptService.js';
import Transcript from '../models/Transcript.js';

// @desc    Fetch and process transcript for a video
// @route   POST /api/transcripts/ingest
// @access  Public
export const ingestTranscript = async (req, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const transcriptData = await processVideoTranscript(videoId);
    
    res.status(200).json({
      message: 'Transcript processed and saved successfully!',
      videoId: transcriptData.videoId,
      chunkCount: transcriptData.chunks.length,
    });
  } catch (error) {
    console.error("Ingest Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transcript chunks by video ID
// @route   GET /api/transcripts/:videoId
// @access  Public
export const getTranscript = async (req, res) => {
  try {
    const transcript = await Transcript.findOne({ videoId: req.params.videoId });

    if (!transcript) {
      return res.status(404).json({ message: 'Transcript not found in database' });
    }

    res.status(200).json(transcript);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
