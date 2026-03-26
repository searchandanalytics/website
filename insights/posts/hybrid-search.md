---
title: "Designing Hybrid Search at Enterprise Scale"
date: "January 6, 2026"
category: "AI SEARCH"
---

# Designing Hybrid Search at Enterprise Scale

_January 6, 2026 · 6 min read_

## The core idea

Hybrid search is not “BM25 + vectors”. It’s a system design problem: choose candidates, fuse signals, and keep latency predictable.



- Use lexical for precision and navigational intent.

- Use semantic for recall and intent matching.

- Add reranking only where it changes outcomes.



## A practical blueprint

A common pattern that stays stable across stacks (Elasticsearch/OpenSearch/MongoDB/Redis):



- Stage 1: lexical candidates (BM25, fields, boosts).

- Stage 2: semantic candidates (ANN vector retrieval).

- Stage 3: fuse scores (RRF / weighted sum) and apply business rules.

- Stage 4: optional rerank (cross-encoder / LLM reranker) on a small top-K.



## What to measure (so it doesn’t become opinion)

Treat relevance as an engineering loop. Build a small evaluation set and track it every time you change analyzers, embeddings, or fusion weights.



- Offline: NDCG@K / MRR / Recall@K.

- Online: CTR, reformulation rate, zero-result rate, latency p95/p99.



## Common failure modes

Most hybrid rollouts fail due to uncontrolled cost/latency or uncontrolled drift in embeddings.



- Reranking too deep (K too large).

- No query-class routing (everything uses the same pipeline).

- No guardrails for “semantic hallucination” in UI snippets.
