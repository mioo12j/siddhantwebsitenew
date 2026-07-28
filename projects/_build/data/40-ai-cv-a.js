/* AI — Computer Vision A02–A04. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   A02 — Real-Time Object Detection
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A02',
  domainKey: 'ai',
  emoji: '🎯', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A YOLO-based detector that finds and labels many objects in a live video stream at speed — the workhorse behind almost every vision application.',
  platformName: 'GPU workstation or Jetson/Pi (edge)',
  ide: 'Python 3.11 + PyTorch / Ultralytics',

  overview: [
    'Almost every practical computer-vision application — surveillance, autonomous driving, retail analytics, robotics, quality inspection — rests on one capability: looking at an image and answering <b>what objects are in it and where</b>. That is <b>object detection</b>, and doing it <b>in real time</b> on a live video stream is the workhorse skill of applied vision. This project builds a real-time detector around the <b>YOLO</b> family (You Only Look Once), which reframed detection from a slow, multi-stage pipeline into a single fast network pass, making live detection on ordinary hardware possible.',
    'The system takes frames from a camera or video, runs each through a trained detector, and outputs <b>bounding boxes</b> with <b>class labels</b> and <b>confidence scores</b> — "person 0.94 here, car 0.88 there" — drawn back onto the video live. The core ideas that make this work and make it fast are the <b>single-pass architecture</b> (the whole image is processed once, predicting all boxes together, rather than scanning region by region), <b>non-maximum suppression</b> (collapsing the many overlapping raw predictions into one clean box per object), and the speed/accuracy trade-off embodied in model size (a small model runs on a Pi at lower accuracy; a large one needs a GPU but detects more, smaller, harder objects).',
    'The value is a reusable perception layer: once you can reliably detect and locate objects live, you can count them, track them, trigger on them, or feed them to downstream logic — which is why detection underpins so much. It is honest that a detector is only as good as its <b>training data</b> and classes (it detects what it was trained on, and struggles with unusual angles, small or occluded objects, and domain shift), that real-time performance depends heavily on hardware and model size, and that deployment (edge vs GPU) is a real engineering choice. But as a fast, accurate, live multi-object detector built on YOLO, it is both a genuinely useful building block and the single most important hands-on lesson in modern applied computer vision.',
  ],
  does: [
    'Detects and labels multiple objects in a live video stream',
    'Draws bounding boxes with class labels and confidence',
    'Runs in a single fast network pass (YOLO)',
    'Cleans overlapping predictions with non-maximum suppression',
    'Trades speed vs accuracy via model size (edge to GPU)',
    'Provides a reusable perception layer for counting/tracking/triggering',
    'Underpins surveillance, robotics, retail and autonomous vision',
  ],
  features: [
    'Real-time multi-object detection (YOLO)',
    'Bounding boxes + labels + confidence',
    'Single-pass architecture (fast)',
    'Non-maximum suppression for clean boxes',
    'Model-size speed/accuracy trade-off',
    'Edge or GPU deployment',
    'Honest about training-data dependence and hard cases',
  ],
  applications: [
    { t: 'Surveillance / security', d: 'Detecting people, vehicles and objects of interest live.' },
    { t: 'Robotics / autonomy', d: 'Perceiving objects for navigation and manipulation.' },
    { t: 'Retail / analytics', d: 'Counting and locating products and people.' },
    { t: 'Inspection / safety', d: 'Detecting defects, PPE, or hazards in a feed.' },
  ],
  skills: [
    'Object detection concepts (boxes, classes, confidence)',
    'YOLO single-pass architecture and NMS',
    'Real-time inference on video (edge/GPU)',
    'Speed/accuracy trade-offs via model size',
    'Fine-tuning on custom classes / data',
  ],
  prereq: [
    'Detection answers "what and where" — the workhorse of applied vision.',
    'YOLO makes it real-time by processing the whole image in one pass.',
    'A detector only detects what it was trained on — data and classes matter.',
    'Real-time speed depends on model size and hardware (edge vs GPU).',
  ],

  parts: ['picam', 'rpi4'],
  extraParts: [
    { name: 'Compute (GPU or edge)', spec: 'GPU workstation for training/large models, or Jetson/Pi for edge inference', qty: 1, price: 0, note: 'Speed/accuracy depends on this' },
    { name: 'Camera / video source', spec: 'USB/CSI camera or video files', qty: 1, price: 1500 },
    { name: 'Pretrained YOLO weights', spec: 'COCO-pretrained model (fine-tune for custom classes)', qty: 1, price: 0 },
    { name: 'Labelled dataset (if custom)', spec: 'Annotated images for your classes', qty: 1, price: 0, note: 'Detects only what it is trained on' },
  ],
  cost: 'Software + camera; compute-dependent',
  libs: ['python', 'torch', 'ultralytics', 'opencv', 'numpy'],

  wiringIntro: 'This is a software vision system; the "wiring" here is the data flow — a camera or video source feeds frames to the detector, which emits boxes, labels and confidences to the display and any downstream logic.',
  pins: {
    left: [
      { dev: 'Camera / video', devPin: 'frames', pin: '—', sig: 'Input images' },
      { dev: 'Detector (YOLO)', devPin: 'inference', pin: '—', sig: 'Boxes + labels' },
    ],
    right: [
      { dev: 'NMS + draw', devPin: 'post', pin: '—', sig: 'Clean boxes on video' },
      { dev: 'Downstream', devPin: 'API', pin: '—', sig: 'Count/track/trigger' },
    ],
  },
  wiringNotes: [
    'A camera or video source provides frames to the detector.',
    'The detector runs a single forward pass producing raw boxes, labels and confidences.',
    'Non-maximum suppression collapses overlapping boxes into one per object.',
    'Clean detections are drawn on the video and/or passed to downstream logic.',
    'Choose model size for your hardware: small for edge, large for GPU accuracy.',
  ],

  block: { columns: [
    { label: 'Input', edge: 'right', blocks: [
      { name: 'Camera/video', sub: 'frames', highlight: true },
    ] },
    { label: 'Detect', edge: 'right', blocks: [
      { name: 'YOLO', sub: 'single pass', highlight: true },
      { name: 'Raw boxes', sub: 'many' },
    ] },
    { label: 'Clean', edge: 'right', blocks: [
      { name: 'NMS', sub: 'one/object' },
      { name: 'Threshold', sub: 'confidence' },
    ] },
    { label: 'Use', edge: 'none', blocks: [
      { name: 'Draw', sub: 'boxes+labels' },
      { name: 'Downstream', sub: 'count/track' },
    ] },
  ] },
  flow: [
    { t: 'Grab a frame', k: 'start' },
    { t: 'YOLO forward pass → raw predictions', k: 'proc' },
    { t: 'Filter by confidence', k: 'proc' },
    { t: 'Non-maximum suppression', k: 'proc' },
    { t: 'Any detections?', k: 'dec', yes: 'Draw boxes/labels + emit', no: 'Next frame' },
    { t: 'Draw boxes/labels + emit', k: 'io' },
    { t: 'Next frame', k: 'end', back: 'Grab a frame' },
  ],

  principle: [
    'Object detection is harder than classification: a classifier answers "what is this image?", but a detector must answer "what objects are present <i>and where is each one</i>?", which means localising a variable number of objects of different sizes anywhere in the frame. Early detectors did this slowly — proposing many candidate regions and classifying each — which was far too slow for video. <b>YOLO</b>\'s insight, and the reason it dominates real-time detection, is to treat detection as a <b>single regression through one network</b>: the whole image goes in once, and the network predicts all bounding boxes and their class probabilities together. "You Only Look Once" is literal — one pass, not thousands of region evaluations — and that is what makes live detection feasible.',
    'Mechanically, the network divides the image into a grid and, at each location, predicts candidate boxes (position and size), an <b>objectness/confidence</b> score, and class probabilities. This produces many raw, overlapping predictions for the same object, so two clean-up steps follow. A <b>confidence threshold</b> discards weak predictions. Then <b>non-maximum suppression (NMS)</b> resolves the overlaps: among boxes that overlap heavily (high intersection-over-union) and predict the same class, it keeps the highest-confidence one and suppresses the rest, yielding a single clean box per object. Understanding NMS is essential, because without it a detector reports a messy pile of duplicate boxes.',
    'The defining engineering dial is the <b>speed/accuracy trade-off</b>, set largely by <b>model size</b>. A small model (few parameters, low input resolution) runs fast — even on a Raspberry Pi or phone — but misses small, distant, or difficult objects and is less accurate. A large model detects more and harder objects accurately but needs a GPU to run at video rates. There is no universally right choice: an edge camera doing coarse person-detection wants the small model; a GPU server doing fine retail analytics wants the large one. Input resolution, batch size, and hardware (CPU vs GPU vs dedicated accelerator) all move the same dial. Choosing the point on this curve for the application and hardware is the core deployment decision.',
    'The honest limits are as important as the capabilities. A detector <b>only detects what it was trained on</b>: a COCO-pretrained YOLO knows its ~80 everyday classes and nothing else, so detecting custom objects requires <b>fine-tuning on labelled data</b> — and the detector is only ever as good as that data\'s coverage of angles, lighting, scales, and occlusion. It struggles with <b>small, distant, or occluded</b> objects, unusual viewpoints, and <b>domain shift</b> (a model trained on daytime street scenes falters at night or indoors). Real-time performance is <b>hardware-dependent</b> and not guaranteed. And confidence scores are not calibrated probabilities to be trusted blindly. Within those bounds, though, a YOLO-based real-time detector is the single most reusable tool in applied vision — a fast, live "what and where" layer that almost every higher-level vision system is built upon, which is exactly why learning to build, run, and tune one is foundational.',
  ],
  equations: [
    { t: 'Detection output', eq: 'For each detected object:\n  box = (x, y, w, h)          # location + size\n  class = argmax(class_probs)  # what it is\n  confidence = objectness × class_prob\n\nKeep only detections with confidence ≥ threshold.' },
    { t: 'Intersection over Union (IoU)', eq: 'IoU(A,B) = area(A ∩ B) / area(A ∪ B)\n\nMeasures box overlap (0..1). Used by NMS to find duplicates\nand by evaluation (a prediction matches truth if IoU ≥ 0.5).' },
    { t: 'Non-maximum suppression', eq: 'sort detections by confidence (high → low)\nrepeat:\n  keep the top box B\n  remove any remaining box with IoU(B, ·) > NMS_thr\n    AND same class\n→ one clean box per object.' },
    { t: 'Speed / accuracy dial', eq: 'small model / low-res  → fast, less accurate (edge)\nlarge model / high-res → accurate, slower (GPU)\n\nFPS ≈ compute / (model_cost × resolution)\nChoose the point for your app + hardware.' },
  ],

  ai: {
    task: 'Detect and localise multiple objects in real time from a video stream, outputting labelled bounding boxes with confidence, using a single-pass YOLO detector.',
    dataset: [
      'Detectors are trained on images annotated with bounding boxes and class labels. A COCO-pretrained model gives ~80 common classes out of the box; custom classes need your own labelled images.',
      'Coverage of angles, scales, lighting and occlusion in the training data directly determines real-world accuracy.',
    ],
    datasetTable: [
      { n: 'COCO', size: '~120k images, 80 classes', lic: 'CC BY 4.0 (images vary)', use: 'Pretrained base / general detection' },
      { n: 'Custom labelled set', size: 'Hundreds–thousands', lic: 'Yours', use: 'Fine-tune for your classes' },
      { n: 'Open Images / VOC', size: 'Large', lic: 'Varies', use: 'Extra classes / pretraining' },
      { n: 'Hard-case samples', size: 'Targeted', lic: 'Yours', use: 'Small/occluded/night robustness' },
    ],
    preprocess: [
      'Resize/letterbox frames to the model input size; normalise pixels.',
      'Augment training data (scale, flip, mosaic, colour) for robustness.',
      'Ensure annotations are accurate — box quality caps model quality.',
    ],
    pipeline: [
      { name: 'Frame', sub: 'camera/video', highlight: true },
      { name: 'Preprocess', sub: 'resize/normalise' },
      { name: 'YOLO', sub: 'single pass', highlight: true },
      { name: 'Filter + NMS', sub: 'clean boxes' },
      { name: 'Output', sub: 'boxes+labels' },
    ],
    arch: [
      'A YOLO detector has a backbone (feature extraction), a neck (multi-scale feature fusion), and a head predicting boxes/objectness/classes at several scales — enabling detection of both large and small objects in one pass.',
      'Model variants (n/s/m/l/x) trade parameters and input size for speed vs accuracy.',
    ],
    archTable: [
      { l: 'Backbone', s: 'CNN feature extractor', p: 'Learns image features' },
      { l: 'Neck', s: 'multi-scale fusion (FPN/PAN)', p: 'Detect large + small objects' },
      { l: 'Head', s: 'box + objectness + class', p: 'Predicts all detections in one pass' },
      { l: 'Post-process', s: 'confidence filter + NMS', p: 'One clean box per object' },
      { l: 'Variant', s: 'n/s/m/l/x', p: 'Speed vs accuracy dial' },
    ],
    hyper: [
      { k: 'Confidence threshold', v: '≈ 0.25–0.5', w: 'Miss vs false detections' },
      { k: 'NMS IoU threshold', v: '≈ 0.45', w: 'Merge duplicates vs split objects' },
      { k: 'Input size', v: '≈ 640 px', w: 'Accuracy vs speed' },
      { k: 'Model variant', v: 'n/s (edge) … l/x (GPU)', w: 'Speed/accuracy for hardware' },
    ],
    training: [
      'Start from pretrained weights and fine-tune on your labelled classes (transfer learning) — far less data than training from scratch.',
      'Augment heavily; validate on held-out images covering hard cases.',
      'Track mAP; watch for overfitting to a narrow set of conditions.',
    ],
    metricsIntro: [
      'Detection quality is measured by mean Average Precision (mAP) across classes and IoU thresholds, alongside real-time speed (FPS) on the target hardware.',
    ],
    metrics: [
      { m: 'mAP@0.5', v: 'model/data-dependent', d: 'Overall detection accuracy' },
      { m: 'mAP@0.5:0.95', v: 'stricter', d: 'Localisation quality too' },
      { m: 'FPS', v: 'hardware-dependent', d: 'Real-time feasibility' },
      { m: 'Precision / recall', v: 'per class', d: 'False detections vs misses' },
    ],
    chart: { title: 'Speed vs accuracy by model size', unit: '', desc: 'Larger models detect more accurately but run slower — the core deployment trade-off (illustrative).', bars: [
      { label: 'Nano (edge)', value: 60 },
      { label: 'Small', value: 72 },
      { label: 'Medium', value: 82 },
      { label: 'Large (GPU)', value: 90 },
    ] },
    inference: { file: 'detect.py', lang: 'python', body: `from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")          # small = edge-friendly; swap for l/x on GPU
CONF = 0.35

cap = cv2.VideoCapture(0)           # live camera
while True:
    ok, frame = cap.read()
    if not ok: break
    # single-pass detection + built-in NMS
    results = model(frame, conf=CONF)[0]
    for b in results.boxes:
        x1, y1, x2, y2 = map(int, b.xyxy[0])
        label = model.names[int(b.cls)]           # what
        conf  = float(b.conf)                     # confidence
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)   # where
        cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 6),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    cv2.imshow("detections", frame)
    if cv2.waitKey(1) == 27: break` },
    limits: [
      'Detects only trained classes; custom objects need labelled data and fine-tuning.',
      'Struggles with small, distant, occluded objects, odd viewpoints and domain shift.',
      'Real-time speed depends on model size and hardware — not guaranteed.',
      'Confidence scores are not calibrated probabilities; threshold with care.',
    ],
  },

  assembly: [
    { h: 'Set up the detector and a video source', p: [
      'Install the framework, load a pretrained YOLO model, and stream frames from a camera or video.',
      'Pick a model size that matches your hardware (small for edge, large for GPU).',
    ], warn: 'A detector only detects what it was trained on. For custom objects you must fine-tune on labelled data — and its accuracy is capped by how well that data covers real angles, scales, lighting and occlusion.' },
    { h: 'Run inference with filtering and NMS', p: [
      'Run each frame through the single-pass detector, filter by confidence, and apply NMS for one clean box per object.',
    ] },
    { h: 'Fine-tune and deploy', p: [
      'Fine-tune on custom classes if needed, evaluate with mAP, and deploy at the right speed/accuracy point for the hardware.',
    ] },
  ],
  steps: [
    { h: 'Detect, filter and clean per frame', p: [
      'Run the detector on each frame, keep confident detections, and rely on NMS to remove duplicate overlapping boxes.',
    ], code: {
      file: 'realtime.py', lang: 'python',
      body: `from ultralytics import YOLO
model = YOLO("yolov8s.pt")

def detect(frame, conf=0.35, iou=0.45):
    # single forward pass; conf filter + NMS handled by the model
    r = model(frame, conf=conf, iou=iou)[0]
    out = []
    for b in r.boxes:
        out.append({
            "box": [int(v) for v in b.xyxy[0]],   # where
            "label": model.names[int(b.cls)],     # what
            "conf": float(b.conf),                # confidence
        })
    return out                                    # clean detections`,
      explain: [
        { ref: 'r = model(frame, conf=conf, iou=iou)[0]', txt: 'One forward pass detects all objects in the frame at once — the single-pass design that makes real time possible.' },
        { ref: '"box": [int(v) for v in b.xyxy[0]],   # where', txt: 'Each detection carries its bounding box — the localisation that distinguishes detection from classification.' },
        { ref: '"conf": float(b.conf),                # confidence', txt: 'Confidence lets downstream logic threshold detections; the conf/iou args apply the filter and NMS that yield one clean box per object.' },
      ],
    } },
    { h: 'Use the detections downstream', p: [
      'Draw boxes/labels live, and feed detections to counting, tracking or triggering logic — the reusable perception layer.',
    ], tip: 'Tune the confidence and NMS-IoU thresholds for your case: raise confidence to cut false detections, adjust NMS-IoU if objects merge (too high) or split into duplicates (too low).' },
  ],

  code: [{
    file: 'object_detection.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Real-Time Object Detection (YOLO)

Detects and labels multiple objects live: single-pass inference,
confidence filtering + non-maximum suppression for clean boxes, and a
speed/accuracy dial via model size. A reusable perception layer for
counting, tracking and triggering. Detects only trained classes.
"""
from ultralytics import YOLO
import cv2, time

# Model size = the speed/accuracy dial: n/s for edge, l/x for GPU.
model = YOLO("yolov8s.pt")
CONF, NMS_IOU = 0.35, 0.45

def annotate(frame, dets):
    for d in dets:
        x1, y1, x2, y2 = d["box"]
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f'{d["label"]} {d["conf"]:.2f}', (x1, y1-6),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    return frame

def detect(frame):
    r = model(frame, conf=CONF, iou=NMS_IOU, verbose=False)[0]  # single pass + NMS
    return [{"box": [int(v) for v in b.xyxy[0]],
             "label": model.names[int(b.cls)],
             "conf": float(b.conf)} for b in r.boxes]

def main(source=0):
    cap = cv2.VideoCapture(source)
    while True:
        ok, frame = cap.read()
        if not ok: break
        t = time.time()
        dets = detect(frame)                      # what + where + confidence
        # ---- downstream hooks: count / track / trigger on 'dets' ----
        fps = 1.0 / max(time.time() - t, 1e-6)
        frame = annotate(frame, dets)
        cv2.putText(frame, f"{fps:.1f} FPS  {len(dets)} objects", (8, 24),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 200, 255), 2)
        cv2.imshow("Real-Time Detection", frame)
        if cv2.waitKey(1) == 27: break
    cap.release(); cv2.destroyAllWindows()

if __name__ == "__main__":
    main(0)                                       # 0 = webcam; or a video path`,
    explain: [
      { ref: 'model = YOLO("yolov8s.pt")', txt: 'The model variant is the speed/accuracy dial — swap for nano on a Pi or extra-large on a GPU without changing the rest of the code.' },
      { ref: 'r = model(frame, conf=CONF, iou=NMS_IOU, verbose=False)[0]  # single pass + NMS', txt: 'A single forward pass with built-in confidence filtering and NMS produces clean detections — the fast core of real-time detection.' },
      { ref: '# ---- downstream hooks: count / track / trigger on \'dets\' ----', txt: 'Detections are a reusable perception layer: counting, tracking, or triggering all hang off this same list of what-and-where.' },
      { ref: 'cv2.putText(frame, f"{fps:.1f} FPS  {len(dets)} objects", (8, 24),', txt: 'Showing live FPS makes the speed/accuracy trade-off concrete — it is what you watch when choosing model size for the hardware.' },
    ],
  }],

  config: [
    'Configure the model variant (speed/accuracy) for your hardware.',
    'Configure confidence and NMS-IoU thresholds.',
    'Configure the video source and (if custom) the fine-tuned classes.',
    'Configure downstream hooks (count/track/trigger).',
  ],
  calibration: [
    { h: 'Thresholds', p: [
      'Tune confidence to balance misses vs false detections; adjust NMS-IoU if boxes merge or duplicate.',
    ] },
    { h: 'Model size', p: [
      'Pick the smallest model that meets your accuracy need at real-time FPS on the hardware.',
    ] },
    { h: 'Custom classes', p: [
      'If fine-tuning, validate mAP on held-out images covering hard cases.',
    ] },
  ],
  testing: [
    { step: 'Point at common objects', expect: 'Correct boxes/labels with confidence' },
    { step: 'Crowd many objects', expect: 'Each detected; NMS gives one box each' },
    { step: 'Lower confidence threshold', expect: 'More (and more false) detections' },
    { step: 'Small/distant objects', expect: 'Some missed — note the limit' },
    { step: 'Swap model size', expect: 'Speed vs accuracy shifts as expected' },
    { step: 'Custom object (unfine-tuned)', expect: 'Not detected — needs training data' },
  ],
  output: [
    'A live video with clean labelled boxes and confidences, plus a detections stream for downstream use.',
    { file: 'detections.json', lang: 'json', body: `[
  { "label": "person", "conf": 0.94, "box": [220, 90, 310, 360] },
  { "label": "car",    "conf": 0.88, "box": [400, 210, 560, 300] },
  { "label": "dog",    "conf": 0.81, "box": [120, 260, 210, 350] }
]` },
    'Three objects detected in one frame with locations and confidences — the "what and where" layer other vision logic builds on.',
  ],
  troubleshoot: [
    { sym: 'Too slow / low FPS', cause: 'Model too big for hardware', fix: 'Use a smaller variant / lower input size; use a GPU/accelerator' },
    { sym: 'Duplicate boxes per object', cause: 'NMS-IoU too high', fix: 'Lower the NMS-IoU threshold' },
    { sym: 'Objects merged into one box', cause: 'NMS-IoU too low', fix: 'Raise the NMS-IoU threshold' },
    { sym: 'Many false detections', cause: 'Confidence too low', fix: 'Raise the confidence threshold' },
    { sym: 'Misses custom objects', cause: 'Not in training classes', fix: 'Fine-tune on labelled data for those classes' },
    { sym: 'Poor at night/indoors', cause: 'Domain shift', fix: 'Train on representative data for the conditions' },
  ],

  perf: [
    'Pick the smallest model meeting accuracy at real-time FPS.',
    'Tune confidence and NMS-IoU for clean, correct boxes.',
    'Use a GPU/accelerator or lower resolution for speed.',
    'Fine-tune on representative data for the real conditions.',
  ],
  safety: [
    'A detector is not infallible — do not rely on it alone for safety-critical decisions without redundancy and validation.',
    'Cameras raise privacy obligations — follow notice/consent rules and minimise stored imagery.',
    'Confidence scores are not guarantees; validate mAP before trusting it.',
    'Beware bias from unrepresentative training data.',
  ],
  maintenance: [
    'Retrain/fine-tune as conditions or classes change.',
    'Monitor accuracy for domain drift over time.',
    'Keep thresholds tuned to the deployment.',
    'Track FPS as models/hardware change.',
  ],
  future: [
    'Add multi-object tracking (assign persistent IDs across frames).',
    'Add segmentation (pixel masks) or pose on top of detection.',
    'Quantise/prune for faster edge inference.',
    'Add active learning to target hard cases in retraining.',
  ],
  faq: [
    { q: 'What is object detection vs classification?', a: 'Classification answers "what is this image?"; detection answers "what objects are present and where is each one?", localising a variable number of objects with bounding boxes and labels.' },
    { q: 'Why is YOLO fast?', a: 'It treats detection as a single pass through one network — the whole image in, all boxes and classes out at once — instead of proposing and classifying thousands of regions. "You Only Look Once" is literal.' },
    { q: 'What is non-maximum suppression?', a: 'The clean-up that collapses the many overlapping raw predictions for one object into a single box — keeping the highest-confidence box and suppressing others that overlap it heavily and share its class.' },
    { q: 'How do I choose a model size?', a: 'By the speed/accuracy trade-off for your hardware: a small model runs on a Pi/phone but is less accurate; a large model is accurate but needs a GPU for real-time video. Pick the smallest that meets your accuracy at the FPS you need.' },
    { q: 'Can it detect my custom objects?', a: 'Only after fine-tuning on labelled images of them. A pretrained model knows its training classes and nothing else, and its accuracy is capped by how well the data covers real angles, scales, lighting and occlusion.' },
  ],
  refs: [
    { t: 'Object detection', u: 'https://en.wikipedia.org/wiki/Object_detection', s: 'Reference' },
    { t: 'YOLO (You Only Look Once)', u: 'https://en.wikipedia.org/wiki/You_Only_Look_Once', s: 'Reference' },
    { t: 'Non-maximum suppression / IoU', u: 'https://en.wikipedia.org/wiki/Jaccard_index', s: 'Reference' },
    { t: 'Ultralytics YOLO', u: 'https://docs.ultralytics.com/', s: 'Docs' },
    { t: 'COCO dataset', u: 'https://cocodataset.org/', s: 'Dataset' },
  ],
  images: ['neural', 'cnn', 'cctv'],
  imageCaptions: [
    'A YOLO detector finds and labels many objects in a live stream — the "what and where" workhorse of applied vision.',
    'Detection localises a variable number of objects with boxes, unlike classification which labels the whole image.',
    'Model size sets the speed/accuracy trade-off — small models run on edge devices, large ones need a GPU.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A03 — Face Recognition Attendance
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A03',
  domainKey: 'ai',
  emoji: '🧑‍💻', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'Attendance by face — recognising who is present from a camera, with liveness checks that defeat a held-up photo, logged automatically.',
  platformName: 'Jetson/Pi (edge) or GPU workstation',
  ide: 'Python 3.11 + face-recognition / PyTorch',

  overview: [
    'Face-recognition attendance removes even the tap of a card: you simply look at the camera and your presence is recorded. It is genuinely useful — hands-free, hard to forget, and convenient — but it carries a danger the tap never did, which is that a face can be <b>spoofed with a photo</b>: hold up a printed picture or a phone showing someone\'s face and a naïve system will happily mark them present. So this project builds face-recognition attendance <i>with</i> the thing that makes it trustworthy — <b>liveness detection</b> — recognising who is present while checking that it is a <b>real, live person</b>, not a photo.',
    'Recognition works by turning a face into a <b>numeric embedding</b> — a vector that captures a person\'s facial features — and comparing it to enrolled embeddings: if a new face\'s embedding is close enough to an enrolled one, it is a match. Enrolment stores one embedding per person; at attendance time the camera detects a face, computes its embedding, finds the nearest enrolled match within a threshold, and logs the person. <b>Liveness</b> sits in front of this: before trusting a recognition, the system verifies the face is live — via a challenge (blink, turn, smile), texture/depth analysis that distinguishes skin from a flat print, or motion cues — so a static photo is rejected.',
    'The value is convenient, automatic, spoof-resistant attendance for offices, schools and secure entry. It is honest that this is a <b>sensitive</b> technology: face data is <b>biometric personal data</b> demanding consent, security and careful governance; recognition has real <b>bias and error</b> risks (accuracy can vary across demographics and must be validated); and liveness is an <b>arms race</b> (basic checks stop photos but sophisticated spoofs need stronger defences). Deployed responsibly, though, it delivers the real thing — hands-free attendance that knows who is present and refuses to be fooled by a picture — while being clear-eyed about the privacy and fairness obligations that come with recognising faces.',
  ],
  does: [
    'Recognises enrolled people from a camera to record attendance',
    'Turns faces into embeddings and matches to enrolled identities',
    'Checks liveness so a held-up photo is rejected',
    'Logs timestamped attendance automatically',
    'Enrols people from reference images',
    'Works hands-free for offices, schools, secure entry',
    'Handles face data as sensitive biometric personal data',
  ],
  features: [
    'Face detection + embedding + matching',
    'Anti-spoofing liveness detection',
    'Enrolment and identity management',
    'Timestamped attendance logging',
    'Match-threshold tuning (accept/reject)',
    'Privacy/security-conscious design',
    'Honest about bias, error and the liveness arms race',
  ],
  applications: [
    { t: 'Workplace attendance', d: 'Hands-free staff check-in with spoof resistance.' },
    { t: 'School / exam attendance', d: 'Automatic, hard-to-fake presence recording.' },
    { t: 'Secure access', d: 'Face-plus-liveness gating for entry.' },
    { t: 'Event check-in', d: 'Fast recognition of enrolled attendees.' },
  ],
  skills: [
    'Face detection and embedding (recognition) models',
    'Embedding matching and threshold tuning',
    'Liveness / anti-spoofing techniques',
    'Enrolment and identity data handling',
    'Biometric privacy, security and bias awareness',
  ],
  prereq: [
    'A face can be spoofed with a photo — liveness is what makes it trustworthy.',
    'Recognition = compare a face\'s embedding to enrolled embeddings within a threshold.',
    'Face data is sensitive biometric data — consent, security, governance.',
    'Recognition has bias/error risks — validate across demographics.',
  ],

  parts: ['picam', 'rpi4'],
  extraParts: [
    { name: 'Camera (+ IR/depth ideal)', spec: 'RGB camera; IR/depth strengthens liveness', qty: 1, price: 1800, note: 'Depth/IR helps anti-spoofing' },
    { name: 'Edge/GPU compute', spec: 'Jetson/Pi for edge, or GPU for training', qty: 1, price: 0 },
    { name: 'Recognition model', spec: 'Pretrained face-embedding model', qty: 1, price: 0 },
    { name: 'Secure store', spec: 'Encrypted store for embeddings + logs', qty: 1, price: 0, note: 'Biometric data — protect it' },
  ],
  cost: 'Software + camera; compute-dependent',
  libs: ['python', 'opencv', 'torch', 'numpy', 'sqlite'],

  wiringIntro: 'The "wiring" is the recognition data flow — a camera feeds faces to detection, embedding and liveness; a match within threshold on a live face produces a logged attendance record.',
  pins: {
    left: [
      { dev: 'Camera', devPin: 'frames', pin: '—', sig: 'Face images' },
      { dev: 'Liveness check', devPin: 'gate', pin: '—', sig: 'Real vs photo' },
    ],
    right: [
      { dev: 'Embedding match', devPin: 'compare', pin: '—', sig: 'Identity (threshold)' },
      { dev: 'Attendance log', devPin: 'record', pin: '—', sig: 'Who + when' },
    ],
  },
  wiringNotes: [
    'The camera provides face images; an IR/depth camera strengthens liveness.',
    'Liveness gates recognition — verify a live person before trusting a match.',
    'Compute an embedding and match to enrolled identities within a threshold.',
    'Log a timestamped attendance record on a live, matched face.',
    'Store embeddings and logs securely — they are biometric personal data.',
  ],

  block: { columns: [
    { label: 'Capture', edge: 'right', blocks: [
      { name: 'Camera', sub: 'face', highlight: true },
      { name: 'Detect face', sub: 'locate' },
    ] },
    { label: 'Verify live', edge: 'right', blocks: [
      { name: 'Liveness', sub: 'not a photo', highlight: true },
    ] },
    { label: 'Recognise', edge: 'right', blocks: [
      { name: 'Embedding', sub: 'vector' },
      { name: 'Match', sub: 'threshold' },
    ] },
    { label: 'Record', edge: 'none', blocks: [
      { name: 'Attendance', sub: 'who+when' },
      { name: 'Secure store', sub: 'biometric' },
    ] },
  ] },
  flow: [
    { t: 'Detect a face in the frame', k: 'start' },
    { t: 'Live person (not a photo)?', k: 'dec', yes: 'Compute embedding', no: 'Reject (spoof)' },
    { t: 'Reject (spoof)', k: 'io' },
    { t: 'Compute embedding', k: 'proc' },
    { t: 'Nearest enrolled within threshold?', k: 'dec', yes: 'Log attendance (who, when)', no: 'Unknown / no match' },
    { t: 'Log attendance (who, when)', k: 'io' },
    { t: 'Unknown / no match', k: 'io' },
    { t: 'Done', k: 'end', back: 'Detect a face in the frame' },
  ],

  principle: [
    'Face recognition for attendance is attractive because it is <b>frictionless and hard to forget</b> — you cannot leave your face at home — but its convenience hides a specific vulnerability that defines the whole design: a camera cannot, on its own, tell a real face from a <b>photograph of that face</b>. Hold up a printout or a phone screen and a recognition-only system marks the pictured person present. This "presentation attack" is the central threat, so a trustworthy system is not a recogniser bolted to a log — it is a recogniser <b>gated by liveness</b>. Getting that gate right is what separates a demo from something an organisation can rely on.',
    'The recognition itself works through <b>embeddings</b>. A face-recognition network maps a face image to a compact numeric vector — an <b>embedding</b> — engineered so that images of the <i>same</i> person land close together in the vector space and <i>different</i> people land far apart. Enrolment stores one (or a few) embeddings per person. At attendance time, a detected face is embedded and compared, by distance, to the enrolled set; if the nearest enrolled embedding is within a <b>match threshold</b>, the person is identified. That threshold is a genuine trade-off: too loose and it confuses similar-looking people (false accepts); too tight and it rejects genuine users on an off day (false rejects). Recognition, then, is fundamentally a nearest-neighbour comparison in an embedding space, with a tunable acceptance radius.',
    '<b>Liveness detection</b> is the defence, and it comes in escalating strengths. <b>Challenge-response</b> asks the user to do something a photo cannot — blink, turn the head, smile — and verifies it happened. <b>Passive</b> methods analyse the image itself for the tell-tales of a spoof: a printed photo lacks skin <b>texture</b> and micro-motion, has flat <b>depth</b> (an IR or depth camera sees a face as 3-D and a photo as flat), and shows print/screen artefacts. Stronger systems combine several cues. The key design principle is <b>ordering</b>: liveness must gate recognition — verify a live person <i>first</i>, and only then trust the identity — because recognising a photo perfectly is worthless if the system then acts on it.',
    'What makes this project honest — and what any responsible deployment must foreground — is that face recognition is a <b>sensitive</b> technology with obligations the card-tap version never had. A face embedding is <b>biometric personal data</b>: it must be collected with <b>consent</b>, stored <b>securely</b> (encrypted, access-controlled — a leaked biometric cannot be reissued like a password), and governed carefully, often under specific legal regimes. Recognition also carries real <b>fairness and accuracy risks</b>: models can perform unevenly across demographic groups if trained on unrepresentative data, so accuracy must be <b>validated across the actual population</b>, not assumed. And liveness is an <b>arms race</b> — basic checks defeat casual photo spoofs, but sophisticated attacks (high-quality masks, replayed video) need stronger, evolving defences, so no liveness check should be treated as final. Built with those responsibilities in front — liveness gating recognition, embeddings matched within a validated threshold, biometric data protected, and bias actively checked — it delivers exactly what face attendance promises: convenient, automatic, spoof-resistant presence recording that knows who is there and refuses to be fooled by a picture.',
  ],
  equations: [
    { t: 'Recognition by embedding distance', eq: 'embed(face) → vector v\n\n  match = argmin_i  distance(v, enrolled_i)\n  accept if distance(v, enrolled_match) ≤ THRESHOLD\n\nSame person → close; different → far. Threshold sets the\nfalse-accept vs false-reject trade-off.' },
    { t: 'Liveness gate (order matters)', eq: 'if NOT live(face):        reject (photo/spoof)   # FIRST\nelse if recognised(face): log attendance\nelse:                     unknown\n\nRecognising a photo perfectly is worthless — verify a live\nperson BEFORE trusting the identity.' },
    { t: 'Error trade-off', eq: 'loose threshold → more false accepts (wrong person in)\ntight threshold → more false rejects (genuine user out)\n\nChoose per risk; VALIDATE FAR/FRR across the real\npopulation (bias can differ by group).' },
  ],

  ai: {
    task: 'Recognise enrolled people from a camera for attendance by matching face embeddings within a threshold, gated by liveness detection to reject photo/video spoofs.',
    dataset: [
      'Recognition uses a face-embedding model (often pretrained on large face datasets); enrolment provides reference images per person.',
      'Liveness models/heuristics use real-vs-spoof samples (prints, screens, masks). Representative data across demographics is essential for fair accuracy.',
    ],
    datasetTable: [
      { n: 'Face-embedding pretraining', size: 'Large (many identities)', lic: 'Varies (check terms)', use: 'Base recognition embeddings' },
      { n: 'Enrolment images', size: 'Few per person', lic: 'With consent', use: 'Enrol identities' },
      { n: 'Liveness / anti-spoof set', size: 'Real vs spoof', lic: 'Varies', use: 'Train/validate liveness' },
      { n: 'Demographic validation set', size: 'Representative', lic: 'With consent', use: 'Check bias/accuracy fairness' },
    ],
    preprocess: [
      'Detect and align the face (crop, normalise pose/scale) before embedding.',
      'Quality-gate frames (blur, lighting, occlusion) — bad inputs cause errors.',
      'For liveness, gather challenge responses or texture/depth cues.',
    ],
    pipeline: [
      { name: 'Frame', sub: 'camera', highlight: true },
      { name: 'Detect+align', sub: 'face' },
      { name: 'Liveness', sub: 'real vs photo', highlight: true },
      { name: 'Embed', sub: 'vector' },
      { name: 'Match', sub: 'threshold' },
      { name: 'Log', sub: 'attendance' },
    ],
    archTable: [
      { l: 'Detector', s: 'face detection + alignment', p: 'Find/normalise the face' },
      { l: 'Liveness', s: 'challenge / texture / depth', p: 'Reject photo/video spoofs' },
      { l: 'Embedding net', s: 'face → vector', p: 'Compact identity representation' },
      { l: 'Matcher', s: 'nearest neighbour + threshold', p: 'Identify enrolled person' },
      { l: 'Store', s: 'encrypted embeddings + logs', p: 'Protect biometric data' },
    ],
    hyper: [
      { k: 'Match threshold', v: 'model-specific', w: 'False accept vs false reject' },
      { k: 'Liveness strictness', v: 'app-specific', w: 'Spoof resistance vs friction' },
      { k: 'Embedding dim', v: '≈ 128–512', w: 'Model-defined identity vector' },
      { k: 'Enrol images/person', v: '≈ 1–5', w: 'Robustness to pose/lighting' },
    ],
    training: [
      'Use a pretrained embedding model; enrol by computing per-person embeddings (no full retraining needed).',
      'Train/tune liveness on real-vs-spoof samples; combine cues for strength.',
      'Validate false-accept/false-reject rates across demographics — do not assume uniform accuracy.',
    ],
    metricsIntro: [
      'The key metrics are recognition error rates (false accept / false reject), liveness spoof-rejection, and — critically — fairness of accuracy across demographic groups.',
    ],
    metrics: [
      { m: 'False accept rate (FAR)', v: 'low (target)', d: 'Wrong person accepted' },
      { m: 'False reject rate (FRR)', v: 'low (target)', d: 'Genuine user rejected' },
      { m: 'Spoof rejection', v: 'high (target)', d: 'Photos/videos blocked' },
      { m: 'Fairness (by group)', v: 'validated', d: 'No large accuracy gaps' },
    ],
    chart: { title: 'Liveness strength vs spoof type', unit: '', desc: 'Basic liveness stops photos; sophisticated spoofs need stronger, combined defences — an arms race (illustrative).', bars: [
      { label: 'Printed photo', value: 95 },
      { label: 'Screen replay', value: 82 },
      { label: 'Cut-out/mask', value: 60 },
      { label: 'High-end spoof', value: 40 },
    ] },
    inference: { file: 'attendance.py', lang: 'python', body: `import numpy as np

THRESHOLD = 0.6                       # match radius (model-specific)

def recognise_and_log(frame, enrolled, embed, is_live, log):
    face = detect_and_align(frame)
    if face is None:
        return None

    if not is_live(face, frame):      # LIVENESS FIRST — reject photo/video
        return "spoof_rejected"

    v = embed(face)                   # face -> embedding vector
    # nearest enrolled identity by distance
    name, dist = min(((n, np.linalg.norm(v - e)) for n, e in enrolled.items()),
                     key=lambda x: x[1])
    if dist <= THRESHOLD:             # within acceptance radius
        log.record(name, now())       # timestamped attendance
        return name
    return "unknown"                  # no confident match
    # NOTE: embeddings + logs are biometric personal data — store encrypted.` },
    limits: [
      'Liveness is an arms race — basic checks stop photos, sophisticated spoofs need more.',
      'Recognition accuracy can vary by demographic — validate FAR/FRR across the real population.',
      'Face data is biometric personal data — consent, encryption and governance are mandatory.',
      'Lighting, pose, occlusion and ageing degrade accuracy; enrol well and re-validate.',
    ],
  },

  assembly: [
    { h: 'Set up detection, embedding and enrolment', p: [
      'Detect and align faces, compute embeddings with a pretrained model, and enrol people from consented reference images into a secure store.',
    ], warn: 'Face embeddings are biometric personal data. Obtain consent, store them encrypted and access-controlled (a leaked biometric cannot be reissued), and validate accuracy across your actual population for fairness.' },
    { h: 'Add liveness as the gate', p: [
      'Verify a live person before trusting recognition — challenge (blink/turn), texture/depth, or combined cues — so a photo is rejected.',
    ] },
    { h: 'Match, log and tune', p: [
      'Match embeddings within a threshold, log attendance, and tune the threshold/liveness strictness for your risk and population.',
    ] },
  ],
  steps: [
    { h: 'Gate on liveness, then recognise', p: [
      'Reject spoofs with liveness first, then match the face embedding to enrolled identities within a threshold and log the person.',
    ], code: {
      file: 'recognise.py', lang: 'python',
      body: `import numpy as np
THRESHOLD = 0.6

def attend(frame, enrolled, embed, is_live):
    face = detect_and_align(frame)
    if face is None: return None
    if not is_live(face, frame):          # LIVENESS gates recognition
        return "spoof_rejected"           # a photo never gets past here
    v = embed(face)                       # embedding
    name, dist = min(((n, np.linalg.norm(v - e))
                      for n, e in enrolled.items()), key=lambda x: x[1])
    return name if dist <= THRESHOLD else "unknown"   # within radius = match`,
      explain: [
        { ref: 'if not is_live(face, frame):          # LIVENESS gates recognition', txt: 'Liveness runs first and gates everything — a held-up photo is rejected before recognition is even trusted.' },
        { ref: 'v = embed(face)                       # embedding', txt: 'The face becomes a numeric vector engineered so the same person\'s faces are close and different people far apart.' },
        { ref: 'name, dist = min(((n, np.linalg.norm(v - e))', txt: 'Recognition is a nearest-neighbour search over enrolled embeddings — the closest identity by distance.' },
        { ref: 'return name if dist <= THRESHOLD else "unknown"   # within radius = match', txt: 'Only a match inside the acceptance radius is trusted; the threshold sets the false-accept vs false-reject trade-off.' },
      ],
    } },
    { h: 'Log securely and validate fairness', p: [
      'Record timestamped attendance to an encrypted store, and validate false-accept/false-reject rates across your population before trusting the system.',
    ], tip: 'Validate accuracy on your actual population, not a benchmark — recognition can perform unevenly across demographics, and an unfair system is a broken system.' },
  ],

  code: [{
    file: 'face_attendance.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Face Recognition Attendance (with liveness)

Recognises enrolled people from a camera by matching face embeddings
within a threshold, GATED BY LIVENESS so a photo/video spoof is
rejected. Logs timestamped attendance. Face embeddings are biometric
personal data — consent, encryption, governance, and fairness required.
"""
import numpy as np, time

THRESHOLD = 0.6                        # match radius (model-specific)

class FaceAttendance:
    def __init__(self, embed, is_live, store):
        self.embed = embed             # face -> vector
        self.is_live = is_live         # liveness check
        self.store = store             # encrypted enrolments + logs

    def enrol(self, name, images):     # consented reference images
        vecs = [self.embed(detect_and_align(im)) for im in images]
        self.store.save_embedding(name, np.mean(vecs, axis=0))   # encrypted

    def attend(self, frame):
        face = detect_and_align(frame)
        if face is None:
            return None

        if not self.is_live(face, frame):        # LIVENESS FIRST
            return "spoof_rejected"              # photo/video never passes

        v = self.embed(face)
        name, dist = self.store.nearest(v)       # nearest enrolled identity
        if dist <= THRESHOLD:                     # within acceptance radius
            self.store.log(name, time.time())     # timestamped attendance
            return name
        return "unknown"                          # no confident match

if __name__ == "__main__":
    fa = FaceAttendance(embed_model, liveness_check, SecureStore())
    for frame in camera():                        # live
        result = fa.attend(frame)
        # result: a name (logged), "spoof_rejected", "unknown", or None
    # Validate FAR/FRR across demographics before trusting in production.`,
    explain: [
      { ref: 'def enrol(self, name, images):     # consented reference images', txt: 'Enrolment stores a per-person embedding from consented images — the reference the system matches against.' },
      { ref: 'if not self.is_live(face, frame):        # LIVENESS FIRST', txt: 'Liveness is checked before recognition is trusted, so a photo or replayed video is rejected up front — the property that makes face attendance trustworthy.' },
      { ref: 'name, dist = self.store.nearest(v)       # nearest enrolled identity', txt: 'Recognition finds the closest enrolled embedding; the store holds these biometric vectors encrypted.' },
      { ref: 'if dist <= THRESHOLD:                     # within acceptance radius', txt: 'Only a match within the threshold is accepted — the dial between false accepts and false rejects.' },
      { ref: '# Validate FAR/FRR across demographics before trusting in production.', txt: 'Fairness is not optional: recognition accuracy must be validated across the real population, since it can vary by group.' },
    ],
  }],

  config: [
    'Configure the embedding model, match threshold and liveness method/strictness.',
    'Configure enrolment (consented images) and the encrypted store.',
    'Configure attendance logging and retention.',
    'Configure fairness validation across your population.',
  ],
  calibration: [
    { h: 'Match threshold', p: [
      'Tune to balance false accepts (wrong person) vs false rejects (genuine user), per your risk.',
    ] },
    { h: 'Liveness', p: [
      'Verify photos/replays are rejected; balance strictness against user friction.',
    ] },
    { h: 'Fairness', p: [
      'Measure FAR/FRR across demographic groups; address large gaps before deployment.',
    ] },
  ],
  testing: [
    { step: 'Enrolled person looks at camera', expect: 'Recognised and logged' },
    { step: 'Hold up a printed photo', expect: 'Rejected by liveness' },
    { step: 'Replay a video of a face', expect: 'Rejected (stronger liveness) — note arms race' },
    { step: 'Unenrolled person', expect: '"unknown" — not logged' },
    { step: 'Vary lighting/pose', expect: 'Still recognised if enrolled well' },
    { step: 'Check group accuracy', expect: 'No large FAR/FRR gaps across groups' },
  ],
  output: [
    'Automatic attendance for recognised live people, with spoof rejection and secure logging.',
    { file: 'attendance-log.json', lang: 'json', body: `{
  "name": "A. Verma",
  "time": "2026-07-28T09:03:41",
  "liveness": "passed",
  "match_distance": 0.42,
  "result": "present"
}` },
    'A. Verma was recognised as a live person (liveness passed, comfortable match distance) and logged present — a held-up photo would have been rejected before recognition was trusted.',
  ],
  troubleshoot: [
    { sym: 'Accepts a photo', cause: 'No/weak liveness', fix: 'Gate recognition on liveness; strengthen/combine cues' },
    { sym: 'Confuses similar people', cause: 'Threshold too loose', fix: 'Tighten the match threshold; enrol better images' },
    { sym: 'Rejects genuine users', cause: 'Threshold too tight / poor enrolment', fix: 'Loosen threshold; enrol multiple poses/lighting' },
    { sym: 'Uneven accuracy by group', cause: 'Unrepresentative data', fix: 'Validate/retrain across demographics; address gaps' },
    { sym: 'Fails in poor lighting', cause: 'Input quality', fix: 'Improve lighting; quality-gate frames; consider IR' },
    { sym: 'Privacy concern', cause: 'Unsecured biometric data', fix: 'Consent, encrypt, access-control, govern retention' },
  ],

  perf: [
    'Gate recognition on liveness — verify a live person first.',
    'Tune the match threshold for your false-accept/false-reject risk.',
    'Combine liveness cues against stronger spoofs.',
    'Validate accuracy fairness across the real population.',
  ],
  safety: [
    'Face embeddings are biometric personal data — consent, encryption, access control and governed retention are mandatory (a leaked biometric cannot be reissued).',
    'Validate accuracy across demographics; an unfair recogniser is unacceptable.',
    'Liveness is an arms race — do not treat any check as final; layer defences.',
    'Provide a fallback and human recourse for false rejects.',
  ],
  maintenance: [
    'Re-validate FAR/FRR and fairness periodically and after model changes.',
    'Update enrolments as appearances change; manage joiners/leavers.',
    'Strengthen liveness as new spoofs emerge.',
    'Audit access to biometric data and logs.',
  ],
  future: [
    'Add depth/IR cameras for stronger passive liveness.',
    'Add multi-frame/temporal liveness against video replay.',
    'Add on-device recognition so faces never leave the unit.',
    'Add a second factor for high-security contexts.',
  ],
  faq: [
    { q: 'Why is liveness essential?', a: 'Because a camera cannot, by itself, tell a real face from a photo of it. Without liveness, holding up a printout or a phone marks the pictured person present. Liveness gates recognition so a spoof is rejected first.' },
    { q: 'How does recognition actually work?', a: 'A network turns a face into an embedding — a vector where the same person\'s faces are close and different people far apart. A new face is embedded and matched to the nearest enrolled identity; if it is within a threshold, it is accepted.' },
    { q: 'What does the threshold do?', a: 'It sets the acceptance radius. Loose accepts more (risking false accepts of similar-looking people); tight rejects more (risking false rejects of genuine users). It is tuned to the deployment\'s risk and validated across the population.' },
    { q: 'Is face data safe to use?', a: 'Only with real safeguards. A face embedding is biometric personal data requiring consent, encrypted and access-controlled storage, and governed retention — a leaked biometric cannot be changed like a password.' },
    { q: 'Can it be biased?', a: 'Yes — recognition can perform unevenly across demographic groups if trained on unrepresentative data. Accuracy must be validated across the actual population and large gaps addressed before deployment.' },
  ],
  refs: [
    { t: 'Facial recognition system', u: 'https://en.wikipedia.org/wiki/Facial_recognition_system', s: 'Reference' },
    { t: 'Face embeddings (metric learning)', u: 'https://en.wikipedia.org/wiki/Triplet_loss', s: 'Reference' },
    { t: 'Liveness / presentation-attack detection', u: 'https://en.wikipedia.org/wiki/Liveness_detection', s: 'Reference' },
    { t: 'Biometric data protection', u: 'https://en.wikipedia.org/wiki/Biometrics#Privacy_and_discrimination', s: 'Reference' },
    { t: 'Bias in face recognition', u: 'https://en.wikipedia.org/wiki/Facial_recognition_system#Bias', s: 'Reference' },
  ],
  images: ['neural', 'health', 'cctv'],
  imageCaptions: [
    'Face-recognition attendance is hands-free — but only trustworthy when liveness rejects a held-up photo.',
    'Recognition maps a face to an embedding and matches the nearest enrolled identity within a threshold.',
    'Face data is biometric personal data — consent, encryption, governance and fairness are non-negotiable.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A04 — Sign Language Translator
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A04',
  domainKey: 'ai',
  emoji: '🤟', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'Translates hand-sign gestures into text in real time from a camera — using hand and pose landmarks to read signs as they are made.',
  platformName: 'Pi/Jetson (edge) or GPU workstation',
  ide: 'Python 3.11 + MediaPipe / PyTorch',

  overview: [
    'Sign language is a rich, full language expressed through the hands, face and body — and a system that can read it and turn it into text opens communication between signers and non-signers. This project builds a real-time <b>sign language translator</b>: a camera watches a person sign, and the system recognises the gestures and outputs the corresponding <b>text</b> as they sign. It is a compelling application of vision because signs are not static pictures but <b>movements</b>, and reading them well means capturing how the hands are shaped and how they move over time.',
    'The key design choice that makes this tractable is to work from <b>landmarks, not raw pixels</b>. Rather than feed the network raw video, the system first extracts <b>hand and pose keypoints</b> — the positions of finger joints, palm, and (for many signs) the arms and face — using a pose/hand-landmark model. A sign is then a <b>trajectory of these landmarks over time</b>, and a sequence model classifies that trajectory into a sign/word. Landmarks make recognition far more robust to background, clothing, lighting and skin tone than raw pixels, and dramatically reduce the data and compute needed — which is why landmark-based recognition is the standard approach.',
    'The value is a real-time bridge from sign to text — for accessibility, communication aids, and learning. It is honest about being a <b>hard and easily over-claimed</b> problem: real sign languages have their own <b>grammar, facial grammar and context</b> (they are not word-for-word English on the hands), signs vary between signers and dialects, and continuous signing is much harder than isolated signs. A realistic project recognises a <b>vocabulary of signs</b> reliably rather than claiming full fluent translation. Built and framed honestly — landmark-based, real-time, scoped to a learnable vocabulary, and clear that full sign-language translation is an open research problem — it is both a genuinely useful accessibility tool and an excellent lesson in gesture and sequence recognition.',
  ],
  does: [
    'Translates hand-sign gestures into text in real time',
    'Extracts hand/pose landmarks from the camera',
    'Reads signs as trajectories of landmarks over time',
    'Classifies gestures into signs/words with a sequence model',
    'Is robust to background/lighting via landmarks (not pixels)',
    'Bridges communication between signers and non-signers',
    'Scopes honestly to a learnable vocabulary',
  ],
  features: [
    'Hand + pose landmark extraction',
    'Temporal (sequence) gesture recognition',
    'Real-time sign-to-text output',
    'Landmark-based robustness to appearance',
    'Vocabulary-scoped recognition',
    'Accessibility-oriented design',
    'Honest about grammar, variation and continuous signing',
  ],
  applications: [
    { t: 'Accessibility / communication', d: 'Helping signers and non-signers communicate.' },
    { t: 'Learning aids', d: 'Practising and checking signs against a vocabulary.' },
    { t: 'Interactive kiosks', d: 'Sign-driven interfaces for services.' },
    { t: 'Gesture interfaces (general)', d: 'The technique generalises to gesture control.' },
  ],
  skills: [
    'Hand/pose landmark extraction',
    'Temporal sequence modelling (gestures over time)',
    'Gesture/word classification and vocabulary scoping',
    'Real-time landmark pipelines',
    'Honest framing of sign-language complexity',
  ],
  prereq: [
    'Signs are movements — capture how hands are shaped AND how they move over time.',
    'Work from landmarks, not raw pixels — robust and efficient.',
    'Sign languages have their own grammar — this is not word-for-word English.',
    'Scope to a vocabulary; full fluent translation is open research.',
  ],

  parts: ['picam', 'rpi4'],
  extraParts: [
    { name: 'Camera', spec: 'Webcam/CSI camera viewing the signer', qty: 1, price: 1500 },
    { name: 'Edge/GPU compute', spec: 'Pi/Jetson for edge, GPU for training', qty: 1, price: 0 },
    { name: 'Landmark model', spec: 'Hand/pose landmark extractor (e.g. MediaPipe)', qty: 1, price: 0 },
    { name: 'Sign dataset (vocabulary)', spec: 'Labelled sign sequences for your vocabulary', qty: 1, price: 0, note: 'Recognises what it is trained on' },
  ],
  cost: 'Software + camera; compute-dependent',
  libs: ['python', 'mediapipe', 'opencv', 'torch', 'numpy'],

  wiringIntro: 'The "wiring" is the recognition data flow — a camera feeds frames to a landmark extractor; landmark sequences feed a temporal classifier that outputs recognised signs as text.',
  pins: {
    left: [
      { dev: 'Camera', devPin: 'frames', pin: '—', sig: 'Signer video' },
      { dev: 'Landmark model', devPin: 'keypoints', pin: '—', sig: 'Hand/pose points' },
    ],
    right: [
      { dev: 'Sequence model', devPin: 'classify', pin: '—', sig: 'Sign over time' },
      { dev: 'Text output', devPin: 'display', pin: '—', sig: 'Recognised words' },
    ],
  },
  wiringNotes: [
    'The camera provides frames of the signer.',
    'A hand/pose landmark model extracts keypoints per frame.',
    'A window of landmark sequences is classified into a sign/word.',
    'Recognised signs are emitted as text in real time.',
    'Landmarks (not pixels) give robustness to background, lighting and appearance.',
  ],

  block: { columns: [
    { label: 'See', edge: 'right', blocks: [
      { name: 'Camera', sub: 'signer', highlight: true },
    ] },
    { label: 'Landmarks', edge: 'right', blocks: [
      { name: 'Hand/pose', sub: 'keypoints', highlight: true },
      { name: 'Per frame', sub: 'sequence' },
    ] },
    { label: 'Recognise', edge: 'right', blocks: [
      { name: 'Sequence model', sub: 'over time', highlight: true },
      { name: 'Sign/word', sub: 'vocabulary' },
    ] },
    { label: 'Output', edge: 'none', blocks: [
      { name: 'Text', sub: 'real-time' },
    ] },
  ] },
  flow: [
    { t: 'Grab a frame', k: 'start' },
    { t: 'Extract hand/pose landmarks', k: 'proc' },
    { t: 'Append to landmark sequence (window)', k: 'proc' },
    { t: 'Window complete?', k: 'dec', yes: 'Classify sequence → sign', no: 'Next frame' },
    { t: 'Classify sequence → sign', k: 'proc' },
    { t: 'Confident sign?', k: 'dec', yes: 'Emit text', no: 'Wait / next' },
    { t: 'Emit text', k: 'io' },
    { t: 'Wait / next', k: 'end', back: 'Grab a frame' },
  ],

  principle: [
    'A sign is not a picture, it is a <b>motion</b>: the same hand shape can mean different things depending on how it moves, where it is placed, and what the face and body do alongside it. So sign recognition is fundamentally a <b>temporal</b> problem — you must capture not just a frozen pose but the <b>trajectory</b> of the hands (and often the arms and face) over the duration of the sign. This is what separates it from ordinary image classification and makes it a lesson in <b>sequence</b> modelling as much as in vision.',
    'The pivotal engineering decision is to represent the signer as <b>landmarks rather than raw pixels</b>. A hand/pose model detects keypoints — the joints of each finger, the palm, the wrist, and body/face points — giving, per frame, a compact set of coordinates that describes exactly the hand shape and configuration that carry a sign\'s meaning. Feeding these landmarks (instead of the whole image) to the recogniser has decisive advantages: it is <b>robust</b> to background, clothing, lighting and skin tone (all discarded, only geometry remains), it needs far <b>less data and compute</b>, and it focuses the model on what actually matters. This is why landmark-based recognition, not end-to-end raw-video learning, is the practical standard.',
    'Recognition then becomes <b>classifying a sequence of landmark frames</b> into a sign. A window of consecutive landmark sets — the motion of the hands over, say, a second — is fed to a temporal model (an LSTM/GRU, a temporal convolution, or a small transformer) trained to map that trajectory to a sign/word in a vocabulary. Because signs have duration, the system works over sliding windows and emits a recognised sign when the model is confident, handling the timing of when one sign ends and another begins. The vocabulary is defined by the <b>training data</b>: the system recognises the signs it was trained on, and its accuracy depends on covering the natural variation in how those signs are made.',
    'What makes an <i>honest</i> sign translator is refusing to over-claim, because this is a problem that is easy to demo and hard to solve fully. Real sign languages (ASL, ISL, BSL and others) are <b>complete languages with their own grammar</b> — including crucial <b>facial grammar</b> and spatial/contextual meaning — and are emphatically <b>not word-for-word English on the hands</b>; a system that maps hand shapes to English words is recognising signs, not truly translating a language. Signs also <b>vary</b> between signers, regions and dialects, and <b>continuous</b> natural signing (fluid, co-articulated) is dramatically harder than isolated, deliberate signs. A responsible project therefore scopes itself to <b>reliably recognising a defined vocabulary</b> of signs in real time — genuinely useful for communication and learning — while being explicit that full, fluent sign-language translation, with its grammar and context, remains an <b>open research problem</b>. Framed that way, the translator is both an honestly-bounded accessibility tool and an excellent, complete lesson in landmark extraction and temporal gesture recognition.',
  ],
  equations: [
    { t: 'Landmark representation', eq: 'Per frame t: landmarks L_t = [(x,y,z)_1 ... (x,y,z)_K]\n  (finger joints, palm, wrist; + pose/face points)\n\nDiscards pixels → robust to background/lighting/appearance,\nkeeps the geometry that carries a sign\'s meaning.' },
    { t: 'Sign as a landmark sequence', eq: 'A sign = a trajectory over a window of W frames:\n\n  S = [L_{t}, L_{t+1}, ..., L_{t+W}]\n\n  sign = classify_sequence(S)   # temporal model (LSTM/TCN/transformer)\n\nMotion over time, not a single pose, defines the sign.' },
    { t: 'Real-time emission', eq: 'slide window across frames; classify continuously\n\n  emit sign when confidence ≥ threshold AND stable\n  handle sign boundaries (start/end)\n\nVocabulary = the signs the model was TRAINED on.' },
  ],

  ai: {
    task: 'Recognise hand signs from a camera in real time and output text, using per-frame hand/pose landmarks fed to a temporal sequence classifier over a defined vocabulary.',
    dataset: [
      'Training data is labelled sign sequences (video → landmark sequences) for the target vocabulary, covering multiple signers and natural variation.',
      'Landmark extraction is done by a pretrained hand/pose model; the temporal classifier is trained on the landmark sequences.',
    ],
    datasetTable: [
      { n: 'Sign vocabulary dataset', size: 'Per-sign samples', lic: 'Varies (check terms)', use: 'Train the sign classifier' },
      { n: 'Multi-signer recordings', size: 'Several signers', lic: 'With consent', use: 'Robustness to variation' },
      { n: 'Landmark model (pretrained)', size: '—', lic: 'Library terms', use: 'Extract hand/pose keypoints' },
      { n: 'Continuous-signing set', size: 'Harder', lic: 'Varies', use: '(Advanced) continuous recognition' },
    ],
    preprocess: [
      'Extract per-frame hand/pose landmarks; normalise for position/scale (signer distance/size).',
      'Window sequences to a fixed length; handle variable sign durations.',
      'Augment (mirroring, speed, small jitter) for robustness across signers.',
    ],
    pipeline: [
      { name: 'Frame', sub: 'camera', highlight: true },
      { name: 'Landmarks', sub: 'hand/pose' },
      { name: 'Window', sub: 'sequence' },
      { name: 'Temporal model', sub: 'classify', highlight: true },
      { name: 'Text', sub: 'sign/word' },
    ],
    archTable: [
      { l: 'Landmark extractor', s: 'hand/pose keypoints per frame', p: 'Robust, compact representation' },
      { l: 'Normalisation', s: 'position/scale invariant', p: 'Signer-distance independence' },
      { l: 'Temporal model', s: 'LSTM / TCN / small transformer', p: 'Classify the motion over time' },
      { l: 'Decoder', s: 'confidence + boundaries', p: 'Emit stable signs as text' },
      { l: 'Vocabulary', s: 'trained sign set', p: 'Recognises what it was trained on' },
    ],
    hyper: [
      { k: 'Window length', v: '≈ 0.5–1.5 s', w: 'Cover a sign\'s duration' },
      { k: 'Landmarks used', v: 'hands (+pose/face)', w: 'More context vs complexity' },
      { k: 'Confidence threshold', v: 'app-specific', w: 'Emit vs wait' },
      { k: 'Model type', v: 'LSTM/TCN/transformer', w: 'Temporal capacity vs cost' },
    ],
    training: [
      'Train the temporal classifier on landmark sequences for the vocabulary, across multiple signers.',
      'Augment for signer/speed variation; validate on held-out signers (not just held-out clips).',
      'Start with isolated signs; treat continuous signing as an advanced extension.',
    ],
    metricsIntro: [
      'Accuracy is per-sign recognition rate on held-out signers, plus real-time latency. Generalising to new signers is the honest test.',
    ],
    metrics: [
      { m: 'Per-sign accuracy', v: 'vocabulary-dependent', d: 'Recognition on trained signs' },
      { m: 'Held-out-signer accuracy', v: 'lower (honest)', d: 'Generalises to new signers?' },
      { m: 'Latency', v: 'real-time', d: 'Usable live' },
      { m: 'Continuous signing', v: 'much harder', d: 'Open problem — scope honestly' },
    ],
    chart: { title: 'Difficulty by scope', unit: '', desc: 'Isolated vocabulary signs are tractable; continuous, grammatical translation is far harder — scope honestly (illustrative).', bars: [
      { label: 'Isolated signs', value: 88 },
      { label: 'New signers', value: 72 },
      { label: 'Continuous signing', value: 50 },
      { label: 'Full grammar/translation', value: 30 },
    ] },
    inference: { file: 'sign.py', lang: 'python', body: `import numpy as np
from collections import deque

WINDOW = 30                            # frames (~1 s)

class SignTranslator:
    def __init__(self, landmarker, classifier, labels, conf=0.7):
        self.lm = landmarker; self.clf = classifier
        self.labels = labels; self.conf = conf
        self.buf = deque(maxlen=WINDOW)

    def step(self, frame):
        lms = self.lm.extract(frame)   # hand/pose landmarks (not pixels)
        if lms is None: return None
        self.buf.append(normalise(lms))            # position/scale invariant
        if len(self.buf) < WINDOW: return None     # need a full window

        seq = np.stack(self.buf)                    # landmark trajectory
        probs = self.clf.predict(seq[None])[0]      # temporal classification
        i = int(np.argmax(probs))
        if probs[i] >= self.conf:                   # confident + stable
            return self.labels[i]                   # emit recognised sign (text)
        return None
        # NOTE: recognises the TRAINED vocabulary — not full sign-language grammar.` },
    limits: [
      'Recognises a trained vocabulary of signs — not full, grammatical sign-language translation.',
      'Sign languages have their own grammar (incl. facial grammar) — not word-for-word English.',
      'Signs vary by signer/dialect; validate on held-out signers.',
      'Continuous natural signing is much harder than isolated signs.',
    ],
  },

  assembly: [
    { h: 'Set up landmark extraction', p: [
      'Stream camera frames and extract per-frame hand/pose landmarks with a pretrained model; normalise for signer position and scale.',
    ], warn: 'Frame this honestly: real sign languages have their own grammar (including facial grammar) and are not word-for-word English. Scope the system to reliably recognising a defined vocabulary, not to claiming full fluent translation.' },
    { h: 'Recognise sign sequences', p: [
      'Window the landmark sequences and classify the motion into a sign/word with a temporal model, emitting text when confident.',
    ] },
    { h: 'Train and validate on signers', p: [
      'Train the classifier on your vocabulary across multiple signers, and validate on held-out signers, not just held-out clips.',
    ] },
  ],
  steps: [
    { h: 'Turn landmark motion into a recognised sign', p: [
      'Extract landmarks, buffer a window of them, and classify the trajectory into a sign, emitting text when confident.',
    ], code: {
      file: 'recognise.py', lang: 'python',
      body: `import numpy as np
from collections import deque
WINDOW = 30

def make_recogniser(landmarker, classifier, labels, conf=0.7):
    buf = deque(maxlen=WINDOW)
    def step(frame):
        lms = landmarker.extract(frame)        # landmarks, not pixels
        if lms is None: return None
        buf.append(normalise(lms))             # signer-distance invariant
        if len(buf) < WINDOW: return None      # need the full motion window
        probs = classifier.predict(np.stack(buf)[None])[0]  # temporal classify
        i = int(np.argmax(probs))
        return labels[i] if probs[i] >= conf else None      # confident sign
    return step`,
      explain: [
        { ref: 'lms = landmarker.extract(frame)        # landmarks, not pixels', txt: 'Working from landmarks discards background, lighting and appearance, keeping only the geometry that carries a sign — the robustness that makes the approach practical.' },
        { ref: 'buf.append(normalise(lms))             # signer-distance invariant', txt: 'Normalising landmarks makes recognition independent of how far or large the signer appears.' },
        { ref: 'if len(buf) < WINDOW: return None      # need the full motion window', txt: 'A sign is motion over time, so a full window of frames is needed before classifying — the temporal nature of the problem.' },
        { ref: 'return labels[i] if probs[i] >= conf else None      # confident sign', txt: 'A sign is emitted only when the temporal model is confident, over the trained vocabulary.' },
      ],
    } },
    { h: 'Emit text and handle boundaries', p: [
      'Emit recognised signs as text, handling when one sign ends and the next begins, and keep the vocabulary scope explicit to the user.',
    ], tip: 'Validate on signers the model never trained on — held-out-clip accuracy flatters; the honest test is whether it generalises to a new person\'s signing.' },
  ],

  code: [{
    file: 'sign_translator.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Sign Language Translator (vocabulary-scoped)

Extracts hand/pose LANDMARKS (not raw pixels) per frame, classifies the
landmark TRAJECTORY over a window into a sign/word with a temporal
model, and emits text in real time. Recognises a trained VOCABULARY —
not full grammatical sign-language translation (an open research problem).
"""
import numpy as np
from collections import deque

WINDOW, CONF = 30, 0.7

class SignTranslator:
    def __init__(self, landmarker, classifier, labels):
        self.lm = landmarker; self.clf = classifier; self.labels = labels
        self.buf = deque(maxlen=WINDOW)
        self.last = None

    def step(self, frame):
        lms = self.lm.extract(frame)              # hand/pose landmarks
        if lms is None:
            return None
        self.buf.append(normalise(lms))            # position/scale invariant
        if len(self.buf) < WINDOW:
            return None                            # need the full motion window

        probs = self.clf.predict(np.stack(self.buf)[None])[0]  # temporal
        i = int(np.argmax(probs))
        if probs[i] >= CONF and self.labels[i] != self.last:   # stable + new
            self.last = self.labels[i]
            return self.labels[i]                  # emit recognised sign as text
        return None

    def run(self, camera, on_text):
        for frame in camera.frames():
            sign = self.step(frame)
            if sign:
                on_text(sign)                      # append to the text output

if __name__ == "__main__":
    tr = SignTranslator(HandPoseLandmarker(), TemporalClassifier(), VOCAB)
    tr.run(Camera(), print)
    # Scope: recognises VOCAB signs. Full fluent translation (grammar,
    # facial grammar, context, continuous signing) is out of scope.`,
    explain: [
      { ref: 'lms = self.lm.extract(frame)              # hand/pose landmarks', txt: 'Landmarks are the representation — robust to appearance and efficient — the standard practical approach to sign recognition.' },
      { ref: 'if len(self.buf) < WINDOW:\n            return None                            # need the full motion window', txt: 'The system waits for a full window of motion, because a sign is defined by movement over time, not a single frame.' },
      { ref: 'probs = self.clf.predict(np.stack(self.buf)[None])[0]  # temporal', txt: 'A temporal model classifies the landmark trajectory into a sign — sequence modelling at the core.' },
      { ref: 'if probs[i] >= CONF and self.labels[i] != self.last:   # stable + new', txt: 'A sign is emitted only when confident and different from the last, handling sign boundaries in continuous input.' },
      { ref: '# Scope: recognises VOCAB signs. Full fluent translation ...', txt: 'The scope is stated honestly — a trained vocabulary, not full grammatical translation, which remains open research.' },
    ],
  }],

  config: [
    'Configure the landmark model, window length and vocabulary/labels.',
    'Configure the temporal classifier and confidence threshold.',
    'Configure normalisation and sign-boundary handling.',
    'Configure the camera and text output.',
  ],
  calibration: [
    { h: 'Window/latency', p: [
      'Set the window to cover a sign\'s duration while keeping latency usable.',
    ] },
    { h: 'Confidence', p: [
      'Tune the emit threshold so signs register reliably without spurious outputs.',
    ] },
    { h: 'Signer generalisation', p: [
      'Validate on held-out signers; add data to cover variation.',
    ] },
  ],
  testing: [
    { step: 'Sign a trained word clearly', expect: 'Correct text emitted' },
    { step: 'Different signer signs it', expect: 'Still recognised (if generalised)' },
    { step: 'Change background/lighting', expect: 'Robust (landmark-based)' },
    { step: 'Sign a word not in vocabulary', expect: 'Not recognised — note scope' },
    { step: 'Sign continuously/quickly', expect: 'Harder — note continuous-signing limit' },
    { step: 'Check facial-grammar signs', expect: 'Limited — not full grammar' },
  ],
  output: [
    'Real-time text from recognised signs, over a defined vocabulary, robust to appearance.',
    { file: 'sign-output.json', lang: 'json', body: `{
  "window_s": 1.0,
  "recognised": "thank you",
  "confidence": 0.86,
  "vocabulary_scoped": true,
  "note": "recognises trained signs; not full grammatical translation"
}` },
    'The landmark trajectory over a one-second window was recognised as the sign for "thank you" — one word from the trained vocabulary, emitted as text, honestly scoped short of full translation.',
  ],
  troubleshoot: [
    { sym: 'Wrong/missed signs', cause: 'Window/confidence/data', fix: 'Tune window and confidence; add training variation' },
    { sym: 'Fails for new signers', cause: 'Overfit to training signers', fix: 'Train/validate across many signers; augment' },
    { sym: 'Jittery outputs', cause: 'Boundary handling', fix: 'Require stable, confident, non-repeated emissions' },
    { sym: 'Poor landmarks', cause: 'Hands out of frame/occluded', fix: 'Frame the signer well; handle missing landmarks' },
    { sym: 'Over-claiming translation', cause: 'Scope confusion', fix: 'Frame as vocabulary recognition, not full translation' },
    { sym: 'Continuous signing fails', cause: 'Isolated-sign model', fix: 'Treat continuous as an advanced extension' },
  ],

  perf: [
    'Work from landmarks for robustness and efficiency.',
    'Window motion to cover a sign; keep latency usable.',
    'Validate on held-out signers, not just held-out clips.',
    'Scope to a vocabulary; be explicit about limits.',
  ],
  safety: [
    'Do not over-claim: this recognises a vocabulary, not full sign-language translation with grammar and context.',
    'Involve the Deaf/signing community; respect that sign languages are complete languages, not gestures for English.',
    'Cameras raise privacy obligations — notice/consent and data minimisation.',
    'Avoid deploying as a sole communication channel in high-stakes settings.',
  ],
  maintenance: [
    'Expand and rebalance the vocabulary/data over time.',
    'Re-validate on new signers and conditions.',
    'Update landmark/temporal models as they improve.',
    'Keep scope and limitations clearly communicated.',
  ],
  future: [
    'Add facial-grammar and non-manual features.',
    'Move toward continuous signing (co-articulation, segmentation).',
    'Add a specific sign language\'s grammar for truer translation.',
    'Two-way: text/speech to sign avatar.',
  ],
  faq: [
    { q: 'Why use landmarks instead of raw video?', a: 'Landmarks (finger joints, palm, pose) capture exactly the hand shape and motion that carry meaning while discarding background, lighting and appearance. That makes recognition far more robust and far cheaper in data and compute than learning from raw pixels.' },
    { q: 'Why is it a temporal problem?', a: 'Because a sign is a movement, not a static pose — the same hand shape can mean different things depending on how it moves. Recognition classifies a trajectory of landmarks over a window of time, which is sequence modelling.' },
    { q: 'Does it fully translate sign language?', a: 'No, and it should not claim to. Sign languages have their own grammar (including facial grammar) and context and are not word-for-word English. A realistic system reliably recognises a defined vocabulary of signs; full fluent translation is an open research problem.' },
    { q: 'Why validate on held-out signers?', a: 'Because signs vary between people, and a model can overfit to its training signers. The honest test of usefulness is whether it recognises the signing of someone it never trained on.' },
    { q: 'Is continuous signing harder?', a: 'Much. Natural signing is fluid and co-articulated (signs blend), which is far harder than isolated, deliberate signs. Continuous recognition is best treated as an advanced extension, not a baseline claim.' },
  ],
  refs: [
    { t: 'Sign language recognition', u: 'https://en.wikipedia.org/wiki/Sign_language_recognition', s: 'Reference' },
    { t: 'Hand/pose landmark estimation', u: 'https://en.wikipedia.org/wiki/Pose_(computer_vision)', s: 'Reference' },
    { t: 'Sequence models (LSTM)', u: 'https://en.wikipedia.org/wiki/Long_short-term_memory', s: 'Reference' },
    { t: 'MediaPipe Hands', u: 'https://developers.google.com/mediapipe', s: 'Docs' },
    { t: 'Sign language (grammar)', u: 'https://en.wikipedia.org/wiki/Sign_language', s: 'Reference' },
  ],
  images: ['neural', 'health', 'cnn'],
  imageCaptions: [
    'A sign language translator reads hand-sign gestures from a camera and outputs text in real time.',
    'Hand and pose landmarks — not raw pixels — represent each frame, giving robustness to background and appearance.',
    'A sign is a trajectory of landmarks over time, classified by a temporal model over a defined vocabulary.',
  ],
},

];
