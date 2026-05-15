import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Build a prompt that gives Gemini the FULL video transcript so it can
 * answer ANY question about ANY timestamp in the video.
 */
const buildEducationalPrompt = (query, fullTranscriptText, learningLevel = 'intermediate') => {
  let levelInstruction = '';
  if (learningLevel === 'beginner') {
    levelInstruction = "Explain the concepts very simply using analogies, avoiding complex jargon. Break down steps clearly.";
  } else if (learningLevel === 'advanced') {
    levelInstruction = "Provide an in-depth, technical explanation. Include underlying theories, edge cases, and mathematical rigor if applicable.";
  } else {
    levelInstruction = "Provide a balanced, clear explanation suitable for a standard college-level student.";
  }

  return `You are an expert AI educational assistant integrated into a video learning platform.
You have COMPLETE access to the full video transcript below. You know EVERYTHING that was taught in this video.

=== FULL VIDEO TRANSCRIPT (with timestamps) ===
${fullTranscriptText}
=== END OF TRANSCRIPT ===

STUDENT'S QUESTION:
"${query}"

INSTRUCTIONS FOR YOUR RESPONSE:
1. ${levelInstruction}
2. You MUST answer based on the transcript above. You have the full transcript — use it.
3. If the student asks about a specific timestamp (e.g., "2 min", "5:30"), find the content near that timestamp in the transcript and explain what was being taught at that point.
4. Reference specific timestamps from the transcript in your answer when relevant (e.g., "At [2:15], the instructor explains...").
5. Format your response clearly using Markdown (headings, bullet points, **bold text** for emphasis).
6. If the student asks for code or math, provide properly formatted code blocks.
7. If the question is truly unrelated to the video content, politely mention that it wasn't covered in the video, but still try to help with general knowledge.`;
};

/**
 * Generate AI Response using Gemini with full transcript context
 */
export const generateAIResponse = async (query, fullTranscriptText, learningLevel) => {
  try {
    const prompt = buildEducationalPrompt(query, fullTranscriptText, learningLevel);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3, // Lower temperature for factual educational responses
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to generate AI response. Please check your Gemini API key.");
  }
};
