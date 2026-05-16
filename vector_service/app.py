from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

app = Flask(__name__)
CORS(app)

# Initialize Sentence Transformer model
print("Loading model... (this may take a minute)")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully!")

# Dictionary to store FAISS indexes per video
# In a real production environment, you might persist these to disk or use a dedicated vector DB service like Pinecone/Milvus
vector_stores = {}
# Dictionary to store metadata (text, timestamps) corresponding to the vectors
metadata_stores = {}

@app.route('/api/vector/add', methods=['POST'])
def add_vectors():
    try:
        data = request.json
        video_id = data.get('videoId')
        chunks = data.get('chunks') # Array of {id, text, start, duration}
        
        if not video_id or not chunks:
            return jsonify({"error": "videoId and chunks are required"}), 400
            
        print(f"Processing {len(chunks)} chunks for video {video_id}...")
        
        # Extract text for embeddings
        texts = [chunk['text'] for chunk in chunks]
        
        # Generate embeddings
        embeddings = model.encode(texts)
        
        # Initialize or get FAISS index for this video
        dimension = embeddings.shape[1]
        
        if video_id not in vector_stores:
            # Using L2 distance (IndexFlatL2) or Inner Product (IndexFlatIP) for cosine similarity
            # We'll use Inner Product and normalize vectors for exact cosine similarity
            index = faiss.IndexFlatIP(dimension)
            vector_stores[video_id] = index
            metadata_stores[video_id] = []
        
        # Normalize embeddings for cosine similarity: Cosine Similarity = (A.B) / (||A|| ||B||)
        faiss.normalize_L2(embeddings)
        
        # Add to FAISS index
        vector_stores[video_id].add(np.array(embeddings).astype('float32'))
        
        # Store metadata
        metadata_stores[video_id].extend(chunks)
        
        return jsonify({
            "message": "Successfully generated embeddings and added to FAISS",
            "videoId": video_id,
            "totalChunksInIndex": vector_stores[video_id].ntotal
        })
        
    except Exception as e:
        print(f"Error in add_vectors: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/vector/search', methods=['POST'])
def search_vectors():
    try:
        data = request.json
        video_id = data.get('videoId')
        query = data.get('query')
        top_k = data.get('top_k', 3)
        
        if not video_id or not query:
            return jsonify({"error": "videoId and query are required"}), 400
            
        if video_id not in vector_stores or vector_stores[video_id].ntotal == 0:
            return jsonify({"error": "No vector index found for this video. Please ingest first."}), 404
            
        # Generate embedding for query
        query_embedding = model.encode([query])
        
        # Normalize query vector
        faiss.normalize_L2(query_embedding)
        
        # Search FAISS index
        index = vector_stores[video_id]
        distances, indices = index.search(np.array(query_embedding).astype('float32'), top_k)
        
        # Format results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(metadata_stores[video_id]):
                results.append({
                    "score": float(distances[0][i]),
                    "chunk": metadata_stores[video_id][idx]
                })
                
        return jsonify({
            "query": query,
            "results": results
        })
        
    except Exception as e:
        print(f"Error in search_vectors: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
