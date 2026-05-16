import { YoutubeTranscript } from 'youtube-transcript';
import Transcript from '../models/Transcript.js';

/**
 * Intelligent chunking strategy:
 * Group short transcript segments together until they reach roughly 50-100 words.
 * Each chunk stores start time (in seconds) and duration for precise timestamp lookup.
 */
const chunkTranscript = (rawTranscript, maxWordsPerChunk = 60) => {
  const chunks = [];
  let currentChunk = {
    text: '',
    start: 0,
    duration: 0,
  };
  let currentWordCount = 0;

  for (let i = 0; i < rawTranscript.length; i++) {
    const item = rawTranscript[i];
    
    // Clean text
    const cleanText = item.text.replace(/\[Music\]/gi, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
    if (!cleanText) continue;

    const wordCount = cleanText.split(/\s+/).length;

    // If starting a new chunk
    if (currentWordCount === 0) {
      currentChunk.start = item.offset / 1000; // Convert ms to seconds
    }

    currentChunk.text += (currentChunk.text ? ' ' : '') + cleanText;
    currentChunk.duration = (item.offset / 1000 + item.duration / 1000) - currentChunk.start;
    currentWordCount += wordCount;

    // If chunk limit reached or it's the last item
    if (currentWordCount >= maxWordsPerChunk || i === rawTranscript.length - 1) {
      chunks.push({ ...currentChunk });
      
      // Reset for next chunk
      currentChunk = {
        text: '',
        start: 0,
        duration: 0,
      };
      currentWordCount = 0;
    }
  }

  return chunks;
};

/**
 * Helper to format seconds into MM:SS for readability
 */
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const processVideoTranscript = async (videoId) => {
  try {
    // Check if already in DB
    let existingTranscript = await Transcript.findOne({ videoId });
    if (existingTranscript) {
      console.log(`Transcript for ${videoId} already exists in DB (${existingTranscript.chunks.length} chunks).`);
      return existingTranscript;
    }

    // Fetch from YouTube (force English language)
    console.log(`Fetching English transcript from YouTube for video: ${videoId}...`);
    let rawTranscript;
    try {
      // Try manually created English transcript first
      rawTranscript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    } catch {
      try {
        // Fall back to auto-generated English
        rawTranscript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en', country: 'US' });
      } catch {
        // Last resort: fetch whatever is available
        rawTranscript = await YoutubeTranscript.fetchTranscript(videoId);
      }
    }
    
    if (!rawTranscript || rawTranscript.length === 0) {
      throw new Error("No transcript found for this video");
    }

    console.log(`Fetched ${rawTranscript.length} raw segments. Chunking...`);

    // Chunk it
    const chunks = chunkTranscript(rawTranscript);

    console.log(`Created ${chunks.length} chunks. Saving to MongoDB...`);

    // Save to DB
    const newTranscript = await Transcript.create({
      videoId,
      chunks,
    });

    console.log(`✅ Transcript for ${videoId} saved to MongoDB (${chunks.length} chunks).`);
    return newTranscript;
  } catch (error) {
    console.error("Transcript Service Error:", error);
    if (error.message.includes("Transcript is disabled")) {
      throw new Error("Transcripts are disabled for this video on YouTube. AI cannot analyze it.");
    }
    throw new Error(`Failed to process transcript: ${error.message}`);
  }
};

/**
 * Build the full transcript text with timestamps for Gemini context.
 * This is the key function — it sends the ENTIRE transcript to the AI
 * so Gemini has complete knowledge of the video.
 */
export const getFullTranscriptText = async (videoId) => {
  const transcript = await Transcript.findOne({ videoId });
  if (!transcript || !transcript.chunks || transcript.chunks.length === 0) {
    return null;
  }

  // Build a nicely formatted transcript with timestamps
  const lines = transcript.chunks.map(chunk => {
    const timestamp = formatTime(chunk.start);
    return `[${timestamp}] ${chunk.text}`;
  });

  return lines.join('\n');
};
