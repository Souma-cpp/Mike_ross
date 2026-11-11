# NyaySetu — Project Context

Read this whole file before writing any code. It covers what the project is,
who is building it, what has been decided, and what is still open.

## 1. What it is

NyaySetu ("bridge to justice") is a final-year B.Tech CSE project at Sister
Nivedita University, Kolkata (2027 batch). Two students build it; it is
submitted and defended in a viva.

A multimodal AI platform that helps ordinary people in India get legal help.
The target user is a layperson, not a lawyer: may not know legal terms, may
speak Hindi, Bengali or another Indian language, and often code-mixes
(Hinglish/Benglish).

Core user flow:
1. The user describes their problem, mainly by voice (text also supported).
2. The system identifies the legal issue (consumer, tenancy, criminal, labour,
   family, RTI, ...) and which acts/sections apply.
3. It explains the user's rights in plain language, citing the actual law.
4. Where it fits, it generates a ready-to-use document: RTI application,
   consumer complaint, legal notice, etc.

## 2. Timeline

- Work spans 7th semester (Nov 2026) and 8th semester (submission ~mid-2027).
- Build time is limited (internship + exams). Prefer simple, working pieces
  over clever architecture.

## 3. Team background (calibrate explanations)

- Comfortable with MERN, Linux, Vim, Git. Python intermediate, learning FastAPI.
- AI experience: calling LLM APIs. No fine-tuning/training experience.
- Every part must be explainable in the viva: briefly justify non-obvious
  decisions; avoid magic.

## 4. Technical direction (V1)

Approach: **RAG, not fine-tuning.** Fine-tuning teaches style, not facts (a
fine-tuned model still invents section numbers); RAG answers from statute text
and can cite it; law changes are handled by updating documents, not retraining;
cheaper and easier to defend.

Pipeline:
`voice -> speech-to-text -> issue classification -> retrieve law (RAG) ->
plain-language explanation with citations -> (optional) generated document`

Components:
- Speech-to-text: Sarvam AI Saaras (`saaras:v3`), 22 Indian languages +
  English, codemix mode.
- Main LLM: Gemini or OpenAI via API, behind **one swappable interface**.
  Optional: Sarvam-105B as a comparison.
- Vector DB: simple — Chroma for local dev (pgvector/Qdrant are alternatives).
- Embeddings: decided during build.
- Backend: Python + FastAPI. Frontend: React with in-browser voice recording.

Knowledge base: bare acts from India Code (indiacode.nic.in), cleaned and
chunked **by section**, with act name + section number as metadata so answers
can cite them.

Document generation: **template-driven.** Fixed templates; the LLM only fills
fields from the user's story. The LLM never freestyles whole documents.

## 5. Datasets (evaluation / V2 only — not for training an LLM)

- IL-TUR: https://huggingface.co/datasets/Exploration-Lab/IL-TUR (LSI task ≈ our classification step)
- ILSIC: layperson queries mapped to 500+ Indian statutes (closest to our users)
- Aalap: https://huggingface.co/datasets/opennyaiorg/aalap_instruction_dataset
- AIBE: https://huggingface.co/datasets/opennyaiorg/aibe_dataset (tests LLM knowledge more than our pipeline)

V2 idea only: fine-tune a small classifier (e.g. InLegalBERT) on IL-TUR LSI.

## 6. Critical gotcha: IPC -> BNS

On 1 July 2024, IPC, CrPC and the Evidence Act were replaced by BNS, BNSS and
BSA. Most datasets and LLM training data still use IPC numbers ("IPC 420").
- NyaySetu must cite **BNS/BNSS/BSA**, never IPC.
- Maintain IPC->BNS and CrPC->BNSS mapping tables (`data/mappings/`), used for
  dataset labels and for post-checking LLM output.

## 7. Non-negotiables

- Every legal claim shown to the user is grounded in retrieved text and cites
  act + section. If retrieval finds nothing relevant, say so — never guess.
- Clear disclaimer: legal information, not legal advice; serious matters need a
  lawyer or free legal aid (NALSA/DLSA).
- Plain words; (from M4) answers in the user's language.
- Secrets (API keys) live in `.env`, never committed. Commit `.env.example`.

## 8. Decisions log

- **Tenancy is West Bengal only** (West Bengal Premises Tenancy Act, 1997) —
  rent law is state law; deliberate scope choice, stated in the report.
- **English-only for now.** Pipeline stays English internally; multilingual
  (translate query in / answer out, Sarvam STT) is milestone M4.
- **No LLM API keys yet.** Early milestones must run without a paid key.

## 9. Open questions (ask, don't assume)

- Work split between teammates.
- Main LLM: Gemini vs OpenAI vs Sarvam-105B.
- Embedding model and vector DB.
- V1 legal categories (proposed: consumer, RTI, WB tenancy, basic criminal/FIR)
  and document types.
- Hosting/deployment; web app only or also mobile.

## 10. How to work in this repo

- Propose structure/plans and wait for OK before generating lots of code.
- Small, runnable, testable steps.
- Be direct: if an idea is bad, say so and why.
- **Git:** never commit to `main`. Work on a branch, raise a PR, someone else
  reviews and merges. **Ask before every commit and every push.**
