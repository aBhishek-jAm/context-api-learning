/**
 * In-memory FAISS equivalent for Vector Search (Cosine Similarity).
 * Built natively in Node.js to avoid Python C++ compiler issues on Windows.
 */
class VectorStore {
  constructor() {
    this.indexes = {}; // Stores embeddings per videoId
    this.metadata = {}; // Stores original chunks per videoId
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  addVectors(videoId, embeddings, chunks) {
    if (!this.indexes[videoId]) {
      this.indexes[videoId] = [];
      this.metadata[videoId] = [];
    }

    this.indexes[videoId].push(...embeddings);
    this.metadata[videoId].push(...chunks);
    
    console.log(`[Vector DB] Added ${embeddings.length} vectors for ${videoId}. Total: ${this.indexes[videoId].length}`);
  }

  search(videoId, queryEmbedding, topK = 3) {
    if (!this.indexes[videoId] || this.indexes[videoId].length === 0) {
      return [];
    }

    const videoEmbeddings = this.indexes[videoId];
    const results = [];

    for (let i = 0; i < videoEmbeddings.length; i++) {
      const similarity = this.cosineSimilarity(queryEmbedding, videoEmbeddings[i]);
      results.push({
        score: similarity,
        chunk: this.metadata[videoId][i]
      });
    }

    // Sort descending by score
    results.sort((a, b) => b.score - a.score);
    
    return results.slice(0, topK);
  }
}

// Export singleton instance
export const vectorDb = new VectorStore();
