/* AI — Computer Vision A05–A07. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   A05 — Pose-Estimation Fitness Coach
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A05',
  domainKey: 'ai',
  emoji: '🏋️', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'Watches you exercise, counts your reps, and calls out your form in real time by tracking your body\'s keypoints — a coach in a camera.',
  platformName: 'Pi/Jetson (edge), phone or GPU workstation',
  ide: 'Python 3.11 + MediaPipe / PyTorch',

  overview: [
    'A good exercise coach does two things a mirror cannot: they <b>count your reps</b> so you don\'t have to, and they <b>watch your form</b> and correct it before a sloppy squat becomes a hurt knee. This project builds a camera-based coach that does both automatically, in real time, by tracking the positions of your body\'s joints as you move. It turns any camera into a rep-counter and form-checker — useful for home workouts, physiotherapy, and anyone training without a trainer.',
    'The foundation is <b>human pose estimation</b>: a model detects the body\'s <b>keypoints</b> — shoulders, elbows, hips, knees, ankles and so on — in every frame, giving a live stick-figure of the body. From those keypoints the coach computes <b>joint angles</b> (knee bend, elbow bend, hip hinge), and everything follows from tracking how those angles change. A <b>rep</b> is a characteristic up-and-down cycle of the relevant angle (a squat is the knee angle going down past a threshold and back up), so counting reps is detecting those cycles. <b>Form feedback</b> compares the angles against the correct pattern for the exercise (knees not collapsing inward, back angle maintained, full range of motion) and flags deviations live.',
    'The value is objective, tireless feedback — accurate counts and instant form cues without a human trainer. It is honest about the limits of a single camera: pose estimation struggles with <b>occlusion</b> and unusual angles, a 2-D view can miss depth-dependent errors, and camera placement matters; and — importantly — this is a <b>fitness aid, not medical or professional coaching</b>, so form rules are heuristic and it should never be relied on for injury-sensitive rehab without professional oversight. Within those bounds, as a real-time pose-driven rep-counter and form-checker, it is both a genuinely helpful workout companion and a clear lesson in turning pose keypoints into meaningful, actionable analysis.',
  ],
  does: [
    'Counts exercise reps automatically from body motion',
    'Gives live form feedback (angles, range, alignment)',
    'Tracks body keypoints with pose estimation',
    'Computes joint angles and detects rep cycles',
    'Compares form against the correct pattern per exercise',
    'Works for home workouts and guided practice',
    'Provides objective, tireless feedback',
  ],
  features: [
    'Real-time pose (keypoint) estimation',
    'Joint-angle computation',
    'Rep counting via angle-cycle detection',
    'Form checking against exercise patterns',
    'Live cues (range, alignment, tempo)',
    'Works on edge/phone/GPU',
    'Honest about single-camera limits and non-medical scope',
  ],
  applications: [
    { t: 'Home fitness', d: 'Rep counting and form cues without a trainer.' },
    { t: 'Guided practice / classes', d: 'Objective feedback at scale.' },
    { t: 'Physio-style exercise (aid)', d: 'Range/rep tracking (with professional oversight).' },
    { t: 'Sports technique', d: 'Angle/motion analysis for movements.' },
  ],
  skills: [
    'Human pose estimation (keypoints)',
    'Joint-angle geometry from keypoints',
    'Rep detection via signal (angle) cycles',
    'Rule-based form checking',
    'Real-time pose pipelines and their limits',
  ],
  prereq: [
    'Track body keypoints, then compute joint angles — everything follows from angles.',
    'A rep is a cycle of the relevant joint angle; counting = detecting cycles.',
    'Form checking compares angles to the correct pattern per exercise.',
    'This is a fitness aid, not medical/professional coaching.',
  ],

  parts: ['picam', 'rpi4'],
  extraParts: [
    { name: 'Camera', spec: 'Webcam/phone/CSI camera viewing the body', qty: 1, price: 1500 },
    { name: 'Edge/GPU/phone compute', spec: 'Pi/Jetson/phone for edge, GPU for training', qty: 1, price: 0 },
    { name: 'Pose model', spec: 'Pretrained pose-estimation model (e.g. MediaPipe/MoveNet)', qty: 1, price: 0 },
    { name: 'Display/audio', spec: 'Screen/speaker for live cues and counts', qty: 1, price: 500 },
  ],
  cost: 'Software + camera; compute-dependent',
  libs: ['python', 'mediapipe', 'opencv', 'numpy'],

  wiringIntro: 'The "wiring" is the analysis data flow — a camera feeds frames to pose estimation; joint angles drive rep counting and form checks, which produce live counts and cues.',
  pins: {
    left: [
      { dev: 'Camera', devPin: 'frames', pin: '—', sig: 'Body video' },
      { dev: 'Pose model', devPin: 'keypoints', pin: '—', sig: 'Joint positions' },
    ],
    right: [
      { dev: 'Angle + rep logic', devPin: 'analyse', pin: '—', sig: 'Reps + form' },
      { dev: 'Cue output', devPin: 'display/audio', pin: '—', sig: 'Count + feedback' },
    ],
  },
  wiringNotes: [
    'Position the camera to see the whole body for the exercise, minimising occlusion.',
    'A pose model extracts keypoints per frame.',
    'Compute joint angles from keypoints; detect rep cycles and check form.',
    'Give live counts and form cues via screen/audio.',
    'Placement and view angle matter — a 2-D view can miss depth-dependent errors.',
  ],

  block: { columns: [
    { label: 'See', edge: 'right', blocks: [
      { name: 'Camera', sub: 'body', highlight: true },
      { name: 'Pose', sub: 'keypoints' },
    ] },
    { label: 'Measure', edge: 'right', blocks: [
      { name: 'Joint angles', sub: 'knee/elbow/hip', highlight: true },
    ] },
    { label: 'Analyse', edge: 'right', blocks: [
      { name: 'Rep cycles', sub: 'count' },
      { name: 'Form check', sub: 'vs pattern', highlight: true },
    ] },
    { label: 'Coach', edge: 'none', blocks: [
      { name: 'Count', sub: 'live' },
      { name: 'Cues', sub: 'form' },
    ] },
  ] },
  flow: [
    { t: 'Grab a frame', k: 'start' },
    { t: 'Estimate pose keypoints', k: 'proc' },
    { t: 'Compute joint angles', k: 'proc' },
    { t: 'Rep cycle completed?', k: 'dec', yes: 'Increment rep count', no: 'Check form' },
    { t: 'Increment rep count', k: 'io' },
    { t: 'Check form', k: 'proc' },
    { t: 'Form deviation?', k: 'dec', yes: 'Live form cue', no: 'Next frame' },
    { t: 'Live form cue', k: 'io' },
    { t: 'Next frame', k: 'end', back: 'Grab a frame' },
  ],

  principle: [
    'The whole system rests on reducing the messy visual problem of "watching someone exercise" to a clean, numeric one: <b>track the body\'s keypoints and reason about angles</b>. <b>Human pose estimation</b> — a well-developed vision capability — detects the coordinates of the body\'s joints (shoulders, elbows, wrists, hips, knees, ankles) in each frame, producing a live skeletal representation. That skeleton is the abstraction that makes everything else tractable: instead of analysing pixels, the coach analyses a handful of joint positions, exactly the data a human coach implicitly reads when they watch your body move.',
    'From keypoints, the coach computes <b>joint angles</b>, and angles are the language of both counting and form. A joint angle is simple geometry — the angle at the knee, for instance, is the angle between the thigh (hip→knee) and shin (knee→ankle) vectors. As you perform an exercise, the relevant angle traces a characteristic <b>waveform</b> over time: in a squat the knee angle falls as you descend and rises as you stand. This turns exercise analysis into <b>signal analysis</b> of a joint-angle time series, which is a huge simplification.',
    '<b>Rep counting</b> then becomes <b>cycle detection</b> on that waveform. A rep is one full down-and-up excursion of the driving angle: the angle crosses below a "down" threshold (you reached the bottom) and back above an "up" threshold (you returned to the top), completing a cycle. Counting reps is counting those cycles, with hysteresis (two thresholds, not one) so a wobble at the bottom doesn\'t double-count. This same idea generalises across exercises — you just pick the driving joint and thresholds per movement.',
    '<b>Form feedback</b> is where the coach earns its name, and it works by comparing the observed angles against the <b>correct pattern</b> for the exercise. Good form has geometric signatures: adequate <b>range of motion</b> (did the knee actually reach depth, or was it a half-squat?), <b>alignment</b> (do the knees track over the toes rather than collapsing inward — a knee-valgus check from the hip/knee/ankle geometry?), <b>posture</b> (is the back angle maintained?), and <b>tempo</b>. When an angle or relationship strays outside the acceptable band for that exercise, the coach flags it <i>live</i>, so you can correct mid-set rather than reinforce a bad habit. The honest caveats are essential: a single camera gives a <b>2-D</b> view, so pose estimation suffers from <b>occlusion</b> (a limb hidden behind the torso) and cannot always see depth-dependent errors, and <b>camera placement</b> strongly affects what can be measured (a side view sees squat depth; a front view sees knee alignment). And the form rules are <b>heuristics</b>, not clinical judgement: this is a <b>fitness aid, not medical or professional coaching</b>, and it must not be leaned on for injury-sensitive rehabilitation without professional oversight. Within those bounds, though, turning keypoints into angles, angles into rep cycles, and angle-deviations into live cues gives a genuinely useful, tireless, objective coach — and a textbook example of extracting meaningful analysis from pose data.',
  ],
  equations: [
    { t: 'Joint angle from keypoints', eq: 'For a joint B with neighbours A and C:\n\n  v1 = A − B,  v2 = C − B\n  angle = acos( (v1 · v2) / (|v1| |v2|) )\n\ne.g. knee angle from hip(A), knee(B), ankle(C).' },
    { t: 'Rep counting (cycle + hysteresis)', eq: 'Track the driving angle θ over time:\n\n  state DOWN when θ < θ_low   (reached the bottom)\n  state UP   when θ > θ_high  (returned to top)\n  count a rep on a DOWN→UP transition\n\nTwo thresholds (hysteresis) stop wobble double-counting.' },
    { t: 'Form checks (vs pattern)', eq: 'range_ok  : θ reached the target depth (θ_low low enough)\nalign_ok  : knee tracks over foot (valgus angle within band)\nposture_ok: back/hip angle within band\ntempo_ok  : rep duration within band\n\nDeviation → live cue. Rules are HEURISTIC (fitness aid).' },
  ],

  ai: {
    task: 'Estimate body keypoints from a camera in real time, compute joint angles, count reps via angle-cycle detection, and give heuristic form feedback per exercise.',
    dataset: [
      'Pose estimation uses a pretrained model (trained on large keypoint datasets); the coaching logic is largely geometric/rule-based on the resulting angles.',
      'Optional: labelled good/bad-form clips to tune or learn form thresholds per exercise.',
    ],
    datasetTable: [
      { n: 'Pose-estimation pretraining (e.g. COCO keypoints)', size: 'Large', lic: 'Varies', use: 'Keypoint model base' },
      { n: 'Exercise clips (per movement)', size: 'Per exercise', lic: 'With consent', use: 'Tune thresholds/patterns' },
      { n: 'Good/bad-form labels', size: 'Optional', lic: 'With consent', use: 'Learn form rules' },
      { n: 'Multi-body/view set', size: 'Varied', lic: 'Varies', use: 'Robustness to body/camera' },
    ],
    preprocess: [
      'Extract per-frame keypoints; smooth to reduce jitter.',
      'Compute joint angles; normalise for body proportions where needed.',
      'Handle low-confidence/occluded keypoints gracefully.',
    ],
    pipeline: [
      { name: 'Frame', sub: 'camera', highlight: true },
      { name: 'Pose', sub: 'keypoints' },
      { name: 'Angles', sub: 'joints', highlight: true },
      { name: 'Reps', sub: 'cycle detect' },
      { name: 'Form', sub: 'vs pattern' },
      { name: 'Cues', sub: 'count+feedback' },
    ],
    archTable: [
      { l: 'Pose model', s: 'keypoint estimator (MediaPipe/MoveNet)', p: 'Body skeleton per frame' },
      { l: 'Angle geometry', s: 'vectors → joint angles', p: 'The language of reps/form' },
      { l: 'Rep detector', s: 'threshold cycles + hysteresis', p: 'Count reps robustly' },
      { l: 'Form rules', s: 'range/alignment/tempo bands', p: 'Heuristic form feedback' },
      { l: 'Smoothing', s: 'temporal filter', p: 'Stable angles/counts' },
    ],
    hyper: [
      { k: 'θ_low / θ_high', v: 'per exercise', w: 'Rep depth + hysteresis' },
      { k: 'Form bands', v: 'per exercise', w: 'Range/alignment tolerance' },
      { k: 'Smoothing window', v: '≈ 3–7 frames', w: 'Jitter vs responsiveness' },
      { k: 'Keypoint conf. gate', v: 'app-specific', w: 'Ignore unreliable joints' },
    ],
    training: [
      'Mostly configuration/geometry: set per-exercise thresholds and form bands.',
      'Optionally learn form thresholds from labelled good/bad clips.',
      'Validate counts and cues across body types and camera placements.',
    ],
    metricsIntro: [
      'Success is accurate rep counts and useful, correct form cues across users and views — not a single accuracy number.',
    ],
    metrics: [
      { m: 'Rep-count accuracy', v: 'high (target)', d: 'Miscounts erode trust' },
      { m: 'Form-cue correctness', v: 'useful (target)', d: 'Right cue, right moment' },
      { m: 'Robustness to view/body', v: 'validated', d: 'Placement matters' },
      { m: 'Latency', v: 'real-time', d: 'Cue mid-rep, not after' },
    ],
    chart: { title: 'What a single camera can measure', unit: '', desc: 'Some errors are easy to catch from one view; depth-dependent ones need better placement or multi-view (illustrative).', bars: [
      { label: 'Rep counting', value: 92 },
      { label: 'Range of motion', value: 85 },
      { label: 'Knee alignment (front)', value: 78 },
      { label: 'Depth errors (2-D)', value: 55 },
    ] },
    inference: { file: 'coach.py', lang: 'python', body: `import numpy as np

def joint_angle(a, b, c):                 # angle at b (A-B-C)
    v1, v2 = np.array(a) - np.array(b), np.array(c) - np.array(b)
    cos = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-9)
    return np.degrees(np.arccos(np.clip(cos, -1, 1)))

class SquatCoach:
    def __init__(self, low=90, high=160):
        self.low, self.high = low, high      # rep thresholds (hysteresis)
        self.state = "up"; self.reps = 0

    def update(self, kp):                     # kp: keypoints
        knee = joint_angle(kp["hip"], kp["knee"], kp["ankle"])
        # rep = a DOWN->UP cycle of the knee angle
        if knee < self.low:  self.state = "down"
        if knee > self.high and self.state == "down":
            self.state = "up"; self.reps += 1     # counted a rep

        cues = []
        if self.state == "down" and knee > self.low + 15:
            cues.append("go deeper (range of motion)")     # form: depth
        if knee_valgus(kp) > VALGUS_BAND:
            cues.append("knees out (alignment)")           # form: alignment
        return self.reps, cues
        # NOTE: heuristic form rules — a fitness aid, not medical coaching.` },
    limits: [
      'A single 2-D camera suffers occlusion and misses depth-dependent errors.',
      'Camera placement strongly affects what can be measured (side vs front).',
      'Form rules are heuristics — a fitness aid, not medical/professional coaching.',
      'Pose jitter and unusual body positions can cause miscounts/false cues.',
    ],
  },

  assembly: [
    { h: 'Set up pose estimation', p: [
      'Stream camera frames and extract body keypoints with a pretrained pose model; smooth to reduce jitter.',
      'Place the camera to see the whole body for the exercise.',
    ], warn: 'This is a fitness aid with heuristic rules, not medical or professional coaching. A single 2-D view has real limits (occlusion, depth), and injury-sensitive rehab needs professional oversight.' },
    { h: 'Compute angles and count reps', p: [
      'Compute joint angles from keypoints and detect rep cycles with two-threshold hysteresis.',
    ] },
    { h: 'Add form checks and cues', p: [
      'Compare angles/alignment against the exercise\'s correct pattern and give live cues; tune thresholds per exercise and view.',
    ] },
  ],
  steps: [
    { h: 'Turn keypoints into angles, reps and cues', p: [
      'Compute the driving joint angle, detect rep cycles with hysteresis, and flag form deviations live.',
    ], code: {
      file: 'rep_form.py', lang: 'python',
      body: `import numpy as np

def angle(a, b, c):                        # joint angle at b
    v1, v2 = np.subtract(a, b), np.subtract(c, b)
    cos = np.dot(v1, v2) / (np.linalg.norm(v1)*np.linalg.norm(v2) + 1e-9)
    return np.degrees(np.arccos(np.clip(cos, -1, 1)))

def update_squat(kp, st, low=90, high=160):
    knee = angle(kp["hip"], kp["knee"], kp["ankle"])   # driving angle
    if knee < low: st["phase"] = "down"                # reached the bottom
    if knee > high and st["phase"] == "down":          # returned to top
        st["phase"] = "up"; st["reps"] += 1            # one rep = one cycle
    cue = None
    if st["phase"] == "down" and knee > low + 15:
        cue = "go deeper"                              # range-of-motion form
    return st["reps"], cue`,
      explain: [
        { ref: 'knee = angle(kp["hip"], kp["knee"], kp["ankle"])   # driving angle', txt: 'The knee angle is computed from three keypoints — the geometry that turns pose into a measurable exercise signal.' },
        { ref: 'if knee < low: st["phase"] = "down"                # reached the bottom', txt: 'The low threshold marks the bottom of the movement; two thresholds (hysteresis) prevent wobble from double-counting.' },
        { ref: 'if knee > high and st["phase"] == "down":          # returned to top', txt: 'A rep is counted on the down-to-up transition — cycle detection on the angle waveform.' },
        { ref: 'cue = "go deeper"                              # range-of-motion form', txt: 'Form feedback compares the angle against the correct pattern and cues live — here, insufficient depth.' },
      ],
    } },
    { h: 'Deliver counts and feedback live', p: [
      'Show the rep count and speak/display form cues in real time so the user corrects mid-set, and tune per exercise/view.',
    ], tip: 'Match the camera view to the error you want to catch: a side view sees squat depth, a front view sees knee alignment. One 2-D view cannot see everything.' },
  ],

  code: [{
    file: 'fitness_coach.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Pose-Estimation Fitness Coach

Tracks body KEYPOINTS, computes JOINT ANGLES, counts REPS via angle-cycle
detection (with hysteresis), and gives live heuristic FORM feedback per
exercise. A fitness aid, not medical coaching. Single-camera limits apply.
"""
import numpy as np

def angle(a, b, c):
    v1, v2 = np.subtract(a, b), np.subtract(c, b)
    cos = np.dot(v1, v2) / (np.linalg.norm(v1)*np.linalg.norm(v2) + 1e-9)
    return np.degrees(np.arccos(np.clip(cos, -1, 1)))

class Coach:
    def __init__(self, exercise="squat"):
        self.ex = EXERCISES[exercise]     # driving joint, thresholds, form bands
        self.phase = "up"; self.reps = 0

    def update(self, kp):
        if not confident(kp, self.ex["joints"]):     # skip unreliable poses
            return self.reps, ["can't see you clearly"]
        theta = angle(*[kp[j] for j in self.ex["joints"]])  # driving angle

        # rep = one DOWN->UP cycle (hysteresis)
        if theta < self.ex["low"]:  self.phase = "down"
        if theta > self.ex["high"] and self.phase == "down":
            self.phase = "up"; self.reps += 1

        # live form cues vs the correct pattern
        cues = []
        if self.phase == "down" and theta > self.ex["low"] + 15:
            cues.append("increase range of motion")
        if self.ex.get("valgus") and knee_valgus(kp) > self.ex["valgus"]:
            cues.append("keep knees over toes")
        if not posture_ok(kp, self.ex):
            cues.append("keep your back straight")
        return self.reps, cues

if __name__ == "__main__":
    coach = Coach("squat")
    for frame in camera():
        kp = pose_keypoints(frame)                   # pose estimation
        reps, cues = coach.update(kp)
        show(reps, cues)                             # live count + feedback
    # Heuristic fitness aid — not a substitute for professional coaching.`,
    explain: [
      { ref: 'self.ex = EXERCISES[exercise]     # driving joint, thresholds, form bands', txt: 'Each exercise is a small config — its driving joint, rep thresholds and form bands — so the same engine coaches many movements.' },
      { ref: 'if not confident(kp, self.ex["joints"]):     # skip unreliable poses', txt: 'Low-confidence or occluded keypoints are handled gracefully rather than producing false counts/cues — an honest response to single-camera limits.' },
      { ref: 'if theta > self.ex["high"] and self.phase == "down":', txt: 'Reps are counted as down-to-up cycles of the driving angle, robust to bottom-of-rep wobble via hysteresis.' },
      { ref: 'cues.append("keep knees over toes")', txt: 'Form cues come from comparing angles/alignment to the exercise\'s correct pattern and are delivered live to correct mid-set.' },
      { ref: '# Heuristic fitness aid — not a substitute for professional coaching.', txt: 'The scope is stated honestly: heuristic rules and a fitness aid, not medical or professional coaching.' },
    ],
  }],

  config: [
    'Configure the pose model, per-exercise driving joint and thresholds.',
    'Configure form bands (range/alignment/posture/tempo) per exercise.',
    'Configure smoothing and keypoint-confidence gating.',
    'Configure count/cue output (screen/audio) and camera view.',
  ],
  calibration: [
    { h: 'Rep thresholds', p: [
      'Set θ_low/θ_high per exercise so full reps count and partials/wobbles do not.',
    ] },
    { h: 'Form bands', p: [
      'Tune range/alignment/posture tolerances to flag real errors without nagging.',
    ] },
    { h: 'View/robustness', p: [
      'Validate across body types and camera placements; pick views that see the target errors.',
    ] },
  ],
  testing: [
    { step: 'Do full squats', expect: 'Accurate rep count' },
    { step: 'Do half-reps', expect: 'Not counted / "go deeper" cue' },
    { step: 'Let knees cave in', expect: 'Alignment cue' },
    { step: 'Occlude a limb', expect: 'Handled gracefully (no false count)' },
    { step: 'Change camera view', expect: 'Catches different errors — placement matters' },
    { step: 'Injury-sensitive move', expect: 'Aid only — defer to professionals' },
  ],
  output: [
    'Live rep counts and form cues, driven by joint angles from pose keypoints.',
    { file: 'coach-state.json', lang: 'json', body: `{
  "exercise": "squat",
  "reps": 8,
  "knee_angle": 84,
  "phase": "down",
  "cues": ["keep knees over toes"],
  "note": "fitness aid, heuristic form rules"
}` },
    'Mid-squat at 84° knee angle on rep 8, with a live alignment cue — objective counting and instant feedback, honestly scoped as a fitness aid.',
  ],
  troubleshoot: [
    { sym: 'Miscounts reps', cause: 'Thresholds/no hysteresis/jitter', fix: 'Tune θ_low/θ_high; add hysteresis; smooth angles' },
    { sym: 'False form cues', cause: 'Bands too tight / bad view', fix: 'Widen bands; pick a view that sees the error' },
    { sym: 'Loses track', cause: 'Occlusion/out of frame', fix: 'Reposition camera; gate on keypoint confidence' },
    { sym: 'Misses depth errors', cause: '2-D single view', fix: 'Change placement or add a second view' },
    { sym: 'Jittery skeleton', cause: 'Pose noise', fix: 'Temporal smoothing; confidence gating' },
    { sym: 'Over-trusted for rehab', cause: 'Scope confusion', fix: 'Use as an aid; involve professionals for rehab' },
  ],

  perf: [
    'Reduce to angles early — reps and form both come from angles.',
    'Use hysteresis and smoothing for robust counting.',
    'Match camera view to the errors you want to catch.',
    'Gate on keypoint confidence to avoid false counts/cues.',
  ],
  safety: [
    'This is a fitness aid, not medical or professional coaching — do not rely on it for injury-sensitive rehab without professional oversight.',
    'Form rules are heuristic and a single 2-D view has real blind spots.',
    'Cameras raise privacy obligations — notice/consent and data minimisation.',
    'Encourage users to stop if something hurts, regardless of the app.',
  ],
  maintenance: [
    'Add/tune exercises and their thresholds/bands over time.',
    'Re-validate across body types, views and lighting.',
    'Update the pose model as better ones appear.',
    'Keep the non-medical scope clearly communicated.',
  ],
  future: [
    'Add multi-view or depth cameras for 3-D form.',
    'Add more exercises and personalised baselines.',
    'Add tempo/eccentric-timing and fatigue cues.',
    'Add progress tracking and workout summaries.',
  ],
  faq: [
    { q: 'How does it count reps?', a: 'By detecting cycles of a joint angle. For a squat, the knee angle falls to the bottom and rises back up; each down-to-up cycle is one rep, counted with two thresholds (hysteresis) so wobble does not double-count.' },
    { q: 'How does it judge form?', a: 'By comparing joint angles and alignments against the correct pattern for the exercise — adequate range of motion, knees tracking over toes, back angle maintained, tempo — and flagging deviations live.' },
    { q: 'Why keypoints instead of raw video?', a: 'Because pose keypoints reduce the problem to a handful of joint positions and angles — the same thing a human coach reads — which is far more tractable and robust than analysing pixels.' },
    { q: 'What are the single-camera limits?', a: 'A 2-D view suffers occlusion (a hidden limb) and cannot see all depth-dependent errors, and placement matters — a side view sees squat depth, a front view sees knee alignment. One view cannot catch everything.' },
    { q: 'Can I use it for rehab?', a: 'Only as an aid, and with professional oversight. The form rules are heuristics, not clinical judgement, so it must not be relied upon alone for injury-sensitive rehabilitation.' },
  ],
  refs: [
    { t: 'Pose estimation', u: 'https://en.wikipedia.org/wiki/Pose_(computer_vision)', s: 'Reference' },
    { t: 'Human keypoint detection', u: 'https://en.wikipedia.org/wiki/Articulated_body_pose_estimation', s: 'Reference' },
    { t: 'Range of motion', u: 'https://en.wikipedia.org/wiki/Range_of_motion', s: 'Reference' },
    { t: 'MediaPipe Pose / MoveNet', u: 'https://developers.google.com/mediapipe', s: 'Docs' },
    { t: 'Signal cycle detection', u: 'https://en.wikipedia.org/wiki/Hysteresis', s: 'Reference' },
  ],
  images: ['neural', 'health', 'cnn'],
  imageCaptions: [
    'A pose-estimation coach counts reps and checks form by tracking the body\'s keypoints in real time.',
    'Joint angles computed from keypoints turn exercise analysis into simple, robust signal processing.',
    'A single 2-D camera has blind spots — placement decides whether it sees depth or alignment errors.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A06 — License Plate Recognition
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A06',
  domainKey: 'ai',
  emoji: '🚗', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '16–22 hours', iso8601: 'PT20H',
  tagline: 'An ANPR pipeline that finds vehicle number plates in a camera feed and reads their characters — detect the plate, then recognise the text.',
  platformName: 'Jetson/Pi (edge) or GPU workstation',
  ide: 'Python 3.11 + PyTorch / OpenCV / OCR',

  overview: [
    'Automatic Number Plate Recognition (<b>ANPR</b>) reads vehicle registration plates from camera images automatically, and it quietly runs a huge amount of the modern world — car-park entry and billing, tolling, access control, traffic enforcement and security. This project builds an ANPR <b>pipeline</b>: given a camera feed, it locates each vehicle\'s number plate and reads the characters on it, turning a picture of traffic into a stream of plate strings. It is an excellent applied-vision project because it is a clear, real <b>two-stage pipeline</b> — a pattern that recurs across computer vision.',
    'The two stages are <b>detection</b> then <b>recognition</b>. First, a detector finds <i>where</i> the plate is in the frame — a bounding box around the plate — because a plate is small and the rest of the scene is irrelevant clutter; locating it first means the reader only has to deal with the plate. Second, the cropped plate is passed to <b>OCR</b> (optical character recognition), which reads the <i>characters</i> — the letters and digits of the registration. Between them sit important glue steps: cropping and often <b>rectifying</b> the plate (correcting perspective/skew so the text is level), and <b>post-processing</b> the OCR output against the expected plate format to catch errors.',
    'The value is a robust, reusable recognition pipeline and a clear lesson in <b>staged vision systems</b> (detect the region of interest, then analyse it). It is honest about the real-world difficulty: plates are read at <b>angles, in motion-blur, poor light, glare and rain</b>, at varying distances; OCR confuses look-alike characters (0/O, 1/I, 8/B); and different regions have different <b>plate formats</b> that constrain and help decoding. It is also candid that ANPR is a <b>surveillance-capable</b> technology whose use carries privacy and legal responsibilities — plate data identifies vehicles and, indirectly, people. Built with those realities in view, an ANPR pipeline is both genuinely useful and a definitive example of composing detection and recognition into a working end-to-end vision system.',
  ],
  does: [
    'Locates vehicle number plates in a camera feed',
    'Reads the plate characters via OCR',
    'Rectifies/crops plates before reading (perspective/skew)',
    'Post-processes text against the expected plate format',
    'Outputs plate strings from traffic imagery',
    'Demonstrates a detect-then-recognise pipeline',
    'Handles angle, blur, light and format variation (to a degree)',
  ],
  features: [
    'Plate detection (region of interest)',
    'OCR character recognition',
    'Perspective/skew rectification',
    'Format-aware post-processing',
    'Two-stage pipeline architecture',
    'Edge or GPU deployment',
    'Honest about conditions, OCR errors and privacy/law',
  ],
  applications: [
    { t: 'Parking / access control', d: 'Entry, billing and barrier control by plate.' },
    { t: 'Tolling', d: 'Automated toll charging from plates.' },
    { t: 'Security / watchlists', d: 'Flagging vehicles of interest (lawfully).' },
    { t: 'Traffic / logistics', d: 'Vehicle logging and flow analysis.' },
  ],
  skills: [
    'Object detection for a specific region (plate)',
    'OCR and text post-processing',
    'Perspective rectification of a cropped region',
    'Format-constrained decoding',
    'Composing a two-stage vision pipeline',
  ],
  prereq: [
    'ANPR is a two-stage pipeline: detect the plate, then read the characters.',
    'Locate the small plate first so OCR only sees the plate, not clutter.',
    'Post-process OCR against the plate format to fix look-alike errors.',
    'ANPR is surveillance-capable — privacy and legal responsibilities apply.',
  ],

  parts: ['picam', 'rpi4'],
  extraParts: [
    { name: 'Camera', spec: 'Camera positioned to capture plates (angle/light matter)', qty: 1, price: 2000 },
    { name: 'Edge/GPU compute', spec: 'Jetson/Pi for edge, GPU for training', qty: 1, price: 0 },
    { name: 'Plate detector + OCR', spec: 'Detection model + OCR engine', qty: 1, price: 0 },
    { name: 'Format rules/dataset', spec: 'Regional plate formats; labelled plates if training', qty: 1, price: 0 },
  ],
  cost: 'Software + camera; compute-dependent',
  libs: ['python', 'torch', 'opencv', 'numpy'],

  wiringIntro: 'The "wiring" is the pipeline data flow — a camera frame goes to plate detection, the cropped/rectified plate goes to OCR, and format-checked text is the output.',
  pins: {
    left: [
      { dev: 'Camera', devPin: 'frames', pin: '—', sig: 'Traffic images' },
      { dev: 'Plate detector', devPin: 'locate', pin: '—', sig: 'Plate box' },
    ],
    right: [
      { dev: 'Rectify + OCR', devPin: 'read', pin: '—', sig: 'Characters' },
      { dev: 'Format check', devPin: 'validate', pin: '—', sig: 'Plate string' },
    ],
  },
  wiringNotes: [
    'Position the camera to capture plates with good angle, light and resolution.',
    'Stage 1: detect the plate region in the frame.',
    'Crop and rectify the plate (correct perspective/skew) before reading.',
    'Stage 2: OCR the plate; post-process against the expected format.',
    'Plate data is identifying — handle it lawfully and securely.',
  ],

  block: { columns: [
    { label: 'Input', edge: 'right', blocks: [
      { name: 'Camera', sub: 'traffic', highlight: true },
    ] },
    { label: 'Detect', edge: 'right', blocks: [
      { name: 'Plate detector', sub: 'find plate', highlight: true },
      { name: 'Crop/rectify', sub: 'level text' },
    ] },
    { label: 'Read', edge: 'right', blocks: [
      { name: 'OCR', sub: 'characters', highlight: true },
      { name: 'Format check', sub: 'fix errors' },
    ] },
    { label: 'Output', edge: 'none', blocks: [
      { name: 'Plate string', sub: 'e.g. DL3CAB1234' },
    ] },
  ] },
  flow: [
    { t: 'Grab a frame', k: 'start' },
    { t: 'Detect plate region', k: 'proc' },
    { t: 'Plate found?', k: 'dec', yes: 'Crop + rectify plate', no: 'Next frame' },
    { t: 'Crop + rectify plate', k: 'proc' },
    { t: 'OCR the characters', k: 'proc' },
    { t: 'Post-process vs format', k: 'proc' },
    { t: 'Valid plate?', k: 'dec', yes: 'Output plate string', no: 'Discard/retry' },
    { t: 'Output plate string', k: 'io' },
    { t: 'Discard/retry', k: 'end', back: 'Grab a frame' },
  ],

  principle: [
    'ANPR is the archetypal <b>two-stage vision pipeline</b>, and its structure is its main lesson: you almost never read text (or analyse anything fine-grained) straight from a full scene — you first <b>find the region of interest</b>, then <b>analyse just that region</b>. A number plate occupies a tiny fraction of a traffic image, surrounded by irrelevant road, bodywork and background. Trying to OCR the whole frame is hopeless; locating the plate first turns an impossible problem into a manageable one. This detect-then-recognise decomposition recurs everywhere in vision (find the face then recognise it; find the document then read it), which is why ANPR is such a clean teaching example.',
    '<b>Stage one is detection.</b> A detector (a trained object detector, or classical techniques exploiting a plate\'s rectangular shape and high-contrast text) finds the plate and returns a bounding box. Its job is purely localisation — <i>where</i> is the plate — not reading. Doing this well under real conditions (varying distance, angle, and lighting) is half the battle, because everything downstream depends on getting a clean crop of the plate.',
    'Between the stages sits crucial <b>glue</b>: crop the plate and <b>rectify</b> it. A plate viewed off-axis appears as a skewed quadrilateral, and OCR reads level text far better than slanted, perspective-distorted text, so a perspective transform warps the crop back to a straight-on, rectangular view. This preprocessing — deskewing, normalising size and contrast — often makes the difference between the reader succeeding and failing, and it is easy to underrate.',
    '<b>Stage two is recognition</b> — <b>OCR</b> reads the characters from the rectified plate — followed by <b>format-aware post-processing</b>, which is where real robustness comes from. Raw OCR makes predictable mistakes: it confuses visually similar characters (0/O, 1/I/l, 8/B, 5/S, 2/Z), and it may misfire on dirt, screws or borders. But plates are not arbitrary strings — each region has a <b>defined format</b> (a pattern of letters and digits in fixed positions), and enforcing that format corrects many errors: if a position must be a digit, an "O" there is almost certainly a "0". Validating and correcting the OCR output against the expected format is what lifts a flaky reader into a dependable one. The honest difficulties are ever-present: plates are captured at <b>angles, in motion blur, glare, rain and darkness</b>, at a range of distances and plate designs, and no pipeline reads them all perfectly — confidence, retries across frames, and graceful failure matter. And ANPR is <b>surveillance-capable</b>: plate reads identify vehicles and, by extension, people and their movements, so the technology carries genuine <b>privacy and legal responsibilities</b> (lawful purpose, retention limits, access control) that a responsible build must respect. As an end-to-end system, though, ANPR teaches the essential craft of composing detection, geometric correction, and recognition into a pipeline that turns raw imagery into structured, validated data.',
  ],
  equations: [
    { t: 'Two-stage pipeline', eq: 'frame → DETECT plate box → CROP + RECTIFY → OCR chars\n      → FORMAT post-process → plate string\n\nFind the region of interest first; analyse only that region.\n(The recurring pattern of staged vision systems.)' },
    { t: 'Perspective rectification', eq: 'Plate seen off-axis = a skewed quadrilateral.\n\n  H = perspective_transform(plate_corners → rectangle)\n  rectified = warp(crop, H)\n\nOCR reads level text far better than skewed text.' },
    { t: 'Format-aware correction', eq: 'Plates follow a regional pattern, e.g. AA 00 A 0000.\n\n  for each position: constrain to letter OR digit\n  fix look-alikes by position:\n    digit slot: O→0, I→1, B→8, S→5, Z→2\n    letter slot: 0→O, 1→I, ...\n\nFormat turns a flaky OCR read into a valid plate.' },
  ],

  ai: {
    task: 'Detect vehicle number plates in a camera feed and recognise their characters via a two-stage detect-then-OCR pipeline, with rectification and format-aware post-processing.',
    dataset: [
      'Plate detection is trained/uses a detector on plate-annotated images; OCR uses a text-recognition model, ideally tuned to plate fonts and regional formats.',
      'Real-condition data (angles, blur, night, weather) and regional plate designs matter for accuracy.',
    ],
    datasetTable: [
      { n: 'Plate-detection dataset', size: 'Annotated plates', lic: 'Varies', use: 'Train/validate the detector' },
      { n: 'Plate OCR dataset', size: 'Char-labelled plates', lic: 'Varies', use: 'Train/tune the reader' },
      { n: 'Regional plate designs', size: 'Per region', lic: 'Public', use: 'Format rules / decoding' },
      { n: 'Hard-condition samples', size: 'Night/blur/angle', lic: 'Varies', use: 'Robustness' },
    ],
    preprocess: [
      'Detect the plate; crop with margin; rectify perspective/skew.',
      'Normalise size, contrast; denoise for OCR.',
      'For training, augment for angle, blur, lighting, occlusion.',
    ],
    pipeline: [
      { name: 'Frame', sub: 'camera', highlight: true },
      { name: 'Detect plate', sub: 'box' },
      { name: 'Rectify', sub: 'deskew' },
      { name: 'OCR', sub: 'characters', highlight: true },
      { name: 'Format check', sub: 'validate/fix' },
      { name: 'Plate string', sub: 'output' },
    ],
    archTable: [
      { l: 'Detector', s: 'object detector / classical', p: 'Locate the plate region' },
      { l: 'Rectifier', s: 'perspective transform', p: 'Level text for OCR' },
      { l: 'OCR', s: 'text-recognition model', p: 'Read characters' },
      { l: 'Post-process', s: 'format constraints', p: 'Fix look-alikes; validate' },
      { l: 'Aggregator', s: 'multi-frame voting', p: 'Confident final read' },
    ],
    hyper: [
      { k: 'Detection confidence', v: 'app-specific', w: 'Miss vs false plates' },
      { k: 'OCR confidence gate', v: 'app-specific', w: 'Accept vs retry' },
      { k: 'Rectify margin', v: 'small', w: 'Include full plate cleanly' },
      { k: 'Multi-frame votes', v: '≈ 3–5', w: 'Stability vs latency' },
    ],
    training: [
      'Train/tune the detector on plate images and the OCR on plate fonts/formats.',
      'Augment heavily for real conditions; validate on held-out hard cases.',
      'Encode regional format rules for post-processing.',
    ],
    metricsIntro: [
      'End-to-end plate-read accuracy (exact string) matters most, with detection and OCR sub-metrics and robustness across conditions.',
    ],
    metrics: [
      { m: 'End-to-end plate accuracy', v: 'condition-dependent', d: 'Exact correct string' },
      { m: 'Detection recall', v: 'high (target)', d: 'Plates found' },
      { m: 'OCR char accuracy', v: 'high (target)', d: 'Characters read' },
      { m: 'Robustness (night/angle)', v: 'lower (honest)', d: 'Hard conditions' },
    ],
    chart: { title: 'Accuracy by condition', unit: '', desc: 'ANPR is strong in good conditions and degrades with angle, blur and darkness — hence multi-frame voting and format checks (illustrative).', bars: [
      { label: 'Front, daylight', value: 96 },
      { label: 'Angled', value: 84 },
      { label: 'Motion blur', value: 72 },
      { label: 'Night / glare', value: 62 },
    ] },
    inference: { file: 'anpr.py', lang: 'python', body: `import re

PLATE_RE = re.compile(r"^[A-Z]{2}\\d{2}[A-Z]{1,2}\\d{4}$")   # example format

def read_plate(frame, detector, ocr):
    box = detector.detect_plate(frame)            # STAGE 1: locate
    if box is None:
        return None
    plate = rectify(crop(frame, box))             # deskew for OCR
    raw = ocr.read(plate)                          # STAGE 2: characters

    text = format_correct(raw)                    # fix 0/O, 1/I by position
    if PLATE_RE.match(text):                       # validate vs format
        return text                                # confident plate string
    return None                                    # reject / retry next frame

def format_correct(s):
    # apply position-aware look-alike fixes toward the expected pattern
    return apply_format_rules(s.upper())
    # NOTE: plate reads identify vehicles/people — handle lawfully & securely.` },
    limits: [
      'Angle, motion blur, glare, rain and darkness degrade accuracy — no pipeline is perfect.',
      'OCR confuses look-alike characters; format post-processing mitigates but not fully.',
      'Regional plate formats/designs vary — decoding must match the region.',
      'ANPR is surveillance-capable — privacy and legal responsibilities apply.',
    ],
  },

  assembly: [
    { h: 'Build stage one: plate detection', p: [
      'Position the camera for good plate capture and detect the plate region in each frame.',
    ], warn: 'ANPR is surveillance-capable: plate reads identify vehicles and, indirectly, people. Deploy only for a lawful purpose, with retention limits, access control and compliance with local law.' },
    { h: 'Rectify and read (stage two)', p: [
      'Crop and rectify the plate (perspective/skew), then OCR the characters.',
    ] },
    { h: 'Post-process and stabilise', p: [
      'Correct and validate the OCR against the expected format, and vote across frames for a confident final read.',
    ] },
  ],
  steps: [
    { h: 'Detect, rectify, read, validate', p: [
      'Run the two-stage pipeline: locate the plate, rectify and OCR it, then correct and validate against the plate format.',
    ], code: {
      file: 'pipeline.py', lang: 'python',
      body: `import re
PLATE_RE = re.compile(r"^[A-Z]{2}\\d{2}[A-Z]{1,2}\\d{4}$")

def anpr(frame, detector, ocr):
    box = detector.detect_plate(frame)        # STAGE 1: where is the plate
    if box is None:
        return None
    plate_img = rectify(crop(frame, box))     # deskew so OCR reads level text
    raw = ocr.read(plate_img)                 # STAGE 2: read characters
    text = apply_format_rules(raw.upper())    # fix 0/O, 1/I by position
    return text if PLATE_RE.match(text) else None   # validate vs format`,
      explain: [
        { ref: 'box = detector.detect_plate(frame)        # STAGE 1: where is the plate', txt: 'Detection localises the tiny plate in the cluttered frame, so the reader only ever sees the plate — the essence of the two-stage design.' },
        { ref: 'plate_img = rectify(crop(frame, box))     # deskew so OCR reads level text', txt: 'Rectifying the crop corrects perspective/skew, which often decides whether OCR succeeds — the underrated glue step.' },
        { ref: 'raw = ocr.read(plate_img)                 # STAGE 2: read characters', txt: 'OCR reads the characters from the clean, level plate image.' },
        { ref: 'text = apply_format_rules(raw.upper())    # fix 0/O, 1/I by position', txt: 'Format-aware correction fixes predictable look-alike errors using the plate\'s fixed letter/digit pattern — the robustness step.' },
      ],
    } },
    { h: 'Vote across frames and output', p: [
      'Aggregate reads across several frames for a confident plate string, and output it (with confidence) for the application.',
    ], tip: 'Vote across frames: a plate seen over several frames gives multiple reads — take the most consistent, confident string rather than trusting a single noisy frame.' },
  ],

  code: [{
    file: 'anpr_pipeline.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
License Plate Recognition (ANPR) — detect-then-recognise pipeline

STAGE 1 detects the plate region; the crop is rectified (deskewed);
STAGE 2 OCRs the characters; format-aware post-processing fixes
look-alike errors and validates the plate. Multi-frame voting stabilises
reads. ANPR is surveillance-capable — use lawfully and securely.
"""
import re
from collections import Counter

PLATE_RE = re.compile(r"^[A-Z]{2}\\d{2}[A-Z]{1,2}\\d{4}$")   # example region format

class ANPR:
    def __init__(self, detector, ocr, votes=5):
        self.detector = detector; self.ocr = ocr
        self.votes = votes; self.recent = []

    def read_frame(self, frame):
        box = self.detector.detect_plate(frame)       # STAGE 1: locate
        if box is None:
            return None
        plate = rectify(crop(frame, box))             # deskew for OCR
        raw = self.ocr.read(plate)                     # STAGE 2: characters
        text = apply_format_rules(raw.upper())         # fix 0/O,1/I by position
        return text if PLATE_RE.match(text) else None  # validate vs format

    def process(self, frame):
        r = self.read_frame(frame)
        if r:
            self.recent.append(r)
            self.recent = self.recent[-self.votes:]    # multi-frame window
            best, n = Counter(self.recent).most_common(1)[0]
            if n >= max(2, self.votes // 2):           # consistent read
                return best                             # confident plate string
        return None

if __name__ == "__main__":
    anpr = ANPR(PlateDetector(), PlateOCR())
    for frame in camera():
        plate = anpr.process(frame)
        if plate:
            handle(plate)                              # lawful use only
    # Plate data identifies vehicles/people — lawful purpose, retention,
    # access control and compliance are required.`,
    explain: [
      { ref: 'box = self.detector.detect_plate(frame)       # STAGE 1: locate', txt: 'The detector localises the plate first, so the reader is never asked to find text in a whole cluttered scene.' },
      { ref: 'plate = rectify(crop(frame, box))             # deskew for OCR', txt: 'Rectification levels the plate so OCR reads it reliably — the geometric glue between the two stages.' },
      { ref: 'text = apply_format_rules(raw.upper())         # fix 0/O,1/I by position', txt: 'Format-aware post-processing corrects predictable OCR confusions and validates the result — the source of real robustness.' },
      { ref: 'if n >= max(2, self.votes // 2):           # consistent read', txt: 'Voting across frames yields a confident final read instead of trusting one noisy frame.' },
      { ref: '# Plate data identifies vehicles/people — lawful purpose, retention,', txt: 'The privacy/legal responsibilities of a surveillance-capable technology are made explicit in the code itself.' },
    ],
  }],

  config: [
    'Configure the plate detector, OCR engine and camera placement.',
    'Configure rectification, the regional plate format and correction rules.',
    'Configure multi-frame voting and confidence gates.',
    'Configure lawful use, retention limits and access control.',
  ],
  calibration: [
    { h: 'Detection', p: [
      'Tune detection confidence and camera angle/light so plates are reliably found.',
    ] },
    { h: 'OCR + format', p: [
      'Validate OCR and format correction on real plates; encode the correct regional pattern.',
    ] },
    { h: 'Robustness', p: [
      'Test across angle, blur, night and weather; use voting to stabilise.',
    ] },
  ],
  testing: [
    { step: 'Clear front plate, daylight', expect: 'Correct plate string' },
    { step: 'Angled plate', expect: 'Rectified and read (maybe lower confidence)' },
    { step: 'Look-alike chars (0/O)', expect: 'Fixed by format post-processing' },
    { step: 'Motion blur / night', expect: 'Harder — voting/retry helps; may fail' },
    { step: 'Wrong-region format', expect: 'Rejected/needs region rules' },
    { step: 'Check data handling', expect: 'Lawful, retention-limited, access-controlled' },
  ],
  output: [
    'Validated plate strings from the camera feed, stabilised across frames.',
    { file: 'anpr-read.json', lang: 'json', body: `{
  "plate": "DL3CAB1234",
  "confidence": 0.93,
  "frames_agreed": 4,
  "rectified": true,
  "format_valid": true
}` },
    'A plate read consistently across four frames, rectified and format-validated — the two-stage pipeline turning imagery into structured, checked data (handled lawfully).',
  ],
  troubleshoot: [
    { sym: 'Plate not found', cause: 'Detection/placement', fix: 'Tune detector; improve camera angle/light/resolution' },
    { sym: 'Garbled characters', cause: 'No rectification / poor crop', fix: 'Rectify perspective; crop with margin; denoise' },
    { sym: 'Look-alike errors', cause: 'No format correction', fix: 'Apply position-aware format rules' },
    { sym: 'Unstable reads', cause: 'Single-frame trust', fix: 'Vote across frames; gate on confidence' },
    { sym: 'Fails at night/angle', cause: 'Hard conditions', fix: 'Better capture; augmented training; accept limits' },
    { sym: 'Privacy/legal issue', cause: 'Unbounded use', fix: 'Lawful purpose, retention limits, access control' },
  ],

  perf: [
    'Detect the plate first; OCR only the clean, rectified crop.',
    'Rectify perspective/skew — it often decides OCR success.',
    'Use format post-processing to fix predictable errors.',
    'Vote across frames for confident, stable reads.',
  ],
  safety: [
    'ANPR is surveillance-capable — deploy only for a lawful purpose, with retention limits and access control, complying with local law.',
    'Plate data identifies vehicles and, indirectly, people — secure and minimise it.',
    'No pipeline is perfect — do not use raw reads for punitive/automated action without human review.',
    'Be transparent about deployment where required.',
  ],
  maintenance: [
    'Retune detector/OCR for new plate designs and conditions.',
    'Update regional format rules as they change.',
    'Monitor accuracy and review misreads.',
    'Audit data handling for privacy/legal compliance.',
  ],
  future: [
    'Add vehicle make/model/colour attributes.',
    'Add end-to-end trainable detection+recognition.',
    'Add region auto-detection and multi-format support.',
    'Add better night/IR capture and deblurring.',
  ],
  faq: [
    { q: 'Why two stages instead of reading the whole image?', a: 'Because a plate is tiny amid irrelevant clutter. Detecting it first means OCR only has to read a clean crop of the plate, turning an impossible whole-scene read into a manageable one — the recurring detect-then-recognise pattern of vision pipelines.' },
    { q: 'Why rectify the plate?', a: 'A plate seen off-axis is skewed, and OCR reads level text far better than slanted, perspective-distorted text. A perspective transform warps the crop straight, which often decides success — an easily underrated step.' },
    { q: 'How does format post-processing help?', a: 'Plates follow a fixed regional pattern of letters and digits, so if a position must be a digit, an "O" there is almost certainly a "0". Enforcing the format corrects OCR\'s predictable look-alike confusions and validates the read.' },
    { q: 'Why is it hard in the real world?', a: 'Plates are captured at angles, in motion blur, glare, rain and darkness, at varying distances and designs. No pipeline reads all of these perfectly, which is why confidence, multi-frame voting and graceful failure matter.' },
    { q: 'What are the privacy responsibilities?', a: 'ANPR identifies vehicles and, indirectly, people and their movements, so it is surveillance-capable. Responsible use means a lawful purpose, retention limits, access control, and compliance with local law — and human review before any punitive action.' },
  ],
  refs: [
    { t: 'Automatic number-plate recognition', u: 'https://en.wikipedia.org/wiki/Automatic_number-plate_recognition', s: 'Reference' },
    { t: 'Optical character recognition', u: 'https://en.wikipedia.org/wiki/Optical_character_recognition', s: 'Reference' },
    { t: 'Perspective transform / homography', u: 'https://en.wikipedia.org/wiki/Homography_(computer_vision)', s: 'Reference' },
    { t: 'Object detection', u: 'https://en.wikipedia.org/wiki/Object_detection', s: 'Reference' },
    { t: 'ANPR privacy considerations', u: 'https://en.wikipedia.org/wiki/Automatic_number-plate_recognition#Privacy', s: 'Reference' },
  ],
  images: ['car', 'cctv', 'neural'],
  imageCaptions: [
    'An ANPR pipeline detects the plate, then reads its characters — the classic two-stage vision system.',
    'Rectifying the off-axis plate to a level, straight-on view is what lets OCR read it reliably.',
    'Format-aware post-processing fixes predictable look-alike errors, turning a flaky read into a valid plate.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A07 — Crop Disease Classifier
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A07',
  domainKey: 'ai',
  emoji: '🌿', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'A CNN that diagnoses plant leaf diseases from a single phone photo — putting an agronomist\'s eye in every farmer\'s pocket.',
  platformName: 'Phone/edge or GPU workstation',
  ide: 'Python 3.11 + PyTorch / TensorFlow',

  overview: [
    'A plant disease caught early can be treated; caught late, it can take a whole crop — and the difference is often a diagnosis a smallholder farmer has no easy way to get. Yet many crop diseases show clear <b>visual symptoms on the leaves</b>: characteristic spots, blights, rusts, mildews and discolourations that a trained eye can identify. This project builds a <b>CNN image classifier</b> that reads those symptoms from a single phone photo of a leaf and names the likely disease — putting an expert diagnostic eye in the pocket of anyone with a phone.',
    'It is an <b>image classification</b> problem: given a photo of a leaf, output the disease class (or "healthy"). A <b>convolutional neural network (CNN)</b> — the architecture that revolutionised image recognition — learns, from thousands of labelled leaf images, the visual features that distinguish each disease: the shape, colour and pattern of the lesions. The practical route is <b>transfer learning</b> — starting from a network pretrained on general images and fine-tuning it on the leaf dataset — which achieves strong accuracy with far less data and compute than training from scratch, and makes the model small enough to run on a phone for <b>offline, in-field</b> use.',
    'The value is accessible, instant, early diagnosis that guides treatment and reduces crop loss. It is honest about the gap between a benchmark and a field tool: models trained on clean lab images (like the popular PlantVillage set) often <b>degrade on real field photos</b> with messy backgrounds, mixed lighting and co-occurring problems; the classifier only knows the <b>crops and diseases it was trained on</b>; and it should <b>advise, not dictate</b> — a confident-looking label can be wrong, so it must be framed as decision support with a path to expert confirmation for serious calls. Built and framed honestly, it is both a genuinely valuable agricultural tool and a clear, complete lesson in CNN image classification and transfer learning.',
  ],
  does: [
    'Diagnoses plant leaf diseases from a single photo',
    'Classifies a leaf image into a disease (or healthy)',
    'Learns disease features with a CNN',
    'Uses transfer learning for accuracy with less data',
    'Runs on a phone/edge for offline in-field use',
    'Guides early treatment to reduce crop loss',
    'Advises rather than dictates (decision support)',
  ],
  features: [
    'CNN image classification of leaf diseases',
    'Transfer learning from a pretrained network',
    'Confidence-scored predictions',
    'Phone/edge (offline) deployment',
    'Per-crop/disease vocabulary',
    'Decision-support framing',
    'Honest about lab-vs-field gap and scope',
  ],
  applications: [
    { t: 'Smallholder crop diagnosis', d: 'Instant, accessible leaf-disease diagnosis by phone.' },
    { t: 'Agri-advisory services', d: 'Scaling expert diagnosis to many farmers.' },
    { t: 'Farm scouting', d: 'Early detection during field walks.' },
    { t: 'Plant-health education', d: 'Learning to recognise disease symptoms.' },
  ],
  skills: [
    'CNN image classification',
    'Transfer learning / fine-tuning',
    'Data handling, augmentation, class balance',
    'Confidence and evaluation (accuracy, confusion)',
    'Edge/phone deployment and honest scoping',
  ],
  prereq: [
    'Many crop diseases show clear visual leaf symptoms — a classification problem.',
    'A CNN learns disease features; transfer learning gives accuracy with less data.',
    'Lab-trained models often degrade on messy real field photos — mind the gap.',
    'It should advise, not dictate — decision support with expert confirmation.',
  ],

  parts: ['picam'],
  extraParts: [
    { name: 'Phone/edge or GPU', spec: 'Phone/edge for inference; GPU for training', qty: 1, price: 0 },
    { name: 'Pretrained CNN', spec: 'ImageNet-pretrained backbone for transfer learning', qty: 1, price: 0 },
    { name: 'Leaf dataset', spec: 'Labelled leaf images per crop/disease (lab + field ideal)', qty: 1, price: 0, note: 'Field images crucial for real use' },
    { name: 'Camera/phone', spec: 'For capturing leaf photos', qty: 1, price: 0 },
  ],
  cost: 'Software; compute-dependent',
  libs: ['python', 'torch', 'tf', 'numpy', 'sklearn'],

  wiringIntro: 'The "wiring" is the inference data flow — a phone photo of a leaf is preprocessed and passed to the CNN, which outputs a disease class with confidence.',
  pins: {
    left: [
      { dev: 'Phone/camera', devPin: 'photo', pin: '—', sig: 'Leaf image' },
      { dev: 'Preprocess', devPin: 'resize/norm', pin: '—', sig: 'Model input' },
    ],
    right: [
      { dev: 'CNN classifier', devPin: 'infer', pin: '—', sig: 'Disease class' },
      { dev: 'Advice output', devPin: 'display', pin: '—', sig: 'Diagnosis + confidence' },
    ],
  },
  wiringNotes: [
    'A phone or camera captures a leaf photo.',
    'The image is resized/normalised to the model input.',
    'The CNN classifies it into a disease (or healthy) with confidence.',
    'The result is shown as decision support, with a path to expert confirmation.',
    'Prefer field-representative training data for real-world accuracy.',
  ],

  block: { columns: [
    { label: 'Capture', edge: 'right', blocks: [
      { name: 'Leaf photo', sub: 'phone', highlight: true },
      { name: 'Preprocess', sub: 'resize/norm' },
    ] },
    { label: 'Classify', edge: 'right', blocks: [
      { name: 'CNN', sub: 'features', highlight: true },
      { name: 'Softmax', sub: 'class probs' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'Top class', sub: 'confidence' },
      { name: 'Low conf?', sub: 'defer' },
    ] },
    { label: 'Advise', edge: 'none', blocks: [
      { name: 'Diagnosis', sub: 'guidance' },
      { name: 'Confirm', sub: 'expert' },
    ] },
  ] },
  flow: [
    { t: 'Capture a leaf photo', k: 'start' },
    { t: 'Preprocess (resize/normalise)', k: 'proc' },
    { t: 'CNN → class probabilities', k: 'proc' },
    { t: 'Confident prediction?', k: 'dec', yes: 'Show diagnosis + guidance', no: 'Advise retake / expert' },
    { t: 'Show diagnosis + guidance', k: 'io' },
    { t: 'Advise retake / expert', k: 'io' },
    { t: 'Done (decision support)', k: 'end', back: 'Capture a leaf photo' },
  ],

  principle: [
    'Crop disease classification works because a great many plant diseases are, at heart, a <b>visual pattern-recognition</b> problem: the disease writes its signature on the leaf as characteristic lesions — the concentric rings of an early blight, the orange pustules of a rust, the powdery film of a mildew, the yellowing pattern of a nutrient or viral problem. A trained agronomist recognises these by eye, which means the knowledge is <b>learnable from images</b>. Framing diagnosis as <b>image classification</b> — photo in, disease label out — turns expert diagnosis into something a model can do, and a phone can carry.',
    'The engine is a <b>convolutional neural network</b>, the architecture that made modern image recognition work. A CNN learns a <b>hierarchy of visual features</b>: early layers detect edges and colours, deeper layers combine them into textures and lesion shapes, and the final layers map those high-level features to disease classes. Crucially, the network <b>learns the relevant features itself</b> from labelled examples — you do not hand-engineer "detect concentric rings"; you show it thousands of labelled leaves and it discovers the discriminative patterns. This learned-feature capability is exactly why CNNs excel where fixed rules fail.',
    'The practical key to doing this well with limited data is <b>transfer learning</b>. Training a large CNN from scratch needs enormous data and compute, which a leaf dataset rarely has. Instead, you start from a network <b>pretrained on millions of general images</b> — which has already learned broadly useful visual features (edges, textures, shapes) — and <b>fine-tune</b> it on the leaf dataset, adapting those features to the disease task. This achieves strong accuracy with a few thousand images and modest compute, and yields a model small and fast enough to run <b>on a phone, offline, in the field</b>, which is where a farmer actually needs it. Add <b>data augmentation</b> (rotations, crops, colour/lighting jitter) and the model generalises better from the data it has.',
    'The honesty this project demands is about the <b>gap between a benchmark and a field tool</b>, and it is a gap that has embarrassed many crop-disease demos. Popular datasets (like PlantVillage) are often <b>clean, single-leaf lab images on plain backgrounds</b>, and a model trained on them can score superbly in testing yet <b>fail on real field photos</b> — cluttered backgrounds, mixed lighting, multiple leaves, co-occurring diseases, unfamiliar growth stages. So genuine field use needs <b>field-representative training data</b>, not just lab images, and realistic evaluation. The model also only knows the <b>crops and diseases it was trained on</b> — it will confidently mislabel anything outside that set — and its <b>confidence scores are not certainty</b>. For all these reasons it must be framed as <b>decision support that advises, not dictates</b>: it suggests a likely diagnosis and guidance, flags low-confidence cases for a retake or expert, and leaves serious or costly decisions to human confirmation. Built with that honesty — CNN plus transfer learning, trained on representative data, deployed on-phone, and clearly positioned as advice — it delivers real value (accessible, early, disease diagnosis that reduces crop loss) while being a complete, textbook lesson in the workhorse skills of image classification.',
  ],
  equations: [
    { t: 'Image classification', eq: 'CNN(image) → class probabilities p over diseases\n\n  prediction = argmax(p)\n  confidence = max(p)\n\n"healthy" is just one of the classes. Softmax over the\ntrained disease vocabulary.' },
    { t: 'Transfer learning', eq: 'start from a network pretrained on general images\n  (already knows edges, textures, shapes)\nreplace/retrain the final layers on leaf classes\nfine-tune → strong accuracy with FEW images + little compute\n  → small enough to run on a phone offline.' },
    { t: 'Honest deployment', eq: 'if confidence < THRESHOLD:  advise retake / seek expert\nknows ONLY trained crops/diseases → out-of-set = wrong\nlab-trained → validate on FIELD images\n\nAdvise, do not dictate — decision support.' },
  ],

  ai: {
    task: 'Classify a leaf photo into a plant disease (or healthy) using a CNN with transfer learning, deployable on-phone, framed as confidence-scored decision support.',
    dataset: [
      'Labelled leaf images per crop and disease. Lab datasets (e.g. PlantVillage) are a starting point, but field-representative images are essential for real-world accuracy.',
      'Class balance and coverage of growth stages, lighting and backgrounds shape generalisation.',
    ],
    datasetTable: [
      { n: 'PlantVillage (lab)', size: '~54k images, many classes', lic: 'Open (check terms)', use: 'Baseline training (lab conditions)' },
      { n: 'Field leaf photos', size: 'As many as possible', lic: 'Yours', use: 'Real-world robustness (crucial)' },
      { n: 'ImageNet-pretrained backbone', size: '—', lic: 'Model terms', use: 'Transfer-learning base' },
      { n: 'Augmented data', size: 'Generated', lic: '—', use: 'Generalisation' },
    ],
    preprocess: [
      'Resize/normalise to the backbone input; centre on the leaf where possible.',
      'Augment (rotate, crop, colour/lighting jitter) for field robustness.',
      'Balance classes; hold out field images for honest validation.',
    ],
    pipeline: [
      { name: 'Leaf photo', sub: 'phone', highlight: true },
      { name: 'Preprocess', sub: 'resize/aug' },
      { name: 'CNN backbone', sub: 'features', highlight: true },
      { name: 'Classifier head', sub: 'disease' },
      { name: 'Confidence', sub: 'advise/defer' },
    ],
    archTable: [
      { l: 'Backbone', s: 'pretrained CNN (e.g. MobileNet/ResNet)', p: 'Learned visual features (transfer)' },
      { l: 'Head', s: 'new FC + softmax over classes', p: 'Map features → diseases' },
      { l: 'Augmentation', s: 'rotate/crop/colour', p: 'Generalise to field variation' },
      { l: 'Calibration', s: 'confidence threshold', p: 'Defer low-confidence cases' },
      { l: 'Deployment', s: 'quantised on-phone', p: 'Offline in-field use' },
    ],
    hyper: [
      { k: 'Backbone', v: 'MobileNet/ResNet', w: 'Size vs accuracy (phone)' },
      { k: 'Learning rate', v: 'small (fine-tune)', w: 'Adapt without forgetting' },
      { k: 'Augmentation', v: 'strong', w: 'Field generalisation' },
      { k: 'Confidence threshold', v: 'app-specific', w: 'Advise vs defer' },
    ],
    training: [
      'Fine-tune a pretrained backbone on the leaf classes with augmentation.',
      'Validate on held-out FIELD images, not just lab test splits.',
      'Watch the confusion matrix for confused disease pairs.',
    ],
    metricsIntro: [
      'Accuracy and per-class confusion matter, but the decisive honest metric is accuracy on real field images, which is usually lower than lab test accuracy.',
    ],
    metrics: [
      { m: 'Lab test accuracy', v: 'often high', d: 'Flattering — clean images' },
      { m: 'Field accuracy', v: 'lower (honest)', d: 'The number that matters' },
      { m: 'Per-class confusion', v: 'inspect', d: 'Which diseases are confused' },
      { m: 'Model size / latency', v: 'phone-fit', d: 'Offline in-field use' },
    ],
    chart: { title: 'Lab vs field accuracy', unit: '%', desc: 'Models trained on clean lab images often drop sharply on messy field photos — the central honesty of crop-disease AI (illustrative).', bars: [
      { label: 'Lab test set', value: 96 },
      { label: 'Similar field', value: 82 },
      { label: 'Messy field', value: 68 },
      { label: 'Unseen crop/stage', value: 40 },
    ] },
    inference: { file: 'classify.py', lang: 'python', body: `import torch, torch.nn.functional as F

THRESHOLD = 0.6

def diagnose(image, model, classes):
    x = preprocess(image)                     # resize/normalise to backbone
    with torch.no_grad():
        probs = F.softmax(model(x[None]), dim=1)[0]   # class probabilities
    conf, idx = float(probs.max()), int(probs.argmax())
    if conf < THRESHOLD:
        return {"advice": "unclear — retake photo or consult an expert",
                "confidence": conf}
    return {"disease": classes[idx],          # likely diagnosis
            "confidence": conf,
            "note": "decision support — confirm before major action"}
    # Knows only trained crops/diseases; validate on FIELD images.` },
    limits: [
      'Lab-trained models often degrade badly on real field photos — validate on field data.',
      'Knows only the crops/diseases it was trained on; out-of-set is confidently wrong.',
      'Confidence is not certainty — advise, do not dictate.',
      'Co-occurring diseases, growth stages and lighting challenge single-label classification.',
    ],
  },

  assembly: [
    { h: 'Prepare data and a transfer-learning model', p: [
      'Assemble labelled leaf images (lab plus field), and fine-tune a pretrained CNN backbone on the disease classes with augmentation.',
    ], warn: 'A model trained only on clean lab images can score superbly yet fail in the field. Train and validate on field-representative images, and frame the tool as decision support that advises, not dictates.' },
    { h: 'Evaluate honestly', p: [
      'Validate on held-out field images, inspect the confusion matrix, and calibrate a confidence threshold for deferral.',
    ] },
    { h: 'Deploy on-phone with advice framing', p: [
      'Quantise/export for offline phone use, and present results as guidance with a path to expert confirmation.',
    ] },
  ],
  steps: [
    { h: 'Classify a leaf and gate on confidence', p: [
      'Preprocess the photo, run the CNN for class probabilities, and either advise a diagnosis or defer low-confidence cases.',
    ], code: {
      file: 'diagnose.py', lang: 'python',
      body: `import torch, torch.nn.functional as F
THRESHOLD = 0.6

def diagnose(image, model, classes):
    x = preprocess(image)                          # to backbone input
    with torch.no_grad():
        probs = F.softmax(model(x[None]), dim=1)[0]    # disease probabilities
    conf, idx = float(probs.max()), int(probs.argmax())
    if conf < THRESHOLD:                            # not confident enough
        return {"advice": "retake / consult expert", "confidence": conf}
    return {"disease": classes[idx], "confidence": conf,
            "note": "advice, not a verdict"}        # decision support`,
      explain: [
        { ref: 'probs = F.softmax(model(x[None]), dim=1)[0]    # disease probabilities', txt: 'The CNN outputs a probability over the trained disease classes; the top one is the likely diagnosis.' },
        { ref: 'if conf < THRESHOLD:                            # not confident enough', txt: 'Low-confidence cases are deferred to a retake or an expert rather than asserting a shaky label — the advise-don\'t-dictate principle.' },
        { ref: 'return {"disease": classes[idx], "confidence": conf,', txt: 'A confident prediction is returned with its confidence, so the farmer sees how sure the model is.' },
        { ref: '"note": "advice, not a verdict"}        # decision support', txt: 'The output is explicitly framed as decision support, not a definitive diagnosis.' },
      ],
    } },
    { h: 'Present guidance and enable confirmation', p: [
      'Show the likely disease, confidence and treatment guidance, and provide a path to expert confirmation for serious or costly decisions.',
    ], tip: 'The number that matters is field accuracy, not lab test accuracy. Validate on real, messy field photos — a model that only shines on clean lab images will disappoint in the field.' },
  ],

  code: [{
    file: 'crop_disease.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Crop Disease Classifier (CNN + transfer learning)

Classifies a leaf photo into a plant disease (or healthy) with a CNN,
fine-tuned from a pretrained backbone (transfer learning), deployable
on-phone for offline in-field use. Confidence-gated DECISION SUPPORT —
advises, does not dictate. Validate on FIELD data, not just lab images.
"""
import torch, torch.nn as nn, torch.nn.functional as F
from torchvision import models

THRESHOLD = 0.6

def build_model(num_classes):
    net = models.mobilenet_v3_small(weights="IMAGENET1K_V1")  # pretrained
    net.classifier[-1] = nn.Linear(net.classifier[-1].in_features,
                                   num_classes)   # new head for diseases
    return net                                    # fine-tune this

class Diagnoser:
    def __init__(self, model, classes):
        self.model = model.eval(); self.classes = classes

    def diagnose(self, image):
        x = preprocess(image)                     # resize/normalise
        with torch.no_grad():
            probs = F.softmax(self.model(x[None]), dim=1)[0]
        conf, idx = float(probs.max()), int(probs.argmax())
        if conf < THRESHOLD:                       # unsure -> defer
            return {"advice": "unclear — retake or consult an expert",
                    "confidence": round(conf, 2)}
        return {"disease": self.classes[idx],      # likely diagnosis
                "confidence": round(conf, 2),
                "guidance": treatment_hint(self.classes[idx]),
                "note": "decision support — confirm before major action"}

if __name__ == "__main__":
    model = build_model(len(CLASSES))
    # ... fine-tune on leaf data (lab + FIELD) with augmentation ...
    dx = Diagnoser(model, CLASSES)
    print(dx.diagnose(load_photo("leaf.jpg")))
    # Knows only trained crops/diseases; validate on field images.`,
    explain: [
      { ref: 'net = models.mobilenet_v3_small(weights="IMAGENET1K_V1")  # pretrained', txt: 'Transfer learning starts from a network that already knows general visual features, so strong accuracy is reachable with modest leaf data and compute.' },
      { ref: 'net.classifier[-1] = nn.Linear(net.classifier[-1].in_features,', txt: 'Only the final head is replaced for the disease classes; the pretrained features are fine-tuned to the task.' },
      { ref: 'if conf < THRESHOLD:                       # unsure -> defer', txt: 'The classifier defers when unsure instead of asserting a shaky label — decision support, not a verdict.' },
      { ref: '"guidance": treatment_hint(self.classes[idx]),', txt: 'A confident diagnosis is paired with treatment guidance, making it actionable for the farmer.' },
      { ref: '# Knows only trained crops/diseases; validate on field images.', txt: 'The honest scope — trained vocabulary only, field validation required — is stated in the code.' },
    ],
  }],

  config: [
    'Configure the backbone, classes, and transfer-learning fine-tuning.',
    'Configure augmentation and class balancing.',
    'Configure the confidence threshold for deferral.',
    'Configure on-phone export and advice/guidance presentation.',
  ],
  calibration: [
    { h: 'Field validation', p: [
      'Validate on held-out field photos; expect and tune for lower-than-lab accuracy.',
    ] },
    { h: 'Confidence threshold', p: [
      'Set the deferral threshold so shaky predictions are flagged rather than asserted.',
    ] },
    { h: 'Confusions', p: [
      'Inspect the confusion matrix; add data for confused disease pairs.',
    ] },
  ],
  testing: [
    { step: 'Clear diseased-leaf photo', expect: 'Correct disease, good confidence' },
    { step: 'Healthy leaf', expect: 'Classified healthy' },
    { step: 'Messy field photo', expect: 'Works but lower accuracy — validate' },
    { step: 'Ambiguous/blurry photo', expect: 'Low confidence → defer to retake/expert' },
    { step: 'Untrained crop/disease', expect: 'Confidently wrong — note scope' },
    { step: 'Run on phone offline', expect: 'Fast, offline inference' },
  ],
  output: [
    'A confidence-scored likely diagnosis with guidance, deferring unclear cases — decision support in the field.',
    { file: 'diagnosis.json', lang: 'json', body: `{
  "disease": "Tomato — Early Blight",
  "confidence": 0.87,
  "guidance": "remove affected leaves; consider appropriate fungicide",
  "note": "decision support — confirm before major action"
}` },
    'A confident early-blight diagnosis from a single photo, with guidance — accessible early diagnosis, framed honestly as advice to confirm before costly action.',
  ],
  troubleshoot: [
    { sym: 'Great in test, poor in field', cause: 'Lab-only training', fix: 'Train/validate on field images; augment heavily' },
    { sym: 'Confidently wrong labels', cause: 'Out-of-set input', fix: 'Scope clearly; add classes; defer low confidence' },
    { sym: 'Confuses two diseases', cause: 'Similar symptoms/data', fix: 'More data; inspect confusion; better features' },
    { sym: 'Overfitting', cause: 'Little/unbalanced data', fix: 'Augment; balance classes; regularise' },
    { sym: 'Too big for phone', cause: 'Heavy backbone', fix: 'Smaller backbone; quantise/prune' },
    { sym: 'Over-trusted', cause: 'Dictating not advising', fix: 'Frame as decision support; enable expert confirmation' },
  ],

  perf: [
    'Use transfer learning for accuracy with limited data.',
    'Augment strongly and validate on field images.',
    'Gate on confidence; defer unclear cases.',
    'Use a phone-sized backbone; quantise for offline use.',
  ],
  safety: [
    'Advise, do not dictate — a confident label can be wrong; confirm before costly or irreversible action.',
    'Validate on field data; a lab-only model can mislead in the field.',
    'It knows only trained crops/diseases — be explicit about scope.',
    'Pair with expert confirmation for serious diagnoses.',
  ],
  maintenance: [
    'Add field data and classes; retrain periodically.',
    'Re-validate field accuracy and confusions over seasons.',
    'Update the model/backbone as better ones appear.',
    'Keep the decision-support framing and scope clear.',
  ],
  future: [
    'Add severity estimation and treatment dosing guidance.',
    'Add detection/segmentation of lesions (not just whole-leaf).',
    'Add multi-crop coverage and growth-stage awareness.',
    'Add on-device continual learning from confirmed cases.',
  ],
  faq: [
    { q: 'Why a CNN?', a: 'Because disease diagnosis from leaves is visual pattern recognition, and CNNs learn a hierarchy of visual features (edges → textures → lesion shapes → disease) directly from labelled images, excelling exactly where hand-written rules fail.' },
    { q: 'What is transfer learning and why use it?', a: 'Starting from a network pretrained on millions of general images and fine-tuning it on the leaf dataset. It reaches strong accuracy with only a few thousand images and modest compute, and yields a model small enough to run offline on a phone.' },
    { q: 'Why do lab-trained models fail in the field?', a: 'Popular datasets are often clean, single-leaf lab images on plain backgrounds. Real field photos have clutter, mixed lighting, multiple leaves and co-occurring problems, so a model that scores superbly on lab tests can drop sharply in the field. Field-representative data and evaluation are essential.' },
    { q: 'Can it diagnose any plant problem?', a: 'No — only the crops and diseases it was trained on, and it will confidently mislabel anything outside that set. Its confidence is not certainty, which is why it must be framed as decision support.' },
    { q: 'Should farmers act on it directly?', a: 'For minor calls, it is helpful guidance; for serious or costly decisions, it should advise, not dictate — flagging low-confidence cases and pointing to expert confirmation before major action.' },
  ],
  refs: [
    { t: 'Convolutional neural network', u: 'https://en.wikipedia.org/wiki/Convolutional_neural_network', s: 'Reference' },
    { t: 'Transfer learning', u: 'https://en.wikipedia.org/wiki/Transfer_learning', s: 'Reference' },
    { t: 'Image classification', u: 'https://en.wikipedia.org/wiki/Computer_vision#Recognition', s: 'Reference' },
    { t: 'PlantVillage dataset', u: 'https://plantvillage.psu.edu/', s: 'Dataset' },
    { t: 'Plant disease diagnosis', u: 'https://en.wikipedia.org/wiki/Plant_pathology', s: 'Reference' },
  ],
  images: ['neural', 'greenhouse', 'farm'],
  imageCaptions: [
    'A CNN diagnoses leaf diseases from a single phone photo — an expert diagnostic eye in every farmer\'s pocket.',
    'Transfer learning fine-tunes a pretrained network, reaching strong accuracy with modest data and phone-sized models.',
    'The honest challenge: models trained on clean lab images must be validated on messy real field photos.',
  ],
},

];
