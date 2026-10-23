## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| **Frontend** | **Next.js** (React 18) + **Tailwind CSS** | SSR/SSG, fast DX, component ecosystem |
| **Backend API** | **Python FastAPI** | Async, native Pydantic validation, easy ML integration |
| **Chatbot Engine** | **LangChain** + **OpenAI API** (GPT-4o) | RAG pipeline, multi-turn memory, tool-calling |
| **Vector Store** | **Pinecone** (cloud) or **ChromaDB** (self-host) | Embedding storage for RAG retrieval |
| **Recommendation Model** | **scikit-learn** (collaborative filtering) + **PyTorch** (deep learning) | Hybrid rec: content-based + collaborative |
| **Database** | **PostgreSQL** (via Supabase) | Relational data, user profiles, interaction logs |
| **Cache / Queue** | **Redis** | Session cache, async task queue (Celery) |
| **Auth** | **NextAuth.js** (frontend) + **JWT** (backend) | OAuth + token-based API auth |
| **Deployment** | **Docker** + **AWS ECS** (or **Vercel** for frontend) | Containerised, scalable, CI/CD via GitHub Actions |
