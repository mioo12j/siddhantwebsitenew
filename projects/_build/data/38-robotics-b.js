/* Robotics 094–096. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   094 — Self-Balancing Robot
   ══════════════════════════════════════════════════════════════════ */
{
  id: '094',
  domainKey: 'robotics',
  emoji: '🛴', thumb: 'robot',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A two-wheeled robot that stays upright by constantly correcting its fall — a real inverted pendulum, and the clearest lesson in feedback control there is.',

  overview: [
    'A two-wheeled robot standing on its axle is <b>inherently unstable</b>: left alone it falls over, exactly like a broom balanced on your palm. Keeping it upright is not a mechanical trick but a <b>control</b> feat — the robot must sense that it is starting to fall and drive its wheels to catch itself, hundreds of times a second, forever. This is the classic <b>inverted pendulum</b>, one of the foundational problems of control theory, and building a robot that solves it is the single clearest, most visceral lesson in closed-loop feedback that robotics offers: the balance is not a state, it is a continuous, active correction.',
    'The robot senses its tilt with an <b>inertial measurement unit</b> (an accelerometer + gyroscope, e.g. an MPU6050): the accelerometer gives a noisy absolute tilt from gravity, the gyroscope gives a clean but drifting rate of rotation, and a <b>complementary (or Kalman) filter</b> fuses them into a stable, responsive tilt angle. A <b>PID controller</b> then converts the tilt error — how far from upright, how fast it is falling — into a drive command: lean forward and the wheels drive forward to get back under the centre of mass; lean back and they reverse. The robot literally chases its own falling point to stay up.',
    'Getting it to balance is a study in why control is subtle: the loop must run <b>fast</b> (a slow loop cannot catch a fast fall), the tilt estimate must be both stable and responsive (hence sensor fusion), and the PID gains must be tuned or the robot either falls or oscillates itself into instability. It is honest that this is a genuinely demanding tuning problem, that the balance point and gains are sensitive to the robot\'s mass distribution, and that a real Segway-class machine adds far more robust estimation and safety. But as a working inverted-pendulum balancer built on an IMU, sensor fusion and a tuned PID loop, it teaches the heart of feedback control — sense, filter, correct, fast — better than any simulation, because here the robot really does fall the moment the control gets it wrong.',
  ],
  does: [
    'Balances upright on two wheels (inverted pendulum)',
    'Senses tilt with an IMU (accelerometer + gyroscope)',
    'Fuses sensors into a stable tilt angle (complementary/Kalman)',
    'Corrects with a fast PID loop driving the wheels',
    'Chases its own falling point to stay up',
    'Can be extended to drive while balancing',
    'Demonstrates the foundations of feedback control',
  ],
  features: [
    'IMU tilt sensing with sensor fusion',
    'Fast PID balance loop',
    'Motor drive coupled to tilt correction',
    'Tunable gains (and honest tuning workflow)',
    'Fall detection / safe cut-off',
    'Extensible to steering/driving while balanced',
    'Honest about tuning sensitivity and estimation limits',
  ],
  applications: [
    { t: 'Control-theory education', d: 'The inverted pendulum, PID and sensor fusion made physical.' },
    { t: 'Personal-transporter principle', d: 'The core of Segway-class self-balancing machines.' },
    { t: 'Dynamics/robotics research learning', d: 'Estimation, fast control loops and stability.' },
    { t: 'Balancing platforms', d: 'A base for two-wheel balancing robots and toys.' },
  ],
  skills: [
    'IMU reading and sensor fusion (complementary/Kalman filter)',
    'PID control tuning for an unstable plant',
    'Fast control-loop timing',
    'Motor drive coupled to a control law',
    'Stability reasoning and fall/safety handling',
  ],
  prereq: [
    'Balancing is active control, not mechanics — the robot must continuously catch its fall.',
    'Fuse accelerometer (absolute, noisy) and gyro (smooth, drifting) into a stable tilt.',
    'The loop must run fast — a slow loop cannot catch a fast fall.',
    'PID gains are sensitive; expect a real tuning process.',
  ],

  parts: ['esp32', 'mpu6050', 'n20', 'tb6612', 'li18650', 'encoder'],
  extraParts: [
    { name: 'IMU (MPU6050)', spec: '6-axis accelerometer + gyroscope for tilt', qty: 1, price: 150, note: 'The balance sensor' },
    { name: 'Geared motors + encoders', spec: 'Two motors (encoders help position/velocity)', qty: 2, price: 700 },
    { name: 'Motor driver', spec: 'TB6612/L298N H-bridge, PWM', qty: 1, price: 200 },
    { name: 'Tall chassis + battery', spec: 'Two-wheel chassis with mass up high (easier to balance)', qty: 1, price: 600 },
  ],
  cost: '₹2,200 – ₹4,000',
  libs: ['mpu', 'pid', 'preferences'],

  pins: {
    left: [
      { dev: 'IMU (MPU6050)', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Tilt (accel+gyro)' },
      { dev: 'Motor encoders', devPin: 'A/B', pin: 'GPIO 34/35', sig: 'Wheel velocity' },
    ],
    right: [
      { dev: 'Motor driver L', devPin: 'PWM/IN', pin: 'GPIO 25/26', sig: 'Left wheel' },
      { dev: 'Motor driver R', devPin: 'PWM/IN', pin: 'GPIO 27/14', sig: 'Right wheel' },
      { dev: 'Battery', devPin: '+', pin: 'VIN', sig: 'Power' },
      { dev: 'Fall cut-off', devPin: 'STBY', pin: 'GPIO 33', sig: 'Disable motors' },
    ],
  },
  wiringNotes: [
    'Mount the IMU rigidly on the chassis centreline, aligned to the tilt axis — a loose or misaligned IMU wrecks the tilt estimate.',
    'Wire the two motors through an H-bridge with PWM; both must respond quickly.',
    'Keep the loop hardware fast — I2C for the IMU, direct PWM to the driver.',
    'Put battery mass up high to raise the centre of mass (a taller pendulum is slower to fall and easier to balance).',
    'Provide a way to cut motors on a fall (large tilt) for safety.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'IMU', sub: 'accel+gyro', highlight: true },
      { name: 'Fuse', sub: 'tilt angle' },
    ] },
    { label: 'Control', edge: 'right', blocks: [
      { name: 'PID', sub: 'tilt error', highlight: true },
      { name: 'Drive cmd', sub: 'catch fall' },
    ] },
    { label: 'Act', edge: 'right', blocks: [
      { name: 'Left motor', sub: 'PWM' },
      { name: 'Right motor', sub: 'PWM' },
    ] },
    { label: 'Loop fast', edge: 'none', blocks: [
      { name: 'Repeat', sub: '100s/sec' },
      { name: 'Fall cut-off', sub: 'safety' },
    ] },
  ] },
  flow: [
    { t: 'Read IMU (accel + gyro)', k: 'start' },
    { t: 'Fuse → stable tilt angle', k: 'proc' },
    { t: 'Fallen past safe angle?', k: 'dec', yes: 'Cut motors (safety)', no: 'PID on tilt error' },
    { t: 'Cut motors (safety)', k: 'io' },
    { t: 'PID on tilt error', k: 'proc' },
    { t: 'Drive wheels to catch the fall', k: 'io' },
    { t: 'Loop fast (repeat)', k: 'end', back: 'Read IMU (accel + gyro)' },
  ],

  principle: [
    'A self-balancing robot is an <b>inverted pendulum</b> — a mass whose natural, stable state is lying down, held upright only by active effort. Balancing it is not a matter of building it well; a perfectly-built one still falls, because the upright position is an <i>unstable equilibrium</i>, like a pencil on its point. The only thing that keeps it up is a controller that continuously notices the incipient fall and moves the base to get back underneath the centre of mass — the same thing you do unconsciously balancing a broom on your hand. This makes the robot the purest physical demonstration of <b>closed-loop feedback control</b>: remove the loop for even a fraction of a second and it topples.',
    'The first hard part is <b>knowing the tilt</b>, and it is harder than it looks because no single sensor gives a good tilt angle. An <b>accelerometer</b> senses gravity\'s direction and so gives an <i>absolute</i> tilt — but it also senses the robot\'s own accelerations, making it noisy and jittery. A <b>gyroscope</b> senses the <i>rate</i> of rotation very cleanly — but integrating rate to get angle accumulates <b>drift</b>, so its angle slowly wanders away from truth. The classic solution is <b>sensor fusion</b>: a complementary filter trusts the gyro over short timescales (smooth, responsive) and the accelerometer over long timescales (drift-free), blending them into a tilt estimate that is both stable and fast. (A Kalman filter does this optimally.) Good balance is impossible without a good tilt estimate, which is why fusion is central, not optional.',
    'The second hard part is <b>correcting</b>, and this is a <b>PID</b> controller. The error is the tilt away from the upright set-point. The <b>proportional</b> term drives the wheels harder the further the robot has leaned — the basic "catch the fall" response. The <b>derivative</b> term reacts to how <i>fast</i> it is falling, damping the motion and preventing overshoot (without it, the robot corrects, overshoots, and oscillates). The <b>integral</b> term trims small steady biases (an off-centre mass, motor imbalance) that would otherwise leave it slowly drifting. The controller\'s output drives both wheels forward or back so the base chases the falling point. Crucially the whole loop — read, fuse, PID, drive — must run <b>fast</b> (typically hundreds of times per second), because a fall accelerates, and a loop too slow to catch it early loses the race. Slow loop, poor fusion, or mistuned gains and the robot either falls limply or shakes itself apart.',
    'What makes this project honest — and such a good teacher — is that the difficulty is real and unavoidable. The PID <b>gains must be tuned</b> to the specific robot, because they depend on its mass, height, wheel size and motor response; there is a genuine tuning workflow (raise P until it holds but oscillates, add D to damp, add a little I to remove drift), and the robot gives instant, unambiguous feedback — it stays up or it falls. The balance is <b>sensitive</b> to the centre of mass (mass up high, making a slower pendulum, is markedly easier), and safety matters: a large tilt means it has lost balance, and the motors should cut so it does not drive itself off a table. It is candid that production self-balancing machines add far more robust estimation, redundancy and safety. But precisely because it really falls when the control is wrong, it delivers the fundamentals of feedback — sensing, fusion, and a fast tuned control loop stabilising an unstable system — with a clarity no stable robot or simulation can match.',
  ],
  equations: [
    { t: 'Complementary filter (tilt fusion)', eq: 'angle = α·(angle + gyro_rate·dt) + (1−α)·accel_angle\n\n  gyro term  → smooth, responsive (short-term)\n  accel term → drift-free absolute (long-term)\n  α ≈ 0.98    (trust gyro over dt, accel over time)\n\nStable + fast tilt — neither sensor alone is enough.' },
    { t: 'PID balance law', eq: 'error = tilt − setpoint      (setpoint ≈ upright)\n\n  drive = Kp·error + Ki·∫error dt + Kd·d(error)/dt\n\n  Kp: catch the fall   Kd: damp / anticipate\n  Ki: trim steady bias\n\nOutput drives BOTH wheels to get under the CoM.' },
    { t: 'Why speed matters', eq: 'A fall accelerates: θ̈ ∝ sin θ (grows as it tips).\nThe loop must sample fast enough to correct while θ is\nstill small:\n\n  f_loop  ≫  fall dynamics   (100s of Hz typical)\n\nToo slow → it tips past recovery before the next correction.' },
  ],

  robotics: {
    mechanical: [
      'Two-wheel chassis with the wheel axle low and the mass (battery, boards) carried up high to raise the centre of mass.',
      'The IMU mounted rigidly on the centreline, aligned to the tilt axis — any looseness or misalignment corrupts the tilt estimate.',
      'Matched motors and wheels so equal commands give equal drive; imbalance shows up as steady drift the integral term must fight.',
      'A tall, slightly top-heavy build is deliberately easier: a longer pendulum falls more slowly, giving the loop more time to react.',
    ],
    motion: [
      'Motion is balance-first: both wheels are driven together by the PID output to keep the robot upright, and steering (a left/right difference) is layered on top only once balance is solid.',
      'To move forward deliberately, the controller nudges the tilt set-point slightly forward so the robot "falls" forward and drives to chase it — you drive a balancer by biasing its balance point, not by simply spinning the wheels.',
    ],
    motionTable: [
      { s: 'Upright (balanced)', l: 'Hold/trim', r: 'Hold/trim', o: 'Stays up' },
      { s: 'Tilting forward', l: 'Drive forward', r: 'Drive forward', o: 'Wheels catch the fall' },
      { s: 'Tilting back', l: 'Reverse', r: 'Reverse', o: 'Wheels catch the fall' },
      { s: 'Drive forward (intended)', l: 'Forward', r: 'Forward', o: 'Lean set-point forward' },
      { s: 'Steer', l: 'Faster', r: 'Slower', o: 'Turn while balancing' },
      { s: 'Fallen (large tilt)', l: 'Cut', r: 'Cut', o: 'Motors off (safety)' },
    ],
    sensors: [
      'IMU (accelerometer + gyroscope): the tilt sensor, fused into a stable angle.',
      'Wheel encoders (optional but valuable): wheel velocity/position for drift control and driving.',
      'Battery voltage: motor authority drops as voltage sags, affecting balance.',
    ],
    actuators: [
      'Two geared DC motors via an H-bridge, PWM-driven, must respond quickly and symmetrically to the control output.',
      'The PID output is applied to both wheels for balance; a steering term is added/subtracted for turning once balance is reliable.',
    ],
    kinematics: {
      text: [
        'The relevant dynamics are the inverted pendulum: the tilt accelerates away from upright, and wheel motion under the base is the control input that arrests it.',
      ],
      eq: `Inverted-pendulum intuition:
  θ̈ ≈ (g/L)·sinθ − (control via wheel acceleration)
  small θ:  θ̈ ≈ (g/L)·θ − k·u

Balance: choose u (wheel drive) so θ → 0
  u = Kp·θ + Kd·θ̇ + Ki·∫θ      # PID stabilises the unstable θ`,
    },
  },

  assembly: [
    { h: 'Build a slightly top-heavy chassis with a rigid IMU', p: [
      'Assemble the two-wheel chassis with mass up high, mount the IMU rigidly on the centreline aligned to the tilt axis, and wire the motors through the H-bridge with fast PWM.',
    ], warn: 'A loose or misaligned IMU makes balance impossible — the tilt estimate is the foundation. Mount it solidly and align it to the tilt axis, and provide a motor cut-off for falls so the robot cannot drive off a table.' },
    { h: 'Fuse the IMU into a stable tilt', p: [
      'Read the accelerometer and gyroscope and fuse them (complementary/Kalman) into a tilt angle that is both drift-free and responsive.',
    ] },
    { h: 'Tune the PID balance loop', p: [
      'Run the loop fast; raise Kp until it holds but oscillates, add Kd to damp, add a little Ki to remove drift; then add steering/driving.',
    ] },
  ],
  steps: [
    { h: 'Fuse tilt, then stabilise with PID', p: [
      'Fuse accelerometer and gyroscope into a stable tilt angle, and drive both wheels from a PID on the tilt error — fast.',
    ], code: {
      file: 'balance.ino', lang: 'cpp',
      body: `float angle = 0;                    // fused tilt (deg)
float Kp=22, Ki=0.4, Kd=1.1, integ=0, prevErr=0;
const float SETPOINT = 0.0;         // upright (trim for CoM)
const float FALL = 40.0;            // deg: lost balance

// Complementary filter: gyro (smooth) + accel (drift-free).
float fuseTilt(float accelAngle, float gyroRate, float dt){
  angle = 0.98f*(angle + gyroRate*dt) + 0.02f*accelAngle;
  return angle;
}

int balance(float tilt, float dt){
  if (fabs(tilt) > FALL) return 0;          // fallen -> cut motors
  float err = tilt - SETPOINT;
  integ += err*dt;
  float d = (err - prevErr)/dt; prevErr = err;
  float u = Kp*err + Ki*integ + Kd*d;       // PID -> drive command
  return constrain((int)u, -255, 255);
}

void loop(){
  float dt = tick();                         // small, fast
  float tilt = fuseTilt(accelAngle(), gyroRate(), dt);
  int u = balance(tilt, dt);
  driveBoth(u);                              // both wheels chase the fall
}`,
      explain: [
        { ref: 'angle = 0.98f*(angle + gyroRate*dt) + 0.02f*accelAngle;', txt: 'The complementary filter trusts the gyro over the short interval and the accelerometer over the long run, giving a tilt that is both responsive and drift-free.' },
        { ref: 'if (fabs(tilt) > FALL) return 0;          // fallen -> cut motors', txt: 'Past a large tilt the robot has lost balance, so the motors cut — a safety stop that also prevents it driving off an edge.' },
        { ref: 'float u = Kp*err + Ki*integ + Kd*d;       // PID -> drive command', txt: 'The PID converts tilt error into a wheel drive: P catches the fall, D damps overshoot, I trims steady bias.' },
        { ref: 'driveBoth(u);                              // both wheels chase the fall', txt: 'Both wheels are driven together to move the base under the centre of mass — the robot literally chases its falling point.' },
      ],
    } },
    { h: 'Add driving and steering on top of balance', p: [
      'Once it balances solidly, drive by biasing the tilt set-point forward/back and steer by adding a left/right wheel difference — motion layered on stable balance.',
    ], tip: 'Tune in order: get the tilt estimate clean first, then Kp to hold, then Kd to stop the shakes, then a whisper of Ki for drift. Only add driving/steering once it balances hands-off.' },
  ],

  code: [{
    file: 'self_balancing.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Self-Balancing Robot — inverted pendulum

   Fuses an IMU into a stable tilt (complementary filter), stabilises
   the unstable upright with a fast tuned PID driving both wheels, and
   cuts motors on a fall. Drive/steer layered on top of balance.
   The clearest physical lesson in closed-loop feedback control.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <MPU6050.h>
MPU6050 imu;

float angle=0, integ=0, prevErr=0;
float Kp=22, Ki=0.4, Kd=1.1;
const float SETPOINT_TRIM = 0.5;      // CoM trim (deg)
const float FALL = 40.0;
float driveBias=0, steer=0;           // set by remote/driving

uint32_t last=0;

float readTilt(float dt){
  int16_t ax,ay,az,gx,gy,gz; imu.getMotion6(&ax,&ay,&az,&gx,&gy,&gz);
  float accelAngle = atan2f(ay, az) * 57.2958f;      // deg from gravity
  float gyroRate   = gx / 131.0f;                    // deg/s
  angle = 0.98f*(angle + gyroRate*dt) + 0.02f*accelAngle;   // fuse
  return angle;
}

void driveWheels(int u){
  setMotor(LEFT,  constrain(u + steer, -255, 255));
  setMotor(RIGHT, constrain(u - steer, -255, 255));
}

void setup(){
  Wire.begin(21,22); imu.initialize();
  motorInit(); last = micros();
}

void loop(){
  uint32_t now = micros();
  float dt = (now - last) * 1e-6f; last = now;       // fast loop dt
  if (dt <= 0 || dt > 0.05f) return;

  float tilt = readTilt(dt);

  if (fabs(tilt) > FALL){ driveWheels(0); integ=0; return; }  // fallen: cut

  float err = (tilt - SETPOINT_TRIM) - driveBias;    // drive by biasing setpoint
  integ = constrain(integ + err*dt, -50, 50);        // anti-windup
  float d = (err - prevErr)/dt; prevErr = err;
  int u = constrain((int)(Kp*err + Ki*integ + Kd*d), -255, 255);

  driveWheels(u);                                    // both wheels chase the fall
}`,
    explain: [
      { ref: 'angle = 0.98f*(angle + gyroRate*dt) + 0.02f*accelAngle;   // fuse', txt: 'Sensor fusion produces the stable, responsive tilt that balance depends on — the gyro for smoothness, the accelerometer to stop drift.' },
      { ref: 'float dt = (now - last) * 1e-6f; last = now;       // fast loop dt', txt: 'The loop measures its own timestep and runs fast, because a slow loop cannot catch an accelerating fall.' },
      { ref: 'if (fabs(tilt) > FALL){ driveWheels(0); integ=0; return; }  // fallen: cut', txt: 'On a fall the motors cut and the integrator resets, a safety stop and a clean restart when picked back up.' },
      { ref: 'float err = (tilt - SETPOINT_TRIM) - driveBias;    // drive by biasing setpoint', txt: 'Deliberate driving comes from biasing the balance set-point, so the robot leans and drives to chase it — you steer a balancer through its balance point.' },
      { ref: 'integ = constrain(integ + err*dt, -50, 50);        // anti-windup', txt: 'The integral is clamped to prevent wind-up, a practical necessity in a real PID loop.' },
    ],
  }],

  config: [
    'Configure the IMU, tilt-axis alignment and the complementary-filter coefficient.',
    'Configure PID gains (Kp/Ki/Kd) and the upright set-point trim.',
    'Configure the fall angle and motor cut-off.',
    'Configure loop rate and (optionally) drive/steer inputs.',
  ],
  calibration: [
    { h: 'Tilt estimate', p: [
      'Verify the fused tilt is stable at rest (no drift) and responsive when tipped; align the IMU to the true tilt axis.',
    ] },
    { h: 'Set-point trim', p: [
      'Trim the upright set-point so the robot balances without slowly driving off — compensating the real centre of mass.',
    ] },
    { h: 'PID gains', p: [
      'Raise Kp to hold (accepting oscillation), add Kd to damp, add a little Ki for drift; re-tune if mass/height changes.',
    ] },
  ],
  testing: [
    { step: 'Hold upright and release', expect: 'Balances hands-off' },
    { step: 'Nudge it', expect: 'Corrects and re-settles (no growing oscillation)' },
    { step: 'Check at rest', expect: 'Tilt estimate steady, no drift' },
    { step: 'Tip past the fall angle', expect: 'Motors cut (safety)' },
    { step: 'Command forward', expect: 'Leans and drives forward while balancing' },
    { step: 'Change battery/mass', expect: 'May need re-trim/re-tune (sensitivity)' },
  ],
  output: [
    'A robot that stands and stays upright on two wheels, recovers from nudges, and can drive while balancing.',
    { file: 'balance-loop.txt', lang: 'plain', body: `tilt: +1.8 deg (leaning forward)
fused: stable, dt = 3.1 ms (322 Hz)
PID -> drive: +58 (both wheels forward)
result: caught the fall -> tilt returning to 0
state: BALANCING` },
    'Leaning 1.8° forward, the fast loop drove both wheels forward and caught the fall — the tilt is already returning to upright. The whole robot is this correction, repeated hundreds of times a second.',
  ],
  troubleshoot: [
    { sym: 'Falls immediately', cause: 'Bad tilt estimate / wrong sign / gains too low', fix: 'Fix IMU alignment and fusion; check drive sign; raise Kp' },
    { sym: 'Oscillates and shakes apart', cause: 'Kp too high / no Kd / slow loop', fix: 'Add Kd; lower Kp; speed up the loop' },
    { sym: 'Slowly drives away', cause: 'Set-point/CoM off; no I', fix: 'Trim set-point; add small Ki; use encoders' },
    { sym: 'Drifts at rest (tilt)', cause: 'Gyro drift / poor fusion', fix: 'Tune complementary α; calibrate gyro bias' },
    { sym: 'Erratic when battery low', cause: 'Motor authority drops', fix: 'Monitor voltage; keep charged; scale output' },
    { sym: 'Drives off the table', cause: 'No fall cut-off', fix: 'Cut motors past the fall angle' },
  ],

  perf: [
    'Run the loop fast — hundreds of Hz — to catch fast falls.',
    'Fuse the IMU for a tilt that is both stable and responsive.',
    'Tune PID in order: P to hold, D to damp, I for drift.',
    'Cut motors on a fall for safety and a clean restart.',
  ],
  safety: [
    'Provide a motor cut-off on a large tilt so a fallen robot cannot drive off a table or into people.',
    'Keep fingers clear of the wheels; a balancing robot moves suddenly when correcting.',
    'Secure the battery and boards up high firmly — a shifting mass changes the balance point mid-run.',
    'Expect falls during tuning; test over a soft surface or with a tether.',
  ],
  maintenance: [
    'Re-trim/re-tune after any change to mass, height or wheels.',
    'Calibrate the gyro bias periodically; keep the IMU mount tight.',
    'Check motors/encoders for wear that introduces asymmetry.',
    'Keep the battery charged — sagging voltage degrades balance.',
  ],
  future: [
    'Upgrade to a Kalman filter for optimal tilt estimation.',
    'Add encoder-based velocity/position control for steady driving.',
    'Add remote control or autonomous driving while balancing.',
    'Add stand-up-from-fallen and disturbance-rejection tricks.',
  ],
  faq: [
    { q: 'Why does it fall without control?', a: 'Because upright is an unstable equilibrium — like a pencil on its point. Nothing mechanical holds it; only a controller that continuously senses the fall and drives the wheels to get back under the centre of mass keeps it up.' },
    { q: 'Why fuse two sensors for tilt?', a: 'The accelerometer gives an absolute tilt but is noisy; the gyroscope is smooth but drifts. A complementary (or Kalman) filter blends the gyro\'s short-term smoothness with the accelerometer\'s long-term stability into a tilt that is both responsive and drift-free — which balance requires.' },
    { q: 'What does each PID term do?', a: 'P drives harder the more it has leaned (catch the fall); D reacts to how fast it is falling (damps overshoot, stops oscillation); I trims small steady biases (off-centre mass) that would otherwise make it drift. All three, tuned, are needed.' },
    { q: 'Why must the loop be fast?', a: 'A fall accelerates. If the loop is too slow, the robot tips past the point of recovery before the next correction. Balancing needs the correction to happen while the tilt is still small — typically hundreds of times a second.' },
    { q: 'How do you make it drive somewhere?', a: 'You bias the balance set-point: lean it slightly forward and it "falls" forward and drives to chase the point, staying balanced the whole time. Steering adds a left/right wheel difference. You drive a balancer through its balance point, not by simply spinning the wheels.' },
  ],
  refs: [
    { t: 'Inverted pendulum', u: 'https://en.wikipedia.org/wiki/Inverted_pendulum', s: 'Reference' },
    { t: 'Self-balancing robot / personal transporter', u: 'https://en.wikipedia.org/wiki/Self-balancing_unicycle', s: 'Reference' },
    { t: 'PID controller', u: 'https://en.wikipedia.org/wiki/PID_controller', s: 'Reference' },
    { t: 'Complementary / Kalman filter', u: 'https://en.wikipedia.org/wiki/Kalman_filter', s: 'Reference' },
    { t: 'MPU6050 IMU', u: 'https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/', s: 'TDK InvenSense' },
  ],
  images: ['robot', 'motor', 'battery'],
  imageCaptions: [
    'A self-balancing robot is a real inverted pendulum — upright only because a fast control loop continuously catches its fall.',
    'An IMU senses tilt and sensor fusion turns noisy accelerometer and drifting gyro data into a stable balance angle.',
    'A tuned PID loop drives both wheels to chase the falling point — the clearest physical lesson in feedback control.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   095 — Warehouse AGV Prototype
   ══════════════════════════════════════════════════════════════════ */
{
  id: '095',
  domainKey: 'robotics',
  emoji: '📦', thumb: 'warehouse',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'A guided vehicle that takes jobs from a fleet manager, navigates a warehouse by markers, and moves goods between stations — the real logic behind automated warehouses.',

  overview: [
    'Automated warehouses run on fleets of <b>automated guided vehicles (AGVs)</b> — robots that carry goods between storage, picking and dispatch — and the interesting engineering is not one robot following a line, but the <b>system</b>: a fleet manager that hands out jobs, vehicles that navigate a known layout to specific destinations, and traffic rules that stop them colliding at junctions. This project builds a prototype AGV that captures that system honestly: it <b>accepts transport jobs</b> from a central manager, <b>navigates</b> a marked warehouse to the pickup and drop-off, and handles the <b>fleet realities</b> of junctions, right-of-way and safe stopping.',
    'The vehicle navigates by following guide paths (line or magnetic tape) with junction <b>markers/tags</b> that tell it where it is in the layout, so it can route from its current node to a target node — the difference between a toy line-follower (which just stays on the line) and an AGV (which goes to a <i>named destination</i> by choosing turns at junctions). Over the top sits the <b>fleet layer</b>: a manager assigns "move pallet from A to B" jobs to free vehicles, each vehicle reports its position and status, and simple <b>traffic management</b> (junction reservations, right-of-way, stop-on-obstacle) keeps multiple vehicles from colliding or deadlocking.',
    'The value is showing the whole loop that a real automated warehouse runs on — job dispatch, destination navigation, and fleet traffic control — in a buildable prototype. It is honest that industrial AGVs use far more sophisticated navigation (laser/vision SLAM, natural-feature localisation) and fleet software with robust deadlock handling and safety-rated obstacle detection, and that this is a prototype of the <i>logic</i>, not a production vehicle. But as an AGV that takes jobs, routes to destinations by markers, and cooperates with a fleet through junction traffic rules, it teaches the genuine architecture of warehouse automation — the part that is about systems and coordination, not just staying on a line.',
  ],
  does: [
    'Accepts transport jobs (move from A to B) from a fleet manager',
    'Navigates a marked warehouse to named destinations',
    'Routes by choosing turns at junction markers/tags',
    'Reports position and status to the manager',
    'Manages junction traffic (reservations, right-of-way)',
    'Stops for obstacles and resumes safely',
    'Demonstrates the real architecture of warehouse automation',
  ],
  features: [
    'Guide-path following with junction markers',
    'Node-to-node routing (destination navigation)',
    'Central job dispatch to a vehicle fleet',
    'Position/status reporting',
    'Junction traffic management (anti-collision)',
    'Obstacle stop and safe resume',
    'Honest about SLAM/safety-rated production AGVs',
  ],
  applications: [
    { t: 'Warehouse automation learning', d: 'The dispatch → navigate → traffic loop of automated warehouses.' },
    { t: 'AGV fleet prototyping', d: 'Testing job assignment and traffic rules with real vehicles.' },
    { t: 'Intralogistics research', d: 'Routing, coordination and deadlock handling in miniature.' },
    { t: 'Robotics systems education', d: 'Moving from single-robot to multi-robot fleet thinking.' },
  ],
  skills: [
    'Guide-path following with junction/marker detection',
    'Node-to-node routing (choosing turns to a destination)',
    'Central job dispatch and vehicle status reporting',
    'Junction traffic management / anti-collision',
    'Obstacle handling and safe resume',
  ],
  prereq: [
    'An AGV goes to a named destination — it routes at junctions, not just follows a line.',
    'The system is the point: dispatch + navigation + fleet traffic control.',
    'Traffic management (junction reservations/right-of-way) prevents collisions/deadlock.',
    'This prototypes the logic; production AGVs use SLAM and safety-rated sensing.',
  ],

  parts: ['esp32', 'ir_sensor', 'vl53l0x', 'n20', 'l298n', 'li18650'],
  extraParts: [
    { name: 'Guide-path sensor', spec: 'IR line array (or magnetic-tape sensor) + junction detection', qty: 1, price: 400, note: 'Follows the path; reads junction markers' },
    { name: 'Marker/tag reader', spec: 'Node identification at junctions (RFID/colour/pattern)', qty: 1, price: 300 },
    { name: 'Drive base + load bed', spec: 'Differential-drive base with a small load bed', qty: 1, price: 900 },
    { name: 'Obstacle sensor', spec: 'ToF/ultrasonic for stop-on-obstacle', qty: 1, price: 250 },
  ],
  cost: '₹3,000 – ₹5,500 per vehicle',
  libs: ['wifi', 'pubsub', 'preferences', 'arduinojson'],

  pins: {
    left: [
      { dev: 'Guide-path array', devPin: 'S1..S6', pin: 'GPIO 32..36', sig: 'Path + junctions' },
      { dev: 'Marker reader', devPin: 'data', pin: 'GPIO 21/22', sig: 'Node ID' },
      { dev: 'Obstacle ToF', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Stop distance' },
    ],
    right: [
      { dev: 'Motor driver L', devPin: 'PWM/IN', pin: 'GPIO 25/26', sig: 'Left wheel' },
      { dev: 'Motor driver R', devPin: 'PWM/IN', pin: 'GPIO 27/14', sig: 'Right wheel' },
      { dev: 'Wi-Fi', devPin: 'onboard', pin: '—', sig: 'Fleet manager link' },
      { dev: 'Battery', devPin: '+', pin: 'VIN', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Use a guide-path sensor for following plus junction detection, and a marker reader to identify nodes.',
    'Add a ToF/ultrasonic obstacle sensor for a safe stop.',
    'Connect over Wi-Fi to the fleet manager for jobs and status.',
    'Differential drive through an H-bridge as in any line-guided robot.',
    'Keep the load bed over the drive centre so loads do not upset steering.',
  ],

  block: { columns: [
    { label: 'Fleet manager', edge: 'right', blocks: [
      { name: 'Job queue', sub: 'A→B', highlight: true },
      { name: 'Assign', sub: 'to free AGV' },
    ] },
    { label: 'Navigate', edge: 'right', blocks: [
      { name: 'Follow path', sub: 'guide line' },
      { name: 'Route', sub: 'node→node', highlight: true },
    ] },
    { label: 'Traffic', edge: 'right', blocks: [
      { name: 'Junction', sub: 'reserve/right-of-way' },
      { name: 'Obstacle', sub: 'stop' },
    ] },
    { label: 'Deliver', edge: 'none', blocks: [
      { name: 'Pick/drop', sub: 'at station' },
      { name: 'Report', sub: 'status/pos' },
    ] },
  ] },
  flow: [
    { t: 'Manager assigns job (A→B)', k: 'start' },
    { t: 'Route to pickup node A', k: 'proc' },
    { t: 'At junction: reserved/clear?', k: 'dec', yes: 'Cross junction', no: 'Wait (right-of-way)' },
    { t: 'Wait (right-of-way)', k: 'io', back: 'At junction: reserved/clear?' },
    { t: 'Cross junction', k: 'io' },
    { t: 'Obstacle ahead?', k: 'dec', yes: 'Stop, then resume', no: 'Continue to node' },
    { t: 'Stop, then resume', k: 'io' },
    { t: 'Continue to node', k: 'proc' },
    { t: 'Pick at A, deliver to B, report done', k: 'end', back: 'Manager assigns job (A→B)' },
  ],

  principle: [
    'The line-following robot answers "how do I stay on a path?"; the AGV answers a bigger question — "how does a <b>fleet</b> of vehicles get the right goods to the right places without colliding?" — and that is the real subject of warehouse automation. Three things distinguish an AGV system from a lone follower: it goes to <b>named destinations</b> (not just along a line), it takes <b>jobs from a manager</b> (not a fixed loop), and it <b>shares space with other vehicles</b> under traffic rules. This prototype exists to make those three system-level ideas concrete and buildable, because they, not the line-following, are what warehouse automation is actually about.',
    '<b>Destination navigation</b> is the first step up. The vehicle still follows a guide path, but the warehouse is modelled as a <b>graph of nodes</b> (stations and junctions) connected by path segments, and <b>markers or tags</b> at junctions tell the vehicle which node it has reached. To go from its current node to a target node it computes a <b>route</b> — a sequence of "at junction X, turn left/right/straight" decisions — and executes it. That turns "follow the line" into "go to station B", which is the qualitative leap: the vehicle knows <i>where it is</i> in the layout and chooses turns to reach a <i>specific</i> place.',
    'The <b>fleet layer</b> is where the system becomes a system. A central <b>manager</b> holds a queue of transport jobs ("move a load from A to B") and <b>assigns</b> each to a free vehicle — the same dispatch logic that drives a real automated warehouse, deciding which robot does what. Each vehicle <b>reports its position and status</b> (idle, en route to pickup, carrying, blocked) so the manager knows the state of the fleet and can assign sensibly. This is the difference between a robot and a robot <i>fleet</i>: work is allocated centrally and vehicles are coordinated rather than acting alone.',
    'The hardest and most system-defining part is <b>traffic management</b>, because multiple vehicles on shared paths will otherwise collide or deadlock. The prototype uses the same ideas as real fleets in miniature: a junction is a shared resource that a vehicle must <b>reserve</b> before entering and release after clearing, so two vehicles never occupy it at once; <b>right-of-way</b> rules (and reservation ordering) decide who waits; and every vehicle <b>stops for obstacles</b> and resumes safely. Getting this right means thinking about deadlock (two vehicles each waiting for the other) and starvation, which is exactly the thinking industrial fleet software is built around. The design is candid about the gap to production: real AGVs navigate with <b>laser or vision SLAM</b> and natural-feature localisation rather than markers, carry <b>safety-rated</b> obstacle detection, and run fleet software with rigorous deadlock-free traffic control — this is a prototype of the <i>logic and architecture</i>, not a production vehicle. But by taking jobs from a manager, routing to destinations by markers, and cooperating through junction traffic rules, it teaches the genuine shape of warehouse automation: a coordinated fleet doing dispatched work in shared space, which is the part that matters and the part a single line-follower never touches.',
  ],
  equations: [
    { t: 'Node-to-node routing', eq: 'Warehouse = graph G(nodes, path-segments).\nTo go from current node to target:\n\n  route = shortest_path(G, current, target)\n  → sequence of junction turns [L/R/straight,...]\n\nAt each junction marker: pop the next turn and take it.\n"Follow line" becomes "go to station B".' },
    { t: 'Junction reservation (anti-collision)', eq: 'A junction J is a shared resource:\n\n  before entering J: acquire lock(J)   (else WAIT)\n  after clearing  J: release lock(J)\n\nNo two vehicles hold J at once. Right-of-way / ordering\nbreaks ties. Avoid deadlock (cyclic waits) and starvation.' },
    { t: 'Job assignment', eq: 'Manager holds jobs {A→B, ...} and vehicles {idle, busy}.\n\n  assign job → nearest/available idle vehicle\n  vehicle reports: {pos, state}  (idle/toPickup/carrying/blocked)\n\nCentral dispatch = a fleet, not lone robots.' },
  ],

  robotics: {
    mechanical: [
      'Differential-drive base with a guide-path sensor at the front, a small load bed over the drive centre, and an obstacle sensor.',
      'A marker/tag reader positioned to detect node identifiers at junctions and stations.',
      'Load bed centred so goods do not shift the balance or upset path following.',
      'Rugged, low build suited to repeated station-to-station running.',
    ],
    motion: [
      'Motion combines path following (differential-drive PID on the guide line, as in a line-follower) with discrete junction manoeuvres — at a marked junction the vehicle executes the routed turn (left/right/straight) rather than blindly following the line.',
      'Between junctions it cruises the path; at junctions it consults its route and traffic clearance before proceeding, and it stops entirely for obstacles or when a junction is reserved by another vehicle.',
    ],
    motionTable: [
      { s: 'On path segment', l: 'Follow (PID)', r: 'Follow (PID)', o: 'Cruise to next node' },
      { s: 'At junction, route = left', l: 'Slow/reverse', r: 'Forward', o: 'Take left branch' },
      { s: 'At junction, route = straight', l: 'Forward', r: 'Forward', o: 'Cross straight' },
      { s: 'Junction reserved by other', l: 'Stop', r: 'Stop', o: 'Wait (right-of-way)' },
      { s: 'Obstacle ahead', l: 'Stop', r: 'Stop', o: 'Halt, then resume' },
      { s: 'At destination station', l: 'Stop', r: 'Stop', o: 'Pick/drop, report done' },
    ],
    sensors: [
      'Guide-path sensor: follows the path and detects junctions.',
      'Marker/tag reader: identifies the current node in the layout graph.',
      'Obstacle sensor (ToF/ultrasonic): safe stop before collision.',
    ],
    actuators: [
      'Two geared DC motors via an H-bridge for differential drive, executing both path following and routed junction turns.',
      'A load actuator (optional) to pick/release the carried goods at stations; status LEDs for state.',
    ],
    kinematics: {
      text: [
        'Vehicle motion is differential drive; the system-level "kinematics" is graph routing — turning a destination into a sequence of junction turns over the warehouse layout.',
      ],
      eq: `Drive:   v = (v_R+v_L)/2,  omega = (v_R−v_L)/L   # differential
Routing: route = shortest_path(layout_graph, here, target)
         at junction j:  turn = route.next()          # L/R/straight
Traffic: enter j only if reserve(j) succeeds; release after`,
    },
  },

  assembly: [
    { h: 'Build the routing-capable vehicle', p: [
      'Assemble the differential-drive base with a guide-path sensor, a marker/tag reader for node identification, an obstacle sensor, and Wi-Fi to the fleet manager.',
    ], warn: 'This is a prototype of AGV logic, not a safety-rated vehicle. Keep it slow, keep an obstacle stop, and do not treat marker-based navigation as a substitute for the SLAM and safety-rated sensing production AGVs require.' },
    { h: 'Model the layout and add routing', p: [
      'Represent the warehouse as a node graph, detect junction markers, and route from the current node to a destination as a sequence of turns.',
    ] },
    { h: 'Add fleet dispatch and traffic management', p: [
      'Connect to a central manager for jobs and status, and add junction reservations/right-of-way plus obstacle stopping for multi-vehicle safety.',
    ] },
  ],
  steps: [
    { h: 'Route to a destination by junction markers', p: [
      'Compute a route over the layout graph and, at each junction marker, take the next turn toward the destination.',
    ], code: {
      file: 'route.py', lang: 'python',
      body: `import heapq

def shortest_path(graph, start, goal):
    # Dijkstra over the warehouse node graph -> ordered node list
    pq = [(0, start, [start])]; seen = set()
    while pq:
        cost, node, path = heapq.heappop(pq)
        if node == goal: return path
        if node in seen: continue
        seen.add(node)
        for nxt, w in graph[node].items():
            if nxt not in seen:
                heapq.heappush(pq, (cost+w, nxt, path+[nxt]))
    return None

def turn_at(junction, path):
    # given the planned path, which way to turn at this junction node
    i = path.index(junction)
    return DIRECTION[(path[i-1], junction, path[i+1])]   # L / R / straight

class AGV:
    def __init__(self, graph): self.graph = graph
    def goto(self, here, target):
        self.path = shortest_path(self.graph, here, target)   # named destination
        follow_line_until_junction()
    def on_junction(self, node):
        t = turn_at(node, self.path)      # route decides the turn
        execute_turn(t)                   # not just follow the line`,
      explain: [
        { ref: 'def shortest_path(graph, start, goal):', txt: 'The warehouse is a graph and the route is a shortest path over it — the vehicle plans how to reach a named destination, not just where the line goes.' },
        { ref: 'def turn_at(junction, path):', txt: 'At each junction the planned route determines the turn, which is exactly what makes this an AGV (goes to a destination) rather than a line-follower (stays on the line).' },
        { ref: 'self.path = shortest_path(self.graph, here, target)   # named destination', txt: 'A job resolves to a route from the current node to the target node — destination navigation.' },
        { ref: 'execute_turn(t)                   # not just follow the line', txt: 'The vehicle actively takes the routed branch at a junction, the qualitative leap over blind line following.' },
      ],
    } },
    { h: 'Take jobs and manage junction traffic', p: [
      'Accept jobs from the manager, report status, and reserve junctions (with right-of-way) so multiple vehicles never collide or deadlock; stop for obstacles.',
    ], tip: 'Treat every junction as a lock a vehicle must acquire before entering and release after clearing — that single discipline is what prevents fleet collisions and, handled with ordering, deadlock.' },
  ],

  code: [{
    file: 'agv_vehicle.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Warehouse AGV Prototype — vehicle node

Takes transport jobs from a central fleet manager, routes to named
destinations over the warehouse graph by junction markers, and
cooperates with other vehicles via junction reservations + right-of-way.
Stops for obstacles. A prototype of AGV LOGIC, not a production vehicle.
"""
import json

class AGV:
    def __init__(self, vid, graph, fleet):
        self.vid = vid; self.graph = graph; self.fleet = fleet
        self.state = "idle"; self.node = "depot"; self.path = []

    def report(self):                                  # fleet visibility
        self.fleet.publish(f"agv/{self.vid}/status",
            {"pos": self.node, "state": self.state})

    def take_job(self, job):                            # dispatched A->B
        self.state = "to_pickup"; self.report()
        self.run_to(job["from"])                        # navigate to A
        pick_load()
        self.state = "carrying"; self.report()
        self.run_to(job["to"])                          # navigate to B
        drop_load()
        self.state = "idle"; self.report()
        self.fleet.publish(f"agv/{self.vid}/done", job)

    def run_to(self, target):
        self.path = shortest_path(self.graph, self.node, target)
        for junction in self.path[1:]:
            follow_path()                               # PID line follow
            while obstacle_ahead():                     # safe stop
                stop(); self.state = "blocked"; self.report()
            if not self.fleet.reserve(junction, self.vid):   # traffic
                wait_for(junction)                      # right-of-way
            execute_turn(turn_at(junction, self.path))  # routed turn
            self.node = junction
            self.fleet.release(junction, self.vid)
            self.report()

if __name__ == "__main__":
    agv = AGV("AGV-3", WAREHOUSE_GRAPH, FleetLink())
    while True:
        job = agv.fleet.next_job_for(agv.vid)           # central dispatch
        if job: agv.take_job(job)`,
    explain: [
      { ref: 'def take_job(self, job):                            # dispatched A->B', txt: 'The vehicle executes a transport job assigned by the manager — pick at A, carry, drop at B — the dispatched-work model of a real fleet.' },
      { ref: 'self.path = shortest_path(self.graph, self.node, target)', txt: 'Each leg resolves to a route over the warehouse graph, so the vehicle navigates to a named node rather than just following a line.' },
      { ref: 'while obstacle_ahead():                     # safe stop', txt: 'The vehicle stops for obstacles and reports itself blocked before resuming — basic safety and fleet visibility.' },
      { ref: 'if not self.fleet.reserve(junction, self.vid):   # traffic', txt: 'A junction must be reserved before entry; if another vehicle holds it, this one waits — the anti-collision heart of fleet traffic management.' },
      { ref: 'job = agv.fleet.next_job_for(agv.vid)           # central dispatch', txt: 'Jobs come from a central manager, so the fleet does allocated work rather than each robot acting alone.' },
    ],
  }],

  config: [
    'Configure the warehouse node graph, junction markers and station nodes.',
    'Configure the fleet-manager link, job format and status reporting.',
    'Configure junction reservation/right-of-way and obstacle-stop distance.',
    'Configure path-following (PID) and junction-turn behaviour.',
  ],
  calibration: [
    { h: 'Navigation', p: [
      'Verify path following and reliable junction/marker detection so routing turns are taken correctly.',
    ] },
    { h: 'Traffic', p: [
      'Test two vehicles at a shared junction: confirm reservation/right-of-way prevents collision and avoids deadlock.',
    ] },
    { h: 'Obstacle stop', p: [
      'Verify the vehicle stops before contact and resumes safely.',
    ] },
  ],
  testing: [
    { step: 'Assign a job A→B', expect: 'Routes to A, picks, routes to B, drops, reports done' },
    { step: 'Reach a junction with a route turn', expect: 'Takes the correct branch (not blind follow)' },
    { step: 'Two vehicles at one junction', expect: 'One reserves and crosses; the other waits' },
    { step: 'Block a vehicle', expect: 'Stops, reports blocked, resumes when clear' },
    { step: 'Query the fleet', expect: 'Each vehicle\'s position/state visible to the manager' },
    { step: 'Create a potential deadlock', expect: 'Ordering/right-of-way resolves it (no lock-up)' },
  ],
  output: [
    'A vehicle that takes dispatched jobs, routes to destinations by markers, and cooperates with a fleet through junction traffic rules.',
    { file: 'agv-status.json', lang: 'json', body: `{
  "vid": "AGV-3",
  "job": { "from": "A12", "to": "D04" },
  "pos": "J7",
  "state": "carrying",
  "route": ["A12","J7","J9","D04"],
  "waiting_for": null
}` },
    'AGV-3 is carrying a load from A12 to D04, currently at junction J7 with its route planned ahead and no traffic wait — the dispatch, navigation and traffic loop of an automated warehouse in miniature.',
  ],
  troubleshoot: [
    { sym: 'Takes wrong turn at junction', cause: 'Marker/route mismatch', fix: 'Verify node identification and the routing turn logic' },
    { sym: 'Two vehicles collide at a junction', cause: 'No/faulty reservation', fix: 'Enforce junction locks before entry; add right-of-way' },
    { sym: 'Vehicles deadlock', cause: 'Cyclic waits', fix: 'Order reservations; detect/break cycles; add timeouts' },
    { sym: 'Ignores obstacles', cause: 'No/short obstacle stop', fix: 'Add a reliable stop distance; report blocked' },
    { sym: 'Manager loses track', cause: 'No status reporting', fix: 'Report position/state at each node/transition' },
    { sym: 'Jobs not completing', cause: 'Dispatch/state errors', fix: 'Verify job lifecycle and done-reporting' },
  ],

  perf: [
    'Route node-to-node so vehicles reach named destinations.',
    'Reserve junctions and apply right-of-way to prevent collisions/deadlock.',
    'Report position/state so the manager can dispatch well.',
    'Stop for obstacles and resume safely.',
  ],
  safety: [
    'This is a prototype of AGV logic, not a safety-rated vehicle — keep speeds low and always include an obstacle stop.',
    'Production AGVs require safety-rated obstacle detection; do not deploy this around people or valuable goods as if it were.',
    'Design traffic rules to be deadlock-free; a stuck fleet can be a hazard as well as an outage.',
    'Secure loads on the bed so they cannot fall during turns or stops.',
  ],
  maintenance: [
    'Keep guide paths and markers clean and intact for reliable navigation.',
    'Re-verify traffic rules when the layout or fleet size changes.',
    'Check obstacle sensors and drive wear.',
    'Review job/traffic logs for recurring blocks or near-deadlocks.',
  ],
  future: [
    'Upgrade navigation to laser/vision SLAM (markerless).',
    'Add dynamic re-routing around blocked segments.',
    'Add battery-aware dispatch and auto-charging.',
    'Add robust deadlock-free traffic algorithms and safety-rated sensing.',
  ],
  faq: [
    { q: 'How is an AGV different from a line-follower?', a: 'A line-follower just stays on the line. An AGV goes to a named destination — it models the layout as a graph, identifies where it is by junction markers, and chooses turns to route to a specific station. It also takes jobs from a manager and shares space with other vehicles under traffic rules.' },
    { q: 'How do multiple vehicles avoid colliding?', a: 'Through traffic management: each junction is a shared resource a vehicle must reserve before entering and release after clearing, with right-of-way rules deciding who waits. This prevents two vehicles occupying a junction at once, and with careful ordering it avoids deadlock.' },
    { q: 'What does the fleet manager do?', a: 'It holds a queue of transport jobs and assigns each to a free vehicle, tracks every vehicle\'s position and status, and coordinates the fleet — so the robots do allocated work centrally rather than each acting alone.' },
    { q: 'What is deadlock and why does it matter?', a: 'Deadlock is when vehicles each wait for a junction the other holds, so none can move — the fleet freezes. Real AGV traffic control is built around preventing it (via reservation ordering, cycle detection, timeouts), which is why this prototype models junction reservations explicitly.' },
    { q: 'How close is this to a real warehouse AGV?', a: 'It captures the real architecture — dispatch, destination navigation, fleet traffic control — but production AGVs navigate with laser/vision SLAM instead of markers, carry safety-rated obstacle detection, and run rigorously deadlock-free fleet software. This prototypes the logic, not the production vehicle.' },
  ],
  refs: [
    { t: 'Automated guided vehicle', u: 'https://en.wikipedia.org/wiki/Automated_guided_vehicle', s: 'Reference' },
    { t: 'Warehouse automation', u: 'https://en.wikipedia.org/wiki/Automated_storage_and_retrieval_system', s: 'Reference' },
    { t: 'Multi-robot task allocation', u: 'https://en.wikipedia.org/wiki/Multi-robot_task_allocation', s: 'Reference' },
    { t: 'Deadlock', u: 'https://en.wikipedia.org/wiki/Deadlock', s: 'Reference' },
    { t: 'Dijkstra shortest path', u: 'https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm', s: 'Reference' },
  ],
  images: ['warehouse', 'robot', 'factory'],
  imageCaptions: [
    'A warehouse AGV takes dispatched jobs and routes to named destinations — the real architecture of warehouse automation, not just line following.',
    'Junction markers let the vehicle know where it is in the layout graph and choose turns toward its destination.',
    'Junction reservations and right-of-way let a fleet share paths without colliding or deadlocking.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   096 — Telepresence Robot
   ══════════════════════════════════════════════════════════════════ */
{
  id: '096',
  domainKey: 'robotics',
  emoji: '📹', thumb: 'robot',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A mobile video-call on wheels — you drive it around a remote place and see, hear and speak through it, putting your presence somewhere your body is not.',

  overview: [
    'A video call lets you talk to a remote place; a <b>telepresence robot</b> lets you <i>be</i> there — a screen, camera, microphone and speaker on a mobile base that you drive from anywhere, so you can move through a remote space, look around, and hold conversations as if you were physically present. It is used for remote work and site visits, for doctors to round on patients, for people to attend school or events they cannot travel to. This project builds one: a wheeled robot that streams two-way audio and video and that you steer remotely over the network, turning a static video call into embodied remote presence.',
    'Two subsystems make it work. The first is <b>real-time two-way audio/video</b>: a camera and microphone on the robot stream to the remote pilot, and the pilot\'s voice (and optionally face) stream back to a speaker and screen on the robot — low-latency enough for natural conversation and for driving by what you see. The second is <b>remote teleoperation</b>: the pilot\'s drive commands travel over the network to the robot\'s differential-drive base, so they can move it around, with the video as their eyes. The engineering challenge that ties them together is <b>latency</b> — laggy video makes driving into a frustrating guessing game — and <b>safe remote driving</b>, since a pilot seeing a delayed, narrow camera view can easily hit things.',
    'Because you drive by a delayed video feed through a limited field of view, the robot must protect against the pilot\'s blind spots: an <b>obstacle stop</b> that overrides commands before a collision, sensible speed limits, and a <b>safe stop</b> if the connection drops (a robot that keeps driving when it loses its pilot is dangerous). It is honest that good telepresence is fundamentally about connectivity quality and latency, that a small robot is a prototype of the interaction rather than a commercial product, and that driving a robot in a real space where people move demands genuine care. But as a mobile, network-driven, two-way audio/video robot with obstacle protection and safe-stop, it delivers the real thing — your presence, moving, in a place your body is not.',
  ],
  does: [
    'Streams two-way audio and video between robot and remote pilot',
    'Lets the pilot drive the robot remotely over the network',
    'Moves through a remote space as the pilot\'s embodied presence',
    'Keeps latency low enough for natural conversation and driving',
    'Overrides driving to stop before obstacles (pilot blind spots)',
    'Safe-stops if the connection drops',
    'Puts your presence where your body is not',
  ],
  features: [
    'Real-time two-way A/V streaming',
    'Network teleoperation of a mobile base',
    'Low-latency, drive-by-video control',
    'Obstacle-stop override (blind-spot protection)',
    'Connection-loss safe stop + speed limits',
    'Camera pan / look-around (optional)',
    'Honest about connectivity/latency and safe remote driving',
  ],
  applications: [
    { t: 'Remote work / site presence', d: 'Moving through an office, lab or site from elsewhere.' },
    { t: 'Healthcare rounding', d: 'Clinicians visiting patients remotely with two-way A/V.' },
    { t: 'Remote attendance', d: 'Attending school, events or tours you cannot travel to.' },
    { t: 'Remote inspection', d: 'Driving through a space to look around remotely.' },
  ],
  skills: [
    'Real-time two-way audio/video streaming (low latency)',
    'Network teleoperation and command latency handling',
    'Differential-drive control from remote commands',
    'Safety overrides: obstacle stop, connection-loss stop',
    'Drive-by-video UX considerations',
  ],
  prereq: [
    'Telepresence = embodied presence: two-way A/V plus remote driving.',
    'Latency is the core challenge — laggy video makes driving a guessing game.',
    'You drive by a delayed, narrow view — protect against blind spots.',
    'A robot that keeps driving when it loses its pilot is dangerous — safe-stop.',
  ],

  parts: ['rpi4', 'picam', 'bo_motor', 'l298n', 'hcsr04', 'li18650'],
  extraParts: [
    { name: 'Camera + mic + speaker', spec: 'Camera, microphone and speaker for two-way A/V', qty: 1, price: 900, note: 'The presence hardware' },
    { name: 'Screen (optional)', spec: 'Small display to show the pilot\'s face', qty: 1, price: 800 },
    { name: 'Mobile base + tall mast', spec: 'Differential-drive base with camera at head height', qty: 1, price: 1200 },
    { name: 'Obstacle sensors', spec: 'Ultrasonic/ToF ring for blind-spot protection', qty: 1, price: 300 },
  ],
  cost: '₹5,000 – ₹9,000',
  libs: ['python', 'opencv', 'picamera2', 'flask', 'gpiozero'],

  pins: {
    left: [
      { dev: 'Camera', devPin: 'CSI/USB', pin: '—', sig: 'Video to pilot' },
      { dev: 'Microphone', devPin: 'USB/I2S', pin: '—', sig: 'Audio to pilot' },
      { dev: 'Obstacle ring', devPin: 'TRIG/ECHO', pin: 'GPIO', sig: 'Blind-spot stop' },
    ],
    right: [
      { dev: 'Speaker', devPin: 'USB/DAC', pin: '—', sig: 'Pilot\'s voice' },
      { dev: 'Motor driver', devPin: 'IN/EN', pin: 'GPIO', sig: 'Differential drive' },
      { dev: 'Screen (opt)', devPin: 'HDMI/DSI', pin: '—', sig: 'Pilot\'s face' },
      { dev: 'Battery', devPin: '+', pin: 'VIN', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Mount the camera and screen high (head height) for natural presence; keep the mic/speaker clear for good audio.',
    'Drive the base through an H-bridge; the Raspberry Pi handles A/V streaming and command reception.',
    'Fit an obstacle sensor ring to cover the pilot\'s blind spots around the base.',
    'Ensure a good network link (Wi-Fi) — connectivity quality dominates the experience.',
    'Provide a watchdog so motors stop if commands stop arriving (lost pilot).',
  ],

  block: { columns: [
    { label: 'Robot senses', edge: 'right', blocks: [
      { name: 'Camera+mic', sub: 'capture', highlight: true },
      { name: 'Encode', sub: 'low-latency' },
    ] },
    { label: 'Network', edge: 'right', blocks: [
      { name: 'Stream A/V', sub: 'both ways', highlight: true },
      { name: 'Drive cmds', sub: 'pilot → robot' },
    ] },
    { label: 'Pilot', edge: 'right', blocks: [
      { name: 'See/hear/speak', sub: 'remote' },
      { name: 'Drive', sub: 'by video' },
    ] },
    { label: 'Protect', edge: 'none', blocks: [
      { name: 'Obstacle stop', sub: 'blind spots' },
      { name: 'Lost link', sub: 'safe stop' },
    ] },
  ] },
  flow: [
    { t: 'Robot captures A/V; pilot sees/hears', k: 'start' },
    { t: 'Pilot sends drive command', k: 'io' },
    { t: 'Connection alive?', k: 'dec', yes: 'Check obstacle before moving', no: 'Safe stop (lost pilot)' },
    { t: 'Safe stop (lost pilot)', k: 'io' },
    { t: 'Check obstacle before moving', k: 'proc' },
    { t: 'Obstacle in the way?', k: 'dec', yes: 'Override: stop', no: 'Drive (differential)' },
    { t: 'Override: stop', k: 'io' },
    { t: 'Drive (differential)', k: 'end', back: 'Robot captures A/V; pilot sees/hears' },
  ],

  principle: [
    'Telepresence turns communication into <b>presence</b>. A phone or video call sends your voice and image to a fixed point; a telepresence robot gives that call a <b>body you control</b> — it can move through the remote space, turn to look, approach a person, follow along a corridor — so instead of being a face on a screen in one room you are a mobile participant who can go where the conversation goes. That mobility is the whole difference: presence you can <i>direct</i>. Achieving it means marrying two subsystems that each have to work well and, harder, work well <i>together</i> over a network.',
    'The first subsystem is <b>real-time two-way audio and video</b>. The robot captures video and audio and streams them to the remote pilot; the pilot\'s voice — and usually their face on the robot\'s screen — streams back. Both directions must be <b>low-latency</b>, because this feed is doing double duty: it carries the conversation (and lag makes people talk over each other) and it is the pilot\'s <b>eyes for driving</b>. Video compression, network transport and buffering all trade latency against quality, and telepresence lives or dies on getting that trade right — which is why good telepresence is, at heart, a <b>connectivity and latency</b> problem more than a mechanical one.',
    'The second subsystem is <b>remote teleoperation</b>. The pilot\'s steering commands travel over the network to the robot\'s differential-drive base, and the pilot drives by what the camera shows them. This closes a control loop that runs <i>through a human and a network</i>: see (delayed video) → decide → command (delayed) → robot moves → see the result (delayed again). Every delay in that loop makes driving harder, turning a laggy connection into a frustrating guessing game where the robot is always a moment behind the pilot\'s intent. Designing for this means keeping latency low, keeping speeds modest, and giving the pilot a view wide enough to drive by.',
    'The consequence that dominates the design is <b>safe remote driving</b>, because the pilot is fundamentally handicapped: they see a <b>delayed image through a narrow field of view</b>, missing things a physically-present person would notice — the table leg just out of frame, the person stepping in from the side, the delay between deciding to stop and the robot stopping. So the robot cannot simply obey; it must <b>protect against the pilot\'s blind spots</b>. An <b>obstacle stop</b> overrides drive commands to halt before a collision the pilot did not see; speed is limited so the delayed loop stays controllable; and — critically — a <b>connection-loss safe stop</b> ensures a robot that loses its pilot <b>stops</b> rather than continuing blindly (a driverless robot rolling through a space is a real hazard). The design is honest that this is a prototype of the <i>interaction</i>: a small robot demonstrates the presence and the driving, but a commercial unit invests heavily in connectivity, latency, camera coverage and safety, and driving any robot through a space where people move demands genuine care. Within that honest frame, it delivers the real experience — see, hear, speak and <i>move</i> through a place your body is not — which is what makes telepresence more than a video call.',
  ],
  equations: [
    { t: 'Teleoperation loop latency', eq: 'Total control latency the pilot feels:\n\n  T = T_capture + T_encode + T_uplink\n    + T_network + T_downlink + T_decode + T_display\n    + T_command_back\n\nEvery term adds lag between intent and seeing the result.\nLow T → natural driving; high T → a guessing game.' },
    { t: 'Safe speed vs latency', eq: 'Distance travelled before the pilot can react to a hazard:\n\n  d_react = v × (T_video + T_human + T_command)\n\nKeep d_react small: limit speed v as latency rises, and let\nthe robot\'s own obstacle stop cover what the pilot misses.' },
    { t: 'Safety overrides', eq: 'Robot obeys the pilot ONLY if safe:\n\n  if obstacle within d_stop:      override → STOP\n  if no command for t_timeout:    lost pilot → SAFE STOP\n  v ≤ v_max                        (bounded speed)\n\nA robot that keeps driving without its pilot is dangerous.' },
  ],

  robotics: {
    mechanical: [
      'Differential-drive base with a tall mast placing the camera and screen at head height for natural, eye-level presence.',
      'Camera, microphone and speaker positioned for a clear two-way view and good audio; optional screen shows the pilot\'s face.',
      'An obstacle-sensor ring around the base covering the pilot\'s blind spots.',
      'Stable, not top-heavy despite the mast — it must not tip when starting/stopping.',
    ],
    motion: [
      'Motion is differential drive commanded remotely: the pilot sends forward/turn intents and the base executes them, but every command passes through a safety filter first.',
      'The robot moves deliberately and at limited speed, because the pilot drives through a delayed, narrow view; the robot\'s own obstacle stop overrides motion the pilot cannot see is unsafe.',
    ],
    motionTable: [
      { s: 'Pilot: forward (clear)', l: 'Forward', r: 'Forward', o: 'Drive ahead (bounded speed)' },
      { s: 'Pilot: turn', l: 'Faster', r: 'Slower', o: 'Turn to look/steer' },
      { s: 'Obstacle in path', l: 'Stop', r: 'Stop', o: 'Override pilot: halt' },
      { s: 'Command lag/jitter', l: 'Ease', r: 'Ease', o: 'Smooth, limited response' },
      { s: 'Connection lost', l: 'Stop', r: 'Stop', o: 'Safe stop (no pilot)' },
      { s: 'Idle (conversing)', l: 'Hold', r: 'Hold', o: 'Stationary presence' },
    ],
    sensors: [
      'Camera + microphone: the pilot\'s eyes and ears (and the video they drive by).',
      'Obstacle sensor ring (ultrasonic/ToF): covers blind spots for the override stop.',
      'Connection/heartbeat monitoring: detects a lost pilot for the safe stop.',
    ],
    actuators: [
      'Two geared DC motors via an H-bridge for differential drive, executing filtered remote commands.',
      'Speaker (and optional screen) render the pilot\'s presence; an optional camera pan lets the pilot look around.',
    ],
    kinematics: {
      text: [
        'The base uses standard differential-drive kinematics; the distinctive element is that the control input arrives from a remote human over a laggy network and is gated by safety overrides.',
      ],
      eq: `v     = (v_R+v_L)/2,   omega = (v_R−v_L)/L     # differential drive

Remote command c(t−T) arrives delayed by latency T.
Apply only if safe:
  if obstacle or link_lost:  v = omega = 0          # override
  else:                      v = min(c.v, v_max)`,
    },
  },

  assembly: [
    { h: 'Build the presence platform', p: [
      'Assemble the differential-drive base with a tall mast, mount the camera/mic/speaker (and optional screen) at head height, and fit an obstacle-sensor ring around the base.',
    ], warn: 'Safe remote driving is the priority. Always include an obstacle-stop override, a bounded speed, and a connection-loss safe stop — a robot that keeps driving when it loses its pilot, or that obeys a command into an obstacle the pilot cannot see, is dangerous.' },
    { h: 'Set up low-latency two-way A/V', p: [
      'Stream camera+mic to the pilot and the pilot\'s voice (and face) back, tuned for low latency so conversation and driving feel natural.',
    ] },
    { h: 'Add safe teleoperation', p: [
      'Receive drive commands over the network and apply them through safety filters: obstacle-stop override, speed limit, and safe-stop on lost connection.',
    ] },
  ],
  steps: [
    { h: 'Apply remote drive commands safely', p: [
      'Take the pilot\'s drive command and execute it only if safe — override to stop for obstacles the pilot cannot see, and safe-stop if the connection is lost.',
    ], code: {
      file: 'teleop.py', lang: 'python',
      body: `import time

V_MAX = 0.35                     # bounded speed (m/s)
D_STOP = 0.30                    # obstacle stop (m)
LINK_TIMEOUT = 0.5              # s without a command = lost pilot

class SafeDrive:
    def __init__(self, base, obstacles):
        self.base = base; self.obs = obstacles
        self.last_cmd_t = 0

    def on_command(self, v, omega):          # from the remote pilot
        self.last_cmd_t = time.time()
        v = max(-V_MAX, min(V_MAX, v))        # bound speed for laggy loop
        if self.obs.min_distance() < D_STOP:  # pilot's blind spot
            self.base.stop()                  # OVERRIDE: don't hit it
            return
        self.base.drive(v, omega)             # execute the pilot's intent

    def watchdog(self):                       # runs continuously
        if time.time() - self.last_cmd_t > LINK_TIMEOUT:
            self.base.stop()                  # lost pilot -> SAFE STOP`,
      explain: [
        { ref: 'v = max(-V_MAX, min(V_MAX, v))        # bound speed for laggy loop', txt: 'Speed is capped so the delayed see-decide-command loop stays controllable — the faster it drives, the further it travels before the pilot can react.' },
        { ref: 'if self.obs.min_distance() < D_STOP:  # pilot\'s blind spot', txt: 'The robot overrides the pilot to stop for an obstacle they cannot see through a narrow, delayed view — protecting against the pilot\'s blind spots.' },
        { ref: 'self.base.drive(v, omega)             # execute the pilot\'s intent', txt: 'Only when it is safe does the robot carry out the pilot\'s command — the robot obeys, but never blindly.' },
        { ref: 'if time.time() - self.last_cmd_t > LINK_TIMEOUT:', txt: 'If commands stop arriving the pilot is lost, so the robot safe-stops rather than continuing to roll driverless through the space.' },
      ],
    } },
    { h: 'Stream low-latency two-way A/V', p: [
      'Stream the robot\'s camera and microphone to the pilot and the pilot\'s audio (and face) back, minimising latency so conversation is natural and the pilot can drive by the video.',
    ], tip: 'Prioritise latency over resolution for the driving feed — a sharp but laggy image is worse to drive by than a slightly softer, responsive one. The pilot needs to see the result of their steering promptly.' },
  ],

  code: [{
    file: 'telepresence.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Telepresence Robot — mobile two-way A/V presence

Streams low-latency two-way audio/video and lets a remote pilot drive
a differential-drive base by the video. Every drive command is gated by
safety: obstacle-stop override (pilot blind spots), bounded speed, and
a connection-loss SAFE STOP. A prototype of embodied remote presence.
"""
import time, threading

V_MAX, D_STOP, LINK_TIMEOUT = 0.35, 0.30, 0.5

class TelepresenceRobot:
    def __init__(self, base, camera, mic, speaker, obstacles, link):
        self.base, self.cam, self.mic = base, camera, mic
        self.spk, self.obs, self.link = speaker, obstacles, link
        self.last_cmd = 0
        threading.Thread(target=self.av_loop, daemon=True).start()
        threading.Thread(target=self.watchdog, daemon=True).start()

    def av_loop(self):                         # two-way, low latency
        while True:
            self.link.send_video(self.cam.frame())     # robot -> pilot
            self.link.send_audio(self.mic.chunk())     # robot -> pilot
            a = self.link.recv_audio()                 # pilot -> robot
            if a: self.spk.play(a)                      # pilot's voice
            # (optional) show pilot's face on the robot screen

    def on_drive(self, v, omega):              # remote pilot command
        self.last_cmd = time.time()
        v = max(-V_MAX, min(V_MAX, v))          # bound speed
        if self.obs.min_distance() < D_STOP:    # blind-spot obstacle
            self.base.stop(); return            # OVERRIDE
        self.base.drive(v, omega)               # safe -> obey

    def watchdog(self):                        # lost-pilot safe stop
        while True:
            if time.time() - self.last_cmd > LINK_TIMEOUT:
                self.base.stop()                # no pilot -> SAFE STOP
            time.sleep(0.1)

    def run(self):
        for cmd in self.link.commands():        # driven remotely
            self.on_drive(cmd["v"], cmd["omega"])

if __name__ == "__main__":
    robot = TelepresenceRobot(Base(), Camera(), Mic(), Speaker(),
                              ObstacleRing(), NetworkLink())
    robot.run()`,
    explain: [
      { ref: 'def av_loop(self):                         # two-way, low latency', txt: 'A dedicated thread streams the robot\'s camera and mic to the pilot and plays the pilot\'s voice back — the two-way presence that makes it more than remote control.' },
      { ref: 'v = max(-V_MAX, min(V_MAX, v))          # bound speed', txt: 'Every remote command is speed-bounded so the delayed teleoperation loop stays controllable.' },
      { ref: 'if self.obs.min_distance() < D_STOP:    # blind-spot obstacle\n            self.base.stop(); return            # OVERRIDE', txt: 'The robot overrides the pilot to avoid obstacles the narrow, delayed view hides — blind-spot protection.' },
      { ref: 'if time.time() - self.last_cmd > LINK_TIMEOUT:', txt: 'A watchdog safe-stops the robot when it loses its pilot, so it never rolls driverless through the space.' },
      { ref: 'for cmd in self.link.commands():        # driven remotely', txt: 'Drive commands arrive over the network from the pilot, closing a control loop that runs through a human and a laggy link.' },
    ],
  }],

  config: [
    'Configure the camera/mic/speaker and the two-way streaming (prioritising latency).',
    'Configure the network link and drive-command reception.',
    'Configure the obstacle-stop distance, speed limit and connection-loss timeout.',
    'Configure optional camera pan and pilot-face display.',
  ],
  calibration: [
    { h: 'Latency', p: [
      'Measure and minimise end-to-end A/V and command latency so driving and conversation feel natural.',
    ] },
    { h: 'Safety overrides', p: [
      'Verify the obstacle stop triggers before contact and the safe-stop fires promptly on connection loss.',
    ] },
    { h: 'Drive feel', p: [
      'Tune speed limits and command smoothing so the delayed loop is controllable and comfortable.',
    ] },
  ],
  testing: [
    { step: 'Start a session', expect: 'Two-way A/V; pilot sees/hears and is heard' },
    { step: 'Drive around', expect: 'Robot moves to pilot commands, drivable by video' },
    { step: 'Drive toward an obstacle', expect: 'Obstacle stop overrides — no collision' },
    { step: 'Introduce network lag', expect: 'Speed/feel remain controllable (bounded)' },
    { step: 'Drop the connection', expect: 'Safe stop (does not keep driving)' },
    { step: 'Hold a conversation', expect: 'Low enough latency for natural talk' },
  ],
  output: [
    'A robot you drive remotely while seeing, hearing and speaking through it — with obstacle and connection-loss protection.',
    { file: 'session-status.json', lang: 'json', body: `{
  "session": "active",
  "video_latency_ms": 180,
  "pilot_command": { "v": 0.2, "omega": 0.0 },
  "obstacle_m": 0.9,
  "applied": "driving",
  "link": "ok"
}` },
    'An active session driving forward gently with 180 ms video latency and a clear path — presence on the move; had an obstacle or a dropped link appeared, the robot would have stopped itself.',
  ],
  troubleshoot: [
    { sym: 'Driving feels laggy/guessy', cause: 'High end-to-end latency', fix: 'Reduce A/V latency; lower resolution before latency; cap speed' },
    { sym: 'Hits things the pilot missed', cause: 'No/short obstacle override', fix: 'Add obstacle-stop ring covering blind spots' },
    { sym: 'Keeps driving after disconnect', cause: 'No watchdog', fix: 'Safe-stop on command timeout' },
    { sym: 'Choppy audio/conversation', cause: 'Bandwidth/jitter', fix: 'Prioritise audio; manage bandwidth; buffer minimally' },
    { sym: 'Tips when moving', cause: 'Top-heavy mast', fix: 'Lower CoM; ease acceleration; limit speed' },
    { sym: 'Poor presence', cause: 'Camera/screen too low', fix: 'Mount at head height; widen the view' },
  ],

  perf: [
    'Prioritise low latency over resolution for driving and conversation.',
    'Bound speed so the delayed teleoperation loop stays controllable.',
    'Override the pilot with an obstacle stop for blind spots.',
    'Safe-stop on connection loss — never drive without a pilot.',
  ],
  safety: [
    'A robot that keeps driving when it loses its pilot is dangerous — always safe-stop on connection loss.',
    'Override drive commands with an obstacle stop; the pilot cannot see blind spots through a narrow, delayed view.',
    'Limit speed for the delayed loop, especially where people move.',
    'Respect privacy — a mobile camera/mic in a shared space needs consent and clear indication it is active.',
  ],
  maintenance: [
    'Monitor and keep latency low; check network quality where it operates.',
    'Test obstacle-stop and safe-stop overrides regularly.',
    'Keep camera/mic/speaker clean and correctly positioned.',
    'Check base stability, drive wear and battery health.',
  ],
  future: [
    'Add WebRTC for robust low-latency two-way A/V.',
    'Add assisted/semi-autonomous navigation (waypoints, follow-me).',
    'Add a wider/depth camera and better blind-spot coverage.',
    'Add auto-docking/charging and multi-robot session management.',
  ],
  faq: [
    { q: 'How is this different from a video call?', a: 'A video call is a face at a fixed point; a telepresence robot gives that call a body you drive, so you can move through the remote space, turn to look, and go where the conversation goes. It is presence you can direct, not just a static feed.' },
    { q: 'Why is latency the core challenge?', a: 'The video feed does double duty — it carries the conversation and it is the pilot\'s eyes for driving. Lag makes people talk over each other and turns driving into a guessing game where the robot is always a moment behind the pilot\'s intent. Good telepresence is fundamentally a connectivity and latency problem.' },
    { q: 'Why does the robot override the pilot?', a: 'Because the pilot drives through a delayed image and a narrow field of view, missing things a present person would see — a table leg out of frame, someone stepping in from the side. The robot\'s obstacle stop protects against those blind spots by halting before a collision the pilot did not see.' },
    { q: 'What happens if the connection drops?', a: 'The robot safe-stops. A robot that keeps driving after losing its pilot is a real hazard, so a watchdog stops the motors when commands stop arriving.' },
    { q: 'Is a small robot really telepresence?', a: 'It is a genuine prototype of the interaction — two-way A/V plus remote driving — which is the essence. A commercial unit invests far more in connectivity, latency, camera coverage and safety, but the experience of seeing, hearing, speaking and moving through a remote place is the real thing.' },
  ],
  refs: [
    { t: 'Telepresence', u: 'https://en.wikipedia.org/wiki/Telepresence', s: 'Reference' },
    { t: 'Telerobotics / teleoperation', u: 'https://en.wikipedia.org/wiki/Telerobotics', s: 'Reference' },
    { t: 'WebRTC (real-time A/V)', u: 'https://en.wikipedia.org/wiki/WebRTC', s: 'Reference' },
    { t: 'Latency (teleoperation)', u: 'https://en.wikipedia.org/wiki/Latency_(engineering)', s: 'Reference' },
    { t: 'Raspberry Pi camera', u: 'https://www.raspberrypi.com/documentation/accessories/camera.html', s: 'Raspberry Pi' },
  ],
  images: ['robot', 'camera', 'picamera'],
  imageCaptions: [
    'A telepresence robot is a mobile video call — you drive it through a remote place and see, hear and speak as if you were there.',
    'A camera and screen at head height give natural, eye-level presence the pilot can direct.',
    'Because the pilot drives by a delayed, narrow view, the robot overrides with an obstacle stop and safe-stops if the link drops.',
  ],
},

];
