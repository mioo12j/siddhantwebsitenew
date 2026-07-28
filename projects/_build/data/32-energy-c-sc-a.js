/* Energy 075–076 + Smart City 077. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   075 — Home Solar + Battery Optimizer
   ══════════════════════════════════════════════════════════════════ */
{
  id: '075',
  domainKey: 'iot',
  emoji: '🏠', thumb: 'board',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'Maximises how much of your own solar you actually use — shifting flexible loads into sunny hours and charging the battery smartly — so you buy less grid power and export less for a pittance.',

  overview: [
    'A home solar system with a battery is only as good as your ability to <b>use your own generation</b>. The economics are stark: power you consume yourself is worth the full retail price you would otherwise pay the grid, but power you export is usually bought back by the utility for a fraction of that. So every kilowatt-hour of solar that goes to the grid instead of running your own appliances is money left on the table. This project builds an optimiser that maximises <b>self-consumption</b>: it watches generation, home load and battery state, and orchestrates flexible loads and battery charging so that as much of your solar as possible does useful work in your own home.',
    'It does this by understanding the whole picture in real time — how much the panels are generating, how much the house is drawing, how full the battery is, and what is being imported from or exported to the grid — and then acting on the <b>flexible</b> parts. Deferrable loads (a water heater, EV charging, a pool pump, a dishwasher) are <b>shifted into the sunny hours</b> so they run on surplus solar rather than grid power or evening battery. The battery is charged from midday surplus and discharged in the evening peak rather than dumped to the grid. And where <b>time-of-use tariffs</b> apply, the optimiser factors in when grid power is cheap or expensive, charging and running loads to minimise cost, not just to maximise raw self-consumption.',
    'The result is a home that quietly rearranges its energy use to buy less and export less-for-a-pittance — often improving solar economics substantially — while staying comfortable. It reports generation, consumption, self-consumption fraction and savings so the benefit is visible. It is honest that it controls only <i>flexible</i> loads (it cannot move a load that must run now, and comfort/critical loads always take priority), that it needs correct measurement of generation/load/battery/grid to make good decisions, and that any control of real electrical loads must be done safely and within the inverter/battery system\'s own limits. But as a self-consumption optimiser that shifts flexible loads to solar hours and manages the battery intelligently, it extracts the value a solar-plus-battery system is capable of but rarely delivers on its own.',
  ],
  does: [
    'Measures generation, home load, battery state and grid import/export',
    'Maximises self-consumption of your own solar',
    'Shifts flexible loads (heater, EV, pump) into sunny hours',
    'Charges the battery from surplus and discharges in the evening peak',
    'Optimises for time-of-use tariffs where they apply',
    'Reports self-consumption fraction and savings',
    'Prioritises comfort/critical loads and stays within system limits',
  ],
  features: [
    'Whole-picture real-time energy awareness',
    'Flexible-load shifting to solar surplus',
    'Smart battery charge/discharge scheduling',
    'Time-of-use tariff optimisation',
    'Self-consumption and savings reporting',
    'Comfort/critical-load priority',
    'Safe control within inverter/battery limits',
  ],
  applications: [
    { t: 'Home solar + battery', d: 'Maximising self-consumption to cut grid import and low-value export.' },
    { t: 'Solar + EV', d: 'Charging the EV from surplus solar rather than the grid.' },
    { t: 'Time-of-use tariff homes', d: 'Shifting loads/battery to minimise cost under variable tariffs.' },
    { t: 'Prosumer energy management', d: 'Orchestrating flexible loads around generation and price.' },
  ],
  skills: [
    'Whole-home energy measurement (generation/load/battery/grid)',
    'Self-consumption optimisation and load shifting',
    'Battery charge/discharge scheduling',
    'Time-of-use tariff optimisation',
    'Safe flexible-load control and prioritisation',
  ],
  prereq: [
    'Self-consumption is worth full retail; export is worth a fraction — the whole point is to use your own solar.',
    'You can only shift FLEXIBLE loads; comfort/critical loads take priority and cannot be forced to wait.',
    'Good decisions need correct measurement of generation, load, battery state and grid flow.',
    'Controlling real electrical loads must be done safely and within the inverter/battery system\'s limits.',
  ],

  parts: ['esp32', 'pzem004t', 'acs712', 'relay4', 'oled', 'sdcard', 'psu5v'],
  extraParts: [
    { name: 'Generation + grid + battery metering', spec: 'CTs/meters on PV, grid tie and battery for the full picture', qty: 1, price: 1800, note: 'Correct measurement drives good decisions' },
    { name: 'Flexible-load switching', spec: 'Contactors/relays (or smart plugs) for heater/pump/EV control', qty: 1, price: 900, note: 'Switch loads safely within ratings' },
    { name: 'Inverter/battery interface', spec: 'API/Modbus link to the inverter/BMS for battery control where available', qty: 1, price: 500, note: 'Respect the system\'s own control and limits' },
    { name: 'Tariff schedule / clock', spec: 'Time-of-use tariff data and accurate time', qty: 1, price: 0 },
  ],
  cost: '₹5,000 – ₹9,000',
  libs: ['wifi', 'pubsub', 'modbus', 'ssd1306', 'ntp', 'influx', 'arduinojson'],

  pins: {
    left: [
      { dev: 'PV meter', devPin: 'UART/AOUT', pin: 'GPIO', sig: 'Generation' },
      { dev: 'Grid meter', devPin: 'UART/AOUT', pin: 'GPIO', sig: 'Import/export' },
      { dev: 'Battery/BMS', devPin: 'Modbus', pin: 'RS-485', sig: 'SoC / charge control' },
    ],
    right: [
      { dev: 'Flexible-load relays', devPin: 'IN', pin: 'GPIO 26/25/27/14', sig: 'Heater/EV/pump/etc.' },
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Flows/self-consumption' },
      { dev: 'Wi-Fi', devPin: 'on-chip', pin: '—', sig: 'Dashboard/tariff' },
      { dev: 'RTC', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Tariff timing' },
    ],
  },
  wiringNotes: [
    'Meter generation, grid flow and battery so the optimiser knows surplus/deficit and battery state — the basis of every decision.',
    'Switch flexible loads via correctly-rated relays/contactors (or smart plugs); never exceed ratings, and keep critical loads unswitched.',
    'Interface the inverter/BMS (API/Modbus) for battery charge/discharge control where available, respecting the system\'s own limits.',
    'Give the optimiser accurate time and the tariff schedule for time-of-use optimisation.',
    'Any real-load control must be electrically safe and within the inverter/battery system\'s constraints.',
  ],

  block: { columns: [
    { label: 'Sense', edge: 'right', blocks: [
      { name: 'Generation', sub: 'PV', highlight: true },
      { name: 'Load', sub: 'home' },
      { name: 'Battery', sub: 'SoC' },
      { name: 'Grid', sub: 'import/export' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'surplus/deficit' },
      { name: 'Tariff', sub: 'time-of-use' },
    ] },
    { label: 'Act', edge: 'right', blocks: [
      { name: 'Shift loads', sub: 'to solar' },
      { name: 'Battery', sub: 'charge/discharge' },
    ] },
    { label: 'Report', edge: 'none', blocks: [
      { name: 'Self-consumption', sub: 'savings' },
    ] },
  ] },
  flow: [
    { t: 'Read generation, load, battery, grid', k: 'start' },
    { t: 'Surplus solar?', k: 'dec', yes: 'Run flexible loads / charge battery', no: 'Deficit handling' },
    { t: 'Run flexible loads / charge battery', k: 'io' },
    { t: 'Deficit handling', k: 'proc' },
    { t: 'Evening peak / expensive tariff?', k: 'dec', yes: 'Discharge battery / defer loads', no: 'Hold' },
    { t: 'Discharge battery / defer loads', k: 'io' },
    { t: 'Hold', k: 'proc' },
    { t: 'Report self-consumption/savings', k: 'end', back: 'Read generation, load, battery, grid' },
  ],

  principle: [
    'The economics of home solar make <b>self-consumption</b> the goal, and understanding why is the whole design. A unit of solar you consume yourself offsets a unit you would have bought from the grid at the full <b>retail</b> price; a unit you export is bought back by the utility at a much lower <b>feed-in</b> rate (often a small fraction of retail). So the same kilowatt-hour is worth several times more used at home than exported. A solar system left to its own devices exports its midday surplus for little and then buys expensive grid power in the evening — the optimiser\'s job is to rearrange that so the surplus does useful work in the home instead.',
    'Making good decisions requires <b>whole-picture measurement</b>: generation (how much the panels are making), home load (how much the house is using), battery state of charge (how much storage headroom or reserve exists), and grid flow (import means deficit, export means surplus). From these the optimiser knows, moment to moment, whether there is <b>surplus solar</b> to absorb or a <b>deficit</b> to cover — and that surplus/deficit signal is what it acts on. Without accurate measurement of all four, it would be guessing; with it, it can precisely target zero export (use every spare watt) and minimal import.',
    'It acts through the two <b>flexible</b> resources: deferrable loads and the battery. <b>Load shifting</b> moves discretionary consumption — heating water, charging the EV, running a pool pump or a dishwasher — into the hours of solar surplus, so those loads run on free self-generated power rather than grid power or the evening battery. The <b>battery</b> is scheduled deliberately: charge from midday surplus that would otherwise export cheaply, and discharge in the evening when the house would otherwise import expensively, rather than letting it charge and discharge dumbly. The crucial constraint is that only <i>flexible</i> loads can be moved — comfort and critical loads (lights, fridge, medical equipment) must run when needed and always take priority; the optimiser rearranges the discretionary energy around the fixed, never the other way round.',
    'Where <b>time-of-use tariffs</b> apply, the objective sharpens from "maximise self-consumption" to "minimise cost", and the two can differ: if grid power is very cheap at night, it may be worth importing to charge the battery for an expensive evening peak, or running a flexible load then, even though it is not solar. So the optimiser folds the tariff schedule into its decisions — charging the battery and scheduling loads for the cheapest effective energy across solar surplus and tariff windows. Throughout, the design is honest about its scope and safety: it controls only flexible loads and prioritises comfort/critical ones; its decisions are only as good as its measurements; and any control of real electrical loads and of the battery must be electrically safe and stay within the inverter/battery system\'s own limits and control (it complements, not overrides, the BMS/inverter). Within that frame, it delivers what a solar-plus-battery home is capable of but rarely achieves alone — turning as much of your own generation as possible into value in your own home, and quietly cutting the bill.',
  ],
  equations: [
    { t: 'Self-consumption value', eq: 'Value of using vs exporting a unit of solar:\n\n  save_self = retail_price   (avoided import)\n  earn_export = feed_in_rate (<< retail)\n\nUsing your own solar is worth (retail − feed_in) more per\nkWh than exporting → maximise self-consumption.' },
    { t: 'Surplus/deficit decision', eq: 'surplus = generation − load        (W)\n\n  surplus > 0 → run flexible loads / charge battery\n                (target ~zero export)\n  surplus < 0 → discharge battery / defer flexible loads\n                (minimise import)\nAlways serve critical loads first.' },
    { t: 'Tariff-aware cost minimisation', eq: 'Choose actions to minimise cost, not just maximise self-use:\n\n  cost = Σ (import·price(t) − export·feed_in(t))\n\nUnder time-of-use, it can pay to charge the battery from\ncheap off-peak grid for an expensive peak — optimise the\nschedule across solar + tariff windows.' },
  ],

  assembly: [
    { h: 'Set up whole-picture metering', p: [
      'Meter generation, grid flow and battery state so the optimiser knows surplus/deficit and SoC. Interface the inverter/BMS for battery control where available.',
    ], warn: 'Decisions are only as good as the measurements. Meter generation, load, battery and grid correctly, and respect the inverter/battery system\'s own control and limits.' },
    { h: 'Set up flexible-load control', p: [
      'Switch flexible loads via correctly-rated relays/contactors or smart plugs, leaving critical/comfort loads unswitched and prioritised.',
    ] },
    { h: 'Set up tariff and reporting', p: [
      'Provide the time-of-use tariff schedule and accurate time, and report self-consumption and savings.',
    ] },
  ],
  steps: [
    { h: 'Decide from surplus/deficit and tariff', p: [
      'Compute surplus (generation − load), run flexible loads / charge the battery on surplus, discharge / defer on deficit, and fold in the tariff — always serving critical loads first.',
    ], code: {
      file: 'optimiser.ino', lang: 'cpp',
      body: `struct State { float gen, load, soc, gridW; };  // gridW>0 import

// Decide flexible-load and battery actions to maximise self-consumption.
void optimise(const State &s, float price, float feedIn){
  float surplus = s.gen - s.load;                 // >0 = spare solar

  if (surplus > FLEX_LOAD_W && s.soc > 0.5f){
    runFlexibleLoad(true);                         // soak surplus into a load
  } else if (surplus > 0 && s.soc < 0.95f){
    setBatteryCharge(surplus);                     // else store the surplus
  } else if (surplus < 0){                         // deficit
    if (isPeak(price) && s.soc > SOC_RESERVE)
      setBatteryDischarge(-surplus);               // cover peak from battery
    else
      deferFlexibleLoads();                        // avoid expensive import
  }

  // tariff opportunity: cheap grid to charge for an expensive peak
  if (isCheapOffPeak(price) && s.soc < SOC_TARGET && willPeakBeExpensive())
    setBatteryChargeFromGrid();

  runCriticalLoadsAlways();                         // comfort/critical priority
}`,
      explain: [
        { ref: 'float surplus = s.gen - s.load', txt: 'The core signal is surplus solar — generation minus load — which the optimiser acts on to absorb spare generation or cover a deficit.' },
        { ref: 'runFlexibleLoad(true);                         // soak surplus into a load', txt: 'Spare solar is directed into a flexible load so it does useful work at home rather than exporting for a pittance.' },
        { ref: 'setBatteryDischarge(-surplus);               // cover peak from battery', txt: 'In an expensive peak with charge to spare, the battery covers the deficit instead of importing costly grid power.' },
        { ref: 'if (isCheapOffPeak(price) && ... willPeakBeExpensive())', txt: 'Under time-of-use tariffs it can pay to charge from cheap off-peak grid for an expensive peak — cost minimisation, not just raw self-consumption.' },
        { ref: 'runCriticalLoadsAlways();                         // comfort/critical priority', txt: 'Critical and comfort loads always run; the optimiser only ever rearranges the flexible, discretionary energy around them.' },
      ],
    } },
    { h: 'Act safely, report and verify', p: [
      'Switch flexible loads and command battery charge/discharge within the system\'s limits, report generation/load/battery/grid, self-consumption fraction and savings, and verify the benefit.',
    ], tip: 'Target near-zero export during the day (use every spare watt) and near-zero peak import in the evening (cover it from stored solar) — that is the self-consumption sweet spot.' },
  ],

  code: [{
    file: 'solar-battery-optimizer.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Home Solar + Battery Optimizer — ESP32

   Maximises self-consumption: measures generation/load/battery/grid,
   shifts flexible loads into solar surplus, schedules the battery, and
   optimises for time-of-use tariffs. Critical loads always priority;
   control stays within the inverter/battery system's limits.
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>

#define FLEX_LOAD_W 1500.0f   // e.g. water heater
#define SOC_RESERVE 0.20f
#define SOC_TARGET  0.90f
#define PIN_FLEX 26

PZEM004Tv30 pvMeter(Serial2, 16, 17);   // + grid/battery meters
WiFiClient net; PubSubClient mqtt(net);
double selfUsedWh=0, importWh=0, exportWh=0; uint32_t lastMs=0;

void runFlexibleLoad(bool on){ digitalWrite(PIN_FLEX, on?HIGH:LOW); }
void setBatteryCharge(float w){ /* command inverter/BMS within limits */ }
void setBatteryDischarge(float w){ /* command inverter/BMS within limits */ }

void setup(){
  Serial.begin(115200);
  pinMode(PIN_FLEX, OUTPUT);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  lastMs=millis();
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("opt-1");
  mqtt.loop();
  uint32_t now=millis(); float dtHr=(now-lastMs)/3600000.0f; lastMs=now;

  float gen  = readGeneration();     // W
  float load = readHomeLoad();       // W
  float soc  = readBatterySoC();     // 0..1
  float grid = readGridFlow();       // W, >0 import
  float price = currentTariffPrice();

  float surplus = gen - load;

  if (surplus > FLEX_LOAD_W && soc > 0.5f){
    runFlexibleLoad(true);                       // use spare solar in a load
  } else if (surplus > 0 && soc < SOC_TARGET){
    runFlexibleLoad(false);
    setBatteryCharge(surplus);                    // store surplus
  } else if (surplus < 0){                        // deficit
    runFlexibleLoad(false);
    if (isPeak(price) && soc > SOC_RESERVE) setBatteryDischarge(-surplus);
    else deferFlexibleLoads();
  }
  if (isCheapOffPeak(price) && soc < SOC_TARGET && willPeakBeExpensive())
    setBatteryCharge(FLEX_LOAD_W);                // pre-charge from cheap grid

  // accounting for self-consumption/savings
  float used = fminf(gen, load);
  selfUsedWh += used*dtHr;
  if (grid > 0) importWh += grid*dtHr; else exportWh += -grid*dtHr;
  float selfFrac = gen>1 ? used/gen : 0;

  char m[240];
  snprintf(m,sizeof m,
    "{\\"gen\\":%.0f,\\"load\\":%.0f,\\"soc\\":%.2f,\\"grid\\":%.0f,"
    "\\"self_frac\\":%.2f,\\"import_kWh\\":%.2f,\\"export_kWh\\":%.2f}",
    gen, load, soc, grid, selfFrac, importWh/1000, exportWh/1000);
  mqtt.publish("energy/opt/status", m);

  delay(5000);
}`,
    explain: [
      { ref: 'float surplus = gen - load', txt: 'Surplus solar is computed from real generation and load — the signal the optimiser acts on to absorb spare generation.' },
      { ref: 'runFlexibleLoad(true);                       // use spare solar in a load', txt: 'Spare solar is soaked into a flexible load so it offsets a full-retail import instead of exporting cheaply.' },
      { ref: 'if (isPeak(price) && soc > SOC_RESERVE) setBatteryDischarge(-surplus)', txt: 'An evening deficit at peak price is covered from the battery (above a reserve) rather than importing expensive grid power.' },
      { ref: 'if (isCheapOffPeak(price) && ... willPeakBeExpensive())', txt: 'Time-of-use logic pre-charges from cheap off-peak grid for an expensive peak — minimising cost, not just maximising self-consumption.' },
      { ref: 'float selfFrac = gen>1 ? used/gen : 0', txt: 'The self-consumption fraction and import/export tallies quantify and prove the optimiser\'s benefit.' },
    ],
  }],

  config: [
    'Configure generation/load/battery/grid metering and the inverter/BMS control interface and limits.',
    'Define flexible loads and their ratings, and the critical/comfort loads to prioritise.',
    'Set the time-of-use tariff schedule, SoC reserve/target and battery scheduling policy.',
    'Configure reporting of self-consumption and savings.',
  ],
  calibration: [
    { h: 'Metering', p: [
      'Verify generation, load, battery SoC and grid flow against references so surplus/deficit is accurate.',
    ] },
    { h: 'Load shifting', p: [
      'Confirm flexible loads run on surplus and defer on deficit without disturbing critical loads.',
    ] },
    { h: 'Tariff/battery', p: [
      'Validate battery charge/discharge scheduling against the tariff and within system limits.',
    ] },
  ],
  testing: [
    { step: 'Midday surplus', expect: 'Flexible loads run / battery charges; export near zero' },
    { step: 'Evening deficit (peak)', expect: 'Battery discharges to cover load; import minimised' },
    { step: 'Cloudy period', expect: 'Flexible loads defer; critical loads unaffected' },
    { step: 'Cheap off-peak with expensive peak ahead', expect: 'Battery pre-charges from cheap grid' },
    { step: 'Critical load demand', expect: 'Always served; optimiser rearranges only flexible loads' },
    { step: 'Over a day', expect: 'Higher self-consumption fraction and lower cost quantified' },
  ],
  output: [
    'The dashboard shows live power flows (PV/load/battery/grid), self-consumption fraction, and import/export/savings, with the flexible-load and battery actions.',
    { file: 'energy-opt.json', lang: 'json', body: `{
  "gen": 3200,
  "load": 1400,
  "soc": 0.62,
  "grid": -100,
  "self_frac": 0.94,
  "export_kWh": 2.1
}` },
    'With 3.2 kW generating and 1.4 kW of load, the optimiser has soaked the surplus into a flexible load and the battery so export is near zero and 94% of generation is self-consumed — the value a solar-plus-battery home is capable of.',
  ],
  troubleshoot: [
    { sym: 'Lots of low-value export', cause: 'Surplus not soaked into loads/battery', fix: 'Shift flexible loads and charge the battery on surplus; target near-zero export' },
    { sym: 'Expensive evening import', cause: 'Battery not scheduled for peak', fix: 'Discharge the battery in the evening peak; pre-charge if cheaper off-peak' },
    { sym: 'Critical loads disturbed', cause: 'Switching non-flexible loads', fix: 'Only control flexible loads; always prioritise critical/comfort' },
    { sym: 'Bad decisions', cause: 'Inaccurate metering', fix: 'Calibrate generation/load/battery/grid measurement' },
    { sym: 'Battery/inverter conflict', cause: 'Exceeding system limits', fix: 'Command within the inverter/BMS limits; respect its own control' },
  ],

  iot: {
    protoShort: 'Wi-Fi + MQTT → home energy dashboard',
    net: {
      nodes: [{ name: 'Optimiser', sub: 'ESP32' }, { name: 'Inverter/BMS', sub: 'interface' }],
      protocol: 'Wi-Fi/Modbus', gateway: 'Router', gatewaySub: 'to inverter/BMS',
      uplink: 'MQTT 1883', cloud: 'Energy dashboard', cloudSub: 'flows + savings',
      clients: [{ name: 'Dashboard', sub: 'self-consumption' }, { name: 'Phone', sub: 'summaries' }],
    },
    protocol: ['Power flows, SoC, self-consumption and savings publish continuously; the optimiser controls flexible loads and battery locally within system limits.'],
    topics: [
      { t: 'energy/opt/status', dir: 'node → dashboard', payload: 'gen, load, SoC, grid, self-consumption' },
      { t: 'energy/opt/action', dir: 'node → dashboard', payload: 'load-shift / battery actions' },
      { t: 'energy/opt/config', dir: 'app → node', payload: 'tariff, SoC targets, flexible loads' },
    ],
    cloud: ['A dashboard shows live flows and self-consumption, quantifies savings, and lets the owner set tariff/SoC/flexible-load policy.'],
    dashboard: ['Live PV/load/battery/grid flows, self-consumption fraction, import/export/savings, and action log.'],
    mobile: ['Daily self-consumption/savings summaries and any action notifications.'],
    security: [
      'Keep battery/load control local and within the inverter/BMS limits.',
      'Authenticate config; secure energy data.',
      'Never override critical-load priority.',
    ],
  },

  perf: [
    'Decide on a few-second cadence; flows change but not instantaneously.',
    'Meter all four (gen/load/battery/grid) accurately for good decisions.',
    'Command the battery/loads within system limits; complement the inverter/BMS.',
    'Report self-consumption/savings to prove and tune the benefit.',
  ],
  safety: [
    'Only control flexible loads; comfort/critical loads take priority and must not be forced to wait.',
    'Any control of real electrical loads and the battery must be safe and within the inverter/battery system\'s own limits and control.',
    'Decisions depend on correct measurement — calibrate metering.',
    'Complement, do not override, the inverter/BMS protection.',
  ],
  maintenance: [
    'Verify metering calibration and control interfaces periodically.',
    'Update tariff schedules and flexible-load definitions as they change.',
    'Review self-consumption/savings and tune policy.',
    'Confirm battery scheduling stays within limits as the pack ages.',
  ],
  future: [
    'Add solar/load forecasting to schedule proactively.',
    'Add EV smart-charging integration (charge from surplus).',
    'Add grid-service/VPP participation where available.',
    'Add appliance-level control for finer load shifting.',
  ],
  faq: [
    { q: 'Why maximise self-consumption?', a: 'Because a unit of solar you use yourself offsets a full-retail import, while a unit you export is bought back for a fraction of that. Using your own solar is worth several times more than exporting it.' },
    { q: 'What loads can it actually move?', a: 'Only flexible, deferrable ones — a water heater, EV charging, a pool pump, a dishwasher. Comfort and critical loads always take priority and run when needed; the optimiser rearranges the discretionary energy around them.' },
    { q: 'How does the battery help?', a: 'By storing midday surplus that would otherwise export cheaply and discharging it in the evening peak instead of importing expensively — scheduled deliberately rather than charging and discharging dumbly.' },
    { q: 'What about time-of-use tariffs?', a: 'The optimiser folds them in, minimising cost rather than just maximising raw self-consumption — for example pre-charging the battery from cheap off-peak grid for an expensive evening peak.' },
    { q: 'Is it safe to control my loads and battery?', a: 'It only switches flexible loads within their ratings and commands the battery within the inverter/BMS limits — complementing, not overriding, the system\'s own protection. Correct measurement and safe control are prerequisites.' },
  ],
  refs: [
    { t: 'Solar self-consumption', u: 'https://en.wikipedia.org/wiki/Self-consumption_of_photovoltaic_power', s: 'Reference' },
    { t: 'Feed-in tariff vs retail', u: 'https://en.wikipedia.org/wiki/Feed-in_tariff', s: 'Reference' },
    { t: 'Home battery storage and load shifting', u: 'https://en.wikipedia.org/wiki/Grid_energy_storage', s: 'Reference' },
    { t: 'Time-of-use tariffs / demand response', u: 'https://en.wikipedia.org/wiki/Demand_response', s: 'Reference' },
    { t: 'Home energy management systems', u: 'https://en.wikipedia.org/wiki/Home_energy_management_system', s: 'Reference' },
  ],
  images: ['solar', 'battery', 'grafana'],
  imageCaptions: [
    'A solar-plus-battery home is worth far more when you use your own generation instead of exporting it cheaply.',
    'ESP32 module measuring all four flows and shifting flexible loads into solar surplus.',
    'A dashboard shows the self-consumption fraction and the savings the optimiser delivers.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   076 — Generator Run-Hour Monitor
   ══════════════════════════════════════════════════════════════════ */
{
  id: '076',
  domainKey: 'iot',
  emoji: '⛽', thumb: 'sensor',
  difficulty: 'Beginner',
  hours: '8–14 hours', iso8601: 'PT12H',
  tagline: 'Logs exactly how long a diesel genset actually runs and how much fuel it burns — so servicing is scheduled on real run-hours, not guesses, and fuel is accounted for.',

  overview: [
    'A diesel generator\'s maintenance — oil changes, filter replacements, major services — is scheduled by <b>run-hours</b>, not calendar time, because an engine that ran 400 hours last month needs service far sooner than one that ran 40. Yet run-hours are usually tracked by a scribbled logbook or guessed, which means service is either done too early (wasting money) or too late (risking a costly failure), and fuel consumption — often a genset\'s biggest running cost and a common target of theft — is barely accounted for at all. This project automatically logs exactly when the genset runs and for how long, estimates its fuel burn, and turns that into accurate maintenance scheduling and fuel accountability.',
    'The core is reliable <b>run detection</b>: the monitor senses when the generator is actually running — from its output voltage/current, its vibration, or an oil-pressure/alternator signal — and accumulates precise run-hours, logging each run\'s start, end and duration. From accumulated run-hours it drives <b>maintenance</b>: it tracks hours since the last oil change and service and alerts when each is due, so servicing happens at the right interval based on real use. And it estimates <b>fuel burn</b> — a genset consumes fuel roughly in proportion to its load and run-time, so run-hours (better still, run-hours weighted by load) give a fuel-consumption estimate that, checked against tank telemetry or deliveries, reveals efficiency and flags discrepancies that can mean theft.',
    'The result is a genset that is serviced on evidence, its fuel accounted for, and its usage visible — logged and reported so an operator or fleet manager can plan maintenance, budget fuel, and spot an over-running or fuel-losing unit. It is honest that fuel burn is an <i>estimate</i> unless a real flow meter or tank gauge is added (run-hours alone do not measure fuel precisely, especially across varying loads), and that run detection must be robust to avoid missing or double-counting runs. But as a run-hour and fuel monitor, it replaces guesswork and logbooks with accurate, automatic records — the foundation of both proper genset maintenance and honest fuel accounting.',
  ],
  does: [
    'Detects when the generator is actually running (voltage/current/vibration)',
    'Accumulates precise run-hours and logs each run (start/end/duration)',
    'Tracks hours since last oil change/service and alerts when due',
    'Estimates fuel burn from run-hours (better with load weighting)',
    'Reconciles estimated fuel against tank telemetry/deliveries (theft/efficiency)',
    'Logs and reports usage for maintenance and fuel planning',
    'Replaces logbooks/guesses with automatic, accurate records',
  ],
  features: [
    'Reliable run detection and precise run-hours',
    'Run-hour-based maintenance scheduling/alerts',
    'Fuel-burn estimation (load-weighted)',
    'Fuel reconciliation (theft/efficiency)',
    'Per-run logging',
    'Fleet/usage reporting',
    'Honest: fuel is estimated without a flow meter/gauge',
  ],
  applications: [
    { t: 'Backup / prime gensets', d: 'Accurate run-hour-based maintenance and fuel accounting for standby or prime power.' },
    { t: 'Telecom / tower sites', d: 'Remote genset run-hours and fuel monitoring across many sites.' },
    { t: 'Rental generator fleets', d: 'Usage-based billing/maintenance and fuel accountability.' },
    { t: 'Construction / events', d: 'Tracking genset usage and fuel across temporary sites.' },
  ],
  skills: [
    'Robust run detection (voltage/current/vibration)',
    'Run-hour accumulation and per-run logging',
    'Maintenance-interval tracking and alerting',
    'Fuel-burn estimation and reconciliation',
    'Usage reporting',
  ],
  prereq: [
    'Genset maintenance is scheduled by run-hours, not calendar — accurate run-hours are the whole point.',
    'Run detection must be robust: do not miss short runs or double-count; pick a reliable running signal.',
    'Fuel burn from run-hours is an ESTIMATE unless a flow meter/tank gauge is added, especially across varying loads.',
    'Reconciling estimated fuel against tank/deliveries reveals efficiency and possible theft.',
  ],

  parts: ['esp32', 'zmpt101b', 'acs712', 'vibration', 'ds18b20', 'oled', 'lora', 'sdcard'],
  extraParts: [
    { name: 'Run-detect sensing', spec: 'AC voltage/current sense, or vibration/alternator/oil-pressure signal', qty: 1, price: 400, note: 'Pick a reliable "running" signal' },
    { name: 'Fuel measurement (optional)', spec: 'Tank level/flow meter for measured (not estimated) fuel', qty: 1, price: 1200, note: 'For true fuel accounting; else estimate from run-hours' },
    { name: 'RTC + storage', spec: 'Accurate time and local logging of runs', qty: 1, price: 250 },
    { name: 'Enclosure + LoRa', spec: 'Rugged housing and LoRa for remote sites', qty: 1, price: 700 },
  ],
  cost: '₹2,500 – ₹4,500',
  libs: ['wifi', 'pubsub', 'ssd1306', 'lorolib', 'ntp', 'preferences', 'sqlite'],

  pins: {
    left: [
      { dev: 'AC voltage/current', devPin: 'AOUT', pin: 'GPIO 34/35', sig: 'Running detection + load' },
      { dev: 'Vibration', devPin: 'DOUT', pin: 'GPIO 27', sig: 'Running (alt signal)' },
      { dev: 'Fuel sensor (opt)', devPin: 'AOUT/PULSE', pin: 'GPIO 32', sig: 'Tank level / flow' },
    ],
    right: [
      { dev: 'OLED', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Run-hours / service due' },
      { dev: 'LoRa', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Remote reporting' },
      { dev: 'RTC + SD', devPin: 'I²C/SPI', pin: '—', sig: 'Timestamped run log' },
      { dev: 'Supply', devPin: '+/–', pin: '3V3 reg', sig: 'Power' },
    ],
  },
  wiringNotes: [
    'Sense a reliable "running" signal — genset output voltage/current is unambiguous; vibration or an alternator/oil-pressure signal are alternatives.',
    'Sense load (current) too, so fuel burn can be load-weighted rather than a flat per-hour figure.',
    'Add a fuel level/flow sensor for measured fuel accounting; otherwise estimate from run-hours and reconcile against deliveries.',
    'Give the monitor accurate time and local logging so each run is timestamped and nothing is lost.',
    'Use LoRa for remote/multi-site reporting.',
  ],

  block: { columns: [
    { label: 'Detect', edge: 'right', blocks: [
      { name: 'Running?', sub: 'V/I/vibration', highlight: true },
      { name: 'Load', sub: 'for fuel weighting' },
      { name: 'Fuel (opt)', sub: 'level/flow' },
    ] },
    { label: 'Accumulate', edge: 'right', blocks: [
      { name: 'ESP32', sub: 'run-hours' },
      { name: 'Service', sub: 'since last' },
    ] },
    { label: 'Estimate', edge: 'right', blocks: [
      { name: 'Fuel burn', sub: 'load-weighted' },
      { name: 'Reconcile', sub: 'vs deliveries' },
    ] },
    { label: 'Report', edge: 'none', blocks: [
      { name: 'Maintenance', sub: 'due alerts' },
      { name: 'Usage/fuel', sub: 'log' },
    ] },
  ] },
  flow: [
    { t: 'Sense running signal', k: 'start' },
    { t: 'Running?', k: 'dec', yes: 'Accumulate run-hours + load', no: 'Idle (log run end)' },
    { t: 'Accumulate run-hours + load', k: 'proc' },
    { t: 'Idle (log run end)', k: 'io' },
    { t: 'Service interval reached?', k: 'dec', yes: 'Maintenance-due alert', no: 'Estimate fuel; reconcile' },
    { t: 'Maintenance-due alert', k: 'io' },
    { t: 'Estimate fuel; reconcile', k: 'proc' },
    { t: 'Report; repeat', k: 'end', back: 'Sense running signal' },
  ],

  principle: [
    'The monitor exists because a diesel engine wears by <b>use, not by time</b>, so its maintenance must be driven by <b>run-hours</b> — and accurate run-hours are exactly what manual logbooks and guesses fail to provide. An engine that has run 400 hours is due for an oil change whether that took a week or three months; one that has barely run does not need service yet however long it has sat. Servicing on real run-hours means neither wasting money on premature service nor risking an expensive failure from a missed one. Everything the monitor does flows from measuring run-hours accurately and automatically.',
    'Accurate run-hours depend on <b>robust run detection</b>: reliably knowing when the genset is actually running. The cleanest signal is the generator\'s own <b>output</b> — if it is producing voltage/current, it is running — but vibration, or an alternator/oil-pressure signal, can serve where output sensing is impractical. The detection must be robust in two directions: it must not <b>miss</b> short runs (a genset that starts, runs five minutes, and stops still accrued five minutes of wear), and it must not <b>double-count</b> or falsely trigger (chatter around the start/stop must be debounced). Each run is logged with its start, end and duration, and the durations accumulate into the total and the since-service counters.',
    'From accumulated run-hours the monitor drives <b>maintenance scheduling</b> directly: it tracks hours since the last oil change and since the last major service against their intervals, and alerts when each is due. This is the primary payoff — service happens at the right point based on real use, planned rather than reactive, which both extends engine life and avoids the cost and downtime of failures. For a fleet, this scales to knowing which units are due when, so maintenance can be batched and planned.',
    'The second payoff is <b>fuel accountability</b>, and here the design is careful about what it can and cannot claim. A diesel engine burns fuel roughly in proportion to its <b>load and run-time</b>, so run-hours — better still, run-hours <b>weighted by load</b> (measured from output current) — give a reasonable <b>estimate</b> of fuel consumption. That estimate is genuinely useful for budgeting and, crucially, for <b>reconciliation</b>: comparing estimated burn against actual fuel used (from tank telemetry or delivery records) reveals the genset\'s efficiency and, when the tank drops faster than the run-hours can explain, flags a leak or <b>theft</b> — fuel theft from remote gensets being a real and costly problem. The honesty is explicit: run-hours alone do not <i>measure</i> fuel precisely, especially across varying loads, so for true fuel accounting a flow meter or tank gauge is added, and the estimate is presented as such. But as a monitor that turns automatic, accurate run-hours into evidence-based maintenance scheduling and fuel accountability — replacing the logbook and the guess — it delivers exactly what keeps a genset reliably serviced and its fuel honestly accounted for.',
  ],
  equations: [
    { t: 'Run-hours and service due', eq: 'Accumulate while running:\n  run_hours += Δt   (while the running signal is true)\n\n  hours_since_oil   = run_hours − oil_change_mark\n  hours_since_service = run_hours − service_mark\n\n  alert oil/service when the interval is reached.' },
    { t: 'Load-weighted fuel estimate', eq: 'Diesel burn ≈ f(load) per hour:\n\n  fuel ≈ Σ ( a + b·load_fraction ) · Δt_run\n\n(a = idle/no-load rate, b·load = load-dependent rate).\nRun-hours alone (flat rate) is a rougher estimate; load\nweighting improves it. Exact fuel needs a flow meter/gauge.' },
    { t: 'Fuel reconciliation (theft/efficiency)', eq: 'Compare estimated burn to actual fuel used:\n\n  actual = tank_drop (telemetry) or deliveries − remaining\n  discrepancy = actual − estimated\n\n  large unexplained drop (actual >> estimated) → leak/theft\n  helps track real efficiency (L/kWh or L/hour).' },
  ],

  assembly: [
    { h: 'Set up robust run detection and load sensing', p: [
      'Sense a reliable running signal (genset output voltage/current preferred) with debouncing so short runs are caught and chatter is not double-counted, and sense load for fuel weighting.',
    ], warn: 'Robust run detection is essential — missing runs under-counts wear and over-running (false detection) mis-schedules service. Choose an unambiguous running signal and debounce it.' },
    { h: 'Add fuel measurement or estimation', p: [
      'Add a fuel level/flow sensor for measured fuel, or estimate from load-weighted run-hours; set up reconciliation against tank telemetry/deliveries.',
    ] },
    { h: 'Set up maintenance tracking and reporting', p: [
      'Track hours since oil change/service against intervals with alerts, log each run with timestamps, and report over LoRa/dashboard.',
    ] },
  ],
  steps: [
    { h: 'Accumulate run-hours and schedule maintenance', p: [
      'Detect running (debounced), accumulate run-hours and per-run logs, track since-service counters, and alert when oil/service is due.',
    ], code: {
      file: 'runhours.ino', lang: 'cpp',
      body: `#define OIL_INTERVAL_H  250.0f
#define SVC_INTERVAL_H  500.0f
#define DEBOUNCE_MS 3000

float runHours=0, oilMark=0, svcMark=0;
bool running=false; uint32_t runStart=0, stableSince=0;

// Debounced run detection accumulates run-hours and logs runs.
void updateRun(bool sensedRunning, uint32_t now, float dtHr){
  if (sensedRunning != running){
    if (!stableSince) stableSince = now;
    else if (now - stableSince > DEBOUNCE_MS){       // stable transition
      running = sensedRunning; stableSince = 0;
      if (running) runStart = now;
      else logRun(runStart, now);                     // record the run
    }
  } else stableSince = 0;

  if (running) runHours += dtHr;                       // accumulate while on
}

const char* maintenanceDue(){
  if (runHours - oilMark >= OIL_INTERVAL_H) return "oil change due";
  if (runHours - svcMark >= SVC_INTERVAL_H) return "service due";
  return nullptr;
}`,
      explain: [
        { ref: 'else if (now - stableSince > DEBOUNCE_MS){       // stable transition', txt: 'Run start/stop is debounced so brief chatter does not fragment or double-count runs, while genuine short runs are still captured.' },
        { ref: 'if (running) runHours += dtHr;                       // accumulate while on', txt: 'Run-hours accumulate only while the genset is actually running — the accurate, use-based figure maintenance depends on.' },
        { ref: 'else logRun(runStart, now);                     // record the run', txt: 'Each run is logged with its start and end, giving a per-run history alongside the total.' },
        { ref: 'if (runHours - oilMark >= OIL_INTERVAL_H) return "oil change due"', txt: 'Maintenance is scheduled by hours since the last service against the interval — evidence-based, not calendar-based.' },
      ],
    } },
    { h: 'Estimate fuel, reconcile and report', p: [
      'Estimate fuel from load-weighted run-hours (or read a fuel sensor), reconcile against tank/deliveries to flag theft/efficiency, and report usage and maintenance-due alerts.',
    ], tip: 'When measured tank drop exceeds what run-hours can explain, flag a possible leak or theft — remote genset fuel theft is common and costly.' },
  ],

  code: [{
    file: 'generator-runhour-monitor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Generator Run-Hour Monitor — ESP32

   Detects genset running (debounced), accumulates precise run-hours and
   per-run logs, schedules maintenance by run-hours, estimates fuel burn
   (load-weighted) and reconciles against fuel data (theft/efficiency).
   ══════════════════════════════════════════════════════════════════ */

#include <WiFi.h>
#include <PubSubClient.h>
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>

#define PIN_VOLT  34      // genset output voltage sense (running)
#define PIN_CURR  35      // output current (load)
#define OIL_INTERVAL_H 250.0f
#define SVC_INTERVAL_H 500.0f
#define DEBOUNCE_MS 3000
#define FUEL_NOLOAD_LPH 1.5f
#define FUEL_FULLLOAD_LPH 8.0f

Preferences prefs; WiFiClient net; PubSubClient mqtt(net);
float runHours=0, oilMark=0, svcMark=0, fuelL=0;
bool running=false; uint32_t runStart=0, stableSince=0, lastMs=0;

bool sensedRunning(){ return analogRead(PIN_VOLT) > RUN_THRESH; }
float loadFraction(){ return analogRead(PIN_CURR)/4095.0f; }   // 0..1

void setup(){
  Serial.begin(115200);
  prefs.begin("gen",true);
  runHours=prefs.getFloat("rh",0); oilMark=prefs.getFloat("oil",0);
  svcMark=prefs.getFloat("svc",0); fuelL=prefs.getFloat("fuel",0);
  prefs.end();
  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6);
  WiFi.begin(WIFI_SSID,WIFI_PASS); mqtt.setServer(MQTT_HOST,1883);
  lastMs=millis();
}

void loop(){
  if(!mqtt.connected()&&WiFi.status()==WL_CONNECTED) mqtt.connect("gen-1");
  mqtt.loop();
  uint32_t now=millis(); float dtHr=(now-lastMs)/3600000.0f; lastMs=now;

  bool r = sensedRunning();
  if (r != running){
    if (!stableSince) stableSince=now;
    else if (now-stableSince>DEBOUNCE_MS){
      running=r; stableSince=0;
      if (running) runStart=now;
      else { logRun(runStart, now); }                 // record the run
    }
  } else stableSince=0;

  if (running){
    runHours += dtHr;
    float lf = loadFraction();
    float lph = FUEL_NOLOAD_LPH + (FUEL_FULLLOAD_LPH-FUEL_NOLOAD_LPH)*lf;
    fuelL += lph * dtHr;                               // load-weighted estimate
  }

  const char *maint = nullptr;
  if (runHours-oilMark >= OIL_INTERVAL_H) maint="oil change due";
  else if (runHours-svcMark >= SVC_INTERVAL_H) maint="service due";

  // persist and report periodically
  static uint32_t last=0;
  if (now-last>60000){ last=now;
    prefs.begin("gen",false);
    prefs.putFloat("rh",runHours); prefs.putFloat("fuel",fuelL); prefs.end();
    char m[220];
    snprintf(m,sizeof m,
      "{\\"run_h\\":%.1f,\\"since_oil\\":%.1f,\\"fuel_L\\":%.1f,"
      "\\"running\\":%s,\\"maint\\":\\"%s\\"}",
      runHours, runHours-oilMark, fuelL, running?"true":"false",
      maint?maint:"none");
    LoRa.beginPacket(); LoRa.print(m); LoRa.endPacket();
    mqtt.publish("genset/1/status", m);
    if (maint) mqtt.publish("genset/1/maint", maint);
  }
  delay(1000);
}`,
    explain: [
      { ref: 'bool r = sensedRunning();', txt: 'The running state is sensed from the genset\'s output and debounced over several seconds, so runs are counted accurately without chatter.' },
      { ref: 'if (running){\n    runHours += dtHr;', txt: 'Run-hours accumulate only while running — the use-based figure that maintenance scheduling and fuel estimation both need.' },
      { ref: 'float lph = FUEL_NOLOAD_LPH + (FUEL_FULLLOAD_LPH-FUEL_NOLOAD_LPH)*lf', txt: 'Fuel burn is estimated as a load-weighted rate — better than a flat per-hour figure since a loaded genset burns more.' },
      { ref: 'if (runHours-oilMark >= OIL_INTERVAL_H) maint="oil change due"', txt: 'Maintenance is due by hours since the last service — evidence-based scheduling that replaces the logbook guess.' },
      { ref: 'prefs.putFloat("rh",runHours)', txt: 'Run-hours and fuel are persisted so a power blip or reset never loses the genset\'s accumulated history.' },
    ],
  }],

  config: [
    'Configure the running signal and threshold (with debounce) and the load sensing.',
    'Set the oil/service intervals and the maintenance-mark reset on service.',
    'Set fuel-rate parameters (or a fuel sensor) and reconciliation against tank/deliveries.',
    'Configure logging and LoRa/dashboard reporting.',
  ],
  calibration: [
    { h: 'Run detection', p: [
      'Confirm the running signal and threshold reliably detect running (including short runs) and do not chatter; tune debounce.',
    ] },
    { h: 'Fuel estimate', p: [
      'Calibrate the no-load and full-load fuel rates against real consumption; add a fuel sensor for measured fuel.',
    ] },
    { h: 'Intervals', p: [
      'Set oil/service intervals per the engine manufacturer and confirm alerts fire at the right hours.',
    ] },
  ],
  testing: [
    { step: 'Start and stop the genset', expect: 'Run detected/logged with correct duration; short runs caught' },
    { step: 'Run under load', expect: 'Load-weighted fuel estimate higher than at no load' },
    { step: 'Reach an oil interval', expect: 'Oil-change-due alert; resets on service mark' },
    { step: 'Compare estimated fuel to a delivery', expect: 'Reconciliation; large discrepancy flags leak/theft' },
    { step: 'Power-cycle the monitor', expect: 'Run-hours/fuel restored from storage' },
    { step: 'False start signal (chatter)', expect: 'Debounce prevents double-counting' },
  ],
  output: [
    'The dashboard shows total run-hours, hours since oil/service (with due alerts), estimated/measured fuel, per-run history, and reconciliation flags.',
    { file: 'genset.json', lang: 'json', body: `{
  "run_h": 1284.5,
  "since_oil": 262.0,
  "fuel_L": 4120.0,
  "running": true,
  "maint": "oil change due"
}` },
    'With 262 hours since the last oil change (past the 250 h interval), an oil-change-due alert fires — service scheduled on real run-hours; the fuel estimate supports budgeting and, checked against deliveries, theft detection.',
  ],
  troubleshoot: [
    { sym: 'Run-hours inaccurate', cause: 'Poor run detection / missed short runs', fix: 'Use a reliable running signal; tune threshold/debounce to catch short runs without chatter' },
    { sym: 'Fuel estimate far off', cause: 'Flat rate / no load weighting', fix: 'Load-weight the estimate; calibrate rates; add a fuel sensor for measured fuel' },
    { sym: 'Service alerts wrong', cause: 'Intervals/marks not set', fix: 'Set manufacturer intervals; reset the mark on each service' },
    { sym: 'Theft not caught', cause: 'No reconciliation', fix: 'Compare estimated burn to tank telemetry/deliveries; flag large discrepancies' },
    { sym: 'History lost on reset', cause: 'Not persisting counters', fix: 'Persist run-hours/fuel to non-volatile storage' },
  ],

  iot: {
    protoShort: 'LoRa → fleet maintenance/fuel dashboard',
    net: {
      nodes: [{ name: 'Genset monitor', sub: 'ESP32' }, { name: 'Other gensets', sub: 'fleet' }],
      protocol: 'LoRa / Wi-Fi', gateway: 'Site gateway', gatewaySub: 'to server',
      uplink: 'MQTT', cloud: 'Maintenance/fuel', cloudSub: 'run-hours + fuel',
      clients: [{ name: 'Dashboard', sub: 'usage/service' }, { name: 'Ops', sub: 'maint/theft alerts' }],
    },
    protocol: ['Run-hours, since-service, fuel and running state report periodically; maintenance-due and theft/discrepancy alerts publish on trigger. Counters persist locally.'],
    topics: [
      { t: 'genset/1/status', dir: 'node → dashboard', payload: 'run-hours, since-service, fuel, running' },
      { t: 'genset/1/maint', dir: 'node → ops', payload: 'oil/service due' },
      { t: 'genset/1/fuel', dir: 'node → ops', payload: 'fuel estimate / reconciliation flag' },
    ],
    cloud: ['A dashboard tracks each genset\'s run-hours and service schedule, fuel use and reconciliation, so maintenance is planned and fuel accounted for across a fleet.'],
    dashboard: ['Per-genset run-hours, service-due status, fuel use/estimate, per-run history, and reconciliation flags.'],
    mobile: ['Maintenance-due and fuel-discrepancy (theft) alerts.'],
    security: [
      'Sign reports so run-hours/fuel data is trustworthy (relevant to billing/theft).',
      'Persist counters locally; alert on monitor silence.',
      'Reconcile fuel to catch theft.',
    ],
  },

  perf: [
    'Sample the running signal at ~1 Hz with debounce; run-hours do not need high rate.',
    'Persist run-hours/fuel so resets do not lose history.',
    'Report periodically; maintenance/theft alerts immediately.',
    'Load-weight fuel for a better estimate.',
  ],
  safety: [
    'Sense genset signals safely; follow electrical/engine safety around a running genset (exhaust, hot parts, high current).',
    'Fuel burn from run-hours is an estimate unless a flow meter/gauge is fitted — present it as such.',
    'Schedule maintenance per the engine manufacturer\'s run-hour intervals.',
    'Handle fuel safely; reconciliation supports, not replaces, physical fuel security.',
  ],
  maintenance: [
    'Reset the service mark at each oil change/service.',
    'Verify run detection and fuel calibration periodically.',
    'Reconcile fuel against deliveries/tank and investigate discrepancies.',
    'Keep the run log and reporting healthy.',
  ],
  future: [
    'Add a real fuel flow meter/tank gauge for measured fuel.',
    'Add engine parameters (temperature, oil pressure) for condition monitoring.',
    'Add automatic maintenance scheduling/work orders.',
    'Fleet-wide fuel efficiency benchmarking.',
  ],
  faq: [
    { q: 'Why schedule maintenance by run-hours?', a: 'Because an engine wears by use, not calendar time. A genset that ran 400 hours needs service far sooner than one that ran 40, so servicing on real run-hours avoids both premature service and missed-service failures.' },
    { q: 'How does it know when the genset is running?', a: 'By sensing a reliable running signal — usually the generator\'s own output voltage/current, or vibration/alternator/oil-pressure — debounced so short runs are caught and chatter is not double-counted.' },
    { q: 'Is the fuel figure accurate?', a: 'It is an estimate from load-weighted run-hours unless you add a real flow meter or tank gauge. It is good for budgeting and, reconciled against deliveries, for spotting theft — but run-hours alone do not measure fuel exactly.' },
    { q: 'How does it help catch fuel theft?', a: 'By reconciling estimated burn against actual fuel used (tank telemetry or deliveries). When the tank drops much faster than the run-hours can explain, it flags a possible leak or theft — a real, costly problem at remote gensets.' },
    { q: 'What does it replace?', a: 'The scribbled logbook and the guess. It gives automatic, accurate run-hours and per-run history — the foundation of proper genset maintenance and honest fuel accounting.' },
  ],
  refs: [
    { t: 'Generator maintenance and run-hours', u: 'https://en.wikipedia.org/wiki/Engine-generator', s: 'Reference' },
    { t: 'Diesel engine service intervals', u: 'https://en.wikipedia.org/wiki/Diesel_engine', s: 'Reference' },
    { t: 'Genset fuel consumption vs load', u: 'https://en.wikipedia.org/wiki/Electric_generator', s: 'Reference' },
    { t: 'Fuel theft / reconciliation', u: 'https://en.wikipedia.org/wiki/Fuel_theft', s: 'Reference' },
    { t: 'Hour meters and run-time tracking', u: 'https://en.wikipedia.org/wiki/Hour_meter', s: 'Reference' },
  ],
  images: ['factory', 'esp32', 'grafana'],
  imageCaptions: [
    'A genset serviced on real run-hours, not guesses — and its fuel accounted for.',
    'ESP32 module detecting running (debounced) and accumulating precise run-hours and fuel.',
    'A dashboard schedules maintenance by run-hours and reconciles fuel to catch theft.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   077 — Smart Parking Sensor Grid
   ══════════════════════════════════════════════════════════════════ */
{
  id: '077',
  domainKey: 'iot',
  emoji: '🅿️', thumb: 'sensor',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Senses whether every individual bay is occupied and guides drivers straight to a free one — cutting the circling that wastes fuel, time and tempers, and clogs streets.',

  overview: [
    'A surprising share of urban traffic is not going anywhere — it is drivers <b>circling, looking for parking</b>. Studies in busy districts have found that a third or more of moving cars at peak times are just hunting for a space, burning fuel, wasting time, and adding congestion and emissions to already-crowded streets. The reason is simple: a driver cannot see which bays are free until they are next to them. This project fixes that with a <b>bay-level occupancy grid</b> — a sensor in (or over) every parking bay that knows whether it is occupied — feeding real-time availability that guides drivers straight to a free spot instead of circling.',
    'Each bay gets an occupancy sensor — a magnetometer that detects the large steel mass of a car, an ultrasonic/IR sensor that senses a vehicle above/in front of it, or a similar detector — that reliably reports occupied or free. These per-bay states aggregate into a live map of availability, which drives <b>guidance</b>: dynamic signs at entrances and junctions showing how many spaces are free on each level or zone and pointing toward them, and app/map data so a driver knows before they even arrive. The effect is to replace blind circling with direct routing — the driver goes to where the space actually is.',
    'Beyond guidance, bay-level data enables <b>enforcement and analytics</b> (over-stays, occupancy patterns, pricing), and, networked, a city-wide parking picture. Sensors are typically battery-powered and wireless (LoRa) because running power and cable to every bay is impractical, so long battery life and reliable low-power communication matter. The design is honest that per-bay accuracy depends on the sensor type and siting (a magnetometer must reject neighbouring cars; an overhead sensor needs a clear view), that a whole grid is an infrastructure deployment, and that guidance must degrade gracefully if some sensors drop out. But as a bay-level occupancy grid that turns "somewhere in here is a space" into "that space, over there", it directly attacks one of the most wasteful and frustrating problems in urban mobility — the hunt for parking.',
  ],
  does: [
    'Senses occupancy of each individual parking bay',
    'Aggregates per-bay states into live availability',
    'Guides drivers to free spots via dynamic signs and app/map data',
    'Cuts the circling that wastes fuel/time and adds congestion',
    'Enables enforcement/analytics (over-stays, patterns, pricing)',
    'Runs on battery + wireless (LoRa) per bay for practical deployment',
    'Degrades gracefully if some sensors drop out',
  ],
  features: [
    'Bay-level occupancy sensing',
    'Live availability aggregation',
    'Dynamic guidance (signs + app)',
    'Over-stay/analytics/pricing support',
    'Battery + LoRa per-bay design',
    'City-wide networked picture',
    'Honest about sensor accuracy/siting',
  ],
  applications: [
    { t: 'On-street parking guidance', d: 'Guiding drivers to free curbside bays to cut circling and congestion.' },
    { t: 'Car parks / garages', d: 'Per-bay availability and guidance to free spaces by level/zone.' },
    { t: 'Smart-city mobility', d: 'City-wide parking data for guidance, enforcement and policy.' },
    { t: 'Campus / commercial lots', d: 'Availability signs and app guidance for staff/visitor parking.' },
  ],
  skills: [
    'Bay occupancy sensing (magnetometer/ultrasonic/IR)',
    'Reliable occupied/free detection and neighbour rejection',
    'Availability aggregation and guidance',
    'Battery + LoRa low-power design',
    'Graceful-degradation and analytics',
  ],
  prereq: [
    'Per-bay accuracy depends on the sensor type and siting — a magnetometer must reject neighbouring cars; an overhead sensor needs a clear view.',
    'Sensors are battery + wireless (running power/cable to every bay is impractical) — long battery life and reliable LoRa matter.',
    'The value is direct guidance — turning "somewhere here" into "that spot" — so aggregation and signage/app must be timely.',
    'Guidance must degrade gracefully if some sensors drop out.',
  ],

  parts: ['esp32', 'mpu9250', 'jsnsr04t', 'ir_sensor', 'lora', 'solarpanel', 'tp4056', 'li18650'],
  extraParts: [
    { name: 'Bay occupancy sensor', spec: 'Magnetometer (in-ground) or overhead ultrasonic/IR per bay', qty: 20, price: 400, note: 'Magnetometer detects the car\'s steel; overhead senses the vehicle' },
    { name: 'LoRa gateway', spec: 'Site/city gateway aggregating bay sensors', qty: 1, price: 2500 },
    { name: 'Dynamic guidance signs', spec: 'Entrance/junction signs showing free spaces + direction', qty: 1, price: 3000 },
    { name: 'Battery + weatherproof housing', spec: 'Long-life battery and rugged in-ground/overhead housing per bay', qty: 20, price: 300, note: 'Battery life is critical at grid scale' },
  ],
  cost: '₹600 – ₹1,000 per bay (+ gateway/signs)',
  libs: ['wifi', 'pubsub', 'mpu', 'lorolib', 'arduinojson', 'preferences'],

  pins: {
    left: [
      { dev: 'Magnetometer', devPin: 'SDA/SCL', pin: 'GPIO 21/22', sig: 'Vehicle steel mass (I²C)' },
      { dev: 'Ultrasonic/IR (alt)', devPin: 'TRIG/ECHO/OUT', pin: 'GPIO 26/25/27', sig: 'Vehicle presence' },
    ],
    right: [
      { dev: 'LoRa', devPin: 'SPI', pin: 'GPIO 18/19/23/5', sig: 'Bay state to gateway' },
      { dev: 'Solar + TP4056', devPin: 'OUT', pin: '3V3 reg', sig: 'Charged supply' },
      { dev: 'Status LED', devPin: 'IN', pin: 'GPIO 2', sig: 'Occupied/free' },
      { dev: 'Battery sense', devPin: 'ADC', pin: 'GPIO 34', sig: 'Supervision' },
    ],
  },
  wiringNotes: [
    'Choose the sensor for the bay type: an in-ground magnetometer detects the car\'s steel mass (good on-street); an overhead ultrasonic/IR senses the vehicle (good in garages).',
    'A magnetometer must be sited/calibrated to reject the magnetic influence of cars in neighbouring bays; an overhead sensor needs a clear view of the bay.',
    'Battery + LoRa per bay — running power/cable to every bay is impractical; optimise for long battery life (deep sleep, report on change).',
    'Aggregate bay states at a gateway; drive guidance signs and app/map data from the live availability.',
    'Supervise battery so a dead bay sensor is flagged; degrade guidance gracefully if sensors drop out.',
  ],

  block: { columns: [
    { label: 'Sense bay', edge: 'right', blocks: [
      { name: 'Occupancy', sub: 'magnetometer/ultra', highlight: true },
    ] },
    { label: 'Aggregate', edge: 'right', blocks: [
      { name: 'LoRa gateway', sub: 'all bays' },
      { name: 'Availability', sub: 'live map' },
    ] },
    { label: 'Guide', edge: 'right', blocks: [
      { name: 'Signs', sub: 'free + direction', highlight: true },
      { name: 'App/map', sub: 'before arrival' },
    ] },
    { label: 'Use', edge: 'none', blocks: [
      { name: 'Less circling', sub: 'fuel/time/congestion' },
      { name: 'Analytics', sub: 'over-stay/pricing' },
    ] },
  ] },
  flow: [
    { t: 'Bay sensor: detect vehicle', k: 'start' },
    { t: 'State changed (occupied/free)?', k: 'dec', yes: 'Report bay state (LoRa)', no: 'Sleep' },
    { t: 'Report bay state (LoRa)', k: 'io' },
    { t: 'Sleep', k: 'io', back: 'Bay sensor: detect vehicle' },
    { t: 'Gateway: aggregate availability', k: 'proc' },
    { t: 'Update signs + app; guide to free', k: 'io' },
    { t: 'Analytics (over-stay/patterns)', k: 'end' },
  ],

  principle: [
    'The problem the grid solves is a pure <b>information</b> problem: spaces exist, but drivers cannot <i>see</i> which ones are free until they are right next to them, so they circle, and that circling is a large, wasteful, and entirely avoidable component of urban traffic. Making per-bay availability visible — knowing not just "the lot is 80% full" but "bay 47 on level 2 is free, this way" — converts a blind search into a direct route. That is the whole value proposition, and it is why the system must sense at the granularity of the individual <b>bay</b>, not just count cars in and out.',
    'Reliable <b>bay-level occupancy sensing</b> is the technical heart, and the sensor choice depends on the setting. A <b>magnetometer</b> buried in or beside the bay detects the large ferrous mass of a parked car by the distortion it causes in the Earth\'s magnetic field — cheap, robust, and well-suited to on-street bays — but it must be sited and calibrated to <b>reject</b> the influence of cars in adjacent bays, or it will report neighbours as its own occupancy. An <b>ultrasonic or IR</b> sensor mounted overhead (common in garages) detects the vehicle directly by ranging to it, needing a clear view of the bay. Whatever the sensor, the requirement is a dependable occupied/free state per bay, robust to the edge cases (a person standing in the bay, a motorcycle, a car parked askew).',
    'Those per-bay states <b>aggregate</b> into live availability that drives <b>guidance</b> — and guidance is where the benefit is realised. Dynamic signs at entrances and decision points show how many spaces are free in each zone/level and point toward them; app and map integration lets a driver know availability <i>before</i> they arrive and routes them to it. The tighter and timelier this loop — sense, aggregate, guide — the more circling it eliminates. Bay-level data also unlocks secondary value: <b>enforcement</b> (detecting over-stays), <b>analytics</b> (occupancy patterns to inform capacity and dynamic pricing), and a city-wide parking picture for policy.',
    'The deployment realities shape the engineering and the honesty. A parking grid is <b>infrastructure at scale</b> — potentially thousands of bays — and running power and cable to every one is impractical, so sensors are <b>battery-powered and wireless</b> (LoRa is well-matched: long range, low power, low data rate), which makes <b>long battery life</b> (deep sleep, report only on state change) and reliable low-power communication first-order design concerns, along with <b>supervision</b> so a dead sensor is noticed. And the system must <b>degrade gracefully</b>: if some sensors drop out, guidance should fall back sensibly (e.g. to zone-level counts) rather than mislead. The design is candid that per-bay accuracy depends on sensor type and careful siting, and that a full grid is a real deployment, not a bench demo. But the core idea is powerful and proven: sense every bay, aggregate the truth, and guide drivers straight to a free space — turning one of the most wasteful, frustrating, congestion-causing behaviours in a city into a solved information problem.',
  ],
  equations: [
    { t: 'Occupancy from a magnetometer', eq: 'A parked car distorts the local magnetic field:\n\n  |B − B_baseline| > threshold  → occupied\n\nBaseline learned per bay (empty). Reject neighbour bays by\nsiting/threshold so an adjacent car does not trigger it.' },
    { t: 'Availability aggregation', eq: 'free(zone) = Σ bays in zone with state == free\n\nGuidance = show free(zone) and direction to the nearest\nzone with free > 0. Timely sense→aggregate→guide loop\nminimises circling.' },
    { t: 'Battery life (report-on-change)', eq: 'life ≈ capacity / ( I_sleep + f_change·E_tx )\n\nReporting only on occupancy CHANGE (not periodically) and\ndeep-sleeping between makes battery life years, viable at\ngrid scale.' },
  ],

  assembly: [
    { h: 'Deploy and calibrate bay sensors', p: [
      'Install the chosen sensor per bay (in-ground magnetometer or overhead ultrasonic/IR), learn each bay\'s empty baseline, and calibrate to reliably detect occupancy while rejecting neighbouring bays.',
      'Battery-power each with deep sleep and report-on-change; supervise the battery.',
    ], warn: 'A magnetometer that picks up neighbouring cars, or an overhead sensor without a clear view, gives wrong occupancy. Siting and calibration per bay are essential.' },
    { h: 'Aggregate and guide', p: [
      'Aggregate bay states at a LoRa gateway into live availability, and drive dynamic guidance signs and app/map data toward free spaces, degrading gracefully if sensors drop out.',
    ] },
    { h: 'Add analytics', p: [
      'Use bay-level data for over-stay enforcement, occupancy analytics and (optionally) dynamic pricing.',
    ] },
  ],
  steps: [
    { h: 'Detect occupancy and report on change', p: [
      'Learn the empty baseline, detect occupied/free from the sensor with hysteresis, and report only on a state change to save battery.',
    ], code: {
      file: 'bay-occupancy.ino', lang: 'cpp',
      body: `float baseline=0; bool occupied=false;
#define OCC_THRESH 30.0f     // magnetometer delta for a car (uT)
#define HYST 8.0f

// Learn the empty-bay baseline (call when known empty).
void learnBaseline(float field){ baseline = field; }

// Detect occupancy with hysteresis; return true if state CHANGED.
bool updateOccupancy(float field){
  float delta = fabsf(field - baseline);
  bool now = occupied
    ? (delta > OCC_THRESH - HYST)      // stay occupied until well below
    : (delta > OCC_THRESH + HYST);     // become occupied only well above
  if (now != occupied){ occupied = now; return true; }  // changed
  return false;
}

void onWake(float field){
  if (updateOccupancy(field))
    reportBayState(occupied);          // report only on change (save battery)
  // else stay silent and sleep
}`,
      explain: [
        { ref: 'void learnBaseline(float field)', txt: 'Each bay learns its own empty-field baseline, so occupancy is a change from that specific bay\'s normal — accommodating local variation.' },
        { ref: 'bool now = occupied\n    ? (delta > OCC_THRESH - HYST)', txt: 'Hysteresis around the threshold prevents the bay flickering between occupied and free at the boundary.' },
        { ref: 'if (now != occupied){ occupied = now; return true; }', txt: 'The function reports only when the state actually changes, which is what makes report-on-change (and long battery life) possible.' },
        { ref: 'if (updateOccupancy(field))\n    reportBayState(occupied);', txt: 'A LoRa message is sent only on a change, so a bay that sits occupied or free for hours transmits nothing — key to years of battery life at grid scale.' },
      ],
    } },
    { h: 'Aggregate, guide and supervise', p: [
      'At the gateway, aggregate bay states into zone availability, drive signs/app guidance to free spaces, supervise battery/health, and degrade gracefully if sensors drop out.',
    ], tip: 'Report on change plus a slow heartbeat so a bay that has genuinely gone silent (dead sensor) is distinguishable from one that simply has not changed.' },
  ],

  code: [{
    file: 'parking-bay-sensor.ino', lang: 'cpp',
    body: `/* ═══════════════════════════════════════════════════════════════
   Smart Parking Bay Sensor — ESP32 + magnetometer, LoRa, battery

   Detects bay occupancy (report-on-change for battery life), which
   aggregates into live availability and guidance. Battery + LoRa per
   bay; supervised; graceful degradation.
   ══════════════════════════════════════════════════════════════════ */

#include <Wire.h>
#include <MPU9250.h>          // magnetometer
#include <LoRa.h>
#include <SPI.h>
#include <Preferences.h>
#include <math.h>

#define OCC_THRESH 30.0f
#define HYST 8.0f
#define HEARTBEAT_S 3600      // 1 h heartbeat (supervision)
#define BAY_ID 47

MPU9250 imu(Wire, 0x68);
Preferences prefs;
RTC_DATA_ATTR float baseline = 0;
RTC_DATA_ATTR bool occupied = false;
RTC_DATA_ATTR uint32_t sinceBeat = 0;

float fieldMagnitude(){
  imu.readSensor();
  float x=imu.getMagX_uT(), y=imu.getMagY_uT(), z=imu.getMagZ_uT();
  return sqrtf(x*x+y*y+z*z);
}

void report(bool occ, bool beat){
  LoRa.beginPacket();
  LoRa.printf("{\\"bay\\":%d,\\"occupied\\":%s,\\"vbat\\":%.2f,\\"hb\\":%d}",
              BAY_ID, occ?"true":"false", readBattery(), beat?1:0);
  LoRa.endPacket();
}

void setup(){
  Serial.begin(115200);
  Wire.begin(21,22); imu.begin();
  prefs.begin("bay",true);
  if (baseline==0) baseline = prefs.getFloat("base", fieldMagnitude());
  prefs.end();

  SPI.begin(); LoRa.setPins(5,14,2); LoRa.begin(433E6); LoRa.setSpreadingFactor(10);

  float field = fieldMagnitude();
  float delta = fabsf(field - baseline);
  bool now = occupied ? (delta > OCC_THRESH-HYST) : (delta > OCC_THRESH+HYST);

  bool changed = (now != occupied);
  occupied = now;

  sinceBeat += 60;                          // approx per wake (sleep 60s)
  bool beat = sinceBeat >= HEARTBEAT_S;
  if (changed || beat){                     // report on change OR heartbeat
    report(occupied, beat && !changed);
    if (beat) sinceBeat = 0;
  }

  esp_sleep_enable_timer_wakeup(60ULL*1000000ULL);  // check each minute
  esp_deep_sleep_start();
}
void loop(){}`,
    explain: [
      { ref: 'RTC_DATA_ATTR float baseline = 0;', txt: 'The learned empty baseline and occupancy state persist across deep sleep so the bay keeps its calibration between one-minute checks.' },
      { ref: 'bool now = occupied ? (delta > OCC_THRESH-HYST) : (delta > OCC_THRESH+HYST)', txt: 'Occupancy is detected from the magnetic-field change with hysteresis, so a parked car reads occupied and an empty bay free without flicker.' },
      { ref: 'if (changed || beat){                     // report on change OR heartbeat', txt: 'A LoRa message is sent only when occupancy changes or on a slow heartbeat, giving years of battery life while still proving the sensor is alive.' },
      { ref: 'esp_sleep_enable_timer_wakeup(60ULL*1000000ULL)', txt: 'The sensor deep-sleeps between minute checks, drawing almost nothing — essential for a battery-powered grid of thousands of bays.' },
      { ref: 'report(occupied, beat && !changed)', txt: 'The heartbeat is flagged so the aggregator can distinguish a genuine still-alive report from an occupancy change.' },
    ],
  }],

  config: [
    'Choose and site the sensor per bay; learn the empty baseline and set the occupancy threshold/hysteresis (reject neighbours).',
    'Configure report-on-change plus a heartbeat interval, and battery supervision.',
    'Configure LoRa aggregation, availability zones, and guidance signs/app.',
    'Set graceful-degradation behaviour and analytics.',
  ],
  calibration: [
    { h: 'Occupancy detection', p: [
      'Calibrate the baseline and threshold so a parked car reads occupied and an empty bay free, and a neighbouring car does not trigger it.',
    ] },
    { h: 'Battery/report', p: [
      'Verify report-on-change and heartbeat, and measure battery life at the expected change rate.',
    ] },
    { h: 'Aggregation/guidance', p: [
      'Confirm the sense→aggregate→guide loop is timely and signs/app reflect availability quickly.',
    ] },
  ],
  testing: [
    { step: 'Park/remove a car', expect: 'Bay reports occupied/free on change; guidance updates' },
    { step: 'Car in a neighbouring bay', expect: 'This bay unaffected (neighbour rejection)' },
    { step: 'Bay empty/occupied for hours', expect: 'No transmissions except heartbeat — battery saved' },
    { step: 'Disable a sensor', expect: 'Missing heartbeat flags it; guidance degrades gracefully' },
    { step: 'Fill a zone', expect: 'Signs show zero free; guide to the next zone' },
    { step: 'Battery run-down', expect: 'Low battery reported (supervision)' },
  ],
  output: [
    'Dynamic signs and the app show free spaces by zone and directions; the dashboard shows per-bay occupancy, availability and analytics.',
    { file: 'bay.json', lang: 'json', body: `{
  "bay": 47,
  "occupied": false,
  "vbat": 3.78,
  "hb": 0
}` },
    'Bay 47 reporting free — aggregated with its neighbours into a zone count that a sign and the app use to guide a driver straight to it, instead of circling to find it.',
  ],
  troubleshoot: [
    { sym: 'Neighbour cars trigger a bay', cause: 'Magnetometer siting/threshold', fix: 'Re-site/calibrate; raise threshold; reject neighbour influence' },
    { sym: 'Battery dies fast', cause: 'Periodic reporting / no deep sleep', fix: 'Report on change + heartbeat; deep-sleep between checks' },
    { sym: 'Guidance lags reality', cause: 'Slow sense→aggregate→guide loop', fix: 'Report changes promptly; aggregate/update signs quickly' },
    { sym: 'Overhead sensor unreliable', cause: 'Obstructed view / poor mounting', fix: 'Ensure a clear view of the bay; adjust mounting/range' },
    { sym: 'Dead sensor unnoticed', cause: 'No supervision', fix: 'Heartbeat; flag missing bays; degrade guidance gracefully' },
  ],

  iot: {
    protoShort: 'LoRa → gateway → parking availability/guidance',
    net: {
      nodes: [{ name: 'Bay sensor', sub: 'ESP32' }, { name: 'Other bays', sub: 'grid' }],
      protocol: 'LoRa', gateway: 'Site/city gateway', gatewaySub: 'aggregate',
      uplink: 'MQTT', cloud: 'Parking platform', cloudSub: 'availability + analytics',
      clients: [{ name: 'Signs/app', sub: 'guidance' }, { name: 'Ops', sub: 'enforcement/analytics' }],
    },
    protocol: ['Bays report occupancy on change (plus heartbeat); the gateway aggregates live availability that drives signs and app guidance, and feeds analytics/enforcement.'],
    topics: [
      { t: 'parking/bay/<id>/state', dir: 'bay → gateway', payload: 'occupied/free, battery, heartbeat' },
      { t: 'parking/zone/<id>/free', dir: 'gateway → signs/app', payload: 'free count + direction' },
      { t: 'parking/bay/<id>/health', dir: 'bay → ops', payload: 'battery/supervision' },
    ],
    cloud: ['A parking platform aggregates bay states into live availability, drives guidance signs and app/map data, and provides analytics (occupancy, over-stays) and city-wide visibility.'],
    dashboard: ['A parking map by bay/zone availability, guidance status, sensor health, and occupancy analytics.'],
    mobile: ['App guidance to free spaces before arrival; availability by zone.'],
    security: [
      'Authenticate bay reports so availability cannot be spoofed.',
      'Supervise battery/health; degrade guidance gracefully.',
      'Protect any personal/enforcement data appropriately.',
    ],
  },

  perf: [
    'Report on change plus a slow heartbeat; deep-sleep between checks for years of battery life.',
    'Keep the sense→aggregate→guide loop timely so guidance reflects reality.',
    'Reject neighbour influence in detection.',
    'Degrade gracefully (zone counts) if some bays drop out.',
  ],
  safety: [
    'Site sensors safely (in-ground/overhead) without creating hazards; follow road/works safety for installation.',
    'Per-bay accuracy depends on sensor type and siting — calibrate to reject neighbours/obstructions.',
    'Degrade guidance gracefully rather than mislead if sensors fail.',
    'Protect any enforcement/personal data per policy/law.',
  ],
  maintenance: [
    'Act on low-battery/dead-sensor supervision; replace batteries at grid scale on a plan.',
    'Recalibrate baselines/thresholds as needed.',
    'Verify guidance signs/app reflect availability.',
    'Review analytics and sensor health.',
  ],
  future: [
    'Add reservation/booking of bays via the app.',
    'Add dynamic pricing from occupancy analytics.',
    'Fuse with navigation for turn-by-turn to a free bay.',
    'Add EV-bay and accessible-bay specific detection.',
  ],
  faq: [
    { q: 'Why sense every bay instead of counting cars in and out?', a: 'Because a total count tells a driver the lot is 80% full but not where the free space is, so they still circle. Bay-level sensing lets you guide them to a specific free spot — turning a blind search into a direct route.' },
    { q: 'How does a magnetometer detect a car?', a: 'A car is a large mass of steel that distorts the local magnetic field. The sensor detects that change against the empty-bay baseline — cheap and robust, but it must be sited to reject cars in neighbouring bays.' },
    { q: 'Why battery and wireless per bay?', a: 'Running power and cable to every bay across a lot or a street is impractical, so sensors are battery-powered and use low-power wireless (LoRa). Reporting only on occupancy change and deep-sleeping give years of battery life.' },
    { q: 'What if some sensors fail?', a: 'The system supervises battery/health and flags dead sensors, and guidance degrades gracefully — falling back to zone-level counts rather than misleading a driver to a "free" bay that is not.' },
    { q: 'What is the real benefit?', a: 'Cutting the circling for parking that is a large share of urban traffic — saving fuel, time and frustration and reducing congestion and emissions — by making per-bay availability visible and guiding drivers straight to a free spot.' },
  ],
  refs: [
    { t: 'Smart parking systems', u: 'https://en.wikipedia.org/wiki/Smart_parking', s: 'Reference' },
    { t: 'Cruising for parking (traffic impact)', u: 'https://en.wikipedia.org/wiki/Parking', s: 'Reference' },
    { t: 'Magnetometer vehicle detection', u: 'https://en.wikipedia.org/wiki/Magnetometer', s: 'Reference' },
    { t: 'LoRa low-power wide-area networking', u: 'https://en.wikipedia.org/wiki/LoRa', s: 'Reference' },
    { t: 'Parking guidance systems', u: 'https://en.wikipedia.org/wiki/Parking_guidance_and_information', s: 'Reference' },
  ],
  images: ['car', 'city', 'esp32'],
  imageCaptions: [
    'A bay-level occupancy grid guides drivers straight to a free spot instead of circling.',
    'Each bay senses whether it is occupied and reports on change over LoRa to save battery.',
    'Aggregated availability drives signs and app guidance — cutting the hunt for parking.',
  ],
},

];
