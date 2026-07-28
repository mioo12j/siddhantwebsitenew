/* Robotics 091–093. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   091 — Line-Following Delivery Bot
   ══════════════════════════════════════════════════════════════════ */
{
  id: '091',
  domainKey: 'robotics',
  emoji: '🚚', thumb: 'robot',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'A wheeled robot that follows a painted line to carry small loads between fixed points — the simplest reliable form of autonomous indoor delivery.',

  overview: [
    'The hardest part of autonomous navigation is knowing where you are and where to go, and the cheapest, most reliable way to sidestep that problem entirely is to <b>paint the path on the floor</b>. A line-following delivery bot follows a marked line — a strip of tape or paint — from one fixed point to another, carrying a small payload. It needs no map, no GPS, no expensive sensors: the line <i>is</i> the map, and the robot\'s whole job is to stay on it. This is why line following is the foundation of real automated guided vehicles (AGVs) in factories and warehouses, and the ideal first autonomous robot.',
    'The robot senses the line with an array of <b>infrared reflectance sensors</b> pointed at the floor: the line (dark on light, or light on dark) reflects differently from the surrounding floor, so the sensors report where the line sits relative to the robot\'s centre. A control loop turns that error — how far the robot has drifted off the line — into steering corrections by driving its two wheels at different speeds (<b>differential drive</b>): centred, both wheels go forward; drifting left, speed up the left wheel to turn back; drifting right, speed up the right. Done crudely it wobbles; done well, with proportional (or PID) control, it tracks smoothly even through curves.',
    'On top of the follow-the-line core, a delivery bot adds the delivery logic: it follows the line between <b>stations</b> (marked by junctions, tags or stop markers), stops to load/unload, and handles the practicalities — losing the line, reaching a junction, or an obstacle in the way. It is honest that line following is a <b>constrained</b> form of autonomy (it goes only where the line goes, and a dirty or broken line breaks it) and that real AGVs add junction logic, traffic management and safety. But as a smooth, reliable line follower with delivery stops, it is both a genuinely useful little transport robot and the clearest possible introduction to sensing, differential-drive control, and closed-loop robotics.',
  ],
  does: [
    'Follows a marked line from point to point carrying a small load',
    'Senses the line with an IR reflectance array',
    'Steers by differential drive (proportional/PID control)',
    'Tracks smoothly through straights and curves',
    'Stops at stations to load/unload',
    'Handles junctions, lost-line and obstacles',
    'Demonstrates the core of factory AGVs — cheaply',
  ],
  features: [
    'IR line sensing (position/error extraction)',
    'Proportional/PID differential-drive steering',
    'Station stops for delivery',
    'Junction and lost-line handling',
    'Obstacle stop (optional front sensor)',
    'Simple, robust, map-free autonomy',
    'Honest about the limits of line-constrained navigation',
  ],
  applications: [
    { t: 'Indoor material transport', d: 'Carrying small loads along fixed routes (offices, labs, small workshops).' },
    { t: 'AGV learning platform', d: 'The core principle behind factory/warehouse automated guided vehicles.' },
    { t: 'Robotics education', d: 'Sensing, differential drive and closed-loop (PID) control in one build.' },
    { t: 'Fixed-route service robots', d: 'Repeated deliveries between known stations.' },
  ],
  skills: [
    'IR reflectance sensing and line-position extraction',
    'Differential-drive kinematics',
    'Proportional/PID closed-loop control',
    'Junction/station/lost-line state logic',
    'Motor driver and chassis integration',
  ],
  prereq: [
    'The line is the map — no GPS/mapping needed; the job is to stay on it.',
    'Steering is differential drive: wheel-speed difference turns the robot.',
    'Smooth tracking needs proportional/PID control, not bang-bang.',
    'Line following is constrained autonomy: a dirty/broken line breaks it.',
  ],

  parts: ['uno', 'ir_sensor', 'bo_motor', 'l298n', 'li18650', 'hcsr04'],
  extraParts: [
    { name: 'IR sensor array', spec: '5–8 IR reflectance sensors in a row (line position)', qty: 1, price: 300, note: 'More sensors = finer line-position error' },
    { name: 'Chassis + wheels + castor', spec: '2-wheel differential-drive chassis', qty: 1, price: 500 },
    { name: 'Geared DC motors', spec: 'Two matched gear motors', qty: 2, price: 300 },
    { name: 'Payload tray', spec: 'Small load platform', qty: 1, price: 150 },
  ],
  cost: '₹1,500 – ₹2,800',
  libs: ['servo', 'pid', 'preferences'],

  pins: {
    left: [
      { dev: 'IR array', devPin: 'S1..S6', pin: 'A0..A5', sig: 'Line position' },
      { dev: 'Front ultrasonic', devPin: 'TRIG/ECHO', pin: 'D7/D8', sig: 'Obstacle stop' },
    ],
    right: [
      { dev: 'Motor driver L', devPin: 'IN1/IN2/ENA', pin: 'D2/D4/D5', sig: 'Left wheel' },
      { dev: 'Motor driver R', devPin: 'IN3/IN4/ENB', pin: 'D3/D9/D6', sig: 'Right wheel' },
      { dev: 'Battery', devPin: '+', pin: 'VIN', sig: 'Power' },
      { dev: 'Station LED/buzzer', devPin: 'IN', pin: 'D10', sig: 'Arrived' },
    ],
  },
  wiringNotes: [
    'Mount the IR array low and centred at the front, looking straight down at the floor/line.',
    'Wire the two motors through an H-bridge driver; ENA/ENB take PWM for speed control.',
    'Add a front ultrasonic sensor for an obstacle stop.',
    'Keep the wheels matched; mismatch shows up as drift and is corrected in software/trim.',
    'Power motors and logic sensibly (motor supply vs logic supply); common ground.',
  ],

  block: { columns: [
    { label: 'Sense line', edge: 'right', blocks: [
      { name: 'IR array', sub: 'position', highlight: true },
      { name: 'Error', sub: 'off-centre' },
    ] },
    { label: 'Control', edge: 'right', blocks: [
      { name: 'PID', sub: 'steer', highlight: true },
      { name: 'Diff drive', sub: 'wheel speeds' },
    ] },
    { label: 'Act', edge: 'right', blocks: [
      { name: 'Left motor', sub: 'PWM' },
      { name: 'Right motor', sub: 'PWM' },
    ] },
    { label: 'Deliver', edge: 'none', blocks: [
      { name: 'Junction/station', sub: 'stop' },
      { name: 'Obstacle', sub: 'halt' },
    ] },
  ] },
  flow: [
    { t: 'Read IR array → line position/error', k: 'start' },
    { t: 'Obstacle ahead?', k: 'dec', yes: 'Stop and wait', no: 'PID: compute steering' },
    { t: 'Stop and wait', k: 'io' },
    { t: 'PID: compute steering', k: 'proc' },
    { t: 'Set differential wheel speeds', k: 'io' },
    { t: 'At station/junction?', k: 'dec', yes: 'Stop / deliver / turn', no: 'Continue following' },
    { t: 'Stop / deliver / turn', k: 'io' },
    { t: 'Continue following', k: 'end', back: 'Read IR array → line position/error' },
  ],

  principle: [
    'Autonomous navigation is hard because a robot generally does not know where it is; line following makes it easy by <b>encoding the route into the environment</b>. The line on the floor is a pre-computed, always-available path, so the robot never needs a map, localisation, or a plan — it needs only to answer one question, continuously: "where is the line relative to me?", and correct. That reduction of a hard problem (navigate) to a simple one (stay centred on a line) is exactly why line-guided AGVs remain the workhorses of factories and warehouses, and why line following is the canonical first autonomous robot.',
    'Answering the question is a <b>sensing</b> task. An array of infrared reflectance sensors looks down at the floor; the line and the floor reflect IR differently (a dark line absorbs, a light floor reflects, or vice versa), so each sensor reports line or not-line. From the pattern across the array the robot computes the <b>line position</b> — a weighted centre of the sensors seeing the line — and hence the <b>error</b>: how far, and which way, the line has drifted from the robot\'s centre. More sensors give finer error resolution and smoother control; the error signal is the entire input to the controller.',
    'Correcting is a <b>differential-drive control</b> task. With two independently-driven wheels, the robot turns by driving them at different speeds: equal speeds go straight, faster-left turns right, faster-right turns left. The naive approach — full-left or full-right depending on which side the line is on — produces a violent zig-zag. The good approach is <b>proportional control</b> (the heart of PID): steer in proportion to the error, so a small drift gets a gentle correction and a large drift a strong one, which tracks the line smoothly. Adding a derivative term damps overshoot (anticipating the approaching correction) and an integral term removes steady drift; a well-tuned PID line follower glides through curves that make a bang-bang robot flail. This closed loop — sense error, steer proportionally, repeat fast — is the same feedback principle behind almost all robot control.',
    'A <b>delivery</b> bot wraps navigation logic around the follower. It recognises <b>stations</b> and <b>junctions</b> — marked by a cross-line, a tag, or a distinctive sensor pattern — to know where it is <i>along</i> the line, stops to load and unload, and chooses turns at junctions to reach the right destination. It handles the failure modes honestly: a <b>lost line</b> (all sensors off the line) triggers a search or stop rather than a bolt into the unknown, and an <b>obstacle</b> ahead triggers a stop. The design is candid that this is <b>constrained autonomy</b> — the robot goes only where the line goes, a dirty, worn, or broken line breaks it, and real AGVs layer on junction routing, fleet traffic management, and safety systems. But within those honest limits it is both a genuinely useful point-to-point transport robot and the clearest hands-on lesson in sensing, differential-drive kinematics, and closed-loop control that robotics has to offer.',
  ],
  equations: [
    { t: 'Line-position error', eq: 'For an array of N sensors at positions x_i (centre = 0),\nwith s_i = 1 if sensor i sees the line:\n\n  error = ( Σ x_i·s_i ) / ( Σ s_i )     (weighted line centre)\n\nerror = 0 centred; sign/magnitude = direction/amount of drift.\nAll sensors off the line → LINE LOST → search/stop.' },
    { t: 'Proportional (PID) steering', eq: 'steer = Kp·error + Ki·∫error dt + Kd·d(error)/dt\n\nSteer in proportion to drift → smooth tracking.\nKd damps overshoot on curves; Ki removes steady bias.' },
    { t: 'Differential-drive mixing', eq: 'left_pwm  = base_speed − steer\nright_pwm = base_speed + steer\n\nEqual → straight; steer>0 → turn one way, <0 → the other.\nSlow base_speed on tight curves to avoid overshoot.' },
  ],

  robotics: {
    mechanical: [
      'Two-wheel differential-drive chassis with a front IR sensor array and a rear castor for balance.',
      'Motors matched and mounted rigidly; wheels aligned so the robot runs straight at equal PWM.',
      'IR array mounted low and centred at the front, looking straight down at a fixed height above the floor.',
      'A small payload tray over the chassis centre of mass so loads do not upset steering.',
    ],
    motion: [
      'Motion is pure differential drive: the two wheels\' speed difference sets the turn rate while their average sets forward speed. Steering the line follower is nothing more than adding a PID steering term to one wheel and subtracting it from the other.',
      'On straights the error is near zero and both wheels run at base speed; on curves the sustained error drives a steady speed difference that arcs the robot around the bend; at a sharp junction the base speed is reduced so the loop has time to react.',
    ],
    motionTable: [
      { s: 'Line centred', l: 'Base speed', r: 'Base speed', o: 'Drive straight' },
      { s: 'Line drifts left', l: 'Faster', r: 'Slower', o: 'Steer left (back to line)' },
      { s: 'Line drifts right', l: 'Slower', r: 'Faster', o: 'Steer right (back to line)' },
      { s: 'Sharp left junction', l: 'Reverse/stop', r: 'Forward', o: 'Pivot left' },
      { s: 'Line lost', l: 'Stop/search', r: 'Stop/search', o: 'Recover, don\'t bolt' },
      { s: 'Obstacle / station', l: 'Stop', r: 'Stop', o: 'Halt / deliver' },
    ],
    sensors: [
      'IR reflectance array (5–8 sensors): reports line position/error under the robot.',
      'Front ultrasonic (optional): obstacle stop before collision.',
      'Junction/station markers: cross-lines or tags detected as distinctive array patterns.',
    ],
    actuators: [
      'Two geared DC motors via an H-bridge driver, PWM-controlled for speed. The controller sets each wheel\'s PWM from base speed ± the PID steering term.',
      'A buzzer/LED signals arrival at a station; a servo can actuate a simple load release if fitted.',
    ],
    kinematics: {
      text: [
        'Differential-drive kinematics relate the two wheel speeds to the robot\'s forward and turning motion, which is all the steering law needs.',
      ],
      eq: `v     = (v_R + v_L) / 2          # forward speed (avg of wheels)
omega = (v_R − v_L) / L          # turn rate (difference / wheel base)

Steering law:
  v_L = base − steer,   v_R = base + steer
  → omega ∝ steer ∝ line error   (turn toward the line)`,
    },
  },

  assembly: [
    { h: 'Build the differential-drive chassis', p: [
      'Mount two matched gear motors and wheels with a castor, the H-bridge driver, battery, and the IR array low and centred at the front.',
      'Verify the robot drives straight at equal PWM; trim any mismatch.',
    ], warn: 'A low, fixed, centred IR array at a constant height is essential — a wobbling or angled array gives a noisy error signal that no controller can smooth.' },
    { h: 'Calibrate line sensing', p: [
      'Calibrate the IR array to the line/floor contrast and extract a clean line-position error.',
    ] },
    { h: 'Tune the PID and add delivery logic', p: [
      'Tune Kp/Ki/Kd for smooth tracking, then add junction/station stops and lost-line/obstacle handling.',
    ] },
  ],
  steps: [
    { h: 'Extract line error and steer with PID', p: [
      'Compute the weighted line-position error from the IR array and drive the wheels with base speed ± a PID steering term.',
    ], code: {
      file: 'line_follow.ino', lang: 'cpp',
      body: `const int N = 6;
const int SPIN[N] = {A0,A1,A2,A3,A4,A5};
const int W[N] = {-5,-3,-1, 1, 3, 5};   // sensor positions (centre 0)

float Kp=8, Ki=0.0, Kd=40, integ=0, prevErr=0;
const int BASE = 140;                   // base PWM

// Weighted line-position error; returns 999 if line lost.
float lineError(){
  long num=0, den=0;
  for (int i=0;i<N;i++){
    int on = analogRead(SPIN[i]) < 500;  // sees the line?
    if (on){ num += W[i]; den += 1; }
  }
  if (den==0) return 999;                // LINE LOST
  return (float)num/den;
}

void loop(){
  float e = lineError();
  if (e==999){ recoverLostLine(); return; }
  integ += e;
  float steer = Kp*e + Ki*integ + Kd*(e-prevErr);
  prevErr = e;
  drive(BASE - steer, BASE + steer);     // diff-drive: turn toward line
}`,
      explain: [
        { ref: 'return (float)num/den;                // weighted line centre', txt: 'The error is the weighted centre of the sensors seeing the line — a smooth, signed measure of how far and which way the robot has drifted.' },
        { ref: 'if (den==0) return 999;                // LINE LOST', txt: 'When no sensor sees the line the robot recovers deliberately instead of bolting into the unknown — honest handling of a broken/dirty line.' },
        { ref: 'float steer = Kp*e + Ki*integ + Kd*(e-prevErr);', txt: 'Proportional-plus-derivative steering: correct in proportion to drift and damp overshoot, which is what tracks curves smoothly instead of zig-zagging.' },
        { ref: 'drive(BASE - steer, BASE + steer);     // diff-drive: turn toward line', txt: 'Differential mixing turns the single steering term into two wheel speeds — the essence of differential-drive control.' },
      ],
    } },
    { h: 'Handle junctions, stations and obstacles', p: [
      'Detect junction/station markers to stop, deliver or choose a turn, and stop for obstacles — the delivery logic on top of the follower.',
    ], tip: 'Slow the base speed near junctions and on tight curves — a follower that is too fast overshoots the line before the loop can react.' },
  ],

  code: [{
    file: 'delivery_bot.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Line-Following Delivery Bot

   Follows a marked line by differential-drive PID steering, carrying a
   small load between stations. Detects junctions/stations, stops for
   obstacles, and recovers deliberately if the line is lost.
   Constrained (line-guided) autonomy — the AGV principle, cheaply.
   ══════════════════════════════════════════════════════════════════ */

const int N = 6;
const int SPIN[N] = {A0,A1,A2,A3,A4,A5};
const int W[N] = {-5,-3,-1,1,3,5};
const int BASE = 140, TRIG=7, ECHO=8;
float Kp=8, Kd=40, prevErr=0;

int readArray(int* on){                  // fill on[], return count seeing line
  int c=0;
  for (int i=0;i<N;i++){ on[i]=analogRead(SPIN[i])<500; c+=on[i]; }
  return c;
}
float lineError(int* on){
  long num=0,den=0;
  for (int i=0;i<N;i++) if(on[i]){ num+=W[i]; den++; }
  return den? (float)num/den : 999;
}
bool junction(int count){ return count>=N-1; }   // most sensors on = cross-line
long obstacleCm(){ /* HC-SR04 ping */ return pingCm(TRIG,ECHO); }

void drive(int l,int r){ setMotor(LEFT,l); setMotor(RIGHT,r); }

void setup(){ motorInit(); Serial.begin(115200); }

void loop(){
  if (obstacleCm() < 15){ drive(0,0); return; }    // obstacle: stop & wait

  int on[N]; int count = readArray(on);
  float e = lineError(on);

  if (junction(count)){                            // station/junction
    drive(0,0); handleStation(); return;           // stop / deliver / turn
  }
  if (e==999){ recoverLostLine(); return; }        // line lost: search, don't bolt

  float steer = Kp*e + Kd*(e-prevErr);             // PID steering
  prevErr = e;
  int base = fabs(e)>3 ? BASE-40 : BASE;           // slow on tight drift/curves
  drive(base - steer, base + steer);               // differential drive
}`,
    explain: [
      { ref: 'if (obstacleCm() < 15){ drive(0,0); return; }    // obstacle: stop & wait', txt: 'Safety first: an obstacle ahead halts the robot before it collides, checked every loop.' },
      { ref: 'bool junction(int count){ return count>=N-1; }   // most sensors on = cross-line', txt: 'A junction/station is recognised when most sensors see the line at once (a cross-line), telling the robot where it is along the route.' },
      { ref: 'if (e==999){ recoverLostLine(); return; }        // line lost: search, don\'t bolt', txt: 'A lost line triggers a deliberate recovery, not a dash into the unknown — honest handling of the follower\'s main failure mode.' },
      { ref: 'float steer = Kp*e + Kd*(e-prevErr);             // PID steering', txt: 'Proportional-derivative steering keeps tracking smooth and damped through curves.' },
      { ref: 'int base = fabs(e)>3 ? BASE-40 : BASE;           // slow on tight drift/curves', txt: 'Slowing the base speed on large errors gives the loop time to react on tight curves, preventing overshoot.' },
    ],
  }],

  config: [
    'Configure the IR array pins, line/floor threshold and sensor weights.',
    'Configure base speed and PID gains (Kp/Ki/Kd).',
    'Configure junction/station detection and delivery actions.',
    'Configure obstacle-stop distance and lost-line recovery.',
  ],
  calibration: [
    { h: 'IR array', p: [
      'Calibrate the line/floor threshold under the actual lighting so each sensor cleanly reports line vs floor.',
    ] },
    { h: 'PID', p: [
      'Raise Kp until it tracks but starts to wobble, then add Kd to damp; keep Ki small. Slow the base speed on curves.',
    ] },
    { h: 'Drive trim', p: [
      'Trim wheel PWM so the robot runs straight at zero error, removing mechanical bias.',
    ] },
  ],
  testing: [
    { step: 'Place on a straight line', expect: 'Tracks straight without wobble' },
    { step: 'Introduce a gentle curve', expect: 'Follows smoothly (PID)' },
    { step: 'Add a sharp turn/junction', expect: 'Detects junction; turns/stops correctly' },
    { step: 'Lift off the line', expect: 'Line-lost recovery — does not bolt' },
    { step: 'Place an obstacle ahead', expect: 'Stops and waits' },
    { step: 'Load the tray', expect: 'Delivers between stations reliably' },
  ],
  output: [
    'A robot that follows the line smoothly, stops at stations to deliver, and handles junctions, lost line and obstacles.',
    { file: 'follower-state.txt', lang: 'plain', body: `line_error: -1.0   (slightly left)
steer:      -48
left_pwm:   188   right_pwm: 92
state:      FOLLOWING
next:       station B (junction in 0.4 m)` },
    'The robot is a touch left of the line and steering back smoothly, approaching station B — the closed loop at work.',
  ],
  troubleshoot: [
    { sym: 'Zig-zags / wobbles', cause: 'Kp too high / no Kd / too fast', fix: 'Lower Kp, add Kd, reduce base speed' },
    { sym: 'Drifts off on curves', cause: 'Too fast / Kp too low', fix: 'Slow on curves; raise Kp; add more sensors' },
    { sym: 'Veers at zero error', cause: 'Wheel mismatch', fix: 'Trim wheel PWM; match motors' },
    { sym: 'Loses line often', cause: 'Threshold/lighting/array height', fix: 'Recalibrate threshold; fix array height; shield ambient light' },
    { sym: 'Misses junctions', cause: 'Detection logic/speed', fix: 'Tune junction pattern; slow near junctions' },
  ],

  perf: [
    'Extract a smooth weighted line error; more sensors = finer control.',
    'Proportional-plus-derivative steering for smooth curve tracking.',
    'Slow the base speed on curves/junctions to avoid overshoot.',
    'Recover a lost line deliberately; stop for obstacles.',
  ],
  safety: [
    'Keep speeds modest indoors; a fast robot that loses the line can collide or fall.',
    'Add an obstacle stop so the robot halts rather than pushing into people/objects.',
    'Secure the payload so it cannot shift and upset steering or fall off.',
    'This is constrained autonomy — do not rely on it where a broken line could cause harm without a safe fallback.',
  ],
  maintenance: [
    'Keep the line clean and unbroken; a worn line degrades tracking.',
    'Clean the IR array and re-calibrate for lighting/floor changes.',
    'Check wheels/motors for wear that introduces drift.',
    'Re-tune PID if speed, load or surface changes.',
  ],
  future: [
    'Add encoders for odometry and precise station positioning.',
    'Add junction routing (choose turns to reach a named destination).',
    'Add fleet/traffic management for multiple bots on shared lines.',
    'Upgrade to magnetic-tape or camera-based line following for robustness.',
  ],
  faq: [
    { q: 'Why follow a line instead of navigating freely?', a: 'Because the line encodes the route into the environment, so the robot needs no map, localisation or planning — just "stay on the line". It is the cheapest reliable autonomy and the principle behind factory AGVs.' },
    { q: 'Why use PID rather than just turning left/right?', a: 'Bang-bang steering (full-left or full-right) makes the robot zig-zag violently. Proportional control steers in proportion to the drift — gentle for small errors, strong for large — and derivative damping tracks curves smoothly.' },
    { q: 'What is differential drive?', a: 'Steering by driving two wheels at different speeds: equal for straight, faster on one side to turn. The steering term is added to one wheel and subtracted from the other.' },
    { q: 'What happens if it loses the line?', a: 'It recovers deliberately — searching for the line or stopping — rather than bolting off in a random direction. A dirty or broken line is the follower\'s main failure mode and must be handled honestly.' },
    { q: 'Is this how real AGVs work?', a: 'The core is the same — many industrial AGVs follow lines or magnetic tape. Real systems add junction routing, fleet traffic management and safety systems on top of the same follow-the-guide principle.' },
  ],
  refs: [
    { t: 'Automated guided vehicle', u: 'https://en.wikipedia.org/wiki/Automated_guided_vehicle', s: 'Reference' },
    { t: 'Line-following robot', u: 'https://en.wikipedia.org/wiki/Robot#Line-following', s: 'Reference' },
    { t: 'PID controller', u: 'https://en.wikipedia.org/wiki/PID_controller', s: 'Reference' },
    { t: 'Differential wheeled robot', u: 'https://en.wikipedia.org/wiki/Differential_wheeled_robot', s: 'Reference' },
    { t: 'Infrared reflectance sensing', u: 'https://en.wikipedia.org/wiki/Photodetector', s: 'Reference' },
  ],
  images: ['robot', 'motor', 'battery'],
  imageCaptions: [
    'A line-following delivery bot turns a painted path into map-free autonomy — the AGV principle in its simplest form.',
    'An IR reflectance array reads the line\'s position, and differential-drive PID steering keeps the robot centred.',
    'Two geared motors through an H-bridge provide the differential drive that steers by wheel-speed difference.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   092 — Obstacle-Avoiding Rover
   ══════════════════════════════════════════════════════════════════ */
{
  id: '092',
  domainKey: 'robotics',
  emoji: '🤖', thumb: 'robot',
  difficulty: 'Beginner',
  hours: '8–14 hours', iso8601: 'PT12H',
  tagline: 'A rover that drives itself around a room, sensing obstacles ahead and steering toward the clearest path — reactive autonomy without a map.',

  overview: [
    'The simplest form of free-roaming autonomy is not to plan a route but to <b>react</b>: drive forward, and whenever something is in the way, turn toward the clearer side. An obstacle-avoiding rover does exactly that — it wanders a space on its own, using a distance sensor to detect what is ahead and steering around it — and in doing so it demonstrates the foundation of mobile robotics: sense the world, decide, and act, in a tight loop, fast enough to stay out of trouble. No map, no localisation; just continuous reaction to what the sensors see right now.',
    'The rover measures distance ahead with an <b>ultrasonic</b> (or time-of-flight) sensor, usually mounted on a small <b>servo</b> so it can look left and right as well as straight ahead. The behaviour is a state machine: while the path ahead is clear, drive forward; when an obstacle comes within a threshold, stop, <b>scan</b> left and right to compare clearances, and turn toward the more open direction before resuming. This "sense–scan–steer" reaction, repeated many times a second, lets the rover thread its way around furniture, walls and people without ever knowing where it is.',
    'It is the ideal first mobile robot because it teaches the whole reactive-autonomy loop honestly and cheaply, and its limits are as instructive as its behaviour: a purely reactive rover can get stuck in corners or oscillate between two obstacles (it has no memory or plan), ultrasonic sensing has blind spots and struggles with soft or angled surfaces, and it avoids obstacles rather than navigating <i>to</i> a goal. Real autonomous robots add mapping, localisation and path planning on top. But as a self-driving, obstacle-avoiding rover built on differential drive and a scanning distance sensor, it is both a satisfying autonomous machine and the clearest introduction to the sense–decide–act loop at the heart of all robotics.',
  ],
  does: [
    'Drives itself around a space avoiding obstacles',
    'Measures distance ahead with an ultrasonic/ToF sensor',
    'Scans left/right (servo) to compare clearances',
    'Steers toward the more open direction',
    'Runs a fast sense–decide–act reaction loop',
    'Needs no map or localisation (reactive autonomy)',
    'Demonstrates the foundation of mobile robotics',
  ],
  features: [
    'Ultrasonic distance sensing (scanning)',
    'Reactive obstacle-avoidance state machine',
    'Differential-drive steering',
    'Stuck/oscillation handling (basic)',
    'Adjustable stop distance and turn behaviour',
    'Cheap, robust first autonomous robot',
    'Honest about the limits of purely reactive navigation',
  ],
  applications: [
    { t: 'Robotics education', d: 'The sense–decide–act loop and reactive autonomy in one build.' },
    { t: 'Roaming / patrol demos', d: 'A robot that explores a space on its own.' },
    { t: 'Behaviour-based robotics', d: 'A base for layered reactive behaviours (wander, avoid, seek).' },
    { t: 'Sensor/actuator integration', d: 'Learning distance sensing, servos and differential drive together.' },
  ],
  skills: [
    'Ultrasonic/ToF distance sensing (and scanning with a servo)',
    'Reactive state-machine behaviour design',
    'Differential-drive steering',
    'Handling reactive failure modes (stuck/oscillation)',
    'Sensor–actuator loop timing',
  ],
  prereq: [
    'Reactive autonomy: no map — just sense, decide, act, fast.',
    'Scan left/right to choose the clearer direction, not just detect ahead.',
    'The loop must be fast enough to stop/steer before collision.',
    'Purely reactive robots can get stuck/oscillate — handle it honestly.',
  ],

  parts: ['uno', 'hcsr04', 'sg90', 'bo_motor', 'l298n', 'li18650'],
  extraParts: [
    { name: 'Ultrasonic sensor', spec: 'HC-SR04 (or VL53L0X ToF) distance ahead', qty: 1, price: 120, note: 'Mount on a servo to scan' },
    { name: 'Scan servo', spec: 'SG90 to pan the sensor left/right', qty: 1, price: 120 },
    { name: 'Chassis + motors + wheels', spec: '2-wheel differential-drive rover', qty: 1, price: 700 },
    { name: 'Battery', spec: 'Li-ion pack + holder', qty: 1, price: 300 },
  ],
  cost: '₹1,400 – ₹2,600',
  libs: ['servo', 'preferences'],

  pins: {
    left: [
      { dev: 'Ultrasonic', devPin: 'TRIG/ECHO', pin: 'D9/D10', sig: 'Distance ahead' },
      { dev: 'Scan servo', devPin: 'PWM', pin: 'D11', sig: 'Pan sensor' },
    ],
    right: [
      { dev: 'Motor driver L', devPin: 'IN1/IN2/ENA', pin: 'D2/D4/D5', sig: 'Left wheel' },
      { dev: 'Motor driver R', devPin: 'IN3/IN4/ENB', pin: 'D3/D7/D6', sig: 'Right wheel' },
      { dev: 'Battery', devPin: '+', pin: 'VIN', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Mount the ultrasonic sensor on the scan servo at the front, level and looking ahead.',
    'Wire the two motors through an H-bridge; ENA/ENB take PWM for speed.',
    'Keep the sensor clear of the chassis so it does not see the robot itself.',
    'Power motors and logic sensibly with a common ground.',
    'Balance the rover so it does not tip when it stops/turns quickly.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Ultrasonic', sub: 'distance', highlight: true },
      { name: 'Servo scan', sub: 'L/R' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'Clear ahead?', sub: 'threshold', highlight: true },
      { name: 'Choose side', sub: 'more open' },
    ] },
    { label: 'Act', edge: 'right', blocks: [
      { name: 'Forward', sub: 'if clear' },
      { name: 'Turn', sub: 'to open side' },
    ] },
    { label: 'Recover', edge: 'none', blocks: [
      { name: 'Stuck?', sub: 'back+turn' },
      { name: 'Loop fast', sub: 'react' },
    ] },
  ] },
  flow: [
    { t: 'Measure distance ahead', k: 'start' },
    { t: 'Obstacle within threshold?', k: 'dec', yes: 'Stop + scan L/R', no: 'Drive forward' },
    { t: 'Drive forward', k: 'io', back: 'Measure distance ahead' },
    { t: 'Stop + scan L/R', k: 'proc' },
    { t: 'Which side is clearer?', k: 'dec', yes: 'Turn toward open side', no: 'Both blocked → back up + turn' },
    { t: 'Turn toward open side', k: 'io' },
    { t: 'Both blocked → back up + turn', k: 'io' },
    { t: 'Resume', k: 'end', back: 'Measure distance ahead' },
  ],

  principle: [
    'There are two ways to make a robot move through a space without hitting things: <b>plan</b> a route (which needs a map and localisation) or <b>react</b> to what is immediately sensed. Reactive navigation is the simpler and older idea, and it is remarkably capable: a robot that simply drives forward and turns away from whatever is close can explore a cluttered room indefinitely without ever knowing where it is. This rover is the canonical reactive robot, and its value is that it demonstrates the <b>sense–decide–act loop</b> — the beating heart of all robotics — in its purest, most visible form.',
    'The <b>sense</b> stage measures the world with a distance sensor. An ultrasonic sensor emits a pulse and times its echo to gauge how far away the nearest surface ahead is; a time-of-flight laser does the same with light. Crucially, one forward reading is not enough to <i>choose</i> a direction, so the sensor is usually mounted on a <b>servo</b> that pans it left and right — letting the rover build a coarse picture of where the space is open. This scanning is what turns blind "something ahead" detection into a decision between alternatives.',
    'The <b>decide</b> stage is a small <b>state machine</b>. While the forward distance exceeds a threshold, the decision is trivial: keep driving. When an obstacle comes within the threshold, the rover stops, scans left and right, compares the clearances, and decides to turn toward the <b>more open</b> side. If both sides are blocked, it backs up and turns — a recovery from a dead end. The whole intelligence is a few rules over the sensed distances, and its elegance is that complex-looking wandering emerges from simple reactions. The <b>act</b> stage executes the decision through differential drive: forward when clear, a pivot toward the open side when not, exactly as in any two-wheeled robot.',
    'What makes this an <i>honest</i> teaching robot is that its limitations are as clear as its behaviour, and they motivate everything more advanced. Because it is <b>purely reactive</b> — no map, no memory, no goal — it can get <b>stuck</b> in a corner or <b>oscillate</b> between two obstacles, repeating the same reaction forever; basic recovery (back up, turn a random extra amount) mitigates but does not solve this, because the real fix is memory and planning. Ultrasonic sensing has its own honest flaws: <b>blind spots</b>, poor returns from soft or steeply angled surfaces, and a wide beam that blurs fine detail. And fundamentally it <b>avoids</b> obstacles rather than navigating <i>to</i> a goal — going somewhere specific needs localisation and path planning layered on top. Those limits are precisely why real autonomous robots add mapping (SLAM) and planning. But as a first robot, the obstacle-avoiding rover delivers the essential lesson intact: a fast, tight sense–decide–act loop is enough to produce genuine autonomous behaviour, and everything else in mobile robotics is built on that foundation.',
  ],
  equations: [
    { t: 'Ultrasonic distance', eq: 'distance = (echo_time × speed_of_sound) / 2\n\n  ≈ echo_time_µs / 58   → distance in cm\n\n(÷2 because the pulse travels out AND back.)' },
    { t: 'Reactive decision', eq: 'if forward > D_stop:            drive forward\nelse:\n  scan left, right\n  if max(left, right) > D_stop: turn toward the more open side\n  else:                        back up, then turn (dead end)\n\nComplex wandering emerges from these few rules.' },
    { t: 'Loop-rate vs stopping', eq: 'To stop before hitting an obstacle:\n\n  D_stop  >  v × (t_loop + t_react)\n\nThe faster the rover, the larger the stop distance and the\nfaster the loop must run. Reactive safety = fast loop.' },
  ],

  robotics: {
    mechanical: [
      'Two-wheel differential-drive chassis with a castor, an H-bridge driver and battery.',
      'A scan servo at the front carries the ultrasonic sensor, mounted level and clear of the chassis.',
      'Low centre of mass so the rover does not tip when it stops or pivots quickly.',
    ],
    motion: [
      'Motion is differential drive: forward with equal wheel speeds, and turns by pivoting (one wheel forward, one back or stopped) toward the open side.',
      'The rover alternates between a fast forward "cruise" while clear and discrete stop–scan–turn manoeuvres when blocked, rather than steering continuously like a line follower.',
    ],
    motionTable: [
      { s: 'Path clear', l: 'Forward', r: 'Forward', o: 'Cruise ahead' },
      { s: 'Obstacle, right clearer', l: 'Forward', r: 'Reverse/stop', o: 'Pivot right' },
      { s: 'Obstacle, left clearer', l: 'Reverse/stop', r: 'Forward', o: 'Pivot left' },
      { s: 'Both sides blocked', l: 'Reverse', r: 'Reverse', o: 'Back up (dead end)' },
      { s: 'After backing up', l: 'Forward', r: 'Reverse', o: 'Turn away and retry' },
      { s: 'Scanning', l: 'Stop', r: 'Stop', o: 'Hold while servo pans' },
    ],
    sensors: [
      'Ultrasonic (or ToF) distance sensor on a scan servo: forward distance plus left/right clearances.',
      'Optional side/rear sensors or bump switches for blind-spot and contact backup.',
    ],
    actuators: [
      'Two geared DC motors via an H-bridge, PWM-controlled, providing forward drive and pivots.',
      'A servo pans the distance sensor to scan left and right so the rover can choose the more open direction.',
    ],
    kinematics: {
      text: [
        'The rover uses the same differential-drive relations as any two-wheeled robot; here the turn is usually a discrete pivot rather than a continuous arc.',
      ],
      eq: `v     = (v_R + v_L)/2      # forward speed
omega = (v_R − v_L)/L      # turn rate

Pivot to open side:
  turn right:  v_L = +s, v_R = −s   (spin in place)
  turn left:   v_L = −s, v_R = +s`,
    },
  },

  assembly: [
    { h: 'Build the rover and scanner', p: [
      'Assemble the differential-drive chassis, mount the H-bridge and battery, and put the ultrasonic sensor on the scan servo at the front, level and clear of the body.',
    ], warn: 'Keep the sensor clear of the chassis and level — if it can see the robot\'s own frame or the floor, its distance readings will be wrong and the rover will behave erratically.' },
    { h: 'Verify sensing and drive', p: [
      'Confirm the distance readings are sane across the range and that the rover drives straight and pivots cleanly.',
    ] },
    { h: 'Tune the avoidance behaviour', p: [
      'Set the stop distance for the speed, tune scan angles/turn amounts, and add stuck/oscillation recovery.',
    ] },
  ],
  steps: [
    { h: 'Sense, scan and decide', p: [
      'Drive forward while clear; when an obstacle is within the stop distance, scan left and right and turn toward the more open side (or back up if both are blocked).',
    ], code: {
      file: 'avoid.ino', lang: 'cpp',
      body: `#include <Servo.h>
Servo scan;
const int D_STOP = 25;                 // cm

long ping();                           // HC-SR04 distance ahead

long look(int angle){                  // pan sensor, then measure
  scan.write(angle); delay(180);
  long d = ping(); scan.write(90);     // recentre
  return d;
}

void loop(){
  long ahead = ping();
  if (ahead > D_STOP){ drive(FWD, FWD); return; }   // clear: cruise

  drive(0,0);                          // obstacle: stop
  long left  = look(150);
  long right = look(30);

  if (left < D_STOP && right < D_STOP){
    drive(REV, REV); delay(300);       // dead end: back up
    pivot(random(0,2) ? LEFT : RIGHT); // turn away
  } else if (left > right){
    pivot(LEFT);                       // steer to the more open side
  } else {
    pivot(RIGHT);
  }
}`,
      explain: [
        { ref: 'if (ahead > D_STOP){ drive(FWD, FWD); return; }   // clear: cruise', txt: 'While the path ahead is clear the decision is trivial — keep driving. Most of the loop is this fast forward cruise.' },
        { ref: 'long left  = look(150);\n  long right = look(30);', txt: 'When blocked, the sensor pans to compare left and right clearances — turning blind detection into a choice between directions.' },
        { ref: 'if (left < D_STOP && right < D_STOP){', txt: 'If both sides are blocked the rover recognises a dead end and backs up before turning — basic recovery from getting boxed in.' },
        { ref: 'pivot(LEFT);                       // steer to the more open side', txt: 'The core reaction: turn toward the more open side. Complex wandering emerges from this simple rule.' },
      ],
    } },
    { h: 'Handle stuck/oscillation and keep the loop fast', p: [
      'Add recovery for getting stuck or oscillating (e.g. a random extra turn, or backing up further after repeated blocks), and keep the loop fast enough to stop in time.',
    ], tip: 'Match stop distance to speed: the faster the rover, the sooner it must react. If it clips obstacles, either slow down or increase the stop distance — reactive safety is a fast loop plus enough margin.' },
  ],

  code: [{
    file: 'obstacle_rover.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Obstacle-Avoiding Rover

   Reactive autonomy: drive forward while clear; when blocked, scan
   left/right and steer toward the more open side; back up from dead
   ends. A fast sense-decide-act loop — the foundation of mobile
   robotics — with honest handling of stuck/oscillation.
   ══════════════════════════════════════════════════════════════════ */

#include <Servo.h>
Servo scan;
const int D_STOP = 25, TRIG=9, ECHO=10;
int blockedStreak = 0;                  // detect being stuck

long ping(){
  digitalWrite(TRIG,LOW); delayMicroseconds(2);
  digitalWrite(TRIG,HIGH); delayMicroseconds(10); digitalWrite(TRIG,LOW);
  long us = pulseIn(ECHO, HIGH, 30000);
  return us ? us/58 : 400;              // cm; 400 = nothing in range
}
long look(int a){ scan.write(a); delay(180); long d=ping(); scan.write(90); return d; }

void drive(int l,int r){ setMotor(LEFT,l); setMotor(RIGHT,r); }
void pivot(int dir){ dir==LEFT ? drive(-180,180) : drive(180,-180); delay(300); }

void setup(){ scan.attach(11); scan.write(90); motorInit(); }

void loop(){
  long ahead = ping();

  if (ahead > D_STOP){                  // clear: cruise
    drive(200,200); blockedStreak=0; return;
  }

  drive(0,0);                           // obstacle: stop and scan
  long left = look(150), right = look(30);
  blockedStreak++;

  if (left < D_STOP && right < D_STOP){ // dead end
    drive(-200,-200); delay(400);       // back up
    pivot(random(0,2)?LEFT:RIGHT);
  } else {
    pivot(left > right ? LEFT : RIGHT); // toward the more open side
  }

  if (blockedStreak > 4){               // stuck/oscillating -> break out
    drive(-200,-200); delay(500);
    pivot(random(0,2)?LEFT:RIGHT);
    for (int i=0;i<3;i++) pivot(left>right?LEFT:RIGHT);
    blockedStreak = 0;
  }
}`,
    explain: [
      { ref: 'return us ? us/58 : 400;              // cm; 400 = nothing in range', txt: 'Distance is echo-time divided by 58 (out-and-back); a timeout means nothing is in range, treated as clear.' },
      { ref: 'if (ahead > D_STOP){                  // clear: cruise', txt: 'The forward-cruise state dominates: while clear, just drive. The reactive loop only does work when something is in the way.' },
      { ref: 'pivot(left > right ? LEFT : RIGHT); // toward the more open side', txt: 'The central reactive rule — turn toward the more open side after comparing scanned clearances.' },
      { ref: 'if (blockedStreak > 4){               // stuck/oscillating -> break out', txt: 'A run of repeated blocks means the rover is stuck or oscillating (its main failure mode), so it makes a larger random escape — honest handling of a memoryless robot\'s weakness.' },
    ],
  }],

  config: [
    'Configure the stop distance for the rover\'s speed.',
    'Configure scan angles and turn/pivot amounts.',
    'Configure dead-end and stuck/oscillation recovery.',
    'Configure loop timing so it can stop before collision.',
  ],
  calibration: [
    { h: 'Distance sensing', p: [
      'Verify readings are accurate and sensible across the range; check for blind spots and false returns.',
    ] },
    { h: 'Stop distance vs speed', p: [
      'Set the stop distance so the rover halts before contact at its cruise speed; slow down if it clips obstacles.',
    ] },
    { h: 'Turn amounts', p: [
      'Tune pivot durations so turns are decisive but not excessive.',
    ] },
  ],
  testing: [
    { step: 'Open floor', expect: 'Cruises forward smoothly' },
    { step: 'Wall ahead', expect: 'Stops, scans, turns to open side' },
    { step: 'Corner', expect: 'Recovers (backs up/turns) rather than jamming' },
    { step: 'Narrow gap between two objects', expect: 'May oscillate → escape behaviour breaks it out' },
    { step: 'Soft/angled surface', expect: 'Note ultrasonic blind spots; add margin' },
    { step: 'Increase speed', expect: 'Larger stop distance needed to avoid clipping' },
  ],
  output: [
    'A rover that explores a space on its own, avoiding obstacles by scanning and steering toward open space.',
    { file: 'rover-decision.txt', lang: 'plain', body: `ahead: 22 cm  (< stop)
scan  left: 60 cm   right: 18 cm
decision: LEFT is clearer -> pivot left
state: AVOIDING -> resume cruise` },
    'The rover found the left side far clearer than the right and pivoted left — the sense–decide–act loop making a visible choice.',
  ],
  troubleshoot: [
    { sym: 'Clips obstacles', cause: 'Stop distance too small / loop too slow / too fast', fix: 'Increase stop distance; slow down; speed up the loop' },
    { sym: 'Erratic readings', cause: 'Sensor sees chassis/floor; angled surfaces', fix: 'Mount level and clear; add margin; note blind spots' },
    { sym: 'Gets stuck in corners', cause: 'Purely reactive, no memory', fix: 'Add dead-end back-up and random escape turns' },
    { sym: 'Oscillates between two objects', cause: 'No memory/plan', fix: 'Detect repeated blocks; make a larger escape manoeuvre' },
    { sym: 'Tips when stopping', cause: 'High centre of mass', fix: 'Lower the CoM; ease deceleration' },
  ],

  perf: [
    'Keep the loop fast and the stop distance matched to speed.',
    'Scan left/right to choose a direction, not just detect ahead.',
    'Add dead-end and stuck/oscillation recovery for a memoryless robot.',
    'Note ultrasonic blind spots; add sensors/margin where needed.',
  ],
  safety: [
    'Keep speeds modest; a fast reactive rover can hit people or fall off edges.',
    'Add an edge/cliff or bump backup if operating near drops or fragile objects.',
    'Purely reactive avoidance is not a safety guarantee — do not rely on it where a collision could cause harm.',
    'Secure the battery and wiring so nothing snags during quick turns.',
  ],
  maintenance: [
    'Keep the sensor clean and correctly aimed; re-check after knocks.',
    'Check wheels/motors for wear that causes drift.',
    'Re-tune stop distance/turns if speed, battery or surface changes.',
    'Verify the servo scan still sweeps freely.',
  ],
  future: [
    'Add wheel encoders and odometry toward mapping.',
    'Add multiple/side sensors or a ToF array for fewer blind spots.',
    'Add SLAM and path planning to navigate to a goal, not just avoid.',
    'Layer behaviours (wander, seek light, follow) on the reactive base.',
  ],
  faq: [
    { q: 'How does it navigate without a map?', a: 'It does not navigate to a place — it reacts. It drives forward and, whenever something is close, turns toward the clearer side. Complex-looking wandering emerges from that simple, fast sense–decide–act loop.' },
    { q: 'Why does the sensor scan left and right?', a: 'One forward reading only tells the rover something is ahead; scanning lets it compare clearances and choose the more open direction to turn toward. Scanning turns detection into a decision.' },
    { q: 'Why does it sometimes get stuck?', a: 'Because it is purely reactive — no memory, no plan — so in a corner or between two objects it can repeat the same reaction forever. Basic recovery (back up, random escape turn) helps, but the real fix is memory and planning, which is what more advanced robots add.' },
    { q: 'How fast can it safely go?', a: 'Only as fast as it can stop within its sensing. The stop distance must exceed speed times the loop-plus-reaction time — faster rovers need a larger stop distance and a faster loop.' },
    { q: 'What are the sensor\'s limits?', a: 'Ultrasonic sensing has blind spots, a wide beam that blurs detail, and weak returns from soft or steeply angled surfaces. Adding margin, extra sensors, or a time-of-flight laser improves robustness.' },
  ],
  refs: [
    { t: 'Mobile robot', u: 'https://en.wikipedia.org/wiki/Mobile_robot', s: 'Reference' },
    { t: 'Obstacle avoidance', u: 'https://en.wikipedia.org/wiki/Obstacle_avoidance', s: 'Reference' },
    { t: 'Behavior-based robotics', u: 'https://en.wikipedia.org/wiki/Behavior-based_robotics', s: 'Reference' },
    { t: 'Ultrasonic ranging (HC-SR04)', u: 'https://en.wikipedia.org/wiki/Ultrasonic_transducer', s: 'Reference' },
    { t: 'Differential wheeled robot', u: 'https://en.wikipedia.org/wiki/Differential_wheeled_robot', s: 'Reference' },
  ],
  images: ['robot', 'ultrasonic', 'motor'],
  imageCaptions: [
    'An obstacle-avoiding rover explores a space on its own using a fast sense–decide–act loop — reactive autonomy without a map.',
    'The ultrasonic sensor on a scan servo compares left and right clearances so the rover steers toward open space.',
    'Differential drive lets the rover pivot decisively toward the clearer direction when something blocks its path.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   093 — 4-DOF Robotic Arm
   ══════════════════════════════════════════════════════════════════ */
{
  id: '093',
  domainKey: 'robotics',
  emoji: '🦾', thumb: 'robotarm',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A four-jointed arm with a gripper that reaches to a point in space and picks things up — an accessible introduction to manipulation and kinematics.',

  overview: [
    'A mobile robot moves <i>itself</i> through space; a robotic arm moves the <i>world</i> — reaching out to a chosen point, orienting a gripper, and picking, placing or manipulating an object. That is a fundamentally different and richer problem, and its core is <b>kinematics</b>: the relationship between the arm\'s joint angles and where its gripper ends up in space. This project builds a <b>4-degree-of-freedom (4-DOF)</b> arm — base rotation, shoulder, elbow, and a gripper — and the control to make it reach and grasp, an accessible but genuine introduction to robotic manipulation.',
    'The arm is a chain of links driven by <b>servo motors</b> at each joint: the base servo swings the arm left/right, the shoulder and elbow servos raise and extend it, and the gripper servo opens and closes to grasp. Controlling it has two directions. <b>Forward kinematics</b> answers "given these joint angles, where is the gripper?" — a matter of chaining the link geometry. <b>Inverse kinematics</b> answers the more useful and harder question "to put the gripper <i>here</i>, what joint angles do I need?" — which for a simple arm can be solved with geometry and trigonometry, and is what lets you command a position rather than fiddling each joint by hand.',
    'On top of the kinematics sit the practicalities of a real arm: <b>smooth motion</b> (moving joints gradually and in coordination, not snapping, to avoid jerking the arm and its load), <b>reach and workspace</b> (the arm can only reach points its geometry allows — the envelope matters), <b>payload and torque</b> (a servo has limited torque, and a load far from a joint demands more — the shoulder works hardest), and safe, stable operation. It is honest that hobby servos have limited precision, repeatability and payload, and that industrial arms use far more capable actuators and 6+ DOF for full position <i>and</i> orientation control. But as a 4-DOF servo arm with forward and inverse kinematics, coordinated motion and a working gripper, it teaches the real substance of manipulation — kinematics, workspace, torque and control — in a build you can hold in your hand.',
  ],
  does: [
    'Reaches its gripper to a chosen point in space',
    'Drives 4 joints (base, shoulder, elbow, gripper) with servos',
    'Computes forward kinematics (angles → position)',
    'Computes inverse kinematics (position → angles)',
    'Moves joints smoothly and in coordination',
    'Opens/closes a gripper to pick and place',
    'Respects its reachable workspace, torque and payload limits',
  ],
  features: [
    'Servo-driven 4-DOF arm + gripper',
    'Forward and inverse kinematics',
    'Coordinated, smooth (eased) joint motion',
    'Workspace/reach awareness',
    'Torque/payload-conscious design',
    'Pick-and-place sequencing',
    'Honest about hobby-servo precision and DOF limits',
  ],
  applications: [
    { t: 'Manipulation education', d: 'Kinematics, workspace and torque in a hands-on arm.' },
    { t: 'Pick-and-place demos', d: 'Simple sorting/placing of light objects.' },
    { t: 'Automation prototyping', d: 'A base for feeders, sorters and desktop automation.' },
    { t: 'Robotics research learning', d: 'Forward/inverse kinematics and coordinated control.' },
  ],
  skills: [
    'Servo control and coordinated multi-joint motion',
    'Forward kinematics (link geometry chaining)',
    'Inverse kinematics (geometric/trigonometric solution)',
    'Workspace, reach and torque/payload reasoning',
    'Pick-and-place sequencing and gripping',
  ],
  prereq: [
    'Manipulation\'s core is kinematics: joint angles ↔ gripper position.',
    'Inverse kinematics lets you command a position, not fiddle each joint.',
    'Move joints smoothly and in coordination to avoid jerk.',
    'Respect workspace, torque and payload — a servo arm has real limits.',
  ],

  parts: ['uno', 'mg996r', 'sg90', 'psu5v', 'breadboard'],
  extraParts: [
    { name: 'Servos (joints)', spec: '3× higher-torque servos (base/shoulder/elbow) + 1 gripper servo', qty: 4, price: 1200, note: 'Shoulder needs the most torque' },
    { name: 'Arm structure + gripper', spec: 'Laser-cut/3D-printed links, brackets and a gripper', qty: 1, price: 900 },
    { name: 'Servo power supply', spec: '5–6 V supply able to drive all servos (amps)', qty: 1, price: 400, note: 'Servos draw far more than an MCU pin can give' },
    { name: 'Heavy base', spec: 'Weighted/clamped base for stability', qty: 1, price: 300 },
  ],
  cost: '₹2,800 – ₹5,000',
  libs: ['servo', 'preferences'],

  pins: {
    left: [
      { dev: 'Base servo', devPin: 'PWM', pin: 'D3', sig: 'Rotate (θ0)' },
      { dev: 'Shoulder servo', devPin: 'PWM', pin: 'D5', sig: 'Lift (θ1)' },
    ],
    right: [
      { dev: 'Elbow servo', devPin: 'PWM', pin: 'D6', sig: 'Extend (θ2)' },
      { dev: 'Gripper servo', devPin: 'PWM', pin: 'D9', sig: 'Open/close' },
      { dev: 'Servo supply 5–6V', devPin: 'V+', pin: 'ext', sig: 'Power (amps)' },
      { dev: 'Common ground', devPin: 'GND', pin: 'GND', sig: 'Shared' },
    ],
  },
  wiringNotes: [
    'Power the servos from a dedicated 5–6 V supply able to source several amps — not the MCU\'s 5 V pin.',
    'Tie the servo-supply ground to the MCU ground (common ground) so the PWM signals are referenced correctly.',
    'Give the base a heavy or clamped mount — the arm will tip a light base when it reaches out.',
    'Route servo wires so they do not bind the joints through their range of motion.',
    'Add capacitance across the servo supply to absorb current surges.',
  ],

  block: { columns: [
    { label: 'Command', edge: 'right', blocks: [
      { name: 'Target (x,y,z)', sub: 'or pick/place', highlight: true },
    ] },
    { label: 'Plan', edge: 'right', blocks: [
      { name: 'Inverse kin.', sub: 'pos → angles', highlight: true },
      { name: 'Reachable?', sub: 'workspace' },
    ] },
    { label: 'Move', edge: 'right', blocks: [
      { name: 'Ease joints', sub: 'coordinated' },
      { name: '4 servos', sub: 'base/sh/el/grip' },
    ] },
    { label: 'Grasp', edge: 'none', blocks: [
      { name: 'Gripper', sub: 'open/close' },
      { name: 'Place', sub: 'sequence' },
    ] },
  ] },
  flow: [
    { t: 'Command a target (x,y,z) / pick', k: 'start' },
    { t: 'Inverse kinematics → joint angles', k: 'proc' },
    { t: 'Within workspace / torque?', k: 'dec', yes: 'Ease joints to target (coordinated)', no: 'Reject: out of reach' },
    { t: 'Reject: out of reach', k: 'io' },
    { t: 'Ease joints to target (coordinated)', k: 'io' },
    { t: 'Close gripper (grasp)', k: 'proc' },
    { t: 'Move to place point + open', k: 'io' },
    { t: 'Return to rest', k: 'end', back: 'Command a target (x,y,z) / pick' },
  ],

  principle: [
    'A manipulator\'s defining question is <b>kinematics</b>: how the angles of its joints determine where its end-effector — the gripper — sits and points in space. Everything about controlling an arm flows from this relationship. A 4-DOF arm has four controllable joints; here, base rotation places the arm\'s working plane, the shoulder and elbow set the reach and height within that plane, and the gripper grasps. Four degrees of freedom is enough to command a <b>position</b> (and one orientation) — enough to pick things up — while remaining simple enough to understand fully, which is exactly why it is the right teaching arm.',
    '<b>Forward kinematics</b> is the direct calculation: given the joint angles, chain the fixed link lengths and joint rotations to find the gripper\'s position. It is unambiguous — a set of angles yields exactly one gripper pose — and it is how you predict where the arm <i>will</i> be. But it answers the wrong question for actual use: nobody wants to hand-pick four angles and hope the gripper lands where they want. The useful question is the inverse.',
    '<b>Inverse kinematics</b> asks: to put the gripper at a target point, what joint angles are required? This is harder — there can be multiple solutions (elbow-up vs elbow-down), or none if the point is out of reach — but for a simple arm it yields to <b>geometry and trigonometry</b>: the base angle comes from the target\'s direction, and the shoulder/elbow angles come from solving the two-link reach triangle to the target (the law of cosines). Solving inverse kinematics is what turns the arm from a set of fiddly joints into a device you command by <i>position</i> — "go here" — which is the whole point of manipulation control. It also naturally reveals the <b>workspace</b>: the set of points the arm can actually reach, bounded by its link lengths and joint ranges. A target outside the workspace has no solution, and the controller must recognise and reject it rather than straining the servos.',
    'Around the kinematics sit the physical realities that make an arm behave — or misbehave. <b>Motion must be smooth and coordinated</b>: snapping servos to new angles jerks the arm, overshoots, and can fling a grasped object, so joints are eased to their targets together over a short time. <b>Torque and payload</b> govern what the arm can do: a servo produces limited torque, and a load or link mass acting at a distance from a joint imposes a torque that grows with that distance — the <b>shoulder</b>, carrying the whole outstretched arm, works hardest and sets the payload limit, which is why it needs the strongest servo and a stable, heavy base (or the arm tips itself over). The design is honest about the ceiling on all this: hobby servos have limited <b>precision and repeatability</b> (they will not hit a point to the millimetre reliably), limited payload, and no force feedback, and industrial arms use precision actuators and <b>6+ DOF</b> to control full position <i>and</i> orientation. But within those honest limits, a 4-DOF servo arm with real forward and inverse kinematics, coordinated smooth motion, and a working gripper delivers the genuine substance of robotic manipulation — the part that transfers directly to serious robotics.',
  ],
  equations: [
    { t: 'Forward kinematics (planar 2-link + base)', eq: 'Base rotates by θ0; shoulder θ1, elbow θ2; links L1, L2:\n\n  r = L1·cos θ1 + L2·cos(θ1+θ2)     (reach in the plane)\n  z = L1·sin θ1 + L2·sin(θ1+θ2)     (height)\n  x = r·cos θ0,   y = r·sin θ0       (rotate into 3-D)\n\nAngles → a single, definite gripper position.' },
    { t: 'Inverse kinematics (position → angles)', eq: 'Target (x,y,z): θ0 = atan2(y, x)\n  r = √(x²+y²),  reach D = √(r² + z²)\n\nElbow (law of cosines):\n  θ2 = ± acos( (D² − L1² − L2²) / (2·L1·L2) )\nShoulder:\n  θ1 = atan2(z, r) − atan2(L2·sin θ2, L1 + L2·cos θ2)\n\nNo solution if D > L1+L2 → OUT OF REACH (reject).' },
    { t: 'Torque / payload (why the shoulder works hardest)', eq: 'Joint torque ≈ Σ (weight_i × horizontal_distance_i)\n\nA load m at reach R needs torque ~ m·g·R at the shoulder.\nFarther out → more torque. Shoulder carries the whole arm\n→ strongest servo + heavy/stable base (or it tips).' },
  ],

  robotics: {
    mechanical: [
      'A serial chain: a rotating base, a shoulder joint, an elbow joint, and a gripper at the end — four servos in all.',
      'Links sized for the desired reach; the shoulder joint bears the most load, so it uses the strongest servo.',
      'A heavy or clamped base for stability — an outstretched arm will tip a light base.',
      'Servo wiring routed so it does not bind the joints anywhere in their range.',
    ],
    motion: [
      'Motion is coordinated multi-joint servo control: to reach a point, inverse kinematics gives the four target angles, and all joints are eased to them together over a short time rather than snapped.',
      'Easing (interpolating each joint from its current to its target angle) keeps the motion smooth, avoids overshoot, and stops the arm from flinging a grasped object — coordination matters as much as the endpoints.',
    ],
    motionTable: [
      { s: 'Reach to point', l: '(base + shoulder)', r: '(elbow + gripper)', o: 'Gripper arrives via IK' },
      { s: 'Elbow-up vs elbow-down', l: 'Shoulder high', r: 'Elbow bent up', o: 'Choose reachable/safe solution' },
      { s: 'Grasp', l: 'Arm holds pose', r: 'Gripper closes', o: 'Pick object' },
      { s: 'Carry', l: 'Ease slowly', r: 'Ease slowly', o: 'Smooth, no fling' },
      { s: 'Out of workspace', l: '—', r: '—', o: 'Reject (no IK solution)' },
      { s: 'Rest', l: 'Folded', r: 'Gripper open', o: 'Stable park pose' },
    ],
    sensors: [
      'Servo positions are commanded open-loop (hobby servos have internal position control but no external feedback to the MCU).',
      'Optional: a gripper force/limit sensor or a camera for closed-loop pick accuracy.',
      'Optional: current sensing on the servo supply to detect stall/overload.',
    ],
    actuators: [
      'Four servos: base (rotate), shoulder (lift, highest torque), elbow (extend), and gripper (grasp).',
      'All powered from a dedicated multi-amp 5–6 V supply with common ground to the MCU; the controller eases each servo from its current to its target angle in coordination.',
    ],
    kinematics: {
      text: [
        'Forward kinematics chains the link geometry to find the gripper from the angles; inverse kinematics solves the reach triangle with trigonometry to find the angles for a target point, and reveals the reachable workspace.',
      ],
      eq: `Forward:  r = L1·cosθ1 + L2·cos(θ1+θ2);  z = L1·sinθ1 + L2·sin(θ1+θ2)
          x = r·cosθ0;  y = r·sinθ0

Inverse:  θ0 = atan2(y,x);  D = √(x²+y²+z²)
          θ2 = acos((D²−L1²−L2²)/(2 L1 L2))    # elbow (law of cosines)
          θ1 = atan2(z,√(x²+y²)) − atan2(L2 sinθ2, L1+L2 cosθ2)
          if D > L1+L2:  OUT OF REACH`,
    },
  },

  assembly: [
    { h: 'Build the arm and power the servos properly', p: [
      'Assemble the base, shoulder, elbow and gripper with the strongest servo at the shoulder, on a heavy/clamped base. Power all servos from a dedicated multi-amp 5–6 V supply with a common ground to the MCU.',
    ], warn: 'Never power the servos from the MCU\'s 5 V pin — they draw far more current than it can supply, causing brownouts and resets. Use a separate supply, common ground, and a stable base or the reaching arm will tip over.' },
    { h: 'Calibrate joints and implement kinematics', p: [
      'Calibrate each servo\'s angle range and zero, measure the link lengths, and implement forward and inverse kinematics.',
    ] },
    { h: 'Add coordinated motion and gripping', p: [
      'Ease joints to IK targets in coordination, add workspace checks, and sequence pick-and-place with the gripper.',
    ] },
  ],
  steps: [
    { h: 'Solve inverse kinematics and check reach', p: [
      'From a target point compute the joint angles with geometry, and reject targets outside the reachable workspace.',
    ], code: {
      file: 'ik.ino', lang: 'cpp',
      body: `const float L1 = 105.0, L2 = 98.0;   // link lengths (mm)

struct Angles { float base, shoulder, elbow; bool reachable; };

Angles inverseKinematics(float x, float y, float z){
  Angles a; a.reachable = true;
  a.base = atan2(y, x);                          // base points at target
  float r = sqrt(x*x + y*y);                     // horizontal reach
  float D = sqrt(r*r + z*z);                      // distance to target

  if (D > (L1 + L2) || D < fabs(L1 - L2)){        // outside the workspace
    a.reachable = false; return a;                // reject: don't strain servos
  }
  float c2 = (D*D - L1*L1 - L2*L2) / (2*L1*L2);
  a.elbow = acos(constrain(c2, -1.0, 1.0));       // law of cosines
  a.shoulder = atan2(z, r)
             - atan2(L2*sin(a.elbow), L1 + L2*cos(a.elbow));
  return a;
}`,
      explain: [
        { ref: 'a.base = atan2(y, x);                          // base points at target', txt: 'The base angle simply aims the arm\'s working plane at the target\'s horizontal direction.' },
        { ref: 'if (D > (L1 + L2) || D < fabs(L1 - L2)){        // outside the workspace', txt: 'A target farther than the arm can stretch (or nearer than it can fold) has no solution — the controller rejects it instead of straining the servos into a pose they cannot reach.' },
        { ref: 'a.elbow = acos(constrain(c2, -1.0, 1.0));       // law of cosines', txt: 'The elbow angle comes from the law of cosines on the two-link reach triangle — the heart of the inverse-kinematics solution.' },
        { ref: 'a.shoulder = atan2(z, r)', txt: 'The shoulder angle combines the direction to the target with the elbow geometry so the gripper lands on the point.' },
      ],
    } },
    { h: 'Ease joints to the target and grasp', p: [
      'Move all joints from their current angles to the IK targets together over a short time (easing), then operate the gripper — smooth, coordinated motion that does not jerk or fling the load.',
    ], tip: 'Ease, do not snap. Interpolate every joint from its current angle to its target over the same short interval so the arm moves as one smooth motion rather than each joint jumping independently.' },
  ],

  code: [{
    file: 'robot_arm.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   4-DOF Robotic Arm — reach + pick-and-place

   Inverse kinematics turns a target point into joint angles (with a
   workspace check), coordinated easing moves all joints smoothly, and
   a gripper picks and places. Servos on a dedicated supply, common
   ground, heavy base. Honest about hobby-servo precision/payload.
   ══════════════════════════════════════════════════════════════════ */

#include <Servo.h>
Servo base, shoulder, elbow, gripper;
const float L1=105, L2=98;                 // mm

struct Angles { float base, shoulder, elbow; bool reachable; };

Angles ik(float x,float y,float z){
  Angles a; a.reachable=true;
  a.base = atan2(y,x);
  float r=sqrt(x*x+y*y), D=sqrt(r*r+z*z);
  if (D > L1+L2 || D < fabs(L1-L2)){ a.reachable=false; return a; }
  float c2=(D*D-L1*L1-L2*L2)/(2*L1*L2);
  a.elbow = acos(constrain(c2,-1.0,1.0));
  a.shoulder = atan2(z,r) - atan2(L2*sin(a.elbow), L1+L2*cos(a.elbow));
  return a;
}
int deg(float rad){ return constrain((int)(rad*180.0/PI), 0, 180); }

// Ease ALL joints together from current to target (smooth, coordinated).
void moveTo(int b,int s,int e,int steps=40){
  int b0=base.read(), s0=shoulder.read(), e0=elbow.read();
  for (int i=1;i<=steps;i++){
    float t=(float)i/steps;                // 0..1
    base.write(b0+(b-b0)*t);
    shoulder.write(s0+(s-s0)*t);
    elbow.write(e0+(e-e0)*t);
    delay(15);
  }
}
void grip(bool close){ gripper.write(close?60:120); delay(400); }

void reachAndPick(float x,float y,float z){
  Angles a = ik(x,y,z);
  if (!a.reachable){ Serial.println("OUT OF REACH"); return; }  // honest reject
  grip(false);                              // open
  moveTo(deg(a.base), deg(a.shoulder), deg(a.elbow));
  grip(true);                               // grasp
}

void setup(){
  base.attach(3); shoulder.attach(5); elbow.attach(6); gripper.attach(9);
  moveTo(90,90,90); grip(false);            // rest pose
  reachAndPick(120, 40, 20);                // pick at a point
  moveTo(30, 90, 90); grip(false);          // move to place point + release
  moveTo(90,90,90);                         // return to rest
}
void loop(){}`,
    explain: [
      { ref: 'if (D > L1+L2 || D < fabs(L1-L2)){ a.reachable=false; return a; }', txt: 'The workspace check rejects unreachable targets — the arm never strains servos toward a point its geometry cannot reach.' },
      { ref: 'void moveTo(int b,int s,int e,int steps=40){', txt: 'Every joint is eased from its current to its target angle over the same steps, so the arm moves as one smooth, coordinated motion instead of snapping.' },
      { ref: 'if (!a.reachable){ Serial.println("OUT OF REACH"); return; }  // honest reject', txt: 'Commanding a position out of the workspace is reported and refused — honest handling rather than a servo strain or a wild pose.' },
      { ref: 'grip(true);                               // grasp', txt: 'With the gripper positioned by inverse kinematics, closing it picks the object — the payoff of commanding by position.' },
    ],
  }],

  config: [
    'Configure servo pins, per-joint angle ranges/zeros, and the link lengths.',
    'Configure the easing steps/speed for smooth coordinated motion.',
    'Configure gripper open/close angles and pick/place points.',
    'Configure workspace limits and out-of-reach handling.',
  ],
  calibration: [
    { h: 'Joint zeros/ranges', p: [
      'Calibrate each servo\'s angle so the arm\'s geometric zero matches the model, and set safe joint limits.',
    ] },
    { h: 'Link lengths', p: [
      'Measure L1/L2 accurately — kinematic accuracy depends on them.',
    ] },
    { h: 'Reach accuracy', p: [
      'Command known points and measure where the gripper lands; note hobby-servo repeatability limits.',
    ] },
  ],
  testing: [
    { step: 'Command a reachable point', expect: 'Gripper arrives near the point (IK works)' },
    { step: 'Command an out-of-reach point', expect: '"OUT OF REACH" — rejected, servos not strained' },
    { step: 'Move between two points', expect: 'Smooth, coordinated (eased) motion' },
    { step: 'Pick a light object', expect: 'Gripper grasps and carries without flinging' },
    { step: 'Reach fully outstretched with a load', expect: 'Shoulder works hardest; base stable (no tip)' },
    { step: 'Repeat a target several times', expect: 'Some spread — note servo repeatability' },
  ],
  output: [
    'An arm that reaches commanded points, respects its workspace, moves smoothly, and picks and places light objects.',
    { file: 'ik-result.txt', lang: 'plain', body: `target: (120, 40, 20) mm
base: 18 deg   shoulder: 62 deg   elbow: 74 deg
reachable: yes
motion: eased over 40 steps -> gripper at ~(119, 41, 21) mm
grip: closed (object picked)` },
    'Inverse kinematics turned the target point into joint angles, the arm eased smoothly to it, and the gripper picked the object — manipulation commanded by position, not by fiddling joints.',
  ],
  troubleshoot: [
    { sym: 'MCU resets when arm moves', cause: 'Servos on MCU power', fix: 'Dedicated multi-amp servo supply; common ground; add capacitance' },
    { sym: 'Arm tips over', cause: 'Light base / long reach', fix: 'Heavy or clamped base; keep loads within payload' },
    { sym: 'Gripper misses the point', cause: 'Wrong link lengths / servo zeros', fix: 'Re-measure L1/L2; recalibrate joint zeros' },
    { sym: 'Jerky motion / flings load', cause: 'Snapping servos', fix: 'Ease all joints together over time' },
    { sym: 'Shoulder struggles/stalls', cause: 'Torque/payload exceeded', fix: 'Stronger shoulder servo; lighter load; shorter reach' },
    { sym: 'Unreachable points attempted', cause: 'No workspace check', fix: 'Reject targets with no IK solution' },
  ],

  perf: [
    'Solve inverse kinematics to command position, not joints.',
    'Reject out-of-workspace targets rather than straining servos.',
    'Ease all joints together for smooth, coordinated motion.',
    'Design for torque/payload — strongest servo at the shoulder, stable base.',
  ],
  safety: [
    'Keep hands and objects clear of the arm\'s workspace while it moves — even a small servo arm can pinch.',
    'Power servos from a proper supply; brownouts cause uncommanded motion.',
    'Use a stable, heavy base so the arm cannot tip and fall.',
    'Stay within the servos\' torque/payload; a stalled servo overheats and can be damaged.',
    'Hobby servos lack force feedback and precise repeatability — do not rely on them for anything safety-critical.',
  ],
  maintenance: [
    'Re-check joint zeros and link measurements periodically.',
    'Watch for servo wear/backlash that degrades accuracy.',
    'Keep the base fixings tight and the wiring free of the joints.',
    'Verify the servo supply holds voltage under load.',
  ],
  future: [
    'Add a 5th/6th DOF (wrist) for full orientation control.',
    'Add a camera for visual servoing / closed-loop picking.',
    'Add trajectory planning (via-points, speed profiles).',
    'Add force/current sensing for compliant, safer grasping.',
  ],
  faq: [
    { q: 'What is the difference between forward and inverse kinematics?', a: 'Forward kinematics computes where the gripper is from the joint angles (one definite answer). Inverse kinematics computes the joint angles needed to put the gripper at a target point — harder (multiple or no solutions) but far more useful, because it lets you command a position.' },
    { q: 'Why only 4 degrees of freedom?', a: '4-DOF is enough to command a position (and one orientation) — enough to pick things up — while staying simple to understand fully. Controlling full position and orientation needs 6+ DOF, which is what industrial arms use.' },
    { q: 'Why does the shoulder need the strongest servo?', a: 'Because torque grows with load times distance from the joint, and the shoulder carries the entire outstretched arm and its load. It works hardest and sets the payload limit, so it needs the most torque — and a stable base, or the arm tips itself over.' },
    { q: 'Why ease the joints instead of snapping to the angles?', a: 'Snapping jerks the arm, overshoots, and can fling a grasped object. Easing every joint from its current to its target angle together produces smooth, coordinated motion — coordination matters as much as the endpoints.' },
    { q: 'How accurate is it?', a: 'Usefully but not precisely. Hobby servos have limited resolution, repeatability and no external feedback, so it will reach near a point rather than to the millimetre reliably. That honest limit is exactly why serious arms use precision actuators and closed-loop control.' },
  ],
  refs: [
    { t: 'Robot arm / manipulator', u: 'https://en.wikipedia.org/wiki/Robotic_arm', s: 'Reference' },
    { t: 'Forward kinematics', u: 'https://en.wikipedia.org/wiki/Forward_kinematics', s: 'Reference' },
    { t: 'Inverse kinematics', u: 'https://en.wikipedia.org/wiki/Inverse_kinematics', s: 'Reference' },
    { t: 'Degrees of freedom (mechanics)', u: 'https://en.wikipedia.org/wiki/Degrees_of_freedom_(mechanics)', s: 'Reference' },
    { t: 'Servo motor control', u: 'https://en.wikipedia.org/wiki/Servomotor', s: 'Reference' },
  ],
  images: ['robotarm', 'servo', 'motor'],
  imageCaptions: [
    'A 4-DOF servo arm reaches to a point and grasps — an accessible introduction to robotic manipulation and kinematics.',
    'Inverse kinematics turns a target position into base, shoulder and elbow angles, revealing the reachable workspace.',
    'The shoulder joint carries the whole outstretched arm, so it works hardest and needs the most torque and a stable base.',
  ],
},

];
