import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")

index = None
stored_chunks = []


def create_embeddings(chunks: list[str]):
    global index, stored_chunks

    embeddings = model.encode(chunks)

    embeddings = np.array(embeddings).astype("float32")

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    stored_chunks = chunks


def search_similar(query: str, top_k: int = 3):
    if index is None or not stored_chunks:
        return []

    query_embedding = model.encode([query])
    query_embedding = np.array(query_embedding).astype("float32")

    distances, indices = index.search(query_embedding, top_k)

    results = []

    for distance, index_value in zip(distances[0], indices[0]):
        if index_value < len(stored_chunks):
            results.append({
                "content": stored_chunks[index_value],
                "score": float(distance)
            })

    return results