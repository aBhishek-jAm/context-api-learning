import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Build a prompt that gives Gemini the FULL video transcript so it can
 * answer ANY question about ANY timestamp in the video.
 * Now also asks Gemini to assess the student's level and recommend resources.
 */
const buildEducationalPrompt = (query, fullTranscriptText) => {
  return `You are an expert AI educational assistant integrated into a video learning platform.
You have COMPLETE access to the full video transcript below. You know EVERYTHING that was taught in this video.

=== FULL VIDEO TRANSCRIPT (with timestamps) ===
${fullTranscriptText}
=== END OF TRANSCRIPT ===

STUDENT'S QUESTION:
"${query}"

YOUR TASK:
1. **Assess the student's level** based on the complexity, terminology, and depth of their question:
   - "beginner" — basic/introductory questions, asking "what is X?", simple definitions
   - "intermediate" — questions showing partial understanding, asking "how does X work?", comparisons
   - "advanced" — deep technical questions, edge cases, optimization, proofs, mathematical rigor

2. **Answer the question** using the transcript context:
   - Reference specific timestamps when relevant (e.g., "At [2:15], the instructor explains...")
   - Format your response clearly using Markdown (headings, bullet points, **bold text**)
   - If the student asks about a specific timestamp, find that content in the transcript
   - Adapt your explanation depth to match the assessed level
   - If the question is truly unrelated to the video content, politely mention that but still try to help

3. **Recommend 4 resources** for further learning based on the topic of the question and the student's level:
   - 2 NPTEL/educational YouTube video recommendations (real NPTEL courses or well-known educational channels like 3Blue1Brown, MIT OpenCourseWare, Khan Academy, etc.)
   - 2 free online resources (documentation pages, tutorials, blog posts, textbooks — use real URLs from sites like GeeksForGeeks, W3Schools, MDN, TutorialsPoint, Real Python, Towards Data Science, Stanford CS courses, etc.)
   - Each recommendation must have: title, url (a real, working URL), and a short description (1 sentence)
   - Tailor difficulty of recommendations to the student's assessed level

You MUST respond with ONLY valid JSON in this exact format (no markdown fencing, no extra text):
{
  "level": "beginner" | "intermediate" | "advanced",
  "answer": "Your full markdown-formatted answer here...",
  "recommendations": [
    { "title": "...", "url": "https://...", "description": "...", "type": "nptel" },
    { "title": "...", "url": "https://...", "description": "...", "type": "nptel" },
    { "title": "...", "url": "https://...", "description": "...", "type": "free" },
    { "title": "...", "url": "https://...", "description": "...", "type": "free" }
  ]
}`;
};

/**
 * Generate AI Response using Gemini with full transcript context.
 * Returns a structured object: { level, answer, recommendations }
 */
export const generateAIResponse = async (query, fullTranscriptText) => {
  try {
    const prompt = buildEducationalPrompt(query, fullTranscriptText);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3, // Lower temperature for factual educational responses
        responseMimeType: 'application/json',
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const parsed = JSON.parse(text);
      
      // Validate required fields
      if (!parsed.level || !parsed.answer || !Array.isArray(parsed.recommendations)) {
        throw new Error('Missing required fields in AI response');
      }

      // Normalize level to one of the three valid values
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validLevels.includes(parsed.level)) {
        parsed.level = 'intermediate';
      }

      return parsed;
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', parseError.message);
      console.error('Raw response:', text.substring(0, 500));
      
      // Fallback: return the raw text as the answer with default values
      return {
        level: 'intermediate',
        answer: text,
        recommendations: []
      };
    }
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to generate AI response. Please check your Gemini API key.");
  }
};
