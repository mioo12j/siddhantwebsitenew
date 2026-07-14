/* ============================================================
   Category page definitions for the Projects knowledge portal.
   Each entry drives one /projects/categories/<slug>.html page.
   filter(p) runs against the enriched ALL_PROJECTS array
   (projects/projects-data.js) at build time.
   ============================================================ */
'use strict';

const CATEGORIES = [
  {
    slug: 'arduino-projects',
    label: 'Arduino Projects',
    eyebrow: 'Platform · Arduino',
    icon: '🔌',
    metaTitle: 'Arduino Projects — Beginner to Advanced Builds | Siddhant Kumar',
    metaDescription: 'A curated library of Arduino projects — sensors, actuators, relays and simple automation — with full component lists, wiring guides and step-by-step build instructions for students and hobbyists.',
    keywords: 'Arduino projects, Arduino Uno projects, Arduino for beginners, Arduino sensor projects, Arduino automation, electronics projects Arduino',
    h1: ['Arduino', 'Projects'],
    lead: 'Arduino is where most electronics journeys begin — a simple board, a simple language, and an almost instant feeling of "I built that." This library collects every project in the catalogue built around the classic Arduino workflow: a microcontroller, a breadboard, a handful of sensors, and code you can read in an afternoon.',
    intro: [
      `<strong>Arduino</strong> boards (Uno, Nano, Mega and their clones) are the standard entry point into embedded electronics because they trade sophistication for simplicity: a single 5V-tolerant microcontroller, a huge library ecosystem, and a beginner-friendly IDE that turns "blink an LED" into a five-minute exercise rather than a week of datasheet-reading. Every project in this section is built around that same core loop — read a sensor, make a decision, drive an output — which is exactly the pattern that underlies almost all of embedded engineering.`,
      `What makes Arduino worth learning first isn't the hardware itself, it's the habits it teaches: wiring a breadboard cleanly, reading a datasheet for pinouts and voltage limits, debugging with <code>Serial.print()</code> before reaching for anything fancier, and structuring code around <code>setup()</code> and <code>loop()</code>. Those habits carry directly into ESP32, Raspberry Pi and even industrial PLC work later on.`,
      `The projects below range from single-sensor starter builds to multi-actuator automation systems. Each one includes a complete bill of materials, a wiring explanation, the exact libraries used, and a troubleshooting guide — so whether this is your first breadboard or your fiftieth, you have everything needed to build, test and understand the circuit, not just copy it.`
    ],
    why: [
      { h4: 'Lowest barrier to entry', p: 'No WiFi stack, no OS, no build toolchain to fight — just C/C++ on a chip you can fully understand.' },
      { h4: 'Enormous community', p: 'Nearly every sensor module has an existing Arduino library and a forum thread covering the exact error you hit.' },
      { h4: 'Transferable fundamentals', p: 'Digital I/O, analog reads, PWM, interrupts and serial protocols are the same concepts every other platform builds on.' },
      { h4: 'Cheap to prototype', p: 'A full starter kit costs a fraction of a Raspberry Pi setup, making it ideal for school and college budgets.' }
    ],
    filter: p => p.domains.includes('Arduino'),
    related: ['esp32-projects', 'electronics-projects', 'beginner-projects', 'automation-projects']
  },
  {
    slug: 'esp32-projects',
    label: 'ESP32 Projects',
    eyebrow: 'Platform · ESP32 / ESP8266',
    icon: '📶',
    metaTitle: 'ESP32 & ESP8266 Projects — WiFi, IoT & Cloud Builds | Siddhant Kumar',
    metaDescription: 'ESP32 and ESP8266 project guides covering WiFi connectivity, MQTT, cloud dashboards, BLE and app-controlled IoT devices — complete with BOM, wiring and firmware architecture.',
    keywords: 'ESP32 projects, ESP8266 projects, ESP32 IoT projects, ESP32 WiFi projects, MQTT ESP32, ESP32 for beginners',
    h1: ['ESP32', 'Projects'],
    lead: 'The moment a project needs to talk to the internet — a phone app, a cloud dashboard, an MQTT broker — the ESP32 becomes the natural choice. Dual-core, WiFi- and Bluetooth-equipped, and still cheap enough to put one in every room of a house, it is the workhorse of this entire IoT catalogue.',
    intro: [
      `The <strong>ESP32</strong> (and its single-core sibling, the ESP8266) took the Arduino programming model and added what most connected projects actually need: built-in WiFi, Bluetooth Low Energy, more RAM, a faster clock, and enough GPIO to drive a real sensor array. It can be programmed with the same Arduino IDE and library ecosystem, which means the jump from Arduino to ESP32 is mostly conceptual — learning to think about network connections, cloud APIs and asynchronous events — rather than a new language to learn.`,
      `Every ESP32 project in this catalogue follows a similar architecture: a sensor or actuator layer at the edge, a WiFi or BLE link back to a phone app, a cloud dashboard, or an MQTT broker, and firmware that has to gracefully handle the thing every IoT engineer eventually respects — the network going down. That reconnection logic, along with OTA updates and low-power sleep modes, is what separates a "smart" device from a science-fair demo.`,
      `Use this page to browse everything from single-room smart-home gadgets to multi-node mesh and telemetry systems. Each project page documents the exact communication protocol used (WiFi, MQTT, BLE or a mix), the cloud or app layer it talks to, and the power budget for battery-powered builds.`
    ],
    why: [
      { h4: 'Native WiFi + BLE', p: 'No separate WiFi shield needed — connectivity is built into the chip and the price.' },
      { h4: 'Dual-core headroom', p: 'One core can run sensor timing while the other handles networking, without either blocking the other.' },
      { h4: 'Huge protocol support', p: 'MQTT, HTTP/REST, WebSockets and BLE GATT are all well-supported in the Arduino-ESP32 core.' },
      { h4: 'Deep sleep for battery builds', p: 'Microamp-level deep sleep makes multi-month battery life realistic for sensor nodes.' }
    ],
    filter: p => p.domains.includes('ESP32'),
    related: ['arduino-projects', 'automation-projects', 'intermediate-projects', 'electronics-projects']
  },
  {
    slug: 'raspberry-pi-projects',
    label: 'Raspberry Pi Projects',
    eyebrow: 'Platform · Raspberry Pi',
    icon: '🖥️',
    metaTitle: 'Raspberry Pi Projects — Vision, AI & Edge Computing Builds | Siddhant Kumar',
    metaDescription: 'Raspberry Pi project guides for computer vision, edge AI, camera systems and robotics — full setup instructions, software architecture, and hardware wiring for every build.',
    keywords: 'Raspberry Pi projects, Raspberry Pi camera projects, Raspberry Pi AI projects, Raspberry Pi robotics, edge computing projects, Raspberry Pi for students',
    h1: ['Raspberry Pi', 'Projects'],
    lead: 'When a project needs a real operating system, a camera pipeline, or enough compute to run a neural network on-device, the Raspberry Pi takes over from the microcontroller world. This is where computer vision, edge AI and camera-driven robotics in the catalogue live.',
    intro: [
      `The <strong>Raspberry Pi</strong> is a full single-board computer, not a microcontroller — it boots Linux, runs Python natively, and has enough CPU (and, on newer boards, NPU or GPU acceleration) to handle image processing, OpenCV pipelines and lightweight machine-learning inference locally. That changes the shape of a project: instead of writing tight embedded C for a single loop, you're managing an OS, services, camera drivers and often a small web server.`,
      `Projects in this section typically pair the Pi with a camera module or USB webcam and a vision or audio pipeline — object detection, face recognition, number-plate reading, pose estimation — sometimes with a microcontroller (Arduino or ESP32) handled as a co-processor for motor control or low-level sensor timing. That Pi-plus-microcontroller pattern is one of the most common architectures in serious robotics and edge-AI builds, and you'll see it repeated across this catalogue.`,
      `Each project page here documents the exact OS image, Python environment, camera or sensor setup, and model or algorithm used, along with realistic performance numbers (frames per second, inference latency) so you know what to expect before you buy hardware.`
    ],
    why: [
      { h4: 'Real compute, real OS', p: 'Enough CPU/GPU headroom to run OpenCV, TensorFlow Lite or PyTorch models directly on-device.' },
      { h4: 'Camera-first ecosystem', p: 'The official camera module and libcamera stack make vision projects far less painful than a generic USB webcam setup.' },
      { h4: 'Full Linux networking', p: 'SSH, Flask/FastAPI dashboards and MQTT all run natively — no separate WiFi module needed.' },
      { h4: 'Bridges to microcontrollers', p: 'GPIO and serial links let a Pi hand off real-time motor or sensor timing to an Arduino/ESP32 co-processor.' }
    ],
    filter: p => p.domains.includes('RaspberryPi'),
    related: ['robotics-projects', 'advanced-projects', 'final-year-projects', 'electronics-projects']
  },
  {
    slug: 'robotics-projects',
    label: 'Robotics Projects',
    eyebrow: 'Discipline · Robotics',
    icon: '🤖',
    metaTitle: 'Robotics Projects — Autonomous Robots & Robotic Arms | Siddhant Kumar',
    metaDescription: 'Robotics project guides covering mobile robots, robotic arms, self-balancing platforms and autonomous navigation — mechanical design, control theory and full build instructions.',
    keywords: 'robotics projects, autonomous robot projects, robotic arm project, self-balancing robot, line follower robot, robotics for students, DIY robot',
    h1: ['Robotics', 'Projects'],
    lead: 'Robotics is where mechanical design, electronics and software converge — a robot has to move through the physical world, not just react to it. This section covers every mobile robot, robotic arm and autonomous platform in the catalogue, from a simple obstacle-avoiding buggy to Rover, the flagship AI robot dog.',
    intro: [
      `A <strong>robotics project</strong> asks more of a builder than a typical sensor node: it needs a chassis and drivetrain that can physically move, a control loop that reacts fast enough to stay stable or avoid collisions, and — increasingly — a perception layer that lets it understand its surroundings rather than just follow a fixed script. The projects in this section span that whole range, from open-loop line followers to closed-loop, sensor-fused autonomous platforms.`,
      `Common building blocks recur across almost every build here: DC gear motors or servos for locomotion, an IMU or ultrasonic array for balance and obstacle sensing, a PID or state-machine control loop running on a microcontroller, and — for the more advanced builds — a Raspberry Pi or similar board handling vision and path planning while the microcontroller handles real-time motor control underneath it.`,
      `Each project page walks through the mechanical design and drivetrain choice, the control algorithm (PID, kinematics, or a full autonomy stack), the sensor suite, and realistic performance limits — because a robot that works in a demo video and a robot that works reliably on your desk are two different engineering problems, and this section is honest about the difference.`
    ],
    why: [
      { h4: 'Multi-disciplinary by nature', p: 'Every robotics build touches mechanical design, power electronics, control theory and software together.' },
      { h4: 'Immediate, visible feedback', p: 'A robot that drifts, tips, or misjudges a turn tells you exactly where your control loop needs tuning.' },
      { h4: 'Scales from toy to serious', p: 'The same PID and sensor-fusion fundamentals used in a line-follower scale up to warehouse AGVs and autonomous vehicles.' },
      { h4: 'A strong portfolio centerpiece', p: 'Few projects demonstrate engineering range as convincingly as a robot that actually works.' }
    ],
    filter: p => p.domains.includes('Robotics'),
    related: ['raspberry-pi-projects', 'ai-projects-hub', 'advanced-projects', 'automation-projects']
  },
  {
    slug: 'electronics-projects',
    label: 'Electronics Projects',
    eyebrow: 'Foundation · Electronics',
    icon: '⚡',
    metaTitle: 'Electronics Projects — Circuits, Sensors & Embedded Builds | Siddhant Kumar',
    metaDescription: 'Hands-on electronics projects covering sensors, circuits, power systems and embedded hardware — with wiring diagrams, component specifications and build guides.',
    keywords: 'electronics projects, embedded electronics, sensor circuits, electronics mini projects, electronics for engineering students, hardware projects',
    h1: ['Electronics', 'Projects'],
    lead: 'Underneath every IoT gadget, robot and wearable in this catalogue is a plain electronics circuit — sensors, power regulation, signal conditioning and an output that does something useful. This hub gathers every hardware-centric build in the catalogue: the full electronics side of the workshop.',
    intro: [
      `<strong>Electronics</strong> is the substrate everything else is built on. Long before a project has WiFi, an app, or a neural network attached to it, it has a circuit: a sensor producing a voltage or a digital signal, a microcontroller reading and interpreting it, and an actuator — a relay, motor, LED, buzzer or valve — turning a decision back into physical action. This section is the widest of the category pages because almost every physical build in the catalogue depends on getting that core circuit right.`,
      `Reliable electronics work comes down to a handful of habits: respecting voltage and current limits, using pull-up/pull-down resistors correctly, decoupling noisy power rails, and understanding a datasheet well enough to know what a sensor actually needs to run correctly. Every project page in this catalogue documents these details explicitly — the exact operating voltage, current draw, and wiring — rather than leaving them as an exercise for the reader.`,
      `Whether you're looking for a first breadboard project or a reference for a specific sensor or driver IC, this page is the fastest way to browse the hardware side of the entire catalogue by component and circuit type rather than by finished product category.`
    ],
    why: [
      { h4: 'The skill everything else depends on', p: 'Software can be debugged on a screen; a bad circuit can damage a component before you find the bug.' },
      { h4: 'Datasheet literacy', p: 'Every project here forces you to read at least one datasheet — the single most useful habit in hardware engineering.' },
      { h4: 'Cheap to experiment with', p: 'A basic sensor and breadboard kit is inexpensive, and mistakes here are rarely destructive if voltage limits are respected.' },
      { h4: 'Portable knowledge', p: 'Learning to wire and drive a relay or a motor driver IC applies identically whether the brain is an Arduino, ESP32 or Raspberry Pi.' }
    ],
    filter: p => p.domains.includes('Electronics'),
    related: ['arduino-projects', 'esp32-projects', 'beginner-projects', 'automation-projects']
  },
  {
    slug: 'automation-projects',
    label: 'Automation Projects',
    eyebrow: 'Discipline · Automation & Control',
    icon: '⚙️',
    metaTitle: 'Automation Projects — Smart Control Systems | Siddhant Kumar',
    metaDescription: 'Automation project guides covering scheduled, sensor-driven and closed-loop control systems — irrigation, climate, lighting and industrial automation with full build instructions.',
    keywords: 'automation projects, home automation projects, industrial automation projects, smart control systems, IoT automation, closed-loop control',
    h1: ['Automation', 'Projects'],
    lead: 'Automation is the point where a device stops waiting for a button press and starts making decisions on its own — watering a plant only when the soil is dry, closing a gas valve the instant a leak is detected, dimming a streetlight based on the sun. This section collects every closed-loop and scheduled-control build in the catalogue.',
    intro: [
      `An <strong>automation project</strong> is defined less by its hardware than by its control logic: sense a condition, compare it against a threshold or schedule, and act — usually through a relay, motor driver, or actuator — without a human in the loop. The engineering challenge is rarely the sensor or the relay individually; it's designing control logic that's reliable under edge cases (sensor noise, power loss, conflicting inputs) rather than just the happy path.`,
      `Projects here range from simple threshold automation (a soil-moisture sensor triggering a pump) to full closed-loop systems with hysteresis and PID-style control (a greenhouse balancing temperature, humidity and ventilation simultaneously). Several also introduce scheduling — time-of-day or calendar-based logic layered on top of sensor thresholds, which is how most real smart-home and industrial controllers actually behave.`,
      `Each project page documents the exact control logic used, the safety interlocks in place (what happens if a sensor fails or a relay sticks), and the calibration process needed to tune thresholds for a real environment rather than a bench test.`
    ],
    why: [
      { h4: 'Teaches control thinking, not just circuits', p: 'You have to reason about state, hysteresis and failure modes, not just wiring.' },
      { h4: 'Immediately useful', p: 'Automation projects tend to solve a real, recurring chore rather than being a pure demo.' },
      { h4: 'Scales to industrial relevance', p: 'The same threshold-and-relay logic underlies real industrial control systems and PLCs.' },
      { h4: 'Safety-critical thinking', p: 'Gas, water and fire-related automation builds force you to design for the failure case, not just the success case.' }
    ],
    filter: p => p.domains.includes('Automation'),
    related: ['esp32-projects', 'renewable-energy-projects', 'intermediate-projects', 'electronics-projects']
  },
  {
    slug: 'renewable-energy-projects',
    label: 'Renewable Energy Projects',
    eyebrow: 'Discipline · Renewable Energy',
    icon: '☀️',
    metaTitle: 'Renewable Energy Projects — Solar Monitoring & Control | Siddhant Kumar',
    metaDescription: 'Renewable energy project guides for solar monitoring, battery management and solar-powered automation — sizing, wiring and control system design explained.',
    keywords: 'renewable energy projects, solar projects, solar monitoring system, solar IoT projects, battery management system project, solar automation',
    h1: ['Renewable Energy', 'Projects'],
    lead: 'Solar and battery-powered systems bring an extra constraint that most electronics projects don\'t have to think about: the power source itself is variable, and the system has to work with it rather than assume mains power is always there. This section covers the catalogue\'s solar monitoring and control builds.',
    intro: [
      `<strong>Renewable-energy electronics</strong> is a growing intersection of IoT and power systems: monitoring how much energy a solar panel is generating, managing how a battery is charged and discharged safely, and controlling loads intelligently around the availability of sunlight rather than a fixed schedule. It's a natural extension of the automation and IoT skills covered elsewhere in this catalogue, applied to a source of power that isn't always there.`,
      `The projects here typically combine a current/voltage sensing circuit (to measure real-time generation or battery state), a microcontroller running the monitoring and control logic, and either a cloud dashboard for visibility or a direct control loop for load-shifting — running a pump or charging a battery specifically during peak sunlight hours to maximise self-consumption.`,
      `This is a small but growing section of the catalogue, and it's one of the most practically valuable areas to build in given how much solar and battery-storage capacity is being installed at both the home and grid scale.`
    ],
    why: [
      { h4: 'Real-world sizing constraints', p: 'You have to reason about watts, amp-hours and charge/discharge curves, not just digital I/O.' },
      { h4: 'Directly cuts energy cost', p: 'A working solar monitor or load-shifting controller has a real, measurable payback for whoever builds it.' },
      { h4: 'Battery safety matters', p: 'BMS-adjacent projects teach why overcharge and thermal protection are non-negotiable in any battery system.' },
      { h4: 'A fast-growing field', p: 'Rooftop solar and home battery adoption are accelerating, and so is demand for the monitoring software around them.' }
    ],
    filter: p => p.domains.includes('RenewableEnergy'),
    related: ['automation-projects', 'esp32-projects', 'intermediate-projects', 'electronics-projects']
  },
  {
    slug: 'beginner-projects',
    label: 'Beginner Projects',
    eyebrow: 'Skill Level · Beginner',
    icon: '🌱',
    metaTitle: 'Beginner Electronics & IoT Projects — Start Here | Siddhant Kumar',
    metaDescription: 'Beginner-friendly electronics and IoT projects with minimal components, clear wiring diagrams and step-by-step instructions — ideal first builds for students and hobbyists.',
    keywords: 'beginner electronics projects, easy IoT projects, first Arduino project, simple electronics projects, beginner robotics, DIY starter projects',
    h1: ['Beginner', 'Projects'],
    lead: 'Every engineer starts somewhere. These are the projects in the catalogue chosen for a small component count, forgiving wiring, and code that\'s short enough to read in one sitting — the right place to build real, working confidence before moving on to anything more ambitious.',
    intro: [
      `A good <strong>beginner project</strong> isn't just "easy" — it's one where every part of the build is understandable end to end. You should be able to explain, in your own words, what each wire does and why each line of code exists. The projects gathered here were chosen for exactly that: a small, well-documented bill of materials, a single clear sensor-to-actuator relationship, and a troubleshooting guide that anticipates the mistakes every beginner makes at least once.`,
      `If this is your first hardware project, start with the wiring explanation and safety precautions sections on each page before touching a breadboard — most beginner mistakes (reversed polarity, missing pull-up resistors, exceeding a pin's current limit) are avoidable simply by reading the datasheet notes first. From there, the step-by-step implementation guide on each page is written to be followed literally, not skimmed.`,
      `Once a few of these feel comfortable, the natural next step is the <a href="intermediate-projects.html">Intermediate Projects</a> page, which adds connectivity, multiple sensors, and slightly more involved control logic.`
    ],
    why: [
      { h4: 'Small, honest component lists', p: 'No hidden dependencies or components you\'ll need to improvise around.' },
      { h4: 'Forgiving of small mistakes', p: 'Low voltages and simple circuits mean a wiring error is a learning moment, not a burnt-out board.' },
      { h4: 'Builds real confidence', p: 'Finishing a working circuit — even a simple one — is the single best predictor of sticking with electronics.' },
      { h4: 'A natural on-ramp', p: 'Every concept here (digital I/O, analog sensing, simple relays) reappears in every harder project later.' }
    ],
    filter: p => p.level === 'Beginner',
    related: ['arduino-projects', 'school-projects', 'intermediate-projects', 'electronics-projects']
  },
  {
    slug: 'intermediate-projects',
    label: 'Intermediate Projects',
    eyebrow: 'Skill Level · Intermediate',
    icon: '🛠️',
    metaTitle: 'Intermediate Electronics & IoT Projects | Siddhant Kumar',
    metaDescription: 'Intermediate-level electronics and IoT projects combining multiple sensors, connectivity and control logic — for builders ready to move past their first breadboard circuit.',
    keywords: 'intermediate electronics projects, intermediate IoT projects, connected device projects, ESP32 intermediate project, college electronics project',
    h1: ['Intermediate', 'Projects'],
    lead: 'This is where a project stops being a single sensor and becomes a system: multiple inputs, a cloud connection or app, and control logic that has to handle more than one condition at once. If the beginner projects taught the fundamentals, these put them to work.',
    intro: [
      `<strong>Intermediate</strong> builds in this catalogue typically add one or more of: wireless connectivity (WiFi, BLE or MQTT), a second or third sensor whose readings have to be combined or cross-checked, a mobile app or cloud dashboard, or control logic with real state (schedules, hysteresis, multi-step sequences) rather than a single if/else check. None of this is individually difficult, but combining several of them into one reliable system is a genuinely different skill from a first breadboard project.`,
      `This is also usually where good coding habits start to matter — non-blocking timing instead of long <code>delay()</code> calls, structuring firmware around states rather than a single linear loop, and handling the inevitable moment when a WiFi connection drops or a sensor returns a bad reading. Each project page documents its software architecture explicitly so you can see that structure rather than reverse-engineer it from a code dump.`,
      `These projects are well suited to college mini-projects and semester assignments — substantial enough to demonstrate real engineering judgement, without requiring research-level novelty.`
    ],
    why: [
      { h4: 'Systems thinking, not just circuits', p: 'You start designing how components interact, not just whether each one works alone.' },
      { h4: 'Real connectivity concerns', p: 'Handling dropped WiFi, retries and reconnection logic is a core embedded-systems skill.' },
      { h4: 'App and cloud integration', p: 'Most of these projects introduce a phone app or web dashboard — a full-stack slice of the build.' },
      { h4: 'Portfolio-ready scope', p: 'Substantial enough to write up properly, compact enough to finish in a few weekends.' }
    ],
    filter: p => p.level === 'Intermediate',
    related: ['esp32-projects', 'college-projects', 'advanced-projects', 'automation-projects']
  },
  {
    slug: 'advanced-projects',
    label: 'Advanced Projects',
    eyebrow: 'Skill Level · Advanced',
    icon: '🚀',
    metaTitle: 'Advanced Engineering Projects — AI, Robotics & Industrial IoT | Siddhant Kumar',
    metaDescription: 'Advanced engineering projects spanning AI, computer vision, robotics and industrial IoT — multi-subsystem builds with real research and design depth for final-year and capstone work.',
    keywords: 'advanced electronics projects, advanced AI projects, capstone engineering project, final year project ideas, advanced robotics project, industrial IoT project',
    h1: ['Advanced', 'Projects'],
    lead: 'These are the catalogue\'s most demanding builds — multi-subsystem robotics, industrial and smart-city IoT, and the full AI & machine-learning lab. Each one is a legitimate capstone or final-year project, with the design depth to match.',
    intro: [
      `<strong>Advanced</strong> projects here typically combine three or more of the disciplines covered elsewhere in the catalogue at once: embedded firmware, wireless or mesh networking, a cloud or edge-compute backend, and — for the AI builds — a trained or fine-tuned model running either on a server or on-device. Nothing about them is inherently unapproachable, but they demand comfort with the intermediate material first, and a willingness to debug across several layers of a stack rather than one.`,
      `The AI and computer-vision projects in particular ask for a different kind of rigor: you're not just wiring a circuit correctly, you're validating a model's accuracy, understanding its failure modes, and being honest about where a demo works reliably and where it doesn't. Every advanced project page here documents a performance-analysis section for exactly that reason — real engineering work includes knowing the limits of what you built.`,
      `If you're scoping a final-year or capstone project, this page — combined with the <a href="final-year-projects.html">Final Year Projects</a> page — is the fastest way to browse builds with genuine design and research depth.`
    ],
    why: [
      { h4: 'Multi-subsystem integration', p: 'Firmware, networking, cloud and sometimes ML all have to work together, not just individually.' },
      { h4: 'Real performance analysis', p: 'These projects are judged on accuracy, latency and reliability, not just "does it turn on."' },
      { h4: 'Research-adjacent scope', p: 'Several map directly onto active research areas — autonomous navigation, edge AI, predictive maintenance.' },
      { h4: 'Strong for final-year work', p: 'Enough depth to support a full project report, viva, and demonstration.' }
    ],
    filter: p => p.level === 'Advanced',
    related: ['final-year-projects', 'robotics-projects', 'raspberry-pi-projects', 'intermediate-projects']
  },
  {
    slug: 'school-projects',
    label: 'School Projects',
    eyebrow: 'Audience · School Students',
    icon: '🎒',
    metaTitle: 'School Science & Electronics Project Ideas | Siddhant Kumar',
    metaDescription: 'School-friendly electronics and IoT project ideas with simple, low-cost components — perfect for science fairs, exhibitions and classroom demonstrations.',
    keywords: 'school science project ideas, school electronics project, science exhibition project, simple electronics project for students, school IoT project',
    h1: ['School', 'Projects'],
    lead: 'Chosen specifically for school science fairs and classroom demonstrations: low component count, low cost, and a working demo that\'s easy to explain to a judge or a classmate in under two minutes.',
    intro: [
      `Good <strong>school projects</strong> need to do double duty: they have to actually work on demo day, and they have to be explainable to someone without a technical background in a couple of sentences — "this senses gas leaks and shuts the valve automatically" lands better at a science fair than a wiring diagram ever will. The projects gathered on this page share the same low-cost, low-complexity profile as the Beginner Projects list, framed here specifically for a classroom or exhibition setting.`,
      `Every project page includes a plain-language overview and a "sample output / expected results" section written for exactly this purpose — so you can describe what the demo will show before you've even built it, which is invaluable when planning a science-fair presentation or lab report around it.`,
      `For a slightly bigger step up — a semester project rather than a one-day exhibition — see the <a href="college-projects.html">College Projects</a> page.`
    ],
    why: [
      { h4: 'Low cost, easy to source', p: 'Components are widely available and affordable enough for a school project budget.' },
      { h4: 'Demo-friendly', p: 'Clear cause-and-effect behaviour that\'s easy to show and explain live.' },
      { h4: 'Safe for a classroom setting', p: 'Low voltages throughout, with explicit safety notes on every page.' },
      { h4: 'Good for reports and vivas', p: 'Each page\'s working-principle and conclusion sections translate directly into a project report.' }
    ],
    filter: p => p.level === 'Beginner',
    related: ['beginner-projects', 'arduino-projects', 'college-projects', 'electronics-projects']
  },
  {
    slug: 'college-projects',
    label: 'College Projects',
    eyebrow: 'Audience · College Students',
    icon: '🎓',
    metaTitle: 'College Electronics & IoT Mini-Projects | Siddhant Kumar',
    metaDescription: 'College mini-project and semester project ideas in electronics, IoT and embedded systems — with full documentation suitable for lab reports and evaluations.',
    keywords: 'college mini project, college electronics project, semester project ideas, IoT mini project for engineering students, embedded systems college project',
    h1: ['College', 'Projects'],
    lead: 'Sized for a semester-length mini-project: real connectivity, a proper bill of materials, and enough documented design decisions to support a lab report and a viva — without requiring a full final-year research scope.',
    intro: [
      `<strong>College mini-projects</strong> sit in a specific sweet spot: substantial enough to demonstrate genuine engineering skill for a course evaluation, but scoped to be finished in a few weeks alongside a full course load. The projects on this page match that profile — they typically involve connectivity, an app or dashboard, and control logic with real state, matching the Intermediate difficulty tier elsewhere in this catalogue.`,
      `Because these are so often submitted as coursework, every project page is written with a lab report in mind — objectives, problem statement, working principle, system architecture and a conclusion section are all present and ready to be adapted directly into a report structure, alongside the block-diagram and circuit-diagram placeholders you can redraw for your own submission.`,
      `Looking for something with more research depth for a capstone or final-year submission instead? See the <a href="final-year-projects.html">Final Year Projects</a> page.`
    ],
    why: [
      { h4: 'Matches semester timelines', p: 'Scoped to be realistically finishable in a few weeks alongside coursework.' },
      { h4: 'Report-ready structure', p: 'Objectives, problem statement and working-principle sections map directly onto a standard lab report format.' },
      { h4: 'Demonstrates real integration', p: 'Connectivity, app/cloud layers and control logic together — more than a single-sensor demo.' },
      { h4: 'Evaluator-friendly', p: 'Clear performance-analysis sections make for a strong viva discussion.' }
    ],
    filter: p => p.level === 'Intermediate',
    related: ['intermediate-projects', 'school-projects', 'final-year-projects', 'esp32-projects']
  },
  {
    slug: 'final-year-projects',
    label: 'Final Year Projects',
    eyebrow: 'Audience · Final-Year & Capstone',
    icon: '🏆',
    metaTitle: 'Final Year Engineering Project Ideas — AI, Robotics & IoT | Siddhant Kumar',
    metaDescription: 'Final-year and capstone engineering project ideas across AI, robotics and industrial IoT — with full system architecture, research context and evaluation-ready documentation.',
    keywords: 'final year project ideas, capstone project engineering, final year IoT project, final year AI project, B.Tech final year project, engineering capstone ideas',
    h1: ['Final Year', 'Projects'],
    lead: 'A final-year project needs to show more than a working circuit — it needs a real problem statement, a defensible design, and results you can stand behind in a viva. This page collects the catalogue\'s most substantial builds: the Advanced-tier robotics, industrial IoT, and full AI/ML systems.',
    intro: [
      `<strong>Final-year and capstone projects</strong> are judged differently from coursework — evaluators are looking for a genuine problem statement, a design that reflects real trade-off decisions, and results that are reported honestly, including limitations. The projects on this page were selected because they support exactly that: multi-subsystem architecture, a real algorithm or model (not just a sensor-to-relay mapping), and a performance-analysis section that gives you something concrete to defend.`,
      `Each project page includes a full literature-adjacent context in its introduction and problem-statement sections, a system and software architecture breakdown suitable for a project report's design chapter, and a references section to build from for further research — everything needed to turn a project idea into a properly documented final submission.`,
      `Not sure this is the right scope yet? The <a href="college-projects.html">College Projects</a> page has lighter, semester-sized alternatives.`
    ],
    why: [
      { h4: 'Defensible design decisions', p: 'Architecture and algorithm choices are explained, not just stated — ready for viva questions.' },
      { h4: 'Real problem statements', p: 'Each project targets a genuine use case, not an arbitrary sensor demo.' },
      { h4: 'Research-ready references', p: 'A references section on every page gives you a starting point for a literature review.' },
      { h4: 'Demonstrates full-stack range', p: 'Firmware, networking, cloud/edge compute and (where relevant) ML together in one system.' }
    ],
    filter: p => p.level === 'Advanced',
    related: ['advanced-projects', 'college-projects', 'robotics-projects', 'raspberry-pi-projects']
  }
];

module.exports = CATEGORIES;
