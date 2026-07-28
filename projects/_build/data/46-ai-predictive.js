/* AI — Predictive ML A20–A22. Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   A20 — Energy Demand Forecaster
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A20',
  domainKey: 'ai',
  emoji: '⚡', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Forecasts electricity load for grids and homes — a time-series problem that, unlike the stock market, actually is predictable.',
  platformName: 'CPU/GPU workstation or server',
  ide: 'Python 3.11 + time-series ML',

  overview: [
    'Electricity cannot be easily stored at grid scale, so supply must be matched to demand <b>in real time</b> — which means grid operators must <b>forecast how much power will be needed</b>, hour by hour and day by day, to schedule generation, buy energy, and keep the lights on economically. This project builds an <b>energy demand (load) forecaster</b>: a time-series model that predicts electricity consumption for a grid, building or home. It is the ideal counterpoint to stock prediction — the <i>same</i> time-series toolkit, but applied to a problem that <b>genuinely is predictable</b>.',
    'That predictability is what makes it satisfying. Unlike near-random markets, energy demand follows <b>strong, learnable patterns</b>: it is highly <b>periodic</b> (daily cycles of morning and evening peaks, weekly cycles of weekday vs weekend, seasonal cycles of summer cooling and winter heating), and it depends heavily on <b>weather</b> (temperature drives heating and air-conditioning load) and on <b>calendar</b> effects (holidays, working hours). A model given the recent load history plus weather forecasts and calendar features can predict future demand accurately, because the underlying signal is real and strong.',
    'The approach uses the proper time-series discipline: engineer features (lags, rolling statistics, weather, calendar), train models from classical methods to LSTMs, and <b>backtest honestly</b> (time-aware splits, no look-ahead) — the same rigor as any forecasting project. The value is real and practical: better forecasts mean cheaper, more reliable, greener grids (less wasteful spinning reserve, better renewable integration) and smarter home energy management. It is honest that forecasts are not perfect — <b>unusual weather, special events and behaviour changes</b> cause errors, and forecast accuracy depends on good <b>weather forecasts</b> as inputs. But because the signal is genuinely there, this project rewards good time-series practice with <b>accurate, useful predictions</b> — the encouraging complement to the market\'s hard lesson.',
  ],
  does: [
    'Forecasts electricity demand (grid/building/home)',
    'Exploits strong periodic patterns (daily/weekly/seasonal)',
    'Uses weather and calendar features',
    'Trains time-series models (classical → LSTM)',
    'Backtests honestly (time-aware, no look-ahead)',
    'Supports generation scheduling and energy management',
    'Delivers genuinely accurate, useful predictions',
  ],
  features: [
    'Load time-series forecasting',
    'Periodicity + weather + calendar features',
    'Classical and deep sequence models',
    'Honest, time-aware backtesting',
    'Multi-horizon forecasts (hours/days ahead)',
    'Grid and home applications',
    'Honest about weather-dependence and anomalies',
  ],
  applications: [
    { t: 'Grid operation', d: 'Scheduling generation and buying energy to demand.' },
    { t: 'Renewable integration', d: 'Balancing variable supply against forecast demand.' },
    { t: 'Home / building energy', d: 'Smart management, battery/solar optimisation.' },
    { t: 'Time-series ML learning', d: 'Forecasting that actually works (vs stocks).' },
  ],
  skills: [
    'Time-series forecasting and feature engineering',
    'Using periodicity, weather and calendar signals',
    'Classical and deep sequence models',
    'Time-aware backtesting (no look-ahead)',
    'Multi-horizon forecasting and evaluation',
  ],
  prereq: [
    'Energy demand is genuinely predictable — strong periodic + weather patterns.',
    'Use load history + weather forecasts + calendar features.',
    'Backtest time-aware with no look-ahead (same rigor as any forecasting).',
    'Accuracy depends on good weather forecasts; anomalies cause errors.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute', spec: 'CPU for classical/features; GPU for deep models', qty: 1, price: 0 },
    { name: 'Time-series libraries', spec: 'Forecasting models + backtesting', qty: 1, price: 0 },
    { name: 'Load + weather data', spec: 'Historical demand, weather, calendar', qty: 1, price: 0 },
    { name: 'Weather forecast input', spec: 'Forecasts drive prediction accuracy', qty: 1, price: 0, note: 'Key input' },
  ],
  cost: 'Software; compute-light to moderate',
  libs: ['python', 'pandas', 'sklearn', 'torch', 'numpy'],
  hardwareNotes: [
    'This is a pure-software forecasting system — no electronic hardware to specify. The "platform" is a computer: a CPU handles classical models, features and backtesting; a GPU accelerates deep sequence models.',
    'Memory scales with the length/granularity of load and weather series; storage holds historical data and forecasts. A deployment adds data ingestion (load/weather feeds) and a forecast dashboard. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the forecasting data flow — load history plus weather and calendar features feed a time-series model that predicts future demand, evaluated by honest time-aware backtesting.',
  pins: {
    left: [
      { dev: 'Load history', devPin: 'series', pin: '—', sig: 'Past demand' },
      { dev: 'Weather + calendar', devPin: 'features', pin: '—', sig: 'Drivers' },
    ],
    right: [
      { dev: 'Model', devPin: 'forecast', pin: '—', sig: 'Future demand' },
      { dev: 'Backtest', devPin: 'evaluate', pin: '—', sig: 'Accuracy (time-aware)' },
    ],
  },
  wiringNotes: [
    'Use historical load as the core series.',
    'Add weather (especially temperature) and calendar (day/holiday/hour) features.',
    'Feed weather forecasts as inputs for future-demand prediction.',
    'Train a time-series model and backtest with time-aware splits (no look-ahead).',
    'Forecast accuracy depends on the quality of the weather forecasts.',
  ],

  block: { columns: [
    { label: 'Inputs', edge: 'right', blocks: [
      { name: 'Load history', sub: 'periodic', highlight: true },
      { name: 'Weather/calendar', sub: 'drivers' },
    ] },
    { label: 'Model', edge: 'right', blocks: [
      { name: 'Time-series', sub: 'forecast', highlight: true },
    ] },
    { label: 'Validate', edge: 'right', blocks: [
      { name: 'Backtest', sub: 'time-aware' },
      { name: 'No look-ahead', sub: 'honest' },
    ] },
    { label: 'Use', edge: 'none', blocks: [
      { name: 'Forecast', sub: 'hours/days' },
      { name: 'Schedule', sub: 'generation' },
    ] },
  ] },
  flow: [
    { t: 'Load history + weather + calendar', k: 'start' },
    { t: 'Engineer features (lags/rolling/weather)', k: 'proc' },
    { t: 'Train model (time-aware split)', k: 'proc' },
    { t: 'Forecast future demand (with weather forecast)', k: 'proc' },
    { t: 'Backtest honest (no look-ahead)?', k: 'dec', yes: 'Accurate, useful forecast', no: 'Fix leakage/features' },
    { t: 'Fix leakage/features', k: 'io' },
    { t: 'Accurate, useful forecast', k: 'end', back: 'Load history + weather + calendar' },
  ],

  principle: [
    'Energy demand forecasting matters because of a hard physical constraint: electricity is <b>consumed the instant it is generated</b> and is expensive to store at scale, so supply must be balanced against demand continuously. Grid operators therefore <b>must know tomorrow\'s (and the next hour\'s) demand</b> to schedule power plants, buy energy on markets, and integrate variable renewables — and errors are costly (wasteful reserve capacity, or shortfalls). A good load forecast is the foundation of running a grid economically and reliably, which is why it is one of the most valuable and mature applications of time-series ML.',
    'The reason this project is so satisfying — and the deliberate contrast with stock prediction — is that <b>energy demand genuinely is predictable</b>. Where markets are efficient and near-random, electricity consumption is driven by <b>real, physical, human patterns</b> that recur strongly. It is intensely <b>periodic</b>: a <b>daily</b> cycle (low overnight, morning and evening peaks), a <b>weekly</b> cycle (weekday vs weekend), and a <b>seasonal</b> cycle (heating in winter, cooling in summer). It is strongly driven by <b>weather</b> — temperature above all, because it dictates air-conditioning and heating load — and by the <b>calendar</b> (holidays, working hours). These drivers are stable and learnable, so a model with the right inputs can forecast demand with genuinely useful accuracy.',
    'The method is the proper <b>time-series ML toolkit</b>, applied with the same discipline as any serious forecasting. You engineer <b>features</b> that expose the structure: <b>lagged</b> demand (yesterday\'s, last week\'s same hour), <b>rolling statistics</b>, <b>weather</b> inputs (crucially, <b>forecast</b> weather for the horizon you\'re predicting), and <b>calendar</b> encodings (hour, day-of-week, holiday). You train models spanning classical statistical methods to <b>LSTMs</b> and gradient-boosted trees, for one or multiple horizons. And you <b>backtest honestly</b> — time-aware splits, no <b>look-ahead bias</b> — exactly the rigor the stock project preached; the difference is that here, because the signal is real, that rigor is <b>rewarded with accurate predictions</b> rather than exposing an absence of signal.',
    'The honesty here is more encouraging but still real. Forecasts are <b>not perfect</b>: <b>unusual weather</b>, <b>special events</b> (a major broadcast, an unexpected shutdown), and gradual <b>behaviour change</b> introduce errors, and the model can only be as good as its inputs — in particular, since demand depends on weather, <b>the load forecast inherits the uncertainty of the weather forecast</b> that feeds it. Longer horizons are harder than short ones. But these are ordinary, manageable limitations of a genuinely working system, not the fundamental unpredictability that defeats market forecasting. The payoff is concrete and important: accurate load forecasts let grids schedule generation efficiently (less wasteful spinning reserve, lower cost, lower emissions), integrate renewables better (balancing variable supply against known demand), and enable smart home/building energy management (optimising batteries, solar and shiftable loads). Built with strong periodic/weather/calendar features and honest time-aware evaluation, the forecaster is both a practically valuable tool and the reassuring lesson that good time-series practice, applied to a problem with real signal, produces real, useful predictions.',
  ],
  equations: [
    { t: 'Demand drivers (why it works)', eq: 'demand(t) ≈ f( periodicity(t),  weather(t),  calendar(t) )\n  periodicity: daily + weekly + seasonal cycles\n  weather:     temperature → heating/cooling load\n  calendar:    holidays, working hours\n\nStrong, stable, LEARNABLE signal (unlike markets).' },
    { t: 'Feature engineering', eq: 'features: lagged demand (t−1, t−24, t−168),\n          rolling mean/std, FORECAST weather, hour/dow/holiday\ntarget:   demand at horizon h\nmodels:   classical / gradient boosting / LSTM' },
    { t: 'Honest evaluation + input dependence', eq: 'backtest time-aware, NO look-ahead (as always)\n\nload forecast inherits WEATHER-forecast uncertainty\nanomalies (odd weather/events) → errors\nlonger horizon → harder\n\nBut the signal is real → rigor is REWARDED with accuracy.' },
  ],

  ai: {
    task: 'Forecast electricity demand at one or more horizons using time-series models with periodicity, weather and calendar features, evaluated by honest time-aware backtesting.',
    dataset: [
      'Historical load (the series), historical + forecast weather (especially temperature), and calendar data (holidays, day-of-week).',
      'Because demand depends on weather, forecast-weather quality is a key input to real-world accuracy.',
    ],
    datasetTable: [
      { n: 'Historical load', size: 'Long series', lic: 'Utility/open', use: 'Core series + lags' },
      { n: 'Weather (history + forecast)', size: 'Aligned', lic: 'Weather-service terms', use: 'Dominant demand driver' },
      { n: 'Calendar / holidays', size: 'Small', lic: 'Public', use: 'Working-hours/holiday effects' },
      { n: 'Out-of-time test period', size: 'Held-out future', lic: '—', use: 'Honest backtest' },
    ],
    preprocess: [
      'Align load with weather and calendar on the time index.',
      'Engineer lag/rolling features and calendar encodings (no look-ahead).',
      'Use forecast weather for the prediction horizon.',
    ],
    pipeline: [
      { name: 'Load + weather', sub: 'aligned', highlight: true },
      { name: 'Features', sub: 'lags/weather/cal' },
      { name: 'Model', sub: 'forecast', highlight: true },
      { name: 'Backtest', sub: 'time-aware' },
      { name: 'Forecast', sub: 'schedule/manage' },
    ],
    archTable: [
      { l: 'Feature engineering', s: 'lags/rolling/weather/calendar', p: 'Expose the real structure' },
      { l: 'Model', s: 'gradient boosting / LSTM / classical', p: 'Learn demand from drivers' },
      { l: 'Weather input', s: 'forecast weather', p: 'Dominant driver (and its uncertainty)' },
      { l: 'Multi-horizon', s: 'hours/days ahead', p: 'Operational needs' },
      { l: 'Backtest', s: 'time-aware, no look-ahead', p: 'Honest accuracy' },
    ],
    hyper: [
      { k: 'Horizon', v: 'hours…days', w: 'Use case; longer = harder' },
      { k: 'Lags', v: 't−1, t−24, t−168', w: 'Daily/weekly cycles' },
      { k: 'Weather features', v: 'forecast temp etc.', w: 'Dominant driver' },
      { k: 'Model', v: 'GBM/LSTM', w: 'Accuracy vs simplicity' },
    ],
    training: [
      'Train time-aware on load + weather + calendar features.',
      'Use forecast (not actual) weather at prediction time to be realistic.',
      'Backtest on held-out future periods; report error (e.g. MAPE).',
    ],
    metricsIntro: [
      'Forecast error (e.g. MAPE/RMSE) on out-of-time data is the honest measure — and, unlike stocks, it is genuinely low because the signal is real.',
    ],
    metrics: [
      { m: 'MAPE / RMSE (out-of-time)', v: 'genuinely low', d: 'Real, useful accuracy' },
      { m: 'Short vs long horizon', v: 'short better', d: 'Longer is harder' },
      { m: 'vs naive-seasonal baseline', v: 'beats it', d: 'Real skill (unlike markets)' },
      { m: 'Weather sensitivity', v: 'high', d: 'Inherits weather-forecast error' },
    ],
    chart: { title: 'Accuracy by horizon', unit: '%', desc: 'Load forecasting is accurate short-term and degrades gracefully with horizon — a genuinely predictable signal (illustrative).', bars: [
      { label: '1 hour ahead', value: 97 },
      { label: 'Day ahead', value: 92 },
      { label: 'Week ahead', value: 82 },
      { label: 'Anomalous weather', value: 70 },
    ] },
    inference: { file: 'forecast.py', lang: 'python', body: `import numpy as np

def features(load, weather_fc, ts):
    # PAST load + FORECAST weather + calendar (no look-ahead)
    return np.array([
        load[ts-1], load[ts-24], load[ts-168],     # daily & weekly lags
        rolling_mean(load, ts, 24),                  # recent level
        weather_fc[ts],                              # forecast temperature
        hour_of_day(ts), day_of_week(ts), is_holiday(ts),
    ])

def forecast(model, load, weather_fc, ts):
    x = features(load, weather_fc, ts)
    return float(model.predict([x])[0])              # predicted demand
    # Real, learnable signal -> genuinely accurate; inherits weather-fc uncertainty.` },
    limits: [
      'Anomalies (unusual weather, special events, behaviour change) cause errors.',
      'Accuracy depends on the weather forecast that feeds it.',
      'Longer horizons are harder than short ones.',
      'It works well precisely because the signal is real — but is not perfect.',
    ],
  },

  assembly: [
    { h: 'Assemble load, weather and calendar features', p: [
      'Align historical load with weather and calendar, and engineer lag/rolling/weather/calendar features without look-ahead.',
    ], warn: 'Use the same rigor as any forecasting: time-aware splits and no look-ahead bias. The difference from stock prediction is that here the signal is real — so that rigor is rewarded with genuinely accurate forecasts. Remember the forecast inherits the uncertainty of the weather forecast feeding it.' },
    { h: 'Train and backtest honestly', p: [
      'Train a time-series model (classical/boosting/LSTM) and backtest on held-out future periods with forecast weather.',
    ] },
    { h: 'Forecast and apply', p: [
      'Produce multi-horizon forecasts for generation scheduling or home energy management.',
    ] },
  ],
  steps: [
    { h: 'Engineer features and forecast', p: [
      'Build features from past load, forecast weather and calendar (no look-ahead) and predict future demand.',
    ], code: {
      file: 'forecast.py', lang: 'python',
      body: `import numpy as np

def features(load, weather_fc, ts):
    return np.array([
        load[ts-1], load[ts-24], load[ts-168],       # daily + weekly cycles
        rolling_mean(load, ts, 24),                    # recent level
        weather_fc[ts],                                # FORECAST temperature
        hour_of_day(ts), day_of_week(ts), is_holiday(ts),   # calendar
    ])

def forecast(model, load, weather_fc, ts):
    return float(model.predict([features(load, weather_fc, ts)])[0])`,
      explain: [
        { ref: 'load[ts-1], load[ts-24], load[ts-168],       # daily + weekly cycles', txt: 'Lags at 1 hour, 24 hours and 168 hours capture the strong daily and weekly periodicity that makes demand predictable.' },
        { ref: 'weather_fc[ts],                                # FORECAST temperature', txt: 'Forecast temperature — the dominant driver via heating/cooling — is a key input, and its uncertainty flows into the load forecast.' },
        { ref: 'hour_of_day(ts), day_of_week(ts), is_holiday(ts),   # calendar', txt: 'Calendar features capture working hours, weekends and holidays, which strongly shape demand.' },
        { ref: 'return float(model.predict([features(load, weather_fc, ts)])[0])', txt: 'With real, strong drivers as inputs, the model produces genuinely accurate demand forecasts — the reassuring contrast with market prediction.' },
      ],
    } },
    { h: 'Backtest honestly and use the forecast', p: [
      'Validate on out-of-time periods with no look-ahead, then use the forecasts for scheduling or energy management.',
    ], tip: 'Feed forecast weather, not actual weather, at prediction time when backtesting — using perfect future weather flatters the model and hides that real accuracy depends on the weather forecast.' },
  ],

  code: [{
    file: 'energy_forecaster.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Energy Demand Forecaster

Predicts electricity demand from strong, LEARNABLE drivers: periodicity
(daily/weekly/seasonal), weather (temperature), and calendar. Same
time-series rigor as any forecasting (time-aware splits, NO look-ahead)
— but here the signal is REAL, so rigor is rewarded with accurate,
useful forecasts. Accuracy inherits weather-forecast uncertainty.
"""
import numpy as np

class EnergyForecaster:
    def __init__(self, model):
        self.model = model

    def features(self, load, weather_fc, ts):
        # PAST load + FORECAST weather + calendar — never future load
        return np.array([
            load[ts-1], load[ts-24], load[ts-168],      # daily + weekly lags
            np.mean(load[ts-24:ts]),                      # recent level
            weather_fc[ts],                               # forecast temperature
            ts % 24, (ts // 24) % 7, is_holiday(ts),      # hour/dow/holiday
        ])

    def train(self, load, weather, split_ts):
        X = np.array([self.features(load, weather, t)
                      for t in range(168, split_ts)])     # train on PAST only
        y = np.array([load[t] for t in range(168, split_ts)])
        self.model.fit(X, y)

    def forecast(self, load, weather_fc, ts):
        return float(self.model.predict([self.features(load, weather_fc, ts)])[0])

    def backtest(self, load, weather_fc, start, end):
        # out-of-time, forecast weather, no look-ahead
        errs = [abs(self.forecast(load, weather_fc, t) - load[t]) / load[t]
                for t in range(start, end)]
        return {"MAPE": round(100 * float(np.mean(errs)), 2)}   # genuinely low

if __name__ == "__main__":
    f = EnergyForecaster(GradientBoosting())
    f.train(LOAD, WEATHER, split_ts=SPLIT)
    print(f.backtest(LOAD, WEATHER_FC, SPLIT, len(LOAD)))
    # Real signal -> useful accuracy; anomalies + weather-fc error cause misses.`,
    explain: [
      { ref: 'load[ts-1], load[ts-24], load[ts-168],      # daily + weekly lags', txt: 'The lag features encode the strong daily and weekly periodicity — the backbone of demand predictability.' },
      { ref: 'weather_fc[ts],                               # forecast temperature', txt: 'Forecast temperature drives heating/cooling load; using forecast (not actual) weather keeps the backtest honest.' },
      { ref: 'for t in range(168, split_ts)])     # train on PAST only', txt: 'Training uses only past data up to the split, respecting time — the same discipline as any forecasting.' },
      { ref: 'return {"MAPE": round(100 * float(np.mean(errs)), 2)}   # genuinely low', txt: 'Because the signal is real, out-of-time error is genuinely low — the encouraging contrast with the stock forecaster.' },
      { ref: '# Real signal -> useful accuracy; anomalies + weather-fc error cause misses.', txt: 'The honest limits — anomalies and weather-forecast dependence — are stated, but within a genuinely working system.' },
    ],
  }],

  config: [
    'Configure load, weather and calendar data alignment.',
    'Configure features (lags/rolling/weather/calendar) and horizons.',
    'Configure the model (classical/boosting/LSTM).',
    'Configure time-aware backtesting with forecast weather.',
  ],
  calibration: [
    { h: 'Features', p: [
      'Verify periodicity, weather and calendar features capture demand structure.',
    ] },
    { h: 'Backtest realism', p: [
      'Use forecast weather and time-aware splits; report out-of-time error.',
    ] },
    { h: 'Horizon', p: [
      'Assess accuracy across horizons; longer is harder.',
    ] },
  ],
  testing: [
    { step: 'Forecast a normal weekday', expect: 'Accurate (strong periodic signal)' },
    { step: 'Beat a naive-seasonal baseline', expect: 'Real skill (unlike stocks)' },
    { step: 'Forecast across a heatwave', expect: 'Weather-driven demand captured (if weather-fc good)' },
    { step: 'Forecast a holiday', expect: 'Calendar effect handled' },
    { step: 'Long horizon', expect: 'Less accurate — expected' },
    { step: 'Backtest with actual vs forecast weather', expect: 'Forecast weather is the honest test' },
  ],
  output: [
    'Accurate multi-horizon demand forecasts for scheduling and energy management.',
    { file: 'demand-forecast.json', lang: 'json', body: `{
  "horizon": "day-ahead",
  "MAPE_pct": 3.4,
  "peak_hour": 19,
  "drivers": ["daily/weekly periodicity", "forecast temperature", "weekday"],
  "note": "genuinely predictable — rigor rewarded with accuracy"
}` },
    'A day-ahead forecast with low error (3.4% MAPE), capturing the evening peak from periodicity and forecast temperature — the reassuring proof that good time-series practice on a real signal yields useful predictions.',
  ],
  troubleshoot: [
    { sym: 'Poor accuracy', cause: 'Missing drivers', fix: 'Add weather (temp), calendar, proper lags' },
    { sym: 'Great backtest, worse live', cause: 'Used actual not forecast weather', fix: 'Backtest with forecast weather; no look-ahead' },
    { sym: 'Misses peaks', cause: 'Weak periodicity/weather features', fix: 'Add daily/weekly lags and temperature' },
    { sym: 'Bad on anomalies', cause: 'Unusual weather/events', fix: 'Expected; add event flags where possible' },
    { sym: 'Degrades with horizon', cause: 'Longer = harder', fix: 'Expected; separate models per horizon' },
    { sym: 'Look-ahead leakage', cause: 'Future info in features', fix: 'Use only past load; forecast weather' },
  ],

  perf: [
    'Engineer strong periodic/weather/calendar features.',
    'Use forecast weather; backtest time-aware with no look-ahead.',
    'Model per horizon; short horizons are most accurate.',
    'Beat a naive-seasonal baseline (real skill is achievable).',
  ],
  safety: [
    'Forecasts are not perfect — plan reserve/margins for anomalies and forecast error.',
    'Accuracy depends on weather-forecast quality — propagate that uncertainty.',
    'Use honest, time-aware evaluation; do not flatter with actual future weather.',
    'For grid operations, treat forecasts as decision support with appropriate safety margins.',
  ],
  maintenance: [
    'Retrain as consumption patterns and infrastructure change.',
    'Update weather/calendar inputs and event handling.',
    'Monitor error over time and by horizon.',
    'Recheck for leakage after feature changes.',
  ],
  future: [
    'Add probabilistic forecasts (uncertainty intervals).',
    'Add renewable-generation forecasting for net-load.',
    'Add per-appliance/home disaggregation.',
    'Add price-responsive and demand-response modelling.',
  ],
  faq: [
    { q: 'Why is energy demand predictable when the stock market isn\'t?', a: 'Because demand is driven by real, stable, physical and human patterns — strong daily/weekly/seasonal cycles, temperature-driven heating and cooling, and calendar effects — whereas markets are efficient and near-random short-term. The same time-series toolkit yields accurate forecasts here because the signal genuinely exists.' },
    { q: 'What are the main drivers to model?', a: 'Periodicity (daily peaks, weekday/weekend, seasons), weather (temperature above all, via heating/cooling), and calendar (holidays, working hours). Lagged demand plus these drivers is the core of an accurate model.' },
    { q: 'Why use forecast weather, not actual?', a: 'Because at prediction time you only have a weather forecast, not the actual future weather. Backtesting with actual weather flatters the model and hides that real accuracy depends on — and inherits the uncertainty of — the weather forecast.' },
    { q: 'What causes forecast errors?', a: 'Anomalies the patterns do not cover: unusual weather, special events (a major broadcast, an unexpected shutdown), and gradual behaviour change — plus the weather-forecast uncertainty and the general difficulty of longer horizons.' },
    { q: 'Why does this matter for the grid?', a: 'Because electricity must be balanced in real time and is costly to store, accurate demand forecasts let operators schedule generation efficiently (less wasteful reserve, lower cost and emissions) and integrate variable renewables better — and enable smart home/building energy management.' },
  ],
  refs: [
    { t: 'Electrical load forecasting', u: 'https://en.wikipedia.org/wiki/Load_forecasting', s: 'Reference' },
    { t: 'Time series forecasting', u: 'https://en.wikipedia.org/wiki/Time_series', s: 'Reference' },
    { t: 'Demand response / grid balancing', u: 'https://en.wikipedia.org/wiki/Demand_response', s: 'Reference' },
    { t: 'Weather and energy demand', u: 'https://en.wikipedia.org/wiki/Heating_degree_day', s: 'Reference' },
    { t: 'LSTM / gradient boosting', u: 'https://en.wikipedia.org/wiki/Long_short-term_memory', s: 'Reference' },
  ],
  images: ['neural', 'city', 'grafana'],
  imageCaptions: [
    'An energy demand forecaster predicts electricity load — a time-series problem that, unlike markets, genuinely is predictable.',
    'Strong daily/weekly/seasonal periodicity plus weather and calendar drivers make demand accurately forecastable.',
    'The same rigor as any forecasting — but here the real signal rewards it with accurate, useful predictions.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A21 — Fraud Detection Model
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A21',
  domainKey: 'ai',
  emoji: '🛡️', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Flags suspicious transactions in real time with anomaly detection — where fraud is rare, so the class imbalance and the cost of errors define everything.',
  platformName: 'CPU/GPU workstation or server',
  ide: 'Python 3.11 + ML (imbalanced classification)',

  overview: [
    'Fraud detection — spotting the tiny fraction of transactions that are criminal among the vast majority that are legitimate — is one of the highest-value applications of machine learning, protecting payments, banking and commerce. This project builds a model that <b>flags suspicious transactions in real time</b>. But its defining lesson is not the algorithm; it is that fraud detection is dominated by a single brutal fact — <b>fraud is extremely rare</b> — which reshapes how you build, train and, above all, <b>evaluate</b> the model.',
    'That rarity — a severe <b>class imbalance</b>, often well under 1% of transactions are fraud — breaks the naïve approach. A model that simply predicts "not fraud" for everything achieves >99% <b>accuracy</b> while catching <i>zero</i> fraud, which is why <b>accuracy is a worse-than-useless metric here</b>. The project is really about the techniques that actually work under imbalance: choosing the right <b>metrics</b> (precision, recall, and their trade-off), handling imbalance (resampling, class weighting, <b>anomaly detection</b> that models "normal" and flags deviations), and engineering features that expose fraud patterns.',
    'The value is real-time protection, and the honesty is about the <b>cost of errors</b>, which is asymmetric and business-critical. A <b>false negative</b> (missed fraud) means money lost; a <b>false positive</b> (a legitimate transaction wrongly flagged) means a blocked payment and an angry customer — and there are <i>far</i> more legitimate transactions, so even a low false-positive <i>rate</i> produces a flood of false alarms. So the whole game is tuning the <b>precision/recall trade-off</b> to the business\'s costs, not chasing accuracy. It is also honest that fraud <b>adapts</b> (an adversarial, drifting target requiring constant retraining), that decisions affecting people need care and often human review, and that labels are noisy. Built with imbalance-aware methods and cost-driven evaluation, it is both a genuinely valuable system and the definitive lesson in machine learning where the classes are rare and the errors are not equal.',
  ],
  does: [
    'Flags suspicious transactions in real time',
    'Handles severe class imbalance (fraud is rare)',
    'Uses anomaly detection / imbalance-aware methods',
    'Evaluates with precision/recall, not accuracy',
    'Tunes the precision/recall trade-off to error costs',
    'Engineers features that expose fraud patterns',
    'Supports human review of flagged cases',
  ],
  features: [
    'Imbalanced-classification / anomaly detection',
    'Precision/recall (not accuracy) evaluation',
    'Resampling / class weighting',
    'Cost-aware threshold tuning',
    'Real-time scoring',
    'Retraining for adaptive fraud',
    'Honest about false-positive floods and adversarial drift',
  ],
  applications: [
    { t: 'Payment / card fraud', d: 'Real-time transaction risk scoring.' },
    { t: 'Banking / account fraud', d: 'Detecting anomalous account activity.' },
    { t: 'E-commerce', d: 'Flagging suspicious orders.' },
    { t: 'Imbalanced-ML learning', d: 'Rare-event detection done right.' },
  ],
  skills: [
    'Imbalanced classification and anomaly detection',
    'Precision/recall and cost-aware evaluation',
    'Resampling / class weighting',
    'Threshold tuning to business costs',
    'Handling adversarial drift and retraining',
  ],
  prereq: [
    'Fraud is rare — accuracy is worse than useless; use precision/recall.',
    'Handle severe imbalance (resampling/weighting/anomaly detection).',
    'Errors are asymmetric and unequal in count — false positives flood.',
    'Fraud adapts — an adversarial, drifting target needing retraining.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute', spec: 'CPU/GPU for training and real-time scoring', qty: 1, price: 0 },
    { name: 'ML libraries', spec: 'Imbalanced-learning / anomaly detection', qty: 1, price: 0 },
    { name: 'Transaction data', spec: 'Labelled transactions (very imbalanced)', qty: 1, price: 0, note: 'Fraud is rare' },
    { name: 'Review workflow', spec: 'Human review of flagged cases', qty: 1, price: 0, note: 'Decisions affect people' },
  ],
  cost: 'Software; compute-light to moderate',
  libs: ['python', 'sklearn', 'pandas', 'numpy'],
  hardwareNotes: [
    'This is a pure-software ML system — no electronic hardware to specify. The "platform" is a computer: a CPU handles most models and real-time scoring; a GPU helps for large-scale training.',
    'Memory scales with transaction volume and features; a real deployment adds a low-latency scoring service, a labelled-data pipeline, and a human-review queue. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the detection data flow — a transaction is scored in real time by an imbalance-aware model; a cost-tuned threshold decides whether to flag it for action or review.',
  pins: {
    left: [
      { dev: 'Transaction', devPin: 'features', pin: '—', sig: 'Risk signals' },
      { dev: 'Model', devPin: 'score', pin: '—', sig: 'Fraud probability' },
    ],
    right: [
      { dev: 'Threshold (cost-tuned)', devPin: 'decide', pin: '—', sig: 'Flag / allow' },
      { dev: 'Review / action', devPin: 'human', pin: '—', sig: 'Block/confirm' },
    ],
  },
  wiringNotes: [
    'Engineer features that expose fraud patterns (amount, velocity, location, history).',
    'Score each transaction with an imbalance-aware / anomaly-detection model.',
    'Apply a threshold tuned to error costs (not accuracy).',
    'Flag suspicious transactions for action and/or human review.',
    'Retrain regularly — fraud adapts.',
  ],

  block: { columns: [
    { label: 'Transaction', edge: 'right', blocks: [
      { name: 'Features', sub: 'signals', highlight: true },
    ] },
    { label: 'Score', edge: 'right', blocks: [
      { name: 'Model', sub: 'imbalance-aware', highlight: true },
      { name: 'Fraud prob', sub: 'risk' },
    ] },
    { label: 'Decide', edge: 'right', blocks: [
      { name: 'Threshold', sub: 'cost-tuned', highlight: true },
      { name: 'Precision/recall', sub: 'trade-off' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Flag', sub: 'review/block' },
      { name: 'Retrain', sub: 'adapts' },
    ] },
  ] },
  flow: [
    { t: 'Transaction arrives', k: 'start' },
    { t: 'Engineer features / score', k: 'proc' },
    { t: 'Score above cost-tuned threshold?', k: 'dec', yes: 'Flag (review/block)', no: 'Allow' },
    { t: 'Flag (review/block)', k: 'io' },
    { t: 'Allow', k: 'io' },
    { t: 'Human review where needed', k: 'proc' },
    { t: 'Feed back + retrain (fraud adapts)', k: 'end', back: 'Transaction arrives' },
  ],

  principle: [
    'Fraud detection looks like a classification problem — label each transaction fraud or not — but it is dominated by one property that changes everything: <b>fraud is extremely rare</b>. In real data, the fraudulent fraction is often well under 1%, sometimes a fraction of that. This <b>severe class imbalance</b> is not a detail to handle at the end; it is the central fact that dictates how you train, what algorithms work, and — most importantly — how you must <b>measure</b> the model. Internalising that is the whole point of the project.',
    'The first casualty of imbalance is the metric everyone reaches for: <b>accuracy is worthless here, actively misleading</b>. A model that predicts "not fraud" for <i>every</i> transaction is >99% accurate and catches <b>zero</b> fraud — a perfect illustration of why accuracy on imbalanced data is meaningless. The right metrics are <b>precision</b> (of the transactions we flagged, how many were truly fraud?) and <b>recall</b> (of all the fraud, how much did we catch?), along with their trade-off (the precision-recall curve). These directly express what the business cares about, and they are the only honest way to judge a rare-event detector.',
    'The techniques that <i>work</i> under imbalance follow from taking it seriously. You can <b>resample</b> (oversample fraud or undersample legitimate transactions to rebalance training), use <b>class weighting</b> (penalise missing the rare class more heavily), or frame it as <b>anomaly detection</b> — model what "normal" transactions look like and flag those that deviate, which is natural when fraud is rare and varied. Alongside, <b>feature engineering</b> exposes fraud signatures: transaction amount and its unusualness for this customer, <b>velocity</b> (many transactions in a short time), location/device anomalies, and deviation from the customer\'s history. Good features often matter more than the choice of model.',
    'The deepest lesson, and where the honesty lives, is the <b>asymmetric and unequal cost of errors</b>. A <b>false negative</b> — missed fraud — costs money directly. A <b>false positive</b> — a legitimate transaction wrongly declined — costs a blocked payment, a frustrated customer, and support burden. These costs are <i>different</i>, and crucially there are <b>vastly more legitimate transactions than fraud</b>, so even a <b>low false-positive rate produces a large absolute number of false alarms</b> that can swamp a review team and anger real customers. The entire operational challenge is therefore <b>tuning the decision threshold to the business\'s cost trade-off</b> — how much recall (caught fraud) you buy at the price of how much precision (false alarms) — not maximising some single accuracy number. Three further honest realities complete the picture: fraud is <b>adversarial and drifting</b> (fraudsters actively adapt to evade detection, so the target moves and models must be <b>retrained continually</b>); decisions <b>affect real people</b> (a wrongful decline or accusation has consequences), so serious deployments keep <b>human review</b> in the loop and watch for bias; and <b>labels are noisy</b> (some fraud is never discovered, some flags are wrong). Built with imbalance-aware methods, precision/recall-and-cost-driven evaluation, and a threshold tuned to real error costs, the model delivers genuine value — real-time protection — while teaching the essential discipline of machine learning when the thing you\'re hunting is rare and the mistakes are not created equal.',
  ],
  equations: [
    { t: 'Why accuracy fails', eq: 'fraud ≈ 0.2% of transactions\n"predict not-fraud always" → 99.8% accuracy, 0 fraud caught\n\n→ ACCURACY IS MEANINGLESS on imbalanced data.' },
    { t: 'The right metrics', eq: 'precision = TP / (TP + FP)   # of flags, how many are real fraud\nrecall    = TP / (TP + FN)   # of all fraud, how much we catch\n\nTune the precision/recall trade-off (PR curve) to the business.' },
    { t: 'Cost-tuned threshold (the real game)', eq: 'flag if fraud_score ≥ threshold\n\nfalse negative (miss)  → money lost\nfalse positive (false alarm) → blocked payment + angry customer\n  and legit ≫ fraud → low FP RATE still = MANY false alarms\n\nchoose threshold by expected COST, not accuracy.' },
  ],

  ai: {
    task: 'Detect rare fraudulent transactions in real time with imbalance-aware / anomaly-detection methods, evaluated by precision/recall and a cost-tuned threshold, with retraining for adaptive fraud.',
    dataset: [
      'Highly imbalanced labelled transactions (fraud ≪ legitimate). Labels are noisy (undiscovered fraud, wrong flags).',
      'Feature engineering (amount, velocity, history deviation) often matters more than model choice.',
    ],
    datasetTable: [
      { n: 'Labelled transactions', size: 'Large, ≪1% fraud', lic: 'Sensitive/regulated', use: 'Train/evaluate (imbalanced)' },
      { n: 'Engineered features', size: 'Derived', lic: '—', use: 'Amount/velocity/history signals' },
      { n: 'Held-out (time-aware) test', size: 'Future period', lic: '—', use: 'Honest, drift-aware evaluation' },
      { n: 'Review outcomes', size: 'Growing', lic: 'Sensitive', use: 'Feedback / retraining labels' },
    ],
    preprocess: [
      'Engineer fraud-relevant features (amount, velocity, location/device, history deviation).',
      'Handle imbalance: resampling, class weighting, or anomaly-detection framing.',
      'Split time-aware (fraud drifts); avoid leakage.',
    ],
    pipeline: [
      { name: 'Transaction', sub: 'features', highlight: true },
      { name: 'Imbalance handling', sub: 'resample/weight' },
      { name: 'Model / anomaly', sub: 'score', highlight: true },
      { name: 'Threshold', sub: 'cost-tuned' },
      { name: 'Flag + review', sub: 'act' },
    ],
    archTable: [
      { l: 'Feature engineering', s: 'amount/velocity/history', p: 'Expose fraud patterns' },
      { l: 'Imbalance handling', s: 'resample / class weight', p: 'Learn the rare class' },
      { l: 'Model', s: 'classifier / anomaly detector', p: 'Score fraud risk' },
      { l: 'Threshold', s: 'cost-tuned (PR trade-off)', p: 'Business-optimal flags' },
      { l: 'Retraining', s: 'ongoing', p: 'Adapt to drifting fraud' },
    ],
    hyper: [
      { k: 'Class weight / sampling', v: 'tuned', w: 'Learn rare fraud' },
      { k: 'Decision threshold', v: 'cost-tuned', w: 'Precision vs recall' },
      { k: 'Feature set', v: 'rich', w: 'Often > model choice' },
      { k: 'Retrain cadence', v: 'frequent', w: 'Adversarial drift' },
    ],
    training: [
      'Handle imbalance (resample/weight or anomaly detection); engineer strong features.',
      'Evaluate with precision/recall and PR curves — never accuracy.',
      'Split time-aware; plan continual retraining as fraud adapts.',
    ],
    metricsIntro: [
      'The honest metrics are precision, recall and their trade-off at a cost-tuned threshold — accuracy is meaningless under this imbalance.',
    ],
    metrics: [
      { m: 'Precision', v: 'cost-tuned', d: 'False-alarm control' },
      { m: 'Recall', v: 'cost-tuned', d: 'Fraud caught' },
      { m: 'PR-AUC', v: 'primary', d: 'Imbalance-appropriate' },
      { m: 'Accuracy', v: 'IGNORE', d: 'Misleading here' },
    ],
    chart: { title: 'Precision vs recall trade-off', unit: '%', desc: 'Catching more fraud (recall) costs precision (more false alarms); the threshold is tuned to business error costs, not accuracy (illustrative).', bars: [
      { label: 'High-precision setting', value: 92 },
      { label: 'Balanced', value: 78 },
      { label: 'High-recall setting', value: 60 },
      { label: 'Accuracy (misleading)', value: 99 },
    ] },
    inference: { file: 'fraud.py', lang: 'python', body: `def score(transaction, model, features):
    x = features(transaction)                # amount/velocity/history deviation
    return float(model.predict_proba([x])[0][1])   # fraud probability

def decide(transaction, model, features, threshold):
    # threshold is TUNED TO COST, not accuracy.
    p = score(transaction, model, features)
    if p >= threshold:
        return {"action": "flag", "fraud_score": round(p, 3),
                "route": "human_review"}     # decisions affect people
    return {"action": "allow", "fraud_score": round(p, 3)}
    # Legit >> fraud: even a low FP RATE = many false alarms. Retrain often.` },
    limits: [
      'Accuracy is meaningless — use precision/recall and cost-tuned thresholds.',
      'Legit ≫ fraud, so even low false-positive rates flood review with false alarms.',
      'Fraud is adversarial and drifts — constant retraining needed.',
      'Decisions affect people; keep human review and watch for bias.',
    ],
  },

  assembly: [
    { h: 'Engineer features and handle imbalance', p: [
      'Engineer fraud-relevant features and handle the severe imbalance (resampling, class weighting, or anomaly detection).',
    ], warn: 'Fraud is rare, so accuracy is worthless — a "never fraud" model is >99% accurate and catches nothing. Evaluate with precision/recall, and remember there are far more legitimate transactions than fraud, so even a low false-positive rate produces a flood of false alarms and angry customers.' },
    { h: 'Score and tune the threshold to cost', p: [
      'Score transactions and set the decision threshold by the business cost trade-off between missed fraud and false alarms.',
    ] },
    { h: 'Review, feed back and retrain', p: [
      'Route flags to human review where needed, and retrain regularly because fraud adapts.',
    ] },
  ],
  steps: [
    { h: 'Score and decide with a cost-tuned threshold', p: [
      'Score each transaction\'s fraud probability and flag it against a threshold tuned to error costs, routing to review.',
    ], code: {
      file: 'fraud.py', lang: 'python',
      body: `def score(txn, model, features):
    return float(model.predict_proba([features(txn)])[0][1])   # fraud probability

def decide(txn, model, features, threshold):
    # threshold TUNED TO COST (precision/recall), NOT accuracy
    p = score(txn, model, features)
    if p >= threshold:
        return {"action": "flag", "score": round(p, 3), "route": "review"}  # people-affecting
    return {"action": "allow", "score": round(p, 3)}`,
      explain: [
        { ref: 'return float(model.predict_proba([features(txn)])[0][1])   # fraud probability', txt: 'The model outputs a fraud probability from engineered features — a score, not a hard label, so the threshold can be tuned.' },
        { ref: '# threshold TUNED TO COST (precision/recall), NOT accuracy', txt: 'The decision threshold is set by the business cost trade-off between missed fraud and false alarms — the real operational lever.' },
        { ref: 'return {"action": "flag", "score": round(p, 3), "route": "review"}  # people-affecting', txt: 'Flags route to human review because these decisions affect real people — a wrongful decline has consequences.' },
      ],
    } },
    { h: 'Manage false-alarm volume and drift', p: [
      'Tune to keep false-alarm volume manageable for the review team, and retrain regularly as fraud patterns adapt.',
    ], tip: 'Think in absolute numbers, not rates: with legit transactions vastly outnumbering fraud, a 1% false-positive rate can bury a review team. Tune the threshold to the false-alarm volume the business can actually handle.' },
  ],

  code: [{
    file: 'fraud_detection.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Fraud Detection Model

Flags rare fraudulent transactions in real time. The defining fact is
IMBALANCE (fraud is very rare), which makes ACCURACY MEANINGLESS. Use
precision/recall, handle imbalance (resample/weight/anomaly detection),
and TUNE THE THRESHOLD TO ERROR COSTS. Fraud adapts -> retrain; decisions
affect people -> human review.
"""
class FraudDetector:
    def __init__(self, model, features, threshold):
        self.model = model; self.features = features
        self.threshold = threshold          # cost-tuned, NOT accuracy-tuned

    def score(self, txn):
        return float(self.model.predict_proba([self.features(txn)])[0][1])

    def decide(self, txn):
        p = self.score(txn)
        if p >= self.threshold:
            return {"action": "flag", "score": round(p, 3), "route": "human_review"}
        return {"action": "allow", "score": round(p, 3)}

    @staticmethod
    def evaluate(y_true, y_prob, threshold):
        pred = [1 if p >= threshold else 0 for p in y_prob]
        tp = sum(t and p for t, p in zip(y_true, pred))
        fp = sum((not t) and p for t, p in zip(y_true, pred))
        fn = sum(t and (not p) for t, p in zip(y_true, pred))
        return {                              # NOT accuracy
            "precision": tp / (tp + fp + 1e-9),   # false-alarm control
            "recall":    tp / (tp + fn + 1e-9),   # fraud caught
            "false_alarms_abs": fp,               # legit >> fraud -> watch this
        }

if __name__ == "__main__":
    det = FraudDetector(trained_model, make_features, threshold=0.7)
    print(FraudDetector.evaluate(Y_TEST, PROBS, threshold=0.7))
    # Tune threshold to cost; retrain as fraud drifts; keep humans in the loop.`,
    explain: [
      { ref: 'self.threshold = threshold          # cost-tuned, NOT accuracy-tuned', txt: 'The threshold is the core control, set by error costs rather than accuracy — the operational heart of fraud detection.' },
      { ref: 'return {"action": "flag", "score": round(p, 3), "route": "human_review"}', txt: 'Flagged transactions go to human review, because these are people-affecting decisions that should not be fully automated.' },
      { ref: 'return {                              # NOT accuracy', txt: 'Evaluation deliberately reports precision/recall and false-alarm counts, never accuracy, which is meaningless under imbalance.' },
      { ref: '"false_alarms_abs": fp,               # legit >> fraud -> watch this', txt: 'The absolute false-alarm count is tracked because, with legit transactions vastly outnumbering fraud, even a low rate floods the review team.' },
    ],
  }],

  config: [
    'Configure fraud-relevant features and imbalance handling.',
    'Configure the model / anomaly detector.',
    'Configure the decision threshold to error costs (precision/recall).',
    'Configure review routing and retraining cadence.',
  ],
  calibration: [
    { h: 'Metrics', p: [
      'Evaluate with precision/recall and PR curves; never accuracy.',
    ] },
    { h: 'Threshold', p: [
      'Tune to the business cost trade-off and the false-alarm volume review can handle.',
    ] },
    { h: 'Drift', p: [
      'Monitor for adversarial drift; retrain regularly.',
    ] },
  ],
  testing: [
    { step: 'Baseline "never fraud"', expect: '>99% accuracy, 0 recall — shows accuracy is useless' },
    { step: 'Evaluate precision/recall', expect: 'Meaningful assessment' },
    { step: 'Lower the threshold', expect: 'More recall, more false alarms' },
    { step: 'Count absolute false alarms', expect: 'Large even at low FP rate (legit ≫ fraud)' },
    { step: 'Simulate fraud drift', expect: 'Performance decays — retrain' },
    { step: 'Flagged case', expect: 'Routed to human review' },
  ],
  output: [
    'Real-time fraud flags with precision/recall-based evaluation and cost-tuned thresholds, routed to review.',
    { file: 'fraud-eval.json', lang: 'json', body: `{
  "precision": 0.82,
  "recall": 0.64,
  "false_alarms_abs": 1240,
  "accuracy": "ignored (meaningless here)",
  "threshold": 0.70,
  "note": "tune to cost; legit >> fraud floods false alarms; fraud adapts"
}` },
    'An honest evaluation: precision and recall (not accuracy), with the absolute false-alarm count front and centre — because even a good rate produces many false alarms when legitimate transactions vastly outnumber fraud.',
  ],
  troubleshoot: [
    { sym: 'High accuracy, catches no fraud', cause: 'Imbalance + wrong metric', fix: 'Ignore accuracy; use precision/recall; handle imbalance' },
    { sym: 'Too many false alarms', cause: 'Threshold too low / weak features', fix: 'Raise threshold to cost; better features' },
    { sym: 'Misses too much fraud', cause: 'Threshold too high / imbalance', fix: 'Lower threshold; resample/weight; anomaly detection' },
    { sym: 'Degrades over time', cause: 'Adversarial drift', fix: 'Retrain regularly; monitor drift' },
    { sym: 'Unfair/biased decisions', cause: 'Data/proxies', fix: 'Audit fairness; human review; mitigate bias' },
    { sym: 'Leakage inflates results', cause: 'Non-time-aware split', fix: 'Time-aware split; avoid future info' },
  ],

  perf: [
    'Never use accuracy — evaluate precision/recall and PR curves.',
    'Handle imbalance (resample/weight/anomaly detection).',
    'Tune the threshold to error costs and false-alarm volume.',
    'Retrain regularly for adversarial drift; engineer strong features.',
  ],
  safety: [
    'Decisions affect people — keep human review for flagged cases; a wrongful decline has consequences.',
    'Watch for and mitigate bias; audit fairness of decisions.',
    'Transaction data is sensitive/regulated — secure and handle it lawfully.',
    'Fraud adapts — do not treat a static model as reliable; monitor and retrain.',
  ],
  maintenance: [
    'Retrain frequently as fraud patterns drift.',
    'Monitor precision/recall and false-alarm volume in production.',
    'Refresh features and feedback labels from review outcomes.',
    'Audit fairness and data handling.',
  ],
  future: [
    'Add graph/network features (fraud rings).',
    'Add real-time streaming and adaptive thresholds.',
    'Add explainability for review and appeals.',
    'Add active learning from review outcomes.',
  ],
  faq: [
    { q: 'Why is accuracy the wrong metric?', a: 'Because fraud is extremely rare. A model that predicts "not fraud" for everything is over 99% accurate yet catches zero fraud. Under severe imbalance, accuracy is actively misleading — you must use precision (are flags real?) and recall (is fraud caught?) instead.' },
    { q: 'How do you handle the imbalance?', a: 'By taking it seriously: resampling (over/under-sampling), class weighting (penalise missing the rare class), or framing it as anomaly detection (model "normal", flag deviations) — combined with features that expose fraud patterns, which often matter more than the model.' },
    { q: 'Why do false positives matter so much?', a: 'Because legitimate transactions vastly outnumber fraud, so even a low false-positive rate produces a large absolute number of false alarms — blocked payments, angry customers, and a swamped review team. Managing false-alarm volume is central.' },
    { q: 'What decides the threshold?', a: 'The business cost trade-off: how much fraud you catch (recall) versus how many false alarms you cause (precision), tuned to the actual costs of a missed fraud versus a wrongful decline — not to any accuracy figure.' },
    { q: 'Why must it be retrained?', a: 'Because fraud is adversarial — fraudsters actively adapt to evade detection — so the target drifts and a static model decays. Continual retraining and drift monitoring are required, and serious deployments keep humans in the loop.' },
  ],
  refs: [
    { t: 'Fraud detection', u: 'https://en.wikipedia.org/wiki/Data_analysis_techniques_for_fraud_detection', s: 'Reference' },
    { t: 'Class imbalance problem', u: 'https://en.wikipedia.org/wiki/Oversampling_and_undersampling_in_data_analysis', s: 'Reference' },
    { t: 'Precision and recall', u: 'https://en.wikipedia.org/wiki/Precision_and_recall', s: 'Reference' },
    { t: 'Anomaly detection', u: 'https://en.wikipedia.org/wiki/Anomaly_detection', s: 'Reference' },
    { t: 'Accuracy paradox', u: 'https://en.wikipedia.org/wiki/Accuracy_paradox', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'grafana'],
  imageCaptions: [
    'A fraud detection model flags the rare criminal transactions among a flood of legitimate ones in real time.',
    'Fraud is rare, so accuracy is meaningless — precision, recall and a cost-tuned threshold define the model.',
    'Legitimate transactions vastly outnumber fraud, so even a low false-positive rate floods review with false alarms.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A22 — Recommendation Engine
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A22',
  domainKey: 'ai',
  emoji: '🎯', thumb: 'chip',
  difficulty: 'Intermediate',
  hours: '12–18 hours', iso8601: 'PT16H',
  tagline: 'Personalizes content and products with collaborative filtering — "people like you liked this" — the engine behind modern discovery.',
  platformName: 'CPU/GPU workstation or server',
  ide: 'Python 3.11 + recommender ML',

  overview: [
    'Recommendation engines quietly shape a huge part of digital life — the films suggested, the products shown, the posts surfaced — by predicting what each person will like from the behaviour of many. This project builds one using <b>collaborative filtering</b>, the classic and powerful idea behind most recommenders: <b>"people who liked what you liked also liked this"</b>. It personalizes content or products by learning patterns across users\' interactions, without needing to understand the items themselves.',
    'The core insight of <b>collaborative filtering</b> is that you can recommend well using only the <b>matrix of user–item interactions</b> (ratings, clicks, purchases) — no knowledge of what the items <i>are</i>. If your tastes overlap strongly with another user\'s, things they liked that you haven\'t seen are good recommendations for you. Modern versions use <b>matrix factorisation</b>: decompose the sparse interaction matrix into <b>latent factors</b> — compact vectors for each user and item — such that a user\'s predicted preference for an item is their vectors\' similarity. These learned factors capture hidden taste dimensions (a "sci-fi-ness", an "arthouse-ness") automatically, purely from behaviour.',
    'The value is personalization at scale — better discovery, engagement and sales. It is honest about the well-known hard problems every recommender faces: the <b>cold-start</b> problem (you cannot collaboratively recommend to a brand-new user or a brand-new item with no interactions), <b>sparsity</b> (most users rate very few items), <b>popularity bias</b> (popular items get over-recommended, the long tail ignored), and the societal concerns of <b>filter bubbles and echo chambers</b> (over-personalization narrows what people see). It is also honest that <b>engagement is not the same as genuine value</b>, and recommenders can optimise for the wrong thing. Built with matrix-factorisation collaborative filtering and clear eyes about cold-start, bias and filter bubbles, it is both a genuinely useful personalization engine and the definitive lesson in the recommender systems that shape what billions of people see.',
  ],
  does: [
    'Recommends items personalized to each user',
    'Uses collaborative filtering ("people like you liked…")',
    'Learns from the user–item interaction matrix only',
    'Uses matrix factorisation into latent factors',
    'Captures hidden taste dimensions from behaviour',
    'Powers discovery for content and products',
    'Handles cold-start and bias thoughtfully',
  ],
  features: [
    'Collaborative filtering recommendations',
    'Matrix factorisation (latent factors)',
    'Interaction-only (no item understanding needed)',
    'Top-N personalized recommendations',
    'Cold-start handling (hybrid fallback)',
    'Popularity-bias and diversity awareness',
    'Honest about filter bubbles and engagement traps',
  ],
  applications: [
    { t: 'Content recommendation', d: 'Films, shows, music, articles.' },
    { t: 'Product recommendation', d: 'E-commerce personalization.' },
    { t: 'Discovery / feeds', d: 'Surfacing relevant items.' },
    { t: 'Recommender-systems learning', d: 'Collaborative filtering done right.' },
  ],
  skills: [
    'Collaborative filtering and matrix factorisation',
    'Latent-factor modelling',
    'Top-N recommendation and evaluation',
    'Cold-start and hybrid approaches',
    'Bias, diversity and filter-bubble awareness',
  ],
  prereq: [
    'Collaborative filtering: recommend from user–item interactions alone.',
    'Matrix factorisation learns latent user/item taste vectors from behaviour.',
    'Cold-start: no interactions → collaborative filtering cannot recommend.',
    'Beware popularity bias, filter bubbles, and engagement ≠ value.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute', spec: 'CPU/GPU for factorisation/training', qty: 1, price: 0 },
    { name: 'Recommender libraries', spec: 'Matrix factorisation / collaborative filtering', qty: 1, price: 0 },
    { name: 'Interaction data', spec: 'User–item ratings/clicks/purchases', qty: 1, price: 0, note: 'The core signal' },
    { name: 'Item metadata (for cold-start)', spec: 'Content features for new items/users', qty: 1, price: 0, note: 'Hybrid fallback' },
  ],
  cost: 'Software; compute-light to moderate',
  libs: ['python', 'numpy', 'pandas', 'sklearn'],
  hardwareNotes: [
    'This is a pure-software recommender system — no electronic hardware to specify. The "platform" is a computer: a CPU handles matrix factorisation for moderate catalogues; a GPU accelerates large-scale training.',
    'Memory scales with the number of users × items and factor dimensions; storage holds the interaction matrix and learned factors. A deployment adds an interaction log, a serving layer for top-N recommendations, and metadata for cold-start. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the recommendation data flow — the user–item interaction matrix is factorised into latent vectors; a user\'s vector scored against item vectors yields personalized top-N recommendations.',
  pins: {
    left: [
      { dev: 'Interactions', devPin: 'user×item', pin: '—', sig: 'Ratings/clicks' },
      { dev: 'Matrix factorisation', devPin: 'learn', pin: '—', sig: 'Latent vectors' },
    ],
    right: [
      { dev: 'Score', devPin: 'user·item', pin: '—', sig: 'Predicted preference' },
      { dev: 'Top-N', devPin: 'recommend', pin: '—', sig: 'Personalized list' },
    ],
  },
  wiringNotes: [
    'Collect the user–item interaction matrix (ratings/clicks/purchases).',
    'Factorise it into latent user and item vectors.',
    'Score a user against items by vector similarity for predicted preference.',
    'Recommend the top-N unseen items; handle cold-start with a hybrid fallback.',
    'Watch popularity bias and diversity — do not just recommend the popular.',
  ],

  block: { columns: [
    { label: 'Data', edge: 'right', blocks: [
      { name: 'Interactions', sub: 'user×item', highlight: true },
    ] },
    { label: 'Learn', edge: 'right', blocks: [
      { name: 'Factorise', sub: 'latent vectors', highlight: true },
      { name: 'Taste dims', sub: 'hidden' },
    ] },
    { label: 'Score', edge: 'right', blocks: [
      { name: 'User·item', sub: 'preference', highlight: true },
    ] },
    { label: 'Recommend', edge: 'none', blocks: [
      { name: 'Top-N', sub: 'personalized' },
      { name: 'Cold-start?', sub: 'hybrid' },
    ] },
  ] },
  flow: [
    { t: 'Collect user–item interactions', k: 'start' },
    { t: 'Enough interactions for the user/item?', k: 'dec', yes: 'Factorise → latent vectors', no: 'Cold-start: hybrid/popular fallback' },
    { t: 'Cold-start: hybrid/popular fallback', k: 'io' },
    { t: 'Factorise → latent vectors', k: 'proc' },
    { t: 'Score user vs unseen items', k: 'proc' },
    { t: 'Recommend top-N (with diversity)', k: 'proc' },
    { t: 'Serve recommendations', k: 'end', back: 'Collect user–item interactions' },
  ],

  principle: [
    'The elegant, almost surprising idea at the heart of <b>collaborative filtering</b> is that you can recommend things well <b>without understanding them at all</b>. You do not need to know that a film is a sci-fi thriller or that a product is a running shoe; you only need the <b>matrix of who interacted with what</b> — ratings, clicks, purchases. The core principle is "<b>people who agreed with you in the past will agree with you in the future</b>": if your tastes overlap strongly with another user\'s, the items they liked that you haven\'t seen are excellent recommendations for you. This behaviour-only approach is what made recommenders scale to millions of items no human could catalogue.',
    'Naïve collaborative filtering (find similar users, average their likes) struggles with scale and <b>sparsity</b>, so modern recommenders use <b>matrix factorisation</b>. The insight is to approximate the huge, mostly-empty user–item matrix as the product of two smaller matrices of <b>latent factors</b> — a short vector for each user and each item — chosen so that a user\'s known interactions are reconstructed by the <b>dot product</b> of their vector with the item vectors. Once learned, a user\'s <b>predicted preference</b> for any item is just that similarity, so you can score every unseen item and recommend the top ones. Remarkably, the learned latent factors <b>discover hidden taste dimensions on their own</b> — one factor might implicitly capture "action-vs-arthouse", another "mainstream-vs-niche" — purely from interaction patterns, never told what the items are. That automatic discovery of taste structure is the beautiful part.',
    'The genuine value is <b>personalization at scale</b>: every user gets recommendations tuned to their revealed tastes, which powers discovery, engagement and sales across content and commerce. But every recommender runs into a set of <b>well-known, unavoidable problems</b> that this project must confront honestly. The most famous is <b>cold-start</b>: collaborative filtering needs interactions, so it <b>cannot recommend to a brand-new user</b> (no history) or <b>a brand-new item</b> (no one has interacted with it) — the matrix has no signal there. The standard remedy is a <b>hybrid</b> approach: fall back on content features or popularity until enough interactions accumulate. <b>Sparsity</b> (most users interact with a tiny fraction of items) makes learning hard, and <b>popularity bias</b> pushes recommenders to over-recommend already-popular items while the long tail goes unseen — often the opposite of the useful discovery you want.',
    'The deepest honesty is <b>societal</b>. Because recommenders shape what billions of people see, over-personalization creates <b>filter bubbles and echo chambers</b>: if the system only ever shows you more of what you already engaged with, it narrows your exposure, can entrench views, and reduces serendipity — a real, documented concern, not a hypothetical. Relatedly, recommenders are usually optimised for <b>engagement</b> (clicks, watch-time), and <b>engagement is not the same as genuine value or wellbeing</b> — a system can learn to recommend the most addictive or outrage-provoking content rather than the most valuable, so <i>what you optimise for</i> is an ethical choice. A responsible recommender therefore balances accuracy with <b>diversity and serendipity</b>, handles cold-start gracefully, is mindful of popularity bias, and is thoughtful about its objective. Built with matrix-factorisation collaborative filtering and clear eyes about cold-start, sparsity, bias, filter bubbles and the engagement trap, the engine delivers real personalization value while teaching both the elegant mechanics and the serious responsibilities of the systems that increasingly decide what people see.',
  ],
  equations: [
    { t: 'Collaborative filtering (the idea)', eq: 'Use ONLY the user–item interaction matrix R (ratings/clicks).\n\n"users who agreed before will agree again"\n→ recommend items liked by users similar to you.\nNo understanding of the items needed.' },
    { t: 'Matrix factorisation', eq: 'R ≈ U · Vᵀ    (learn latent vectors)\n  u_user (k-dim),  v_item (k-dim)\n  predicted preference = u_user · v_item\n\nLatent factors auto-discover hidden taste dimensions.' },
    { t: 'The hard problems (be honest)', eq: 'cold-start: new user/item has NO interactions → CF can\'t\n  → hybrid: use content/popularity until data accrues\npopularity bias: popular over-recommended; long tail ignored\nfilter bubbles: over-personalization narrows exposure\nengagement ≠ value: optimise the right objective.' },
  ],

  ai: {
    task: 'Recommend items personalized per user via collaborative filtering with matrix factorisation over the interaction matrix, handling cold-start and mindful of bias and filter bubbles.',
    dataset: [
      'The user–item interaction matrix (ratings/clicks/purchases) is the core signal; item/user metadata helps cold-start (hybrid).',
      'Sparsity and popularity distribution in the data shape difficulty and bias.',
    ],
    datasetTable: [
      { n: 'User–item interactions', size: 'Large, sparse', lic: 'Yours (privacy)', use: 'Collaborative filtering signal' },
      { n: 'Item metadata', size: 'Per item', lic: 'Yours', use: 'Cold-start / hybrid' },
      { n: 'User profiles (optional)', size: 'Per user', lic: 'Consented', use: 'Cold-start for new users' },
      { n: 'Held-out interactions', size: '—', lic: '—', use: 'Evaluate recommendations' },
    ],
    preprocess: [
      'Build the sparse interaction matrix; handle implicit vs explicit feedback.',
      'Split for evaluation (leave-some-out per user).',
      'Prepare metadata for cold-start fallback.',
    ],
    pipeline: [
      { name: 'Interactions', sub: 'matrix', highlight: true },
      { name: 'Factorise', sub: 'latent vectors', highlight: true },
      { name: 'Score', sub: 'user·item' },
      { name: 'Top-N', sub: '+diversity' },
      { name: 'Cold-start', sub: 'hybrid' },
    ],
    archTable: [
      { l: 'Interaction matrix', s: 'users × items (sparse)', p: 'The only required signal' },
      { l: 'Matrix factorisation', s: 'latent user/item vectors', p: 'Learn taste from behaviour' },
      { l: 'Scorer', s: 'dot product', p: 'Predicted preference' },
      { l: 'Cold-start', s: 'hybrid (content/popularity)', p: 'New users/items' },
      { l: 'Diversity', s: 're-ranking', p: 'Counter popularity bias/bubbles' },
    ],
    hyper: [
      { k: 'Latent factors (k)', v: '≈ 20–200', w: 'Capacity vs overfit' },
      { k: 'Regularisation', v: 'tuned', w: 'Sparse-data overfit' },
      { k: 'Top-N', v: 'app-specific', w: 'List length' },
      { k: 'Diversity weight', v: 'tuned', w: 'Accuracy vs serendipity' },
    ],
    training: [
      'Learn latent factors from the interaction matrix (with regularisation for sparsity).',
      'Add a hybrid fallback for cold-start; re-rank for diversity.',
      'Evaluate top-N with held-out interactions (precision@k/recall@k), not just RMSE.',
    ],
    metricsIntro: [
      'Ranking metrics (precision@k, recall@k, NDCG) matter more than rating error, alongside coverage/diversity to guard against popularity bias and bubbles.',
    ],
    metrics: [
      { m: 'Precision@k / NDCG', v: 'primary', d: 'Top-N recommendation quality' },
      { m: 'Coverage / diversity', v: 'watch', d: 'Long tail vs popularity bias' },
      { m: 'Cold-start handling', v: 'graceful', d: 'New users/items' },
      { m: 'Objective', v: 'value ≥ engagement', d: 'Optimise the right thing' },
    ],
    chart: { title: 'The recommender trade-offs', unit: '', desc: 'Accuracy, coverage/diversity and cold-start pull against each other — a good recommender balances them, not just accuracy (illustrative).', bars: [
      { label: 'Top-N accuracy', value: 85 },
      { label: 'Diversity/coverage', value: 60 },
      { label: 'Cold-start (hybrid)', value: 55 },
      { label: 'Long-tail reach', value: 50 },
    ] },
    inference: { file: 'recommend.py', lang: 'python', body: `import numpy as np

def recommend(user_id, U, V, seen, k=10):
    if user_id not in U:                       # COLD-START: no factors yet
        return popular_or_content_based(k)     # hybrid fallback
    scores = V @ U[user_id]                     # predicted preference (dot product)
    ranked = np.argsort(-scores)
    recs = [i for i in ranked if i not in seen][:k]   # unseen items
    return diversify(recs)                      # counter popularity bias/bubbles
    # CF uses only interactions; mind cold-start, bias, filter bubbles, and
    # that engagement != genuine value.` },
    limits: [
      'Cold-start: no interactions for a new user/item means CF cannot recommend.',
      'Sparsity makes learning hard; popularity bias over-recommends popular items.',
      'Over-personalization creates filter bubbles/echo chambers.',
      'Engagement is not genuine value — optimise the right objective.',
    ],
  },

  assembly: [
    { h: 'Build the interaction matrix and factorise', p: [
      'Assemble the user–item interaction matrix and learn latent user/item vectors by matrix factorisation.',
    ], warn: 'Every recommender hits cold-start (no interactions for new users/items), sparsity and popularity bias — and over-personalization creates filter bubbles. Engagement is not the same as genuine value; be thoughtful about what you optimise for.' },
    { h: 'Score and recommend top-N', p: [
      'Score a user against unseen items by vector similarity and recommend the top-N, re-ranking for diversity.',
    ] },
    { h: 'Handle cold-start and bias', p: [
      'Fall back on content/popularity for new users/items, and guard against popularity bias and filter bubbles.',
    ] },
  ],
  steps: [
    { h: 'Recommend from latent factors with cold-start fallback', p: [
      'Score a user\'s latent vector against item vectors for top-N, falling back to a hybrid approach on cold-start and diversifying.',
    ], code: {
      file: 'recommend.py', lang: 'python',
      body: `import numpy as np

def recommend(user_id, U, V, seen, k=10):
    if user_id not in U:                        # COLD-START (no interactions)
        return popular_or_content_based(k)      # hybrid fallback
    scores = V @ U[user_id]                      # predicted preference = dot product
    ranked = [i for i in np.argsort(-scores) if i not in seen]   # unseen items
    return diversify(ranked[:k])                 # counter popularity bias/bubbles`,
      explain: [
        { ref: 'if user_id not in U:                        # COLD-START (no interactions)', txt: 'A brand-new user has no latent factors, so collaborative filtering cannot help — the cold-start problem, handled by a hybrid fallback.' },
        { ref: 'scores = V @ U[user_id]                      # predicted preference = dot product', txt: 'Predicted preference is the similarity between the user\'s and each item\'s latent vector — the core of matrix factorisation.' },
        { ref: 'ranked = [i for i in np.argsort(-scores) if i not in seen]   # unseen items', txt: 'Recommendations are the highest-scoring items the user has not already seen.' },
        { ref: 'return diversify(ranked[:k])                 # counter popularity bias/bubbles', txt: 'Re-ranking for diversity guards against popularity bias and filter bubbles rather than only chasing accuracy.' },
      ],
    } },
    { h: 'Balance accuracy, diversity and objective', p: [
      'Tune for top-N quality while adding diversity/serendipity, and be deliberate about optimising for genuine value rather than raw engagement.',
    ], tip: 'Evaluate with ranking metrics (precision@k, NDCG) and coverage/diversity, not just rating error — a recommender that only optimises accuracy tends toward popularity bias and filter bubbles.' },
  ],

  code: [{
    file: 'recommendation_engine.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Recommendation Engine (collaborative filtering)

Personalizes items via collaborative filtering — "people who liked what
you liked also liked this" — using MATRIX FACTORISATION over the
user–item interaction matrix (no item understanding needed). Handles
COLD-START (hybrid fallback) and is mindful of popularity bias, filter
bubbles, and that engagement != genuine value.
"""
import numpy as np

class Recommender:
    def __init__(self, k=50, reg=0.05):
        self.k = k; self.reg = reg
        self.U = {}; self.V = None

    def fit(self, interactions):
        # learn latent user (U) and item (V) vectors s.t. U·Vᵀ ≈ interactions
        self.U, self.V = matrix_factorise(interactions, self.k, self.reg)

    def recommend(self, user_id, seen, n=10):
        if user_id not in self.U:                 # COLD-START: no factors
            return self._hybrid_fallback(n)       # content/popularity
        scores = self.V @ self.U[user_id]          # predicted preference
        ranked = [i for i in np.argsort(-scores) if i not in seen]
        return self._diversify(ranked[:n * 3])[:n] # counter bias/bubbles

    def _hybrid_fallback(self, n):
        return popular_or_content_based(n)         # until interactions accrue

    def _diversify(self, items):
        return rerank_for_diversity(items)         # serendipity, long tail

if __name__ == "__main__":
    rec = Recommender(k=50)
    rec.fit(INTERACTIONS)                          # only user–item interactions
    print(rec.recommend(user_id="u123", seen=SEEN["u123"], n=10))
    # Mind cold-start/sparsity/popularity bias/filter bubbles; engagement != value.`,
    explain: [
      { ref: 'self.U, self.V = matrix_factorise(interactions, self.k, self.reg)', txt: 'Factorisation learns latent user and item vectors purely from interactions — auto-discovering hidden taste dimensions.' },
      { ref: 'if user_id not in self.U:                 # COLD-START: no factors', txt: 'New users have no learned vector, so a hybrid fallback handles the cold-start problem collaborative filtering cannot.' },
      { ref: 'scores = self.V @ self.U[user_id]          # predicted preference', txt: 'A user\'s predicted preference for each item is the dot product of their vector with the item\'s — the recommendation score.' },
      { ref: 'return self._diversify(ranked[:n * 3])[:n] # counter bias/bubbles', txt: 'Diversity re-ranking counters popularity bias and filter bubbles rather than only maximising accuracy.' },
      { ref: '# Mind cold-start/sparsity/popularity bias/filter bubbles; engagement != value.', txt: 'The recommender\'s known hard problems and ethical caveats are stated in the code itself.' },
    ],
  }],

  config: [
    'Configure the interaction matrix (explicit/implicit feedback).',
    'Configure factorisation (latent dimension, regularisation).',
    'Configure top-N, diversity re-ranking and cold-start fallback.',
    'Configure the optimisation objective (value vs raw engagement).',
  ],
  calibration: [
    { h: 'Factorisation', p: [
      'Tune latent dimension and regularisation for sparse data; evaluate top-N.',
    ] },
    { h: 'Cold-start', p: [
      'Verify graceful hybrid fallback for new users/items.',
    ] },
    { h: 'Diversity/bias', p: [
      'Measure coverage/diversity; counter popularity bias and filter bubbles.',
    ] },
  ],
  testing: [
    { step: 'Recommend for an active user', expect: 'Relevant, personalized top-N' },
    { step: 'New user (cold-start)', expect: 'Hybrid/popular fallback (CF can\'t)' },
    { step: 'New item (cold-start)', expect: 'Surfaced via hybrid, not CF' },
    { step: 'Check recommendation coverage', expect: 'Not only popular items (bias check)' },
    { step: 'Assess diversity', expect: 'Some serendipity, not an echo chamber' },
    { step: 'Evaluate with ranking metrics', expect: 'Precision@k/NDCG, not just RMSE' },
  ],
  output: [
    'Personalized top-N recommendations with cold-start handling and diversity, evaluated by ranking metrics.',
    { file: 'recommendations.json', lang: 'json', body: `{
  "user": "u123",
  "recommendations": ["item_88", "item_12", "item_204"],
  "method": "collaborative filtering (matrix factorisation)",
  "cold_start": false,
  "diversity_reranked": true,
  "note": "mind popularity bias, filter bubbles; engagement != value"
}` },
    'Personalized recommendations from learned latent factors, diversity-reranked — useful discovery, produced with awareness of popularity bias and filter bubbles rather than blindly maximising engagement.',
  ],
  troubleshoot: [
    { sym: 'No recs for new user/item', cause: 'Cold-start', fix: 'Hybrid fallback (content/popularity) until data accrues' },
    { sym: 'Only recommends popular items', cause: 'Popularity bias', fix: 'Diversity re-ranking; coverage metrics; regularise' },
    { sym: 'Narrow, repetitive recs', cause: 'Filter bubble', fix: 'Add serendipity/diversity; broaden exposure' },
    { sym: 'Overfits sparse data', cause: 'Too many factors / low reg', fix: 'Fewer factors; more regularisation' },
    { sym: 'Optimises addictiveness', cause: 'Engagement objective', fix: 'Optimise for genuine value; choose objective carefully' },
    { sym: 'Weak evaluation', cause: 'RMSE only', fix: 'Use ranking metrics (precision@k/NDCG) + diversity' },
  ],

  perf: [
    'Learn latent factors from interactions; regularise for sparsity.',
    'Handle cold-start with a hybrid fallback.',
    'Re-rank for diversity to counter popularity bias/bubbles.',
    'Evaluate top-N with ranking metrics and coverage.',
  ],
  safety: [
    'Beware filter bubbles and echo chambers — over-personalization narrows what people see.',
    'Engagement is not genuine value — be deliberate about the optimisation objective.',
    'Interaction data is personal — secure and handle it lawfully with privacy in mind.',
    'Guard against popularity bias that buries the long tail.',
  ],
  maintenance: [
    'Retrain as interactions grow and tastes shift.',
    'Monitor diversity/coverage and cold-start behaviour.',
    'Re-evaluate the objective for value vs engagement.',
    'Audit for bias and privacy.',
  ],
  future: [
    'Add hybrid content+collaborative models.',
    'Add sequence/session-based recommendation.',
    'Add explainable recommendations ("because you liked…").',
    'Add fairness/diversity objectives explicitly.',
  ],
  faq: [
    { q: 'How does collaborative filtering work without understanding items?', a: 'It uses only the matrix of user–item interactions. If your tastes overlap with another user\'s, items they liked that you haven\'t seen are good recommendations for you — "people who agreed before will agree again" — no knowledge of what the items are is needed.' },
    { q: 'What is matrix factorisation?', a: 'Approximating the sparse interaction matrix as the product of small user and item latent-factor vectors, so a user\'s predicted preference for an item is their vectors\' dot product. The learned factors automatically capture hidden taste dimensions from behaviour.' },
    { q: 'What is the cold-start problem?', a: 'Collaborative filtering needs interactions, so it cannot recommend to a brand-new user (no history) or a brand-new item (no one has interacted with it). The fix is a hybrid approach — use content features or popularity until enough interactions accumulate.' },
    { q: 'What are filter bubbles?', a: 'When over-personalization only shows you more of what you already engaged with, narrowing your exposure, entrenching views and reducing serendipity. It is a real societal concern, so a responsible recommender balances accuracy with diversity.' },
    { q: 'Why does "engagement ≠ value" matter?', a: 'Because recommenders are usually optimised for clicks or watch-time, and a system can learn to recommend the most addictive or provocative content rather than the most valuable. What you optimise for is an ethical choice, not just a technical one.' },
  ],
  refs: [
    { t: 'Recommender system', u: 'https://en.wikipedia.org/wiki/Recommender_system', s: 'Reference' },
    { t: 'Collaborative filtering', u: 'https://en.wikipedia.org/wiki/Collaborative_filtering', s: 'Reference' },
    { t: 'Matrix factorization (recommenders)', u: 'https://en.wikipedia.org/wiki/Matrix_factorization_(recommender_systems)', s: 'Reference' },
    { t: 'Cold start problem', u: 'https://en.wikipedia.org/wiki/Cold_start_(recommender_systems)', s: 'Reference' },
    { t: 'Filter bubble', u: 'https://en.wikipedia.org/wiki/Filter_bubble', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'retail'],
  imageCaptions: [
    'A recommendation engine personalizes content and products with collaborative filtering — "people like you liked this".',
    'Matrix factorisation learns latent user and item taste vectors from behaviour alone, no item understanding needed.',
    'Every recommender faces cold-start, popularity bias and filter bubbles — and engagement is not genuine value.',
  ],
},

];
