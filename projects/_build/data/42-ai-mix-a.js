/* AI — A08 (OCR) + A09–A10 (NLP). Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   A08 — Handwriting & OCR Engine
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A08',
  domainKey: 'ai',
  emoji: '✍️', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Recognises handwritten digits and text and turns pages of writing into editable text — from the classic MNIST digit to full-page OCR.',
  platformName: 'GPU workstation or edge; CPU fine for inference',
  ide: 'Python 3.11 + PyTorch / OCR',

  overview: [
    'Turning an image of writing into editable, searchable text — <b>optical character recognition (OCR)</b> — is one of the oldest and most useful applications of machine vision, digitising forms, notes, historical documents and mail. This project builds an OCR engine that spans the whole ladder: from recognising a single <b>handwritten digit</b> (the famous <b>MNIST</b> problem that launched a thousand ML careers) up to reading <b>lines and pages</b> of handwritten or printed text and outputting them as editable text. It is the canonical way to learn image classification and then see how real OCR composes that skill into a document pipeline.',
    'The foundation is <b>classifying a single character</b>. MNIST — 28×28 images of handwritten digits 0–9 — is the "hello world" of deep learning: a small <b>convolutional neural network</b> learns to map each image to its digit with very high accuracy, teaching the core mechanics of training a classifier. But real text is not pre-segmented single characters, so full OCR adds the surrounding pipeline: <b>detecting and segmenting</b> lines, words and characters from a page, <b>recognising</b> each (single characters, or whole sequences with a sequence model that avoids brittle per-character cutting), and <b>post-processing</b> with a dictionary/language model to fix errors (turning "recognise" from "recogmse").',
    'The value is a working document-digitisation tool and a complete, layered lesson: single-character classification, then sequence recognition, then a full page pipeline. It is honest that <b>handwriting is much harder than print</b> (enormous variation between and within writers, cursive, messy layouts), that engine accuracy depends heavily on <b>image quality</b> (resolution, contrast, skew), and that a benchmark digit-classifier is a long way from robust page OCR. Built honestly — mastering the MNIST core, then composing detection, sequence recognition and language post-processing — it delivers both a genuinely useful OCR engine and the clearest possible progression from a toy classifier to a real applied-vision system.',
  ],
  does: [
    'Recognises handwritten digits (MNIST) with a CNN',
    'Reads lines and pages of handwritten/printed text',
    'Segments text into lines/words/characters',
    'Recognises character sequences (avoiding brittle cutting)',
    'Post-processes with a dictionary/language model',
    'Outputs editable, searchable text from images',
    'Progresses from single-character to full-page OCR',
  ],
  features: [
    'MNIST digit classification (CNN core)',
    'Text detection/segmentation',
    'Sequence recognition (line/word)',
    'Language-model post-processing',
    'Handwriting and print support',
    'Editable text output',
    'Honest about handwriting difficulty and image quality',
  ],
  applications: [
    { t: 'Document digitisation', d: 'Converting forms, notes and pages to editable text.' },
    { t: 'Data entry automation', d: 'Reading handwritten fields and figures.' },
    { t: 'Archival / search', d: 'Making scanned documents searchable.' },
    { t: 'ML education', d: 'MNIST → sequence OCR as a learning progression.' },
  ],
  skills: [
    'CNN image classification (MNIST)',
    'Text detection and segmentation',
    'Sequence recognition (CTC/seq2seq)',
    'Language-model post-processing',
    'OCR pipeline composition and evaluation',
  ],
  prereq: [
    'Start with single-character classification (MNIST) — the core skill.',
    'Real text needs segmentation + sequence recognition, not just single chars.',
    'Post-process with a dictionary/language model to fix errors.',
    'Handwriting is far harder than print; image quality matters a lot.',
  ],

  parts: ['picam'],
  extraParts: [
    { name: 'Compute', spec: 'GPU for training; CPU fine for inference', qty: 1, price: 0 },
    { name: 'MNIST + text datasets', spec: 'MNIST for digits; line/page datasets (e.g. IAM) for text', qty: 1, price: 0 },
    { name: 'Scanner/camera', spec: 'For capturing documents (quality matters)', qty: 1, price: 0 },
    { name: 'OCR/sequence libs', spec: 'CNN + sequence-recognition + language model', qty: 1, price: 0 },
  ],
  cost: 'Software; compute-dependent',
  libs: ['python', 'torch', 'opencv', 'numpy', 'sklearn'],

  wiringIntro: 'The "wiring" is the OCR pipeline data flow — a document image is segmented into text regions, each recognised (character or sequence), then corrected by a language model into editable text.',
  pins: {
    left: [
      { dev: 'Document image', devPin: 'scan/photo', pin: '—', sig: 'Page/line input' },
      { dev: 'Segmentation', devPin: 'detect', pin: '—', sig: 'Lines/words/chars' },
    ],
    right: [
      { dev: 'Recogniser (CNN/seq)', devPin: 'read', pin: '—', sig: 'Characters/text' },
      { dev: 'LM post-process', devPin: 'correct', pin: '—', sig: 'Editable text' },
    ],
  },
  wiringNotes: [
    'A scanner/camera provides the document image (quality strongly affects accuracy).',
    'Segment the page into lines/words/characters (or feed whole lines to a sequence model).',
    'Recognise digits/characters with a CNN, or sequences with a sequence recogniser.',
    'Post-process with a dictionary/language model to correct errors.',
    'Output editable, searchable text.',
  ],

  block: { columns: [
    { label: 'Input', edge: 'right', blocks: [
      { name: 'Document', sub: 'scan/photo', highlight: true },
    ] },
    { label: 'Segment', edge: 'right', blocks: [
      { name: 'Detect text', sub: 'lines/words' },
      { name: '(or whole line)', sub: 'sequence' },
    ] },
    { label: 'Recognise', edge: 'right', blocks: [
      { name: 'CNN', sub: 'char (MNIST)', highlight: true },
      { name: 'Sequence model', sub: 'line/word' },
    ] },
    { label: 'Correct', edge: 'none', blocks: [
      { name: 'Language model', sub: 'fix errors' },
      { name: 'Editable text', sub: 'output' },
    ] },
  ] },
  flow: [
    { t: 'Capture/scan the document', k: 'start' },
    { t: 'Detect/segment text regions', k: 'proc' },
    { t: 'Single characters or sequences?', k: 'dec', yes: 'CNN per character', no: 'Sequence recognition' },
    { t: 'CNN per character', k: 'proc' },
    { t: 'Sequence recognition', k: 'proc' },
    { t: 'Language-model post-process', k: 'proc' },
    { t: 'Output editable text', k: 'end', back: 'Capture/scan the document' },
  ],

  principle: [
    'OCR is best understood as a <b>ladder</b>, and the bottom rung is the whole of classical deep-learning pedagogy: <b>classify one character</b>. The <b>MNIST</b> dataset — tens of thousands of 28×28 handwritten digits — is the "hello world" of neural networks precisely because it isolates that core problem cleanly. A small <b>convolutional neural network</b> learns to recognise the visual features of each digit (loops, strokes, junctions) and map an image to one of ten classes with very high accuracy. Building and training that classifier teaches every fundamental — convolutions, pooling, a softmax output, a loss, gradient descent — in a problem simple enough to master, which is why it is the universal starting point.',
    'The leap from MNIST to real OCR is the leap from a <b>pre-segmented single character</b> to a <b>page of connected text</b>, and it introduces the two things MNIST hides. The first is <b>segmentation/detection</b>: a real document must be broken into lines, then words, then possibly characters, before anything can be recognised — and doing this reliably (handling spacing, skew, touching characters) is a substantial problem in itself. The second is that per-character cutting is <b>brittle</b> — characters touch, overlap, and vary in width — so modern OCR often skips it, feeding a <b>whole line image to a sequence recogniser</b> (a CNN+RNN with a CTC loss, or a sequence-to-sequence model) that reads the line as a sequence of characters without needing them pre-cut. This sequence approach is what makes robust line/word recognition possible.',
    'The third rung is <b>language-aware post-processing</b>, and it is what separates a raw recogniser from a usable OCR engine. Visual recognition alone makes errors that are obvious in <i>linguistic</i> context: it might read "recognise" as "recogmse" or "0" for "O". A <b>dictionary or language model</b> corrects these by preferring valid, likely words and sequences — using the statistics of the language to fix what the pixels got wrong. This is why real OCR is a vision <i>and</i> language system: the image proposes, the language model disposes, and the combination is far more accurate than either alone.',
    'The honesty this project needs centres on the gulf between a benchmark and a robust tool. <b>Printed text is comparatively easy</b>; <b>handwriting is genuinely hard</b>, because of the vast variation <i>between</i> writers (everyone\'s hand is different) and even <i>within</i> a writer (the same person\'s "a" varies), plus cursive connection, messy layouts, and idiosyncratic shapes — a digit classifier that aces MNIST is a long way from reading a doctor\'s scrawl. Accuracy also depends heavily on <b>image quality</b>: resolution, contrast, lighting, skew and noise all degrade recognition, so scanning/deskewing/binarising the input matters as much as the model. And a real engine must handle layout, mixed fonts, and languages. Framed as a ladder — master the MNIST CNN core, add segmentation and sequence recognition, then language post-processing — the project delivers a genuinely useful digitisation engine while teaching, rung by rung, how a real applied-vision system is composed from a simple classifier.',
  ],
  equations: [
    { t: 'Single-character classification (MNIST)', eq: 'CNN(28×28 image) → probabilities over {0..9}\n  digit = argmax(probs)\n\nThe core: learn visual features → class. The "hello world"\nof deep learning.' },
    { t: 'Sequence recognition (no cutting)', eq: 'Feed a whole LINE image to a sequence model:\n\n  CNN features → RNN/transformer → char sequence\n  trained with CTC (align without pre-segmenting chars)\n\nAvoids brittle per-character cutting — robust to touching\n/overlapping characters.' },
    { t: 'Language-model correction', eq: 'raw = recogniser(image)          # pixels propose\ntext = argmax_w  P(w | raw) · P(w)  # language disposes\n  (dictionary / n-gram / LM prior over valid words)\n\n"recogmse" → "recognise". Vision + language > either alone.' },
  ],

  ai: {
    task: 'Recognise handwritten/printed text from images — from single MNIST digits to full lines/pages — via CNN classification, sequence recognition, and language-model post-processing.',
    dataset: [
      'MNIST for the digit-classification core; line/page datasets (e.g. IAM handwriting) for sequence OCR; printed-text corpora for print.',
      'Handwriting variation and image quality in the data shape real-world accuracy.',
    ],
    datasetTable: [
      { n: 'MNIST', size: '70k digit images', lic: 'Open', use: 'Single-character CNN core' },
      { n: 'EMNIST', size: 'Letters+digits', lic: 'Open', use: 'Extend to characters' },
      { n: 'IAM handwriting', size: 'Lines/forms', lic: 'Research (register)', use: 'Sequence OCR (handwriting)' },
      { n: 'Language corpus/dictionary', size: 'Large', lic: 'Varies', use: 'Post-processing / LM' },
    ],
    preprocess: [
      'Deskew, binarise, normalise and denoise the document image.',
      'Segment lines/words (or feed whole lines to a sequence model).',
      'Normalise character/line size; augment (rotation, elastic distortion) for robustness.',
    ],
    pipeline: [
      { name: 'Document', sub: 'scan/photo', highlight: true },
      { name: 'Segment', sub: 'lines/words' },
      { name: 'Recognise', sub: 'CNN / seq', highlight: true },
      { name: 'LM correct', sub: 'dictionary' },
      { name: 'Text', sub: 'editable' },
    ],
    archTable: [
      { l: 'Char CNN (MNIST)', s: 'conv+pool+softmax', p: 'Single-character classification' },
      { l: 'Sequence recogniser', s: 'CNN+RNN + CTC', p: 'Read lines without cutting chars' },
      { l: 'Segmentation', s: 'line/word detection', p: 'Break page into text' },
      { l: 'Language model', s: 'dictionary / n-gram / LM', p: 'Correct recognition errors' },
      { l: 'Pre-processing', s: 'deskew/binarise', p: 'Quality → accuracy' },
    ],
    hyper: [
      { k: 'Input size', v: '28×28 (MNIST) / line H', w: 'Model input' },
      { k: 'CTC blank/decoding', v: 'beam width', w: 'Sequence decoding quality' },
      { k: 'Augmentation', v: 'elastic/rotate', w: 'Handwriting robustness' },
      { k: 'LM weight', v: 'app-specific', w: 'Vision vs language trust' },
    ],
    training: [
      'Train the CNN on MNIST/EMNIST for the character core; train the sequence recogniser on line data with CTC.',
      'Augment for handwriting variation; validate on held-out writers.',
      'Tune language-model post-processing on realistic text.',
    ],
    metricsIntro: [
      'Digit accuracy for MNIST; character error rate (CER) and word error rate (WER) for text — with handwriting far harder than print.',
    ],
    metrics: [
      { m: 'MNIST accuracy', v: 'very high', d: 'Single-digit core' },
      { m: 'Character error rate', v: 'text-dependent', d: 'Lower = better' },
      { m: 'Word error rate', v: 'text-dependent', d: 'With LM post-processing' },
      { m: 'Handwriting vs print', v: 'handwriting harder', d: 'Honest gap' },
    ],
    chart: { title: 'Difficulty up the OCR ladder', unit: '%', desc: 'Accuracy falls as you climb from single digits to messy handwritten pages — each rung adds difficulty (illustrative).', bars: [
      { label: 'MNIST digits', value: 99 },
      { label: 'Printed text', value: 96 },
      { label: 'Neat handwriting', value: 85 },
      { label: 'Messy handwriting', value: 62 },
    ] },
    inference: { file: 'ocr.py', lang: 'python', body: `import torch, torch.nn.functional as F

def classify_digit(img28, cnn):               # MNIST core
    with torch.no_grad():
        probs = F.softmax(cnn(img28[None]), dim=1)[0]
    return int(probs.argmax()), float(probs.max())

def read_line(line_img, seq_model, lm):       # real OCR: no char cutting
    raw = seq_model.recognise(line_img)       # CNN+RNN+CTC over the line
    text = lm.correct(raw)                     # dictionary/LM fixes errors
    return text                                # "recogmse" -> "recognise"

def ocr_page(image, segmenter, seq_model, lm):
    lines = segmenter.lines(deskew(binarise(image)))   # quality preprocessing
    return "\\n".join(read_line(l, seq_model, lm) for l in lines)
    # Handwriting is far harder than print; image quality matters a lot.` },
    limits: [
      'Handwriting is much harder than print (between/within-writer variation, cursive).',
      'Accuracy depends heavily on image quality (resolution, contrast, skew, noise).',
      'A benchmark digit classifier is far from robust page OCR.',
      'Layout, mixed fonts and languages add real complexity.',
    ],
  },

  assembly: [
    { h: 'Master the MNIST character core', p: [
      'Train a CNN to classify MNIST digits (and EMNIST characters) — the fundamental skill the whole engine builds on.',
    ], warn: 'Handwriting is far harder than print, and accuracy depends heavily on image quality. A model that aces MNIST is a long way from robust page OCR — deskew, binarise and denoise inputs, and validate on real, varied handwriting.' },
    { h: 'Add segmentation and sequence recognition', p: [
      'Segment pages into lines/words, and recognise lines with a sequence model (CNN+RNN+CTC) rather than brittle per-character cutting.',
    ] },
    { h: 'Add language post-processing', p: [
      'Correct raw recognition with a dictionary/language model, and output editable text.',
    ] },
  ],
  steps: [
    { h: 'Classify a character, then read a line', p: [
      'Show the MNIST core (single-character classification) and the real-OCR line recogniser plus language correction.',
    ], code: {
      file: 'recognise.py', lang: 'python',
      body: `import torch, torch.nn.functional as F

# --- Rung 1: the MNIST core (single-character classification) ---
def classify_digit(img28, cnn):
    with torch.no_grad():
        probs = F.softmax(cnn(img28[None]), dim=1)[0]
    return int(probs.argmax()), float(probs.max())        # digit + confidence

# --- Rung 2-3: real OCR line (sequence recognition + language model) ---
def read_line(line_img, seq_model, lm):
    raw = seq_model.recognise(line_img)   # whole line, no per-char cutting
    return lm.correct(raw)                # dictionary/LM fixes visual errors`,
      explain: [
        { ref: 'def classify_digit(img28, cnn):', txt: 'The MNIST core — mapping one image to one of ten digits — is the fundamental classification skill everything else builds on.' },
        { ref: 'raw = seq_model.recognise(line_img)   # whole line, no per-char cutting', txt: 'Real OCR feeds a whole line to a sequence model, avoiding brittle character cutting that fails on touching/overlapping text.' },
        { ref: 'return lm.correct(raw)                # dictionary/LM fixes visual errors', txt: 'A language model corrects errors the pixels got wrong — vision proposes, language disposes.' },
      ],
    } },
    { h: 'Compose the page pipeline', p: [
      'Preprocess (deskew/binarise), segment lines, recognise and correct each, and assemble editable text.',
    ], tip: 'Invest in preprocessing: deskewing, binarising and denoising a page often improves accuracy more than a bigger model — image quality is half the battle in OCR.' },
  ],

  code: [{
    file: 'ocr_engine.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Handwriting & OCR Engine

A ladder: (1) a CNN classifies single characters (the MNIST core);
(2) segmentation + a sequence recogniser read lines without brittle
character cutting; (3) a language model corrects errors into editable
text. Handwriting is far harder than print; image quality matters a lot.
"""
import torch, torch.nn as nn, torch.nn.functional as F

class DigitCNN(nn.Module):                     # the MNIST core
    def __init__(self):
        super().__init__()
        self.c1 = nn.Conv2d(1, 32, 3); self.c2 = nn.Conv2d(32, 64, 3)
        self.fc1 = nn.Linear(64*5*5, 128); self.fc2 = nn.Linear(128, 10)
    def forward(self, x):
        x = F.max_pool2d(F.relu(self.c1(x)), 2)
        x = F.max_pool2d(F.relu(self.c2(x)), 2)
        x = x.flatten(1)
        return self.fc2(F.relu(self.fc1(x)))   # logits over 10 digits

class OCREngine:
    def __init__(self, seq_model, lm):
        self.seq = seq_model; self.lm = lm     # line recogniser + language model

    def read_line(self, line_img):
        raw = self.seq.recognise(line_img)     # sequence recognition (no cutting)
        return self.lm.correct(raw)            # language-model post-processing

    def read_page(self, image):
        clean = deskew(binarise(denoise(image)))   # quality preprocessing FIRST
        lines = segment_lines(clean)                # detect/segment text
        return "\\n".join(self.read_line(l) for l in lines)   # editable text

if __name__ == "__main__":
    # Rung 1: train DigitCNN on MNIST (the classic core).
    # Rung 2-3: OCREngine composes sequence recognition + LM into page OCR.
    engine = OCREngine(SequenceRecogniser(), LanguageModel())
    print(engine.read_page(load_image("note.png")))
    # Print is easier; handwriting is hard; scan quality strongly matters.`,
    explain: [
      { ref: 'class DigitCNN(nn.Module):                     # the MNIST core', txt: 'The digit CNN is the fundamental classifier — the "hello world" that teaches convolutions, pooling and softmax classification.' },
      { ref: 'raw = self.seq.recognise(line_img)     # sequence recognition (no cutting)', txt: 'Lines are read as sequences, avoiding the brittle character segmentation that breaks on real text.' },
      { ref: 'return self.lm.correct(raw)            # language-model post-processing', txt: 'The language model corrects visually-plausible mistakes using the statistics of the language — the step that makes OCR usable.' },
      { ref: 'clean = deskew(binarise(denoise(image)))   # quality preprocessing FIRST', txt: 'Quality preprocessing comes first because image quality is half of OCR accuracy — often more impactful than model size.' },
    ],
  }],

  config: [
    'Configure the character CNN (MNIST/EMNIST) and the sequence recogniser.',
    'Configure segmentation and preprocessing (deskew/binarise/denoise).',
    'Configure the dictionary/language model for post-processing.',
    'Configure output format (editable/searchable text).',
  ],
  calibration: [
    { h: 'Character core', p: [
      'Verify high MNIST/EMNIST accuracy before building up.',
    ] },
    { h: 'Sequence + LM', p: [
      'Tune CTC decoding and language-model weighting on realistic lines.',
    ] },
    { h: 'Preprocessing', p: [
      'Ensure deskew/binarise/denoise materially improve real-page accuracy.',
    ] },
  ],
  testing: [
    { step: 'Classify MNIST digits', expect: 'Very high accuracy' },
    { step: 'OCR printed text', expect: 'Accurate editable text' },
    { step: 'OCR neat handwriting', expect: 'Good, with some errors' },
    { step: 'OCR messy handwriting', expect: 'Harder — note the difficulty' },
    { step: 'Low-quality/skewed scan', expect: 'Preprocessing recovers much accuracy' },
    { step: 'Language post-processing on/off', expect: 'LM corrects visual errors' },
  ],
  output: [
    'Editable text from images, from single digits to full pages, corrected by a language model.',
    { file: 'ocr-output.json', lang: 'json', body: `{
  "mnist_digit": 7,
  "digit_confidence": 0.99,
  "line_raw": "the quick brown f0x",
  "line_corrected": "the quick brown fox",
  "note": "print easier than handwriting; quality matters"
}` },
    'The MNIST core classifies a digit with high confidence, and the line recogniser plus language model turns "brown f0x" into "brown fox" — the ladder from single character to corrected text.',
  ],
  troubleshoot: [
    { sym: 'Great on MNIST, poor on pages', cause: 'Only the core built', fix: 'Add segmentation, sequence recognition, LM, preprocessing' },
    { sym: 'Characters merge/split', cause: 'Per-character cutting', fix: 'Use sequence recognition (CTC) over whole lines' },
    { sym: 'Odd but plausible errors', cause: 'No language post-processing', fix: 'Add dictionary/LM correction' },
    { sym: 'Poor on scans', cause: 'Image quality', fix: 'Deskew/binarise/denoise; improve capture' },
    { sym: 'Fails on handwriting', cause: 'Print-only training', fix: 'Train on handwriting; augment; validate on writers' },
    { sym: 'Layout garbled', cause: 'No layout handling', fix: 'Add line/region ordering and layout analysis' },
  ],

  perf: [
    'Master the character core before building the pipeline.',
    'Use sequence recognition to avoid brittle character cutting.',
    'Add language-model post-processing for real accuracy.',
    'Invest in image-quality preprocessing (deskew/binarise/denoise).',
  ],
  safety: [
    'OCR makes errors — do not use raw output for critical data without verification.',
    'Documents may contain personal/sensitive data — handle securely and lawfully.',
    'Handwriting accuracy is limited — set expectations honestly.',
    'Validate on representative documents before relying on the engine.',
  ],
  maintenance: [
    'Retrain/extend for new fonts, scripts and handwriting.',
    'Improve preprocessing for new capture conditions.',
    'Update the language model/dictionary for the domain.',
    'Monitor CER/WER on real documents.',
  ],
  future: [
    'Add full page-layout analysis (columns, tables, forms).',
    'Add multilingual/script support.',
    'Add end-to-end transformer OCR.',
    'Add handwriting-specific writer adaptation.',
  ],
  faq: [
    { q: 'Why is MNIST the starting point?', a: 'Because it isolates the core problem — classify one handwritten character — in a small, clean dataset, teaching every deep-learning fundamental (convolutions, pooling, softmax, training) in a problem simple enough to master. It is the "hello world" of neural networks.' },
    { q: 'Why not just classify each character in real text?', a: 'Because per-character cutting is brittle — characters touch, overlap and vary in width. Real OCR feeds a whole line to a sequence recogniser (CNN+RNN with CTC, or seq2seq) that reads it without needing characters pre-cut.' },
    { q: 'Why add a language model?', a: 'Because visual recognition makes errors that are obvious in context — "recogmse" for "recognise". A dictionary/language model corrects these using the statistics of the language, so the engine is far more accurate than pixels alone.' },
    { q: 'Why is handwriting so much harder than print?', a: 'Because of enormous variation between writers and even within one writer, plus cursive connection and messy layouts. A classifier that aces MNIST is a long way from reading arbitrary handwriting.' },
    { q: 'Why does image quality matter so much?', a: 'Resolution, contrast, lighting, skew and noise all degrade recognition. Deskewing, binarising and denoising the input often improves accuracy more than a bigger model — image quality is half of OCR.' },
  ],
  refs: [
    { t: 'Optical character recognition', u: 'https://en.wikipedia.org/wiki/Optical_character_recognition', s: 'Reference' },
    { t: 'MNIST database', u: 'https://en.wikipedia.org/wiki/MNIST_database', s: 'Reference' },
    { t: 'Connectionist temporal classification (CTC)', u: 'https://en.wikipedia.org/wiki/Connectionist_temporal_classification', s: 'Reference' },
    { t: 'Handwriting recognition', u: 'https://en.wikipedia.org/wiki/Handwriting_recognition', s: 'Reference' },
    { t: 'IAM handwriting database', u: 'https://fki.tic.heia-fr.ch/databases/iam-handwriting-database', s: 'Dataset' },
  ],
  images: ['neural', 'cnn', 'health'],
  imageCaptions: [
    'An OCR engine spans a ladder from the classic MNIST digit to reading full pages of handwriting as editable text.',
    'The MNIST CNN core — classify one character — is the fundamental skill every OCR system builds upon.',
    'Real OCR composes segmentation, sequence recognition and language-model correction into a document pipeline.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A09 — AI Resume Screener
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A09',
  domainKey: 'ai',
  emoji: '📄', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Ranks résumés against a job description by semantic relevance — a first-pass filter for a mountain of applications, built with fairness in mind.',
  platformName: 'CPU/GPU workstation or server',
  ide: 'Python 3.11 + NLP (embeddings/transformers)',

  overview: [
    'A single job opening can draw hundreds or thousands of résumés, and reading them all is a genuine bottleneck — so recruiters need a way to surface the most relevant candidates first. This project builds an <b>AI résumé screener</b> that ranks résumés against a job description by <b>semantic relevance</b>, giving a sorted shortlist as a first-pass filter. It is a practical NLP application — but one that must be built with unusual care, because ranking people\'s applications is a domain where a careless model can do real harm, and this project treats <b>fairness</b> as a first-class requirement, not an afterthought.',
    'The core is <b>text relevance scoring</b>. Both the job description and each résumé are turned into a representation of their meaning — from simple keyword/TF-IDF matching up to <b>semantic embeddings</b> that capture meaning beyond exact words (so "managed a team" matches "team leadership") — and each résumé is scored by how well it matches the job, then ranked. Better systems match on <b>skills and requirements</b> rather than surface keywords, reducing the "keyword-stuffing" gameability of naïve matchers, and can explain <i>why</i> a résumé scored as it did.',
    'The value is a faster first pass over a large applicant pool. But the honesty here is paramount and non-negotiable: hiring models are notorious for <b>learning and amplifying bias</b> from historical data (a famous case scrapped a tool that penalised résumés containing "women\'s"), so this must be built to <b>assist, not decide</b> — a ranking aid that a human reviews, never an automated reject; it should avoid training on biased outcome labels, be tested for disparate impact across protected groups, focus on job-relevant skills, and keep a human firmly in the loop. Regulations increasingly govern automated hiring, too. Built with those guardrails front and centre, it is a genuinely useful relevance tool and an essential lesson in doing applied NLP <b>responsibly</b> in a high-stakes domain.',
  ],
  does: [
    'Ranks résumés against a job description by relevance',
    'Scores text similarity (keywords → semantic embeddings)',
    'Matches on skills/requirements, not just surface keywords',
    'Produces a sorted shortlist as a first-pass filter',
    'Explains why a résumé scored as it did',
    'Assists human reviewers — never auto-rejects',
    'Is built and tested for fairness',
  ],
  features: [
    'Semantic relevance scoring/ranking',
    'Skill/requirement matching',
    'Explainable scores',
    'Human-in-the-loop, assist-not-decide design',
    'Bias testing (disparate impact)',
    'Job-relevant, gameability-resistant matching',
    'Honest about hiring bias and regulation',
  ],
  applications: [
    { t: 'Recruitment first-pass', d: 'Surfacing relevant candidates from a large pool.' },
    { t: 'Talent search', d: 'Ranking a database against a role.' },
    { t: 'Internal mobility', d: 'Matching employees to open roles by skills.' },
    { t: 'Responsible-AI case study', d: 'Fairness-first NLP in a high-stakes domain.' },
  ],
  skills: [
    'Text representation (TF-IDF, embeddings)',
    'Semantic similarity/relevance ranking',
    'Skill/requirement extraction and matching',
    'Explainability of scores',
    'Fairness testing and responsible deployment',
  ],
  prereq: [
    'This ranks people\'s applications — fairness is a first-class requirement.',
    'Score relevance from keywords up to semantic embeddings (meaning, not words).',
    'Assist, do not decide — a human-reviewed aid, never an auto-reject.',
    'Test for disparate impact; hiring AI is prone to amplifying bias.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute', spec: 'CPU fine for embeddings; GPU optional', qty: 1, price: 0 },
    { name: 'Embedding model', spec: 'Sentence/semantic embedding model', qty: 1, price: 0 },
    { name: 'Skill taxonomy', spec: 'Job-relevant skills/requirements list', qty: 1, price: 0 },
    { name: 'Fairness test set', spec: 'Data to measure disparate impact', qty: 1, price: 0, note: 'Essential for responsible use' },
  ],
  cost: 'Software; compute-light',
  libs: ['python', 'transformers', 'sentencet', 'sklearn', 'numpy'],
  hardwareNotes: [
    'This is a pure-software NLP system — there is no electronic hardware to specify. The "platform" is a computer: a CPU is sufficient for embedding-based scoring at modest scale, while a GPU speeds up transformer embedding of very large résumé pools.',
    'Memory and storage scale with the applicant pool and the embedding index; a server deployment adds the recruiter-facing review UI and an audit/fairness-logging store. Everything else lives in the software stack, libraries and models below.',
  ],

  wiringIntro: 'The "wiring" is the ranking data flow — the job description and each résumé are embedded, scored for relevance, ranked, and presented to a human with explanations and fairness checks.',
  pins: {
    left: [
      { dev: 'Job description', devPin: 'text', pin: '—', sig: 'Requirements' },
      { dev: 'Résumés', devPin: 'text', pin: '—', sig: 'Candidates' },
    ],
    right: [
      { dev: 'Relevance scorer', devPin: 'embed/match', pin: '—', sig: 'Scores' },
      { dev: 'Human review', devPin: 'shortlist', pin: '—', sig: 'Assist, not decide' },
    ],
  },
  wiringNotes: [
    'Represent the job description and résumés as text embeddings (or skill sets).',
    'Score each résumé\'s relevance to the job; rank.',
    'Match on job-relevant skills/requirements, not surface keywords.',
    'Present a ranked shortlist with explanations to a human reviewer.',
    'Test for disparate impact and keep a human in the loop — assist, not decide.',
  ],

  block: { columns: [
    { label: 'Inputs', edge: 'right', blocks: [
      { name: 'Job desc', sub: 'requirements', highlight: true },
      { name: 'Résumés', sub: 'candidates' },
    ] },
    { label: 'Represent', edge: 'right', blocks: [
      { name: 'Embeddings', sub: 'meaning', highlight: true },
      { name: 'Skills', sub: 'extract' },
    ] },
    { label: 'Rank', edge: 'right', blocks: [
      { name: 'Relevance', sub: 'score' },
      { name: 'Explain', sub: 'why' },
    ] },
    { label: 'Human', edge: 'none', blocks: [
      { name: 'Shortlist', sub: 'reviewed' },
      { name: 'Fairness', sub: 'tested' },
    ] },
  ] },
  flow: [
    { t: 'Embed job description', k: 'start' },
    { t: 'Embed each résumé', k: 'proc' },
    { t: 'Score relevance (skills/meaning)', k: 'proc' },
    { t: 'Rank + explain scores', k: 'proc' },
    { t: 'Disparate impact acceptable?', k: 'dec', yes: 'Present shortlist to human', no: 'Investigate/mitigate bias' },
    { t: 'Investigate/mitigate bias', k: 'io' },
    { t: 'Present shortlist to human', k: 'io' },
    { t: 'Human decides (assist, not decide)', k: 'end', back: 'Embed job description' },
  ],

  principle: [
    'The résumé screener is, technically, a <b>text-relevance ranking</b> problem — score how well each résumé matches a job description and sort — but it is defined at least as much by its <b>ethics</b> as its algorithm, because it ranks <i>people\'s applications</i>. That framing has to come first: a naïve or biased ranker does not merely make errors, it can systematically disadvantage real candidates, so <b>fairness and human oversight are requirements of the design, not features added later</b>. A responsible screener is deliberately scoped as an <b>assistant</b> that helps a human review a large pool faster, never as an automated gatekeeper that rejects people.',
    'The relevance core sits on a spectrum of sophistication. At the simple end, <b>keyword or TF-IDF matching</b> counts overlapping terms — easy, but shallow and gameable (candidates keyword-stuff, and "led a team" fails to match "team leadership"). At the better end, <b>semantic embeddings</b> represent the job and each résumé by <i>meaning</i>: a model maps text to vectors where semantically similar content is close, so relevance is a similarity between meanings, capturing paraphrase and synonymy that keyword matching misses. Best of all is matching on <b>extracted skills and requirements</b> — decomposing the job into what it actually needs and checking each résumé against those — which is both more accurate and more <b>explainable</b> (you can show <i>which</i> requirements a résumé meets), and harder to game with keyword stuffing.',
    '<b>Explainability</b> matters here more than in most ranking tasks, precisely because the stakes are human. A score with no reason ("candidate X: 0.72") is neither useful to a recruiter nor auditable for fairness. Showing <i>why</i> — which skills matched, which requirements are met or missing — turns the tool into genuine decision <b>support</b> a human can sensibly review and override, and provides a handle for checking that the model is keying on job-relevant factors rather than spurious ones.',
    'The non-negotiable part is <b>bias</b>, and the history is a warning. Hiring models trained on historical hiring decisions <b>learn and amplify the biases in that history</b> — most famously, a large company scrapped an experimental résumé tool after it learned to penalise résumés containing the word "women\'s" and downgrade graduates of women\'s colleges, because it had been trained on a male-dominated hiring history. The lessons are concrete and must be built in: do <b>not</b> naïvely train on biased outcome labels; <b>test for disparate impact</b> across protected groups (does the ranking systematically disadvantage a group?); focus scoring on <b>job-relevant skills</b> and strip or ignore proxies for protected characteristics; keep a <b>human firmly in the loop</b> making the actual decisions; and be aware that automated hiring is increasingly <b>regulated</b> (bias audits, candidate notice). Built with all of that in front — a semantic, skill-based, explainable relevance ranker, tested for fairness, positioned as an assistant to human reviewers — it delivers real value (a faster, better first pass over a mountain of applications) while standing as the project\'s central lesson: doing applied NLP <b>responsibly</b> where the output affects people\'s lives.',
  ],
  equations: [
    { t: 'Semantic relevance', eq: 'v_job    = embed(job_description)\nv_resume = embed(resume)\n\n  relevance = cosine(v_job, v_resume)   # meaning, not keywords\n\nrank résumés by relevance → shortlist (first pass).' },
    { t: 'Skill/requirement matching (better)', eq: 'reqs = extract_skills(job)\nfor each résumé:\n  met = { r in reqs : résumé demonstrates r }\n  score = |met| / |reqs|   (weighted by importance)\n  explanation = met vs missing   # explainable + less gameable' },
    { t: 'Fairness (non-negotiable)', eq: 'assist, do NOT decide — human reviews every outcome\ndo NOT train on biased outcome labels\ntest disparate impact:\n  selection_rate(group_A) / selection_rate(group_B) ≈ 1\nstrip proxies for protected attributes; audit regularly.' },
  ],

  ai: {
    task: 'Rank résumés against a job description by semantic, skill-based relevance to produce an explainable first-pass shortlist for human review, built and tested for fairness.',
    dataset: [
      'Job descriptions and résumés (text); a skills/requirements taxonomy; embedding model for semantic representation.',
      'Critically: do NOT train relevance on biased historical hiring outcomes. Use job-relevant skill matching and a fairness test set.',
    ],
    datasetTable: [
      { n: 'Embedding model (pretrained)', size: '—', lic: 'Model terms', use: 'Semantic text representation' },
      { n: 'Skills/requirements taxonomy', size: 'Curated', lic: 'Varies', use: 'Skill-based, explainable matching' },
      { n: 'Job descriptions + résumés', size: 'Your pool', lic: 'With consent/lawful', use: 'Scoring inputs' },
      { n: 'Fairness test set', size: 'Group-labelled (careful)', lic: 'Lawful', use: 'Measure disparate impact' },
    ],
    preprocess: [
      'Parse résumés/job descriptions to text; extract skills/requirements.',
      'Avoid ingesting protected attributes or their proxies for scoring.',
      'Normalise text; embed for semantic matching.',
    ],
    pipeline: [
      { name: 'Job + résumés', sub: 'text', highlight: true },
      { name: 'Embed / skills', sub: 'represent' },
      { name: 'Relevance', sub: 'score', highlight: true },
      { name: 'Explain', sub: 'why' },
      { name: 'Human review', sub: 'decide' },
    ],
    archTable: [
      { l: 'Representation', s: 'semantic embeddings (or TF-IDF)', p: 'Meaning-based matching' },
      { l: 'Skill matcher', s: 'requirement extraction + match', p: 'Explainable, less gameable' },
      { l: 'Ranker', s: 'similarity/score sort', p: 'First-pass shortlist' },
      { l: 'Explainer', s: 'matched/missing skills', p: 'Human-reviewable reasons' },
      { l: 'Fairness harness', s: 'disparate-impact tests', p: 'Detect/mitigate bias' },
    ],
    hyper: [
      { k: 'Representation', v: 'embeddings > TF-IDF', w: 'Meaning vs keywords' },
      { k: 'Skill weighting', v: 'by importance', w: 'Prioritise real requirements' },
      { k: 'Shortlist size', v: 'app-specific', w: 'Recall vs review load' },
      { k: 'Fairness thresholds', v: 'e.g. 4/5ths rule', w: 'Disparate-impact limit' },
    ],
    training: [
      'Prefer unsupervised semantic matching + curated skill rules over training on biased outcome labels.',
      'If any learning is used, exclude protected attributes/proxies and validate fairness.',
      'Continuously test disparate impact and explanations.',
    ],
    metricsIntro: [
      'Beyond relevance quality, the decisive metrics are fairness (disparate impact across groups) and the presence of meaningful human oversight.',
    ],
    metrics: [
      { m: 'Relevance quality', v: 'reviewer-judged', d: 'Useful shortlist' },
      { m: 'Disparate impact', v: 'within limits', d: 'No group disadvantage' },
      { m: 'Explainability', v: 'reasons shown', d: 'Auditable, reviewable' },
      { m: 'Human-in-loop', v: 'always', d: 'Assist, not decide' },
    ],
    chart: { title: 'Matching approach: quality vs gameability', unit: '', desc: 'Keyword matching is shallow and gameable; semantic/skill matching is better and more explainable (illustrative).', bars: [
      { label: 'Keyword match', value: 55 },
      { label: 'TF-IDF', value: 65 },
      { label: 'Semantic embed', value: 82 },
      { label: 'Skill-based', value: 90 },
    ] },
    inference: { file: 'screen.py', lang: 'python', body: `import numpy as np

def relevance(job_vec, resume_vec):
    return float(np.dot(job_vec, resume_vec) /
                 (np.linalg.norm(job_vec) * np.linalg.norm(resume_vec) + 1e-9))

def screen(job, resumes, embed, skills_of):
    reqs = skills_of(job)                          # job-relevant requirements
    jv = embed(job)
    ranked = []
    for r in resumes:
        met = [s for s in reqs if s in skills_of(r)]     # explainable match
        score = relevance(jv, embed(r))                  # semantic relevance
        ranked.append({
            "resume": r.id, "score": round(score, 3),
            "skills_met": met, "skills_missing": [s for s in reqs if s not in met],
        })
    ranked.sort(key=lambda x: x["score"], reverse=True)  # first-pass shortlist
    return ranked
    # ASSIST, NOT DECIDE: a human reviews; test disparate impact; no auto-reject.` },
    limits: [
      'Hiring AI can learn/amplify bias — assist, do not decide; test disparate impact.',
      'Do not train on biased historical outcome labels; avoid protected-attribute proxies.',
      'Relevance is not merit — a ranking aid, not a hiring judgement.',
      'Automated hiring is increasingly regulated (bias audits, candidate notice).',
    ],
  },

  assembly: [
    { h: 'Build explainable relevance scoring', p: [
      'Represent the job and résumés semantically, extract job-relevant skills/requirements, and score/rank with explanations of what matched.',
    ], warn: 'This ranks people\'s applications. Build it to ASSIST, not decide: a human reviews every outcome, never an auto-reject. Do not train on biased historical outcomes, avoid protected-attribute proxies, and test for disparate impact.' },
    { h: 'Add fairness testing', p: [
      'Measure disparate impact across groups, investigate and mitigate any systematic disadvantage, and keep scoring on job-relevant factors.',
    ] },
    { h: 'Deploy with human oversight', p: [
      'Present an explainable shortlist to human reviewers who make the decisions, and comply with applicable hiring regulations.',
    ] },
  ],
  steps: [
    { h: 'Score relevance with explanations', p: [
      'Score each résumé\'s semantic relevance and skill match to the job, ranking with explicit met/missing reasons.',
    ], code: {
      file: 'rank.py', lang: 'python',
      body: `import numpy as np

def cosine(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a)*np.linalg.norm(b) + 1e-9))

def rank(job, resumes, embed, skills_of):
    reqs, jv = skills_of(job), embed(job)          # job-relevant requirements
    out = []
    for r in resumes:
        met = [s for s in reqs if s in skills_of(r)]     # explainable
        out.append({"id": r.id,
                    "score": round(cosine(jv, embed(r)), 3),   # semantic relevance
                    "met": met,
                    "missing": [s for s in reqs if s not in met]})
    return sorted(out, key=lambda x: x["score"], reverse=True)   # shortlist`,
      explain: [
        { ref: 'reqs, jv = skills_of(job), embed(job)          # job-relevant requirements', txt: 'Scoring is anchored to job-relevant requirements, keeping the model on legitimate factors rather than spurious signals.' },
        { ref: 'met = [s for s in reqs if s in skills_of(r)]     # explainable', txt: 'Recording which requirements a résumé meets makes the score explainable and auditable — essential in a hiring context.' },
        { ref: '"score": round(cosine(jv, embed(r)), 3),   # semantic relevance', txt: 'Semantic relevance captures meaning beyond keywords, so paraphrased experience still matches.' },
        { ref: 'return sorted(out, key=lambda x: x["score"], reverse=True)   # shortlist', txt: 'The output is a ranked shortlist for a human first pass — a filter, not a decision.' },
      ],
    } },
    { h: 'Test fairness and keep humans in the loop', p: [
      'Measure disparate impact across groups, mitigate issues, and route the explainable shortlist to human reviewers who decide.',
    ], tip: 'Never let it auto-reject. The tool ranks to help a human review faster; the human makes every decision, and you test continuously that the ranking does not disadvantage any protected group.' },
  ],

  code: [{
    file: 'resume_screener.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
AI Résumé Screener (fairness-first)

Ranks résumés against a job description by SEMANTIC, SKILL-BASED
relevance, with explanations, as a first-pass filter. ASSIST, NOT
DECIDE: a human reviews every outcome. Tested for disparate impact;
no training on biased outcomes; no protected-attribute proxies.
"""
import numpy as np

def cosine(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a)*np.linalg.norm(b) + 1e-9))

class ResumeScreener:
    def __init__(self, embed, skills_of):
        self.embed = embed; self.skills_of = skills_of

    def rank(self, job, resumes):
        reqs = self.skills_of(job)                 # job-relevant requirements only
        jv = self.embed(job)
        results = []
        for r in resumes:
            met = [s for s in reqs if s in self.skills_of(r)]
            results.append({
                "id": r.id,
                "score": round(cosine(jv, self.embed(r.text)), 3),  # semantic
                "skills_met": met,                                   # explainable
                "skills_missing": [s for s in reqs if s not in met],
            })
        results.sort(key=lambda x: x["score"], reverse=True)
        return results                             # ranked shortlist (first pass)

    def fairness_report(self, ranked, group_of, top_k):
        # disparate impact: selection rate by group in the top-k shortlist
        shortlisted = {r["id"] for r in ranked[:top_k]}
        rates = {}
        for gid, members in groups(group_of).items():
            rates[gid] = len(members & shortlisted) / max(len(members), 1)
        return rates                               # audit vs 4/5ths rule etc.

if __name__ == "__main__":
    scr = ResumeScreener(embed_model, extract_skills)
    ranked = scr.rank(JOB, RESUMES)
    # A HUMAN reviews 'ranked' and decides. Check scr.fairness_report(...).
    # No auto-reject. Comply with automated-hiring regulations.`,
    explain: [
      { ref: 'reqs = self.skills_of(job)                 # job-relevant requirements only', txt: 'The screener scores against job-relevant requirements, deliberately excluding protected attributes and their proxies.' },
      { ref: '"skills_met": met,                                   # explainable', txt: 'Every score comes with the skills it matched, making the ranking auditable and reviewable by a human.' },
      { ref: 'return results                             # ranked shortlist (first pass)', txt: 'The output is a first-pass shortlist for human review — assistance, not a decision.' },
      { ref: 'def fairness_report(self, ranked, group_of, top_k):', txt: 'A built-in disparate-impact check measures whether the shortlist systematically disadvantages any group — fairness as a first-class feature.' },
      { ref: '# No auto-reject. Comply with automated-hiring regulations.', txt: 'The responsible-use constraints — human decisions, no auto-reject, regulatory compliance — are stated in the code itself.' },
    ],
  }],

  config: [
    'Configure the embedding model and skills/requirements extraction.',
    'Configure relevance scoring, weighting and shortlist size.',
    'Configure the fairness/disparate-impact tests and thresholds.',
    'Configure human-review workflow and regulatory compliance.',
  ],
  calibration: [
    { h: 'Relevance quality', p: [
      'Have reviewers judge whether the shortlist surfaces genuinely relevant candidates.',
    ] },
    { h: 'Fairness', p: [
      'Measure disparate impact across groups; investigate and mitigate any systematic gaps.',
    ] },
    { h: 'Explanations', p: [
      'Verify explanations are accurate and job-relevant, supporting human review.',
    ] },
  ],
  testing: [
    { step: 'Rank a résumé pool', expect: 'Relevant candidates near the top' },
    { step: 'Paraphrased experience', expect: 'Matched (semantic, not keyword)' },
    { step: 'Keyword-stuffed résumé', expect: 'Not unduly boosted (skill-based)' },
    { step: 'Disparate-impact test', expect: 'No systematic group disadvantage' },
    { step: 'Inspect explanations', expect: 'Job-relevant matched/missing skills' },
    { step: 'Attempt auto-reject', expect: 'Blocked — human decides' },
  ],
  output: [
    'An explainable, fairness-tested ranked shortlist for human reviewers — a first-pass filter, not a decision.',
    { file: 'shortlist.json', lang: 'json', body: `{
  "job": "Backend Engineer",
  "top": [
    { "id": "R-108", "score": 0.86, "skills_met": ["Python","APIs","SQL"], "skills_missing": ["Kubernetes"] },
    { "id": "R-042", "score": 0.81, "skills_met": ["Python","SQL"], "skills_missing": ["APIs","Kubernetes"] }
  ],
  "note": "assist, not decide — human reviews; disparate impact tested"
}` },
    'A ranked shortlist with explicit matched/missing skills per candidate — a fast, explainable first pass that a human reviews, tested for fairness rather than trusted blindly.',
  ],
  troubleshoot: [
    { sym: 'Shallow keyword matches', cause: 'TF-IDF/keyword only', fix: 'Use semantic embeddings + skill matching' },
    { sym: 'Gamed by keyword stuffing', cause: 'Surface matching', fix: 'Match on demonstrated skills/requirements' },
    { sym: 'Disparate impact', cause: 'Bias in data/proxies', fix: 'Remove proxies; retest; mitigate; do not train on biased labels' },
    { sym: 'Opaque scores', cause: 'No explanations', fix: 'Show matched/missing skills' },
    { sym: 'Used to auto-reject', cause: 'Misuse', fix: 'Enforce human-in-the-loop; assist, not decide' },
    { sym: 'Non-compliant', cause: 'Ignoring regulation', fix: 'Follow automated-hiring laws (audits, notice)' },
  ],

  perf: [
    'Prefer semantic, skill-based matching over keywords.',
    'Make scores explainable for human review.',
    'Test disparate impact continuously; mitigate bias.',
    'Keep a human in the loop — assist, not decide.',
  ],
  safety: [
    'Assist, do not decide — never auto-reject; a human makes every hiring decision.',
    'Do not train on biased historical outcomes; exclude protected attributes and their proxies.',
    'Test and monitor for disparate impact; hiring AI is prone to amplifying bias.',
    'Comply with automated-hiring regulations (bias audits, candidate notice).',
  ],
  maintenance: [
    'Re-test fairness regularly and after any change.',
    'Update the skills taxonomy and embeddings.',
    'Audit explanations and reviewer feedback.',
    'Track regulatory changes for automated hiring.',
  ],
  future: [
    'Add structured skill extraction and evidence linking.',
    'Add counterfactual/fairness explanations.',
    'Add reviewer feedback loops (without learning bias).',
    'Add multilingual résumé support.',
  ],
  faq: [
    { q: 'What does it actually do?', a: 'It ranks résumés against a job description by semantic, skill-based relevance, producing an explainable first-pass shortlist to help a human review a large pool faster. It is a filter, not a decision-maker.' },
    { q: 'Why is fairness treated as a requirement?', a: 'Because it ranks people\'s applications, and hiring models are notorious for learning and amplifying bias from historical data — a famous tool was scrapped for penalising résumés containing "women\'s". Fairness and human oversight must be designed in, not added later.' },
    { q: 'Why semantic/skill matching over keywords?', a: 'Keyword matching is shallow and gameable — "led a team" fails to match "team leadership", and candidates keyword-stuff. Semantic embeddings match meaning, and skill-based matching is more accurate, more explainable, and harder to game.' },
    { q: 'Can it auto-reject candidates?', a: 'No. It must assist, not decide — a human reviews the shortlist and makes every decision. Automated rejection is exactly the misuse that causes harm and increasingly runs into regulation.' },
    { q: 'How do you check it is fair?', a: 'By testing disparate impact across protected groups (e.g. comparing selection rates), removing protected-attribute proxies, keeping scoring on job-relevant skills, and not training on biased outcome labels — auditing continuously.' },
  ],
  refs: [
    { t: 'Text similarity / embeddings', u: 'https://en.wikipedia.org/wiki/Sentence_embedding', s: 'Reference' },
    { t: 'Algorithmic bias in hiring', u: 'https://en.wikipedia.org/wiki/Algorithmic_bias', s: 'Reference' },
    { t: 'Disparate impact', u: 'https://en.wikipedia.org/wiki/Disparate_impact', s: 'Reference' },
    { t: 'TF-IDF', u: 'https://en.wikipedia.org/wiki/Tf%E2%80%93idf', s: 'Reference' },
    { t: 'Responsible AI in hiring', u: 'https://en.wikipedia.org/wiki/Artificial_intelligence_in_hiring', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'retail'],
  imageCaptions: [
    'An AI résumé screener ranks applications against a job by semantic relevance — a first-pass filter for a large pool.',
    'Skill-based, explainable matching beats gameable keyword matching and shows why each candidate scored as they did.',
    'Fairness is a first-class requirement: disparate-impact testing and human decisions, never an automated reject.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A10 — Sentiment Analysis Engine
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A10',
  domainKey: 'ai',
  emoji: '💬', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Mines opinion and emotion from reviews and social posts at scale — turning mountains of free text into a readable pulse of what people feel.',
  platformName: 'CPU/GPU workstation or server',
  ide: 'Python 3.11 + NLP (transformers/classical)',

  overview: [
    'Every day people write vast amounts about products, brands, services and events — reviews, tweets, comments, support tickets — and buried in that text is something organisations badly want: <b>how people feel</b>. Reading it all is impossible, so this project builds a <b>sentiment analysis engine</b> that reads free text and classifies its <b>opinion and emotion</b> — positive/negative/neutral, and often finer emotions — automatically, at scale, turning a firehose of unstructured text into a measurable pulse of sentiment.',
    'At its core it is a <b>text classification</b> problem: map a piece of text to a sentiment label. Approaches range from classic (lexicon methods that score sentiment-bearing words; bag-of-words models like TF-IDF plus a classifier) to modern <b>transformer</b> models fine-tuned for sentiment, which understand context far better. On top of the basic label, useful engines add <b>aspect-based</b> sentiment (a review can be positive about battery life but negative about price — sentiment <i>per aspect</i>, not just overall) and <b>aggregation</b> (trends over time, by product, by source), which is where the business value lives.',
    'The value is scale and structure: continuous, quantified sentiment across thousands of texts, revealing what customers love and hate and how it shifts. It is honest about the genuine hard parts of language that trip up naïve models: <b>sarcasm and irony</b> ("great, another update that breaks everything"), <b>negation</b> ("not bad" is positive), context and domain-specific meaning, mixed sentiment, and <b>bias</b> in training data; accuracy is good but never perfect, so it informs rather than replaces judgement. Built honestly — a well-chosen model, aspect awareness where it matters, sensible aggregation, and clear-eyed about sarcasm/negation limits — it is both a genuinely useful text-mining tool and a definitive lesson in NLP text classification.',
  ],
  does: [
    'Classifies text sentiment (positive/negative/neutral, emotions)',
    'Reads reviews, social posts, comments, tickets at scale',
    'Supports aspect-based sentiment (per feature/topic)',
    'Aggregates sentiment over time, product and source',
    'Turns unstructured text into measurable signal',
    'Reveals what people love, hate and how it shifts',
    'Informs decisions with a quantified pulse of opinion',
  ],
  features: [
    'Text-classification sentiment (classic → transformer)',
    'Emotion/opinion labelling',
    'Aspect-based sentiment',
    'Aggregation and trends',
    'Scale over large text volumes',
    'Confidence-scored outputs',
    'Honest about sarcasm, negation and bias',
  ],
  applications: [
    { t: 'Brand / product monitoring', d: 'Tracking sentiment across reviews and social.' },
    { t: 'Customer experience', d: 'Mining tickets/feedback for pain points.' },
    { t: 'Market / competitor analysis', d: 'Opinion trends across sources.' },
    { t: 'Content / campaign feedback', d: 'Reactions to launches and events.' },
  ],
  skills: [
    'Text classification (classic and transformer)',
    'Aspect-based sentiment',
    'Aggregation and trend analysis',
    'Handling sarcasm/negation/context limits',
    'Evaluation and bias awareness',
  ],
  prereq: [
    'Sentiment analysis is text classification — text in, opinion label out.',
    'Aspect-based sentiment (per feature) is where the business value often is.',
    'Sarcasm, negation and context trip up naïve models — mind them.',
    'Accuracy is good but never perfect — inform, do not replace judgement.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute', spec: 'CPU for classic/inference; GPU for transformer training', qty: 1, price: 0 },
    { name: 'Sentiment model', spec: 'Lexicon/TF-IDF classifier or fine-tuned transformer', qty: 1, price: 0 },
    { name: 'Labelled dataset', spec: 'Sentiment-labelled text in your domain', qty: 1, price: 0, note: 'Domain matters' },
    { name: 'Text sources', spec: 'Reviews/social/tickets to analyse', qty: 1, price: 0 },
  ],
  cost: 'Software; compute-light to moderate',
  libs: ['python', 'transformers', 'sklearn', 'pandas', 'numpy'],
  hardwareNotes: [
    'This is a pure-software NLP system with no electronic hardware to specify. The "platform" is a computer: a CPU handles lexicon and TF-IDF models and moderate transformer inference, while a GPU accelerates transformer fine-tuning and high-volume classification.',
    'Memory and storage scale with the volume of text ingested and the aggregation history retained; a production deployment adds ingestion connectors (reviews/social/tickets) and a dashboard store for the aggregated pulse. The rest of the system is the software stack, libraries and models below.',
  ],

  wiringIntro: 'The "wiring" is the analysis data flow — text is preprocessed and classified into sentiment (overall and per aspect), then aggregated into trends and reports.',
  pins: {
    left: [
      { dev: 'Text sources', devPin: 'reviews/social', pin: '—', sig: 'Free text' },
      { dev: 'Preprocess', devPin: 'clean/tokenise', pin: '—', sig: 'Model input' },
    ],
    right: [
      { dev: 'Sentiment model', devPin: 'classify', pin: '—', sig: 'Labels (+aspects)' },
      { dev: 'Aggregate', devPin: 'trends', pin: '—', sig: 'Pulse/reports' },
    ],
  },
  wiringNotes: [
    'Ingest text from reviews, social posts, comments or tickets.',
    'Preprocess (clean, tokenise) for the model.',
    'Classify sentiment overall and, where useful, per aspect.',
    'Aggregate over time, product and source into a readable pulse.',
    'Mind sarcasm/negation/context — accuracy is good, not perfect.',
  ],

  block: { columns: [
    { label: 'Ingest', edge: 'right', blocks: [
      { name: 'Text', sub: 'reviews/social', highlight: true },
    ] },
    { label: 'Classify', edge: 'right', blocks: [
      { name: 'Model', sub: 'sentiment', highlight: true },
      { name: 'Aspects', sub: 'per feature' },
    ] },
    { label: 'Aggregate', edge: 'right', blocks: [
      { name: 'Trends', sub: 'over time' },
      { name: 'By product/source', sub: 'segment' },
    ] },
    { label: 'Use', edge: 'none', blocks: [
      { name: 'Pulse', sub: 'dashboard' },
      { name: 'Insight', sub: 'love/hate' },
    ] },
  ] },
  flow: [
    { t: 'Ingest a text item', k: 'start' },
    { t: 'Preprocess (clean/tokenise)', k: 'proc' },
    { t: 'Classify overall sentiment', k: 'proc' },
    { t: 'Aspect-based needed?', k: 'dec', yes: 'Sentiment per aspect', no: 'Store label' },
    { t: 'Sentiment per aspect', k: 'proc' },
    { t: 'Store label', k: 'io' },
    { t: 'Aggregate trends/segments', k: 'proc' },
    { t: 'Report the pulse', k: 'end', back: 'Ingest a text item' },
  ],

  principle: [
    'Sentiment analysis exists to solve a scale problem: the opinions organisations want are scattered across more free text than any human could ever read, so the goal is to <b>read it automatically and turn feeling into a measurable signal</b>. Framed technically, it is a <b>text classification</b> task — map a piece of text to a sentiment label (positive/negative/neutral, or finer emotions) — and everything else is refinement of that core. The payoff is converting an unstructured firehose into structured, quantified data you can chart, segment and act on.',
    'The approaches sit on a clear <b>sophistication spectrum</b>, and understanding it is half the lesson. <b>Lexicon methods</b> score text by looking up sentiment-bearing words in a dictionary (fast, transparent, but blind to context). <b>Bag-of-words models</b> (TF-IDF features into a classifier) learn from labelled data which word patterns signal which sentiment — better, but still ignore word order and context. <b>Transformer models</b> fine-tuned for sentiment read text <i>in context</i>, understanding how surrounding words change meaning, and are markedly more accurate on hard cases. The right choice depends on the accuracy needed, the compute available, and how much labelled domain data you have.',
    'The refinement that unlocks real value is <b>aspect-based sentiment</b>. Overall sentiment is coarse: a product review saying "amazing camera, but the battery is terrible and it\'s overpriced" is not simply "positive" or "negative" — it is positive about the camera, negative about battery and price. Aspect-based sentiment attributes feeling to <b>specific aspects</b> (camera, battery, price, service), which is what a product team actually needs — not "reviews are 60% positive" but "praise for the camera, complaints about battery life". Pairing this with <b>aggregation</b> — sentiment trends over time, broken down by product, feature and source — is where sentiment analysis stops being a classifier and becomes business intelligence.',
    'The honesty this project requires is about the ways <b>language defeats naïve models</b>, and they are not edge cases — they are everywhere in real text. <b>Sarcasm and irony</b> invert surface sentiment ("oh great, another crash" is negative despite "great"), and are genuinely hard even for strong models. <b>Negation</b> flips polarity ("not bad" is positive; "I can\'t say I love it" is negative) and trips up lexicon and bag-of-words methods that miss the "not". <b>Context and domain</b> shift meaning ("this vacuum really sucks" is praise). Real text has <b>mixed sentiment</b>, informal spelling, emoji and code-switching, and models inherit <b>bias</b> from their training data. So accuracy, while good, is <b>never perfect</b>, and the engine should <b>inform judgement, not replace it</b> — aggregate signals are trustworthy at scale even when individual classifications occasionally err. Built with a model matched to the need, aspect awareness where it matters, sensible aggregation, and clear eyes about sarcasm, negation and bias, the engine delivers exactly what its users want — a scalable, quantified pulse of public opinion — while teaching the central skills and the central humility of NLP text classification.',
  ],
  equations: [
    { t: 'Sentiment classification', eq: 'model(text) → sentiment label (+ confidence)\n\n  {positive, negative, neutral}  (or finer emotions)\n\nLexicon → bag-of-words (TF-IDF) → transformer\n(rising context-awareness and accuracy).' },
    { t: 'Aspect-based sentiment', eq: 'For a review mentioning aspects {camera, battery, price}:\n\n  sentiment(aspect) for each aspect\n  → "positive camera, negative battery/price"\n\nFar more actionable than one overall label.' },
    { t: 'Aggregation (the value)', eq: 'pulse = aggregate(labels) over time / product / source\n\n  trend(t), share_positive, top complaints/praises\n\nIndividual errors wash out at scale; the AGGREGATE signal\nis trustworthy. Inform judgement, do not replace it.' },
  ],

  ai: {
    task: 'Classify the sentiment (and emotion/aspect) of free text at scale, from classic to transformer models, and aggregate into trends — informing, not replacing, judgement.',
    dataset: [
      'Sentiment-labelled text; domain-matched data matters (product reviews differ from tweets). Transformers can be fine-tuned; classic models train on TF-IDF features.',
      'Coverage of sarcasm, negation, mixed sentiment and informal text improves robustness.',
    ],
    datasetTable: [
      { n: 'Review/sentiment corpora', size: 'Large', lic: 'Varies', use: 'Train/fine-tune sentiment' },
      { n: 'Domain-labelled data', size: 'Your domain', lic: 'Lawful', use: 'Domain accuracy' },
      { n: 'Aspect-annotated data', size: 'Optional', lic: 'Varies', use: 'Aspect-based sentiment' },
      { n: 'Hard-case set (sarcasm/negation)', size: 'Targeted', lic: 'Varies', use: 'Robustness testing' },
    ],
    preprocess: [
      'Clean and tokenise text; handle emoji, informal spelling, negation cues.',
      'For transformers, use the model tokeniser; for classic, build TF-IDF features.',
      'Segment aspects/sentences for aspect-based sentiment.',
    ],
    pipeline: [
      { name: 'Text', sub: 'reviews/social', highlight: true },
      { name: 'Preprocess', sub: 'clean/tokenise' },
      { name: 'Classify', sub: 'sentiment', highlight: true },
      { name: 'Aspects', sub: 'per feature' },
      { name: 'Aggregate', sub: 'trends' },
    ],
    archTable: [
      { l: 'Lexicon', s: 'sentiment word scores', p: 'Fast, transparent baseline' },
      { l: 'Bag-of-words', s: 'TF-IDF + classifier', p: 'Learned, order-blind' },
      { l: 'Transformer', s: 'fine-tuned contextual model', p: 'Context-aware, best accuracy' },
      { l: 'Aspect module', s: 'aspect extraction + sentiment', p: 'Per-feature opinion' },
      { l: 'Aggregator', s: 'trends by time/product/source', p: 'Business intelligence' },
    ],
    hyper: [
      { k: 'Model type', v: 'lexicon…transformer', w: 'Accuracy vs compute/data' },
      { k: 'Classes', v: '3-way / emotions', w: 'Granularity needed' },
      { k: 'Confidence gate', v: 'app-specific', w: 'Flag uncertain items' },
      { k: 'Aggregation window', v: 'per report', w: 'Trend smoothing' },
    ],
    training: [
      'Fine-tune a transformer (or train a TF-IDF classifier) on domain-matched labelled data.',
      'Include sarcasm/negation/mixed examples; validate on a hard-case set.',
      'Check for bias; evaluate on held-out real text, not just clean benchmarks.',
    ],
    metricsIntro: [
      'Accuracy/F1 per class matters, but so does honest evaluation on hard cases (sarcasm, negation) and the reliability of aggregate trends.',
    ],
    metrics: [
      { m: 'Accuracy / F1', v: 'model/domain-dependent', d: 'Per-class quality' },
      { m: 'Hard-case accuracy', v: 'lower (honest)', d: 'Sarcasm/negation' },
      { m: 'Aggregate reliability', v: 'high at scale', d: 'Trends wash out errors' },
      { m: 'Aspect accuracy', v: 'if used', d: 'Per-feature sentiment' },
    ],
    chart: { title: 'Accuracy by text difficulty', unit: '%', desc: 'Straightforward sentiment is easy; sarcasm and heavy negation are genuinely hard — accuracy is good, not perfect (illustrative).', bars: [
      { label: 'Clear sentiment', value: 92 },
      { label: 'Mixed sentiment', value: 78 },
      { label: 'Negation', value: 72 },
      { label: 'Sarcasm/irony', value: 55 },
    ] },
    inference: { file: 'sentiment.py', lang: 'python', body: `from collections import Counter

def classify(text, model):
    out = model(text)                    # transformer/classic sentiment
    return {"label": out.label, "confidence": float(out.score)}

def aspect_sentiment(text, model, aspects):
    # sentiment per aspect (camera/battery/price), not just overall
    result = {}
    for a in aspects:
        span = sentence_about(text, a)   # the part discussing this aspect
        if span:
            result[a] = classify(span, model)["label"]
    return result                        # e.g. {camera: pos, battery: neg}

def aggregate(items, model):
    # the value: a quantified pulse over many texts
    labels = [classify(t, model)["label"] for t in items]
    return Counter(labels)               # individual errors wash out at scale
    # Sarcasm/negation are hard; accuracy is good, not perfect — inform, don't replace.` },
    limits: [
      'Sarcasm/irony and negation are genuinely hard — accuracy is good, not perfect.',
      'Context and domain shift meaning; models inherit bias from data.',
      'Individual classifications can err; trust the AGGREGATE at scale.',
      'Inform judgement, do not replace it.',
    ],
  },

  assembly: [
    { h: 'Choose and set up a sentiment model', p: [
      'Pick a model for the need (lexicon/TF-IDF for simple/transparent, transformer for accuracy) and classify text into sentiment.',
    ], warn: 'Language defeats naïve models: sarcasm ("oh great, another crash"), negation ("not bad" = positive) and context flip surface sentiment. Accuracy is good but never perfect — trust aggregates at scale and inform judgement, do not replace it.' },
    { h: 'Add aspect-based sentiment', p: [
      'Where it matters, attribute sentiment to specific aspects (camera, battery, price) rather than one overall label.',
    ] },
    { h: 'Aggregate into a pulse', p: [
      'Aggregate sentiment over time, product and source into trends and reports — where the value lives.',
    ] },
  ],
  steps: [
    { h: 'Classify sentiment and per aspect', p: [
      'Classify overall sentiment, and where useful attribute sentiment to specific aspects of the text.',
    ], code: {
      file: 'analyse.py', lang: 'python',
      body: `def classify(text, model):
    out = model(text)                    # contextual sentiment (transformer)
    return {"label": out.label, "confidence": float(out.score)}

def aspect_sentiment(text, model, aspects):
    result = {}
    for a in aspects:                    # per-feature opinion, not just overall
        span = sentence_about(text, a)   # the clause discussing this aspect
        if span:
            result[a] = classify(span, model)["label"]
    return result                        # {"camera": "pos", "battery": "neg"}`,
      explain: [
        { ref: 'out = model(text)                    # contextual sentiment (transformer)', txt: 'A context-aware model reads the text in context, handling much of what lexicon/bag-of-words methods miss.' },
        { ref: 'for a in aspects:                    # per-feature opinion, not just overall', txt: 'Aspect-based sentiment attributes feeling to specific aspects — the actionable form a product team needs.' },
        { ref: 'result[a] = classify(span, model)["label"]', txt: 'Each aspect gets its own sentiment from the clause about it, so "great camera, bad battery" is captured faithfully.' },
      ],
    } },
    { h: 'Aggregate into trends', p: [
      'Aggregate individual labels over time, product and source into a readable pulse, where individual errors wash out at scale.',
    ], tip: 'Trust the aggregate, not every single label. Sarcasm and negation cause individual misclassifications, but over thousands of texts the trend is reliable — which is exactly what the business decision needs.' },
  ],

  code: [{
    file: 'sentiment_engine.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Sentiment Analysis Engine

Classifies text sentiment (and per-aspect), at scale, from classic to
transformer models, and AGGREGATES into a quantified pulse over time,
product and source. Sarcasm/negation are hard — accuracy is good, not
perfect; trust aggregates at scale and inform judgement, don't replace it.
"""
from collections import Counter, defaultdict

class SentimentEngine:
    def __init__(self, model, aspects=None):
        self.model = model               # lexicon / TF-IDF / transformer
        self.aspects = aspects or []

    def classify(self, text):
        out = self.model(text)           # sentiment + confidence
        return {"label": out.label, "confidence": float(out.score)}

    def aspects_of(self, text):
        # per-aspect sentiment (the actionable form)
        res = {}
        for a in self.aspects:
            span = sentence_about(text, a)
            if span:
                res[a] = self.classify(span)["label"]
        return res

    def analyse(self, item):
        return {"overall": self.classify(item.text),
                "aspects": self.aspects_of(item.text),
                "source": item.source, "ts": item.ts}

    def pulse(self, items):
        # THE VALUE: quantified sentiment across many texts
        overall = Counter()
        by_aspect = defaultdict(Counter)
        for it in items:
            a = self.analyse(it)
            overall[a["overall"]["label"]] += 1
            for asp, lab in a["aspects"].items():
                by_aspect[asp][lab] += 1
        return {"overall": overall, "by_aspect": by_aspect}
        # Individual errors (sarcasm/negation) wash out; the trend is reliable.

if __name__ == "__main__":
    engine = SentimentEngine(sentiment_model, aspects=["camera","battery","price"])
    report = engine.pulse(REVIEWS)
    # A quantified pulse of opinion — informs decisions, doesn't replace judgement.`,
    explain: [
      { ref: 'self.model = model               # lexicon / TF-IDF / transformer', txt: 'The engine is model-agnostic across the sophistication spectrum — pick the point matching accuracy needs and compute.' },
      { ref: 'def aspects_of(self, text):', txt: 'Aspect-based sentiment turns a coarse overall label into per-feature opinion — praise for the camera, complaints about battery.' },
      { ref: 'def pulse(self, items):', txt: 'Aggregation across many texts is where the value lives — a quantified pulse, not a pile of individual labels.' },
      { ref: '# Individual errors (sarcasm/negation) wash out; the trend is reliable.', txt: 'The honest principle: individual misclassifications from sarcasm/negation average out, so the aggregate trend is trustworthy even when single labels err.' },
    ],
  }],

  config: [
    'Configure the sentiment model (classic/transformer) and classes/emotions.',
    'Configure aspects for aspect-based sentiment.',
    'Configure aggregation windows and segments (product/source/time).',
    'Configure confidence gating and hard-case handling.',
  ],
  calibration: [
    { h: 'Model choice', p: [
      'Pick the model matching accuracy needs and available labelled data/compute.',
    ] },
    { h: 'Hard cases', p: [
      'Evaluate on sarcasm/negation/mixed examples; set expectations honestly.',
    ] },
    { h: 'Aggregation', p: [
      'Verify aggregate trends are stable and meaningful over your volumes.',
    ] },
  ],
  testing: [
    { step: 'Clear positive/negative text', expect: 'Correct sentiment' },
    { step: 'Negation ("not bad")', expect: 'Correct (positive) — mind naïve models' },
    { step: 'Sarcasm ("oh great, a crash")', expect: 'Often hard — note the limit' },
    { step: 'Mixed review', expect: 'Aspect-based captures both sides' },
    { step: 'Aggregate many texts', expect: 'Stable, reliable trend' },
    { step: 'Change domain', expect: 'May need domain data — meaning shifts' },
  ],
  output: [
    'Per-text sentiment (overall and per aspect) and an aggregated pulse over time, product and source.',
    { file: 'sentiment-pulse.json', lang: 'json', body: `{
  "overall": { "positive": 612, "neutral": 190, "negative": 198 },
  "by_aspect": {
    "camera": { "positive": 410, "negative": 60 },
    "battery": { "positive": 90, "negative": 280 },
    "price": { "positive": 70, "negative": 210 }
  },
  "note": "trust the aggregate; sarcasm/negation err individually"
}` },
    'Across a thousand reviews: broadly positive overall, but aspect-based sentiment reveals the real story — the camera is loved while battery and price draw complaints, exactly the actionable insight aggregation provides.',
  ],
  troubleshoot: [
    { sym: 'Misses negation', cause: 'Lexicon/bag-of-words', fix: 'Use a context-aware (transformer) model' },
    { sym: 'Fooled by sarcasm', cause: 'Inherent difficulty', fix: 'Best-effort model; trust aggregates; flag low confidence' },
    { sym: 'Wrong in a domain', cause: 'Domain shift', fix: 'Fine-tune on domain-matched data' },
    { sym: 'Coarse insight', cause: 'Overall-only', fix: 'Add aspect-based sentiment' },
    { sym: 'Noisy per-item labels', cause: 'Individual errors', fix: 'Report aggregates; they are reliable at scale' },
    { sym: 'Biased outputs', cause: 'Biased data', fix: 'Audit/mitigate bias; evaluate fairly' },
  ],

  perf: [
    'Match the model to accuracy needs, data and compute.',
    'Add aspect-based sentiment for actionable insight.',
    'Aggregate at scale — trends are reliable even when items err.',
    'Handle negation/context with a context-aware model.',
  ],
  safety: [
    'Accuracy is never perfect (sarcasm/negation) — inform judgement, do not replace it.',
    'Trust aggregate trends over individual classifications for decisions.',
    'Watch for and mitigate bias inherited from training data.',
    'Analysing user text raises privacy obligations — handle lawfully.',
  ],
  maintenance: [
    'Refresh models/data as language and domains evolve.',
    'Re-test on hard cases (sarcasm/negation) and for bias.',
    'Update aspects and aggregation as products change.',
    'Monitor drift in sources and vocabulary.',
  ],
  future: [
    'Add emotion granularity (joy/anger/fear, etc.).',
    'Add multilingual and code-switching support.',
    'Add sarcasm-aware modelling and stance detection.',
    'Add real-time streaming sentiment and alerting.',
  ],
  faq: [
    { q: 'What is sentiment analysis, technically?', a: 'A text-classification task: map a piece of text to a sentiment label (positive/negative/neutral, or finer emotions). The value comes from doing it at scale and aggregating the results.' },
    { q: 'What is aspect-based sentiment?', a: 'Attributing sentiment to specific aspects rather than the whole text. "Great camera, terrible battery, overpriced" is positive about the camera and negative about battery and price — far more actionable than one overall label.' },
    { q: 'Why does it struggle with sarcasm and negation?', a: 'Sarcasm inverts surface sentiment ("oh great, another crash" is negative despite "great"), and negation flips polarity ("not bad" is positive). Lexicon and bag-of-words methods especially miss these; context-aware models handle them better but not perfectly.' },
    { q: 'Can I trust the results if individual labels err?', a: 'Trust the aggregate. Individual misclassifications from sarcasm or negation wash out over thousands of texts, so the trend — which is what most decisions need — is reliable even when single labels occasionally miss.' },
    { q: 'Which model should I use?', a: 'It depends on the trade-off: lexicon methods are fast and transparent but shallow; TF-IDF classifiers learn from data but ignore context; fine-tuned transformers are most accurate on hard cases but need more compute and data. Match the choice to your accuracy needs and resources.' },
  ],
  refs: [
    { t: 'Sentiment analysis', u: 'https://en.wikipedia.org/wiki/Sentiment_analysis', s: 'Reference' },
    { t: 'Text classification', u: 'https://en.wikipedia.org/wiki/Document_classification', s: 'Reference' },
    { t: 'Aspect-based sentiment analysis', u: 'https://en.wikipedia.org/wiki/Sentiment_analysis#Feature/aspect-based', s: 'Reference' },
    { t: 'Transformers (NLP)', u: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)', s: 'Reference' },
    { t: 'TF-IDF', u: 'https://en.wikipedia.org/wiki/Tf%E2%80%93idf', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'retail'],
  imageCaptions: [
    'A sentiment engine mines opinion and emotion from mountains of reviews and posts — a measurable pulse of feeling.',
    'Aspect-based sentiment attributes opinion to specific features, turning a coarse label into actionable insight.',
    'Sarcasm and negation defeat naïve models — accuracy is good but never perfect, so trust aggregates at scale.',
  ],
},

];
