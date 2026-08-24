import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")

index = None
stored_chunks = []
stored_metadata = []


def create_embeddings(
    chunks: list[str],
    metadata: list[dict] | None = None
):
    global index
    global stored_chunks
    global stored_metadata

    if not chunks:
        return

    if metadata is None:
        metadata = [{} for _ in chunks]

    embeddings = model.encode(
        chunks,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    embeddings = embeddings.astype("float32")

    dimension = embeddings.shape[1]

    if index is None:
        index = faiss.IndexFlatIP(dimension)

    index.add(embeddings)

    stored_chunks.extend(chunks)

    stored_metadata.extend(metadata)


def search_similar(
    query: str,
    top_k: int = 10
):
    if index is None or not stored_chunks:
        return []

    query_embedding = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    query_embedding = query_embedding.astype("float32")

    actual_top_k = min(
        top_k,
        len(stored_chunks)
    )

    scores, indices = index.search(
        query_embedding,
        actual_top_k
    )

    results = []

    for score, index_value in zip(
        scores[0],
        indices[0]
    ):
        if index_value == -1:
            continue

        if index_value >= len(stored_chunks):
            continue

        metadata = stored_metadata[index_value]

        results.append(
            {
                "content": stored_chunks[index_value],
                "score": float(score),
                "filename": metadata.get(
                    "filename",
                    "Unknown Document"
                )
            }
        )

    return results


def get_vector_count():
    if index is None:
        return 0

    return index.ntotal