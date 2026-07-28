/* Retail 097–100. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   097 — Smart Shelf Stock Sensor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '097',
  domainKey: 'iot',
  emoji: '🛒', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '10–16 hours', iso8601: 'PT14H',
  tagline: 'Weight-sensing shelves that always know how much stock is left and flag a shelf the moment it runs low — turning empty shelves into pre-empted restocks.',

  overview: [
    'An empty shelf is a lost sale and an unhappy customer, and in most shops it is discovered only when a member of staff happens to walk past or a customer complains — by which point the product has already been out of stock for hours. The root problem is that shelves have <b>no idea what is on them</b>. This project fixes that by making the shelf itself a sensor: a <b>weight-sensing shelf</b> continuously measures the load on it, infers how many units remain, and flags the shelf the moment stock falls low — so restocking is triggered <i>before</i> the shelf empties, not after a customer finds it bare.',
    'The method is elegantly simple: put the shelf (or a section of it) on a <b>load cell</b> — the same strain-gauge sensor used in electronic scales — read the weight through an <b>HX711</b> amplifier, and divide by the known weight of one unit to estimate the <b>count</b> remaining. As shoppers take items the measured weight steps down, and when the estimated count (or weight) crosses a <b>low-stock threshold</b>, the shelf raises an alert for restocking. Networked, every shelf reports its stock live to a back-office dashboard, so staff see exactly which shelves need attention across the whole store.',
    'The value is turning restocking from reactive to <b>proactive</b>: low stock is caught early and continuously, staff are directed to the specific shelves that need them, and out-of-stocks (and the lost sales they cause) drop. It is honest that weight-based counting is an <b>estimate</b> — it assumes reasonably uniform unit weights, needs taring and calibration, and is confused by mixed products or misplaced items — and that real retail also uses barcodes, RFID and vision. But as a self-sensing, low-stock-alerting weight shelf, it gives retail the one thing bare shelves never have: continuous awareness of their own stock, early enough to act on.',
  ],
  does: [
    'Continuously weighs a shelf to sense how much stock remains',
    'Estimates unit count from weight ÷ per-unit weight',
    'Flags a shelf the moment stock falls below a threshold',
    'Reports live stock per shelf to a back-office dashboard',
    'Directs staff to the specific shelves needing restock',
    'Triggers restocking before the shelf empties',
    'Cuts out-of-stocks and the lost sales they cause',
  ],
  features: [
    'Load-cell + HX711 weight sensing',
    'Weight-to-count estimation with taring/calibration',
    'Low-stock threshold alerting',
    'Live per-shelf stock reporting',
    'Store-wide restock dashboard',
    'Sale/refill event detection from weight steps',
    'Honest about weight-estimate limits (uniform units)',
  ],
  applications: [
    { t: 'Retail shelf replenishment', d: 'Proactive restocking of shelves before they empty.' },
    { t: 'Warehouse bin monitoring', d: 'Weight-based counts of parts/bins for reorder.' },
    { t: 'Vending / micro-market stock', d: 'Knowing remaining stock without opening the unit.' },
    { t: 'Inventory awareness', d: 'Continuous per-location stock for any uniform-weight product.' },
  ],
  skills: [
    'Load-cell + HX711 weight measurement',
    'Taring, calibration and weight-to-count conversion',
    'Threshold alerting and event (sale/refill) detection',
    'Networked per-shelf reporting',
    'Handling weight-estimate error and drift',
  ],
  prereq: [
    'The problem is shelves not knowing their own stock — sense weight to know it.',
    'Count ≈ weight ÷ per-unit weight — needs taring and calibration.',
    'Alert on a low threshold so restock happens before the shelf empties.',
    'Weight counting is an estimate — assumes fairly uniform units.',
  ],

  parts: ['esp32', 'loadcell', 'oled', 'li18650'],
  extraParts: [
    { name: 'Load cell + HX711', spec: 'Strain-gauge load cell(s) + HX711 24-bit amplifier per shelf', qty: 1, price: 350, note: 'The weight sensor' },
    { name: 'Shelf mounting', spec: 'Mount the shelf/section on the load cell(s)', qty: 1, price: 300 },
    { name: 'Network + power', spec: 'Wi-Fi to the dashboard, powered per shelf/gondola', qty: 1, price: 200 },
    { name: 'Status indicator', spec: 'LED/e-ink low-stock indicator on the shelf edge', qty: 1, price: 150 },
  ],
  cost: '₹1,200 – ₹2,500 per shelf',
  libs: ['wifi', 'hx711', 'pubsub', 'ssd1306', 'arduinojson'],

  pins: {
    left: [
      { dev: 'HX711', devPin: 'DT/SCK', pin: 'GPIO 16/17', sig: 'Weight (load cell)' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Count/status' },
    ],
    right: [
      { dev: 'Low-stock LED', devPin: 'IN', pin: 'GPIO 25', sig: 'Shelf indicator' },
      { dev: 'Wi-Fi', devPin: 'onboard', pin: '—', sig: 'Dashboard link' },
      { dev: 'Supply', devPin: '5V', pin: '5V', sig: 'Power' },
      { dev: 'Tare button', devPin: 'IN', pin: 'GPIO 26', sig: 'Zero/refill' },
    ],
  },
  wiringNotes: [
    'Mount the shelf (or a section) on the load cell(s) so the product weight bears cleanly on them.',
    'Read the load cell via the HX711 24-bit amplifier; keep wiring short and stable to reduce noise.',
    'Provide a tare/refill action to zero the shelf and register a restock.',
    'Network to the back-office dashboard; add an on-shelf low-stock indicator.',
    'Isolate the load cell from vibration/knocks that would add weight noise.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Load cell', sub: 'weight', highlight: true },
      { name: 'HX711', sub: 'amplify' },
    ] },
    { label: 'Estimate', edge: 'right', blocks: [
      { name: 'Tare + calib', sub: 'zero/scale' },
      { name: 'Count', sub: '÷ unit wt', highlight: true },
    ] },
    { label: 'Judge', edge: 'right', blocks: [
      { name: 'Low?', sub: 'threshold' },
      { name: 'Sale/refill', sub: 'weight step' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Alert', sub: 'restock' },
      { name: 'Dashboard', sub: 'per shelf' },
    ] },
  ] },
  flow: [
    { t: 'Read shelf weight (HX711)', k: 'start' },
    { t: 'Tare + calibrate → net weight', k: 'proc' },
    { t: 'Count = weight ÷ unit weight', k: 'proc' },
    { t: 'Below low threshold?', k: 'dec', yes: 'Flag shelf: restock', no: 'Report stock' },
    { t: 'Flag shelf: restock', k: 'io' },
    { t: 'Report stock', k: 'io' },
    { t: 'Refill detected (weight jump)?', k: 'dec', yes: 'Clear alert / re-tare', no: 'Continue' },
    { t: 'Clear alert / re-tare', k: 'io' },
    { t: 'Continue', k: 'end', back: 'Read shelf weight (HX711)' },
  ],

  principle: [
    'Out-of-stocks are expensive and, in most stores, invisible until too late — because a shelf is a dumb surface that reports nothing about what sits on it. The insight of the smart shelf is to give the shelf a <b>sense of its own contents</b>, continuously, so the store learns a product is running low <i>while there is still time to restock</i> rather than after a customer finds it gone. Weight is the ideal sense for this: it is continuous, needs no per-item tagging, and directly tracks how much product remains.',
    'The measurement chain is the same as any electronic scale. A <b>load cell</b> is a metal element with <b>strain gauges</b> bonded to it; under load it flexes microscopically, the gauges change resistance in proportion, and this tiny change is read as a weight. Because the signal is minute, it is amplified and digitised by a dedicated 24-bit converter, the <b>HX711</b>, giving a stable, high-resolution weight reading. Put the shelf on the load cell and you have a continuous measurement of the total product weight on it — the raw signal everything else is derived from.',
    'Turning weight into <b>stock count</b> requires two calibrations and a division. <b>Taring</b> subtracts the fixed weight of the empty shelf and fixtures so only the product weight remains. <b>Calibration</b> establishes the scale factor (raw units per gram) using a known weight. Then, dividing the net product weight by the <b>known weight of one unit</b> gives the estimated number of units remaining. As shoppers remove items, the weight steps down in unit-sized decrements, and the count follows; a sudden jump up is a <b>refill</b>. This is also how the shelf can infer <b>sale and refill events</b> — from the direction and size of weight steps — not just a static count.',
    'The action is <b>threshold alerting</b> and <b>store-wide visibility</b>. When the estimated count (or net weight) falls below a low-stock threshold, the shelf raises a restock flag — on an edge indicator and, networked, on a back-office dashboard that shows every shelf\'s live stock, so staff are directed to exactly the shelves that need them. Restocking becomes proactive and targeted instead of reactive and store-walking. The design is honest about the method\'s limits: weight-based counting is an <b>estimate</b> that assumes reasonably <b>uniform unit weights</b>, so it is confused by mixed products on one sensor, items placed on the wrong shelf, or highly variable unit weights; it needs periodic re-taring and calibration to counter drift; and precise, per-SKU retail inventory also uses barcodes, RFID and vision. But for the specific, high-value job of knowing when a shelf of a uniform product is running low, early and continuously, a weight-sensing shelf gives retail exactly the awareness that bare shelves have always lacked.',
  ],
  equations: [
    { t: 'Weight to count', eq: 'net_weight = raw_reading × scale − tare\n\n  count ≈ round( net_weight / unit_weight )\n\nTare removes the empty-shelf weight; scale (from calibration)\nconverts raw units to grams; unit_weight turns grams into\nnumber of items.' },
    { t: 'Low-stock alert', eq: 'low if  count ≤ COUNT_MIN   (or net_weight ≤ WEIGHT_MIN)\n\nSet COUNT_MIN so restocking is triggered with enough lead\ntime to refill BEFORE the shelf empties.' },
    { t: 'Sale / refill from weight steps', eq: 'Δ = net_weight(now) − net_weight(prev)\n\n  Δ ≈ −k·unit_weight (k>0)  → k units SOLD\n  Δ ≈ +m·unit_weight (m>0)  → m units REFILLED → clear alert\n\nIgnore |Δ| below a noise floor (hands, knocks).' },
  ],

  assembly: [
    { h: 'Mount the shelf on load cells and read weight', p: [
      'Mount the shelf/section on the load cell(s) so product weight bears cleanly, and read it through the HX711 with stable, short wiring.',
    ], warn: 'Isolate the shelf from knocks and vibration and mount the load cell correctly — off-axis loads and mechanical noise corrupt the weight, and every downstream count depends on it.' },
    { h: 'Tare, calibrate and convert to count', p: [
      'Tare the empty shelf, calibrate the scale factor with a known weight, and divide net weight by the per-unit weight to estimate count.',
    ] },
    { h: 'Add alerting and reporting', p: [
      'Set the low-stock threshold, raise restock flags, detect refills to clear them, and report live stock to the dashboard.',
    ] },
  ],
  steps: [
    { h: 'Estimate count and detect sale/refill', p: [
      'Convert the net weight to a unit count, and infer sale/refill events from the size and direction of weight steps.',
    ], code: {
      file: 'shelf.ino', lang: 'cpp',
      body: `float scale = 420.0;        // raw units per gram (from calibration)
long  tare  = 0;            // empty-shelf zero
float unitWeight = 250.0;   // grams per unit (known)
float prevNet = 0;
const int COUNT_MIN = 3;

float netWeight(long raw){ return (raw - tare) / scale; }   // grams

int countFrom(float net){ return (int)roundf(net / unitWeight); }

// Infer a stock event from the weight step since last reading.
const char* stockEvent(float net){
  float d = net - prevNet;
  if (fabs(d) < unitWeight * 0.4) return nullptr;   // noise floor
  int units = (int)roundf(fabs(d) / unitWeight);
  prevNet = net;
  return d < 0 ? "sold" : "refilled";               // + = refill
}

bool lowStock(float net){ return countFrom(net) <= COUNT_MIN; }`,
      explain: [
        { ref: 'float netWeight(long raw){ return (raw - tare) / scale; }   // grams', txt: 'Taring and the calibrated scale turn the raw HX711 reading into the actual product weight on the shelf.' },
        { ref: 'int countFrom(float net){ return (int)roundf(net / unitWeight); }', txt: 'Dividing net weight by the known per-unit weight estimates how many units remain — the core weight-to-count step.' },
        { ref: 'if (fabs(d) < unitWeight * 0.4) return nullptr;   // noise floor', txt: 'A noise floor ignores small wobbles (a hand resting, a knock) so only real unit-sized changes register as events.' },
        { ref: 'return d < 0 ? "sold" : "refilled";               // + = refill', txt: 'The direction of a weight step tells sale from refill — a jump up clears the low-stock alert.' },
      ],
    } },
    { h: 'Alert low stock and report per shelf', p: [
      'Flag the shelf when the count crosses the low threshold, clear it on a refill, and report live stock to the back-office dashboard so staff go to the right shelves.',
    ], tip: 'Set the low threshold to give real restock lead time — alert while a few units remain, not when the shelf is already empty, so staff can refill before a sale is lost.' },
  ],

  code: [{
    file: 'smart_shelf.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Shelf Stock Sensor — ESP32 + load cell (HX711)

   Weighs a shelf continuously, estimates units remaining from weight,
   flags low stock BEFORE the shelf empties, detects sale/refill from
   weight steps, and reports live per-shelf stock to a dashboard.
   Weight counting is an estimate — assumes fairly uniform units.
   ══════════════════════════════════════════════════════════════════ */

#include "HX711.h"
HX711 scaleADC;

const char* SHELF = "A12";
float scale = 420.0, unitWeight = 250.0, prevNet = 0;
long  tare = 0;
const int COUNT_MIN = 3;
bool alerted = false;

float netWeight(){ return (scaleADC.read_average(5) - tare) / scale; }
int  count(float net){ return (int)roundf(net / unitWeight); }

void report(const char* event, float net, int c){
  char m[160];
  snprintf(m,sizeof m,
    "{\\"shelf\\":\\"%s\\",\\"grams\\":%.0f,\\"count\\":%d,\\"event\\":\\"%s\\"}",
    SHELF, net, c, event ? event : "none");
  mqttPublish("shelf/stock", m);                 // live to dashboard
}

void setup(){
  scaleADC.begin(16,17);
  tare = scaleADC.read_average(20);              // zero the empty shelf
  wifiConnect(); mqttConnect();
}

void loop(){
  float net = netWeight();
  int c = count(net);

  // sale/refill from the weight step
  float d = net - prevNet; const char* ev = nullptr;
  if (fabs(d) >= unitWeight*0.4){
    ev = d < 0 ? "sold" : "refilled"; prevNet = net;
    if (d > 0) alerted = false;                  // refill clears the alert
  }

  if (c <= COUNT_MIN && !alerted){               // low: flag BEFORE empty
    digitalWrite(25, HIGH);                      // on-shelf indicator
    report("low_stock", net, c);
    alerted = true;
  } else if (c > COUNT_MIN){
    digitalWrite(25, LOW);
  }

  report(ev, net, c);                            // continuous stock report
  delay(2000);
}`,
    explain: [
      { ref: 'tare = scaleADC.read_average(20);              // zero the empty shelf', txt: 'Taring at startup removes the empty shelf/fixture weight so only product weight is counted.' },
      { ref: 'int  count(float net){ return (int)roundf(net / unitWeight); }', txt: 'The remaining unit count is the net product weight divided by the known per-unit weight.' },
      { ref: 'if (d > 0) alerted = false;                  // refill clears the alert', txt: 'A weight jump up is a refill, which clears the low-stock alert automatically.' },
      { ref: 'if (c <= COUNT_MIN && !alerted){               // low: flag BEFORE empty', txt: 'The shelf flags for restock while a few units remain, giving staff time to refill before it empties.' },
      { ref: 'report(ev, net, c);                            // continuous stock report', txt: 'Every shelf reports live stock to the dashboard, so staff see exactly which shelves need attention store-wide.' },
    ],
  }],

  config: [
    'Configure the HX711 pins, scale factor and per-unit weight per shelf/product.',
    'Configure the tare/refill action and the low-stock threshold.',
    'Configure the dashboard link and per-shelf reporting.',
    'Configure the weight-step noise floor for sale/refill detection.',
  ],
  calibration: [
    { h: 'Scale calibration', p: [
      'Calibrate the scale factor with a known weight so grams are accurate.',
    ] },
    { h: 'Taring', p: [
      'Tare the empty shelf and re-tare after fixture changes; guard against drift.',
    ] },
    { h: 'Unit weight', p: [
      'Set the per-unit weight accurately; verify the count matches a manual count at a couple of levels.',
    ] },
  ],
  testing: [
    { step: 'Place a known number of units', expect: 'Count matches (calibration good)' },
    { step: 'Remove one unit', expect: 'Count drops by one; "sold" event' },
    { step: 'Draw down to threshold', expect: 'Low-stock flag + dashboard alert' },
    { step: 'Refill the shelf', expect: 'Count rises; "refilled"; alert clears' },
    { step: 'Rest a hand on the shelf', expect: 'Below noise floor — no false event' },
    { step: 'Mix in a different product', expect: 'Count off — note uniform-weight limit' },
  ],
  output: [
    'Live per-shelf stock, low-stock flags before shelves empty, and sale/refill events — on the shelf and on a store dashboard.',
    { file: 'shelf-stock.json', lang: 'json', body: `{
  "shelf": "A12",
  "grams": 720,
  "count": 3,
  "event": "sold",
  "state": "low_stock"
}` },
    'Shelf A12 is down to 3 units after a sale and has flagged low stock — the restock is triggered with units still on the shelf, before any customer finds it empty.',
  ],
  troubleshoot: [
    { sym: 'Count is wrong', cause: 'Bad calibration / unit weight', fix: 'Re-calibrate scale; set accurate per-unit weight' },
    { sym: 'Count drifts over time', cause: 'Tare/temperature drift', fix: 'Re-tare periodically; stabilise mounting/temperature' },
    { sym: 'False sale/refill events', cause: 'Noise / knocks below unit size', fix: 'Raise the noise floor; isolate from vibration' },
    { sym: 'Miscounts with mixed items', cause: 'Non-uniform weights', fix: 'One product per sensor; accept weight-estimate limits' },
    { sym: 'Late/no low alert', cause: 'Threshold too low', fix: 'Raise COUNT_MIN for restock lead time' },
    { sym: 'Noisy weight', cause: 'Poor load-cell mount/wiring', fix: 'Mount cleanly; short, stable wiring; average readings' },
  ],

  iot: {
    protoShort: 'Wi-Fi/MQTT → back-office stock dashboard',
    net: {
      nodes: [{ name: 'Smart shelf', sub: 'ESP32+HX711' }, { name: 'Other shelves', sub: 'store' }],
      protocol: 'Wi-Fi', gateway: 'Store AP', gatewaySub: 'to back office',
      uplink: 'MQTT', cloud: 'Stock dashboard', cloudSub: 'per-shelf stock',
      clients: [{ name: 'Staff', sub: 'restock list' }, { name: 'Manager', sub: 'out-of-stock KPIs' }],
    },
    protocol: ['Shelves publish live stock and sale/refill events; the dashboard aggregates them into a store-wide restock view.'],
    topics: [
      { t: 'shelf/stock', dir: 'shelf → dashboard', payload: 'shelf, grams, count, event' },
      { t: 'shelf/alert', dir: 'shelf → staff', payload: 'low-stock flag' },
      { t: 'shelf/refill', dir: 'shelf → dashboard', payload: 'restock confirmation' },
    ],
    cloud: ['A back-office dashboard shows live stock per shelf, low-stock alerts, and out-of-stock/replenishment KPIs across the store.'],
    dashboard: ['A store map/list of shelves with live counts, low-stock flags and a prioritised restock list.'],
    mobile: ['Restock alerts to staff with the specific shelves needing attention.'],
    security: [
      'Authenticate shelves; secure stock telemetry.',
      'Stock data is operational — protect against tampering.',
      'Weight counting is an estimate; combine with barcodes/RFID for precision.',
    ],
  },

  perf: [
    'Tare and calibrate so counts are accurate; re-tare against drift.',
    'Use a noise floor so only real unit changes register.',
    'Alert with restock lead time, before the shelf empties.',
    'Report live per-shelf so staff are directed precisely.',
  ],
  safety: [
    'Weight counting is an estimate — do not treat it as exact per-SKU inventory; combine with barcodes/RFID where precision matters.',
    'Mount shelves and sensors so a failure cannot drop stock or injure.',
    'Secure the network and dashboard against stock-data tampering.',
    'Re-calibrate/tare regularly to keep alerts trustworthy.',
  ],
  maintenance: [
    'Re-tare and re-calibrate periodically to counter drift.',
    'Update per-unit weights when products/packaging change.',
    'Check load-cell mounting and wiring for noise.',
    'Review alert timing so restocks stay proactive.',
  ],
  future: [
    'Combine weight with barcode/RFID for per-SKU accuracy.',
    'Add demand/auto-reorder from sale-rate trends.',
    'Add planogram compliance (right product on the shelf).',
    'Add e-ink shelf labels showing live stock/price.',
  ],
  faq: [
    { q: 'How does a shelf know its stock?', a: 'It sits on a load cell and weighs what is on it. Dividing the net product weight by the known weight of one unit estimates how many units remain, continuously.' },
    { q: 'Why weight instead of barcodes or RFID?', a: 'Weight is continuous, needs no per-item tagging, and directly tracks how much is left — ideal for the specific job of spotting low stock early. Barcodes and RFID give per-SKU precision and complement it where that is needed.' },
    { q: 'How does it avoid empty shelves?', a: 'It alerts while a few units still remain — a low-stock threshold set to give restock lead time — so staff are directed to refill before the shelf actually empties and a sale is lost.' },
    { q: 'What are the limits of weight counting?', a: 'It is an estimate that assumes fairly uniform unit weights, so it is confused by mixed products on one sensor, items placed on the wrong shelf, or highly variable weights, and it needs periodic taring/calibration to counter drift.' },
    { q: 'Can it tell sales from restocks?', a: 'Yes — from the direction and size of weight steps. A unit-sized drop is a sale; a jump up is a refill, which also clears the low-stock alert.' },
  ],
  refs: [
    { t: 'Load cell / strain gauge', u: 'https://en.wikipedia.org/wiki/Load_cell', s: 'Reference' },
    { t: 'HX711 24-bit ADC', u: 'https://cdn.sparkfun.com/datasheets/Sensors/ForceFlex/hx711_english.pdf', s: 'Datasheet' },
    { t: 'Retail out-of-stock', u: 'https://en.wikipedia.org/wiki/Stockout', s: 'Reference' },
    { t: 'Inventory management', u: 'https://en.wikipedia.org/wiki/Inventory_management', s: 'Reference' },
    { t: 'Smart shelf', u: 'https://en.wikipedia.org/wiki/Smart_shelf', s: 'Reference' },
  ],
  images: ['retail', 'esp32', 'warehouse'],
  imageCaptions: [
    'A weight-sensing shelf always knows how much stock remains and flags low stock before it empties.',
    'A load cell and HX711 amplifier turn the shelf into a scale; weight ÷ per-unit weight estimates the count.',
    'A back-office dashboard aggregates every shelf into a prioritised, store-wide restock list.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   098 — Queue Length Counter
   ══════════════════════════════════════════════════════════════════ */
{
  id: '098',
  domainKey: 'ai',
  emoji: '🧍', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–22 hours', iso8601: 'PT20H',
  tagline: 'A camera that counts how many people are waiting in line and turns it into live staffing signals — open another till before the queue gets ugly.',

  overview: [
    'Long checkout queues are one of the biggest drivers of customer frustration and walked-away sales, and stores usually react to them too late — a supervisor notices a queue building, then scrambles to open another till by which point customers are already annoyed or gone. The missing ingredient is a <b>live, objective measure of how many people are waiting</b>. This project builds one: a camera that watches the queue area, <b>counts the people in line</b> with computer vision, and turns that count into a real-time staffing signal — open another checkout <i>before</i> the queue gets long, not after.',
    'The core is <b>people detection and counting</b> in a defined region. A camera views the queue zone; a computer-vision model detects people in the frame, and the system counts how many are within the marked queue area, tracking the number over time. From the live count (and its trend) it derives the signals a manager actually needs: current queue length, whether it is growing, and when it crosses thresholds that should trigger opening or closing a till. Aggregated, it also yields analytics — queue lengths by time of day, peak periods, average wait — that inform staffing schedules.',
    'The value is replacing gut-feel, too-late queue management with continuous, objective data: tills open in time, waits shorten, and staffing is planned from real patterns. It is honest about doing this <b>responsibly</b> — the goal is <i>counting</i>, not identifying anyone, so it should run on-device, count rather than recognise faces, and respect privacy and notice requirements — and about the vision limits (crowding, occlusion, defining where the queue is). But as an on-device people-counting queue monitor that produces live staffing signals and queue analytics, it gives retail an objective handle on one of its most visible customer-experience problems.',
  ],
  does: [
    'Counts people waiting in a defined queue area with vision',
    'Tracks live queue length and its trend over time',
    'Signals when to open or close a checkout',
    'Produces queue analytics (peaks, by time of day, waits)',
    'Runs on-device — counting, not identifying people',
    'Replaces too-late, gut-feel queue management with data',
    'Shortens waits and reduces walked-away sales',
  ],
  features: [
    'Computer-vision people detection + counting',
    'Region-of-interest queue counting',
    'Live count, trend and threshold signals',
    'Open/close-till staffing recommendations',
    'Queue analytics for scheduling',
    'On-device, privacy-respecting design',
    'Honest about crowding/occlusion and privacy',
  ],
  applications: [
    { t: 'Checkout staffing', d: 'Live signals to open/close tills before queues build.' },
    { t: 'Queue analytics', d: 'Peak times and average waits to plan staffing.' },
    { t: 'Service counters', d: 'Any queue — banks, pharmacies, help desks.' },
    { t: 'Customer-experience KPIs', d: 'Objective wait/queue metrics for operations.' },
  ],
  skills: [
    'People detection with a CV model (e.g. lightweight detector)',
    'Region-of-interest counting and temporal tracking',
    'Threshold/trend logic for staffing signals',
    'On-device, privacy-respecting deployment',
    'Queue analytics aggregation',
  ],
  prereq: [
    'The missing ingredient is a live, objective count of people waiting.',
    'Count within a defined queue region, and track the trend, not just an instant.',
    'Do it responsibly: count, do not identify; on-device; respect privacy.',
    'Crowding/occlusion and defining the queue area are the real challenges.',
  ],

  parts: ['rpi4', 'picam', 'oled'],
  extraParts: [
    { name: 'Camera + edge compute', spec: 'Raspberry Pi (or Jetson) + camera viewing the queue area', qty: 1, price: 5000, note: 'On-device inference for privacy' },
    { name: 'Mount', spec: 'Overhead/angled mount covering the queue zone', qty: 1, price: 400 },
    { name: 'Staff signal', spec: 'Light/screen or dashboard for open-till signals', qty: 1, price: 500 },
    { name: 'Network', spec: 'Wi-Fi/Ethernet for signals/analytics (not video)', qty: 1, price: 200 },
  ],
  cost: '₹6,000 – ₹10,000',
  libs: ['python', 'opencv', 'tf', 'ultralytics', 'picamera2', 'flask'],

  pins: {
    left: [
      { dev: 'Camera', devPin: 'CSI/USB', pin: '—', sig: 'Queue-area video (on-device)' },
    ],
    right: [
      { dev: 'Staff signal', devPin: 'GPIO/HDMI', pin: '—', sig: 'Open/close till' },
      { dev: 'Network', devPin: 'Wi-Fi/Eth', pin: '—', sig: 'Counts/analytics (not video)' },
      { dev: 'Local display', devPin: 'I2C', pin: 'GPIO', sig: 'Live count' },
    ],
  },
  wiringNotes: [
    'Mount the camera overhead or angled to see the queue area clearly, minimising occlusion.',
    'Run inference on-device so raw video never leaves the unit — only counts/signals do.',
    'Drive a staff light/screen or dashboard with the open/close-till signal.',
    'Network carries counts and analytics, not video, for privacy and bandwidth.',
    'Define the queue region-of-interest in the camera view during setup.',
  ],

  block: { columns: [
    { label: 'See', edge: 'right', blocks: [
      { name: 'Camera', sub: 'queue area', highlight: true },
      { name: 'Detect people', sub: 'CV model' },
    ] },
    { label: 'Count', edge: 'right', blocks: [
      { name: 'In queue ROI', sub: 'count', highlight: true },
      { name: 'Track trend', sub: 'over time' },
    ] },
    { label: 'Signal', edge: 'right', blocks: [
      { name: 'Threshold', sub: 'open/close' },
      { name: 'Staff', sub: 'act early' },
    ] },
    { label: 'Analyse', edge: 'none', blocks: [
      { name: 'Peaks/waits', sub: 'by time' },
      { name: 'Schedule', sub: 'staffing' },
    ] },
  ] },
  flow: [
    { t: 'Capture queue-area frame (on-device)', k: 'start' },
    { t: 'Detect people; count within queue ROI', k: 'proc' },
    { t: 'Update live count + trend', k: 'proc' },
    { t: 'Count over open-till threshold?', k: 'dec', yes: 'Signal: open a till', no: 'Under close threshold?' },
    { t: 'Signal: open a till', k: 'io' },
    { t: 'Under close threshold?', k: 'dec', yes: 'Signal: can close a till', no: 'Hold' },
    { t: 'Signal: can close a till', k: 'io' },
    { t: 'Hold', k: 'proc' },
    { t: 'Log for analytics', k: 'end', back: 'Capture queue-area frame (on-device)' },
  ],

  principle: [
    'Queue management fails for a simple reason: stores manage queues by <b>human noticing</b>, which is inconsistent and always a step behind. By the time a supervisor sees a queue has grown and reacts, customers have already been waiting too long, and some have abandoned their baskets. The fix is not more vigilance but a <b>continuous, objective measurement</b> of queue length that the store can act on the moment it starts to build — converting queue management from a reactive judgement call into a data-driven signal.',
    'Producing that measurement is a <b>computer-vision counting</b> problem. A camera views the queue area, and a people-detection model finds the people in each frame. The key refinement is <b>counting within a defined region of interest</b> — the marked queue zone — so passers-by and shoppers elsewhere are not counted, only those actually waiting. Counting over successive frames (with light temporal smoothing/tracking) gives a stable live count and, importantly, its <b>trend</b>: a queue of five that is growing needs a different response from a queue of five that is clearing.',
    'From the count and trend come the <b>staffing signals</b> that are the point of the system. Simple thresholds turn the number into action: above an <i>open-till</i> threshold (or when the trend shows a queue building toward it), signal staff to open another checkout <b>before</b> the wait becomes painful; below a <i>close-till</i> threshold, signal that a till can close, saving labour. Because the signal is early and objective, tills open in time and waits stay short. Aggregated over time, the same counts become <b>analytics</b> — queue length by hour and day, peak periods, estimated average waits — which let managers <i>schedule</i> staffing to demand rather than merely react to it.',
    'What makes this system acceptable to deploy is doing it <b>responsibly</b>, and the design is explicit about it. The goal is strictly <b>counting, not identification</b>: the system needs to know <i>how many</i> people are waiting, never <i>who</i> they are. So it runs <b>on-device</b> (raw video never leaves the unit — only counts and signals do), it counts people rather than recognising faces, and it respects privacy expectations and any notice/consent requirements for cameras in the space. It is also honest about the vision <b>limits</b>: crowding and <b>occlusion</b> (people hidden behind others) make dense queues hard to count exactly, defining where "the queue" is can be ambiguous, and lighting and camera angle matter. Within those honest bounds — an approximate but continuous and objective count, kept private by design — it gives retail exactly what queue management has always lacked: a live, trustworthy handle on how many people are waiting, early enough to do something about it.',
  ],
  equations: [
    { t: 'Queue count in a region', eq: 'For each frame: detect people {boxes}.\n\n  queue_count = | { p in people : center(p) ∈ ROI_queue } |\n\nCount only inside the marked queue zone — ignore passers-by.\nSmooth over frames to steady the number.' },
    { t: 'Trend (is it building?)', eq: 'Track count over a short window:\n\n  trend = d(count)/dt   (rising / falling)\n\nA rising queue near the threshold warrants opening a till\nBEFORE it crosses — act early, not late.' },
    { t: 'Staffing signal', eq: 'if count ≥ OPEN_TH  (or rising toward it):  OPEN a till\nif count ≤ CLOSE_TH for a while:            CLOSE a till\n\nEstimated wait ≈ count / service_rate\nSet thresholds from acceptable wait times.' },
  ],

  ai: {
    task: 'Detect and count people within a defined queue region from a camera, on-device, to produce live queue length, trend and staffing signals — counting, not identifying.',
    datasetTable: [
      { n: 'Person-detection data (e.g. COCO person class)', size: 'Large', lic: 'Varies (check terms)', use: 'Base people detector' },
      { n: 'Site queue-area frames (ROI-annotated)', size: 'Small–Medium', lic: 'On-site', use: 'Tune ROI / thresholds' },
      { n: 'Crowd/occlusion samples', size: 'Medium', lic: 'Varies', use: 'Robustness in dense queues' },
      { n: 'Time-stamped count logs', size: 'Growing', lic: 'On-site', use: 'Queue analytics / scheduling' },
    ],
    pipeline: [
      { name: 'Frame', sub: 'camera (on-device)', highlight: true },
      { name: 'Detect people', sub: 'CV model' },
      { name: 'Filter to ROI', sub: 'queue zone' },
      { name: 'Count + smooth', sub: 'live length', highlight: true },
      { name: 'Signal', sub: 'open/close till' },
      { name: 'Log', sub: 'analytics' },
    ],
    archTable: [
      { l: 'Detector', s: 'lightweight person detector (YOLO-class / MobileNet-SSD)', p: 'Runs on-device (Pi/Jetson)' },
      { l: 'ROI filter', s: 'count detections inside the queue region', p: 'Ignores passers-by' },
      { l: 'Tracker/smoother', s: 'temporal smoothing / light tracking', p: 'Stable count + trend' },
      { l: 'Signal logic', s: 'thresholds + trend on the count', p: 'Open/close-till signals' },
      { l: 'Privacy', s: 'on-device; counts out, video stays', p: 'Count, don\'t identify' },
    ],
    hyper: [
      { k: 'Detector input size', v: '≈ 416–640 px', w: 'Speed vs small-person recall' },
      { k: 'Confidence threshold', v: '≈ 0.4–0.5', w: 'Miss vs false people' },
      { k: 'Smoothing window', v: '≈ 3–10 s', w: 'Steady count vs responsiveness' },
      { k: 'Open/close thresholds', v: 'from wait targets', w: 'Site-specific' },
    ],
    metrics: [
      { m: 'Counting error (MAE)', v: 'Low at typical lengths', d: 'Rises with crowding/occlusion' },
      { m: 'Signal timeliness', v: 'Fires before waits get long', d: 'The operational goal' },
      { m: 'Privacy', v: 'No identification; video on-device', d: 'By design' },
      { m: 'FPS on-device', v: 'Real-time enough (few FPS)', d: 'Counting needs modest rate' },
    ],
    chart: { title: 'Where the accuracy goes', unit: '', desc: 'Counting error grows with queue density and occlusion — accurate for short/medium queues, approximate for dense crowds.', bars: [
      { label: 'Short queue (≤5)', value: 95 },
      { label: 'Medium (6–12)', value: 88 },
      { label: 'Long/dense (13+)', value: 72 },
      { label: 'Heavy occlusion', value: 60 },
    ] },
    inference: { file: 'queue_count.py', lang: 'python', body: `import numpy as np

class QueueCounter:
    def __init__(self, detector, roi_polygon, open_th=4, close_th=1):
        self.det = detector; self.roi = roi_polygon
        self.open_th, self.close_th = open_th, close_th
        self.history = []                       # recent counts (smoothing/trend)

    def count_frame(self, frame):
        people = self.det.detect(frame, classes=["person"])   # on-device
        # count only people whose center is inside the queue region
        n = sum(1 for p in people if point_in_poly(center(p), self.roi))
        self.history.append(n); self.history = self.history[-10:]
        return int(round(np.median(self.history)))            # smoothed

    def signal(self, frame):
        count = self.count_frame(frame)
        trend = self.history[-1] - self.history[0] if len(self.history) > 1 else 0
        if count >= self.open_th or (count >= self.open_th-1 and trend > 0):
            return count, "OPEN_TILL"           # act BEFORE it gets long
        if count <= self.close_th:
            return count, "CAN_CLOSE_TILL"
        return count, "HOLD"
        # NOTE: only 'count' + signal leave the device — never the video/faces.` },
    limits: [
      'Counting is approximate in dense, occluded queues — accurate for short/medium lengths.',
      'Defining the queue region can be ambiguous; lighting and camera angle matter.',
      'It counts, it does not identify — on-device, privacy-respecting by design.',
      'Signals assume a service rate; thresholds must be set from real wait targets.',
    ],
  },

  assembly: [
    { h: 'Set up on-device vision over the queue area', p: [
      'Mount the camera to see the queue clearly, run the people detector on-device, and define the queue region of interest.',
    ], warn: 'Design for privacy from the start: run inference on-device so raw video never leaves the unit, count rather than identify, and follow notice/consent rules for cameras in the space.' },
    { h: 'Count in the region and track the trend', p: [
      'Count only people inside the queue ROI, smooth over frames, and track the trend so you can act before thresholds are crossed.',
    ] },
    { h: 'Produce signals and analytics', p: [
      'Turn count/trend into open/close-till signals with sensible thresholds, and log counts for queue analytics and staffing schedules.',
    ] },
  ],
  steps: [
    { h: 'Count people in the queue region', p: [
      'Detect people on-device and count only those inside the queue ROI, smoothing for a stable live count.',
    ], code: {
      file: 'count.py', lang: 'python',
      body: `import numpy as np

def queue_count(detector, frame, roi, history):
    people = detector.detect(frame, classes=["person"])   # on-device only
    n = sum(1 for p in people if point_in_poly(center(p), roi))  # in the queue
    history.append(n); del history[:-10]                  # keep last 10
    return int(round(np.median(history)))                 # smoothed live count`,
      explain: [
        { ref: 'people = detector.detect(frame, classes=["person"])   # on-device only', txt: 'People are detected on the device itself, so raw video never leaves the unit — counting, not identification.' },
        { ref: 'n = sum(1 for p in people if point_in_poly(center(p), roi))  # in the queue', txt: 'Only people inside the defined queue region are counted, so passers-by and other shoppers are excluded.' },
        { ref: 'return int(round(np.median(history)))                 # smoothed live count', txt: 'Median smoothing over recent frames gives a steady count instead of a number that flickers frame to frame.' },
      ],
    } },
    { h: 'Signal staffing and log analytics', p: [
      'Turn count and trend into open/close-till signals early, and log counts for peak-time analytics and staffing schedules.',
    ], tip: 'Act on the trend, not just the instant: open a till when a queue is building toward the threshold, so the till is staffed before the wait actually gets long.' },
  ],

  code: [{
    file: 'queue_counter.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Queue Length Counter — on-device people counting for staffing

Counts people within a defined queue region from a camera, tracks the
live count and trend, and signals when to open/close a checkout BEFORE
waits get long. Logs counts for queue analytics. Counts, never
identifies: inference on-device; only counts/signals leave the unit.
"""
import time, numpy as np

class QueueCounter:
    def __init__(self, detector, roi, open_th=4, close_th=1, sink=None):
        self.det = detector; self.roi = roi
        self.open_th, self.close_th = open_th, close_th
        self.hist = []; self.sink = sink

    def count(self, frame):
        people = self.det.detect(frame, classes=["person"])   # on-device
        n = sum(1 for p in people if point_in_poly(center(p), self.roi))
        self.hist.append(n); self.hist = self.hist[-10:]
        return int(round(np.median(self.hist)))               # smoothed

    def trend(self):
        return self.hist[-1] - self.hist[0] if len(self.hist) > 1 else 0

    def step(self, frame):
        c = self.count(frame); t = self.trend()
        if c >= self.open_th or (c >= self.open_th-1 and t > 0):
            sig = "OPEN_TILL"                    # early: before waits build
        elif c <= self.close_th:
            sig = "CAN_CLOSE_TILL"
        else:
            sig = "HOLD"
        # ONLY the count + signal leave the device — never video or identities
        if self.sink:
            self.sink.publish("queue/status",
                {"count": c, "trend": t, "signal": sig, "ts": time.time()})
        return c, sig

    def run(self, camera):
        for frame in camera.frames():           # raw frames stay on-device
            self.step(frame)
            time.sleep(0.5)                      # counting needs only a few FPS

if __name__ == "__main__":
    QueueCounter(PersonDetector(), QUEUE_ROI, sink=Dashboard()).run(Camera())`,
    explain: [
      { ref: 'people = self.det.detect(frame, classes=["person"])   # on-device', txt: 'Detection runs on-device on raw frames that never leave the unit — the foundation of the privacy-respecting design.' },
      { ref: 'n = sum(1 for p in people if point_in_poly(center(p), self.roi))', txt: 'Counting is restricted to the queue region so only people actually waiting are counted.' },
      { ref: 'if c >= self.open_th or (c >= self.open_th-1 and t > 0):', txt: 'The open-till signal fires early — on a building trend near the threshold — so a till opens before the wait gets long.' },
      { ref: '# ONLY the count + signal leave the device — never video or identities', txt: 'Only the aggregate count and signal are published; video and any identity information stay on the device — counting, not identifying.' },
      { ref: 'time.sleep(0.5)                      # counting needs only a few FPS', txt: 'Queue counting needs only a few frames per second, which keeps it comfortably real-time on modest edge hardware.' },
    ],
  }],

  config: [
    'Configure the camera, on-device detector and the queue region of interest.',
    'Configure smoothing, open/close-till thresholds and trend sensitivity.',
    'Configure the staff signal and analytics logging (counts only).',
    'Configure privacy: on-device inference, no video egress, notice/consent.',
  ],
  calibration: [
    { h: 'ROI + counting', p: [
      'Define the queue region and verify the count matches a manual count at several lengths.',
    ] },
    { h: 'Thresholds', p: [
      'Set open/close thresholds from acceptable wait times and the service rate.',
    ] },
    { h: 'Robustness', p: [
      'Check counting under crowding/occlusion and different lighting; accept approximate counts when dense.',
    ] },
  ],
  testing: [
    { step: 'Short queue forms', expect: 'Accurate live count' },
    { step: 'Queue builds toward threshold', expect: 'OPEN_TILL signal fires early (trend)' },
    { step: 'Queue clears', expect: 'CAN_CLOSE_TILL signal' },
    { step: 'People pass by outside the ROI', expect: 'Not counted' },
    { step: 'Dense, occluded queue', expect: 'Approximate count — note the limit' },
    { step: 'Check data egress', expect: 'Only counts/signals leave; no video/identities' },
  ],
  output: [
    'Live queue length, early open/close-till signals, and queue analytics — with only counts leaving the device.',
    { file: 'queue-status.json', lang: 'json', body: `{
  "count": 5,
  "trend": 2,
  "signal": "OPEN_TILL",
  "est_wait_min": 6,
  "ts": "2026-07-28T17:12:00"
}` },
    'Five people and growing (+2), so the system signalled OPEN_TILL with an estimated 6-minute wait — the till is staffed before the queue becomes a problem; no video or identities ever left the device.',
  ],
  troubleshoot: [
    { sym: 'Counts passers-by', cause: 'ROI too broad', fix: 'Tighten the queue region; count centres inside it' },
    { sym: 'Count flickers', cause: 'No smoothing', fix: 'Median/temporal smoothing over frames' },
    { sym: 'Under-counts dense queues', cause: 'Occlusion', fix: 'Better angle/overhead; accept approximate at high density' },
    { sym: 'Signals too late', cause: 'Instant-only thresholds', fix: 'Act on the trend; open before crossing' },
    { sym: 'Misses people in low light', cause: 'Lighting/model', fix: 'Improve lighting; lower confidence; retrain if needed' },
    { sym: 'Privacy concern', cause: 'Video/identity egress', fix: 'On-device only; publish counts; count, don\'t identify' },
  ],

  perf: [
    'Count within the queue ROI and smooth for a steady live number.',
    'Act on the trend so tills open before waits build.',
    'Run on-device at a few FPS — counting does not need high frame rates.',
    'Publish counts/signals only; keep video on the device.',
  ],
  safety: [
    'Count, do not identify — run on-device, publish only counts/signals, keep video local.',
    'Respect privacy and notice/consent rules for cameras in the space.',
    'Do not repurpose the feed for surveillance/recognition — that breaks the design\'s premise.',
    'Treat counts as operational metrics, not judgements about individuals.',
  ],
  maintenance: [
    'Re-verify the ROI and counting accuracy after camera/layout changes.',
    'Re-tune thresholds as service rates/targets change.',
    'Keep the model and lighting adequate for reliable detection.',
    'Audit that only counts/signals leave the device.',
  ],
  future: [
    'Estimate waits from count + measured service rate.',
    'Add multi-queue / whole-store coverage and load balancing.',
    'Add heat-map analytics for layout optimisation.',
    'Integrate with workforce scheduling from historical peaks.',
  ],
  faq: [
    { q: 'What problem does it solve?', a: 'Stores manage queues by human noticing, which is inconsistent and always late. A live, objective count of people waiting lets the store open a till before the wait gets long — shortening waits and reducing walked-away sales.' },
    { q: 'How does it count only the queue?', a: 'It counts people whose position falls inside a defined queue region of interest, so passers-by and shoppers elsewhere are ignored. Counting over frames with smoothing gives a stable number and its trend.' },
    { q: 'Is it watching individual customers?', a: 'No. The goal is counting, not identification. It runs on-device so raw video never leaves the unit, it counts people rather than recognising faces, and only counts and signals are published — privacy-respecting by design.' },
    { q: 'Why act on the trend, not just the count?', a: 'Because opening a till takes time. If you wait until the count crosses the threshold, customers already wait too long. Acting when a queue is building toward the threshold staffs the till before the wait becomes painful.' },
    { q: 'How accurate is it?', a: 'Accurate for short and medium queues; approximate for dense, occluded crowds where people hide behind one another. For staffing decisions an approximate but continuous count is far better than the too-late human judgement it replaces.' },
  ],
  refs: [
    { t: 'Object detection (people)', u: 'https://en.wikipedia.org/wiki/Object_detection', s: 'Reference' },
    { t: 'Crowd counting', u: 'https://en.wikipedia.org/wiki/Crowd_counting', s: 'Reference' },
    { t: 'Queueing theory / waiting lines', u: 'https://en.wikipedia.org/wiki/Queueing_theory', s: 'Reference' },
    { t: 'Edge AI / on-device inference', u: 'https://en.wikipedia.org/wiki/Edge_computing', s: 'Reference' },
    { t: 'Privacy by design', u: 'https://en.wikipedia.org/wiki/Privacy_by_design', s: 'Reference' },
  ],
  images: ['retail', 'cctv', 'neural'],
  imageCaptions: [
    'A camera counts people waiting in line and turns the live count into a signal to open a till before the queue gets long.',
    'People are detected on-device and counted only within the queue region — counting, never identifying.',
    'Aggregated counts become queue analytics — peak times and waits — for scheduling staff to real demand.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   099 — Smart Vending Telemetry
   ══════════════════════════════════════════════════════════════════ */
{
  id: '099',
  domainKey: 'iot',
  emoji: '🥤', thumb: 'board',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Puts every vending machine online — reporting stock, sales and faults in real time so you restock the right machines, never miss a sale, and fix breakdowns fast.',

  overview: [
    'A vending machine is a shop that runs itself in a location no one visits — which is exactly why it is so often failing quietly: sold out of its best line for a week, jammed and taking money for nothing, or being restocked on a fixed schedule that wastes trips to full machines and misses empty ones. The reason is that the operator is <b>blind</b> between visits. This project fixes that by putting the machine online: a telemetry unit reports <b>stock, sales and faults in real time</b>, so the operator always knows the true state of every machine and can act on it.',
    'The unit monitors what matters commercially and operationally. It tracks <b>stock levels</b> per slot (from vend events, and optionally sensors) so the operator knows what is running low <i>where</i>; it records <b>sales</b> (what sold, when, for how much) for revenue visibility and demand insight; and it detects <b>faults</b> — a jam, a payment failure, a temperature problem in a chilled machine, a door left open — and alerts immediately. All of this streams over cellular (vending machines rarely have Wi-Fi) to a central platform.',
    'The value is turning a fleet of blind machines into a managed, data-driven operation: <b>route restocking</b> to the machines that actually need it (and skip the ones that don\'t), never miss sales to unnoticed sell-outs, fix breakdowns fast instead of after a customer complains, and understand demand to stock each machine to its location. It is honest that integrating with real vending hardware (via MDB/DEX or sensors) varies by machine, and that payment/cash handling is a regulated, security-sensitive domain to be treated carefully. But as a real-time stock/sales/fault telemetry unit, it gives vending operators the one thing an unattended machine never has: continuous visibility.',
  ],
  does: [
    'Reports per-slot stock levels in real time',
    'Records sales (item, time, price) for revenue/demand insight',
    'Detects and alerts faults (jam, payment, temperature, door)',
    'Streams telemetry over cellular to a central platform',
    'Routes restocking to the machines that need it',
    'Catches sell-outs and breakdowns immediately',
    'Turns a blind fleet into a managed operation',
  ],
  features: [
    'Per-slot stock tracking (vend events / sensors)',
    'Sales recording and demand analytics',
    'Fault detection + immediate alerts',
    'Cellular telemetry to a fleet platform',
    'Restock-routing and sell-out prevention',
    'Machine health (temperature, door, payment)',
    'Honest about vending-hardware integration and payment security',
  ],
  applications: [
    { t: 'Vending fleet management', d: 'Live stock, sales and faults across many machines.' },
    { t: 'Route optimisation', d: 'Restocking only machines that need it, cutting wasted trips.' },
    { t: 'Revenue visibility', d: 'Real-time sales and demand per machine/location.' },
    { t: 'Uptime / service', d: 'Fast fault response instead of customer complaints.' },
  ],
  skills: [
    'Vending integration (MDB/DEX or sensor-based) for vend/sale events',
    'Per-slot stock and sales tracking',
    'Fault detection (jam/payment/temperature/door)',
    'Cellular telemetry to a platform',
    'Fleet analytics: restock routing, demand',
  ],
  prereq: [
    'The operator is blind between visits — real-time telemetry restores visibility.',
    'Track stock, sales and faults — the three things that matter commercially/operationally.',
    'Vending machines rarely have Wi-Fi — stream over cellular.',
    'Payment/cash handling is regulated and security-sensitive — treat it carefully.',
  ],

  parts: ['esp32', 'sim800', 'ds18b20', 'reed', 'oled', 'li18650'],
  extraParts: [
    { name: 'Vending interface', spec: 'MDB/DEX tap or vend-event sensors for sales/stock', qty: 1, price: 700, note: 'Integration varies by machine' },
    { name: 'Cellular modem + SIM', spec: 'Telemetry uplink (no Wi-Fi at most sites)', qty: 1, price: 900 },
    { name: 'Health sensors', spec: 'Temperature (chilled), door (reed), jam/payment status', qty: 1, price: 300 },
    { name: 'Enclosure + power', spec: 'In-machine mount, powered from the machine', qty: 1, price: 300 },
  ],
  cost: '₹2,800 – ₹5,000 per machine',
  libs: ['wifi', 'pubsub', 'onewire', 'arduinojson', 'ntp'],

  pins: {
    left: [
      { dev: 'Vending interface', devPin: 'MDB/DEX/UART', pin: 'GPIO 16/17', sig: 'Vend/sale events' },
      { dev: 'Temp sensor', devPin: 'DATA', pin: 'GPIO 4', sig: 'Chilled-machine temp' },
      { dev: 'Door reed', devPin: 'IN', pin: 'GPIO 34', sig: 'Door open' },
    ],
    right: [
      { dev: 'Cellular modem', devPin: 'UART', pin: 'GPIO 27/14', sig: 'Telemetry uplink' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Local status' },
      { dev: 'Machine power', devPin: '12/24V', pin: 'reg', sig: 'Power' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Health' },
    ],
  },
  wiringNotes: [
    'Interface the machine for vend/sale events (MDB/DEX where available, or vend-detect sensors) — integration varies by machine.',
    'Add health sensors: temperature for chilled machines, a door reed, and jam/payment status where accessible.',
    'Stream telemetry over cellular; vending sites rarely have Wi-Fi.',
    'Power from the machine via a regulator; keep the unit isolated from payment/cash systems.',
    'Do not interfere with payment/cash handling — monitor, and treat that domain as security-sensitive.',
  ],

  block: { columns: [
    { label: 'Monitor', edge: 'right', blocks: [
      { name: 'Vend/sale', sub: 'events', highlight: true },
      { name: 'Stock', sub: 'per slot' },
      { name: 'Health', sub: 'temp/door/jam' },
    ] },
    { label: 'Detect', edge: 'right', blocks: [
      { name: 'Low stock', sub: 'sell-out risk' },
      { name: 'Fault', sub: 'jam/pay/temp', highlight: true },
    ] },
    { label: 'Stream', edge: 'right', blocks: [
      { name: 'Cellular', sub: 'to platform' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Route restock', sub: 'who needs it' },
      { name: 'Fix fast', sub: 'fault alert' },
    ] },
  ] },
  flow: [
    { t: 'Monitor vends, stock, health', k: 'start' },
    { t: 'Vend event?', k: 'dec', yes: 'Record sale; decrement slot stock', no: 'Check faults' },
    { t: 'Record sale; decrement slot stock', k: 'io' },
    { t: 'Check faults', k: 'proc' },
    { t: 'Fault or low stock?', k: 'dec', yes: 'Alert (fault / restock)', no: 'Report telemetry' },
    { t: 'Alert (fault / restock)', k: 'io' },
    { t: 'Report telemetry', k: 'io' },
    { t: 'Stream to platform', k: 'end', back: 'Monitor vends, stock, health' },
  ],

  principle: [
    'A vending machine\'s whole business model is being unattended — a shop in a place no one staffs — and that is precisely what makes it fail expensively. Between an operator\'s visits the machine can sell out of its best product and keep taking custom for lines nobody wants, jam and refuse to vend while still accepting payment, or (if chilled) drift out of safe temperature — and the operator learns none of it until the next scheduled visit, which itself may be a wasted trip to a machine that is still full. Every one of these losses is a <b>visibility</b> problem, and telemetry solves it by making the unattended machine <b>continuously report its own state</b>.',
    'The telemetry tracks the three things that actually determine a vending operation\'s success. <b>Stock</b> per slot tells the operator what is running low and <i>in which machine</i>, so a sell-out is anticipated rather than discovered — tracked from vend events (each vend decrements a slot) and optionally sensors. <b>Sales</b> — what sold, when, at what price — give real-time revenue visibility and, aggregated, reveal <b>demand</b>: which products move at which locations, so each machine can be stocked to its site instead of a generic planogram. <b>Faults</b> — a jam, a payment failure, an over-temperature in a chiller, a door left open — are detected and alerted <i>immediately</i>, because a broken machine earns nothing and annoys customers for every hour it stays broken unknown.',
    'The transport reality shapes the design: vending machines sit in lobbies, corridors and streets that rarely offer Wi-Fi, so telemetry streams over <b>cellular</b> to a central platform. There the individual machines become a <b>managed fleet</b>. The operational payoffs are direct and measurable: <b>restocking is routed</b> to the machines that need it (and full machines are skipped), turning fixed, wasteful schedules into demand-driven routes; <b>sell-outs are prevented</b>, so the machine is always selling its best lines; <b>breakdowns are fixed fast</b>, maximising uptime and revenue; and <b>demand data</b> informs what to stock where. This is the same shift every telemetry system delivers — from reacting late to acting on live data — applied to a fleet whose defining feature is that no one is watching it.',
    'The design is honest about two real constraints. First, <b>integration varies</b>: some machines expose sales/stock through standard interfaces (MDB between the controller and peripherals, DEX for audit data), while others need vend-detection sensors retrofitted — so the telemetry unit meets the machine where it is. Second, and importantly, <b>payment and cash handling is a regulated, security-sensitive domain</b>: the telemetry unit is a <i>monitor</i>, and it must not interfere with payment/cash systems or handle payment data casually — anything touching payments carries compliance and security obligations that must be respected. Within those honest bounds, the unit delivers exactly what an unattended machine has always lacked and most needs: continuous, real-time visibility of its stock, its sales and its faults, so the operator can run a fleet on data instead of guesswork.',
  ],
  equations: [
    { t: 'Stock tracking from vends', eq: 'Each slot starts at capacity; every vend decrements it:\n\n  stock[slot] -= 1   on a vend event\n  low if stock[slot] ≤ SLOT_MIN → restock this slot/machine\n\nOptionally corrected by sensors / restock re-tare.' },
    { t: 'Fault detection', eq: 'jam       : vend commanded but not dispensed\npayment   : repeated payment failures\ntemp      : chiller temp > T_max for > t\ndoor      : open beyond a service window\n\n→ immediate alert (a broken machine earns nothing).' },
    { t: 'Fleet value', eq: 'route restock → only machines with low stock (skip full)\nprevent sell-outs → always selling best lines\nfix faults fast → maximise uptime × revenue\ndemand → stock each machine to its location.' },
  ],

  assembly: [
    { h: 'Interface the machine for vend/sale events', p: [
      'Tap vend/sale events via MDB/DEX where available, or fit vend-detection sensors, and add health sensors (temperature, door, jam/payment status).',
    ], warn: 'Do not interfere with payment/cash handling — the unit monitors only, and payment is a regulated, security-sensitive domain. Isolate the telemetry unit from payment systems and handle any payment-adjacent data with care.' },
    { h: 'Track stock/sales and detect faults', p: [
      'Decrement slot stock on vends, record sales, and detect jams, payment failures, temperature and door faults.',
    ] },
    { h: 'Stream over cellular and manage the fleet', p: [
      'Stream telemetry to a platform over cellular, alert on faults/low stock, and drive restock routing and demand analytics.',
    ] },
  ],
  steps: [
    { h: 'Record sales, track stock and flag faults', p: [
      'On each vend, record the sale and decrement the slot; independently check for faults (jam, payment, temperature, door) and flag low stock.',
    ], code: {
      file: 'vending.ino', lang: 'cpp',
      body: `int stock[SLOTS];                 // per-slot remaining
const int SLOT_MIN = 2;
const float T_MAX = 8.0;          // chiller degC

// A completed vend: record the sale and decrement the slot.
void onVend(int slot, int price_cents){
  if (stock[slot] > 0) stock[slot]--;
  recordSale(slot, price_cents, now());          // revenue + demand
  if (stock[slot] <= SLOT_MIN)
    alert("low_stock", slot);                    // restock THIS slot/machine
}

// Independent health/fault checks.
const char* checkFaults(bool vendFailed, int payFails, float temp, bool doorOpen){
  if (vendFailed)          return "jam";          // commanded, not dispensed
  if (payFails >= 3)       return "payment_fault";
  if (temp > T_MAX)        return "over_temperature";
  if (doorOpen)            return "door_open";
  return nullptr;
}`,
      explain: [
        { ref: 'if (stock[slot] > 0) stock[slot]--;', txt: 'Each vend decrements that slot\'s stock, so the operator always knows what is running low and where.' },
        { ref: 'recordSale(slot, price_cents, now());          // revenue + demand', txt: 'Sales are recorded with time and price for real-time revenue visibility and demand analysis.' },
        { ref: 'if (stock[slot] <= SLOT_MIN)\n    alert("low_stock", slot);                    // restock THIS slot/machine', txt: 'A low slot flags for restock before it sells out, and names the exact slot and machine for routing.' },
        { ref: 'if (vendFailed)          return "jam";          // commanded, not dispensed', txt: 'A jam is inferred when a vend is commanded but nothing dispenses — a fault that otherwise takes money for nothing until noticed.' },
      ],
    } },
    { h: 'Stream telemetry and alert immediately', p: [
      'Stream stock/sales/health to the platform over cellular, and alert immediately on faults and low stock so machines are fixed and restocked fast.',
    ], tip: 'Alert on a jam or payment fault instantly — a broken machine earns nothing and frustrates customers every hour it sits unknown, so fault latency is money.' },
  ],

  code: [{
    file: 'vending_telemetry.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Vending Telemetry — ESP32 + cellular

   Reports per-slot STOCK, SALES and FAULTS in real time to a fleet
   platform over cellular, so operators route restocking, prevent
   sell-outs, and fix breakdowns fast. Monitors only — never interferes
   with payment/cash (a regulated, security-sensitive domain).
   ══════════════════════════════════════════════════════════════════ */

#include <ArduinoJson.h>

#define SLOTS 24
int   stock[SLOTS];
const int   SLOT_MIN = 2;
const float T_MAX = 8.0;
const char* MACHINE = "VM-207";

void stream(const char* topic, JsonDocument& d){
  char buf[256]; serializeJson(d, buf);
  cellularPublish(topic, buf);                   // over cellular
}

void onVend(int slot, int price){                // completed sale
  if (stock[slot] > 0) stock[slot]--;
  StaticJsonDocument<128> s;
  s["machine"]=MACHINE; s["slot"]=slot; s["price"]=price; s["stock"]=stock[slot];
  stream("vending/sale", s);                     // sales + demand
  if (stock[slot] <= SLOT_MIN){
    StaticJsonDocument<96> a;
    a["machine"]=MACHINE; a["slot"]=slot; a["alert"]="low_stock";
    stream("vending/alert", a);                  // route restock here
  }
}

void reportHealth(bool vendFailed, int payFails, float temp, bool door){
  const char* fault = nullptr;
  if (vendFailed) fault="jam";
  else if (payFails>=3) fault="payment_fault";
  else if (temp>T_MAX) fault="over_temperature";
  else if (door) fault="door_open";

  StaticJsonDocument<160> h;
  h["machine"]=MACHINE; h["temp"]=temp; h["door"]=door;
  h["fault"]=fault?fault:"none";
  stream("vending/health", h);
  if (fault) stream("vending/fault", h);         // immediate fault alert
}

void setup(){ cellularInit(); loadStock(stock); }

void loop(){
  int slot, price;
  if (pollVendEvent(&slot, &price)) onVend(slot, price);   // MDB/DEX/sensor
  reportHealth(vendFailed(), paymentFailures(), chillerTemp(), doorOpen());
  delay(5000);
}`,
    explain: [
      { ref: 'if (stock[slot] > 0) stock[slot]--;', txt: 'Slot stock is decremented on each vend so per-slot levels stay current for restock routing.' },
      { ref: 'stream("vending/sale", s);                     // sales + demand', txt: 'Every sale streams to the platform for real-time revenue visibility and demand analytics.' },
      { ref: 'stream("vending/alert", a);                  // route restock here', txt: 'A low slot alerts with the machine and slot, so restocking goes only to machines that need it.' },
      { ref: 'if (fault) stream("vending/fault", h);         // immediate fault alert', txt: 'Faults raise an immediate alert, because a broken machine loses money every hour it sits unknown.' },
      { ref: 'if (pollVendEvent(&slot, &price)) onVend(slot, price);   // MDB/DEX/sensor', txt: 'Vend events come from the machine\'s interface (MDB/DEX) or sensors — integration meets the machine where it is.' },
    ],
  }],

  config: [
    'Configure the vending interface (MDB/DEX or sensors) and per-slot capacities.',
    'Configure low-stock thresholds, fault checks and chiller temperature limit.',
    'Configure cellular telemetry and the fleet platform link.',
    'Configure isolation from payment/cash systems (monitor only).',
  ],
  calibration: [
    { h: 'Vend/stock accuracy', p: [
      'Verify vends decrement the right slot and that stock matches a manual count; re-set on restock.',
    ] },
    { h: 'Fault detection', p: [
      'Confirm jams, payment failures, over-temperature and door-open are detected and alerted.',
    ] },
    { h: 'Connectivity', p: [
      'Verify cellular telemetry across the machine\'s locations.',
    ] },
  ],
  testing: [
    { step: 'Make a vend', expect: 'Sale recorded; slot stock decrements' },
    { step: 'Draw a slot to threshold', expect: 'Low-stock alert naming machine + slot' },
    { step: 'Simulate a jam', expect: 'Immediate jam fault alert' },
    { step: 'Raise chiller temperature', expect: 'Over-temperature alert' },
    { step: 'Leave the door open', expect: 'Door-open alert' },
    { step: 'Query the platform', expect: 'Live stock/sales/health across the fleet' },
  ],
  output: [
    'Real-time stock, sales and fault telemetry per machine, driving restock routing and fast fault response.',
    { file: 'vending-telemetry.json', lang: 'json', body: `{
  "machine": "VM-207",
  "slot": 6,
  "sale_price": 150,
  "stock": 2,
  "temp": 5.4,
  "fault": "none",
  "alert": "low_stock"
}` },
    'Machine VM-207 just sold slot 6 down to 2 units and flagged low stock — restock is routed to this machine and slot specifically, while a full machine nearby is skipped.',
  ],
  troubleshoot: [
    { sym: 'Stock count drifts', cause: 'Missed vends / no restock reset', fix: 'Reliable vend detection; reset stock on restock' },
    { sym: 'No sales/vend events', cause: 'Interface mismatch', fix: 'Match MDB/DEX or fit vend sensors per machine' },
    { sym: 'Jams not caught', cause: 'No vend-fail detection', fix: 'Detect commanded-but-not-dispensed vends' },
    { sym: 'No telemetry at a site', cause: 'Cellular coverage', fix: 'Check signal/antenna; buffer and retry' },
    { sym: 'Payment concerns', cause: 'Touching payment systems', fix: 'Monitor only; isolate; treat payment as regulated/secure' },
    { sym: 'Restocking still wasteful', cause: 'Not using telemetry for routing', fix: 'Route to low-stock machines; skip full ones' },
  ],

  iot: {
    protoShort: 'Cellular → vending fleet platform',
    net: {
      nodes: [{ name: 'Machine unit', sub: 'ESP32' }, { name: 'Vending fleet', sub: 'all machines' }],
      protocol: 'Cellular', gateway: 'Carrier', gatewaySub: 'to platform',
      uplink: 'MQTT/HTTPS', cloud: 'Vending platform', cloudSub: 'stock/sales/faults',
      clients: [{ name: 'Operator', sub: 'restock/route' }, { name: 'Service', sub: 'fault alerts' }],
    },
    protocol: ['Machines stream stock, sales and health/faults; the platform turns them into restock routes, revenue views and service alerts.'],
    topics: [
      { t: 'vending/sale', dir: 'machine → platform', payload: 'machine, slot, price, stock' },
      { t: 'vending/alert', dir: 'machine → operator', payload: 'low-stock (machine, slot)' },
      { t: 'vending/fault', dir: 'machine → service', payload: 'jam / payment / temp / door' },
    ],
    cloud: ['A fleet platform provides live stock/sales/health, restock routing, revenue/demand analytics, and fault dispatch.'],
    dashboard: ['A fleet view of each machine\'s stock, sales, health and faults, with a prioritised restock route.'],
    mobile: ['Fault alerts and low-stock alerts with the machine/slot to service.'],
    security: [
      'Authenticate machines; secure telemetry.',
      'Monitor only — never interfere with payment/cash; treat payments as regulated/secure.',
      'Isolate the telemetry unit from payment systems.',
    ],
  },

  perf: [
    'Track stock per slot from reliable vend detection; reset on restock.',
    'Alert on faults immediately — fault latency is lost revenue.',
    'Stream over cellular; buffer/retry where coverage is patchy.',
    'Drive restock routing and demand stocking from the data.',
  ],
  safety: [
    'Monitor only — never interfere with payment/cash handling, a regulated and security-sensitive domain.',
    'Isolate the telemetry unit from payment systems; handle any payment-adjacent data securely.',
    'For chilled machines, treat over-temperature as a food-safety alert.',
    'Install safely inside the machine, powered via a proper regulator.',
  ],
  maintenance: [
    'Reset slot stock on each restock; verify vend detection accuracy.',
    'Check fault detection (jam/payment/temp/door) periodically.',
    'Verify cellular coverage and telemetry delivery.',
    'Review demand data to keep each machine stocked to its location.',
  ],
  future: [
    'Add predictive restock (from sale-rate trends).',
    'Add cashless/telemetry integration where compliant and secure.',
    'Add dynamic pricing/promotions from demand.',
    'Add energy monitoring and remote diagnostics.',
  ],
  faq: [
    { q: 'Why do vending machines need telemetry?', a: 'Because they are unattended, the operator is blind between visits — machines sell out, jam while still taking money, or drift out of temperature, all unnoticed. Real-time stock, sales and fault reporting restores visibility so the operator can act.' },
    { q: 'How does it track stock?', a: 'Primarily from vend events — each vend decrements the slot — reset on restock, and optionally corrected by sensors. That tells the operator exactly what is low and in which machine.' },
    { q: 'Why cellular rather than Wi-Fi?', a: 'Vending machines sit in lobbies, corridors and streets that rarely offer Wi-Fi, so telemetry streams over cellular to reach a central platform reliably.' },
    { q: 'How does it save money?', a: 'By routing restocking only to machines that need it (skipping full ones), preventing sell-outs so the machine is always selling its best lines, fixing faults fast to maximise uptime, and using demand data to stock each machine to its location.' },
    { q: 'Does it handle payments?', a: 'No — it monitors only. Payment and cash handling is a regulated, security-sensitive domain, so the unit does not interfere with payment systems and treats any payment-adjacent data with care.' },
  ],
  refs: [
    { t: 'Vending machine', u: 'https://en.wikipedia.org/wiki/Vending_machine', s: 'Reference' },
    { t: 'Vending telemetry / MDB', u: 'https://en.wikipedia.org/wiki/Multidrop_bus', s: 'Reference' },
    { t: 'DEX (data exchange)', u: 'https://en.wikipedia.org/wiki/Digital_Exchange_(vending)', s: 'Reference' },
    { t: 'Telemetry', u: 'https://en.wikipedia.org/wiki/Telemetry', s: 'Reference' },
    { t: 'Fleet / route optimisation', u: 'https://en.wikipedia.org/wiki/Vehicle_routing_problem', s: 'Reference' },
  ],
  images: ['retail', 'esp32', 'grafana'],
  imageCaptions: [
    'Smart vending telemetry puts every machine online — reporting stock, sales and faults in real time.',
    'Vend events drive per-slot stock tracking so restocking is routed only to machines that need it.',
    'A fleet platform turns live telemetry into restock routes, revenue analytics and fast fault response.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   100 — NFC Smart Attendance
   ══════════════════════════════════════════════════════════════════ */
{
  id: '100',
  domainKey: 'iot',
  emoji: '📇', thumb: 'board',
  difficulty: 'Beginner',
  hours: '8–14 hours', iso8601: 'PT12H',
  tagline: 'Tap a card to check in — instant, accurate, tamper-resistant attendance for offices, schools and events, logged automatically to the cloud.',

  overview: [
    'Attendance is still, absurdly often, taken on paper or by calling out names — slow, error-prone, easy to fake (a friend signs you in), and a chore to tally. Yet almost everyone already carries a tap-able credential — an <b>NFC</b> card or phone — and the technology to read it instantly is cheap. This project builds an <b>NFC attendance</b> system: you tap your card on a reader, and your presence is recorded instantly, accurately and automatically, logged to the cloud. It replaces a tedious, unreliable ritual with a one-second tap.',
    'The mechanics are simple and robust. Each person has an NFC card (or phone) with a unique ID; an <b>NFC/RFID reader</b> (e.g. PN532 or MRC522) reads that ID on a tap; the system looks it up, records a <b>timestamped attendance entry</b> (who, when, in/out), gives immediate feedback (a beep and a name/green light so the person knows it registered), and syncs the log to a central store. A real-time clock and reliable logging ensure entries are correctly timed and never lost, even if the network is briefly down.',
    'The value is attendance that is <b>instant, accurate and tamper-resistant</b>: no queues of name-calling, no illegible sign-in sheets, no manual tallying, and a clear audit trail. It works for offices (staff time and access), schools and colleges (class attendance), and events (check-in). It is honest about its bounds — a card proves the <i>card</i> was tapped, not who tapped it, so buddy-punching is mitigated but not eliminated without a second factor (PIN/photo/biometric), and NFC cards themselves should be handled with basic security. But as a fast, reliable, cloud-logged tap-to-attend system, it turns one of the most tedious and fudged administrative tasks into a frictionless, trustworthy one.',
  ],
  does: [
    'Records attendance on an NFC card/phone tap',
    'Reads a unique card ID and looks up the person',
    'Logs a timestamped entry (who, when, in/out)',
    'Gives immediate feedback (beep, name, green light)',
    'Syncs the log to a central/cloud store reliably',
    'Provides an accurate, tamper-resistant audit trail',
    'Replaces slow, fakeable paper/roll-call attendance',
  ],
  features: [
    'NFC/RFID tap-to-attend',
    'Timestamped in/out logging (RTC)',
    'Immediate user feedback',
    'Reliable local logging + cloud sync (offline-safe)',
    'Duplicate/debounce handling',
    'Optional second factor (PIN) against buddy-punching',
    'Honest about card-not-person and NFC security',
  ],
  applications: [
    { t: 'Office time & attendance', d: 'Staff check-in/out with a tap; accurate timesheets.' },
    { t: 'School / college attendance', d: 'Fast class attendance without roll-call.' },
    { t: 'Event check-in', d: 'Instant attendee check-in at the door.' },
    { t: 'Access-linked logging', d: 'Attendance tied to entry points.' },
  ],
  skills: [
    'NFC/RFID reading (PN532/MRC522) of card IDs',
    'Timestamped logging with an RTC',
    'Reliable local logging + cloud sync (offline-safe)',
    'Debounce/duplicate handling and user feedback',
    'Basic NFC security and second-factor considerations',
  ],
  prereq: [
    'Everyone already carries a tap-able credential — use it for instant attendance.',
    'Log timestamped entries reliably; never lose one if the network blips.',
    'A card proves the card, not the person — buddy-punching needs a second factor.',
    'Handle NFC cards/IDs with basic security.',
  ],

  parts: ['esp32', 'pn532', 'oled', 'buzzer', 'rtc', 'li18650'],
  extraParts: [
    { name: 'NFC/RFID reader', spec: 'PN532 or MRC522 to read card/phone IDs', qty: 1, price: 300, note: 'The tap reader' },
    { name: 'NFC cards/tags', spec: 'Per-person cards (or use phones)', qty: 20, price: 400 },
    { name: 'RTC module', spec: 'Real-time clock for accurate timestamps', qty: 1, price: 100 },
    { name: 'Feedback + enclosure', spec: 'OLED/LED + buzzer, wall/desk enclosure', qty: 1, price: 300 },
  ],
  cost: '₹1,200 – ₹2,500',
  libs: ['wifi', 'mfrc522', 'ssd1306', 'preferences', 'ntp', 'sqlite'],

  pins: {
    left: [
      { dev: 'NFC reader', devPin: 'SPI/I2C', pin: 'GPIO 18/23/5', sig: 'Card ID on tap' },
      { dev: 'RTC', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Accurate time' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Name/feedback' },
      { dev: 'Buzzer + LED', devPin: 'IN', pin: 'GPIO 25/26', sig: 'Tap feedback' },
      { dev: 'Wi-Fi', devPin: 'onboard', pin: '—', sig: 'Cloud sync' },
      { dev: 'Supply', devPin: '5V', pin: '5V', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Connect the NFC/RFID reader (SPI or I2C) to read card IDs on a tap.',
    'Add an RTC for accurate timestamps independent of network time.',
    'Add clear feedback — an OLED name/green light and a beep — so people know the tap registered.',
    'Log locally and sync to the cloud so entries survive a network blip.',
    'Mount the reader at a comfortable tap height at the entry point.',
  ],

  block: { columns: [
    { label: 'Tap', edge: 'right', blocks: [
      { name: 'NFC card', sub: 'unique ID', highlight: true },
      { name: 'Reader', sub: 'read ID' },
    ] },
    { label: 'Identify', edge: 'right', blocks: [
      { name: 'Lookup', sub: 'person', highlight: true },
      { name: 'In/out', sub: 'state' },
    ] },
    { label: 'Log', edge: 'right', blocks: [
      { name: 'Timestamp', sub: 'RTC' },
      { name: 'Local + cloud', sub: 'reliable' },
    ] },
    { label: 'Feedback', edge: 'none', blocks: [
      { name: 'Beep + name', sub: 'confirm' },
      { name: 'Audit trail', sub: 'accurate' },
    ] },
  ] },
  flow: [
    { t: 'Card tapped → read unique ID', k: 'start' },
    { t: 'Known card?', k: 'dec', yes: 'Look up person + in/out', no: 'Reject (unknown card)' },
    { t: 'Reject (unknown card)', k: 'io' },
    { t: 'Look up person + in/out', k: 'proc' },
    { t: 'Duplicate within debounce?', k: 'dec', yes: 'Ignore (debounce)', no: 'Log timestamped entry' },
    { t: 'Ignore (debounce)', k: 'io' },
    { t: 'Log timestamped entry', k: 'io' },
    { t: 'Feedback (beep + name) + sync', k: 'end', back: 'Card tapped → read unique ID' },
  ],

  principle: [
    'Attendance is a small task done badly at enormous scale. Paper sign-in sheets and verbal roll-calls are slow, produce illegible or error-prone records, must be tallied by hand, and are trivially <b>fakeable</b> — a friend signs you in, a name is called and answered for someone else. The irony is that the fix is already in everyone\'s pocket or wallet: a tap-able <b>NFC</b> credential. Reading it takes a fraction of a second and cheap hardware, so the design goal is simply to make presence <b>register on a tap</b> — instant, accurate, and logged automatically — replacing the ritual with a one-second action.',
    'The mechanism rests on <b>NFC/RFID identification</b>. Every NFC card or phone carries a <b>unique identifier</b>; a reader energises a nearby card and reads that ID over a very short range (which is a feature — you must deliberately tap, not merely walk past). The system maps the ID to a person and records the event. The short range and unique ID make the interaction crisp and unambiguous: one tap, one identified person, one entry. This is the same technology behind contactless payment and access cards, applied to the specific job of marking who is present.',
    'What turns a reader into a trustworthy <b>attendance system</b> is doing the surrounding jobs reliably. Each entry must be <b>accurately timestamped</b> — hence a real-time clock, so the record does not depend on network time and is right even offline. The person needs <b>immediate feedback</b> — a beep and their name or a green light — so they <i>know</i> it registered and do not tap repeatedly or walk off unrecorded. The log must be <b>reliable</b>: written locally first and synced to a central/cloud store, so a brief network outage never loses an entry. And the system must handle the mundane realities — <b>debouncing</b> a card held too long so it does not log ten times, distinguishing <b>in from out</b>, and rejecting unknown cards. These unglamorous details are the difference between a demo and something an office or school can actually rely on.',
    'The design is honest about the one thing NFC attendance cannot do on its own: a card proves that <b>the card was tapped</b>, not who tapped it. This mitigates casual fakery (it is harder and more deliberate than answering a roll-call for a friend) but does not eliminate <b>buddy-punching</b> — handing your card to a colleague — without a <b>second factor</b>, such as a PIN, a photo prompt, or a biometric, which the system can add where the stakes justify it. It is also honest that NFC cards and their IDs deserve basic <b>security</b> hygiene (they can be cloned if treated carelessly), and that the attendance log is <b>personal data</b> to be protected. Within those honest bounds, the system delivers exactly what attendance has always wanted to be: fast enough that no one minds, accurate enough to trust, tamper-resistant enough to be fair, and automatic enough to need no tallying — a tedious, fudged chore turned into a frictionless tap.',
  ],
  equations: [
    { t: 'Tap → identified entry', eq: 'read card UID  →  person = lookup(UID)\n\n  if person unknown:  reject\n  else: entry = { person, time (RTC), in/out }\n\nUnique UID + short range → one deliberate tap, one entry.' },
    { t: 'Debounce / in-out', eq: 'Ignore repeats of the same UID within a debounce window:\n\n  if now − last_tap[UID] < DEBOUNCE:  ignore\n  else: toggle/record in-or-out; last_tap[UID] = now\n\nStops a held card logging many times.' },
    { t: 'Reliable, tamper-resistant logging', eq: 'log locally FIRST (never lose an entry)\n  then sync to cloud when connected\n\nCard proves the CARD, not the person:\n  buddy-punching mitigated, not eliminated\n  → optional 2nd factor (PIN/photo/biometric) for assurance.' },
  ],

  assembly: [
    { h: 'Build the reader with clock and feedback', p: [
      'Connect the NFC/RFID reader, add an RTC for accurate timestamps, and add clear feedback (OLED name/green light + beep) at a comfortable tap height.',
    ], warn: 'A card proves the card was tapped, not who tapped it. For anything where buddy-punching matters, add a second factor (PIN/photo/biometric), and handle NFC cards/IDs and the attendance log with basic security — the log is personal data.' },
    { h: 'Identify, debounce and log reliably', p: [
      'Map the card UID to a person, debounce repeat taps, record a timestamped in/out entry, and log locally before syncing.',
    ] },
    { h: 'Sync to the cloud and report', p: [
      'Sync entries to a central/cloud store (offline-safe) and provide attendance reports.',
    ] },
  ],
  steps: [
    { h: 'Read a tap, identify and log a timestamped entry', p: [
      'On a tap, read the card UID, look up the person, debounce repeats, and record a timestamped in/out entry with immediate feedback.',
    ], code: {
      file: 'attendance.ino', lang: 'cpp',
      body: `const uint32_t DEBOUNCE_MS = 3000;    // ignore repeats within 3 s

struct Person { const char* name; bool present; uint32_t lastTap; };

// Look up a card UID -> person (unknown returns nullptr).
Person* lookup(const char* uid){ return registry_find(uid); }

void onTap(const char* uid){
  Person* p = lookup(uid);
  if (!p){ feedback("Unknown card", RED); return; }   // reject unknown

  if (millis() - p->lastTap < DEBOUNCE_MS) return;     // debounce held card
  p->lastTap = millis();

  p->present = !p->present;                            // toggle in/out
  logEntry(uid, p->name, rtcNow(), p->present ? "IN" : "OUT");  // timestamped
  feedback(p->name, GREEN);                            // confirm the tap
}`,
      explain: [
        { ref: 'if (!p){ feedback("Unknown card", RED); return; }   // reject unknown', txt: 'An unrecognised card is rejected with clear feedback, so only registered people are logged.' },
        { ref: 'if (millis() - p->lastTap < DEBOUNCE_MS) return;     // debounce held card', txt: 'Debouncing stops a card held on the reader from logging many entries — a mundane but essential detail.' },
        { ref: 'p->present = !p->present;                            // toggle in/out', txt: 'The entry distinguishes in from out, so the record reflects actual presence over the day.' },
        { ref: 'logEntry(uid, p->name, rtcNow(), p->present ? "IN" : "OUT");  // timestamped', txt: 'Each entry is timestamped from the RTC, so records are accurate independent of network time.' },
      ],
    } },
    { h: 'Log reliably and sync to the cloud', p: [
      'Write each entry locally first so none is lost, then sync to the central/cloud store when connected, and provide reports.',
    ], tip: 'Log locally before you sync — an attendance entry must never be lost to a network blip. Sync is for aggregation and reporting, not for reliability.' },
  ],

  code: [{
    file: 'nfc_attendance.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   NFC Smart Attendance — ESP32 + NFC reader + RTC

   Tap a card to record instant, accurate, timestamped attendance
   (in/out), with immediate feedback, reliable local logging and cloud
   sync (offline-safe). A card proves the CARD, not the person — add a
   second factor where buddy-punching matters.
   ══════════════════════════════════════════════════════════════════ */

#include <MFRC522.h>
#include <Preferences.h>

MFRC522 reader(5, 22);
const uint32_t DEBOUNCE_MS = 3000;

struct Person { String name; bool present; uint32_t lastTap; };

Person* lookup(const String& uid);            // registry (id -> person)
String  rtcNow();                             // accurate timestamp
void    feedback(const String& msg, int col); // OLED + beep + LED

void logLocal(const String& uid, const String& name,
              const String& ts, const char* dir){
  // write to local storage FIRST so an entry is never lost
  appendLog("{\\"uid\\":\\"" + uid + "\\",\\"name\\":\\"" + name +
            "\\",\\"t\\":\\"" + ts + "\\",\\"dir\\":\\"" + dir + "\\"}");
}

void syncCloud(){
  if (!wifiUp()) return;                       // offline: keep local, sync later
  for (auto& line : pendingLogLines()) cloudPost(line);   // aggregate/report
  clearSynced();
}

void onTap(const String& uid){
  Person* p = lookup(uid);
  if (!p){ feedback("Unknown card", RED); return; }        // reject unknown
  if (millis() - p->lastTap < DEBOUNCE_MS) return;         // debounce
  p->lastTap = millis();

  p->present = !p->present;                                 // in/out
  logLocal(uid, p->name, rtcNow(), p->present ? "IN" : "OUT");  // reliable
  feedback(p->name + (p->present ? " IN" : " OUT"), GREEN); // confirm
}

void setup(){ reader.PCD_Init(); rtcInit(); wifiConnect(); }

void loop(){
  if (reader.PICC_IsNewCardPresent() && reader.PICC_ReadCardSerial()){
    onTap(uidString(reader.uid));             // deliberate tap -> one entry
    reader.PICC_HaltA();
  }
  syncCloud();                                // opportunistic sync
}`,
    explain: [
      { ref: 'void logLocal(const String& uid, const String& name,', txt: 'Entries are written locally first, so attendance is never lost to a network problem — reliability comes before sync.' },
      { ref: 'if (!wifiUp()) return;                       // offline: keep local, sync later', txt: 'When offline the system keeps logging locally and syncs later, so a network blip never drops an entry.' },
      { ref: 'if (!p){ feedback("Unknown card", RED); return; }        // reject unknown', txt: 'Unknown cards are rejected with clear feedback; only registered people are recorded.' },
      { ref: 'p->present = !p->present;                                 // in/out', txt: 'Taps toggle presence so the log captures both arrivals and departures.' },
      { ref: 'feedback(p->name + (p->present ? " IN" : " OUT"), GREEN); // confirm', txt: 'Immediate name-and-status feedback tells the person the tap registered, so no one taps repeatedly or leaves unrecorded.' },
    ],
  }],

  config: [
    'Configure the NFC reader, the card-UID→person registry, and the RTC.',
    'Configure debounce timing and in/out logic.',
    'Configure local logging and cloud sync (offline-safe).',
    'Optionally configure a second factor (PIN) against buddy-punching.',
  ],
  calibration: [
    { h: 'Read reliability', p: [
      'Verify consistent reads at the intended tap distance and speed; tune reader placement.',
    ] },
    { h: 'Time accuracy', p: [
      'Set and verify the RTC; confirm timestamps are correct offline.',
    ] },
    { h: 'Logging/sync', p: [
      'Confirm entries log locally and sync correctly, including after an offline period.',
    ] },
  ],
  testing: [
    { step: 'Tap a registered card', expect: 'Logs timestamped IN; name + beep' },
    { step: 'Tap again (out)', expect: 'Logs OUT' },
    { step: 'Hold the card on the reader', expect: 'Single entry (debounced)' },
    { step: 'Tap an unknown card', expect: 'Rejected with feedback' },
    { step: 'Go offline then tap', expect: 'Logged locally; syncs on reconnect' },
    { step: 'Hand your card to a colleague', expect: 'Logs the card — note buddy-punching limit' },
  ],
  output: [
    'Instant, timestamped attendance entries with feedback, logged locally and synced to the cloud for reporting.',
    { file: 'attendance-entry.json', lang: 'json', body: `{
  "uid": "04A2B1C3",
  "name": "R. Sharma",
  "t": "2026-07-28T09:02:14",
  "dir": "IN",
  "synced": true
}` },
    'A one-second tap recorded R. Sharma present at 09:02:14 — accurate, timestamped and synced; no roll-call, no sheet, no tallying.',
  ],
  troubleshoot: [
    { sym: 'Card not reading', cause: 'Range/placement/wiring', fix: 'Adjust tap distance/placement; check reader wiring' },
    { sym: 'Multiple entries per tap', cause: 'No debounce', fix: 'Add a debounce window per card' },
    { sym: 'Wrong/missing times', cause: 'No/incorrect RTC', fix: 'Add and set an RTC; verify offline timestamps' },
    { sym: 'Lost entries', cause: 'Sync-only, no local log', fix: 'Log locally first; sync opportunistically' },
    { sym: 'Buddy-punching', cause: 'Card ≠ person', fix: 'Add a second factor (PIN/photo/biometric)' },
    { sym: 'Card cloning concern', cause: 'Weak NFC handling', fix: 'Use secure cards/handling; protect the log' },
  ],

  iot: {
    protoShort: 'Wi-Fi → attendance cloud store (offline-safe local log)',
    net: {
      nodes: [{ name: 'Reader', sub: 'ESP32+NFC' }, { name: 'Other readers', sub: 'sites/doors' }],
      protocol: 'Wi-Fi', gateway: 'Local AP', gatewaySub: 'to cloud',
      uplink: 'HTTPS/MQTT', cloud: 'Attendance store', cloudSub: 'entries + reports',
      clients: [{ name: 'Admin', sub: 'reports' }, { name: 'HR/teacher', sub: 'attendance' }],
    },
    protocol: ['Readers log taps locally and sync entries to a central store; multiple readers/doors roll up into one attendance record.'],
    topics: [
      { t: 'attendance/entry', dir: 'reader → store', payload: 'uid, name, time, in/out' },
      { t: 'attendance/sync', dir: 'reader → store', payload: 'buffered offline entries' },
    ],
    cloud: ['A central store aggregates entries across readers/sites into attendance reports and audit trails.'],
    dashboard: ['Attendance reports (who/when/in-out), per person and per day, with an audit trail.'],
    mobile: ['Attendance summaries and alerts (e.g. absence) for admins/teachers.'],
    security: [
      'Protect the attendance log — it is personal data.',
      'Handle NFC cards/IDs securely; a card proves the card, not the person.',
      'Add a second factor where buddy-punching matters.',
    ],
  },

  perf: [
    'Read reliably on a deliberate tap; debounce held cards.',
    'Timestamp from an RTC so records are accurate offline.',
    'Log locally first, then sync — never lose an entry.',
    'Give immediate feedback so taps are not repeated or missed.',
  ],
  safety: [
    'A card proves the card was tapped, not who tapped it — add a second factor where buddy-punching matters.',
    'The attendance log is personal data — secure it and limit access.',
    'Handle NFC cards/IDs with basic security; they can be cloned if treated carelessly.',
    'Mount the reader safely and accessibly at the entry point.',
  ],
  maintenance: [
    'Keep the card registry current (joiners/leavers).',
    'Verify RTC time and reader reliability periodically.',
    'Confirm local-log and sync integrity, including after outages.',
    'Review the log/access for privacy and correctness.',
  ],
  future: [
    'Add a second factor (PIN/photo/biometric) against buddy-punching.',
    'Add multi-door/site aggregation and access control.',
    'Add absence/late alerts and timesheet integration.',
    'Support phone NFC/wallet credentials.',
  ],
  faq: [
    { q: 'Why NFC for attendance?', a: 'Because almost everyone already carries a tap-able credential, and reading it takes a fraction of a second with cheap hardware. It replaces slow, fakeable, hand-tallied paper or roll-call with an instant, accurate, automatic tap.' },
    { q: 'What makes it reliable?', a: 'An RTC for accurate timestamps (correct even offline), immediate feedback so people know the tap registered, debouncing so a held card logs once, and local logging before cloud sync so no entry is lost to a network blip.' },
    { q: 'Can people cheat it?', a: 'A card proves the card was tapped, not who tapped it, so buddy-punching (handing your card to a colleague) is mitigated but not eliminated. Where it matters, add a second factor — a PIN, photo prompt, or biometric.' },
    { q: 'What if the network is down?', a: 'Entries are logged locally first and synced when the connection returns, so attendance is never lost. Sync is for aggregation and reporting, not for reliability.' },
    { q: 'Is the data safe?', a: 'The attendance log is personal data and should be secured with access limited appropriately, and NFC cards/IDs should be handled with basic security since they can be cloned if treated carelessly.' },
  ],
  refs: [
    { t: 'Near-field communication (NFC)', u: 'https://en.wikipedia.org/wiki/Near-field_communication', s: 'Reference' },
    { t: 'RFID', u: 'https://en.wikipedia.org/wiki/Radio-frequency_identification', s: 'Reference' },
    { t: 'Time and attendance', u: 'https://en.wikipedia.org/wiki/Time_and_attendance', s: 'Reference' },
    { t: 'Buddy punching', u: 'https://en.wikipedia.org/wiki/Buddy_punching', s: 'Reference' },
    { t: 'MFRC522 / PN532 readers', u: 'https://www.nxp.com/products/rfid-nfc/nfc-hf/nfc-readers/', s: 'NXP' },
  ],
  images: ['esp32', 'retail', 'grafana'],
  imageCaptions: [
    'NFC smart attendance replaces slow, fakeable paper and roll-call with a one-second tap-to-attend.',
    'An NFC reader reads a unique card ID and logs a timestamped, in/out attendance entry automatically.',
    'Entries are logged locally and synced to the cloud for accurate, tamper-resistant attendance reports.',
  ],
},

];
