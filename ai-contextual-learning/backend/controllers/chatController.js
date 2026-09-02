import { generateAIResponse } from '../ai/geminiService.js';
import { getFullTranscriptText } from '../services/transcriptService.js';

// @desc    Chat with AI about a video (Full Transcript → Gemini)
// @route   POST /api/chat
// @access  Public
export const chatWithVideo = async (req, res) => {
  try {
    const { videoId, query, learningLevel = 'intermediate' } = req.body;

    if (!videoId || !query) {
      return res.status(400).json({ message: 'videoId and query are required' });
    }

    // STEP 1: Get the FULL transcript from MongoDB
    const fullTranscript = await getFullTranscriptText(videoId);

    if (!fullTranscript) {
      return res.status(404).json({ 
        message: 'No transcript found for this video. Please click "Ingest to AI" first to fetch and save the transcript.' 
      });
    }

    console.log(`Sending full transcript (${fullTranscript.length} chars) + query to Gemini...`);

    // STEP 2: Send full transcript + user query to Gemini
    const aiResponse = await generateAIResponse(query, fullTranscript, learningLevel);
    
    res.status(200).json({
      answer: aiResponse,
      contextUsed: true,
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ message: 'Failed to process chat query', error: error.message });
  }
};
