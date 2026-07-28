/* AI — NLP & LLM A11–A13. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   A11 — Document Q&A (RAG)
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A11',
  domainKey: 'ai',
  emoji: '📚', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'Chat with your own PDFs and documents — retrieval-augmented generation grounds an LLM in your files so answers cite sources instead of hallucinating.',
  platformName: 'CPU/GPU workstation or server (+ LLM API optional)',
  ide: 'Python 3.11 + LLM / vector DB',

  overview: [
    'Large language models are fluent and knowledgeable, but they have two problems that make them unreliable for answering questions about <i>your</i> documents: they don\'t know your private files, and they <b>hallucinate</b> — confidently inventing plausible-sounding answers when they don\'t actually know. <b>Retrieval-Augmented Generation (RAG)</b> is the technique that fixes both, and it has become the dominant pattern for building useful LLM applications. This project builds a Document Q&A system with RAG: you point it at your own PDFs and documents, ask questions in natural language, and get answers <b>grounded in — and citing — your actual files</b>, not the model\'s imagination.',
    'The idea is to <b>retrieve first, then generate</b>. Your documents are split into chunks and each is turned into an <b>embedding</b> (a vector capturing its meaning) stored in a <b>vector database</b>. When you ask a question, the system embeds the question, <b>retrieves the most relevant chunks</b> by semantic similarity, and hands them to the LLM as context with an instruction: "answer using <i>only</i> this information, and cite it". The model then generates an answer <b>grounded in the retrieved passages</b> — so it draws on your documents rather than its parametric memory, and can point to <b>which passage</b> each claim came from.',
    'The value is trustworthy question-answering over private knowledge — manuals, contracts, research, wikis — with citations you can verify, and no need to retrain a model when documents change (just update the index). It is honest that RAG is <b>not magic</b>: answer quality is bounded by <b>retrieval quality</b> (if the right chunk isn\'t retrieved, the answer suffers), chunking and embedding choices matter, the model can still <b>hallucinate or misread</b> even grounded, and it should answer "I don\'t know" when the documents don\'t contain the answer. Built well — good chunking, solid retrieval, grounded prompting with citations, and honest "not found" behaviour — it is both the single most useful LLM-application pattern and a complete lesson in composing retrieval and generation.',
  ],
  does: [
    'Answers natural-language questions over your own documents',
    'Grounds answers in retrieved passages (not model memory)',
    'Cites which document/passage each answer came from',
    'Indexes documents as embeddings in a vector database',
    'Retrieves the most relevant chunks per question',
    'Updates by re-indexing — no model retraining',
    'Says "I don\'t know" when the documents lack the answer',
  ],
  features: [
    'Retrieval-augmented generation (retrieve → generate)',
    'Document chunking + embedding + vector search',
    'Grounded, cited answers',
    'Private-document Q&A',
    'Index updates without retraining',
    'Honest "not found" behaviour',
    'Aware of retrieval-quality and hallucination limits',
  ],
  applications: [
    { t: 'Knowledge-base Q&A', d: 'Chat over manuals, wikis, policies with citations.' },
    { t: 'Contract / document review', d: 'Ask questions across large document sets.' },
    { t: 'Research assistant', d: 'Query papers and reports, grounded in sources.' },
    { t: 'Support / onboarding', d: 'Grounded answers from internal docs.' },
  ],
  skills: [
    'Document chunking and embedding',
    'Vector databases and semantic retrieval',
    'Grounded prompting (context + citations)',
    'RAG pipeline composition',
    'Evaluating retrieval and answer grounding',
  ],
  prereq: [
    'LLMs hallucinate and don\'t know your files — RAG grounds them in your documents.',
    'Retrieve first, then generate: relevant chunks become the model\'s context.',
    'Answer quality is bounded by retrieval quality — the retriever matters most.',
    'Ground answers and cite sources; say "I don\'t know" when unsupported.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute + LLM', spec: 'CPU/GPU; a local or API LLM for generation', qty: 1, price: 0 },
    { name: 'Embedding model', spec: 'Text-embedding model for chunks/queries', qty: 1, price: 0 },
    { name: 'Vector database', spec: 'Vector store for semantic retrieval', qty: 1, price: 0 },
    { name: 'Your documents', spec: 'PDFs/docs to index', qty: 1, price: 0 },
  ],
  cost: 'Software; compute/API-dependent',
  libs: ['python', 'transformers', 'sentencet', 'faiss', 'fastapi'],
  hardwareNotes: [
    'This is a pure-software system — there is no electronic hardware to specify. The "platform" is a computer plus a language model: a CPU suffices for embedding and vector search, while generation runs on a GPU (local LLM) or a hosted LLM API.',
    'Memory and storage scale with the size of the document corpus and its embedding index; a server deployment adds the chat UI and the vector database service. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the RAG data flow — documents are chunked and embedded into a vector store; a question is embedded, relevant chunks retrieved, and passed to the LLM to generate a grounded, cited answer.',
  pins: {
    left: [
      { dev: 'Documents', devPin: 'PDFs/docs', pin: '—', sig: 'Knowledge source' },
      { dev: 'Chunk + embed', devPin: 'index', pin: '—', sig: 'Vectors → store' },
    ],
    right: [
      { dev: 'Retriever', devPin: 'search', pin: '—', sig: 'Relevant chunks' },
      { dev: 'LLM (grounded)', devPin: 'generate', pin: '—', sig: 'Answer + citations' },
    ],
  },
  wiringNotes: [
    'Split documents into chunks and embed each into a vector database (indexing, done once/updated).',
    'Embed the user question and retrieve the most relevant chunks.',
    'Pass the retrieved chunks to the LLM as context with a grounded, cite-your-sources instruction.',
    'Return the answer with citations; answer "I don\'t know" if unsupported.',
    'Answer quality depends on retrieval — invest in chunking/embedding/search.',
  ],

  block: { columns: [
    { label: 'Index', edge: 'right', blocks: [
      { name: 'Documents', sub: 'chunk', highlight: true },
      { name: 'Embed', sub: 'vector store' },
    ] },
    { label: 'Retrieve', edge: 'right', blocks: [
      { name: 'Question', sub: 'embed' },
      { name: 'Search', sub: 'top chunks', highlight: true },
    ] },
    { label: 'Generate', edge: 'right', blocks: [
      { name: 'LLM', sub: 'grounded', highlight: true },
      { name: 'Cite', sub: 'sources' },
    ] },
    { label: 'Answer', edge: 'none', blocks: [
      { name: 'Grounded', sub: 'verifiable' },
      { name: 'or "I don\'t know"', sub: 'if unsupported' },
    ] },
  ] },
  flow: [
    { t: 'Index documents (chunk + embed)', k: 'start' },
    { t: 'User asks a question', k: 'io' },
    { t: 'Embed question; retrieve top chunks', k: 'proc' },
    { t: 'Relevant chunks found?', k: 'dec', yes: 'LLM answers grounded + cites', no: 'Answer "I don\'t know"' },
    { t: 'LLM answers grounded + cites', k: 'proc' },
    { t: 'Answer "I don\'t know"', k: 'io' },
    { t: 'Return answer with citations', k: 'end', back: 'User asks a question' },
  ],

  principle: [
    'A raw LLM answering questions about your documents fails in two specific ways, and RAG is engineered precisely against them. First, the model <b>does not contain your private documents</b> — its knowledge is whatever it was trained on, which is not your contracts or manuals. Second, and worse, when asked something it does not know, an LLM tends to <b>hallucinate</b>: it produces a fluent, confident, <i>wrong</i> answer, because it is optimised to generate plausible text, not to know its own limits. <b>Retrieval-Augmented Generation</b> addresses both by changing where the model gets its facts: instead of relying on its <b>parametric memory</b>, it is fed the <b>relevant passages from your documents</b> and instructed to answer from them. The model\'s fluency is kept; its unreliability as a knowledge source is bypassed.',
    'The architecture is <b>retrieve, then generate</b>, and the indexing half comes first. Documents are split into <b>chunks</b> (passages small enough to be specific but large enough to be meaningful), and each chunk is converted into an <b>embedding</b> — a vector capturing its meaning — and stored in a <b>vector database</b>. This index is built once and updated when documents change; crucially, adding or changing documents needs <b>no model retraining</b>, just re-indexing, which is a major practical advantage over trying to bake knowledge into a model.',
    'At query time, the <b>retrieval</b> step is the heart of the system. The question is embedded into the same vector space, and the database returns the <b>most semantically similar chunks</b> — the passages most likely to contain the answer. These retrieved chunks are then inserted into the LLM\'s prompt as <b>context</b>, with an instruction to answer <i>using only</i> the provided information and to <b>cite</b> which passage supports each claim. The model now <b>generates grounded in your documents</b>: its answer is anchored to real retrieved text, and because it cites sources, a user can <b>verify</b> each claim against the original — the antidote to unverifiable hallucination.',
    'The honesty RAG demands is that it is <b>not magic, and its weakest link is retrieval</b>. The generator can only be as good as what it is given: if the relevant chunk is <b>not retrieved</b> (bad chunking, weak embeddings, an ambiguous question), the answer will be incomplete or wrong no matter how capable the LLM — "retrieval quality bounds answer quality" is the governing principle, which is why chunk size, embedding choice and search matter so much. Even with good retrieval, the model can still <b>misread the context or hallucinate beyond it</b>, so grounding is a strong mitigation, not a guarantee — which makes <b>citations</b> (so claims are checkable) and honest <b>"I don\'t know"</b> behaviour (when the documents genuinely lack the answer, the system must say so rather than invent) essential parts of the design, not niceties. Built with those principles — thoughtful chunking, solid semantic retrieval, grounded-and-cited prompting, and a willingness to admit ignorance — RAG turns an unreliable know-it-all into a trustworthy assistant over your own knowledge, which is exactly why it has become the default pattern for real LLM applications.',
  ],
  equations: [
    { t: 'Indexing', eq: 'for each document:\n  chunks = split(document)         # meaningful passages\n  for c in chunks: store(embed(c), c)  # vector DB\n\nBuilt once; update by re-indexing. NO model retraining.' },
    { t: 'Retrieval (the crux)', eq: 'q = embed(question)\ntop_k = vector_db.search(q, k)      # most similar chunks\n\nAnswer quality ≤ retrieval quality: if the right chunk\nisn\'t retrieved, the answer suffers.' },
    { t: 'Grounded generation', eq: 'answer = LLM(prompt = "Answer using ONLY:\\n" + top_k +\n              "\\nQuestion: " + question +\n              "\\nCite sources. If not supported, say I don\'t know.")\n\nGrounded in your docs + cited → verifiable, not hallucinated.' },
  ],

  ai: {
    task: 'Answer natural-language questions over private documents by retrieving relevant chunks from a vector store and generating a grounded, cited answer with an LLM (RAG).',
    dataset: [
      'Your own documents (PDFs, docs, wikis) are the knowledge source — chunked and embedded, not used to train the model.',
      'An embedding model and an LLM are pretrained; the "data" is your indexed corpus.',
    ],
    datasetTable: [
      { n: 'Your document corpus', size: 'Your files', lic: 'Yours', use: 'Knowledge to answer from' },
      { n: 'Embedding model (pretrained)', size: '—', lic: 'Model terms', use: 'Chunk/query embeddings' },
      { n: 'LLM (local or API)', size: '—', lic: 'Model terms', use: 'Grounded generation' },
      { n: 'Eval Q&A set', size: 'Small', lic: 'Yours', use: 'Test retrieval + grounding' },
    ],
    preprocess: [
      'Parse documents; split into chunks (size/overlap tuned for specificity vs context).',
      'Embed chunks; store with metadata (source, page) for citations.',
      'Clean/normalise text; handle tables/headers where possible.',
    ],
    pipeline: [
      { name: 'Documents', sub: 'chunk', highlight: true },
      { name: 'Embed', sub: 'vector store' },
      { name: 'Question', sub: 'embed' },
      { name: 'Retrieve', sub: 'top chunks', highlight: true },
      { name: 'LLM', sub: 'grounded+cite' },
      { name: 'Answer', sub: 'or I-don\'t-know' },
    ],
    archTable: [
      { l: 'Chunker', s: 'split docs (size/overlap)', p: 'Specific yet meaningful passages' },
      { l: 'Embedder', s: 'text → vectors', p: 'Semantic representation' },
      { l: 'Vector DB', s: 'similarity search', p: 'Retrieve relevant chunks' },
      { l: 'Retriever', s: 'top-k (+ rerank)', p: 'Bounds answer quality' },
      { l: 'Generator', s: 'LLM, grounded + cite', p: 'Verifiable answers' },
    ],
    hyper: [
      { k: 'Chunk size / overlap', v: 'tuned', w: 'Specificity vs context' },
      { k: 'Top-k retrieved', v: '≈ 3–8', w: 'Recall vs prompt size' },
      { k: 'Embedding model', v: 'domain-fit', w: 'Retrieval quality' },
      { k: 'Grounding instruction', v: 'strict', w: 'Reduce hallucination; cite' },
    ],
    training: [
      'No training of the LLM/embedder needed — RAG is composition, not fine-tuning.',
      'Tune chunking, embeddings, top-k and prompts; optionally add a reranker.',
      'Evaluate retrieval hit-rate and answer grounding on a Q&A set.',
    ],
    metricsIntro: [
      'The key metrics are retrieval quality (did the right chunk come back?) and answer faithfulness (is the answer grounded and cited, with honest "I don\'t know"?).',
    ],
    metrics: [
      { m: 'Retrieval hit-rate', v: 'high (target)', d: 'Right chunk retrieved' },
      { m: 'Answer faithfulness', v: 'grounded/cited', d: 'Supported by sources' },
      { m: 'Hallucination rate', v: 'low (target)', d: 'Beyond the context' },
      { m: '"I don\'t know" correctness', v: 'honest', d: 'When docs lack the answer' },
    ],
    chart: { title: 'Answer quality tracks retrieval', unit: '%', desc: 'Answer quality is bounded by retrieval — good retrieval enables grounded answers; poor retrieval caps them however strong the LLM (illustrative).', bars: [
      { label: 'Great retrieval', value: 92 },
      { label: 'Good retrieval', value: 80 },
      { label: 'Weak retrieval', value: 55 },
      { label: 'Missed chunk', value: 30 },
    ] },
    inference: { file: 'rag.py', lang: 'python', body: `def answer(question, embed, vector_db, llm, k=5):
    q = embed(question)
    chunks = vector_db.search(q, k=k)          # RETRIEVE relevant passages
    if not chunks or chunks[0].score < MIN_SIM:
        return {"answer": "I don't know based on the documents.",
                "sources": []}                 # honest: docs lack the answer
    context = "\\n\\n".join(f"[{c.source} p{c.page}] {c.text}" for c in chunks)
    prompt = ("Answer the question using ONLY the context. "
              "Cite sources like [file pN]. If unsupported, say you don't know.\\n\\n"
              f"Context:\\n{context}\\n\\nQuestion: {question}")
    text = llm.generate(prompt)                 # GENERATE grounded + cited
    return {"answer": text, "sources": [(c.source, c.page) for c in chunks]}
    # Answer quality is bounded by retrieval; grounding reduces, not removes, error.` },
    limits: [
      'Answer quality is bounded by retrieval — a missed chunk means a poor answer.',
      'Chunking/embedding choices materially affect results.',
      'The LLM can still misread context or hallucinate — grounding mitigates, not guarantees.',
      'It must answer "I don\'t know" when the documents lack the answer.',
    ],
  },

  assembly: [
    { h: 'Index your documents', p: [
      'Chunk documents, embed each chunk with source metadata, and store them in a vector database.',
    ], warn: 'Answer quality is bounded by retrieval quality — if the right chunk is not retrieved, the answer suffers no matter how strong the LLM. Invest in chunking, embeddings and search, and design the system to say "I don\'t know" when the documents lack the answer.' },
    { h: 'Retrieve and ground', p: [
      'Embed the question, retrieve the most relevant chunks, and prompt the LLM to answer using only them and cite sources.',
    ] },
    { h: 'Cite and handle "not found"', p: [
      'Return citations for verification, and answer "I don\'t know" when retrieval finds nothing relevant.',
    ] },
  ],
  steps: [
    { h: 'Retrieve relevant chunks, then generate grounded', p: [
      'Embed the question, retrieve top chunks, and have the LLM answer using only them with citations — or admit it does not know.',
    ], code: {
      file: 'rag.py', lang: 'python',
      body: `MIN_SIM = 0.25

def answer(question, embed, db, llm, k=5):
    chunks = db.search(embed(question), k=k)      # RETRIEVE first
    if not chunks or chunks[0].score < MIN_SIM:
        return {"answer": "I don't know based on these documents.", "sources": []}
    context = "\\n\\n".join(f"[{c.source} p{c.page}] {c.text}" for c in chunks)
    prompt = ("Answer using ONLY the context and cite sources [file pN]; "
              "if unsupported, say you don't know.\\n\\n"
              f"{context}\\n\\nQ: {question}")
    return {"answer": llm.generate(prompt),        # GENERATE grounded + cited
            "sources": [(c.source, c.page) for c in chunks]}`,
      explain: [
        { ref: 'chunks = db.search(embed(question), k=k)      # RETRIEVE first', txt: 'Retrieval comes first — the question is matched against the indexed chunks to find the passages likely to hold the answer.' },
        { ref: 'if not chunks or chunks[0].score < MIN_SIM:', txt: 'If nothing relevant is retrieved, the system honestly says it does not know rather than inviting the model to invent an answer.' },
        { ref: 'prompt = ("Answer using ONLY the context and cite sources [file pN]; "', txt: 'The prompt grounds the model in the retrieved passages and demands citations — the core of trustworthy RAG.' },
        { ref: '"sources": [(c.source, c.page) for c in chunks]}', txt: 'Returning the sources lets a user verify every claim against the original document — the antidote to unverifiable hallucination.' },
      ],
    } },
    { h: 'Cite, verify and iterate on retrieval', p: [
      'Show citations so answers are checkable, and improve chunking/embeddings/top-k (and add reranking) where retrieval misses.',
    ] , tip: 'When answers are wrong, debug retrieval first: check whether the right chunk was even retrieved. Most RAG failures are retrieval failures, not generation failures.' },
  ],

  code: [{
    file: 'document_qa_rag.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Document Q&A with Retrieval-Augmented Generation (RAG)

Chat over YOUR documents: chunk + embed them into a vector store;
for each question RETRIEVE the most relevant chunks and GENERATE an
answer grounded in them WITH CITATIONS. Answers "I don't know" when
unsupported. Answer quality is bounded by retrieval quality.
"""
MIN_SIM = 0.25

class DocumentQA:
    def __init__(self, embed, vector_db, llm):
        self.embed = embed; self.db = vector_db; self.llm = llm

    def index(self, documents):
        for doc in documents:
            for chunk in split(doc):                  # meaningful passages
                self.db.add(self.embed(chunk.text),   # embedding
                            meta={"source": doc.name, "page": chunk.page,
                                  "text": chunk.text})
        # No model retraining — updates are just re-indexing.

    def ask(self, question, k=5):
        hits = self.db.search(self.embed(question), k=k)   # RETRIEVE
        if not hits or hits[0].score < MIN_SIM:
            return {"answer": "I don't know based on the documents.",
                    "sources": []}                          # honest not-found
        context = "\\n\\n".join(
            f"[{h.meta['source']} p{h.meta['page']}] {h.meta['text']}" for h in hits)
        prompt = ("Answer the question using ONLY the context below. "
                  "Cite sources as [file pN]. If the answer is not in the "
                  "context, say you don't know.\\n\\n"
                  f"Context:\\n{context}\\n\\nQuestion: {question}")
        return {"answer": self.llm.generate(prompt),        # GENERATE grounded
                "sources": [(h.meta['source'], h.meta['page']) for h in hits]}

if __name__ == "__main__":
    qa = DocumentQA(embed_model, VectorDB(), LLM())
    qa.index(load_documents("./docs"))
    print(qa.ask("What is the warranty period?"))
    # Debug wrong answers by checking retrieval FIRST — most failures are there.`,
    explain: [
      { ref: 'for chunk in split(doc):                  # meaningful passages', txt: 'Documents are split into passages specific enough to retrieve precisely yet large enough to carry meaning — chunking is a real design choice.' },
      { ref: '# No model retraining — updates are just re-indexing.', txt: 'Knowledge lives in the index, not the model weights, so changing documents just means re-indexing — a major practical advantage of RAG.' },
      { ref: 'if not hits or hits[0].score < MIN_SIM:', txt: 'When retrieval finds nothing relevant, the system admits it does not know instead of hallucinating — honest not-found behaviour.' },
      { ref: 'prompt = ("Answer the question using ONLY the context below. "', txt: 'The model is grounded strictly in the retrieved context and told to cite, which is what makes answers verifiable rather than invented.' },
      { ref: '# Debug wrong answers by checking retrieval FIRST — most failures are there.', txt: 'The governing principle in code: answer quality is bounded by retrieval, so retrieval is where debugging starts.' },
    ],
  }],

  config: [
    'Configure chunking (size/overlap), the embedding model and vector database.',
    'Configure retrieval top-k, similarity threshold and optional reranking.',
    'Configure the LLM and the grounded, cite-your-sources prompt.',
    'Configure "I don\'t know" behaviour and citation display.',
  ],
  calibration: [
    { h: 'Retrieval', p: [
      'Verify the right chunks are retrieved for representative questions; tune chunking/embeddings/top-k.',
    ] },
    { h: 'Grounding', p: [
      'Check answers are supported by and cite the retrieved passages; tighten the prompt.',
    ] },
    { h: 'Not-found', p: [
      'Confirm it says "I don\'t know" when documents lack the answer.',
    ] },
  ],
  testing: [
    { step: 'Ask an answerable question', expect: 'Grounded answer with citations' },
    { step: 'Verify a citation', expect: 'Cited passage supports the claim' },
    { step: 'Ask something not in the docs', expect: '"I don\'t know" (no hallucination)' },
    { step: 'Update a document', expect: 'Re-index; new answer — no retraining' },
    { step: 'Ambiguous question', expect: 'Retrieval quality shows in the answer' },
    { step: 'Force a missed chunk', expect: 'Poor answer — retrieval bounds quality' },
  ],
  output: [
    'Grounded, cited answers over your documents, with honest "I don\'t know" when unsupported.',
    { file: 'rag-answer.json', lang: 'json', body: `{
  "question": "What is the warranty period?",
  "answer": "The warranty period is 24 months from purchase [manual.pdf p12].",
  "sources": [["manual.pdf", 12]],
  "grounded": true
}` },
    'A grounded answer citing the exact page it came from — verifiable against the source document, not an unsupported guess; an out-of-scope question would return "I don\'t know".',
  ],
  troubleshoot: [
    { sym: 'Wrong/incomplete answers', cause: 'Retrieval missed the chunk', fix: 'Fix chunking/embeddings/top-k; add reranking' },
    { sym: 'Hallucinated facts', cause: 'Weak grounding prompt', fix: 'Instruct answer-from-context-only; cite; lower temperature' },
    { sym: 'Answers when it shouldn\'t', cause: 'No not-found behaviour', fix: 'Threshold similarity; say "I don\'t know"' },
    { sym: 'Citations don\'t match', cause: 'Lost metadata', fix: 'Store source/page with chunks; require citations' },
    { sym: 'Stale answers', cause: 'Index not updated', fix: 'Re-index changed documents (no retraining)' },
    { sym: 'Chunks too big/small', cause: 'Chunking choice', fix: 'Tune chunk size/overlap for specificity vs context' },
  ],

  perf: [
    'Invest in retrieval — it bounds answer quality.',
    'Tune chunking, embeddings, top-k; add reranking.',
    'Ground strictly and require citations to reduce hallucination.',
    'Update by re-indexing; no model retraining needed.',
  ],
  safety: [
    'Grounding reduces but does not eliminate hallucination — keep citations so claims are verifiable.',
    'Answer "I don\'t know" when documents lack the answer, rather than inventing.',
    'Private documents are sensitive — secure the index, access and any LLM API use.',
    'Do not rely on answers for high-stakes decisions without human verification of sources.',
  ],
  maintenance: [
    'Re-index as documents change; keep the corpus current.',
    'Monitor retrieval and grounding quality; iterate.',
    'Update embedding/LLM models as better ones appear.',
    'Audit access to sensitive documents and answers.',
  ],
  future: [
    'Add reranking and hybrid (keyword+semantic) retrieval.',
    'Add multi-hop/agentic retrieval for complex questions.',
    'Add answer-faithfulness checks/guardrails.',
    'Add conversational memory over documents.',
  ],
  faq: [
    { q: 'What problem does RAG solve?', a: 'Two: LLMs don\'t know your private documents, and they hallucinate confident wrong answers. RAG retrieves the relevant passages from your documents and feeds them to the model to answer from — grounding it in real sources and letting it cite them.' },
    { q: 'Why not just fine-tune the model on my documents?', a: 'RAG needs no retraining — knowledge lives in the index, so updating documents is just re-indexing. It is cheaper, faster to update, and provides citations for verification, which fine-tuning does not.' },
    { q: 'Why is retrieval so important?', a: 'Because the generator can only use what it is given. If the right chunk is not retrieved, the answer is incomplete or wrong however capable the LLM. Answer quality is bounded by retrieval quality — most RAG failures are retrieval failures.' },
    { q: 'Does grounding fully stop hallucination?', a: 'No — it strongly reduces it, but the model can still misread the context or stray beyond it. That is why citations (so claims are checkable) and honest "I don\'t know" behaviour are essential parts of the design.' },
    { q: 'What if the answer isn\'t in the documents?', a: 'The system should say "I don\'t know" rather than invent one — thresholding retrieval similarity and instructing the model to only answer from context makes that behaviour reliable.' },
  ],
  refs: [
    { t: 'Retrieval-augmented generation', u: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation', s: 'Reference' },
    { t: 'Vector database', u: 'https://en.wikipedia.org/wiki/Vector_database', s: 'Reference' },
    { t: 'Sentence embeddings', u: 'https://en.wikipedia.org/wiki/Sentence_embedding', s: 'Reference' },
    { t: 'LLM hallucination', u: 'https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)', s: 'Reference' },
    { t: 'FAISS similarity search', u: 'https://github.com/facebookresearch/faiss', s: 'Library' },
  ],
  images: ['neural', 'datacentre', 'cnn'],
  imageCaptions: [
    'RAG lets you chat with your own documents — grounding an LLM in your files so answers cite sources instead of hallucinating.',
    'Documents are chunked and embedded into a vector store; a question retrieves the most relevant passages.',
    'Answer quality is bounded by retrieval — if the right chunk isn\'t found, no LLM can answer well.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A12 — Multilingual Chatbot
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A12',
  domainKey: 'ai',
  emoji: '🗣️', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'A context-aware assistant that converses fluently across Indian languages — understanding, remembering, and replying in the user\'s own tongue.',
  platformName: 'CPU/GPU workstation or server (+ LLM API optional)',
  ide: 'Python 3.11 + multilingual LLM / NLP',

  overview: [
    'India is multilingual by default — hundreds of languages, constant code-switching between English and regional tongues, and hundreds of millions of people far more comfortable in Hindi, Tamil, Bengali or Marathi than in English. A chatbot that only works well in English shuts most of them out. This project builds a <b>multilingual chatbot</b> that converses fluently across Indian languages: it <b>understands</b> the user\'s language, <b>keeps track of the conversation</b>, and <b>replies in the same language</b>, so people can interact naturally in their own tongue.',
    'Two capabilities define it. The first is genuine <b>multilingual understanding and generation</b> — comprehending input and producing fluent replies across many languages, including the very common case of <b>code-switching</b> (mixing English and a regional language, or writing a regional language in Latin script). Modern <b>multilingual language models</b> make this feasible in one model, rather than bolting a translator onto an English bot. The second is <b>context awareness</b>: a real assistant remembers what was said earlier in the conversation, so it can handle follow-ups ("and what about tomorrow?") and multi-turn tasks — the difference between a conversation and a series of disconnected queries.',
    'The value is genuinely inclusive access — services, support and information available to people in the language they actually speak. It is honest about the hard realities of Indian-language NLP: many languages are <b>lower-resource</b> (less training data → weaker fluency and more errors than English), <b>script and transliteration</b> vary (Devanagari vs romanised Hindi), <b>dialects and code-switching</b> are messy, and quality is <b>uneven across languages</b>; and, as with any chatbot, it can be confidently wrong and needs guardrails. Built honestly — a strong multilingual model, real conversation memory, and clear-eyed about the resource gap between languages — it is both a genuinely inclusive assistant and a rich lesson in multilingual, context-aware conversational AI.',
  ],
  does: [
    'Converses fluently across multiple Indian languages',
    'Understands input and replies in the user\'s language',
    'Handles code-switching (mixed English/regional, romanised)',
    'Keeps conversation context across turns (memory)',
    'Handles follow-ups and multi-turn tasks',
    'Makes services accessible in people\'s own tongue',
    'Is honest about uneven quality across languages',
  ],
  features: [
    'Multilingual understanding + generation',
    'Code-switching / transliteration handling',
    'Conversation context/memory',
    'Language detection and matching',
    'Multi-turn task handling',
    'Guardrails for safe replies',
    'Honest about low-resource-language limits',
  ],
  applications: [
    { t: 'Inclusive customer support', d: 'Help users in their own language.' },
    { t: 'Government / public services', d: 'Access to services across languages.' },
    { t: 'Education / information', d: 'Answering questions in regional languages.' },
    { t: 'Commerce / assistants', d: 'Conversational interfaces for all users.' },
  ],
  skills: [
    'Multilingual NLP (understanding + generation)',
    'Code-switching and transliteration handling',
    'Conversation state/memory management',
    'Language detection and response matching',
    'Guardrails and honest quality scoping',
  ],
  prereq: [
    'India is multilingual and code-switches constantly — English-only excludes most people.',
    'Reply in the user\'s language; use a multilingual model, not a translator bolt-on.',
    'Be context-aware: remember the conversation for follow-ups and tasks.',
    'Quality is uneven — many Indian languages are lower-resource than English.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute + LLM', spec: 'CPU/GPU; a multilingual LLM (local or API)', qty: 1, price: 0 },
    { name: 'Multilingual model', spec: 'Model with strong Indian-language coverage', qty: 1, price: 0 },
    { name: 'Language tools', spec: 'Language ID, transliteration handling', qty: 1, price: 0 },
    { name: 'Conversation store', spec: 'Session memory for context', qty: 1, price: 0 },
  ],
  cost: 'Software; compute/API-dependent',
  libs: ['python', 'transformers', 'sentencet', 'fastapi', 'sqlite'],
  hardwareNotes: [
    'This is a pure-software conversational system — no electronic hardware to specify. The "platform" is a computer plus a multilingual language model: a GPU (local model) or a hosted LLM API handles generation, and a CPU handles language detection and session management.',
    'Memory and storage scale with concurrent conversations and retained context; a deployment adds the chat interface and a session store. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the conversation data flow — user text is language-detected, combined with conversation memory, sent to a multilingual model, and the reply is returned in the user\'s language.',
  pins: {
    left: [
      { dev: 'User message', devPin: 'text', pin: '—', sig: 'Any language' },
      { dev: 'Language ID + memory', devPin: 'context', pin: '—', sig: 'Lang + history' },
    ],
    right: [
      { dev: 'Multilingual LLM', devPin: 'generate', pin: '—', sig: 'Reply' },
      { dev: 'Response', devPin: 'reply', pin: '—', sig: 'User\'s language' },
    ],
  },
  wiringNotes: [
    'Detect the user\'s language (including code-switching/romanised input).',
    'Combine the message with conversation memory for context.',
    'Send to a multilingual model that understands and generates the language.',
    'Reply in the user\'s language; update the conversation memory.',
    'Expect uneven quality across languages — lower-resource languages are harder.',
  ],

  block: { columns: [
    { label: 'Understand', edge: 'right', blocks: [
      { name: 'User message', sub: 'any language', highlight: true },
      { name: 'Language ID', sub: 'detect' },
    ] },
    { label: 'Context', edge: 'right', blocks: [
      { name: 'Memory', sub: 'conversation', highlight: true },
    ] },
    { label: 'Generate', edge: 'right', blocks: [
      { name: 'Multilingual LLM', sub: 'reply', highlight: true },
      { name: 'Guardrails', sub: 'safe' },
    ] },
    { label: 'Respond', edge: 'none', blocks: [
      { name: 'Reply', sub: 'user\'s language' },
      { name: 'Update memory', sub: 'context' },
    ] },
  ] },
  flow: [
    { t: 'User sends a message', k: 'start' },
    { t: 'Detect language (+ code-switching)', k: 'proc' },
    { t: 'Add conversation memory (context)', k: 'proc' },
    { t: 'Multilingual model generates reply', k: 'proc' },
    { t: 'Reply safe + in user\'s language?', k: 'dec', yes: 'Send reply; update memory', no: 'Guardrail / clarify' },
    { t: 'Guardrail / clarify', k: 'io' },
    { t: 'Send reply; update memory', k: 'io' },
    { t: 'Await next turn', k: 'end', back: 'User sends a message' },
  ],

  principle: [
    'The case for a multilingual chatbot in India is not a nicety, it is <b>access</b>: a huge share of people are far more comfortable — or only comfortable — in a regional language, and constantly <b>code-switch</b> (Hinglish, romanised Tamil, mixed sentences). An English-only assistant simply excludes them. So the design goal is that a user can speak <b>in their own language, naturally</b>, and be understood and answered in it. Meeting that goal well rests on two capabilities that must both be genuine, not faked.',
    'The first is real <b>multilingual understanding and generation</b>. The naïve approach — translate the user\'s input to English, run an English bot, translate the reply back — is brittle: it loses nuance, mangles code-switched and romanised text, and compounds errors across two translation steps. The better approach uses a <b>multilingual language model</b> that natively understands and generates many languages in <i>one</i> model, so it can handle mixed-language input, transliteration, and idiom directly. This is what makes fluent, natural conversation across languages feasible rather than clunky.',
    'The second is <b>context awareness</b>, which is what separates an <i>assistant</i> from a stateless query box. Real conversation is multi-turn: people ask follow-ups ("and tomorrow?"), refer back ("the first option"), and carry a task across several messages. A useful chatbot therefore maintains <b>memory of the conversation</b> — the history (or a summary of it) that is supplied as context on each turn — so it can resolve references, keep track of the task, and respond coherently over many turns. Without this, every message is an island and the "conversation" is an illusion.',
    'The honesty this project requires is about the <b>uneven reality of Indian-language NLP</b>. Languages differ enormously in <b>resource level</b>: English and major languages like Hindi have abundant training data and strong model quality, while many Indian languages are <b>lower-resource</b>, with less data and correspondingly <b>weaker fluency and more errors</b> — quality is genuinely <b>uneven across languages</b>, and it is dishonest to claim uniform excellence. <b>Script and transliteration</b> add friction (Hindi in Devanagari vs romanised "kya haal hai"), <b>dialects and code-switching</b> are messy and underrepresented in training data, and — as with any LLM chatbot — the model can be <b>confidently wrong</b>, so <b>guardrails</b> and honest handling of uncertainty are needed regardless of language. A well-built system therefore uses a strong multilingual model, maintains real conversation memory, and is <b>transparent about which languages it serves well</b> and where quality drops — degrading gracefully rather than pretending. Built that way, it delivers real inclusive value (natural access to information and services in people\'s own languages) while teaching the substance of multilingual, context-aware conversational AI, resource gaps and all.',
  ],
  equations: [
    { t: 'Understand + respond in-language', eq: 'lang = detect(user_message)         # incl. code-switching/romanised\nreply = multilingual_LLM(context + user_message, target=lang)\n\nReply in the USER\'s language. One multilingual model, not a\ntranslate→English-bot→translate bolt-on.' },
    { t: 'Context (memory) per turn', eq: 'context = history (or summary) of the conversation\nreply_t = LLM(context_{<t} + message_t)\nupdate: history += (message_t, reply_t)\n\nEnables follow-ups/references — a conversation, not islands.' },
    { t: 'Honest quality by resource level', eq: 'quality(lang) ↑ with training data for that language\n  high-resource (English/Hindi) → strong\n  low-resource                  → weaker, more errors\n\nBe transparent; degrade gracefully; add guardrails.' },
  ],

  ai: {
    task: 'Hold fluent, context-aware conversations across multiple Indian languages using a multilingual model with conversation memory, honest about uneven per-language quality.',
    dataset: [
      'A multilingual LLM (pretrained on many languages) provides understanding/generation; Indian-language coverage and code-switching data determine quality.',
      'Optional domain/dialogue data and transliteration resources improve specific languages.',
    ],
    datasetTable: [
      { n: 'Multilingual LLM (pretrained)', size: 'Large', lic: 'Model terms', use: 'Understanding + generation' },
      { n: 'Indian-language coverage', size: 'Uneven', lic: 'Model terms', use: 'Per-language quality' },
      { n: 'Code-switch / romanised data', size: 'Scarcer', lic: 'Varies', use: 'Mixed-language robustness' },
      { n: 'Domain dialogue data', size: 'Optional', lic: 'Yours', use: 'Task/domain tuning' },
    ],
    preprocess: [
      'Detect language (handle romanised/mixed input); normalise script where needed.',
      'Assemble conversation context (history or summary) within the context window.',
      'Apply guardrails/safety filtering to input and output.',
    ],
    pipeline: [
      { name: 'Message', sub: 'any language', highlight: true },
      { name: 'Language ID', sub: 'detect' },
      { name: 'Context', sub: 'memory' },
      { name: 'Multilingual LLM', sub: 'generate', highlight: true },
      { name: 'Reply', sub: 'in-language' },
    ],
    archTable: [
      { l: 'Language ID', s: 'detect + romanised/mixed', p: 'Know the user\'s language' },
      { l: 'Memory', s: 'history / rolling summary', p: 'Context across turns' },
      { l: 'Multilingual model', s: 'one model, many languages', p: 'Understand + reply in-language' },
      { l: 'Guardrails', s: 'safety/uncertainty', p: 'Safe, honest replies' },
      { l: 'Quality map', s: 'per-language expectations', p: 'Transparent, graceful degradation' },
    ],
    hyper: [
      { k: 'Model', v: 'strong multilingual', w: 'Indian-language coverage' },
      { k: 'Context length', v: 'history/summary fit', w: 'Memory vs cost' },
      { k: 'Temperature', v: 'moderate', w: 'Fluency vs reliability' },
      { k: 'Guardrails', v: 'on', w: 'Safety regardless of language' },
    ],
    training: [
      'Primarily use a capable pretrained multilingual model; fine-tune for domain/dialogue if needed.',
      'Add code-switch/romanised and low-resource examples where possible.',
      'Evaluate per language; be transparent about quality differences.',
    ],
    metricsIntro: [
      'Quality must be judged per language, not overall — the honest picture is strong for high-resource languages and weaker for low-resource ones, plus context-handling quality.',
    ],
    metrics: [
      { m: 'Per-language fluency', v: 'uneven (honest)', d: 'High vs low-resource' },
      { m: 'Context handling', v: 'multi-turn', d: 'Follow-ups/references' },
      { m: 'Code-switch robustness', v: 'target', d: 'Mixed/romanised input' },
      { m: 'Safety', v: 'guardrailed', d: 'Across all languages' },
    ],
    chart: { title: 'Quality by language resource level', unit: '%', desc: 'Fluency is strong for high-resource languages and drops for lower-resource ones — the honest reality of Indian-language NLP (illustrative).', bars: [
      { label: 'English', value: 94 },
      { label: 'Hindi', value: 86 },
      { label: 'Major regional', value: 76 },
      { label: 'Low-resource', value: 58 },
    ] },
    inference: { file: 'chatbot.py', lang: 'python', body: `class MultilingualChat:
    def __init__(self, llm, detect):
        self.llm = llm; self.detect = detect
        self.history = []                          # conversation memory

    def reply(self, message):
        lang = self.detect(message)                # incl. code-switching
        context = summarise(self.history)          # context across turns
        prompt = (f"You are a helpful assistant. Reply in the user's "
                  f"language ({lang}). Be honest if unsure.\\n"
                  f"Conversation so far:\\n{context}\\n\\nUser: {message}")
        out = self.llm.generate(prompt)            # multilingual model
        self.history.append((message, out))        # remember the turn
        return out                                 # reply in the user's language
        # Quality is uneven across languages; low-resource langs are weaker.` },
    limits: [
      'Quality is uneven — low-resource Indian languages are weaker than English/Hindi.',
      'Code-switching, dialects and transliteration are messy and underrepresented.',
      'The model can be confidently wrong — guardrails and honesty needed in every language.',
      'A single multilingual model beats a translate-bolt-on, but is not uniformly excellent.',
    ],
  },

  assembly: [
    { h: 'Set up multilingual understanding + generation', p: [
      'Use a strong multilingual model to understand input (including code-switching/romanised) and reply in the user\'s language — one model, not a translate bolt-on.',
    ], warn: 'Quality is genuinely uneven across languages: high-resource languages (English/Hindi) are strong, many Indian languages are lower-resource and weaker. Be transparent about which languages you serve well, degrade gracefully, and guardrail replies in every language.' },
    { h: 'Add conversation memory', p: [
      'Maintain conversation history (or a rolling summary) so the bot handles follow-ups and multi-turn tasks.',
    ] },
    { h: 'Detect language and guardrail', p: [
      'Detect the user\'s language (handling romanised/mixed input), reply in it, and apply safety guardrails.',
    ] },
  ],
  steps: [
    { h: 'Detect language, use context, reply in-language', p: [
      'Detect the user\'s language, add conversation context, and generate a reply in that language with a multilingual model.',
    ], code: {
      file: 'chat.py', lang: 'python',
      body: `class Chat:
    def __init__(self, llm, detect):
        self.llm, self.detect = llm, detect
        self.history = []                          # conversation memory

    def reply(self, message):
        lang = self.detect(message)                # code-switching aware
        context = summarise(self.history)          # context across turns
        prompt = (f"Reply in the user's language ({lang}); be honest if unsure.\\n"
                  f"{context}\\nUser: {message}")
        out = self.llm.generate(prompt)            # multilingual generation
        self.history.append((message, out))        # remember for follow-ups
        return out`,
      explain: [
        { ref: 'lang = self.detect(message)                # code-switching aware', txt: 'Detecting the user\'s language (including mixed/romanised input) lets the bot reply in the tongue they actually used.' },
        { ref: 'context = summarise(self.history)          # context across turns', txt: 'Conversation memory is supplied as context so follow-ups and references resolve — the difference between a conversation and disconnected queries.' },
        { ref: 'out = self.llm.generate(prompt)            # multilingual generation', txt: 'One multilingual model understands and generates the language directly, avoiding the brittle translate-then-English-bot approach.' },
        { ref: 'self.history.append((message, out))        # remember for follow-ups', txt: 'Each turn is remembered so the next turn has context — real multi-turn conversation.' },
      ],
    } },
    { h: 'Guardrail and be transparent about quality', p: [
      'Apply safety guardrails to every language and be transparent where quality drops for lower-resource languages, degrading gracefully.',
    ], tip: 'Prefer one strong multilingual model over translating to English and back — the bolt-on loses nuance, mangles code-switched text, and compounds errors across two translation steps.' },
  ],

  code: [{
    file: 'multilingual_chatbot.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Multilingual Chatbot (context-aware)

Converses across Indian languages: detects the user's language (incl.
code-switching/romanised), keeps CONVERSATION MEMORY for follow-ups,
and replies IN THE USER'S LANGUAGE with a single multilingual model.
Quality is uneven across languages — be transparent and guardrail replies.
"""
class MultilingualChatbot:
    def __init__(self, llm, detect_lang, guard):
        self.llm = llm; self.detect = detect_lang; self.guard = guard
        self.history = []                              # conversation memory

    def reply(self, message):
        if not self.guard.input_ok(message):
            return self.guard.refusal(self.detect(message))

        lang = self.detect(message)                    # code-switching aware
        context = self._context()                       # multi-turn memory
        prompt = (
            "You are a helpful, honest assistant. "
            f"Reply in the user's language ({lang}). If unsure, say so.\\n\\n"
            f"{context}\\nUser: {message}\\nAssistant:")
        out = self.llm.generate(prompt)                 # multilingual generation
        out = self.guard.output_filter(out)             # safety, every language
        self.history.append((message, out))             # remember the turn
        return out                                      # in the user's language

    def _context(self):
        # supply recent history (or a summary) so references/follow-ups work
        recent = self.history[-6:]
        return "\\n".join(f"User: {u}\\nAssistant: {a}" for u, a in recent)

if __name__ == "__main__":
    bot = MultilingualChatbot(MultilingualLLM(), detect_language, Guardrails())
    # bot.reply("kal ka weather kaisa hai?")  # code-switched Hindi/English
    # Serves high-resource languages well; lower-resource langs are weaker —
    # be transparent and degrade gracefully.`,
    explain: [
      { ref: 'if not self.guard.input_ok(message):', txt: 'Guardrails apply to every language, since the model can be confidently wrong or misused regardless of tongue.' },
      { ref: 'lang = self.detect(message)                    # code-switching aware', txt: 'Language detection handles code-switched and romanised input, so the bot replies in the language the user actually used.' },
      { ref: 'context = self._context()                       # multi-turn memory', txt: 'Conversation memory gives the model context, enabling follow-ups and references — a real assistant, not a stateless box.' },
      { ref: 'out = self.llm.generate(prompt)                 # multilingual generation', txt: 'A single multilingual model generates the reply directly, avoiding the lossy translate-to-English-and-back pattern.' },
      { ref: '# be transparent and degrade gracefully.', txt: 'The honest reality — strong for high-resource languages, weaker for low-resource ones — is acknowledged rather than hidden.' },
    ],
  }],

  config: [
    'Configure the multilingual model and supported languages.',
    'Configure language detection (including romanised/mixed input).',
    'Configure conversation memory (history/summary length).',
    'Configure guardrails and per-language quality expectations.',
  ],
  calibration: [
    { h: 'Language coverage', p: [
      'Test understanding/generation per language and code-switching; map quality honestly.',
    ] },
    { h: 'Context', p: [
      'Verify follow-ups and references resolve using memory.',
    ] },
    { h: 'Safety', p: [
      'Check guardrails work across languages, not just English.',
    ] },
  ],
  testing: [
    { step: 'Chat in Hindi', expect: 'Fluent, in-language reply' },
    { step: 'Code-switch (Hinglish)', expect: 'Understood; replies appropriately' },
    { step: 'Ask a follow-up', expect: 'Uses context correctly' },
    { step: 'Chat in a low-resource language', expect: 'Works but weaker — honest quality' },
    { step: 'Romanised regional input', expect: 'Handled (transliteration)' },
    { step: 'Unsafe request', expect: 'Guardrail refuses in-language' },
  ],
  output: [
    'Fluent, context-aware replies in the user\'s language, with honest quality across the resource spectrum.',
    { file: 'chat-turn.json', lang: 'json', body: `{
  "user": "kal ka weather kaisa rahega?",
  "detected_language": "hi (romanised, code-switched)",
  "reply": "कल मौसम साफ़ रहने की संभावना है...",
  "used_context": true,
  "note": "high-resource langs strong; low-resource weaker"
}` },
    'A code-switched, romanised Hindi question understood and answered fluently in Hindi, using conversation context — natural access in the user\'s own language, with honest expectations across languages.',
  ],
  troubleshoot: [
    { sym: 'Replies in the wrong language', cause: 'Detection/instruction', fix: 'Improve language ID; instruct reply-in-user-language' },
    { sym: 'Loses the thread', cause: 'No/short memory', fix: 'Add conversation history/summary as context' },
    { sym: 'Weak in some languages', cause: 'Low-resource', fix: 'Use a stronger multilingual model; be transparent; degrade gracefully' },
    { sym: 'Mangles code-switching', cause: 'Translate bolt-on / poor data', fix: 'Use a native multilingual model; add mixed-language handling' },
    { sym: 'Confidently wrong', cause: 'LLM limitation', fix: 'Guardrails; express uncertainty; ground where possible' },
    { sym: 'Unsafe in non-English', cause: 'English-only guardrails', fix: 'Guardrail across all languages' },
  ],

  perf: [
    'Use one strong multilingual model, not a translate bolt-on.',
    'Maintain conversation memory for real multi-turn dialogue.',
    'Handle code-switching and romanised input in detection.',
    'Be transparent about uneven per-language quality; guardrail all languages.',
  ],
  safety: [
    'The model can be confidently wrong in any language — apply guardrails across all languages, not just English.',
    'Be transparent about which languages are served well; do not claim uniform quality.',
    'Conversations may contain personal data — handle securely and lawfully.',
    'Provide human fallback for high-stakes interactions.',
  ],
  maintenance: [
    'Improve coverage for lower-resource languages over time.',
    'Re-evaluate per-language quality as models improve.',
    'Update guardrails and language detection.',
    'Monitor conversations for failures and drift.',
  ],
  future: [
    'Add speech in/out for spoken multilingual interaction.',
    'Add RAG for grounded, domain-specific answers.',
    'Add more languages/dialects and better code-switching.',
    'Add per-language quality indicators to users.',
  ],
  faq: [
    { q: 'Why not translate to English and use an English bot?', a: 'Because that bolt-on is brittle: it loses nuance, mangles code-switched and romanised text, and compounds errors across two translation steps. A single multilingual model understands and generates the language natively, giving far more fluent, natural conversation.' },
    { q: 'What makes it context-aware?', a: 'It keeps a memory of the conversation (the history or a summary) supplied as context each turn, so it resolves follow-ups and references and carries a task across messages — the difference between a conversation and disconnected queries.' },
    { q: 'Why is quality uneven across languages?', a: 'Because languages differ hugely in training data. English and major languages like Hindi are high-resource and strong; many Indian languages are lower-resource, with less data and correspondingly weaker fluency and more errors. Honesty about this is part of the design.' },
    { q: 'Does it handle Hinglish and romanised text?', a: 'It should — code-switching and romanised regional languages are extremely common in India, so language detection and the model must handle mixed and Latin-script input, though these are messier and less represented in training data.' },
    { q: 'Can I trust its answers?', a: 'As with any LLM chatbot, it can be confidently wrong, so it needs guardrails and honest handling of uncertainty in every language — and a human fallback for high-stakes interactions.' },
  ],
  refs: [
    { t: 'Multilingual NLP', u: 'https://en.wikipedia.org/wiki/Multilingual_natural_language_processing', s: 'Reference' },
    { t: 'Code-switching (linguistics)', u: 'https://en.wikipedia.org/wiki/Code-switching', s: 'Reference' },
    { t: 'Low-resource languages / NLP', u: 'https://en.wikipedia.org/wiki/Low-resource_language', s: 'Reference' },
    { t: 'Large language models', u: 'https://en.wikipedia.org/wiki/Large_language_model', s: 'Reference' },
    { t: 'Languages of India', u: 'https://en.wikipedia.org/wiki/Languages_of_India', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'city'],
  imageCaptions: [
    'A multilingual chatbot lets people converse in their own Indian language — inclusive access, not English-only.',
    'A single multilingual model understands and replies in the user\'s language, handling code-switching natively.',
    'Quality is uneven — high-resource languages are strong, low-resource ones weaker — so honesty and guardrails matter.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A13 — Abstractive Text Summarizer
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A13',
  domainKey: 'ai',
  emoji: '📝', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Condenses long documents into crisp, readable summaries — writing new sentences that capture the essence, not just pasting extracts.',
  platformName: 'CPU/GPU workstation or server (+ LLM API optional)',
  ide: 'Python 3.11 + transformers / LLM',

  overview: [
    'There is far more to read than anyone has time for — reports, articles, threads, transcripts — and the ability to <b>condense a long document into a short, faithful summary</b> is one of the most broadly useful things NLP can do. This project builds an <b>abstractive summarizer</b>: given a long document, it produces a crisp, readable summary that captures the essence. Crucially, it is <b>abstractive</b> — it <i>writes new sentences</i> in its own words, the way a person would, rather than merely stitching together sentences copied from the source.',
    'That abstractive-vs-extractive distinction is the heart of the project. <b>Extractive</b> summarization selects and concatenates the most important existing sentences — safe (every sentence is verbatim from the source) but often choppy and limited. <b>Abstractive</b> summarization, powered by <b>sequence-to-sequence transformer</b> models (or LLMs), <i>generates</i> a summary, paraphrasing, compressing and rephrasing to produce something fluent and genuinely concise — much closer to how a human summarizes. This is more powerful and more natural, but it introduces a risk extractive methods don\'t have.',
    'The value is turning long content into something quickly digestible while preserving meaning. And the honesty is essential and specific: because an abstractive model <b>generates</b> text, it can <b>hallucinate</b> — introduce facts, names or claims that are <i>not in the source</i> — which is uniquely dangerous in a summary, whose entire job is to <b>faithfully represent</b> the original. So <b>faithfulness matters as much as fluency</b>: a summary that reads beautifully but misstates the source is worse than useless. A good summarizer is therefore evaluated not just on readability but on <b>factual consistency with the source</b>, handles very long inputs (chunking), and is used with awareness that the output must be checkable against the original. Built with that faithfulness-first mindset, it is both a genuinely useful tool and a clear lesson in generative NLP and its central risk.',
  ],
  does: [
    'Condenses long documents into short summaries',
    'Writes new sentences (abstractive, not extractive)',
    'Paraphrases and compresses like a human summarizer',
    'Handles long inputs via chunking',
    'Aims for faithfulness to the source, not just fluency',
    'Makes long content quickly digestible',
    'Flags/guards against hallucinated content',
  ],
  features: [
    'Abstractive (generative) summarization',
    'Sequence-to-sequence / LLM models',
    'Long-input handling (chunk + combine)',
    'Faithfulness/factual-consistency focus',
    'Length/style control',
    'Readability + conciseness',
    'Honest about hallucination risk in summaries',
  ],
  applications: [
    { t: 'Document / report digest', d: 'Quick summaries of long documents.' },
    { t: 'News / article summaries', d: 'Condensing articles to the essence.' },
    { t: 'Meeting / transcript notes', d: 'Summarising long transcripts.' },
    { t: 'Research triage', d: 'Skimming papers and reports faster.' },
  ],
  skills: [
    'Abstractive vs extractive summarization',
    'Sequence-to-sequence / LLM summarization',
    'Long-input chunking and combination',
    'Faithfulness / factual-consistency evaluation',
    'Length/style control and prompting',
  ],
  prereq: [
    'Abstractive = writes new sentences; extractive = copies existing ones.',
    'Generation is more natural but can hallucinate content not in the source.',
    'A summary\'s job is to faithfully represent the source — faithfulness ≥ fluency.',
    'Evaluate factual consistency, not just readability.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute + model', spec: 'CPU/GPU; a seq2seq summarizer or LLM (local/API)', qty: 1, price: 0 },
    { name: 'Summarization model', spec: 'Abstractive model (e.g. transformer seq2seq)', qty: 1, price: 0 },
    { name: 'Faithfulness check', spec: 'Factual-consistency evaluation/guardrail', qty: 1, price: 0, note: 'Faithfulness is the key risk' },
    { name: 'Documents', spec: 'Long texts to summarise', qty: 1, price: 0 },
  ],
  cost: 'Software; compute/API-dependent',
  libs: ['python', 'transformers', 'torch', 'numpy'],
  hardwareNotes: [
    'This is a pure-software NLP system — no electronic hardware to specify. The "platform" is a computer plus a summarization model: a GPU (local seq2seq/LLM) or a hosted API handles generation, and a CPU handles chunking and faithfulness checks.',
    'Memory scales with input length and model size; very long documents are chunked to fit the model context. A deployment adds the input/output UI and optional faithfulness-logging. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the summarization data flow — a long document is (chunked and) passed to an abstractive model that generates a concise summary, which is then checked for faithfulness to the source.',
  pins: {
    left: [
      { dev: 'Document', devPin: 'long text', pin: '—', sig: 'Source' },
      { dev: 'Chunk (if long)', devPin: 'split', pin: '—', sig: 'Fit context' },
    ],
    right: [
      { dev: 'Abstractive model', devPin: 'generate', pin: '—', sig: 'Summary' },
      { dev: 'Faithfulness check', devPin: 'verify', pin: '—', sig: 'Consistent?' },
    ],
  },
  wiringNotes: [
    'Provide the long document as input.',
    'Chunk very long inputs to fit the model, then combine partial summaries.',
    'Generate an abstractive summary (new sentences, not extracts).',
    'Check the summary for factual consistency with the source.',
    'Faithfulness matters as much as fluency — a fluent but wrong summary is worse than useless.',
  ],

  block: { columns: [
    { label: 'Input', edge: 'right', blocks: [
      { name: 'Document', sub: 'long', highlight: true },
      { name: 'Chunk', sub: 'if needed' },
    ] },
    { label: 'Summarise', edge: 'right', blocks: [
      { name: 'Abstractive model', sub: 'generate', highlight: true },
      { name: 'Combine', sub: 'chunks' },
    ] },
    { label: 'Verify', edge: 'right', blocks: [
      { name: 'Faithfulness', sub: 'vs source', highlight: true },
    ] },
    { label: 'Output', edge: 'none', blocks: [
      { name: 'Summary', sub: 'crisp+faithful' },
    ] },
  ] },
  flow: [
    { t: 'Take the long document', k: 'start' },
    { t: 'Too long for the model?', k: 'dec', yes: 'Chunk + summarise parts', no: 'Summarise directly' },
    { t: 'Chunk + summarise parts', k: 'proc' },
    { t: 'Summarise directly', k: 'proc' },
    { t: 'Combine into one summary', k: 'proc' },
    { t: 'Faithful to source?', k: 'dec', yes: 'Output summary', no: 'Flag / regenerate' },
    { t: 'Flag / regenerate', k: 'io' },
    { t: 'Output summary', k: 'end', back: 'Take the long document' },
  ],

  principle: [
    'Summarization comes in two fundamentally different flavours, and understanding the difference is the whole conceptual core of this project. <b>Extractive</b> summarization <i>selects</i> the most important sentences from the source and concatenates them — every word in the summary is verbatim from the original. It is safe (it cannot introduce anything false) but limited: the result is often choppy, redundant, and constrained by whatever sentences happen to exist. <b>Abstractive</b> summarization instead <i>generates</i> a summary in <b>new words</b> — paraphrasing, compressing, merging ideas across sentences — the way a person actually summarizes. It is far more fluent, concise and natural, which is why it is the more powerful and more desirable approach.',
    'Abstractive summarization is made possible by <b>sequence-to-sequence</b> models — transformers that read an input sequence (the document) and generate an output sequence (the summary) — and by LLMs, which are exceptional summarizers. These models have learned, from many document–summary pairs, how to identify what matters and re-express it briefly and coherently. The result reads like human writing rather than a collage of extracts, capturing the essence rather than just the highlights.',
    'But generation brings a risk that extraction, by construction, does not have, and it is the defining hazard of the project: <b>hallucination</b>. Because the model produces new text rather than copying, it can introduce <b>facts, figures, names or claims that are simply not in the source</b> — or subtly distort what the source said. In most generation tasks a small invention is a minor flaw; in a <b>summary</b> it is a fundamental failure, because a summary\'s entire purpose is to <b>faithfully represent the original</b>. A summary that adds a statistic the document never mentioned, or flips a conclusion, is actively misleading precisely where the reader is trusting it to be accurate.',
    'This is why the guiding principle of a good summarizer is that <b>faithfulness matters at least as much as fluency</b>. A summary that reads beautifully but misstates the source is worse than a clumsy one that is accurate, because it launders error into confident prose. Consequently, a serious summarizer is evaluated on <b>factual consistency with the source</b> — not just readability metrics — and is designed to minimise hallucination (grounding the model in the source, constraining it, and checking the output against the original). Practically, it must also handle <b>very long inputs</b> that exceed the model\'s context, typically by <b>chunking</b> the document, summarising the parts, and combining them — carefully, since combination can itself introduce errors. And it should offer <b>length/style control</b> and be used with the awareness that its output is a claim <i>about</i> a source that can be checked against it. Built faithfulness-first — abstractive fluency, but disciplined by factual consistency and long-input handling — the summarizer delivers real value (long content made quickly digestible) while teaching the central promise and the central peril of generative NLP.',
  ],
  equations: [
    { t: 'Extractive vs abstractive', eq: 'Extractive:  summary = select+concat(source sentences)\n  → verbatim, safe, but choppy/limited\n\nAbstractive: summary = generate(new sentences)\n  → fluent, concise, human-like — BUT can hallucinate.' },
    { t: 'Abstractive generation', eq: 'summary = seq2seq / LLM (document)\n\nLearned to identify what matters and re-express it briefly.\nReads like human writing, not a collage of extracts.' },
    { t: 'Faithfulness (the key metric)', eq: 'faithful if every claim in summary ⊆ information in source\n\n  hallucination = claim in summary NOT supported by source\n  goal: fluency AND factual consistency\n\nA fluent-but-wrong summary is worse than a clumsy-but-true one.' },
  ],

  ai: {
    task: 'Generate concise, faithful abstractive summaries of long documents with a seq2seq/LLM model, handling long inputs by chunking, and evaluated on factual consistency, not just readability.',
    dataset: [
      'Abstractive models are trained on document–summary pairs; the model is usually pretrained and optionally fine-tuned for domain/length/style.',
      'Faithfulness evaluation uses source–summary consistency checks, not just overlap metrics.',
    ],
    datasetTable: [
      { n: 'Summarization corpora (e.g. CNN/DailyMail, XSum)', size: 'Large', lic: 'Varies', use: 'Train/fine-tune abstractive models' },
      { n: 'Domain document–summary pairs', size: 'Optional', lic: 'Yours', use: 'Domain/style tuning' },
      { n: 'Faithfulness eval set', size: 'Small', lic: 'Yours', use: 'Factual-consistency testing' },
      { n: 'Long-document set', size: 'Targeted', lic: 'Varies', use: 'Chunking/combination' },
    ],
    preprocess: [
      'Clean text; chunk long documents to fit the model context (with overlap).',
      'Optionally set target length/style; segment sections for structured docs.',
      'Prepare source spans for faithfulness checking.',
    ],
    pipeline: [
      { name: 'Document', sub: 'long', highlight: true },
      { name: 'Chunk', sub: 'if long' },
      { name: 'Abstractive model', sub: 'generate', highlight: true },
      { name: 'Combine', sub: 'chunks' },
      { name: 'Faithfulness', sub: 'check' },
    ],
    archTable: [
      { l: 'Seq2seq / LLM', s: 'encoder-decoder or LLM', p: 'Abstractive generation' },
      { l: 'Chunker', s: 'split + overlap', p: 'Handle long inputs' },
      { l: 'Combiner', s: 'summary-of-summaries', p: 'Merge partial summaries' },
      { l: 'Faithfulness check', s: 'consistency scoring', p: 'Detect hallucination' },
      { l: 'Controls', s: 'length/style', p: 'Fit the use case' },
    ],
    hyper: [
      { k: 'Target length', v: 'set', w: 'Conciseness vs coverage' },
      { k: 'Chunk size/overlap', v: 'tuned', w: 'Fit context; keep continuity' },
      { k: 'Temperature', v: 'low', w: 'Faithfulness over creativity' },
      { k: 'Faithfulness threshold', v: 'app-specific', w: 'Flag/regenerate' },
    ],
    training: [
      'Use a strong pretrained abstractive model; fine-tune for domain/length/style if needed.',
      'Optimise for faithfulness (low-temperature, grounded prompting), not just overlap metrics.',
      'Evaluate factual consistency on a held-out set, not only ROUGE.',
    ],
    metricsIntro: [
      'Readability/overlap (e.g. ROUGE) is necessary but not sufficient — factual consistency with the source is the metric that actually matters for a summary.',
    ],
    metrics: [
      { m: 'Factual consistency', v: 'high (key)', d: 'No hallucinated claims' },
      { m: 'Conciseness/coverage', v: 'balanced', d: 'Short yet complete' },
      { m: 'Readability', v: 'fluent', d: 'Human-like prose' },
      { m: 'ROUGE (overlap)', v: 'necessary-not-sufficient', d: 'Not a faithfulness measure' },
    ],
    chart: { title: 'Fluency vs faithfulness', unit: '', desc: 'Abstractive summaries are more fluent than extractive, but faithfulness is the risk to manage — the metric that matters most (illustrative).', bars: [
      { label: 'Extractive fluency', value: 60 },
      { label: 'Abstractive fluency', value: 92 },
      { label: 'Extractive faithfulness', value: 98 },
      { label: 'Abstractive faithfulness', value: 78 },
    ] },
    inference: { file: 'summarize.py', lang: 'python', body: `def summarize(document, model, max_len=150):
    if too_long(document):                     # exceeds model context
        parts = [model.summarize(c, max_len//2)  # summarise each chunk
                 for c in chunk(document)]
        draft = model.summarize(" ".join(parts), max_len)  # combine
    else:
        draft = model.summarize(document, max_len)          # abstractive

    # FAITHFULNESS is the point: a fluent-but-wrong summary is worse than none.
    score = factual_consistency(draft, document)   # claims supported by source?
    if score < FAITHFUL_MIN:
        draft = model.summarize(document, max_len, grounded=True)  # tighten
    return {"summary": draft, "faithfulness": score}
    # Evaluate factual consistency, not just readability.` },
    limits: [
      'Abstractive models can hallucinate content not in the source — uniquely bad in a summary.',
      'Faithfulness matters as much as fluency; evaluate factual consistency, not just overlap.',
      'Very long inputs need chunking, and combination can itself introduce errors.',
      'Output must be checkable against the source; do not trust blindly.',
    ],
  },

  assembly: [
    { h: 'Set up abstractive summarization', p: [
      'Use a seq2seq/LLM model to generate summaries in new words, with length/style control.',
    ], warn: 'Abstractive models generate text, so they can hallucinate facts not in the source — uniquely dangerous in a summary, whose job is to faithfully represent the original. Treat faithfulness as at least as important as fluency, and evaluate factual consistency, not just readability.' },
    { h: 'Handle long inputs', p: [
      'Chunk very long documents, summarise the parts, and combine carefully.',
    ] },
    { h: 'Check faithfulness', p: [
      'Evaluate the summary\'s factual consistency with the source, and regenerate/flag if it strays.',
    ] },
  ],
  steps: [
    { h: 'Summarise abstractively, then check faithfulness', p: [
      'Generate an abstractive summary (chunking if long) and verify it is factually consistent with the source.',
    ], code: {
      file: 'summarize.py', lang: 'python',
      body: `FAITHFUL_MIN = 0.8

def summarize(document, model, max_len=150):
    if too_long(document):
        parts = [model.summarize(c, max_len//2) for c in chunk(document)]  # long
        draft = model.summarize(" ".join(parts), max_len)                  # combine
    else:
        draft = model.summarize(document, max_len)     # abstractive: new sentences

    score = factual_consistency(draft, document)       # faithfulness, not just fluency
    if score < FAITHFUL_MIN:
        draft = model.summarize(document, max_len, grounded=True)  # tighten to source
    return {"summary": draft, "faithfulness": round(score, 2)}`,
      explain: [
        { ref: 'parts = [model.summarize(c, max_len//2) for c in chunk(document)]  # long', txt: 'Very long inputs are chunked and summarised piecewise, then combined, so documents beyond the model\'s context can still be handled.' },
        { ref: 'draft = model.summarize(document, max_len)     # abstractive: new sentences', txt: 'The summary is generated in new words — abstractive, fluent, human-like — not a collage of extracted sentences.' },
        { ref: 'score = factual_consistency(draft, document)       # faithfulness, not just fluency', txt: 'The summary is scored for factual consistency with the source — the metric that actually matters, since a fluent but wrong summary is worse than useless.' },
        { ref: 'draft = model.summarize(document, max_len, grounded=True)  # tighten to source', txt: 'If faithfulness is low the summary is regenerated more tightly grounded in the source, guarding against hallucination.' },
      ],
    } },
    { h: 'Control length/style and keep it checkable', p: [
      'Offer length/style control and present the summary as a claim about the source that can be verified against it.',
    ], tip: 'Optimise and evaluate for factual consistency, not just ROUGE/readability — overlap metrics reward wording similarity but do not catch a fluent summary that misstates the source.' },
  ],

  code: [{
    file: 'summarizer.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Abstractive Text Summarizer

Generates crisp, readable summaries in NEW words (abstractive), not
extracts. Handles long inputs by chunking + combining. Because it
GENERATES text it can hallucinate — so FAITHFULNESS (factual consistency
with the source) matters as much as fluency and is checked, not assumed.
"""
FAITHFUL_MIN = 0.8

class Summarizer:
    def __init__(self, model, checker):
        self.model = model            # seq2seq / LLM (abstractive)
        self.checker = checker        # factual-consistency scorer

    def summarize(self, document, max_len=150, style=None):
        if too_long(document):                         # exceeds model context
            partials = [self.model.summarize(c, max_len // 2)
                        for c in chunk(document, overlap=True)]   # per chunk
            draft = self.model.summarize(" ".join(partials), max_len, style)
        else:
            draft = self.model.summarize(document, max_len, style)  # abstractive

        # FAITHFULNESS FIRST: a fluent but inaccurate summary is worse than none.
        score = self.checker.consistency(draft, document)
        if score < FAITHFUL_MIN:
            draft = self.model.summarize(document, max_len, style,
                                         grounded=True)   # tighten to source
            score = self.checker.consistency(draft, document)
        return {"summary": draft, "faithfulness": round(score, 2)}

if __name__ == "__main__":
    s = Summarizer(AbstractiveModel(), FaithfulnessChecker())
    print(s.summarize(load_text("report.txt"), max_len=120))
    # Evaluate factual consistency, not just readability; verify vs the source.`,
    explain: [
      { ref: 'partials = [self.model.summarize(c, max_len // 2)', txt: 'Long documents are chunked (with overlap) and summarised piecewise before combining, so inputs beyond the model context are handled.' },
      { ref: 'draft = self.model.summarize(document, max_len, style)  # abstractive', txt: 'Summaries are generated in new words with length/style control — abstractive, not extractive.' },
      { ref: '# FAITHFULNESS FIRST: a fluent but inaccurate summary is worse than none.', txt: 'The design puts faithfulness ahead of fluency — the defining principle of a trustworthy summarizer.' },
      { ref: 'if score < FAITHFUL_MIN:', txt: 'A low factual-consistency score triggers a tighter, source-grounded regeneration — guarding against the hallucination risk unique to abstractive generation.' },
      { ref: '# Evaluate factual consistency, not just readability; verify vs the source.', txt: 'The output is a claim about the source that should be checked against it — stated in the code.' },
    ],
  }],

  config: [
    'Configure the abstractive model, target length and style.',
    'Configure chunking/combination for long inputs.',
    'Configure the faithfulness/factual-consistency check and threshold.',
    'Configure grounded regeneration on low faithfulness.',
  ],
  calibration: [
    { h: 'Faithfulness', p: [
      'Evaluate factual consistency on a held-out set; tune grounding/temperature to reduce hallucination.',
    ] },
    { h: 'Length/coverage', p: [
      'Balance conciseness against covering the key points.',
    ] },
    { h: 'Long inputs', p: [
      'Verify chunking/combination preserves meaning without introducing errors.',
    ] },
  ],
  testing: [
    { step: 'Summarise a short article', expect: 'Crisp, fluent, faithful summary' },
    { step: 'Check facts vs source', expect: 'No claims absent from the source' },
    { step: 'Summarise a very long document', expect: 'Chunked/combined; still coherent' },
    { step: 'Force low faithfulness', expect: 'Regenerated more grounded' },
    { step: 'Compare to extractive', expect: 'More fluent; watch faithfulness' },
    { step: 'Set a shorter length', expect: 'Shorter yet still faithful' },
  ],
  output: [
    'Concise, fluent summaries checked for faithfulness to the source.',
    { file: 'summary.json', lang: 'json', body: `{
  "length_words": 118,
  "summary": "The report finds regional demand rose in Q2, driven mainly by ...",
  "faithfulness": 0.91,
  "note": "abstractive; verify claims against the source"
}` },
    'A crisp abstractive summary with a high faithfulness score — fluent and genuinely concise, while checked for factual consistency so it represents the source rather than embellishing it.',
  ],
  troubleshoot: [
    { sym: 'Invents facts', cause: 'Hallucination', fix: 'Ground to source; lower temperature; add faithfulness check/regeneration' },
    { sym: 'Fluent but inaccurate', cause: 'Optimising fluency/overlap only', fix: 'Evaluate factual consistency, not just ROUGE' },
    { sym: 'Misses key points', cause: 'Too short/poor coverage', fix: 'Adjust length; ensure salient content included' },
    { sym: 'Choppy/extractive feel', cause: 'Extractive method', fix: 'Use an abstractive seq2seq/LLM model' },
    { sym: 'Fails on long docs', cause: 'Context limit', fix: 'Chunk and combine carefully' },
    { sym: 'Combination errors', cause: 'Merging partials', fix: 'Overlap chunks; summarise-of-summaries carefully; re-check faithfulness' },
  ],

  perf: [
    'Optimise and evaluate for faithfulness, not just fluency/overlap.',
    'Ground to the source and use low temperature to cut hallucination.',
    'Chunk and combine long inputs carefully.',
    'Offer length/style control; keep output checkable.',
  ],
  safety: [
    'Abstractive summaries can hallucinate — never trust a summary of high-stakes content without verifying against the source.',
    'Faithfulness matters as much as fluency; a fluent but wrong summary is actively misleading.',
    'Documents may be sensitive — handle securely and lawfully.',
    'Present summaries as claims about a source that can and should be checked.',
  ],
  maintenance: [
    'Re-evaluate faithfulness as models/data change.',
    'Tune chunking/combination for new document types.',
    'Update the model for better quality/faithfulness.',
    'Monitor for hallucination in real use.',
  ],
  future: [
    'Add citation/grounding to source spans in the summary.',
    'Add query-focused and multi-document summarization.',
    'Add stronger automatic faithfulness checking.',
    'Add controllable abstraction level (extractive↔abstractive).',
  ],
  faq: [
    { q: 'What is abstractive vs extractive summarization?', a: 'Extractive selects and concatenates existing sentences (verbatim, safe, but choppy). Abstractive generates a summary in new words — paraphrasing and compressing like a human — which is more fluent and natural, but can introduce content not in the source.' },
    { q: 'Why is hallucination especially bad in a summary?', a: 'Because a summary\'s whole job is to faithfully represent the original. A summary that adds a fact the document never mentioned, or flips a conclusion, is actively misleading exactly where the reader trusts it to be accurate.' },
    { q: 'How do you make it faithful?', a: 'By treating faithfulness as at least as important as fluency: grounding the model in the source, using low temperature, evaluating factual consistency (not just readability/ROUGE), and regenerating or flagging when the summary strays from the source.' },
    { q: 'How does it handle very long documents?', a: 'By chunking the input to fit the model, summarising the parts, and combining them — carefully, since the combination step can itself introduce errors, so faithfulness is re-checked.' },
    { q: 'Can I trust the summary without reading the source?', a: 'For low-stakes content, largely yes; for anything important, no — the summary is a claim about the source that should be verifiable against it, and abstractive output can occasionally misstate the original.' },
  ],
  refs: [
    { t: 'Automatic summarization', u: 'https://en.wikipedia.org/wiki/Automatic_summarization', s: 'Reference' },
    { t: 'Abstractive vs extractive', u: 'https://en.wikipedia.org/wiki/Automatic_summarization#Abstractive-based_summarization', s: 'Reference' },
    { t: 'Sequence-to-sequence models', u: 'https://en.wikipedia.org/wiki/Seq2seq', s: 'Reference' },
    { t: 'Faithfulness / hallucination', u: 'https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)', s: 'Reference' },
    { t: 'ROUGE metric', u: 'https://en.wikipedia.org/wiki/ROUGE_(metric)', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'cnn'],
  imageCaptions: [
    'An abstractive summarizer condenses long documents into crisp summaries written in new words, like a person.',
    'Abstractive generation is more fluent than extractive — but can hallucinate content not in the source.',
    'Faithfulness matters as much as fluency: a summary must represent the source, so factual consistency is checked.',
  ],
},

];
