# ContextLearn AI 🧠

![ContextLearn AI Dashboard](assets/dashboard.png)

**ContextLearn AI** is a next-generation, AI-Powered Contextual Learning System. Designed to seamlessly integrate with online educational platforms (like NPTEL, YouTube, and Coursera), it provides learners with an intelligent, context-aware AI assistant that can answer questions, summarize topics, and explain code based exactly on the video content being watched.

By leveraging a robust **Retrieval-Augmented Generation (RAG)** pipeline, ContextLearn AI ensures that responses are highly accurate, grounded in the lecture's transcript, and immediately relevant to the student's current learning context.

---

## ✨ Features

- 💬 **Contextual AI Chat**: Ask questions directly related to the video. The AI retrieves relevant chunks from the video transcript and generates a simplified, structured, and personalized response.
- 📊 **Learning Analytics Dashboard**: Track your engagement with real-time metrics, including Total Queries, AI Helpfulness Rate, and Average AI Latency.
- 📚 **Course Management**: Seamlessly manage your enrolled NPTEL/YouTube courses, track your progress percentage, and jump right back into where you left off.
- 🔖 **Saved Notes & Bookmarks**: Save helpful AI responses for quick reference later. Notes are automatically tagged by lecture, difficulty level (Beginner/Intermediate/Advanced), and topic.
- 🔄 **Continuous Improvement Loop**: A built-in user feedback system (Helpful / Not Helpful) that continuously refines the knowledge base and identifies learning gaps.

---

## 🏗️ System Architecture

![Block Diagram](assets/block_diagram.png)

The system operates on a state-of-the-art RAG architecture, processing data in real-time to assist learners:

1. **Learning Input**: The user watches a video lecture and submits a natural language query.
2. **Data Ingestion & Processing**: 
   - Transcripts/captions are extracted from the video.
   - Text is cleaned, preprocessed, and segmented into meaningful chunks.
   - Embeddings are generated using **Sentence Transformers / OpenAI**.
3. **Knowledge Base**: Processed data is stored in a **Vector Database** (e.g., FAISS, Chroma, Pinecone) alongside document metadata.
4. **Retrieval & Context**: The user's query is embedded and compared against the vector database (Similarity Search) to fetch the top-K relevant chunks.
5. **AI Response Generation**: The context is fed into a powerful LLM (GPT-4 / Gemini / LLaMA) to generate an accurate, context-aware explanation.
6. **Output**: The learner receives a formatted response complete with key points, code snippets, and related timestamps.

---

## 📸 Application Gallery

### 1. Contextual AI Chat Interface
![Contextual Chat](assets/chat_interface.png)
*Interact with the AI assistant in real-time while watching your NPTEL or YouTube course.*

### 2. Saved Notes Repository
![Saved Notes](assets/saved_notes.png)
*Access all your bookmarked AI responses, properly categorized by course and lecture for easy revision.*

### 3. My Courses Tracker
![Course Tracker](assets/courses.png)
*Keep an eye on your ongoing courses and track your overall progress.*

---

## 🚀 Getting Started

Follow these steps to set up ContextLearn AI locally on your machine.

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- API Keys: 
  - Google Gemini API Key (or OpenAI API Key)
  - Pinecone/ChromaDB credentials (if using managed vector DBs)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ContextLearn-AI.git
cd ContextLearn-AI
```

### 2. Setup the Backend (Python / FastAPI)
The backend handles transcript extraction, embeddings generation, vector storage, and LLM communication.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment variables file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY / OPENAI_API_KEY
```

### 3. Start the Backend Server
```bash
# Run the FastAPI application
python -m uvicorn main:app --reload --port 8000
```

### 4. Setup the Frontend (React / Vite)
The frontend provides the sleek UI for the video player, chat, and dashboard.

```bash
# Open a new terminal and navigate to the project root
cd ContextLearn-AI

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```

### 5. Open the Application
Navigate to `http://localhost:5173` in your web browser. You can start importing video links or exploring the demo courses!

---

## ⚙️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (or Custom CSS), Lucide Icons
- **Backend**: Python, FastAPI
- **AI/LLM**: LangChain, Google Gemini 2.0 / OpenAI GPT-4
- **Vector Database**: FAISS (Local) / Pinecone (Cloud)
- **Embeddings**: HuggingFace (`all-MiniLM-L6-v2`) or OpenAI Embeddings

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
