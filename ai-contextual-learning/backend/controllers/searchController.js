import { generateEmbeddings } from '../ai/geminiService.js';
import { vectorDb } from '../services/vectorStore.js';

// @desc    Search video transcript using vector similarity
// @route   POST /api/search
// @access  Public
export const searchTranscript = async (req, res) => {
  try {
    const { videoId, query } = req.body;

    if (!videoId || !query) {
      return res.status(400).json({ message: 'videoId and query are required' });
    }

    const queryEmbedding = await generateEmbeddings([query]);
    if (!queryEmbedding || queryEmbedding.length === 0) {
      return res.status(500).json({ message: 'Failed to generate query embedding' });
    }

    const searchResults = vectorDb.search(videoId, queryEmbedding[0], 3);

    res.status(200).json({
      query: query,
      results: searchResults
    });
  } catch (error) {
    console.error("Vector search error:", error.message);
    res.status(500).json({ message: 'Error searching context', error: error.message });
  }
};
