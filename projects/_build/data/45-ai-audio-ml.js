/* AI — Speech/Audio (A17–A18) + Predictive (A19). Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   A17 — Speech-to-Text Transcriber
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A17',
  domainKey: 'ai',
  emoji: '🎧', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'Real-time transcription with speaker diarization — converting speech to text and labelling who said what across a meeting.',
  platformName: 'CPU/GPU workstation or server (+ ASR API optional)',
  ide: 'Python 3.11 + ASR / diarization',

  overview: [
    'Turning speech into text — <b>automatic speech recognition (ASR)</b> — underpins captions, voice notes, meeting records and accessibility, and modern models have made it remarkably good. This project builds a transcriber that goes beyond raw transcription to answer the question a meeting record actually needs: not just <i>what</i> was said, but <b>who said it</b>. It combines <b>real-time transcription</b> with <b>speaker diarization</b> — segmenting the audio by speaker so the transcript reads "Alice: … / Bob: …" rather than an undifferentiated wall of text.',
    'Two capabilities work together. <b>Transcription (ASR)</b> converts the audio to words, ideally in <b>real time</b> (streaming) so captions appear as people speak. <b>Diarization</b> answers "who spoke when" by detecting speaker changes and clustering the speech into distinct speakers — typically by turning each snippet of voice into a <b>voice embedding</b> and grouping similar-sounding segments together. Fused, they produce a speaker-attributed transcript. The system also handles the practicalities of real audio: streaming for low latency, and robustness to the messiness of real meetings.',
    'The value is usable meeting records, searchable and attributed, plus captions and accessibility. It is honest about the genuinely hard parts of real-world speech: <b>overlapping speech</b> (people talking over each other defeats diarization), <b>background noise</b>, <b>accents and domain vocabulary</b>, poor microphones, and knowing <b>how many speakers</b> there are; accuracy (word error rate) and diarization quality both degrade in the wild, and the streaming-vs-accuracy trade-off is real. There are also <b>privacy</b> obligations — recording and transcribing people\'s speech needs consent and care. Built honestly — strong ASR, embedding-based diarization, streaming, and realistic about noise and overlap — it is both a genuinely useful transcription tool and a rich lesson in combining two speech-AI capabilities into a practical system.',
  ],
  does: [
    'Transcribes speech to text in real time',
    'Diarizes — labels who said what',
    'Segments and clusters audio by speaker (voice embeddings)',
    'Produces speaker-attributed transcripts',
    'Streams for low-latency captions',
    'Supports meeting records, captions, accessibility',
    'Handles (imperfectly) noise, accents and overlap',
  ],
  features: [
    'ASR (speech-to-text), streaming',
    'Speaker diarization (who spoke when)',
    'Voice-embedding speaker clustering',
    'Speaker-attributed transcripts',
    'Real-time / batch modes',
    'Robustness handling (noise/accents)',
    'Honest about overlap, noise and privacy',
  ],
  applications: [
    { t: 'Meeting transcription', d: 'Attributed, searchable meeting records.' },
    { t: 'Captions / accessibility', d: 'Live captions for talks and calls.' },
    { t: 'Interview / media', d: 'Transcribing multi-speaker recordings.' },
    { t: 'Voice notes / dictation', d: 'Speech-to-text capture.' },
  ],
  skills: [
    'Automatic speech recognition (streaming)',
    'Speaker diarization and voice embeddings',
    'Clustering speech segments by speaker',
    'Fusing ASR + diarization into transcripts',
    'Handling noise/overlap and privacy',
  ],
  prereq: [
    'A meeting record needs who said what, not just what was said.',
    'Diarization clusters voice embeddings to separate speakers.',
    'Streaming trades some accuracy for low latency.',
    'Overlap, noise and accents are genuinely hard; privacy matters.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute + ASR model', spec: 'CPU/GPU; a streaming ASR model (local/API)', qty: 1, price: 0 },
    { name: 'Diarization model', spec: 'Voice-embedding + clustering for speakers', qty: 1, price: 0 },
    { name: 'Microphone/audio', spec: 'Good mic(s) for meetings (quality matters)', qty: 1, price: 0 },
    { name: 'Consent/privacy tooling', spec: 'Recording consent and secure storage', qty: 1, price: 0, note: 'Recording speech needs consent' },
  ],
  cost: 'Software; compute/API-dependent',
  libs: ['python', 'torch', 'transformers', 'numpy', 'sklearn'],
  hardwareNotes: [
    'This is a pure-software speech system — no electronic hardware beyond a microphone to specify. The "platform" is a computer plus ASR/diarization models: a GPU (local models) or a hosted ASR API handles recognition, and a CPU handles diarization clustering and streaming.',
    'Audio-capture quality (mic, room) strongly affects accuracy. Memory scales with audio length and model size; a deployment adds capture, a transcript store and consent/privacy tooling. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the transcription data flow — meeting audio is transcribed by ASR and, in parallel, diarized into speakers; the two are fused into a speaker-attributed transcript, streamed in real time.',
  pins: {
    left: [
      { dev: 'Audio', devPin: 'mic/stream', pin: '—', sig: 'Speech in' },
      { dev: 'ASR', devPin: 'transcribe', pin: '—', sig: 'Words' },
    ],
    right: [
      { dev: 'Diarization', devPin: 'who-when', pin: '—', sig: 'Speaker segments' },
      { dev: 'Transcript', devPin: 'fuse', pin: '—', sig: 'Alice: … / Bob: …' },
    ],
  },
  wiringNotes: [
    'Capture meeting audio (good microphones help a lot).',
    'Transcribe with ASR (streaming for real-time captions).',
    'Diarize: segment and cluster by speaker (voice embeddings).',
    'Fuse ASR text with speaker segments into an attributed transcript.',
    'Handle noise/overlap as best possible; obtain consent to record.',
  ],

  block: { columns: [
    { label: 'Audio', edge: 'right', blocks: [
      { name: 'Meeting audio', sub: 'stream', highlight: true },
    ] },
    { label: 'Recognise', edge: 'right', blocks: [
      { name: 'ASR', sub: 'words', highlight: true },
      { name: 'Diarize', sub: 'who-when' },
    ] },
    { label: 'Fuse', edge: 'right', blocks: [
      { name: 'Attribute', sub: 'text→speaker', highlight: true },
    ] },
    { label: 'Output', edge: 'none', blocks: [
      { name: 'Transcript', sub: 'Alice:/Bob:' },
      { name: 'Captions', sub: 'real-time' },
    ] },
  ] },
  flow: [
    { t: 'Capture/stream meeting audio', k: 'start' },
    { t: 'ASR → text (streaming)', k: 'proc' },
    { t: 'Diarize → speaker segments', k: 'proc' },
    { t: 'Fuse text with speakers', k: 'proc' },
    { t: 'Overlapping speech?', k: 'dec', yes: 'Best-effort attribution (hard)', no: 'Attribute cleanly' },
    { t: 'Best-effort attribution (hard)', k: 'io' },
    { t: 'Attribute cleanly', k: 'io' },
    { t: 'Emit attributed transcript', k: 'end', back: 'Capture/stream meeting audio' },
  ],

  principle: [
    'Raw transcription answers "what was said"; a <b>useful meeting record</b> answers "who said what". A wall of unattributed text is far less usable than a transcript that reads "Alice: … / Bob: …", because attribution is what makes a record searchable, followable and actionable. So this project deliberately combines two distinct speech-AI capabilities — <b>recognition</b> and <b>diarization</b> — because each alone is insufficient for the goal.',
    '<b>Automatic speech recognition</b> converts audio to words, and modern models do this well. The important practical dimension is <b>streaming</b>: for live captions the system must transcribe <i>as people speak</i>, emitting text with low latency, which trades a little accuracy against immediacy (a batch model that sees the whole utterance is generally more accurate than one forced to commit word-by-word). ASR quality is measured by <b>word error rate</b>, and it degrades with noise, accents and unfamiliar vocabulary.',
    '<b>Speaker diarization</b> is the "who spoke when" half, and it works quite differently from recognition. Rather than understanding words, it analyses <b>voice characteristics</b>: the audio is segmented at speaker changes, each segment is turned into a <b>voice embedding</b> (a vector capturing that voice\'s timbre), and segments are <b>clustered</b> so that all the segments from one person group together and get a consistent speaker label. Diarization does not need to know <i>who</i> the speakers are by name — it separates them into "Speaker 1, Speaker 2, …" by voice similarity. <b>Fusing</b> the two — aligning ASR words in time with diarization\'s speaker segments — produces the attributed transcript that is the whole point.',
    'The honesty this project requires is that <b>real-world speech is messy in ways that specifically break these systems</b>. The hardest is <b>overlapping speech</b>: when two people talk at once, diarization (and ASR) struggle badly, because the "who is speaking" signal is genuinely ambiguous — and meetings are full of interruptions and cross-talk. <b>Background noise</b>, <b>poor microphones</b>, strong <b>accents</b> and <b>domain-specific vocabulary</b> all raise word error rate; and knowing <b>how many speakers</b> there are (or handling people joining/leaving) is itself hard. So both word accuracy and diarization quality <b>degrade in the wild</b>, and the streaming-vs-accuracy tension is real — a system tuned for live captions is not the same as one tuned for a perfect after-the-fact transcript. There is also a serious <b>privacy</b> dimension: recording and transcribing people\'s speech is capturing personal data and generally requires <b>consent</b> and careful, secure handling. Built with strong streaming ASR, embedding-based diarization, and clear eyes about noise, overlap and privacy, the transcriber delivers real value — attributed, searchable records and live captions — while teaching how to combine two speech capabilities into a practical, honestly-bounded system.',
  ],
  equations: [
    { t: 'Recognition (ASR)', eq: 'ASR(audio) → words (+ timings)\n\nStreaming: emit text with low latency (trades some accuracy).\nQuality = word error rate (WER); worse with noise/accents.' },
    { t: 'Diarization (who spoke when)', eq: 'segment audio at speaker changes\nfor each segment: v = voice_embedding(segment)\ncluster {v} → speaker labels (Speaker 1, 2, ...)\n\nSeparates speakers by VOICE similarity, not by name.' },
    { t: 'Fusion → attributed transcript', eq: 'align ASR words (by time) with speaker segments\n→ "Alice: ...", "Bob: ..."\n\nOverlapping speech breaks this — the who-is-speaking signal\nbecomes ambiguous when people talk at once.' },
  ],

  ai: {
    task: 'Transcribe speech to text (streaming) and diarize speakers via voice-embedding clustering, fusing them into a speaker-attributed transcript, robust as possible to real-meeting conditions.',
    dataset: [
      'ASR and diarization typically use pretrained models; the "data" at use time is the meeting audio. Domain vocabulary and speaker/voice variety affect quality.',
      'Noise, accent and overlap coverage in the models\' training data shape real-world robustness.',
    ],
    datasetTable: [
      { n: 'ASR model (pretrained)', size: 'Large', lic: 'Model terms', use: 'Speech-to-text' },
      { n: 'Speaker-embedding model', size: 'Large', lic: 'Model terms', use: 'Voice embeddings for diarization' },
      { n: 'Domain vocabulary/lexicon', size: 'Small', lic: 'Yours', use: 'Reduce WER on jargon' },
      { n: 'Noisy/overlap test audio', size: 'Targeted', lic: 'Consented', use: 'Realistic evaluation' },
    ],
    preprocess: [
      'Capture/clean audio; segment into frames for streaming.',
      'Voice-activity detection; segment at speaker changes for diarization.',
      'Extract features/embeddings for ASR and speaker clustering.',
    ],
    pipeline: [
      { name: 'Audio', sub: 'stream', highlight: true },
      { name: 'ASR', sub: 'words' },
      { name: 'Embed voices', sub: 'segments' },
      { name: 'Cluster', sub: 'speakers', highlight: true },
      { name: 'Fuse', sub: 'attributed transcript' },
    ],
    archTable: [
      { l: 'ASR', s: 'streaming speech-to-text', p: 'Words (+ timings)' },
      { l: 'VAD/segmentation', s: 'detect speech/turns', p: 'Segments for diarization' },
      { l: 'Speaker embedder', s: 'voice → vector', p: 'Compare voices' },
      { l: 'Clustering', s: 'group segments by voice', p: 'Speaker labels' },
      { l: 'Fusion', s: 'align words + speakers', p: 'Attributed transcript' },
    ],
    hyper: [
      { k: 'Streaming latency', v: 'tuned', w: 'Immediacy vs accuracy' },
      { k: 'Num speakers', v: 'known/estimated', w: 'Clustering quality' },
      { k: 'Segment length', v: 'tuned', w: 'Turn resolution vs stability' },
      { k: 'Domain lexicon', v: 'optional', w: 'Jargon accuracy' },
    ],
    training: [
      'Use pretrained ASR and speaker-embedding models; tune thresholds/clustering.',
      'Optionally adapt vocabulary for the domain; evaluate on realistic (noisy/overlapping) audio.',
      'Balance streaming latency against accuracy for the use case.',
    ],
    metricsIntro: [
      'ASR is measured by word error rate and diarization by diarization error rate — both degrade with noise and, especially, overlapping speech.',
    ],
    metrics: [
      { m: 'Word error rate (WER)', v: 'condition-dependent', d: 'Transcription accuracy' },
      { m: 'Diarization error rate', v: 'condition-dependent', d: 'Who-spoke-when accuracy' },
      { m: 'Overlap handling', v: 'poor (honest)', d: 'The hardest case' },
      { m: 'Latency (streaming)', v: 'tuned', d: 'Live captions' },
    ],
    chart: { title: 'Where transcription degrades', unit: '%', desc: 'Clean single-speaker audio is strong; noise and especially overlapping speech degrade both ASR and diarization (illustrative).', bars: [
      { label: 'Clean, one speaker', value: 94 },
      { label: 'Clean, multi-speaker', value: 85 },
      { label: 'Noisy', value: 72 },
      { label: 'Overlapping speech', value: 50 },
    ] },
    inference: { file: 'transcribe.py', lang: 'python', body: `def transcribe_meeting(audio, asr, embed, cluster):
    words = asr.stream(audio)                  # ASR: what was said (streaming)

    # Diarization: who spoke when
    segments = segment_by_turns(audio)         # split at speaker changes
    embs = [embed(s) for s in segments]        # voice embeddings
    speakers = cluster(embs)                   # group segments by voice

    # Fuse: align words with speaker segments
    transcript = []
    for w in words:
        spk = speaker_at(w.time, segments, speakers)   # who was speaking then
        transcript.append({"speaker": spk, "text": w.text, "t": w.time})
    return transcript                          # "Alice: ...", "Bob: ..."
    # Overlapping speech, noise and accents degrade this; get consent to record.` },
    limits: [
      'Overlapping speech is very hard for both ASR and diarization.',
      'Noise, accents, poor mics and domain jargon raise word error rate.',
      'Estimating the number of speakers (and joins/leaves) is hard.',
      'Recording/transcribing speech is personal data — needs consent and care.',
    ],
  },

  assembly: [
    { h: 'Set up streaming ASR', p: [
      'Capture audio and transcribe it with a streaming ASR model for low-latency text.',
    ], warn: 'Real meetings are messy: overlapping speech, noise, accents and jargon all degrade accuracy, and overlapping speech is especially hard. Recording and transcribing people\'s speech is personal data — obtain consent and handle it securely.' },
    { h: 'Add speaker diarization', p: [
      'Segment the audio, embed each segment\'s voice, and cluster segments into speakers.',
    ] },
    { h: 'Fuse into an attributed transcript', p: [
      'Align ASR words with speaker segments to produce "who said what", handling overlap as best possible.',
    ] },
  ],
  steps: [
    { h: 'Transcribe, diarize and attribute', p: [
      'Run ASR for words and diarization for speakers, then align words to speakers into an attributed transcript.',
    ], code: {
      file: 'transcribe.py', lang: 'python',
      body: `def transcribe(audio, asr, embed, cluster):
    words = asr.stream(audio)                  # what was said (streaming)

    segments = segment_by_turns(audio)         # who-when: split at changes
    speakers = cluster([embed(s) for s in segments])   # cluster voice embeddings

    out = []
    for w in words:                            # fuse words with speakers
        spk = speaker_at(w.time, segments, speakers)
        out.append({"speaker": spk, "text": w.text})
    return out                                 # "Alice: ...", "Bob: ..."`,
      explain: [
        { ref: 'words = asr.stream(audio)                  # what was said (streaming)', txt: 'Streaming ASR emits words with low latency for live captions — the recognition half.' },
        { ref: 'speakers = cluster([embed(s) for s in segments])   # cluster voice embeddings', txt: 'Diarization turns each segment into a voice embedding and clusters by voice similarity, separating speakers without knowing their names.' },
        { ref: 'spk = speaker_at(w.time, segments, speakers)', txt: 'Fusion aligns each word in time with the speaker who was talking then — producing attribution.' },
        { ref: 'return out                                 # "Alice: ...", "Bob: ..."', txt: 'The result is a speaker-attributed transcript — the usable meeting record that is the goal.' },
      ],
    } },
    { h: 'Handle overlap, noise and consent', p: [
      'Attribute overlapping speech on a best-effort basis, mitigate noise, and ensure recording consent and secure handling.',
    ], tip: 'Overlapping speech is the killer case — when two people talk at once, both ASR and diarization degrade sharply. Good microphones and turn-taking help more than any post-processing.' },
  ],

  code: [{
    file: 'transcriber.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Speech-to-Text Transcriber with Diarization

Combines streaming ASR (what was said) with speaker DIARIZATION (who
said it) — voice-embedding clustering — into a speaker-attributed
transcript. Overlapping speech, noise and accents degrade it; recording
speech is personal data requiring consent and secure handling.
"""
class Transcriber:
    def __init__(self, asr, embedder, cluster):
        self.asr = asr; self.embed = embedder; self.cluster = cluster

    def transcribe(self, audio, stream=True):
        # 1) ASR — words with timings (streaming for live captions)
        words = self.asr.stream(audio) if stream else self.asr.batch(audio)

        # 2) Diarization — who spoke when
        segments = segment_by_turns(audio)             # split at speaker changes
        embs = [self.embed(s.audio) for s in segments]  # voice embeddings
        labels = self.cluster(embs)                     # cluster by voice

        # 3) Fuse — align words to the speaker talking at that time
        transcript = []
        for w in words:
            spk = label_at(w.time, segments, labels)    # best-effort in overlap
            transcript.append({"speaker": spk, "text": w.text, "t": round(w.time, 2)})
        return transcript                               # "Alice: ...", "Bob: ..."

if __name__ == "__main__":
    tr = Transcriber(StreamingASR(), SpeakerEmbedder(), cluster_speakers)
    for line in tr.transcribe(meeting_audio()):
        print(f'{line["speaker"]}: {line["text"]}')
    # Overlap/noise/accents degrade quality; obtain consent to record.`,
    explain: [
      { ref: 'words = self.asr.stream(audio) if stream else self.asr.batch(audio)', txt: 'Streaming gives low-latency captions; batch is more accurate — the real streaming-vs-accuracy trade-off exposed as an option.' },
      { ref: 'embs = [self.embed(s.audio) for s in segments]  # voice embeddings', txt: 'Diarization represents each segment by its voice timbre, the basis for separating speakers.' },
      { ref: 'labels = self.cluster(embs)                     # cluster by voice', txt: 'Clustering groups segments from the same voice, assigning consistent speaker labels.' },
      { ref: 'spk = label_at(w.time, segments, labels)    # best-effort in overlap', txt: 'Words are attributed by aligning time with speaker segments — best-effort where speech overlaps, the hardest case.' },
      { ref: '# Overlap/noise/accents degrade quality; obtain consent to record.', txt: 'The honest limits and the consent obligation are stated in the code.' },
    ],
  }],

  config: [
    'Configure the ASR model and streaming latency.',
    'Configure diarization (segmentation, embeddings, clustering, speaker count).',
    'Configure fusion/attribution and output format.',
    'Configure consent, secure storage and retention.',
  ],
  calibration: [
    { h: 'ASR accuracy', p: [
      'Measure WER on representative audio; adapt vocabulary for the domain.',
    ] },
    { h: 'Diarization', p: [
      'Tune segmentation/clustering and speaker count; evaluate on multi-speaker audio.',
    ] },
    { h: 'Latency vs accuracy', p: [
      'Balance streaming latency against accuracy for the use case.',
    ] },
  ],
  testing: [
    { step: 'Transcribe clean single-speaker audio', expect: 'Accurate text' },
    { step: 'Multi-speaker meeting', expect: 'Attributed transcript (who said what)' },
    { step: 'Overlapping speech', expect: 'Degrades — the hard case' },
    { step: 'Add background noise', expect: 'Higher WER — note the limit' },
    { step: 'Stream live', expect: 'Low-latency captions (some accuracy trade-off)' },
    { step: 'Check consent/handling', expect: 'Consent obtained; audio secured' },
  ],
  output: [
    'A speaker-attributed transcript (and live captions) from meeting audio.',
    { file: 'transcript.json', lang: 'json', body: `[
  { "speaker": "Speaker 1", "text": "Let's start with the budget.", "t": 0.4 },
  { "speaker": "Speaker 2", "text": "Sure, revenue is up this quarter.", "t": 3.1 },
  { "speaker": "Speaker 1", "text": "Good — any risks?", "t": 6.0 }
]` },
    'A speaker-attributed transcript — who said what, with timings — far more usable than an undifferentiated wall of text; overlapping speech would have degraded the attribution.',
  ],
  troubleshoot: [
    { sym: 'Wrong speaker labels', cause: 'Diarization/clustering', fix: 'Tune segmentation/clustering; set/estimate speaker count' },
    { sym: 'High word error rate', cause: 'Noise/accents/jargon', fix: 'Better mic; domain lexicon; less streaming pressure' },
    { sym: 'Breaks on overlap', cause: 'Overlapping speech', fix: 'Encourage turn-taking; better mics; accept the limit' },
    { sym: 'Too much latency', cause: 'Batch/heavy model', fix: 'Use streaming ASR; tune latency' },
    { sym: 'Too many/few speakers', cause: 'Count estimation', fix: 'Provide/estimate number of speakers' },
    { sym: 'Privacy concern', cause: 'Recording without consent', fix: 'Obtain consent; secure and retention-limit audio/transcripts' },
  ],

  perf: [
    'Use streaming ASR for live captions; batch for max accuracy.',
    'Diarize with voice embeddings + clustering; set/estimate speaker count.',
    'Improve capture (mics) — it beats post-processing for noise/overlap.',
    'Balance latency vs accuracy for the use case.',
  ],
  safety: [
    'Recording and transcribing speech is personal data — obtain consent and handle it securely with retention limits.',
    'Accuracy degrades with noise, accents and overlap — do not treat transcripts as perfect records.',
    'Be transparent that a meeting is being transcribed.',
    'Secure transcripts and audio against unauthorised access.',
  ],
  maintenance: [
    'Update ASR/diarization models as they improve.',
    'Adapt vocabulary for changing domains.',
    'Re-evaluate WER/diarization on real audio.',
    'Review consent and data-handling practices.',
  ],
  future: [
    'Add speaker identification (names, with enrolment/consent).',
    'Add overlap-aware diarization/separation.',
    'Add punctuation, summaries and action-item extraction.',
    'Add multilingual transcription.',
  ],
  faq: [
    { q: 'What is diarization?', a: 'Working out "who spoke when". It segments the audio at speaker changes, turns each segment into a voice embedding, and clusters them so segments from the same voice get a consistent speaker label — separating speakers by voice, not by name.' },
    { q: 'Why combine ASR and diarization?', a: 'Because a useful meeting record needs both what was said (ASR) and who said it (diarization). Fusing them produces an attributed transcript ("Alice: … / Bob: …") that is far more usable and searchable than unattributed text.' },
    { q: 'Why is overlapping speech so hard?', a: 'When two people talk at once, both the words and the "who is speaking" signal become ambiguous, so ASR and diarization degrade sharply. Meetings full of interruptions are the hardest case — good microphones and turn-taking help more than any post-processing.' },
    { q: 'What is the streaming trade-off?', a: 'Streaming emits text as people speak (low latency, live captions) but is generally less accurate than a batch model that sees the whole utterance before committing. You tune the balance to the use case.' },
    { q: 'What about privacy?', a: 'Recording and transcribing people\'s speech captures personal data and generally requires consent and careful, secure handling with retention limits — and transparency that transcription is happening.' },
  ],
  refs: [
    { t: 'Speech recognition', u: 'https://en.wikipedia.org/wiki/Speech_recognition', s: 'Reference' },
    { t: 'Speaker diarisation', u: 'https://en.wikipedia.org/wiki/Speaker_diarisation', s: 'Reference' },
    { t: 'Speaker embeddings', u: 'https://en.wikipedia.org/wiki/Speaker_recognition', s: 'Reference' },
    { t: 'Word error rate', u: 'https://en.wikipedia.org/wiki/Word_error_rate', s: 'Reference' },
    { t: 'Voice activity detection', u: 'https://en.wikipedia.org/wiki/Voice_activity_detection', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'health'],
  imageCaptions: [
    'A speech-to-text transcriber with diarization records not just what was said but who said it.',
    'Diarization clusters voice embeddings to separate speakers, then fuses with ASR into an attributed transcript.',
    'Overlapping speech and noise are the hard cases — real meetings degrade both recognition and diarization.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A18 — Music Genre Classifier
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A18',
  domainKey: 'ai',
  emoji: '🎵', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Classifies songs into genres from their audio — turning sound into features (or spectrograms) a model can learn to tell rock from jazz.',
  platformName: 'CPU/GPU workstation or server',
  ide: 'Python 3.11 + audio ML (librosa/PyTorch)',

  overview: [
    'Sorting music into genres — rock, jazz, classical, hip-hop, electronic — is a classic and approachable machine-learning problem that teaches the whole craft of <b>audio classification</b>. This project builds a model that listens to a song (or a clip) and predicts its <b>genre</b> from the audio itself, learning the sonic signatures that distinguish styles: rhythm and tempo, instrumentation and timbre, harmonic content and energy.',
    'The core lesson is that you cannot feed raw audio waveforms straight to a classifier effectively — you must first turn sound into <b>meaningful features</b>. There are two classic routes. The first extracts <b>hand-crafted audio features</b> — <b>MFCCs</b> (capturing timbre), tempo, spectral properties, chroma (harmony), zero-crossing rate — and feeds them to a classifier. The second turns the audio into a <b>spectrogram</b> (a picture of frequency content over time) and treats genre classification as an <b>image classification</b> problem with a CNN, since a spectrogram <i>looks</i> different for different genres. Both work; the feature-based route is transparent and light, the spectrogram-CNN route is powerful and reuses image-model machinery.',
    'The value is a hands-on introduction to audio ML — feature extraction, spectrograms, and classification — with an intuitive, fun task and famous datasets (like GTZAN). It is honest that <b>genre is fuzzy</b>: genres overlap, blend and are partly subjective and cultural, so there is no perfect ground truth and even humans disagree on boundary cases; benchmark datasets (GTZAN especially) have known <b>flaws and biases</b> that inflate scores; and models can latch onto <b>production artefacts</b> rather than musical content. So accuracy is meaningful but not absolute, and the interesting cases are the ambiguous ones. Built honestly — feature or spectrogram-based, with realistic expectations about fuzzy labels — it is both a satisfying project and the clearest lesson in turning audio into something a model can classify.',
  ],
  does: [
    'Classifies songs/clips into music genres from audio',
    'Extracts audio features (MFCC, tempo, spectral, chroma)',
    'Or uses spectrograms + a CNN (audio as images)',
    'Learns sonic signatures of genres',
    'Outputs genre with confidence',
    'Teaches audio feature extraction and classification',
    'Handles fuzzy, overlapping genre labels honestly',
  ],
  features: [
    'Hand-crafted audio features + classifier',
    'Spectrogram + CNN (image-style) route',
    'Genre prediction with confidence',
    'Feature-vs-spectrogram comparison',
    'Works on clips or full tracks',
    'Uses classic datasets (e.g. GTZAN)',
    'Honest about fuzzy labels and dataset flaws',
  ],
  applications: [
    { t: 'Music organisation / tagging', d: 'Auto-tagging tracks by genre.' },
    { t: 'Recommendation features', d: 'Genre signals for music discovery.' },
    { t: 'Audio-ML education', d: 'Learning feature extraction and classification.' },
    { t: 'Music analysis', d: 'Studying sonic characteristics of styles.' },
  ],
  skills: [
    'Audio feature extraction (MFCC, tempo, spectral, chroma)',
    'Spectrograms and audio-as-image CNNs',
    'Classification and evaluation (accuracy, confusion)',
    'Handling fuzzy/overlapping labels',
    'Dataset awareness (GTZAN flaws)',
  ],
  prereq: [
    'You must turn raw audio into features (or spectrograms) — not feed waveforms directly.',
    'Two routes: hand-crafted features + classifier, or spectrogram + CNN.',
    'Genre is fuzzy and subjective — no perfect ground truth.',
    'Benchmark datasets (GTZAN) have known flaws that inflate scores.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute', spec: 'CPU for features; GPU for spectrogram CNNs', qty: 1, price: 0 },
    { name: 'Audio-ML libraries', spec: 'Feature extraction (MFCC/spectrogram) + models', qty: 1, price: 0 },
    { name: 'Music dataset', spec: 'Genre-labelled audio (e.g. GTZAN) — note flaws', qty: 1, price: 0 },
    { name: 'Audio files', spec: 'Songs/clips to classify', qty: 1, price: 0 },
  ],
  cost: 'Software; compute-light to moderate',
  libs: ['python', 'librosa', 'torch', 'sklearn', 'numpy'],
  hardwareNotes: [
    'This is a pure-software audio-ML system — no electronic hardware to specify. The "platform" is a computer: a CPU handles feature extraction and classical models; a GPU accelerates spectrogram-CNN training.',
    'Memory scales with audio length and batch size; storage holds the audio dataset and features/spectrograms. A deployment adds an upload/classify UI. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the classification data flow — audio is converted into features (or a spectrogram) and passed to a classifier (or CNN) that predicts the genre.',
  pins: {
    left: [
      { dev: 'Audio', devPin: 'clip/track', pin: '—', sig: 'Sound in' },
      { dev: 'Features / spectrogram', devPin: 'extract', pin: '—', sig: 'Model input' },
    ],
    right: [
      { dev: 'Classifier / CNN', devPin: 'predict', pin: '—', sig: 'Genre' },
      { dev: 'Output', devPin: 'label', pin: '—', sig: 'Genre + confidence' },
    ],
  },
  wiringNotes: [
    'Take an audio clip or track as input.',
    'Extract features (MFCC/tempo/spectral/chroma) OR compute a spectrogram.',
    'Feed features to a classifier, or the spectrogram to a CNN.',
    'Output the predicted genre with confidence.',
    'Remember genre labels are fuzzy — ambiguous tracks are expected.',
  ],

  block: { columns: [
    { label: 'Audio', edge: 'right', blocks: [
      { name: 'Song/clip', sub: 'waveform', highlight: true },
    ] },
    { label: 'Represent', edge: 'right', blocks: [
      { name: 'Features', sub: 'MFCC/tempo', highlight: true },
      { name: 'or Spectrogram', sub: 'image' },
    ] },
    { label: 'Classify', edge: 'right', blocks: [
      { name: 'Classifier/CNN', sub: 'genre', highlight: true },
    ] },
    { label: 'Output', edge: 'none', blocks: [
      { name: 'Genre', sub: 'confidence' },
      { name: 'Fuzzy', sub: 'overlaps' },
    ] },
  ] },
  flow: [
    { t: 'Take an audio clip', k: 'start' },
    { t: 'Feature route or spectrogram route?', k: 'dec', yes: 'Extract features (MFCC/tempo…)', no: 'Compute spectrogram' },
    { t: 'Extract features (MFCC/tempo…)', k: 'proc' },
    { t: 'Compute spectrogram', k: 'proc' },
    { t: 'Classifier / CNN → genre probs', k: 'proc' },
    { t: 'Output genre + confidence', k: 'end', back: 'Take an audio clip' },
  ],

  principle: [
    'Music-genre classification is the ideal first <b>audio machine-learning</b> project because it makes the field\'s central lesson unavoidable: <b>you cannot learn effectively from raw audio waveforms</b>. A waveform is a long, high-rate sequence of amplitude samples with the musically meaningful information (rhythm, timbre, harmony) buried in its frequency structure over time, not visible in the raw samples. The whole art of audio ML is <b>transforming sound into a representation that exposes what matters</b>, and this project teaches exactly that transformation, twice.',
    'The <b>first route</b> extracts <b>hand-crafted features</b> that summarise musically relevant properties. <b>MFCCs</b> (mel-frequency cepstral coefficients) capture <b>timbre</b> — the "colour" of the sound that distinguishes a distorted guitar from a piano — and are the workhorse audio feature. <b>Tempo</b> and rhythmic features capture the beat; <b>spectral</b> features (centroid, rolloff) capture brightness and energy distribution; <b>chroma</b> captures harmonic/pitch content. Feed a vector of these to a standard classifier and it can learn that, say, high tempo plus certain spectral energy plus particular timbres tends to mean one genre. This route is <b>transparent and lightweight</b>, and it teaches which acoustic properties define genres.',
    'The <b>second route</b> reframes the problem as <b>image classification</b>. Compute a <b>spectrogram</b> — a 2-D image with time on one axis, frequency on the other, and intensity as colour — and a genre\'s characteristic patterns (a four-on-the-floor kick, dense orchestral harmonics, a hip-hop beat) literally <b>look different</b> in the image. So you can feed the spectrogram to a <b>CNN</b>, exactly as in image classification (project A07), letting the network learn the discriminative visual-audio patterns itself. This route is more <b>powerful</b> and elegantly reuses image-model machinery, which is why the "audio as spectrogram images" trick is so widely used across audio AI.',
    'The honesty this project needs is about the <b>fuzziness of the label itself</b>, which is more fundamental than the usual accuracy caveats. <b>Genre is not a clean, objective category</b>: genres <b>overlap and blend</b> (where exactly does rock become metal, or pop become electronic?), they are partly <b>subjective and cultural</b>, and songs deliberately cross boundaries — so there is <b>no perfect ground truth</b>, and even <b>human experts disagree</b> on boundary cases. This means a genre classifier can never be "perfectly accurate", because the target is itself blurry, and the <b>interesting cases are precisely the ambiguous ones</b>. Compounding this, the famous benchmark datasets — <b>GTZAN</b> above all — have well-documented <b>flaws</b> (duplicate/mislabelled tracks, artist repetition across splits) that <b>inflate reported accuracy</b>, and models can cheat by latching onto <b>production or recording artefacts</b> rather than musical content. So results should be read with realism: accuracy is meaningful but not absolute, and clean-looking benchmark numbers may not reflect real generalisation. Built with either representation route and clear eyes about fuzzy labels and dataset flaws, the classifier is a genuinely satisfying project and the clearest possible lesson in the foundational move of audio ML — turning sound into features (or spectrograms) a model can learn from.',
  ],
  equations: [
    { t: 'Represent audio (the key move)', eq: 'Route 1 (features):  audio → [MFCCs, tempo, spectral, chroma]\nRoute 2 (spectrogram): audio → time×frequency image\n\nYou CANNOT feed raw waveforms effectively — represent first.' },
    { t: 'Classify', eq: 'Route 1: classifier(features) → genre probabilities\nRoute 2: CNN(spectrogram) → genre probabilities   (audio as images)\n\ngenre = argmax(probs); confidence = max(probs).' },
    { t: 'Genre is fuzzy (be honest)', eq: 'genres overlap/blend; partly subjective/cultural\n  → no perfect ground truth; humans disagree on edges\nGTZAN etc. have flaws (dupes, artist leakage) → inflated scores\n\nAccuracy is meaningful, not absolute; ambiguous cases are the point.' },
  ],

  ai: {
    task: 'Classify audio into music genres via either hand-crafted features + a classifier or spectrograms + a CNN, honest about fuzzy genre labels and benchmark-dataset flaws.',
    dataset: [
      'Genre-labelled audio (e.g. GTZAN, FMA). GTZAN is classic but has documented flaws (duplicates, mislabels, artist leakage) that inflate scores.',
      'Balanced, clean, artist-disjoint splits matter for honest evaluation.',
    ],
    datasetTable: [
      { n: 'GTZAN', size: '1000 clips, 10 genres', lic: 'Research', use: 'Classic baseline (known flaws)' },
      { n: 'FMA (Free Music Archive)', size: 'Large', lic: 'CC (varies)', use: 'Larger, cleaner training' },
      { n: 'Your labelled audio', size: 'Yours', lic: 'Rights-cleared', use: 'Domain genres' },
      { n: 'Artist-disjoint splits', size: '—', lic: '—', use: 'Honest evaluation (no leakage)' },
    ],
    preprocess: [
      'Segment audio into clips; resample; normalise.',
      'Route 1: extract MFCC/tempo/spectral/chroma features.',
      'Route 2: compute (mel) spectrograms as model inputs.',
    ],
    pipeline: [
      { name: 'Audio', sub: 'clip', highlight: true },
      { name: 'Features', sub: 'MFCC/…' },
      { name: 'or Spectrogram', sub: 'image' },
      { name: 'Classifier/CNN', sub: 'predict', highlight: true },
      { name: 'Genre', sub: 'confidence' },
    ],
    archTable: [
      { l: 'Feature extractor', s: 'MFCC/tempo/spectral/chroma', p: 'Transparent audio features' },
      { l: 'Classifier', s: 'SVM/RF/MLP on features', p: 'Light, interpretable route' },
      { l: 'Spectrogram', s: 'mel time×freq image', p: 'Audio as image' },
      { l: 'CNN', s: 'image classifier on spectrogram', p: 'Powerful route' },
      { l: 'Eval', s: 'accuracy + confusion (clean splits)', p: 'Honest measurement' },
    ],
    hyper: [
      { k: 'Route', v: 'features / spectrogram', w: 'Transparency vs power' },
      { k: 'Clip length', v: '≈ 3–30 s', w: 'Context vs data' },
      { k: 'MFCC count', v: '≈ 13–40', w: 'Timbre detail' },
      { k: 'Split strategy', v: 'artist-disjoint', w: 'Avoid inflated scores' },
    ],
    training: [
      'Route 1: train a classifier on extracted features. Route 2: train/fine-tune a CNN on spectrograms.',
      'Use clean, artist-disjoint splits; do not trust GTZAN numbers naively.',
      'Inspect the confusion matrix — confusions are often between genuinely similar genres.',
    ],
    metricsIntro: [
      'Accuracy and the confusion matrix, read with realism: genre is fuzzy, so confusions between similar genres are expected, and benchmark scores can be inflated by dataset flaws.',
    ],
    metrics: [
      { m: 'Accuracy', v: 'dataset-dependent', d: 'Overall — read with care' },
      { m: 'Confusion matrix', v: 'inspect', d: 'Similar genres confused' },
      { m: 'Artist-disjoint accuracy', v: 'lower (honest)', d: 'Real generalisation' },
      { m: 'Feature vs spectrogram', v: 'compare', d: 'Route trade-off' },
    ],
    chart: { title: 'Genre confusability', unit: '%', desc: 'Distinct genres classify well; adjacent/blended genres are genuinely confusable — because genre itself is fuzzy (illustrative).', bars: [
      { label: 'Classical vs hip-hop', value: 96 },
      { label: 'Jazz vs blues', value: 74 },
      { label: 'Rock vs metal', value: 70 },
      { label: 'Pop vs electronic', value: 66 },
    ] },
    inference: { file: 'classify.py', lang: 'python', body: `import numpy as np, librosa

def features(path):                       # Route 1: hand-crafted features
    y, sr = librosa.load(path, duration=30)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20).mean(axis=1)  # timbre
    tempo = librosa.beat.tempo(y=y, sr=sr)                            # rhythm
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()  # brightness
    chroma = librosa.feature.chroma_stft(y=y, sr=sr).mean(axis=1)    # harmony
    return np.concatenate([mfcc, tempo, [centroid], chroma])

def classify(path, model, labels):
    probs = model.predict_proba([features(path)])[0]
    i = int(np.argmax(probs))
    return {"genre": labels[i], "confidence": float(probs[i])}
    # Genre is fuzzy — ambiguous tracks are expected; GTZAN scores can inflate.` },
    limits: [
      'Genre is fuzzy/subjective — no perfect ground truth; humans disagree on edges.',
      'Benchmark datasets (GTZAN) have flaws that inflate reported accuracy.',
      'Models can latch onto production artefacts, not musical content.',
      'Adjacent/blended genres are genuinely confusable.',
    ],
  },

  assembly: [
    { h: 'Represent audio as features or spectrograms', p: [
      'Choose a route: extract hand-crafted features (MFCC/tempo/spectral/chroma), or compute spectrograms for a CNN.',
    ], warn: 'You cannot classify raw waveforms directly — the whole point is representing audio well. And genre is fuzzy: there is no perfect ground truth, benchmark datasets like GTZAN have flaws that inflate scores, so read accuracy with realism.' },
    { h: 'Train and evaluate honestly', p: [
      'Train a classifier (features) or CNN (spectrograms) on clean, artist-disjoint splits, and inspect the confusion matrix.',
    ] },
    { h: 'Classify and interpret', p: [
      'Predict genre with confidence, and treat ambiguous/blended tracks as the interesting cases, not failures.',
    ] },
  ],
  steps: [
    { h: 'Extract features and classify', p: [
      'Turn audio into features (or a spectrogram) and predict the genre with confidence.',
    ], code: {
      file: 'genre.py', lang: 'python',
      body: `import numpy as np, librosa

def features(path):                        # represent audio (the key move)
    y, sr = librosa.load(path, duration=30)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20).mean(axis=1)   # timbre
    tempo = librosa.beat.tempo(y=y, sr=sr)                             # rhythm
    chroma = librosa.feature.chroma_stft(y=y, sr=sr).mean(axis=1)     # harmony
    return np.concatenate([mfcc, tempo, chroma])

def classify(path, model, labels):
    probs = model.predict_proba([features(path)])[0]
    i = int(np.argmax(probs))
    return {"genre": labels[i], "confidence": round(float(probs[i]), 2)}`,
      explain: [
        { ref: 'def features(path):                        # represent audio (the key move)', txt: 'The essential step: raw audio is turned into meaningful features, because a classifier cannot learn from waveforms directly.' },
        { ref: 'mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20).mean(axis=1)   # timbre', txt: 'MFCCs capture timbre — the sonic colour that distinguishes instruments and, in aggregate, genres.' },
        { ref: 'tempo = librosa.beat.tempo(y=y, sr=sr)                             # rhythm', txt: 'Tempo and rhythm features capture the beat, a strong genre signal.' },
        { ref: 'return {"genre": labels[i], "confidence": round(float(probs[i]), 2)}', txt: 'The prediction includes confidence, which is especially meaningful given how fuzzy genre boundaries are.' },
      ],
    } },
    { h: 'Compare routes and read results realistically', p: [
      'Optionally compare the feature route with a spectrogram CNN, and interpret accuracy knowing genre is fuzzy and datasets flawed.',
    ], tip: 'Use artist-disjoint splits and be sceptical of GTZAN numbers — much reported genre-classification accuracy is inflated by dataset leakage and flaws, not real generalisation.' },
  ],

  code: [{
    file: 'genre_classifier.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Music Genre Classifier

Classifies audio into genres by REPRESENTING sound as features
(MFCC/tempo/spectral/chroma) for a classifier, OR as spectrograms for a
CNN (audio as images). You cannot learn from raw waveforms directly.
Genre is FUZZY (no perfect ground truth); benchmark datasets (GTZAN)
have flaws that inflate scores — read accuracy with realism.
"""
import numpy as np, librosa

def extract_features(path):                 # Route 1: hand-crafted features
    y, sr = librosa.load(path, duration=30)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20).mean(axis=1)   # timbre
    tempo = librosa.beat.tempo(y=y, sr=sr)                             # rhythm
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()   # brightness
    chroma = librosa.feature.chroma_stft(y=y, sr=sr).mean(axis=1)     # harmony
    return np.concatenate([mfcc, tempo, [centroid], chroma])

def to_spectrogram(path):                   # Route 2: audio as image (for a CNN)
    y, sr = librosa.load(path, duration=30)
    return librosa.power_to_db(librosa.feature.melspectrogram(y=y, sr=sr))

class GenreClassifier:
    def __init__(self, model, labels, route="features"):
        self.model = model; self.labels = labels; self.route = route

    def classify(self, path):
        x = extract_features(path) if self.route == "features" else to_spectrogram(path)
        probs = self.model.predict_proba([x])[0] if self.route == "features" \\
                else self.model.predict(x[None])[0]
        i = int(np.argmax(probs))
        return {"genre": self.labels[i], "confidence": round(float(probs[i]), 2)}

if __name__ == "__main__":
    clf = GenreClassifier(trained_model, GENRES, route="features")
    print(clf.classify("track.mp3"))
    # Use artist-disjoint splits; be sceptical of inflated benchmark scores.`,
    explain: [
      { ref: 'def extract_features(path):                 # Route 1: hand-crafted features', txt: 'The feature route summarises timbre, rhythm, brightness and harmony — a transparent, lightweight representation.' },
      { ref: 'def to_spectrogram(path):                   # Route 2: audio as image (for a CNN)', txt: 'The spectrogram route turns audio into an image so an image-classifying CNN can learn genre patterns — reusing image-model machinery.' },
      { ref: 'x = extract_features(path) if self.route == "features" else to_spectrogram(path)', txt: 'Either representation feeds the classifier — the same task, two ways of exposing what matters in the sound.' },
      { ref: '# Use artist-disjoint splits; be sceptical of inflated benchmark scores.', txt: 'The honest evaluation caveat — dataset flaws inflate scores — is built into the code guidance.' },
    ],
  }],

  config: [
    'Configure the route (features vs spectrogram) and clip length.',
    'Configure feature set (MFCC count, tempo, spectral, chroma) or spectrogram params.',
    'Configure the classifier/CNN and genre labels.',
    'Configure clean, artist-disjoint dataset splits.',
  ],
  calibration: [
    { h: 'Representation', p: [
      'Verify features/spectrograms capture genre-relevant content; compare routes.',
    ] },
    { h: 'Evaluation', p: [
      'Use artist-disjoint splits; inspect the confusion matrix; be sceptical of inflated scores.',
    ] },
    { h: 'Confidence', p: [
      'Calibrate confidence; expect low confidence on ambiguous/blended tracks.',
    ] },
  ],
  testing: [
    { step: 'Classify a clear-genre track', expect: 'Correct genre, good confidence' },
    { step: 'Classify a blended track', expect: 'Ambiguous — lower confidence (expected)' },
    { step: 'Compare feature vs spectrogram routes', expect: 'Different trade-offs' },
    { step: 'Evaluate with artist-disjoint splits', expect: 'Lower but honest accuracy' },
    { step: 'Inspect confusion matrix', expect: 'Similar genres confused' },
    { step: 'Try GTZAN naively', expect: 'Inflated scores — note dataset flaws' },
  ],
  output: [
    'A predicted genre with confidence per track, read with realism about fuzzy labels.',
    { file: 'genre-result.json', lang: 'json', body: `{
  "track": "track.mp3",
  "genre": "jazz",
  "confidence": 0.71,
  "runner_up": "blues (0.22)",
  "note": "genre is fuzzy; jazz/blues genuinely overlap"
}` },
    'A track classified as jazz with blues a close runner-up — the model correctly reflecting that these genres genuinely overlap, exactly the kind of fuzzy boundary that makes genre classification interesting.',
  ],
  troubleshoot: [
    { sym: 'Poor accuracy', cause: 'Weak representation', fix: 'Better features/spectrograms; more data' },
    { sym: 'Suspiciously high accuracy', cause: 'Dataset leakage/flaws', fix: 'Artist-disjoint splits; distrust GTZAN numbers' },
    { sym: 'Confuses similar genres', cause: 'Genre fuzziness', fix: 'Expected; inspect confusion; accept ambiguity' },
    { sym: 'Learns artefacts not music', cause: 'Production cues', fix: 'Diverse data; check what the model keys on' },
    { sym: 'Overfitting', cause: 'Small dataset', fix: 'Augment; regularise; more data' },
    { sym: 'Slow on spectrograms', cause: 'CNN compute', fix: 'Use GPU; smaller model; feature route' },
  ],

  perf: [
    'Represent audio well (features or spectrograms) — the key move.',
    'Evaluate on clean, artist-disjoint splits; distrust inflated benchmarks.',
    'Inspect confusions; expect similar-genre overlap.',
    'Use GPU for spectrogram CNNs; feature route is lighter.',
  ],
  safety: [
    'Genre labels are fuzzy and subjective — do not present predictions as objective truth.',
    'Respect music copyright and licensing of any audio used.',
    'Benchmark scores can be inflated — report honest, leakage-free evaluation.',
    'Be aware models may key on artefacts rather than musical content.',
  ],
  maintenance: [
    'Refresh datasets and genres as needed; keep splits clean.',
    'Re-evaluate honestly as models change.',
    'Compare feature vs spectrogram routes over time.',
    'Watch for artefact-driven predictions.',
  ],
  future: [
    'Add multi-label / sub-genre and mood classification.',
    'Add larger, cleaner datasets (FMA) and audio transformers.',
    'Add explainability (what audio drove the prediction).',
    'Add streaming/real-time genre tagging.',
  ],
  faq: [
    { q: 'Why not feed raw audio to the model?', a: 'Because a waveform buries the musically meaningful information in its frequency structure over time. Audio ML is fundamentally about representing sound well first — as hand-crafted features or as a spectrogram — before classifying.' },
    { q: 'What are the two routes?', a: 'One extracts hand-crafted features (MFCCs for timbre, tempo, spectral properties, chroma for harmony) and feeds a classifier — transparent and light. The other turns audio into a spectrogram image and uses a CNN — powerful, reusing image-model machinery.' },
    { q: 'Why can\'t it be perfectly accurate?', a: 'Because genre itself is fuzzy — genres overlap and blend, are partly subjective and cultural, and even human experts disagree on boundary cases. There is no perfect ground truth, so the interesting cases are the ambiguous ones.' },
    { q: 'What is wrong with GTZAN?', a: 'The classic GTZAN dataset has well-documented flaws — duplicate and mislabelled tracks, and artist repetition across splits — that inflate reported accuracy. Honest evaluation uses cleaner, artist-disjoint splits.' },
    { q: 'Can the model cheat?', a: 'Yes — it can latch onto production or recording artefacts (a particular mastering style) rather than genuine musical content, which is one reason benchmark numbers can be misleading and diverse data matters.' },
  ],
  refs: [
    { t: 'Music information retrieval', u: 'https://en.wikipedia.org/wiki/Music_information_retrieval', s: 'Reference' },
    { t: 'MFCC', u: 'https://en.wikipedia.org/wiki/Mel-frequency_cepstrum', s: 'Reference' },
    { t: 'Spectrogram', u: 'https://en.wikipedia.org/wiki/Spectrogram', s: 'Reference' },
    { t: 'GTZAN dataset (and criticism)', u: 'https://en.wikipedia.org/wiki/GTZAN', s: 'Reference' },
    { t: 'librosa audio library', u: 'https://librosa.org/', s: 'Docs' },
  ],
  images: ['neural', 'cnn', 'datacentre'],
  imageCaptions: [
    'A music genre classifier predicts a song\'s style from its audio — the classic introduction to audio machine learning.',
    'The key move: turn sound into features (MFCC/tempo/harmony) or a spectrogram — you cannot learn from raw waveforms.',
    'Genre is fuzzy and benchmark datasets are flawed, so accuracy is meaningful but never absolute.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A19 — Stock Trend Predictor
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A19',
  domainKey: 'ai',
  emoji: '📈', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Time-series models on market data — a rigorous lesson in forecasting, and an honest one about why beating the market is nearly impossible.',
  platformName: 'CPU/GPU workstation or server',
  ide: 'Python 3.11 + time-series ML',

  overview: [
    'Predicting stock movements with machine learning is one of the most popular — and most misunderstood — AI projects, and this one is built to teach it <b>honestly</b>. It applies <b>time-series models</b> to market data to forecast direction or volatility, and in doing so teaches the real, valuable craft of <b>time-series forecasting</b> — while being uncompromisingly clear about the central truth beginners are rarely told: <b>reliably beating the market is extraordinarily hard, bordering on impossible</b>, and any project that claims easy profits is misleading you.',
    'The genuine learning is in the <b>time-series machine learning</b>: framing prices/returns as sequences, engineering features (moving averages, momentum, volatility, technical indicators), and training models (from classical ARIMA to LSTMs and other sequence models) to forecast a future value or the <i>direction</i> of the next move. Crucially, it teaches the discipline that separates rigorous forecasting from self-deception: <b>proper backtesting</b>, avoiding <b>look-ahead bias</b> (never using future information to predict the past), realistic <b>train/test splits that respect time</b>, and honest evaluation including <b>transaction costs</b>.',
    'The value is a serious grounding in time-series forecasting and financial-ML rigor. And the honesty is the whole point and non-negotiable: markets are <b>extremely efficient and near-random in the short term</b>, so most price movement is noise; models that look brilliant in backtests routinely fail live because of <b>overfitting</b>, subtle look-ahead bias, ignored costs, and <b>regime change</b> (the market\'s behaviour shifts); and this is emphatically <b>not financial advice</b> and must never be used to risk real money on the belief it will beat the market. A responsible version measures itself against honest baselines (a naïve "tomorrow ≈ today" predictor, or buy-and-hold) and treats a small, hard-won edge — or none — as the realistic outcome. Framed this way, it is an excellent, rigorous lesson in time-series ML and financial reality — the opposite of a get-rich scheme.',
  ],
  does: [
    'Forecasts market direction/volatility with time-series models',
    'Frames prices/returns as sequences with features',
    'Trains classical (ARIMA) or sequence (LSTM) models',
    'Backtests properly (time-respecting, costs included)',
    'Avoids look-ahead bias and overfitting traps',
    'Compares against honest baselines',
    'Teaches time-series ML and financial reality honestly',
  ],
  features: [
    'Time-series forecasting (classical + deep)',
    'Feature engineering (MA, momentum, volatility)',
    'Rigorous backtesting (no look-ahead, with costs)',
    'Time-aware train/test splits',
    'Baseline comparisons (naïve/buy-and-hold)',
    'Overfitting/regime-change awareness',
    'Honest: not financial advice; beating the market is very hard',
  ],
  applications: [
    { t: 'Time-series ML learning', d: 'Forecasting methods and rigorous evaluation.' },
    { t: 'Financial-ML rigor', d: 'Backtesting, look-ahead bias, costs, baselines.' },
    { t: 'General forecasting', d: 'Techniques transfer to demand/energy/etc.' },
    { t: 'Research / education', d: 'An honest look at market predictability.' },
  ],
  skills: [
    'Time-series framing and feature engineering',
    'Classical and deep sequence models',
    'Rigorous backtesting (no look-ahead, costs)',
    'Time-aware evaluation and baselines',
    'Financial-ML honesty (efficiency, overfitting, regimes)',
  ],
  prereq: [
    'The real value is time-series forecasting craft — done rigorously.',
    'Backtest properly: no look-ahead bias, time-aware splits, include costs.',
    'Markets are near-random short-term — most movement is noise.',
    'NOT financial advice; beating the market reliably is extraordinarily hard.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute', spec: 'CPU for classical/features; GPU for deep sequence models', qty: 1, price: 0 },
    { name: 'Time-series libraries', spec: 'ARIMA / LSTM / feature tools + backtesting', qty: 1, price: 0 },
    { name: 'Market data', spec: 'Historical prices/returns (clean, point-in-time)', qty: 1, price: 0, note: 'Avoid look-ahead' },
    { name: 'Baselines', spec: 'Naïve and buy-and-hold benchmarks', qty: 1, price: 0, note: 'Beat these honestly, or not' },
  ],
  cost: 'Software; compute-light to moderate',
  libs: ['python', 'pandas', 'sklearn', 'torch', 'numpy'],
  hardwareNotes: [
    'This is a pure-software forecasting system — no electronic hardware to specify. The "platform" is a computer: a CPU handles classical models, features and backtesting; a GPU accelerates deep sequence models (LSTMs).',
    'Memory scales with the length/breadth of market data; storage holds historical series and backtest results. This is a learning/research tool, not a trading system, and carries no financial-advice function. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the forecasting data flow — historical market data becomes time-series features, a model forecasts direction/volatility, and a rigorous backtest (time-aware, cost-inclusive) evaluates it against honest baselines.',
  pins: {
    left: [
      { dev: 'Market data', devPin: 'prices/returns', pin: '—', sig: 'Historical series' },
      { dev: 'Features', devPin: 'engineer', pin: '—', sig: 'MA/momentum/vol' },
    ],
    right: [
      { dev: 'Model', devPin: 'forecast', pin: '—', sig: 'Direction/volatility' },
      { dev: 'Backtest', devPin: 'evaluate', pin: '—', sig: 'vs baselines (costs)' },
    ],
  },
  wiringNotes: [
    'Use clean, point-in-time historical data (avoid future leakage).',
    'Engineer time-series features (moving averages, momentum, volatility).',
    'Train a classical or deep sequence model to forecast direction/volatility.',
    'Backtest with time-aware splits and transaction costs; no look-ahead bias.',
    'Compare against naïve and buy-and-hold baselines — honestly.',
  ],

  block: { columns: [
    { label: 'Data', edge: 'right', blocks: [
      { name: 'Market series', sub: 'prices', highlight: true },
      { name: 'Features', sub: 'MA/vol' },
    ] },
    { label: 'Model', edge: 'right', blocks: [
      { name: 'ARIMA/LSTM', sub: 'forecast', highlight: true },
    ] },
    { label: 'Validate', edge: 'right', blocks: [
      { name: 'Backtest', sub: 'time-aware', highlight: true },
      { name: 'No look-ahead', sub: '+costs' },
    ] },
    { label: 'Judge', edge: 'none', blocks: [
      { name: 'vs baselines', sub: 'naïve/BH' },
      { name: 'Honest edge', sub: 'small/none' },
    ] },
  ] },
  flow: [
    { t: 'Load clean market data (point-in-time)', k: 'start' },
    { t: 'Engineer time-series features', k: 'proc' },
    { t: 'Train model (time-aware split)', k: 'proc' },
    { t: 'Backtest with costs, no look-ahead', k: 'proc' },
    { t: 'Beats honest baselines?', k: 'dec', yes: 'Small edge (be sceptical)', no: 'No edge (the usual, honest result)' },
    { t: 'Small edge (be sceptical)', k: 'io' },
    { t: 'No edge (the usual, honest result)', k: 'io' },
    { t: 'Report honestly (not advice)', k: 'end', back: 'Load clean market data (point-in-time)' },
  ],

  principle: [
    'This project is unusual in that its most important lesson is a <b>warning</b>, and teaching it honestly matters more than any accuracy number. Predicting stock prices with ML is enormously popular and enormously over-promised: countless tutorials show a model that appears to forecast prices beautifully, and countless beginners conclude they can beat the market. The reality — which a responsible project must foreground — is that <b>reliably beating the market is extraordinarily hard, bordering on impossible</b>, and the impressive-looking results are almost always artefacts of methodological errors. The value of the project is <b>real</b>, but it lies in learning rigorous <b>time-series forecasting</b> and financial-ML discipline, not in getting rich.',
    'The genuine, transferable skill is <b>time-series machine learning</b>. You frame the market as a sequence (prices, or better, <b>returns</b>), engineer features that summarise recent behaviour (moving averages, momentum, <b>volatility</b>, technical indicators), and train models to forecast a future value or, more sensibly, the <b>direction</b> of the next move or its volatility. The model space spans classical statistics (<b>ARIMA</b> and friends) to deep sequence models (<b>LSTMs</b>, temporal networks). These are powerful, broadly useful techniques — the exact same craft applies to forecasting energy demand or sales — which is why the project is worth doing even though the market itself resists prediction.',
    'What separates rigorous forecasting from self-deception is <b>methodological discipline</b>, and financial time series punish sloppiness brutally. <b>Backtesting must respect time</b>: you train on the past and test on the future, never shuffling, because the sequence is the whole point. <b>Look-ahead bias</b> — accidentally using information that would not have been available at prediction time (a future price, a feature computed with future data, survivorship-biased data) — is the classic error that makes a useless model look prophetic, and it is subtle and everywhere. Realistic evaluation must include <b>transaction costs</b> (a strategy that "works" before costs often loses after them), and must be measured against <b>honest baselines</b>: does the fancy model actually beat a naïve "tomorrow ≈ today" predictor, or beat simply <b>buying and holding</b>? Most do not.',
    'The deep reason the market resists prediction is worth internalising: markets are <b>highly efficient</b>, meaning available information is already priced in, so short-term price movement is <b>dominated by noise</b> and is close to a random walk — there is very little learnable signal, and any edge is quickly arbitraged away. On top of that, models suffer <b>overfitting</b> (with enough features and tuning you can fit historical noise perfectly, and it means nothing out of sample) and <b>regime change</b> (the market\'s statistical behaviour shifts — a model trained on one regime fails in the next). So a backtest that looks brilliant routinely dies live. The honest conclusion, and the correct framing, is that this is <b>not financial advice</b> and must <b>never be used to risk real money</b> on the belief that it beats the market; the realistic outcome of a rigorous project is a <b>tiny, fragile edge or, far more often, none</b> — which is itself the valuable, true lesson. Built this way — real time-series ML, ruthless backtesting discipline, honest baselines, and clear-eyed humility about efficiency, overfitting and regimes — it is an excellent education in forecasting and financial reality, and the exact opposite of the get-rich scheme it is so often mistaken for.',
  ],
  equations: [
    { t: 'Time-series forecasting', eq: 'frame as a sequence (use RETURNS, not raw prices):\n  features: moving avgs, momentum, volatility, indicators\n  forecast: next return / direction / volatility\n  models: ARIMA ... LSTM / temporal nets\n\nThe genuine, transferable skill.' },
    { t: 'Rigorous backtesting (or you fool yourself)', eq: 'train on PAST, test on FUTURE (never shuffle time)\nNO look-ahead: only use info available at prediction time\ninclude TRANSACTION COSTS\ncompare vs BASELINES: naïve (t+1 ≈ t), buy-and-hold\n\nMost "great" backtests fail these.' },
    { t: 'Why it (usually) does not work', eq: 'efficient markets → short-term ≈ random walk (mostly noise)\noverfitting → fit historical noise, meaningless out-of-sample\nregime change → behaviour shifts; model breaks live\n\nNOT financial advice. Realistic edge: tiny/fragile, or none.' },
  ],

  ai: {
    task: 'Forecast market direction/volatility with time-series models, evaluated by rigorous backtesting (time-aware, no look-ahead, cost-inclusive) against honest baselines — as a learning exercise, not financial advice.',
    dataset: [
      'Clean, point-in-time historical market data (prices/returns). Survivorship bias and look-ahead in data are common, dangerous errors.',
      'Features are engineered from the series; the honesty is in the evaluation, not the data volume.',
    ],
    datasetTable: [
      { n: 'Historical prices/returns', size: 'Long series', lic: 'Data-provider terms', use: 'Model input (point-in-time)' },
      { n: 'Technical indicators', size: 'Derived', lic: '—', use: 'Features (MA/momentum/vol)' },
      { n: 'Baselines', size: '—', lic: '—', use: 'Naïve / buy-and-hold comparison' },
      { n: 'Out-of-sample period', size: 'Held-out future', lic: '—', use: 'Honest backtest' },
    ],
    preprocess: [
      'Use returns (stationary) rather than raw prices; align point-in-time.',
      'Engineer features WITHOUT future information (no look-ahead).',
      'Split by TIME (train past, test future); never shuffle.',
    ],
    pipeline: [
      { name: 'Market data', sub: 'point-in-time', highlight: true },
      { name: 'Features', sub: 'no look-ahead' },
      { name: 'Model', sub: 'ARIMA/LSTM', highlight: true },
      { name: 'Backtest', sub: 'time+costs' },
      { name: 'Baselines', sub: 'honest' },
    ],
    archTable: [
      { l: 'Feature engineering', s: 'MA/momentum/volatility', p: 'Summarise recent behaviour' },
      { l: 'Model', s: 'ARIMA … LSTM/temporal', p: 'Forecast direction/volatility' },
      { l: 'Time-aware split', s: 'train past / test future', p: 'No leakage' },
      { l: 'Backtester', s: 'costs + no look-ahead', p: 'Honest performance' },
      { l: 'Baselines', s: 'naïve / buy-and-hold', p: 'Reality check' },
    ],
    hyper: [
      { k: 'Target', v: 'direction/volatility', w: 'Sensible vs raw price' },
      { k: 'Lookback window', v: 'tuned', w: 'Context vs noise' },
      { k: 'Model complexity', v: 'low (careful)', w: 'Overfitting risk' },
      { k: 'Costs', v: 'included', w: 'Realistic net result' },
    ],
    training: [
      'Train time-aware; keep models simple to resist overfitting.',
      'Never let future data leak into features/splits.',
      'Evaluate net of costs against naïve and buy-and-hold baselines.',
    ],
    metricsIntro: [
      'The honest metrics are out-of-sample, cost-inclusive performance versus baselines — not in-sample accuracy, which is trivially inflated.',
    ],
    metrics: [
      { m: 'Out-of-sample (net of costs)', v: 'usually ≈ baseline', d: 'The honest number' },
      { m: 'vs naïve baseline', v: 'rarely beats', d: 'Reality check' },
      { m: 'vs buy-and-hold', v: 'rarely beats', d: 'Reality check' },
      { m: 'Overfitting gap', v: 'watch', d: 'In-sample vs out-of-sample' },
    ],
    chart: { title: 'In-sample vs reality', unit: '%', desc: 'Models look great in-sample and on flawed backtests, then collapse toward baseline out-of-sample and net of costs — the honest arc (illustrative).', bars: [
      { label: 'In-sample', value: 90 },
      { label: 'Naive backtest', value: 75 },
      { label: 'Proper backtest', value: 55 },
      { label: 'Net of costs, live', value: 50 },
    ] },
    inference: { file: 'backtest.py', lang: 'python', body: `import numpy as np

def backtest(returns, signals, cost=0.001):
    # Time-ordered; signals[t] uses ONLY info up to t (no look-ahead).
    strat = signals[:-1] * returns[1:]          # act on signal, realise next return
    strat = strat - cost * np.abs(np.diff(np.r_[0, signals]))[:-1]  # transaction costs
    return {
        "strategy_return": float(np.nansum(strat)),
        "buy_and_hold":    float(np.nansum(returns[1:])),   # honest baseline
    }

def honest_verdict(result):
    beat = result["strategy_return"] > result["buy_and_hold"]
    return ("A small edge (be sceptical: overfit? regime luck?)" if beat
            else "No edge vs buy-and-hold — the usual, honest result.")
    # NOT financial advice. Beating the market reliably is extraordinarily hard.` },
    limits: [
      'Markets are near-random short-term — mostly noise, little signal.',
      'Overfitting and subtle look-ahead bias make bad models look great.',
      'Regime change breaks live what worked in backtests.',
      'NOT financial advice; do not risk real money on it.',
    ],
  },

  assembly: [
    { h: 'Frame the time series and features', p: [
      'Use returns, engineer features (moving averages, momentum, volatility) without future information, and split by time.',
    ], warn: 'This is NOT financial advice and must never be used to risk real money on the belief it beats the market. Markets are near-random short-term; reliably beating them is extraordinarily hard. The value here is rigorous time-series forecasting, not profit.' },
    { h: 'Train and backtest rigorously', p: [
      'Train a classical or deep sequence model time-aware, and backtest with no look-ahead bias and transaction costs.',
    ] },
    { h: 'Compare to honest baselines', p: [
      'Measure against a naïve predictor and buy-and-hold; treat "no edge" as the realistic, valuable result.',
    ] },
  ],
  steps: [
    { h: 'Backtest honestly against baselines', p: [
      'Evaluate the strategy time-ordered with costs and no look-ahead, comparing to buy-and-hold and reporting an honest verdict.',
    ], code: {
      file: 'backtest.py', lang: 'python',
      body: `import numpy as np

def backtest(returns, signals, cost=0.001):
    # signals[t] must use ONLY information available up to time t (no look-ahead)
    strat = signals[:-1] * returns[1:]                        # realise NEXT return
    strat -= cost * np.abs(np.diff(np.r_[0, signals]))[:-1]   # transaction costs
    return {"strategy": float(np.nansum(strat)),
            "buy_and_hold": float(np.nansum(returns[1:]))}     # honest baseline

def verdict(r):
    return ("small edge — be sceptical (overfit/regime luck?)"
            if r["strategy"] > r["buy_and_hold"]
            else "no edge vs buy-and-hold — the usual honest result")`,
      explain: [
        { ref: '# signals[t] must use ONLY information available up to time t (no look-ahead)', txt: 'The cardinal rule: signals may only use past information, or the backtest is fiction — look-ahead bias is what makes useless models look prophetic.' },
        { ref: 'strat = signals[:-1] * returns[1:]                        # realise NEXT return', txt: 'A signal at time t is realised on the next period\'s return — acting after the decision, respecting time.' },
        { ref: 'strat -= cost * np.abs(np.diff(np.r_[0, signals]))[:-1]   # transaction costs', txt: 'Transaction costs are subtracted, since strategies that "work" before costs routinely lose after them.' },
        { ref: 'if r["strategy"] > r["buy_and_hold"]', txt: 'The strategy is judged against simply buying and holding — the honest baseline most strategies fail to beat.' },
      ],
    } },
    { h: 'Report honestly — not advice', p: [
      'Present out-of-sample, cost-inclusive results versus baselines, and treat a tiny/no edge as the truthful outcome — never as investment advice.',
    ], tip: 'If your backtest looks amazing, suspect a bug before genius: look-ahead bias, data leakage, ignored costs, or overfitting explain almost all "market-beating" results.' },
  ],

  code: [{
    file: 'stock_trend_predictor.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Stock Trend Predictor (time-series ML — taught HONESTLY)

Applies time-series models (ARIMA ... LSTM) to market data to forecast
direction/volatility. The REAL value is rigorous forecasting: time-aware
splits, NO look-ahead bias, transaction costs, and honest BASELINES.
Markets are near-random short-term; reliably beating them is nearly
impossible. NOT financial advice. Do NOT risk real money on this.
"""
import numpy as np

def make_features(returns, lookback=10):
    # features from PAST returns only (no future information)
    X, y = [], []
    for t in range(lookback, len(returns) - 1):
        window = returns[t-lookback:t]
        X.append([window.mean(), window.std(),           # momentum, volatility
                  returns[t-1], np.sign(window.sum())])   # last, trend sign
        y.append(np.sign(returns[t+1]))                   # next direction
    return np.array(X), np.array(y)

def time_split(X, y, frac=0.7):
    n = int(len(X) * frac)
    return X[:n], y[:n], X[n:], y[n:]                     # train PAST, test FUTURE

def backtest(returns, signals, cost=0.001):
    strat = signals[:-1] * returns[1:]                    # act on signal
    strat -= cost * np.abs(np.diff(np.r_[0, signals]))[:-1]   # costs
    return {"strategy": float(np.nansum(strat)),
            "buy_and_hold": float(np.nansum(returns[1:]))}    # baseline

if __name__ == "__main__":
    X, y = make_features(RETURNS)
    Xtr, ytr, Xte, yte = time_split(X, y)                 # never shuffle time
    model.fit(Xtr, ytr)                                   # keep it simple
    signals = model.predict(Xte)
    result = backtest(RETURNS[-len(signals):], signals)   # net of costs
    edge = result["strategy"] > result["buy_and_hold"]
    print("small edge (be sceptical)" if edge else
          "no edge vs buy-and-hold — the honest, usual result")
    # NOT financial advice; beating the market reliably is extraordinarily hard.`,
    explain: [
      { ref: '# features from PAST returns only (no future information)', txt: 'Features use only past data, the discipline that prevents look-ahead bias from faking a prophetic model.' },
      { ref: 'return X[:n], y[:n], X[n:], y[n:]                     # train PAST, test FUTURE', txt: 'The split respects time — train on the past, test on the future — because shuffling a time series destroys the whole test.' },
      { ref: 'strat -= cost * np.abs(np.diff(np.r_[0, signals]))[:-1]   # costs', txt: 'Costs are included, since ignoring them is how paper strategies look profitable and real ones lose.' },
      { ref: 'print("small edge (be sceptical)" if edge else', txt: 'The verdict is framed with scepticism — a small edge invites suspicion of overfitting, and no edge is the honest, common result.' },
      { ref: '# NOT financial advice; beating the market reliably is extraordinarily hard.', txt: 'The core warning is stated in the code itself — this is education, not an investment tool.' },
    ],
  }],

  config: [
    'Configure data (point-in-time returns), features (no look-ahead) and lookback.',
    'Configure the model (classical/deep) — keep it simple to resist overfitting.',
    'Configure time-aware splits, transaction costs and backtesting.',
    'Configure baselines (naïve, buy-and-hold) for honest comparison.',
  ],
  calibration: [
    { h: 'No leakage', p: [
      'Audit features/splits for any use of future information; fix look-ahead bias.',
    ] },
    { h: 'Realistic backtest', p: [
      'Include transaction costs; test out-of-sample; compare to baselines.',
    ] },
    { h: 'Overfitting', p: [
      'Watch the in-sample vs out-of-sample gap; prefer simple models.',
    ] },
  ],
  testing: [
    { step: 'Train time-aware', expect: 'No shuffling; past→future split' },
    { step: 'Audit for look-ahead', expect: 'No future info in features/splits' },
    { step: 'Backtest with costs', expect: 'Net performance, often ≈ baseline' },
    { step: 'Compare to buy-and-hold', expect: 'Rarely beats it (honest)' },
    { step: 'Check in vs out-of-sample', expect: 'Large gap = overfitting' },
    { step: 'Interpret a "great" result', expect: 'Suspect a bug/leakage first' },
  ],
  output: [
    'Honest, cost-inclusive, out-of-sample results versus baselines — usually showing little or no edge.',
    { file: 'backtest-result.json', lang: 'json', body: `{
  "strategy_return_net": 0.031,
  "buy_and_hold_return": 0.058,
  "look_ahead_bias": "audited: none",
  "costs_included": true,
  "verdict": "no edge vs buy-and-hold — the honest, usual result",
  "note": "NOT financial advice"
}` },
    'A rigorously backtested strategy underperforming buy-and-hold net of costs — the honest, common outcome, and exactly the valuable lesson: reliably beating the market is extraordinarily hard.',
  ],
  troubleshoot: [
    { sym: 'Backtest looks amazing', cause: 'Look-ahead/leakage/no costs', fix: 'Audit for future info; add costs; suspect a bug' },
    { sym: 'Great in-sample, awful live', cause: 'Overfitting', fix: 'Simpler model; regularise; honest out-of-sample test' },
    { sym: 'Worked, then stopped', cause: 'Regime change', fix: 'Expect it; do not over-trust any backtest' },
    { sym: 'Beats nothing', cause: 'Market efficiency (normal)', fix: 'This is the honest result; value the rigor' },
    { sym: 'Shuffled the data', cause: 'Broke time order', fix: 'Never shuffle; split past→future' },
    { sym: 'Treated as advice', cause: 'Misuse', fix: 'It is NOT financial advice; do not risk money' },
  ],

  perf: [
    'Do the time-series ML rigorously — that is the real value.',
    'Eliminate look-ahead bias; split by time; include costs.',
    'Compare to naïve and buy-and-hold baselines honestly.',
    'Prefer simple models; watch for overfitting and regime change.',
  ],
  safety: [
    'This is NOT financial advice — never risk real money on the belief it beats the market.',
    'Beating the market reliably is extraordinarily hard; treat "no edge" as the honest, expected result.',
    'A great-looking backtest almost always hides look-ahead bias, leakage, ignored costs or overfitting.',
    'Do not present forecasts as reliable predictions of the future.',
  ],
  maintenance: [
    'Re-audit for leakage whenever features/data change.',
    'Re-test out-of-sample; expect regime-driven decay.',
    'Keep baselines and cost assumptions realistic.',
    'Resist the temptation to over-tune to history.',
  ],
  future: [
    'Apply the same rigor to non-market forecasting (energy/demand).',
    'Add proper walk-forward validation and uncertainty estimates.',
    'Study market microstructure and why edges vanish.',
    'Explore risk/volatility forecasting (more tractable than direction).',
  ],
  faq: [
    { q: 'Can this actually predict the stock market?', a: 'Not reliably — and that honesty is the point. Markets are highly efficient and near-random in the short term, so most price movement is noise. Reliably beating the market is extraordinarily hard, and impressive results almost always come from methodological errors, not genuine predictive power.' },
    { q: 'Then what is the value of the project?', a: 'Learning rigorous time-series forecasting and financial-ML discipline — feature engineering, sequence models, and above all proper backtesting without look-ahead bias, with costs, against honest baselines. These skills transfer to any forecasting problem.' },
    { q: 'What is look-ahead bias?', a: 'Accidentally using information that would not have been available at prediction time — a future price, a feature computed with future data, survivorship-biased data. It is subtle and everywhere, and it makes a useless model look prophetic. It is the number-one cause of fake "market-beating" results.' },
    { q: 'Why do great backtests fail live?', a: 'Overfitting (fitting historical noise that means nothing out of sample), ignored transaction costs, subtle look-ahead bias, and regime change (the market\'s behaviour shifts). A backtest is easy to fool yourself with; live trading is not.' },
    { q: 'Is this financial advice?', a: 'No. It is emphatically not financial advice and must never be used to risk real money on the belief it beats the market. The realistic outcome of a rigorous project is a tiny, fragile edge or none — which is itself the valuable, true lesson.' },
  ],
  refs: [
    { t: 'Time series forecasting', u: 'https://en.wikipedia.org/wiki/Time_series', s: 'Reference' },
    { t: 'Efficient-market hypothesis', u: 'https://en.wikipedia.org/wiki/Efficient-market_hypothesis', s: 'Reference' },
    { t: 'Look-ahead bias / backtesting', u: 'https://en.wikipedia.org/wiki/Backtesting', s: 'Reference' },
    { t: 'Overfitting', u: 'https://en.wikipedia.org/wiki/Overfitting', s: 'Reference' },
    { t: 'ARIMA / LSTM', u: 'https://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'grafana'],
  imageCaptions: [
    'A stock trend predictor teaches rigorous time-series forecasting — and the honest truth that beating the market is nearly impossible.',
    'The real skill is discipline: no look-ahead bias, time-aware splits, transaction costs, and honest baselines.',
    'Great-looking backtests almost always hide leakage or overfitting — a tiny edge or none is the realistic result.',
  ],
},

];
