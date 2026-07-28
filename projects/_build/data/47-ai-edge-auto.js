/* AI — Robotics/Autonomy + Edge (A23–A25). Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   A23 — Autonomous Lane-Keeping Car
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A23',
  domainKey: 'ai',
  emoji: '🚙', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'A vision-driven model car that steers itself to stay in its lane — the accessible core of self-driving, learned end-to-end or by detecting lanes.',
  platformName: 'Raspberry Pi / Jetson on a model car',
  ide: 'Python 3.11 + vision / deep learning',

  overview: [
    'Self-driving cars are dauntingly complex, but their most iconic sub-problem — <b>staying in the lane</b> — can be built at model-car scale and teaches the real ideas. This project builds an <b>autonomous lane-keeping car</b>: a small vehicle with a camera that <b>steers itself to stay centred in its lane</b>, using computer vision to see the road and a control loop to keep the car on it. It is the accessible, buildable core of autonomous driving — perception feeding control — on a platform you can hold.',
    'There are two classic approaches, and both are worth understanding. The <b>lane-detection</b> approach is explicit: use computer vision to <b>find the lane markings</b> in the camera image (edge detection, colour thresholds, perspective transform to a bird\'s-eye view, fitting lane lines), compute how far the car is from the lane centre, and <b>steer to correct</b> — a transparent perception-then-control pipeline. The <b>end-to-end learning</b> approach is the famous alternative: train a neural network to map the <b>camera image directly to a steering command</b>, learning to drive by imitating a human driver\'s steering (behavioural cloning) — no explicit lane-finding, the network figures out what to look at. This project can do either, and comparing them is illuminating.',
    'The value is the essential lesson of autonomy: <b>closing the loop from perception to action</b> in real time on a moving vehicle. It is honest that this is a <b>controlled, simplified</b> version of a hard problem — a model car on a clear track in good light is a world away from real roads, and lane-keeping is only <i>one</i> narrow slice of self-driving (no other cars, pedestrians, signs, intersections, weather, or edge cases). Real autonomy needs far more perception, redundancy and safety engineering, and end-to-end models are notoriously brittle outside their training distribution. But as a real-time, vision-driven lane-keeper — by explicit detection or end-to-end learning — it delivers a genuine, satisfying taste of autonomous driving and the clearest hands-on lesson in perception-to-control.',
  ],
  does: [
    'Steers a model car to stay centred in its lane',
    'Sees the road with a camera (computer vision)',
    'Detects lane markings, or learns steering end-to-end',
    'Computes lane offset and corrects steering',
    'Closes the perception-to-control loop in real time',
    'Demonstrates the core of autonomous driving',
    'Runs on edge hardware on a moving vehicle',
  ],
  features: [
    'Vision-based lane keeping',
    'Lane-detection pipeline (edges/colour/bird\'s-eye/fit)',
    'End-to-end (behavioural cloning) option',
    'Real-time perception-to-control loop',
    'Steering control from lane offset',
    'Edge deployment on a model car',
    'Honest about the gap to real self-driving',
  ],
  applications: [
    { t: 'Autonomy education', d: 'Perception-to-control at model-car scale.' },
    { t: 'Self-driving research learning', d: 'Lane detection vs end-to-end learning.' },
    { t: 'Robotics platforms', d: 'Vision-guided vehicle control.' },
    { t: 'ADAS concepts', d: 'The idea behind lane-keeping assist.' },
  ],
  skills: [
    'Computer vision for lane detection',
    'Perspective transform and lane fitting',
    'End-to-end (behavioural cloning) driving',
    'Real-time perception-to-control loops',
    'Steering control and edge deployment',
  ],
  prereq: [
    'Lane-keeping is the accessible core of self-driving: perception → control.',
    'Two approaches: explicit lane detection, or end-to-end learned steering.',
    'Close the loop in real time on a moving vehicle.',
    'This is a simplified slice — a world away from real roads.',
  ],

  parts: ['rpi4', 'picam', 'bo_motor', 'l298n', 'li18650'],
  extraParts: [
    { name: 'Model car chassis', spec: 'Steerable/differential-drive car with motors', qty: 1, price: 1500 },
    { name: 'Camera', spec: 'Forward-facing camera for the road', qty: 1, price: 800 },
    { name: 'Edge compute', spec: 'Raspberry Pi / Jetson on the car', qty: 1, price: 0 },
    { name: 'Track', spec: 'Marked lane track in good lighting', qty: 1, price: 500, note: 'Controlled environment' },
  ],
  cost: '₹4,000 – ₹9,000',
  libs: ['python', 'opencv', 'torch', 'numpy', 'picamera2'],

  wiringIntro: 'The "wiring" combines a real vehicle and a perception-to-control loop — a forward camera feeds lane perception (detection or a learned network), which produces a steering command driving the car\'s motors.',
  pins: {
    left: [
      { dev: 'Camera', devPin: 'CSI/USB', pin: '—', sig: 'Road image' },
      { dev: 'Perception', devPin: 'lane/steer', pin: '—', sig: 'Offset or steering' },
    ],
    right: [
      { dev: 'Steering/motors', devPin: 'PWM/IN', pin: 'GPIO', sig: 'Steer + drive' },
      { dev: 'Edge compute', devPin: 'onboard', pin: '—', sig: 'Real-time loop' },
    ],
  },
  wiringNotes: [
    'Mount a forward-facing camera to see the lane ahead.',
    'Run perception on the onboard edge computer (detection or a learned net).',
    'Compute a steering command (from lane offset, or directly from the network).',
    'Drive the car\'s steering/motors to stay centred.',
    'Use a controlled, well-lit marked track — this is a simplified slice of driving.',
  ],

  block: { columns: [
    { label: 'See', edge: 'right', blocks: [
      { name: 'Camera', sub: 'road', highlight: true },
    ] },
    { label: 'Perceive', edge: 'right', blocks: [
      { name: 'Lane detect', sub: 'markings', highlight: true },
      { name: 'or End-to-end', sub: 'learned steer' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'Lane offset', sub: 'error' },
      { name: 'Steering', sub: 'command', highlight: true },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Steer + drive', sub: 'stay centred' },
      { name: 'Real-time loop', sub: 'repeat' },
    ] },
  ] },
  flow: [
    { t: 'Capture road image', k: 'start' },
    { t: 'Detection or end-to-end?', k: 'dec', yes: 'Detect lane; compute offset', no: 'Network → steering directly' },
    { t: 'Detect lane; compute offset', k: 'proc' },
    { t: 'Network → steering directly', k: 'proc' },
    { t: 'Compute steering command', k: 'proc' },
    { t: 'Steer + drive to stay centred', k: 'io' },
    { t: 'Loop in real time', k: 'end', back: 'Capture road image' },
  ],

  principle: [
    'Autonomous driving is overwhelming as a whole, but it decomposes, and its cleanest, most iconic piece is <b>lane keeping</b>: keep the vehicle centred between the lane lines. Stripped to that, self-driving becomes a tractable, buildable problem — <b>see the lane, decide how to steer, act on the steering, repeat</b> — which is exactly the <b>perception-to-control loop</b> that sits at the heart of all robotics and autonomy. Building it on a model car teaches that loop for real, on a moving vehicle, without the crushing complexity of the full driving task.',
    'The <b>lane-detection approach</b> makes perception explicit and is a superb computer-vision lesson. From the camera image you <b>find the lane markings</b> through a classic pipeline: isolate likely lane pixels (edge detection, colour/gradient thresholds), often apply a <b>perspective transform</b> to get a top-down "bird\'s-eye" view where lanes are parallel and easy to reason about, and <b>fit lines or curves</b> to the lane boundaries. From the fitted lanes you compute the car\'s <b>offset from the lane centre</b> (and the lane\'s curvature) — a concrete error signal. A controller (proportional/PID, exactly as in the line-follower) then turns that offset into a <b>steering correction</b> to drive the error to zero. Everything is transparent and debuggable: you can see what the car sees and why it steers.',
    'The <b>end-to-end learning approach</b> is the famous alternative and a landmark idea in modern autonomy. Instead of hand-building the perception pipeline, you train a <b>neural network to map the camera image directly to a steering command</b>, learning by <b>imitating a human driver</b> — record images paired with the steering the human applied, and train the network to reproduce it (<b>behavioural cloning</b>). The network discovers on its own what visual features matter for steering, with no explicit lane-finding. It is remarkable that this works, and comparing the two approaches — transparent-but-hand-engineered detection versus powerful-but-opaque learning — is one of the most instructive parts of the project.',
    'The honesty this project demands is about the <b>vast gap between a lane-keeping model car and real self-driving</b>, and it matters both technically and for safety framing. This is a <b>controlled, simplified</b> problem: a clear track in good lighting, no other vehicles, no pedestrians, no traffic signs or lights, no intersections, no weather, no darkness, no debris — none of the endless edge cases that make real autonomy staggeringly hard. Lane keeping is <b>one narrow slice</b> of driving; a real system needs vastly more perception (detecting and predicting every agent), sensor fusion and redundancy (cameras, radar, lidar), mapping, planning, and safety engineering built to fail safe. The end-to-end approach specifically is known to be <b>brittle</b>: it can steer beautifully on roads like its training data and fail unpredictably outside that distribution, and its opacity makes failures hard to diagnose — which is why real deployments do not simply clone a driver end-to-end. None of this diminishes the project; it frames it correctly. As a real-time, vision-driven lane-keeper — built by explicit detection, by end-to-end learning, or both — it delivers a genuine, hands-on taste of autonomy and the clearest possible lesson in closing the loop from perception to action, while being honest that it is the accessible <i>doorway</i> to self-driving, not the thing itself.',
  ],
  equations: [
    { t: 'Lane-detection pipeline', eq: 'image → edges/colour threshold → bird\'s-eye (perspective)\n      → fit lane lines/curves → lane CENTRE\n\noffset = car_position − lane_centre   (the error signal)' },
    { t: 'Control (offset → steering)', eq: 'steering = Kp·offset + Kd·d(offset)/dt   (PID, as in line-following)\n\nDrive the offset to zero → stay centred. Real-time loop.' },
    { t: 'End-to-end (behavioural cloning)', eq: 'train: network(camera image) → steering  (imitate human)\ndrive: steering = network(image)          # no explicit lane-finding\n\nPowerful but OPAQUE and BRITTLE outside its training data.' },
  ],

  ai: {
    task: 'Keep a model car centred in its lane in real time, via explicit lane-detection-plus-control or an end-to-end network mapping camera images to steering (behavioural cloning).',
    dataset: [
      'Lane-detection needs little/no training data (classic CV). End-to-end needs recorded image–steering pairs from human driving on the track.',
      'End-to-end quality is bounded by how well the training runs cover the conditions.',
    ],
    datasetTable: [
      { n: 'Track images (detection)', size: 'Few (tuning)', lic: 'Yours', use: 'Tune CV thresholds' },
      { n: 'Image–steering pairs', size: 'Many runs', lic: 'Yours', use: 'End-to-end behavioural cloning' },
      { n: 'Varied-condition runs', size: 'Targeted', lic: 'Yours', use: 'Robustness (still limited)' },
      { n: 'Recovery examples', size: 'Targeted', lic: 'Yours', use: 'Teach re-centring from the edge' },
    ],
    preprocess: [
      'Detection: crop/ROI, colour/edge thresholds, perspective transform.',
      'End-to-end: crop, resize, normalise images; pair with steering; augment.',
      'Balance straight vs turning examples so the model does not just go straight.',
    ],
    pipeline: [
      { name: 'Camera', sub: 'road', highlight: true },
      { name: 'Detect / net', sub: 'perceive', highlight: true },
      { name: 'Offset / steering', sub: 'decide' },
      { name: 'Control', sub: 'steer' },
      { name: 'Drive', sub: 'stay centred' },
    ],
    archTable: [
      { l: 'Detection route', s: 'edges/colour + bird\'s-eye + fit', p: 'Transparent lane finding' },
      { l: 'Controller', s: 'PID on lane offset', p: 'Offset → steering' },
      { l: 'End-to-end route', s: 'CNN image → steering', p: 'Learned steering (opaque)' },
      { l: 'Training (E2E)', s: 'behavioural cloning', p: 'Imitate human steering' },
      { l: 'Runtime', s: 'edge, real-time loop', p: 'Perception-to-control' },
    ],
    hyper: [
      { k: 'Approach', v: 'detection / end-to-end', w: 'Transparent vs learned' },
      { k: 'PID gains', v: 'tuned', w: 'Smooth centring' },
      { k: 'Loop rate', v: 'real-time', w: 'React to curves' },
      { k: 'E2E augmentation', v: 'strong', w: 'Robustness/recovery' },
    ],
    training: [
      'Detection: little training — tune CV and PID. End-to-end: collect image–steering data and train a CNN.',
      'Augment and include recovery examples so end-to-end can re-centre.',
      'Validate on the track; expect brittleness for end-to-end off-distribution.',
    ],
    metricsIntro: [
      'Success is practical — staying centred through straights and curves in real time — with the honest caveat that this is a controlled, narrow slice of driving.',
    ],
    metrics: [
      { m: 'Lane-keeping success', v: 'on the track', d: 'Stays centred' },
      { m: 'Curve handling', v: 'tuned', d: 'Follows bends' },
      { m: 'Detection vs end-to-end', v: 'compare', d: 'Transparent vs learned' },
      { m: 'Robustness', v: 'limited (honest)', d: 'Controlled conditions only' },
    ],
    chart: { title: 'Where it works vs breaks', unit: '%', desc: 'Strong on a clear track; degrades off-distribution — and real driving\'s edge cases are entirely out of scope (illustrative).', bars: [
      { label: 'Clear track', value: 92 },
      { label: 'Sharp curves', value: 78 },
      { label: 'Poor lighting', value: 55 },
      { label: 'Off training data (E2E)', value: 35 },
    ] },
    inference: { file: 'lanekeep.py', lang: 'python', body: `import cv2, numpy as np

# ---- Route A: explicit lane detection + PID control ----
def lane_offset(frame):
    edges = cv2.Canny(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), 50, 150)
    warp = birds_eye(edges)                    # perspective transform
    left, right = fit_lane_lines(warp)          # fit boundaries
    lane_center = (left + right) / 2
    return lane_center - frame.shape[1] / 2     # offset from car centre

def steer_pid(offset, prev, Kp=0.4, Kd=0.2):
    return Kp * offset + Kd * (offset - prev)   # offset -> steering

# ---- Route B: end-to-end (behavioural cloning) ----
def steer_end_to_end(frame, model):
    return float(model(preprocess(frame)))      # image -> steering directly
    # Opaque + brittle outside training data; this is a controlled slice of driving.` },
    limits: [
      'A controlled, simplified slice — clear track, good light, no other agents.',
      'Lane keeping is one narrow part of driving; real autonomy needs far more.',
      'End-to-end models are brittle and opaque off their training distribution.',
      'Not a real self-driving system — the accessible doorway, not the thing.',
    ],
  },

  assembly: [
    { h: 'Build the car and perception', p: [
      'Mount a forward camera and edge computer on a model car, and implement lane perception (detection pipeline or an end-to-end network).',
    ], warn: 'This is a controlled, simplified slice of self-driving — a clear track in good light, no other vehicles, pedestrians, signs or weather. Do not present it as real autonomy; lane keeping is one narrow part of a staggeringly hard problem, and end-to-end models are brittle off their training data.' },
    { h: 'Close the perception-to-control loop', p: [
      'Turn lane offset (or the network output) into a steering command and drive the car, in real time.',
    ] },
    { h: 'Tune and compare approaches', p: [
      'Tune the controller / train the end-to-end model, and compare transparent detection with learned steering.',
    ] },
  ],
  steps: [
    { h: 'Perceive the lane and steer', p: [
      'Detect the lane offset (or run the end-to-end network) and produce a steering command in real time.',
    ], code: {
      file: 'drive.py', lang: 'python',
      body: `import cv2

def lane_offset(frame):
    edges = cv2.Canny(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), 50, 150)
    warp = birds_eye(edges)                     # top-down view (perspective)
    left, right = fit_lane_lines(warp)           # fit lane boundaries
    return (left + right) / 2 - frame.shape[1] / 2   # offset from centre

def drive(frame, prev_offset, model=None, Kp=0.4, Kd=0.2):
    if model is not None:
        return float(model(preprocess(frame))), prev_offset   # end-to-end steering
    off = lane_offset(frame)                      # explicit detection
    steering = Kp * off + Kd * (off - prev_offset)   # PID -> steering
    return steering, off`,
      explain: [
        { ref: 'warp = birds_eye(edges)                     # top-down view (perspective)', txt: 'A perspective transform to a bird\'s-eye view makes lane lines parallel and easy to fit — a key step in the detection pipeline.' },
        { ref: 'return (left + right) / 2 - frame.shape[1] / 2   # offset from centre', txt: 'The lane offset is the error signal — how far the car is from the lane centre — that the controller drives to zero.' },
        { ref: 'return float(model(preprocess(frame))), prev_offset   # end-to-end steering', txt: 'The end-to-end route maps the image straight to a steering command, with no explicit lane-finding — powerful but opaque.' },
        { ref: 'steering = Kp * off + Kd * (off - prev_offset)   # PID -> steering', txt: 'PID control turns lane offset into a smooth steering correction, exactly as in a line-follower.' },
      ],
    } },
    { h: 'Run the loop in real time and compare', p: [
      'Drive the loop fast enough to handle curves, and compare the transparent detection route with the learned end-to-end route.',
    ], tip: 'For end-to-end, include recovery examples in training — data where the car is off-centre and the human steers back — or the model never learns to re-centre and drifts off on its first mistake.' },
  ],

  code: [{
    file: 'lane_keeping_car.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Autonomous Lane-Keeping Car

Keeps a model car centred in its lane in real time via PERCEPTION →
CONTROL. Route A: explicit lane detection (edges/colour, bird's-eye,
fit) + PID. Route B: end-to-end CNN mapping image → steering
(behavioural cloning). A CONTROLLED, SIMPLIFIED slice of self-driving —
the accessible doorway, not real autonomy.
"""
import cv2

class LaneKeepingCar:
    def __init__(self, car, model=None, Kp=0.4, Kd=0.2):
        self.car = car; self.model = model      # model set = end-to-end route
        self.Kp, self.Kd = Kp, Kd; self.prev = 0.0

    def lane_offset(self, frame):               # Route A: explicit detection
        edges = cv2.Canny(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), 50, 150)
        warp = birds_eye(edges)                 # perspective transform
        left, right = fit_lane_lines(warp)      # fit lane boundaries
        return (left + right) / 2 - frame.shape[1] / 2   # offset from centre

    def steering(self, frame):
        if self.model is not None:              # Route B: end-to-end
            return float(self.model(preprocess(frame)))   # image -> steering
        off = self.lane_offset(frame)            # Route A: detect + PID
        s = self.Kp * off + self.Kd * (off - self.prev)
        self.prev = off
        return s

    def run(self):
        for frame in self.car.camera():          # real-time loop on the car
            self.car.steer(self.steering(frame)) # perception -> control
            self.car.drive(speed=SAFE_SPEED)

if __name__ == "__main__":
    LaneKeepingCar(ModelCar()).run()             # detection route (transparent)
    # Controlled track only; one narrow slice of driving; E2E is brittle/opaque.`,
    explain: [
      { ref: 'self.car = car; self.model = model      # model set = end-to-end route', txt: 'The same class supports both routes — leave the model out for transparent detection, or supply one for end-to-end steering.' },
      { ref: 'warp = birds_eye(edges)                 # perspective transform', txt: 'The detection route transforms to a bird\'s-eye view and fits lane boundaries — a transparent, debuggable pipeline.' },
      { ref: 'return float(self.model(preprocess(frame)))   # image -> steering', txt: 'The end-to-end route learns to map images directly to steering, discovering the relevant features itself.' },
      { ref: 'self.car.steer(self.steering(frame)) # perception -> control', txt: 'Each frame closes the perception-to-control loop — the essence of autonomy — in real time on the moving car.' },
      { ref: '# Controlled track only; one narrow slice of driving; E2E is brittle/opaque.', txt: 'The honest scope — a controlled slice, not real self-driving — is stated in the code.' },
    ],
  }],

  config: [
    'Configure the camera, edge compute and car control.',
    'Configure the approach (detection pipeline vs end-to-end model).',
    'Configure detection thresholds/perspective or the trained network.',
    'Configure PID gains, loop rate and safe speed.',
  ],
  calibration: [
    { h: 'Detection', p: [
      'Tune edge/colour thresholds and the perspective transform for reliable lane finding on the track.',
    ] },
    { h: 'Control', p: [
      'Tune PID for smooth centring; keep speed modest so the loop can react.',
    ] },
    { h: 'End-to-end', p: [
      'Collect balanced data with recovery examples; validate on the track; expect off-distribution brittleness.',
    ] },
  ],
  testing: [
    { step: 'Drive a straight lane', expect: 'Stays centred' },
    { step: 'Drive a curve', expect: 'Follows the bend (loop fast enough)' },
    { step: 'Start off-centre', expect: 'Re-centres (needs recovery data for E2E)' },
    { step: 'Dim the lighting', expect: 'Degrades — controlled conditions matter' },
    { step: 'Compare detection vs end-to-end', expect: 'Transparent vs learned trade-offs' },
    { step: 'Off training distribution (E2E)', expect: 'Brittle/unpredictable — note the limit' },
  ],
  output: [
    'A model car that keeps its lane in real time, by explicit detection or learned steering.',
    { file: 'lanekeep-state.txt', lang: 'plain', body: `approach:  lane-detection + PID
lane_offset: -14 px (left of centre)
steering:   +5.9 (correct right)
loop:       28 FPS
state:      LANE-KEEPING (controlled track)` },
    'The car is left of centre and steering back, running the perception-to-control loop at real-time rate — a genuine taste of autonomy on a controlled track, not real-world self-driving.',
  ],
  troubleshoot: [
    { sym: 'Wanders / oscillates', cause: 'PID/loop rate', fix: 'Tune Kp/Kd; slow down; speed up the loop' },
    { sym: 'Loses the lane', cause: 'Detection thresholds/lighting', fix: 'Re-tune thresholds/perspective; control lighting' },
    { sym: 'Drifts off on first error (E2E)', cause: 'No recovery data', fix: 'Add off-centre recovery examples to training' },
    { sym: 'Fails off-distribution (E2E)', cause: 'Brittleness', fix: 'Expected; augment; prefer detection for transparency' },
    { sym: 'Can\'t handle curves', cause: 'Slow loop / speed', fix: 'Faster loop; lower speed; fit curves not lines' },
    { sym: 'Over-claimed as self-driving', cause: 'Scope confusion', fix: 'Frame as a controlled, narrow slice of driving' },
  ],

  perf: [
    'Close the perception-to-control loop fast enough for curves.',
    'Keep speed modest so the controller can react.',
    'For detection, use a bird\'s-eye view and robust thresholds.',
    'For end-to-end, include recovery data and augment.',
  ],
  safety: [
    'This is a controlled, simplified slice of self-driving — do not treat it as real autonomy.',
    'End-to-end models are brittle and opaque off their training data — do not rely on them beyond the track.',
    'Keep speeds low and test in a safe, enclosed area.',
    'Real autonomy needs far more perception, redundancy and fail-safe engineering.',
  ],
  maintenance: [
    'Re-tune detection/PID for track and lighting changes.',
    'Retrain end-to-end for new conditions; keep recovery data.',
    'Check camera mounting and loop timing.',
    'Keep the scope framed honestly.',
  ],
  future: [
    'Add obstacle detection and stopping.',
    'Add sign/traffic-light recognition (toward more of driving).',
    'Add sensor fusion and mapping.',
    'Compare/deploy in a simulator for safety.',
  ],
  faq: [
    { q: 'What are the two approaches?', a: 'Lane detection: use computer vision to find the lane markings, compute the car\'s offset from the lane centre, and steer to correct — transparent and debuggable. End-to-end: train a neural network to map the camera image directly to a steering command by imitating a human driver (behavioural cloning) — powerful but opaque.' },
    { q: 'Why is a bird\'s-eye view used?', a: 'A perspective transform to a top-down view makes lane lines appear parallel and evenly spaced, which makes fitting the lane boundaries and computing curvature and offset much easier and more robust.' },
    { q: 'Is this really self-driving?', a: 'It is the accessible core — the perception-to-control loop — but only one narrow slice. It runs on a clear track in good light with no other vehicles, pedestrians, signs, intersections or weather. Real autonomy needs vastly more perception, redundancy and safety engineering.' },
    { q: 'Why is end-to-end brittle?', a: 'It learns to steer from its training data and can fail unpredictably outside that distribution — different lighting, track, or conditions — and its opacity makes failures hard to diagnose. That is why real systems do not simply clone a driver end-to-end.' },
    { q: 'Why include recovery examples for end-to-end?', a: 'Because if the model only ever sees perfect centred driving, it never learns to correct once it drifts off-centre — so on its first small mistake it drifts off. Training on off-centre situations where the human steers back teaches it to re-centre.' },
  ],
  refs: [
    { t: 'Self-driving car', u: 'https://en.wikipedia.org/wiki/Self-driving_car', s: 'Reference' },
    { t: 'Lane departure / keeping systems', u: 'https://en.wikipedia.org/wiki/Lane_departure_warning_system', s: 'Reference' },
    { t: 'End-to-end learning for driving (behavioural cloning)', u: 'https://en.wikipedia.org/wiki/Behavioral_cloning', s: 'Reference' },
    { t: 'Perspective transform (bird\'s-eye)', u: 'https://en.wikipedia.org/wiki/Homography_(computer_vision)', s: 'Reference' },
    { t: 'PID controller', u: 'https://en.wikipedia.org/wiki/PID_controller', s: 'Reference' },
  ],
  images: ['car', 'neural', 'cnn'],
  imageCaptions: [
    'A vision-driven model car steers itself to stay in its lane — the accessible core of autonomous driving.',
    'Two routes: explicit lane detection with a bird\'s-eye view, or an end-to-end network learning steering from images.',
    'It is a controlled, simplified slice of self-driving — the perception-to-control loop, not real-world autonomy.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A24 — Gesture-Controlled Drone
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A24',
  domainKey: 'ai',
  emoji: '🚁', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'Fly a drone with hand gestures read by a vision model — an intuitive interface where safety, not recognition, is the hard part.',
  platformName: 'Camera + edge compute + drone',
  ide: 'Python 3.11 + vision / drone SDK',

  overview: [
    'Controlling a drone with <b>hand gestures</b> — raise your hand to make it rise, swipe to move it, a fist to land — is a strikingly intuitive interface and a fun, ambitious project. It combines <b>computer-vision gesture recognition</b> with <b>drone flight control</b>: a camera reads your hand, a model interprets the gesture into a command, and the drone responds. But its defining lesson is not the recognition — it is that when your AI commands a <b>flying machine</b>, <b>safety and robustness matter far more than the coolness of the interface</b>.',
    'The recognition side builds on hand landmarks (as in the sign-language project): a vision model detects the hand and its keypoints, and gestures are classified from hand shape and motion — an open palm, a fist, a swipe, pointing. That gesture is mapped to a flight command (up/down, forward/back, land) sent to the drone. The control side uses the drone\'s SDK/API to execute commands. The intuitive magic is real: you conduct the drone with your hands, no controller needed.',
    'The honesty here is uncompromising because the stakes are physical: a drone is a <b>fast-spinning, flying object that can injure people and damage property</b>, so this project is <b>as much about safety engineering as about AI</b>. A <b>misrecognised gesture must not cause a dangerous action</b> — recognition is imperfect, so the system needs confidence gating, an unmistakable and reliable <b>emergency stop/land</b>, conservative and bounded commands, and <b>fail-safes</b> for lost tracking or lost connection (a drone that keeps flying when it can no longer see your hand is dangerous). It must be flown in a <b>safe, open area</b>, respecting drone regulations. Latency and false gestures are safety issues, not annoyances. Built safety-first — reliable recognition, but above all bounded commands, fail-safes and an emergency stop — it is both a genuinely magical interface and the essential lesson that AI controlling the physical world must put safety before capability.',
  ],
  does: [
    'Flies a drone using hand gestures',
    'Recognises gestures with computer vision (hand landmarks)',
    'Maps gestures to bounded flight commands',
    'Executes commands via the drone SDK',
    'Gates on confidence to avoid dangerous misfires',
    'Provides a reliable emergency stop/land',
    'Fails safe on lost tracking or connection',
  ],
  features: [
    'Vision gesture recognition (hand landmarks)',
    'Gesture → bounded flight command mapping',
    'Confidence gating (reject uncertain gestures)',
    'Emergency stop / auto-land',
    'Lost-tracking / lost-link fail-safes',
    'Conservative, bounded control',
    'Safety-first design (physical stakes)',
  ],
  applications: [
    { t: 'Intuitive drone control', d: 'Hands-free, controller-free flying.' },
    { t: 'HCI / gesture interfaces', d: 'Natural interaction research.' },
    { t: 'Interactive demos', d: 'Engaging gesture-driven robotics.' },
    { t: 'Safe-autonomy learning', d: 'AI controlling the physical world safely.' },
  ],
  skills: [
    'Gesture recognition (hand landmarks/motion)',
    'Drone SDK / flight control',
    'Safety engineering (fail-safes, emergency stop)',
    'Confidence gating and bounded commands',
    'Latency-aware, robust real-time control',
  ],
  prereq: [
    'AI commanding a flying machine — safety matters more than the interface.',
    'A misrecognised gesture must NOT cause a dangerous action.',
    'Provide a reliable emergency stop and fail-safes (lost tracking/link).',
    'Fly in a safe, open area; respect drone regulations.',
  ],

  parts: ['picam', 'rpi4'],
  extraParts: [
    { name: 'Camera + edge compute', spec: 'Camera + Pi/Jetson for gesture recognition', qty: 1, price: 0 },
    { name: 'Programmable drone', spec: 'Drone with an SDK/API (e.g. Tello-class)', qty: 1, price: 6000, note: 'Physical safety stakes' },
    { name: 'Hand-landmark model', spec: 'Vision model for hand keypoints/gestures', qty: 1, price: 0 },
    { name: 'Safe flight area', spec: 'Open, clear space; safety gear', qty: 1, price: 0, note: 'Regulations apply' },
  ],
  cost: '₹6,000 – ₹12,000',
  libs: ['python', 'mediapipe', 'opencv', 'numpy'],

  wiringIntro: 'The "wiring" combines a vision system and a flying machine — a camera feeds hand-gesture recognition; a recognised, confidence-gated gesture becomes a bounded flight command, with safety fail-safes gating everything.',
  pins: {
    left: [
      { dev: 'Camera', devPin: 'frames', pin: '—', sig: 'Hand video' },
      { dev: 'Gesture model', devPin: 'recognise', pin: '—', sig: 'Gesture + confidence' },
    ],
    right: [
      { dev: 'Safety gate', devPin: 'fail-safe', pin: '—', sig: 'Bound/stop' },
      { dev: 'Drone SDK', devPin: 'command', pin: '—', sig: 'Bounded flight' },
    ],
  },
  wiringNotes: [
    'A camera captures the operator\'s hand for gesture recognition.',
    'A vision model recognises the gesture with a confidence score.',
    'Only confident, bounded gestures become flight commands.',
    'Send commands via the drone SDK; keep an emergency stop and fail-safes.',
    'Fly in a safe, open area; a drone can injure — safety first.',
  ],

  block: { columns: [
    { label: 'See', edge: 'right', blocks: [
      { name: 'Camera', sub: 'hand', highlight: true },
      { name: 'Landmarks', sub: 'keypoints' },
    ] },
    { label: 'Recognise', edge: 'right', blocks: [
      { name: 'Gesture', sub: 'confidence', highlight: true },
    ] },
    { label: 'Safety gate', edge: 'right', blocks: [
      { name: 'Confident?', sub: 'bound', highlight: true },
      { name: 'Fail-safe', sub: 'stop/land' },
    ] },
    { label: 'Fly', edge: 'none', blocks: [
      { name: 'Bounded command', sub: 'drone SDK' },
      { name: 'E-stop', sub: 'always' },
    ] },
  ] },
  flow: [
    { t: 'Camera: read the hand', k: 'start' },
    { t: 'Recognise gesture (+confidence)', k: 'proc' },
    { t: 'Confident + tracking OK + link OK?', k: 'dec', yes: 'Bounded flight command', no: 'FAIL-SAFE: hover/land' },
    { t: 'FAIL-SAFE: hover/land', k: 'io' },
    { t: 'Bounded flight command', k: 'proc' },
    { t: 'Emergency stop gesture?', k: 'dec', yes: 'Emergency land immediately', no: 'Continue flying' },
    { t: 'Emergency land immediately', k: 'io' },
    { t: 'Continue flying', k: 'end', back: 'Camera: read the hand' },
  ],

  principle: [
    'A gesture-controlled drone is two systems joined — <b>vision gesture recognition</b> and <b>drone flight control</b> — and the temptation is to focus on the recognition because it is the visible "AI". The defining principle of this project is the opposite: because the output of the AI is <b>the motion of a fast, flying machine that can injure people and destroy property</b>, <b>safety and robustness dominate over interface cleverness</b>. The right mental model is not "cool gesture demo with some safety added" but "a safety-critical control system that happens to take gesture input". Everything below follows from taking that seriously.',
    'The recognition itself is a tractable vision problem, closely related to the sign-language translator. A model detects the hand and its <b>landmarks</b> (finger and palm keypoints), and <b>gestures are classified</b> from hand <b>shape</b> (open palm, fist, pointing) and <b>motion</b> (a swipe). Each recognised gesture maps to a <b>flight command</b> — palm up to ascend, fist to land, swipe to translate. Working from landmarks makes recognition robust to background and appearance, and the interface, when it works, is genuinely magical: you fly the drone with your hands.',
    'But recognition is <b>never perfect</b>, and that imperfection is exactly where the danger lives. A <b>misrecognised gesture must not cause a dangerous action</b> — if a stray hand movement is misread as "fly forward fast" toward a person, the interface\'s coolness is irrelevant. So the system is built to <b>contain the consequences of errors</b>: <b>confidence gating</b> (act only on clearly-recognised gestures, ignore uncertain ones), <b>bounded, conservative commands</b> (limited speeds and small increments so any single wrong command is survivable, not catastrophic), and deliberate design so the <b>worst case of a misrecognition is safe</b> — typically hovering, not lurching. Latency matters here as a <b>safety</b> property: a laggy command loop means the drone reacts late to both intended commands and stop commands.',
    'The non-negotiable safety machinery is what makes this project responsible, and it must be designed in from the start. There must be a <b>reliable, unmistakable emergency stop / land</b> — a way to bring the drone down <i>immediately</i> that does not depend on the gesture system working perfectly. There must be <b>fail-safes</b> for the failure modes that <i>will</i> happen: if the camera <b>loses tracking</b> of the hand, or the <b>connection to the drone drops</b>, the drone must <b>fail safe</b> (hover in place or auto-land) rather than continue on its last command — a drone that keeps flying when it can no longer see your hand or hear your commands is a genuine hazard. And it must be flown in a <b>safe, open area</b> away from people, respecting the <b>drone regulations</b> that apply where you are. The honest framing is that this is a <b>fun, ambitious project that is also a lesson in responsibility</b>: when AI controls something in the physical world that can cause harm, the engineering priority inverts from most software — <b>capability serves safety, not the reverse</b>. Built that way — reliable gesture recognition, but above all confidence gating, bounded commands, fail-safes and a rock-solid emergency stop — it delivers both the delight of conducting a drone by hand and the essential discipline of safe physical AI.',
  ],
  equations: [
    { t: 'Gesture → bounded command', eq: 'gesture, conf = recognise(hand_landmarks)\n\nact ONLY if conf ≥ THRESHOLD           # confidence gating\ncommand = map(gesture), bounded (limited speed/increment)\n\nA misrecognition must be SURVIVABLE, not catastrophic.' },
    { t: 'Fail-safe (the priority)', eq: 'if lost_tracking OR lost_link OR low_conf:\n    FAIL SAFE → hover / auto-land   # never continue last command\nif emergency_gesture:  LAND IMMEDIATELY\n\nA drone that flies on when it can\'t see your hand is dangerous.' },
    { t: 'Safety over capability', eq: 'output = motion of a FLYING machine that can INJURE\n→ safety + robustness ≫ interface coolness\n→ bounded commands, low latency, E-stop, safe area, regs\n\ncapability SERVES safety, not the reverse.' },
  ],

  ai: {
    task: 'Recognise hand gestures from a camera and map them to BOUNDED drone flight commands, with confidence gating, fail-safes and an emergency stop — safety over interface.',
    dataset: [
      'Gesture recognition uses hand-landmark models (pretrained) plus labelled gesture examples; the safety machinery is engineering, not data.',
      'Coverage of hands/lighting affects recognition, but the priority is safe handling of the imperfect recogniser.',
    ],
    datasetTable: [
      { n: 'Hand-landmark model (pretrained)', size: '—', lic: 'Library terms', use: 'Hand keypoints' },
      { n: 'Gesture examples', size: 'Per gesture', lic: 'Yours', use: 'Classify commands' },
      { n: 'Negative/ambiguous samples', size: 'Targeted', lic: 'Yours', use: 'Reduce false commands' },
      { n: 'Safety test scenarios', size: '—', lic: '—', use: 'Fail-safe / E-stop validation' },
    ],
    preprocess: [
      'Extract hand landmarks; normalise; classify gesture from shape/motion.',
      'Compute a confidence score; window motion gestures.',
      'Map only confident gestures to bounded commands.',
    ],
    pipeline: [
      { name: 'Camera', sub: 'hand', highlight: true },
      { name: 'Landmarks', sub: 'keypoints' },
      { name: 'Gesture', sub: 'confidence', highlight: true },
      { name: 'Safety gate', sub: 'bound/fail-safe' },
      { name: 'Drone', sub: 'bounded command' },
    ],
    archTable: [
      { l: 'Hand landmarks', s: 'keypoint model', p: 'Robust gesture input' },
      { l: 'Gesture classifier', s: 'shape/motion', p: 'Command intent' },
      { l: 'Confidence gate', s: 'threshold', p: 'Reject uncertain gestures' },
      { l: 'Bounded mapping', s: 'limited speed/increment', p: 'Survivable errors' },
      { l: 'Fail-safes', s: 'lost-track/link, E-stop', p: 'Safety over capability' },
    ],
    hyper: [
      { k: 'Confidence threshold', v: 'high', w: 'Avoid dangerous misfires' },
      { k: 'Command bounds', v: 'conservative', w: 'Survivable errors' },
      { k: 'Latency', v: 'low', w: 'Safety-critical' },
      { k: 'Fail-safe timeout', v: 'short', w: 'Lost-track/link response' },
    ],
    training: [
      'Use pretrained hand landmarks; train/tune gesture classification with negatives.',
      'Validate recognition, but prioritise testing fail-safes and the emergency stop.',
      'Tune confidence and command bounds so misrecognitions stay safe.',
    ],
    metricsIntro: [
      'Recognition accuracy matters, but the decisive metrics are safety: false-command rate, fail-safe reliability, and emergency-stop responsiveness.',
    ],
    metrics: [
      { m: 'Emergency-stop reliability', v: 'must be ~perfect', d: 'Non-negotiable' },
      { m: 'Fail-safe on lost track/link', v: 'always', d: 'Hover/land, never continue' },
      { m: 'False-command rate', v: 'very low', d: 'Confidence-gated' },
      { m: 'Latency', v: 'low', d: 'Safety-critical' },
    ],
    chart: { title: 'Where the effort must go', unit: '', desc: 'Recognition is the visible part, but safety machinery — bounds, fail-safes, E-stop — is where a responsible project invests most (illustrative).', bars: [
      { label: 'Gesture recognition', value: 60 },
      { label: 'Confidence gating', value: 80 },
      { label: 'Fail-safes', value: 95 },
      { label: 'Emergency stop', value: 100 },
    ] },
    inference: { file: 'gesture_drone.py', lang: 'python', body: `CONF = 0.9                              # HIGH: avoid dangerous misfires

def control(frame, drone, tracker, link):
    # FAIL-SAFE FIRST — never fly on when blind or disconnected
    if not tracker.hand_visible(frame) or not link.ok():
        drone.hover_or_land(); return       # lost tracking/link -> safe

    gesture, conf = recognise(frame)
    if gesture == "FIST" or gesture == "STOP":  # emergency land, gated loosely
        drone.emergency_land(); return

    if conf < CONF:                          # uncertain -> do nothing (safe)
        drone.hover(); return

    cmd = bounded(map_gesture(gesture))      # limited speed/increment
    drone.execute(cmd)                        # a misrecognition stays survivable
    # Fly in a safe open area; respect regulations; safety >> interface.` },
    limits: [
      'Recognition is imperfect — a misrecognised gesture must not be dangerous.',
      'A drone can injure people/property — safety and fail-safes dominate.',
      'Lost tracking or connection must trigger fail-safe, never continued flight.',
      'Must be flown in a safe, open area under applicable regulations.',
    ],
  },

  assembly: [
    { h: 'Build gesture recognition', p: [
      'Use a hand-landmark model to recognise gestures with a confidence score from the camera.',
    ], warn: 'This AI controls a flying machine that can injure people and damage property. Safety and robustness dominate over the interface: a misrecognised gesture must not cause a dangerous action. Design confidence gating, bounded commands, fail-safes and a reliable emergency stop from the start, and fly only in a safe, open area under applicable regulations.' },
    { h: 'Map gestures to bounded commands with gating', p: [
      'Act only on confident gestures, mapping them to conservative, bounded flight commands so any single error is survivable.',
    ] },
    { h: 'Build the safety machinery', p: [
      'Add a reliable emergency stop/land and fail-safes for lost tracking and lost connection (hover/auto-land, never continue).',
    ] },
  ],
  steps: [
    { h: 'Gate on safety, then command', p: [
      'Fail safe first on lost tracking/link/low confidence, honour the emergency stop, and only then issue bounded commands.',
    ], code: {
      file: 'control.py', lang: 'python',
      body: `CONF = 0.9                                 # high threshold: avoid misfires

def control(frame, drone, tracker, link):
    # 1) FAIL-SAFE FIRST — never fly on when blind or disconnected
    if not tracker.hand_visible(frame) or not link.ok():
        drone.hover_or_land(); return          # lost tracking/link -> safe

    gesture, conf = recognise(frame)
    if gesture in ("FIST", "STOP"):            # 2) EMERGENCY land
        drone.emergency_land(); return

    if conf < CONF:                            # 3) uncertain -> do nothing (safe)
        drone.hover(); return

    drone.execute(bounded(map_gesture(gesture)))   # 4) bounded, survivable command`,
      explain: [
        { ref: 'if not tracker.hand_visible(frame) or not link.ok():', txt: 'Fail-safe is checked first: if the system loses sight of the hand or the link drops, the drone goes safe rather than continuing its last command.' },
        { ref: 'if gesture in ("FIST", "STOP"):            # 2) EMERGENCY land', txt: 'The emergency land is honoured before normal commands — an unmistakable way to bring the drone down immediately.' },
        { ref: 'if conf < CONF:                            # 3) uncertain -> do nothing (safe)', txt: 'Uncertain gestures are ignored (the drone hovers), so a shaky recognition never triggers a dangerous action.' },
        { ref: 'drone.execute(bounded(map_gesture(gesture)))   # 4) bounded, survivable command', txt: 'Only confident gestures produce commands, and they are bounded/conservative so any single misrecognition stays survivable.' },
      ],
    } },
    { h: 'Test the safety cases hardest', p: [
      'Validate the emergency stop and fail-safes exhaustively, and fly only in a safe, open area under applicable regulations.',
    ], tip: 'Spend most of your testing on the failure modes, not the happy path: cover the camera, kill the link, feed ambiguous gestures — the drone must go safe every time before you trust the interface.' },
  ],

  code: [{
    file: 'gesture_controlled_drone.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Gesture-Controlled Drone (SAFETY-FIRST)

Recognises hand gestures with vision and maps them to BOUNDED drone
commands. Because the AI commands a FLYING machine that can injure,
safety dominates: FAIL-SAFE on lost tracking/link, a reliable EMERGENCY
LAND, confidence gating, and conservative bounded commands so any
misrecognition is survivable. Fly in a safe open area; respect regs.
"""
CONF_THRESHOLD = 0.9

class GestureDrone:
    def __init__(self, drone, tracker, link, recogniser):
        self.drone = drone; self.tracker = tracker
        self.link = link; self.recognise = recogniser

    def step(self, frame):
        # 1) FAIL-SAFE FIRST: never continue flying when blind/disconnected
        if not self.tracker.hand_visible(frame) or not self.link.ok():
            self.drone.fail_safe()              # hover or auto-land
            return "fail_safe"

        gesture, conf = self.recognise(frame)

        # 2) EMERGENCY STOP takes priority over everything else
        if gesture in ("FIST", "EMERGENCY"):
            self.drone.emergency_land()
            return "emergency_land"

        # 3) Confidence gate: act only on clearly-recognised gestures
        if conf < CONF_THRESHOLD:
            self.drone.hover()                  # uncertain -> safe default
            return "hover_uncertain"

        # 4) Bounded, conservative command (misrecognition stays survivable)
        cmd = self._bounded(self._map(gesture))
        self.drone.execute(cmd)
        return f"cmd:{cmd}"

    def _map(self, g):     return GESTURE_TO_COMMAND[g]
    def _bounded(self, c): return clamp(c, MAX_SPEED, MAX_STEP)   # limit it

    def run(self, camera):
        for frame in camera.frames():           # low-latency loop (safety)
            self.step(frame)

if __name__ == "__main__":
    GestureDrone(Drone(), HandTracker(), Link(), recognise_gesture).run(Camera())
    # Test fail-safes + E-stop hardest; safe open area only; safety >> interface.`,
    explain: [
      { ref: 'if not self.tracker.hand_visible(frame) or not self.link.ok():', txt: 'Fail-safe is the first check every loop — losing the hand or the link makes the drone go safe, never continue on its last command.' },
      { ref: 'if gesture in ("FIST", "EMERGENCY"):', txt: 'The emergency land takes priority over all normal commands — a reliable, unmistakable way to bring the drone down.' },
      { ref: 'if conf < CONF_THRESHOLD:', txt: 'A high confidence gate means only clearly-recognised gestures act; anything uncertain defaults to a safe hover.' },
      { ref: 'cmd = self._bounded(self._map(gesture))', txt: 'Commands are bounded and conservative so a single misrecognition is survivable, not catastrophic — errors are contained by design.' },
      { ref: '# Test fail-safes + E-stop hardest; safe open area only; safety >> interface.', txt: 'The core discipline — safety over interface, fly safely — is stated in the code itself.' },
    ],
  }],

  config: [
    'Configure the hand-landmark model and gesture set.',
    'Configure the confidence threshold (high) and gesture→command mapping.',
    'Configure command bounds (speed/increment) conservatively.',
    'Configure fail-safes (lost track/link) and the emergency stop.',
  ],
  calibration: [
    { h: 'Recognition', p: [
      'Validate gestures across hands/lighting; tune confidence high to avoid misfires.',
    ] },
    { h: 'Safety', p: [
      'Exhaustively test the emergency stop and fail-safes before flying near anything.',
    ] },
    { h: 'Bounds/latency', p: [
      'Keep commands bounded and latency low so errors stay survivable.',
    ] },
  ],
  testing: [
    { step: 'Perform a clear gesture', expect: 'Correct bounded command' },
    { step: 'Cover the camera (lost tracking)', expect: 'Fail-safe: hover/land' },
    { step: 'Kill the connection', expect: 'Fail-safe: hover/land (not continue)' },
    { step: 'Give an ambiguous gesture', expect: 'Ignored (hover) — no misfire' },
    { step: 'Trigger emergency stop', expect: 'Lands immediately, reliably' },
    { step: 'Fly in an open area', expect: 'Safe, regulation-compliant operation' },
  ],
  output: [
    'A drone flown by bounded hand-gesture commands, with confidence gating, fail-safes and a reliable emergency stop.',
    { file: 'gesture-drone-log.json', lang: 'json', body: `{
  "gesture": "open_palm_up",
  "confidence": 0.94,
  "command": "ascend (bounded)",
  "tracking": "ok",
  "link": "ok",
  "emergency_stop": "armed",
  "note": "safety >> interface; fail-safe on any loss"
}` },
    'A confident gesture producing a bounded ascend command, with tracking and link healthy and the emergency stop armed — the magical interface, but only because the safety machinery is watching underneath.',
  ],
  troubleshoot: [
    { sym: 'Dangerous misfires', cause: 'Low confidence gate', fix: 'Raise the threshold; ignore uncertain gestures' },
    { sym: 'Lurches on error', cause: 'Unbounded commands', fix: 'Bound speed/increments; conservative mapping' },
    { sym: 'Flies on when hand lost', cause: 'No fail-safe', fix: 'Fail-safe (hover/land) on lost tracking' },
    { sym: 'Flies on when link drops', cause: 'No link fail-safe', fix: 'Fail-safe on lost connection' },
    { sym: 'E-stop unreliable', cause: 'Depends on full pipeline', fix: 'Make emergency land robust and independent' },
    { sym: 'Reacts late', cause: 'High latency', fix: 'Lower latency — it is a safety property' },
  ],

  perf: [
    'Prioritise safety over interface at every step.',
    'Gate hard on confidence; bound all commands.',
    'Keep latency low — it is safety-critical.',
    'Test fail-safes and the emergency stop hardest.',
  ],
  safety: [
    'A drone can injure people and damage property — safety and robustness dominate over the interface.',
    'A misrecognised gesture must not cause a dangerous action — confidence-gate and bound commands.',
    'Fail safe (hover/auto-land) on lost tracking or lost connection — never continue flying.',
    'Provide a reliable emergency stop; fly in a safe, open area; respect drone regulations.',
  ],
  maintenance: [
    'Re-validate recognition and, especially, fail-safes/E-stop regularly.',
    'Keep command bounds conservative; re-check latency.',
    'Update the gesture model as needed without weakening safety.',
    'Stay current with drone regulations.',
  ],
  future: [
    'Add obstacle sensing and geofencing.',
    'Add richer gestures with stronger confidence estimation.',
    'Add redundant emergency-stop channels.',
    'Add automated return-to-home fail-safe.',
  ],
  faq: [
    { q: 'What is the hard part — recognition or control?', a: 'Neither, really — it is safety. Because the AI commands a flying machine that can injure people and damage property, the priority inverts from most software: safety and robustness matter far more than how cool the gesture interface is.' },
    { q: 'Why must commands be bounded?', a: 'Because recognition is imperfect, so a misrecognition will happen. Bounded, conservative commands (limited speed and small increments) ensure any single wrong command is survivable and safe — typically a hover — rather than a catastrophic lurch.' },
    { q: 'What happens if it loses sight of my hand?', a: 'It must fail safe — hover in place or auto-land — never continue on its last command. A drone that keeps flying when it can no longer see your hand (or has lost the connection) is a genuine hazard, so lost-tracking and lost-link fail-safes are essential.' },
    { q: 'Why does latency matter for safety?', a: 'Because a laggy loop means the drone reacts late — to both your intended commands and, critically, your stop command. Low latency is a safety property here, not just a smoothness nicety.' },
    { q: 'Where can I fly it?', a: 'Only in a safe, open area away from people, and in compliance with the drone regulations that apply where you are. The emergency stop and fail-safes are your last line of defence, but flying somewhere safe is the first.' },
  ],
  refs: [
    { t: 'Gesture recognition', u: 'https://en.wikipedia.org/wiki/Gesture_recognition', s: 'Reference' },
    { t: 'Unmanned aerial vehicle', u: 'https://en.wikipedia.org/wiki/Unmanned_aerial_vehicle', s: 'Reference' },
    { t: 'Fail-safe design', u: 'https://en.wikipedia.org/wiki/Fail-safe', s: 'Reference' },
    { t: 'Hand landmark estimation', u: 'https://developers.google.com/mediapipe', s: 'Docs' },
    { t: 'Drone regulations', u: 'https://en.wikipedia.org/wiki/Regulation_of_unmanned_aerial_vehicles', s: 'Reference' },
  ],
  images: ['drone', 'neural', 'camera'],
  imageCaptions: [
    'A gesture-controlled drone is flown by hand — an intuitive interface where safety, not recognition, is the hard part.',
    'Hand landmarks recognise gestures, but only confident ones become bounded flight commands.',
    'Safety machinery dominates: confidence gating, bounded commands, fail-safes, and a reliable emergency stop.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A25 — Edge AI Smart Camera
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A25',
  domainKey: 'ai',
  emoji: '📸', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'On-device person and vehicle analytics with no cloud round-trip — the camera does the AI itself, sending insights not video.',
  platformName: 'Jetson / Raspberry Pi + camera (edge)',
  ide: 'Python 3.11 + edge AI / vision',

  overview: [
    'A conventional smart camera streams video to the cloud, where AI analyses it — which costs bandwidth, adds latency, and sends everyone\'s footage off-device. An <b>edge AI smart camera</b> flips this: it runs the AI <b>on the camera itself</b>, analysing what it sees locally and sending only the <b>results</b> (counts, events, alerts) — not the video. This project builds one that does on-device <b>person and vehicle analytics</b>: detecting and counting people and vehicles in its view, with <b>no cloud round-trip</b>. It is the culmination of the vision and edge-AI ideas in this series, made practical.',
    'The core is running <b>capable vision on constrained hardware</b>. A detection model (as in the object-detection project) runs on an edge computer (a Jetson, a Raspberry Pi with an accelerator, or a smart-camera SoC), detecting people and vehicles in each frame; on top sits the analytics — counting, tracking across frames, zone/line crossing, dwell time — producing structured insights. The whole point is that this happens <b>locally</b>: the model is optimised (quantised, pruned, hardware-accelerated) to run in real time within the camera\'s compute and power budget.',
    'The advantages of edge over cloud are concrete and compelling: <b>privacy</b> (video never leaves the device — a huge deal for cameras in public and private spaces), <b>bandwidth</b> (send a number, not a video stream — essential at scale or on poor connections), <b>latency</b> (instant local decisions, no round-trip), and <b>offline operation</b> (works without connectivity). It is honest about the trade-offs: edge hardware limits <b>model size and accuracy</b> versus a cloud GPU (the <b>capability-vs-constraints</b> tension of all edge AI), optimisation takes real work, and — as with any analytics camera — <b>privacy must be designed for responsibly</b> (edge processing helps enormously, but person/vehicle analytics still carries obligations). Built as a real-time, on-device analytics camera that sends insights not video, it is both a genuinely useful, privacy-respecting product pattern and the definitive lesson in deploying vision AI at the edge.',
  ],
  does: [
    'Runs person/vehicle analytics on the camera itself',
    'Detects and counts people and vehicles on-device',
    'Sends insights (counts/events), not video',
    'Tracks across frames; zone/line crossing; dwell',
    'Works with no cloud round-trip (offline-capable)',
    'Optimises models to run in real time on edge hardware',
    'Preserves privacy by processing locally',
  ],
  features: [
    'On-device detection + analytics',
    'Person/vehicle counting and tracking',
    'Zone/line-crossing and dwell events',
    'Insights-not-video output',
    'Model optimisation (quantise/prune/accelerate)',
    'Privacy, bandwidth, latency, offline benefits',
    'Honest about capability-vs-constraints and privacy',
  ],
  applications: [
    { t: 'Retail / footfall analytics', d: 'On-device people counting and flow.' },
    { t: 'Traffic / parking', d: 'Vehicle counting and occupancy locally.' },
    { t: 'Smart buildings / security', d: 'Private, low-bandwidth analytics.' },
    { t: 'Edge-AI learning', d: 'Deploying vision on constrained hardware.' },
  ],
  skills: [
    'On-device object detection and analytics',
    'Model optimisation (quantisation/pruning/acceleration)',
    'Tracking, counting, zone/line events',
    'Edge deployment (compute/power budget)',
    'Privacy-respecting analytics design',
  ],
  prereq: [
    'Edge AI runs on the camera — send insights, not video.',
    'Edge benefits: privacy, bandwidth, latency, offline operation.',
    'Constrained hardware limits model size/accuracy vs the cloud.',
    'Person/vehicle analytics still carries privacy obligations.',
  ],

  parts: ['jetson', 'picam'],
  extraParts: [
    { name: 'Edge camera + compute', spec: 'Jetson / Pi + accelerator + camera (or smart-camera SoC)', qty: 1, price: 8000, note: 'Runs AI on-device' },
    { name: 'Optimised detector', spec: 'Quantised/accelerated person/vehicle model', qty: 1, price: 0 },
    { name: 'Analytics logic', spec: 'Counting/tracking/zone events on-device', qty: 1, price: 0 },
    { name: 'Insight uplink', spec: 'Send counts/events (not video)', qty: 1, price: 0, note: 'Low bandwidth' },
  ],
  cost: '₹8,000 – ₹15,000',
  libs: ['python', 'opencv', 'tf', 'ultralytics', 'onnx'],

  wiringIntro: 'The "wiring" combines a camera and on-device AI — frames are analysed locally by an optimised detector plus analytics, and only the resulting insights (counts/events) leave the device.',
  pins: {
    left: [
      { dev: 'Camera', devPin: 'frames', pin: '—', sig: 'Video (stays local)' },
      { dev: 'On-device detector', devPin: 'infer', pin: '—', sig: 'People/vehicles' },
    ],
    right: [
      { dev: 'Analytics', devPin: 'count/track', pin: '—', sig: 'Insights' },
      { dev: 'Uplink', devPin: 'insights', pin: '—', sig: 'Counts/events (not video)' },
    ],
  },
  wiringNotes: [
    'The camera feeds frames to on-device inference (video stays local).',
    'An optimised detector finds people and vehicles in real time.',
    'Analytics (count/track/zone/dwell) run on-device.',
    'Only insights (counts/events/alerts) are sent — not video.',
    'Balance model size/accuracy against the edge compute/power budget.',
  ],

  block: { columns: [
    { label: 'See', edge: 'right', blocks: [
      { name: 'Camera', sub: 'video local', highlight: true },
    ] },
    { label: 'Detect', edge: 'right', blocks: [
      { name: 'On-device model', sub: 'person/vehicle', highlight: true },
      { name: 'Optimised', sub: 'quantise' },
    ] },
    { label: 'Analyse', edge: 'right', blocks: [
      { name: 'Count/track', sub: 'zones/dwell', highlight: true },
    ] },
    { label: 'Send', edge: 'none', blocks: [
      { name: 'Insights', sub: 'not video' },
      { name: 'Private/offline', sub: 'edge' },
    ] },
  ] },
  flow: [
    { t: 'Capture frame (on-device)', k: 'start' },
    { t: 'Detect people/vehicles (optimised model)', k: 'proc' },
    { t: 'Track + count + zone/dwell', k: 'proc' },
    { t: 'Event (crossing/threshold)?', k: 'dec', yes: 'Emit insight/alert', no: 'Update counts' },
    { t: 'Emit insight/alert', k: 'io' },
    { t: 'Update counts', k: 'proc' },
    { t: 'Send insights only (not video)', k: 'end', back: 'Capture frame (on-device)' },
  ],

  principle: [
    'The edge AI smart camera is defined by a single architectural choice with large consequences: <b>run the AI where the camera is, not in the cloud</b>. A conventional smart camera is really a dumb camera plus a cloud brain — it streams video away to be analysed. The edge camera <b>is</b> the brain: it analyses what it sees on-device and emits only the conclusions. That inversion — <b>process locally, send insights not video</b> — is the whole idea, and everything valuable about the design flows from it.',
    'The engineering core is <b>running capable vision on constrained hardware</b>. On top of an on-device <b>object detector</b> (people and vehicles, as in the detection project) sits the <b>analytics</b> that turns detections into insight: <b>tracking</b> objects across frames to avoid double-counting, <b>counting</b>, detecting <b>zone or line crossings</b> (someone entered an area, a vehicle passed a point), and <b>dwell time</b>. The catch is that all of this must run in <b>real time within the camera\'s compute and power budget</b>, which is a fraction of a cloud GPU\'s. So the model is <b>optimised</b> — <b>quantised</b> (lower-precision arithmetic), <b>pruned</b>, and <b>hardware-accelerated</b> (using the edge device\'s NPU/GPU) — to fit. This optimisation work is central to edge AI and is where much of the real effort goes.',
    'The <b>advantages of edge over cloud</b> are concrete, and together they explain why this pattern is so compelling for cameras specifically. <b>Privacy</b>: because the video is analysed on-device and <b>never leaves it</b>, an edge camera sidesteps the enormous privacy exposure of streaming everyone\'s footage to a cloud — a decisive benefit for cameras in shops, streets, workplaces and homes. <b>Bandwidth</b>: sending a count or an event is trivially small compared to a continuous video stream, which makes large deployments and poor-connectivity sites feasible. <b>Latency</b>: local analysis gives instant decisions with no cloud round-trip, essential for real-time triggers. <b>Offline operation</b>: it keeps working without connectivity, since it does not depend on the cloud to think. These four — privacy, bandwidth, latency, resilience — are the canonical case for edge AI, and a camera is the poster child for all of them.',
    'The honesty is the <b>capability-versus-constraints trade-off</b> that governs all edge AI, plus the privacy responsibilities that remain. Edge hardware limits how big and accurate a model you can run compared to a cloud GPU, so an edge camera generally makes an <b>accuracy compromise</b> for its locality benefits — and getting a useful model to run in real time on the device takes genuine <b>optimisation work</b>. It is honest, too, that while edge processing <b>enormously reduces</b> privacy risk (video stays local, only insights leave), <b>person and vehicle analytics still carries obligations</b> — you are still observing people and their movements, so notice, purpose limitation, data minimisation (send counts, not identities) and lawful use remain necessary; edge is a powerful privacy <i>enabler</i>, not an automatic exemption. Framed correctly, though, the edge AI smart camera is the practical synthesis of this whole series\' ideas — real-time detection, analytics, and resource-constrained on-device deployment — into a genuinely useful, privacy-respecting product pattern, and the definitive lesson in why, and how, to run vision AI at the edge.',
  ],
  equations: [
    { t: 'Edge vs cloud (the choice)', eq: 'cloud camera:  device → stream VIDEO → cloud AI → result\nedge camera:   device → ON-DEVICE AI → send INSIGHTS only\n\nProcess locally; send counts/events, not video.' },
    { t: 'On-device analytics', eq: 'detect(frame) → people/vehicles\ntrack across frames → avoid double-count\ncount / zone-crossing / dwell → insights\n\nAll in real time within the edge COMPUTE/POWER budget.' },
    { t: 'Edge benefits + the trade-off', eq: 'benefits: PRIVACY (video stays), BANDWIDTH (insight ≪ video),\n          LATENCY (no round-trip), OFFLINE (no cloud needed)\n\ntrade-off: edge HW limits model size/accuracy vs cloud GPU\n→ optimise (quantise/prune/accelerate). Analytics still needs\n  privacy care.' },
  ],

  ai: {
    task: 'Detect and analyse people and vehicles on-device in real time (counting, tracking, zone/dwell), sending only insights — an optimised model within the edge compute/power budget.',
    dataset: [
      'A person/vehicle detection model (pretrained, then optimised for the edge). The value is on-device analytics, not new data.',
      'Optimisation (quantisation) can slightly reduce accuracy — validated against the deployment need.',
    ],
    datasetTable: [
      { n: 'Person/vehicle detector (pretrained)', size: 'Large', lic: 'Model terms', use: 'On-device detection' },
      { n: 'Optimised (quantised) model', size: 'Small', lic: '—', use: 'Real-time edge inference' },
      { n: 'Site frames (tuning)', size: 'Some', lic: 'On-site', use: 'Zones/thresholds tuning' },
      { n: 'Insight logs', size: 'Small', lic: 'On-site', use: 'Analytics (counts, not identities)' },
    ],
    preprocess: [
      'Resize/normalise frames for the on-device model.',
      'Optimise the model (quantise/prune) and target the device accelerator.',
      'Define zones/lines and analytics parameters on-device.',
    ],
    pipeline: [
      { name: 'Frame', sub: 'on-device', highlight: true },
      { name: 'Detect', sub: 'person/vehicle', highlight: true },
      { name: 'Track+count', sub: 'analytics' },
      { name: 'Zone/dwell', sub: 'events' },
      { name: 'Insights', sub: 'not video' },
    ],
    archTable: [
      { l: 'Detector', s: 'optimised person/vehicle model', p: 'Real-time on-device detection' },
      { l: 'Optimisation', s: 'quantise/prune/accelerate', p: 'Fit compute/power budget' },
      { l: 'Tracker', s: 'cross-frame association', p: 'Count without duplicates' },
      { l: 'Analytics', s: 'zones/lines/dwell', p: 'Structured insights' },
      { l: 'Uplink', s: 'insights only', p: 'Privacy + low bandwidth' },
    ],
    hyper: [
      { k: 'Model size/precision', v: 'quantised', w: 'Accuracy vs edge budget' },
      { k: 'Input resolution', v: 'edge-fit', w: 'Detail vs speed' },
      { k: 'Confidence/track params', v: 'tuned', w: 'Count accuracy' },
      { k: 'Zones/thresholds', v: 'site-specific', w: 'Meaningful events' },
    ],
    training: [
      'Use a pretrained detector; optimise (quantise/prune) and accelerate for the device.',
      'Validate that the optimised model runs real-time and stays accurate enough.',
      'Tune analytics (zones/tracking) on-site; keep only insights.',
    ],
    metricsIntro: [
      'The metrics are real-time on-device performance (FPS within power budget), analytics accuracy (counts), and the privacy/bandwidth benefits of insights-not-video.',
    ],
    metrics: [
      { m: 'On-device FPS', v: 'real-time', d: 'Within power budget' },
      { m: 'Counting accuracy', v: 'edge-model-dependent', d: 'Analytics quality' },
      { m: 'Bandwidth', v: 'tiny (insights)', d: 'vs video streaming' },
      { m: 'Privacy', v: 'video stays local', d: 'Only insights leave' },
    ],
    chart: { title: 'Edge vs cloud trade-off', unit: '', desc: 'Edge trades some model accuracy for large gains in privacy, bandwidth, latency and offline capability — the edge-AI bargain (illustrative).', bars: [
      { label: 'Privacy (edge)', value: 95 },
      { label: 'Bandwidth (edge)', value: 92 },
      { label: 'Latency (edge)', value: 90 },
      { label: 'Model accuracy (edge)', value: 72 },
    ] },
    inference: { file: 'edge_camera.py', lang: 'python', body: `def analyse(frame, detector, tracker, zones):
    dets = detector.infer(frame)               # ON-DEVICE (optimised model)
    tracks = tracker.update(dets)              # track to avoid double-counting

    insights = {
        "people": sum(t.cls == "person" for t in tracks),
        "vehicles": sum(t.cls == "vehicle" for t in tracks),
        "events": zone_and_line_events(tracks, zones),   # crossings/dwell
    }
    send_insights(insights)                    # send COUNTS/EVENTS, not video
    # Video never leaves the device: privacy, bandwidth, latency, offline.
    # Edge HW limits model size/accuracy; analytics still needs privacy care.` },
    limits: [
      'Edge hardware limits model size/accuracy vs a cloud GPU (the edge trade-off).',
      'Getting a model to run real-time on-device takes real optimisation work.',
      'Person/vehicle analytics still carries privacy obligations (notice, minimisation).',
      'Edge reduces — but does not remove — the responsibilities of observing people.',
    ],
  },

  assembly: [
    { h: 'Run an optimised detector on-device', p: [
      'Deploy a person/vehicle detector on the edge computer, optimised (quantised/accelerated) to run in real time within the compute/power budget.',
    ], warn: 'Edge AI trades model size/accuracy for its locality benefits — expect an accuracy compromise versus a cloud GPU, and real optimisation work. And while processing on-device hugely reduces privacy risk (video stays local), person/vehicle analytics still requires notice, purpose limitation and data minimisation (send counts, not identities).' },
    { h: 'Add on-device analytics', p: [
      'Track, count, and detect zone/line crossings and dwell on the device, producing structured insights.',
    ] },
    { h: 'Send insights, not video', p: [
      'Emit only counts/events/alerts, keeping video local — realising the privacy, bandwidth, latency and offline benefits.',
    ] },
  ],
  steps: [
    { h: 'Detect and analyse on-device, send insights', p: [
      'Run the optimised detector and analytics locally, and send only the resulting counts/events — never the video.',
    ], code: {
      file: 'analyse.py', lang: 'python',
      body: `def analyse(frame, detector, tracker, zones):
    dets = detector.infer(frame)               # ON-DEVICE optimised inference
    tracks = tracker.update(dets)              # associate across frames (count once)
    insights = {
        "people": sum(t.cls == "person" for t in tracks),
        "vehicles": sum(t.cls == "vehicle" for t in tracks),
        "events": zone_and_line_events(tracks, zones),   # crossings / dwell
    }
    send_insights(insights)                    # send INSIGHTS, not video
    return insights                            # video never leaves the device`,
      explain: [
        { ref: 'dets = detector.infer(frame)               # ON-DEVICE optimised inference', txt: 'Detection runs on the camera itself with an optimised model — the essence of edge AI, no cloud round-trip.' },
        { ref: 'tracks = tracker.update(dets)              # associate across frames (count once)', txt: 'Tracking associates detections across frames so each person/vehicle is counted once, not per frame.' },
        { ref: '"events": zone_and_line_events(tracks, zones),   # crossings / dwell', txt: 'Analytics turns tracks into structured events — zone/line crossings and dwell — the useful insight.' },
        { ref: 'send_insights(insights)                    # send INSIGHTS, not video', txt: 'Only the insights leave the device; the video stays local — delivering privacy, low bandwidth, low latency and offline operation.' },
      ],
    } },
    { h: 'Optimise and tune for the device', p: [
      'Optimise the model to hit real-time FPS within the power budget, and tune zones/tracking on-site for accurate insights.',
    ], tip: 'The whole edge value collapses if you send video "just in case" — commit to insights-only egress, and it is what delivers the privacy and bandwidth wins that justify running AI on the camera at all.' },
  ],

  code: [{
    file: 'edge_smart_camera.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Edge AI Smart Camera

Runs person/vehicle analytics ON THE CAMERA ITSELF (no cloud round-trip)
and sends INSIGHTS, not video. An optimised detector + tracking/counting
+ zone/dwell analytics run in real time within the edge compute/power
budget. Benefits: PRIVACY, BANDWIDTH, LATENCY, OFFLINE. Trade-off: edge
HW limits model size/accuracy; analytics still needs privacy care.
"""
class EdgeSmartCamera:
    def __init__(self, detector, tracker, zones, uplink):
        self.detector = detector    # optimised (quantised/accelerated) model
        self.tracker = tracker; self.zones = zones; self.uplink = uplink

    def analyse(self, frame):
        dets = self.detector.infer(frame)          # ON-DEVICE inference
        tracks = self.tracker.update(dets)         # count each object once
        return {
            "people":   sum(t.cls == "person"  for t in tracks),
            "vehicles": sum(t.cls == "vehicle" for t in tracks),
            "events":   zone_and_line_events(tracks, self.zones),  # crossings/dwell
        }

    def run(self, camera):
        for frame in camera.frames():              # frames stay on-device
            insights = self.analyse(frame)
            self.uplink.send(insights)             # INSIGHTS ONLY — never video
            # -> privacy (video local), low bandwidth, low latency, offline.

if __name__ == "__main__":
    cam = EdgeSmartCamera(OptimisedDetector(), Tracker(), ZONES, InsightUplink())
    cam.run(Camera())
    # Edge model < cloud GPU accuracy; send counts not identities; notice/minimise.`,
    explain: [
      { ref: 'self.detector = detector    # optimised (quantised/accelerated) model', txt: 'The detector is optimised to run in real time on the edge device — the core engineering of on-device vision.' },
      { ref: 'dets = self.detector.infer(frame)          # ON-DEVICE inference', txt: 'Inference happens on the camera, so video never needs to be streamed to the cloud to be understood.' },
      { ref: 'tracks = self.tracker.update(dets)         # count each object once', txt: 'Cross-frame tracking ensures accurate counts rather than counting the same object every frame.' },
      { ref: 'self.uplink.send(insights)             # INSIGHTS ONLY — never video', txt: 'Only insights are sent, which is what realises the privacy, bandwidth, latency and offline advantages of edge AI.' },
      { ref: '# Edge model < cloud GPU accuracy; send counts not identities; notice/minimise.', txt: 'The honest trade-off and residual privacy obligations are stated in the code.' },
    ],
  }],

  config: [
    'Configure the optimised on-device detector and accelerator.',
    'Configure tracking/counting and zones/lines/dwell.',
    'Configure insights-only uplink (no video egress).',
    'Configure privacy: notice, minimisation (counts not identities).',
  ],
  calibration: [
    { h: 'Real-time on device', p: [
      'Optimise the model to hit real-time FPS within the power budget; validate accuracy.',
    ] },
    { h: 'Analytics', p: [
      'Tune tracking/zones so counts and events are accurate on-site.',
    ] },
    { h: 'Privacy', p: [
      'Confirm only insights leave; keep video local; minimise data.',
    ] },
  ],
  testing: [
    { step: 'Detect/count people', expect: 'Accurate on-device counts' },
    { step: 'Detect/count vehicles', expect: 'Accurate on-device counts' },
    { step: 'Cross a zone/line', expect: 'Event emitted' },
    { step: 'Check egress', expect: 'Only insights sent; no video' },
    { step: 'Disconnect the network', expect: 'Still analyses (offline) — buffers insights' },
    { step: 'Compare to a cloud model', expect: 'Slightly lower accuracy (edge trade-off)' },
  ],
  output: [
    'On-device person/vehicle counts and events, sent as insights (not video), working privately and offline.',
    { file: 'edge-insights.json', lang: 'json', body: `{
  "people": 7,
  "vehicles": 2,
  "events": [{ "type": "line_crossing", "class": "person", "dir": "in" }],
  "video_sent": false,
  "note": "insights not video: private, low-bandwidth, low-latency, offline"
}` },
    'On-device analytics — people and vehicle counts and a line-crossing event — sent as a tiny insight payload with no video leaving the device: the edge-AI advantages made concrete.',
  ],
  troubleshoot: [
    { sym: 'Too slow on device', cause: 'Model too big', fix: 'Quantise/prune; accelerate; lower resolution' },
    { sym: 'Inaccurate counts', cause: 'Tracking/zones', fix: 'Tune tracking; define zones; adjust confidence' },
    { sym: 'Lower accuracy than cloud', cause: 'Edge trade-off', fix: 'Expected; optimise; accept the bargain' },
    { sym: 'Sends video', cause: 'Egress not restricted', fix: 'Insights-only egress; keep video local' },
    { sym: 'Fails offline', cause: 'Cloud dependency', fix: 'Run analytics on-device; buffer insights' },
    { sym: 'Privacy concern', cause: 'Analytics obligations', fix: 'Notice; minimise (counts not identities); lawful use' },
  ],

  perf: [
    'Optimise (quantise/prune/accelerate) for real-time on-device inference.',
    'Track across frames for accurate counts.',
    'Send insights only — never video.',
    'Accept the edge accuracy trade-off for the locality benefits.',
  ],
  safety: [
    'Person/vehicle analytics carries privacy obligations even on-device — notice, purpose limitation and data minimisation (send counts, not identities).',
    'Edge processing reduces but does not remove responsibility for observing people.',
    'Keep video local; restrict egress to insights.',
    'Comply with applicable surveillance/privacy law.',
  ],
  maintenance: [
    'Re-optimise/update models as hardware and needs change.',
    'Re-tune analytics/zones after camera or layout changes.',
    'Monitor on-device performance and accuracy.',
    'Audit egress and privacy practices.',
  ],
  future: [
    'Add more analytics (flow, occupancy, heatmaps).',
    'Add federated/on-device model updates.',
    'Add stronger accelerators for bigger models.',
    'Add privacy-preserving aggregation across cameras.',
  ],
  faq: [
    { q: 'What makes it "edge" AI?', a: 'It runs the AI on the camera itself rather than streaming video to the cloud to be analysed. It processes frames locally and sends only insights — counts and events — not video.' },
    { q: 'Why is that better than cloud?', a: 'Four concrete benefits: privacy (video never leaves the device), bandwidth (an insight is tiny versus a video stream), latency (instant local decisions, no round-trip), and offline operation (it keeps working without connectivity). A camera is the poster child for all of them.' },
    { q: 'What is the trade-off?', a: 'Edge hardware limits how big and accurate a model you can run compared to a cloud GPU, so an edge camera generally accepts some accuracy compromise for its locality benefits — and getting a model to run real-time on-device takes genuine optimisation (quantisation, pruning, acceleration).' },
    { q: 'Does running on-device solve privacy entirely?', a: 'It helps enormously — video stays local and only insights leave — but person and vehicle analytics still carries obligations: notice, purpose limitation, data minimisation (send counts, not identities), and lawful use. Edge is a powerful privacy enabler, not an automatic exemption.' },
    { q: 'How does it count accurately?', a: 'By tracking detected objects across frames and associating them, so each person or vehicle is counted once rather than every frame, and by defining zones/lines for meaningful crossing and dwell events.' },
  ],
  refs: [
    { t: 'Edge computing / edge AI', u: 'https://en.wikipedia.org/wiki/Edge_computing', s: 'Reference' },
    { t: 'Smart camera', u: 'https://en.wikipedia.org/wiki/Smart_camera', s: 'Reference' },
    { t: 'Model quantization', u: 'https://en.wikipedia.org/wiki/Quantization_(signal_processing)', s: 'Reference' },
    { t: 'Object detection', u: 'https://en.wikipedia.org/wiki/Object_detection', s: 'Reference' },
    { t: 'Privacy by design', u: 'https://en.wikipedia.org/wiki/Privacy_by_design', s: 'Reference' },
  ],
  images: ['cctv', 'neural', 'esp32'],
  imageCaptions: [
    'An edge AI smart camera runs person and vehicle analytics on-device and sends insights, not video.',
    'On-device detection plus tracking and zone analytics turn frames into counts and events locally.',
    'Edge trades some accuracy for privacy, bandwidth, latency and offline operation — the edge-AI bargain.',
  ],
},

];
