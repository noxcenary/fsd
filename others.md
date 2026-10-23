## Suggested Sprint Plan

| Week | Milestone |
|---|---|
| 1–2 | Project setup, repo structure, CI/CD, DB schema, auth flow |
| 3–4 | Core CRUD APIs + frontend pages, chat widget UI (mock) |
| 5–6 | Chatbot: RAG pipeline, vector DB ingestion, multi-turn memory |
| 7–8 | Recommendation: data pipeline, model training, API integration |
| 9 | Integration, end-to-end testing, performance tuning |
| 10 | Deployment, monitoring, docs, launch |

## Key Decisions to Make Early

1. **Chatbot approach** — Fine-tune a small model vs. use GPT-4o with RAG (RAG is faster to ship, cheaper to iterate)
2. **Recommendation type** — Content-based (item features) vs. collaborative (user-item) vs. hybrid (start with hybrid)
3. **Hosting** — Vercel (frontend) + AWS ECS (backend) vs. all on a single VPS (cheaper, less scalable)
4. **Vector DB** — Pinecone (managed, easy) vs. ChromaDB/Milvus (self-host, free)