/* AI — Generative (A14–A15) + Speech (A16). Full-depth build guides. */
module.exports = [

/* ══════════════════════════════════════════════════════════════════
   A14 — Generative Image Model
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A14',
  domainKey: 'ai',
  emoji: '🎨', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '16–24 hours', iso8601: 'PT22H',
  tagline: 'Creates original images from text prompts using diffusion — turning "a lighthouse at sunset, oil painting" into a picture that never existed.',
  platformName: 'GPU workstation or server (+ image-model API optional)',
  ide: 'Python 3.11 + diffusion / PyTorch',

  overview: [
    'Generative image models can conjure a photorealistic or painterly picture from nothing but a sentence — "a red panda astronaut, watercolour" — and they represent one of the most striking capabilities in modern AI. This project builds a <b>text-to-image</b> system using <b>diffusion</b>, the technique behind the current generation of image generators, so you can turn text prompts into original images and, just as importantly, understand <i>how</i> the seemingly magical process actually works.',
    'The core idea of <b>diffusion</b> is beautifully counter-intuitive: teach a model to <b>reverse the gradual addition of noise</b>. In training, images are progressively corrupted with random noise until they are pure static; the model learns to predict and remove that noise step by step. To <i>generate</i>, you then start from <b>pure random noise</b> and run the learned denoising process in reverse, and a coherent image emerges from the static. <b>Text conditioning</b> steers this: the prompt (encoded by a text model) guides each denoising step toward an image matching the description. Practically, most projects use a <b>pretrained</b> diffusion model (training one from scratch needs enormous data and compute) and focus on generation, prompting, and control.',
    'The value is creative and practical image synthesis — art, concepts, mockups, assets — from text. But this is a domain where the <b>ethics are not optional</b>, and the project treats them as central: generative image models raise real concerns about <b>deepfakes and misinformation</b> (fabricated realistic images of real people/events), <b>copyright and training data</b> (models trained on artists\' work without consent), <b>bias</b> (stereotyped outputs reflecting skewed data), and <b>consent</b>. Responsible use means not generating deceptive imagery of real people or events, respecting copyright and artists, and being transparent that images are AI-generated. It is also honest that outputs are imperfect (the infamous mangled hands, prompt sensitivity) and compute-hungry. Built with capability and responsibility together, it is both a remarkable creative tool and an essential lesson in generative modelling and its societal stakes.',
  ],
  does: [
    'Generates original images from text prompts',
    'Uses diffusion (learned denoising from noise)',
    'Steers generation with text conditioning',
    'Supports prompting and control for desired results',
    'Uses pretrained models for feasible generation',
    'Creates art, concepts, mockups and assets',
    'Is built with misuse/copyright/bias safeguards',
  ],
  features: [
    'Text-to-image diffusion generation',
    'Text-conditioned denoising',
    'Prompt/control (guidance, seeds, negative prompts)',
    'Pretrained-model workflow',
    'Creative and practical synthesis',
    'Responsible-use safeguards',
    'Honest about imperfections, compute and ethics',
  ],
  applications: [
    { t: 'Art / creative work', d: 'Generating original artwork and imagery.' },
    { t: 'Concept / design', d: 'Rapid concept art, mockups, moodboards.' },
    { t: 'Content assets', d: 'Illustrations and assets from prompts.' },
    { t: 'Generative-AI education', d: 'Understanding diffusion and its ethics.' },
  ],
  skills: [
    'Diffusion (forward noising / reverse denoising)',
    'Text conditioning of generation',
    'Prompting and generation control',
    'Working with pretrained image models',
    'Responsible/ethical generative-AI practice',
  ],
  prereq: [
    'Diffusion generates by reversing gradual noise — denoise from static to image.',
    'Text conditioning steers denoising toward the prompt.',
    'Use pretrained models — training from scratch needs huge data/compute.',
    'Ethics are central: deepfakes, copyright, bias, consent, transparency.',
  ],

  parts: [],
  extraParts: [
    { name: 'GPU compute', spec: 'GPU (VRAM matters) or an image-model API', qty: 1, price: 0, note: 'Diffusion is compute-hungry' },
    { name: 'Pretrained diffusion model', spec: 'Open text-to-image diffusion model', qty: 1, price: 0 },
    { name: 'Text encoder', spec: 'For text conditioning', qty: 1, price: 0 },
    { name: 'Safety/consent tooling', spec: 'Misuse/consent/transparency safeguards', qty: 1, price: 0, note: 'Ethics are central' },
  ],
  cost: 'Software; GPU/API-dependent',
  libs: ['python', 'torch', 'transformers', 'numpy'],
  hardwareNotes: [
    'This is a pure-software system — no electronic hardware to specify. The critical resource is GPU compute: diffusion sampling is heavy, and VRAM bounds resolution and batch size; a hosted image-model API is the alternative to local GPUs.',
    'Storage holds model weights (often several GB) and generated outputs. A deployment adds a prompt UI and — importantly — safety/consent tooling. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the generation data flow — a text prompt is encoded and used to condition a diffusion model that denoises random noise, step by step, into an image.',
  pins: {
    left: [
      { dev: 'Text prompt', devPin: 'text', pin: '—', sig: 'Description' },
      { dev: 'Random noise', devPin: 'seed', pin: '—', sig: 'Starting point' },
    ],
    right: [
      { dev: 'Diffusion model', devPin: 'denoise', pin: '—', sig: 'Steps → image' },
      { dev: 'Image', devPin: 'output', pin: '—', sig: 'Generated' },
    ],
  },
  wiringNotes: [
    'A text prompt is encoded to condition the generation.',
    'Generation starts from pure random noise (a seed).',
    'The diffusion model denoises step by step, guided by the prompt.',
    'A coherent image emerges; controls (guidance, seed, negatives) shape it.',
    'Use responsibly: no deceptive imagery of real people/events; respect copyright; disclose AI generation.',
  ],

  block: { columns: [
    { label: 'Prompt', edge: 'right', blocks: [
      { name: 'Text', sub: 'describe', highlight: true },
      { name: 'Encode', sub: 'conditioning' },
    ] },
    { label: 'Start', edge: 'right', blocks: [
      { name: 'Random noise', sub: 'seed', highlight: true },
    ] },
    { label: 'Denoise', edge: 'right', blocks: [
      { name: 'Diffusion', sub: 'steps', highlight: true },
      { name: 'Guided', sub: 'by prompt' },
    ] },
    { label: 'Output', edge: 'none', blocks: [
      { name: 'Image', sub: 'generated' },
      { name: 'Disclose', sub: 'AI-made' },
    ] },
  ] },
  flow: [
    { t: 'Take the text prompt', k: 'start' },
    { t: 'Encode prompt (conditioning)', k: 'proc' },
    { t: 'Start from random noise', k: 'proc' },
    { t: 'Denoise one step (guided by prompt)', k: 'proc' },
    { t: 'More steps?', k: 'dec', yes: 'Denoise one step (guided by prompt)', no: 'Output image (disclose AI-made)' },
    { t: 'Output image (disclose AI-made)', k: 'end', back: 'Take the text prompt' },
  ],

  principle: [
    'Diffusion models generate images through an idea that sounds impossible until you see it work: <b>learn to undo noise, then run it backwards</b>. During training, the model is shown images that have been progressively corrupted by adding random Gaussian noise in many small steps — from a clean image, to a slightly noisy one, all the way to pure static. The model\'s task is simply to look at a noisy image and <b>predict the noise that was added</b> (equivalently, predict a slightly cleaner version). That is a well-defined, learnable objective, and it is all the model ever learns to do: denoise.',
    'The magic is in <b>generation</b>, which reverses the process. You start not from an image but from <b>pure random noise</b>, and repeatedly apply the model to remove a little noise at each step. Because the model has learned what "less noisy, more image-like" looks like across the whole distribution of training images, this iterative denoising <b>hallucinates a coherent image out of static</b> — each step nudges the random pixels toward something that looks like a real image, until a clear picture emerges. Generation is denoising from noise; there is no image hidden in the static, the model <i>constructs</i> one consistent with what it learned.',
    '<b>Text conditioning</b> is what makes it controllable and useful. The prompt is encoded by a text model into a representation that is fed into the denoising network, so at every step the model is guided toward images that match the description — "steer the denoising toward <i>this</i> region of image space". Techniques like classifier-free guidance strengthen how firmly the prompt pulls the result. This is why prompting is a skill: the text is the steering wheel for a process that would otherwise wander to a random image, and details, style words and negative prompts all shape where it lands. Practically, because training a diffusion model needs <b>enormous data and compute</b>, almost all projects (and this one) use a <b>pretrained</b> model and focus on generation, conditioning and control — which is where the accessible learning and creativity live.',
    'The reason ethics sit at the centre of this project, not the margins, is that a tool which fabricates realistic images from text is <b>dual-use in serious ways</b>. It enables <b>deepfakes and misinformation</b> — convincing fake images of real people doing things they never did, or events that never happened — which can deceive and harm. It raises hard <b>copyright and consent</b> questions, because models are trained on vast image sets that include <b>artists\' work used without permission</b>, and can imitate living artists\' styles. It can <b>amplify bias</b>, producing stereotyped or skewed imagery reflecting imbalances in its training data. Responsible use is therefore a design requirement: <b>do not generate deceptive imagery of real people or real events</b>, respect copyright and artists (and the concerns around training data), be alert to and mitigate bias, and be <b>transparent that images are AI-generated</b> so they are not mistaken for real photographs. Alongside the ethics, honest expectations matter too: outputs are <b>imperfect</b> (the notorious garbled hands and text, sensitivity to prompt wording) and generation is <b>compute-hungry</b>. Built with capability and responsibility held together — understanding diffusion, prompting and control, while refusing the deceptive uses and disclosing AI origin — the project delivers a genuinely remarkable creative tool and a serious lesson in the promise and the peril of generative AI.',
  ],
  equations: [
    { t: 'Forward noising (training)', eq: 'Add noise to an image over T small steps:\n  x_0 (clean) → x_1 → ... → x_T (pure noise)\n  x_t = √(α_t)·x_0 + √(1−α_t)·ε,   ε ~ N(0, I)\n\nModel learns to predict the noise ε at each step.' },
    { t: 'Reverse denoising (generation)', eq: 'Start from x_T = pure random noise.\nfor t = T ... 1:\n  ε̂ = model(x_t, t, text)      # predict noise, guided by prompt\n  x_{t-1} = denoise(x_t, ε̂)     # a little cleaner\n→ x_0 = a coherent image out of static.' },
    { t: 'Text conditioning (guidance)', eq: 'c = encode(prompt)\nε̂ = ε(x_t, t, c)  steered toward the prompt\n(classifier-free guidance strengthens the pull)\n\nThe prompt is the steering wheel of the denoising.' },
  ],

  ai: {
    task: 'Generate images from text prompts using a (pretrained) text-conditioned diffusion model — reverse denoising from noise, guided by the prompt — built with responsible-use safeguards.',
    dataset: [
      'Diffusion models are trained on very large image–text datasets. Most projects use a PRETRAINED model rather than training from scratch (which needs enormous data/compute).',
      'Training-data provenance raises copyright/consent issues that responsible use must respect.',
    ],
    datasetTable: [
      { n: 'Pretrained diffusion model', size: 'Large (weights)', lic: 'Model terms', use: 'Generation (no scratch training)' },
      { n: 'Image–text training data', size: 'Web-scale', lic: 'Contested (consent/copyright)', use: 'How the model was trained' },
      { n: 'Fine-tune set (optional)', size: 'Small', lic: 'Yours/licensed', use: 'Style/domain adaptation (with rights)' },
      { n: 'Safety/consent filters', size: '—', lic: '—', use: 'Prevent deceptive/harmful use' },
    ],
    preprocess: [
      'Encode the text prompt for conditioning; set seed and guidance.',
      'Configure resolution/steps within compute limits.',
      'Apply content/safety filtering to prompts and outputs.',
    ],
    pipeline: [
      { name: 'Prompt', sub: 'text', highlight: true },
      { name: 'Encode', sub: 'conditioning' },
      { name: 'Noise', sub: 'seed' },
      { name: 'Denoise', sub: 'diffusion steps', highlight: true },
      { name: 'Image', sub: 'disclose AI' },
    ],
    archTable: [
      { l: 'Text encoder', s: 'prompt → conditioning', p: 'Steer generation' },
      { l: 'Denoising net (U-Net/transformer)', s: 'predicts noise per step', p: 'Learned denoising' },
      { l: 'Sampler', s: 'reverse diffusion steps', p: 'Noise → image' },
      { l: 'Guidance', s: 'classifier-free', p: 'Prompt adherence' },
      { l: 'Safety', s: 'filters/consent/disclosure', p: 'Responsible use' },
    ],
    hyper: [
      { k: 'Steps', v: '≈ 20–50', w: 'Quality vs speed' },
      { k: 'Guidance scale', v: '≈ 5–9', w: 'Prompt adherence vs diversity' },
      { k: 'Seed', v: 'set', w: 'Reproducibility/variation' },
      { k: 'Resolution', v: 'GPU-bound', w: 'Detail vs VRAM/time' },
    ],
    training: [
      'Use a pretrained model; optionally fine-tune (with rights) for a style/domain.',
      'Focus effort on prompting, guidance and control rather than training from scratch.',
      'Configure safety filters and disclosure.',
    ],
    metricsIntro: [
      'Image quality is largely subjective/aesthetic, with prompt adherence and diversity as practical measures — and responsible-use compliance as a first-class requirement.',
    ],
    metrics: [
      { m: 'Prompt adherence', v: 'guidance-tuned', d: 'Matches the description' },
      { m: 'Image quality', v: 'subjective', d: 'Aesthetic/coherence' },
      { m: 'Diversity', v: 'seed/guidance', d: 'Variation across runs' },
      { m: 'Responsible use', v: 'enforced', d: 'No deception; disclosure; rights' },
    ],
    chart: { title: 'Guidance scale trade-off', unit: '', desc: 'Higher guidance follows the prompt more closely but reduces diversity and can look over-baked — a control to tune (illustrative).', bars: [
      { label: 'Low guidance', value: 55 },
      { label: 'Medium', value: 85 },
      { label: 'High', value: 78 },
      { label: 'Very high', value: 60 },
    ] },
    inference: { file: 'generate.py', lang: 'python', body: `import torch

def generate(prompt, pipe, steps=30, guidance=7.5, seed=None, negative=None):
    # Responsible use: refuse deceptive imagery of real people/events.
    if violates_policy(prompt):
        return {"error": "prompt refused (deceptive/harmful/rights)"}

    g = torch.Generator().manual_seed(seed) if seed is not None else None
    image = pipe(                          # start from noise, denoise guided
        prompt=prompt,
        negative_prompt=negative,         # steer away from unwanted content
        num_inference_steps=steps,        # reverse diffusion steps
        guidance_scale=guidance,          # prompt adherence
        generator=g,
    ).images[0]
    return {"image": tag_ai_generated(image),   # disclose AI origin
            "prompt": prompt}
    # Outputs are imperfect (e.g. hands); compute-hungry; ethics are central.` },
    limits: [
      'Outputs are imperfect (mangled hands/text) and sensitive to prompt wording.',
      'Compute-hungry; training from scratch is infeasible for most — use pretrained.',
      'Ethics are central: deepfakes/misinformation, copyright/consent, bias.',
      'Be transparent that images are AI-generated; respect artists and rights.',
    ],
  },

  assembly: [
    { h: 'Set up a pretrained diffusion pipeline', p: [
      'Load a pretrained text-to-image diffusion model and generate from prompts with controls (steps, guidance, seed, negatives).',
    ], warn: 'Ethics are central, not optional. Do not generate deceptive imagery of real people or events; respect copyright and artists and the concerns around training data; be alert to bias; and disclose that images are AI-generated.' },
    { h: 'Understand and tune generation', p: [
      'See how denoising from noise, guided by the prompt, produces the image; tune guidance/steps/seed for the result.',
    ] },
    { h: 'Add safeguards and disclosure', p: [
      'Apply content/consent filters, refuse deceptive uses, and tag outputs as AI-generated.',
    ] },
  ],
  steps: [
    { h: 'Generate from a prompt with controls and safeguards', p: [
      'Refuse deceptive prompts, then generate by denoising from noise guided by the prompt, tuning guidance/steps/seed, and disclose AI origin.',
    ], code: {
      file: 'gen.py', lang: 'python',
      body: `import torch

def generate(prompt, pipe, steps=30, guidance=7.5, seed=None, negative=None):
    if violates_policy(prompt):                 # ethics FIRST
        return {"error": "refused: deceptive/harmful/rights"}   # e.g. real-person deepfake
    g = torch.Generator().manual_seed(seed) if seed is not None else None
    img = pipe(prompt=prompt, negative_prompt=negative,
               num_inference_steps=steps,       # reverse diffusion steps
               guidance_scale=guidance,         # prompt adherence
               generator=g).images[0]           # noise -> image
    return {"image": tag_ai_generated(img), "prompt": prompt}   # disclose`,
      explain: [
        { ref: 'if violates_policy(prompt):                 # ethics FIRST', txt: 'Responsible use is enforced up front — deceptive imagery of real people/events and rights-violating prompts are refused before any generation.' },
        { ref: 'num_inference_steps=steps,       # reverse diffusion steps', txt: 'Generation runs the learned denoising in reverse over many steps, turning random noise into a coherent image.' },
        { ref: 'guidance_scale=guidance,         # prompt adherence', txt: 'Guidance controls how firmly the prompt steers the denoising — the main dial between fidelity to the prompt and diversity.' },
        { ref: 'return {"image": tag_ai_generated(img), "prompt": prompt}   # disclose', txt: 'Outputs are tagged as AI-generated for transparency, so they are not mistaken for real photographs.' },
      ],
    } },
    { h: 'Iterate on prompting and control', p: [
      'Refine prompts, negatives, guidance and seeds to get the desired image, accepting imperfections and compute costs.',
    ], tip: 'Prompting is the steering wheel: specific descriptions, style words, negative prompts and guidance scale together decide where the denoising lands — small wording changes can change the result a lot.' },
  ],

  code: [{
    file: 'image_generator.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Generative Image Model (diffusion, text-to-image)

Generates images by reversing learned denoising: start from random
noise and denoise step by step, GUIDED BY THE TEXT PROMPT. Uses a
PRETRAINED diffusion model. Ethics are central: refuse deceptive imagery
of real people/events, respect copyright/consent, mitigate bias, DISCLOSE
AI origin. Outputs are imperfect; generation is compute-hungry.
"""
import torch

class ImageGenerator:
    def __init__(self, pipe, policy):
        self.pipe = pipe          # pretrained diffusion pipeline
        self.policy = policy      # responsible-use checks

    def generate(self, prompt, steps=30, guidance=7.5, seed=None, negative=None):
        # 1) Responsible use FIRST — refuse deceptive/harmful/rights-violating prompts
        verdict = self.policy.check(prompt)
        if not verdict.ok:
            return {"error": f"refused: {verdict.reason}"}

        # 2) Generate: denoise from noise, guided by the prompt
        g = torch.Generator().manual_seed(seed) if seed is not None else None
        image = self.pipe(
            prompt=prompt,
            negative_prompt=negative,          # steer away from unwanted content
            num_inference_steps=steps,         # reverse diffusion steps
            guidance_scale=guidance,           # prompt adherence
            generator=g,                       # reproducible seed
        ).images[0]

        # 3) Transparency — mark as AI-generated
        return {"image": tag_ai_generated(image), "prompt": prompt,
                "note": "AI-generated; imperfect; ethics enforced"}

if __name__ == "__main__":
    gen = ImageGenerator(load_diffusion_pipeline(), ResponsibleUsePolicy())
    out = gen.generate("a lighthouse at sunset, oil painting", guidance=8.0)
    # No deepfakes of real people/events; respect artists/rights; disclose AI.`,
    explain: [
      { ref: 'verdict = self.policy.check(prompt)', txt: 'Every prompt passes a responsible-use check first — deception, harm and rights violations are refused before generation, making ethics a built-in gate.' },
      { ref: 'num_inference_steps=steps,         # reverse diffusion steps', txt: 'The image is produced by reversing the learned denoising process over many steps — noise becomes image.' },
      { ref: 'guidance_scale=guidance,           # prompt adherence', txt: 'Guidance tunes how strongly the prompt steers the result — the core control of text-conditioned diffusion.' },
      { ref: 'return {"image": tag_ai_generated(image), "prompt": prompt,', txt: 'Outputs are disclosed as AI-generated, so they are not passed off as real photographs — transparency by design.' },
      { ref: '# No deepfakes of real people/events; respect artists/rights; disclose AI.', txt: 'The central ethical commitments are stated in the code itself, not left implicit.' },
    ],
  }],

  config: [
    'Configure the pretrained diffusion model and text encoder.',
    'Configure steps, guidance, seed and negative prompts.',
    'Configure resolution within GPU/VRAM limits.',
    'Configure responsible-use policy, filters and AI-disclosure.',
  ],
  calibration: [
    { h: 'Generation controls', p: [
      'Tune guidance/steps/seed for the quality and adherence you want.',
    ] },
    { h: 'Prompting', p: [
      'Refine prompts and negatives; note sensitivity to wording.',
    ] },
    { h: 'Safeguards', p: [
      'Verify the policy refuses deceptive/harmful prompts and outputs are disclosed.',
    ] },
  ],
  testing: [
    { step: 'Generate a benign creative prompt', expect: 'Coherent image matching the prompt' },
    { step: 'Raise guidance scale', expect: 'Closer to prompt, less diverse' },
    { step: 'Change the seed', expect: 'Different image, same prompt' },
    { step: 'Prompt a real-person deepfake', expect: 'Refused (responsible use)' },
    { step: 'Generate hands/text', expect: 'Often imperfect — note limits' },
    { step: 'Check output labelling', expect: 'Marked AI-generated' },
  ],
  output: [
    'Original images from text prompts, with controls, safeguards and AI-origin disclosure.',
    { file: 'generation.json', lang: 'json', body: `{
  "prompt": "a lighthouse at sunset, oil painting",
  "steps": 30,
  "guidance": 8.0,
  "seed": 12345,
  "ai_generated": true,
  "note": "no deception; respect rights; imperfect outputs"
}` },
    'A creative image generated from a text prompt with reproducible controls, tagged AI-generated — the capability delivered within responsible-use boundaries.',
  ],
  troubleshoot: [
    { sym: 'Ignores the prompt', cause: 'Low guidance/vague prompt', fix: 'Raise guidance; write specific prompts; use negatives' },
    { sym: 'Over-baked/artefacts', cause: 'Guidance too high/few steps', fix: 'Lower guidance; more steps' },
    { sym: 'Mangled hands/text', cause: 'Known model limitation', fix: 'Accept/inpaint; different model; note limits' },
    { sym: 'Out of memory', cause: 'Resolution/VRAM', fix: 'Lower resolution; use an API; smaller model' },
    { sym: 'Harmful/deceptive request', cause: 'Misuse', fix: 'Refuse via policy; no real-person/event deepfakes' },
    { sym: 'Undisclosed AI images', cause: 'No labelling', fix: 'Tag outputs as AI-generated' },
  ],

  perf: [
    'Use a pretrained model; tune guidance/steps/seed for results.',
    'Manage resolution to VRAM; use an API if needed.',
    'Prompt specifically; use negatives for control.',
    'Enforce responsible-use policy and disclosure.',
  ],
  safety: [
    'Do not generate deceptive imagery of real people or events — deepfakes and misinformation are the central risk.',
    'Respect copyright, artists and consent, including concerns about training data.',
    'Be alert to and mitigate bias in outputs.',
    'Be transparent that images are AI-generated.',
  ],
  maintenance: [
    'Update models and safety filters as they improve.',
    'Review outputs for bias and misuse.',
    'Keep disclosure and consent practices current.',
    'Track evolving law/norms on generative imagery.',
  ],
  future: [
    'Add controllable generation (inpainting, ControlNet-style).',
    'Add provenance/watermarking for AI images.',
    'Add safer, rights-respecting fine-tuning workflows.',
    'Add stronger bias evaluation and mitigation.',
  ],
  faq: [
    { q: 'How does diffusion generate an image?', a: 'It learns to remove noise from images, then runs that in reverse: starting from pure random noise, it denoises step by step until a coherent image emerges. There is no image hidden in the noise — the model constructs one consistent with what it learned.' },
    { q: 'How does the text prompt control it?', a: 'The prompt is encoded and fed into the denoising network, steering each step toward images that match the description. Guidance scale strengthens that pull, which is why prompting and guidance are the main controls.' },
    { q: 'Do I need to train the model?', a: 'No — training from scratch needs enormous data and compute. Almost all projects use a pretrained diffusion model and focus on generation, prompting and control, which is where the accessible learning is.' },
    { q: 'Why are ethics central here?', a: 'Because a tool that fabricates realistic images is seriously dual-use: it enables deepfakes and misinformation, raises copyright and consent issues (training on artists\' work), and can amplify bias. Responsible use — no deceptive imagery of real people/events, respecting rights, disclosing AI origin — is a design requirement, not an afterthought.' },
    { q: 'Why are the outputs sometimes wrong (e.g. hands)?', a: 'Diffusion models still struggle with fine structure like hands and legible text, and are sensitive to prompt wording. Outputs are impressive but imperfect, and generation is compute-hungry.' },
  ],
  refs: [
    { t: 'Diffusion model', u: 'https://en.wikipedia.org/wiki/Diffusion_model', s: 'Reference' },
    { t: 'Text-to-image generation', u: 'https://en.wikipedia.org/wiki/Text-to-image_model', s: 'Reference' },
    { t: 'Deepfakes / synthetic media', u: 'https://en.wikipedia.org/wiki/Deepfake', s: 'Reference' },
    { t: 'AI art and copyright', u: 'https://en.wikipedia.org/wiki/Artificial_intelligence_art#Copyright', s: 'Reference' },
    { t: 'Classifier-free guidance', u: 'https://en.wikipedia.org/wiki/Diffusion_model#Guidance', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'cnn'],
  imageCaptions: [
    'A diffusion model turns a text prompt into an original image — by reversing the gradual addition of noise.',
    'Generation starts from pure noise and denoises step by step, guided by the prompt, into a coherent picture.',
    'Ethics are central: no deepfakes of real people/events, respect for artists and rights, and clear AI disclosure.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A15 — AI Code Assistant
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A15',
  domainKey: 'ai',
  emoji: '👨‍💻', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'An LLM-powered helper that explains, writes and refactors code — a capable pair-programmer you must always review, never blindly trust.',
  platformName: 'CPU/GPU workstation or server (+ code-LLM API optional)',
  ide: 'Python 3.11 + code LLM / tooling',

  overview: [
    'Large language models trained on code have become genuinely useful programming assistants — they can explain unfamiliar code, write functions from a description, translate between languages, spot bugs, and refactor for clarity. This project builds an <b>AI code assistant</b> around a code-capable LLM: a helper that <b>explains, writes and refactors code</b> in response to natural-language requests, integrated into a workflow so it can actually assist real development.',
    'The core is <b>prompting a code LLM well and wrapping it in useful workflows</b>. The model does the heavy lifting of understanding and generating code; the project is about giving it the right <b>context</b> (the relevant code, the request, the language and conventions), structuring tasks (explain this / implement that / refactor this / find the bug), and presenting results usefully. Better assistants add <b>context management</b> (feeding in the relevant files, not the whole codebase), <b>iterative</b> interaction (refine on feedback), and integration with the tools a developer already uses.',
    'The value is a capable pair-programmer that accelerates understanding and routine coding. But the honesty here is a hard, non-negotiable rule that the whole design is built around: <b>the assistant is often confidently wrong</b>, and generated code must <b>always be reviewed, tested and understood before use</b> — never trusted blindly. It can produce <b>subtly buggy</b> code that looks right, introduce <b>security vulnerabilities</b>, hallucinate non-existent APIs, and reflect outdated practices; and pasting proprietary code into a third-party model raises real <b>privacy/IP</b> concerns. A good assistant is a <b>tool that augments a developer\'s judgement, not replaces it</b> — you remain responsible for the code. Built with that principle front and centre — strong prompting and context, but always human review — it is both a genuinely productive tool and an essential lesson in using LLMs responsibly for a task where wrong answers ship real bugs.',
  ],
  does: [
    'Explains unfamiliar code in plain language',
    'Writes code from natural-language descriptions',
    'Refactors code for clarity/structure',
    'Helps find and fix bugs',
    'Manages context (relevant code, request, conventions)',
    'Supports iterative refinement',
    'Requires human review of all output — never blind trust',
  ],
  features: [
    'Explain / write / refactor / debug workflows',
    'Code-LLM prompting and context management',
    'Iterative interaction',
    'Tool/workflow integration',
    'Review-first design (test/understand before use)',
    'Security/IP awareness',
    'Honest about confident wrongness and responsibility',
  ],
  applications: [
    { t: 'Developer productivity', d: 'Explaining, drafting and refactoring code faster.' },
    { t: 'Learning / onboarding', d: 'Understanding unfamiliar code and patterns.' },
    { t: 'Code review support', d: 'Suggesting improvements (human-reviewed).' },
    { t: 'Prototyping', d: 'Quickly drafting code to iterate on.' },
  ],
  skills: [
    'Prompting code LLMs and context management',
    'Structuring explain/write/refactor/debug tasks',
    'Iterative interaction and tool integration',
    'Reviewing/testing AI-generated code critically',
    'Security and IP awareness',
  ],
  prereq: [
    'A code assistant augments a developer\'s judgement — it does not replace it.',
    'Give the model the right context (relevant code, request, conventions).',
    'The assistant is often confidently wrong — always review, test, understand.',
    'Mind security vulnerabilities and IP/privacy of code you share.',
  ],

  parts: [],
  extraParts: [
    { name: 'Compute + code LLM', spec: 'CPU/GPU; a code-capable LLM (local or API)', qty: 1, price: 0 },
    { name: 'Context tooling', spec: 'Retrieve/assemble relevant code as context', qty: 1, price: 0 },
    { name: 'Review/test harness', spec: 'Run/test generated code before use', qty: 1, price: 0, note: 'Review is mandatory' },
    { name: 'Editor/tool integration', spec: 'Hook into the developer workflow', qty: 1, price: 0 },
  ],
  cost: 'Software; compute/API-dependent',
  libs: ['python', 'transformers', 'fastapi', 'sqlite'],
  hardwareNotes: [
    'This is a pure-software developer tool — no electronic hardware to specify. The "platform" is a computer plus a code-capable LLM: a GPU (local model) or a hosted code-LLM API handles generation, and a CPU handles context assembly and running tests.',
    'Memory and storage scale with the codebase indexed for context and the interaction history. A deployment adds editor/workflow integration and a sandbox for safely running generated code. Everything else is the software stack, models and libraries below.',
  ],

  wiringIntro: 'The "wiring" is the assistant data flow — a request plus relevant code context goes to a code LLM, whose output is returned to the developer for mandatory review, testing and understanding before use.',
  pins: {
    left: [
      { dev: 'Request + code', devPin: 'context', pin: '—', sig: 'Task + relevant code' },
      { dev: 'Code LLM', devPin: 'generate', pin: '—', sig: 'Explain/write/refactor' },
    ],
    right: [
      { dev: 'Human review', devPin: 'verify', pin: '—', sig: 'Read/test/understand' },
      { dev: 'Use in code', devPin: 'apply', pin: '—', sig: 'Only after review' },
    ],
  },
  wiringNotes: [
    'Assemble the request with the relevant code context (not the whole codebase) and conventions.',
    'Send to a code LLM to explain, write, refactor or debug.',
    'Return the output to the developer for review, testing and understanding.',
    'Only apply code after it is reviewed, tested and understood — never blindly.',
    'Mind security vulnerabilities and the IP/privacy of shared code.',
  ],

  block: { columns: [
    { label: 'Ask', edge: 'right', blocks: [
      { name: 'Request', sub: 'explain/write/fix', highlight: true },
      { name: 'Context', sub: 'relevant code' },
    ] },
    { label: 'Generate', edge: 'right', blocks: [
      { name: 'Code LLM', sub: 'output', highlight: true },
    ] },
    { label: 'Review', edge: 'right', blocks: [
      { name: 'Human', sub: 'read/test', highlight: true },
      { name: 'Understand', sub: 'before use' },
    ] },
    { label: 'Apply', edge: 'none', blocks: [
      { name: 'Use', sub: 'only if verified' },
    ] },
  ] },
  flow: [
    { t: 'Developer makes a request', k: 'start' },
    { t: 'Assemble relevant code context', k: 'proc' },
    { t: 'Code LLM: explain/write/refactor/fix', k: 'proc' },
    { t: 'Developer reviews + tests', k: 'proc' },
    { t: 'Correct, secure, understood?', k: 'dec', yes: 'Use the code', no: 'Refine / discard' },
    { t: 'Refine / discard', k: 'io', back: 'Developer makes a request' },
    { t: 'Use the code', k: 'end' },
  ],

  principle: [
    'A code-trained LLM is a remarkably capable programming assistant because so much of programming is <b>pattern and language</b>: understanding what code does, expressing an intent as code, translating idioms, and reshaping structure are all tasks these models have learned from vast amounts of source code. The practical project, then, is not building the intelligence — the pretrained model supplies that — but <b>eliciting it well and wrapping it in a workflow</b>: giving the model the right context, structuring the common tasks (explain, write, refactor, debug), and integrating results into how a developer actually works.',
    '<b>Context is the lever that most determines quality.</b> An LLM answers based on what it is given, so a good assistant supplies the <b>relevant code</b> (the function to refactor, the surrounding types, the file in question), the <b>request</b> stated clearly, and the <b>language and conventions</b> in use — while <i>not</i> dumping the entire codebase (which exceeds context limits and buries the signal). Managing this context — retrieving the pertinent pieces, keeping interactions iterative so the developer can refine on feedback — is where a basic prompt becomes a useful tool. The common workflows fall out naturally: "explain this code" (comprehension), "write a function that…" (generation), "refactor this for clarity" (transformation), "why is this failing?" (debugging).',
    'The absolutely central principle — the one the entire design must be built around — is that <b>the assistant is often confidently wrong, and its output must always be reviewed, tested and understood before use</b>. This is not a minor caveat; it is the defining property of the tool. A code LLM produces fluent, plausible code that <i>looks</i> correct, which makes its errors especially dangerous: it can generate <b>subtly buggy</b> logic that passes a glance but fails on edge cases, <b>hallucinate APIs or functions that do not exist</b>, introduce <b>security vulnerabilities</b> (injection flaws, unsafe defaults, leaked secrets), and reproduce <b>outdated or bad practices</b> from its training data. Because the output is confident and fluent, a developer who trusts it blindly ships real bugs and real vulnerabilities. So the workflow must make <b>human review non-optional</b>: read it, test it, understand <i>why</i> it works, and only then use it.',
    'That leads to the correct framing of the whole tool: it <b>augments a developer\'s judgement, it does not replace it</b>. The developer remains <b>responsible for the code</b> — the assistant is a fast, knowledgeable pair-programmer whose every suggestion you evaluate, not an oracle you obey. Two further honest concerns round out responsible use: <b>security</b> (treat generated code as untrusted until reviewed; never run it against production without scrutiny) and <b>IP/privacy</b> (pasting proprietary or sensitive code into a third-party model may expose it, and licensing of generated code can be unclear). Built with these principles at the centre — strong context and prompting for capability, mandatory review and clear developer responsibility for safety — the assistant becomes genuinely productive (it accelerates comprehension and routine coding enormously) while teaching the essential discipline of using LLMs for a task where a wrong answer is not a typo but a bug in production.',
  ],
  equations: [
    { t: 'Context-driven assistance', eq: 'output = code_LLM(request + RELEVANT_context + conventions)\n\nQuality tracks context: give the pertinent code (not the whole\ncodebase), a clear request, and the language/conventions.' },
    { t: 'The core workflows', eq: 'explain(code)     → plain-language description\nwrite(spec)       → code from a description\nrefactor(code)    → clearer/structured code (same behaviour)\ndebug(code, err)  → likely cause + fix\n\nAll wrapped around a capable code LLM.' },
    { t: 'Review is non-negotiable', eq: 'NEVER use output blindly:\n  read → TEST → understand WHY → only then use\n\nrisks: subtle bugs, hallucinated APIs, security holes, bad\npractices. Assistant AUGMENTS judgement; developer OWNS the code.' },
  ],

  ai: {
    task: 'Assist developers by explaining, writing, refactoring and debugging code with a code-capable LLM, driven by relevant context — with mandatory human review of all output.',
    dataset: [
      'Code LLMs are pretrained on large code corpora; this project uses a pretrained model and focuses on context, prompting and workflow.',
      'The relevant "data" at use time is the code context supplied per request.',
    ],
    datasetTable: [
      { n: 'Code LLM (pretrained)', size: 'Large', lic: 'Model terms', use: 'Explain/write/refactor/debug' },
      { n: 'Your codebase (context)', size: 'Per request', lic: 'Yours (mind IP)', use: 'Relevant context to the model' },
      { n: 'Conventions/style guide', size: 'Small', lic: 'Yours', use: 'Match project conventions' },
      { n: 'Test suite', size: 'Yours', lic: 'Yours', use: 'Verify generated code' },
    ],
    preprocess: [
      'Retrieve/assemble the relevant code context for the request (not the whole codebase).',
      'State the request clearly with language/conventions.',
      'Prepare tests to verify output; sandbox for safe execution.',
    ],
    pipeline: [
      { name: 'Request', sub: 'task', highlight: true },
      { name: 'Context', sub: 'relevant code' },
      { name: 'Code LLM', sub: 'generate', highlight: true },
      { name: 'Review + test', sub: 'human' },
      { name: 'Use', sub: 'if verified' },
    ],
    archTable: [
      { l: 'Context manager', s: 'retrieve relevant code', p: 'Quality tracks context' },
      { l: 'Code LLM', s: 'pretrained code model', p: 'Explain/write/refactor/debug' },
      { l: 'Task templates', s: 'structured prompts', p: 'Consistent workflows' },
      { l: 'Review/test harness', s: 'run + verify (sandbox)', p: 'Never trust blindly' },
      { l: 'Guardrails', s: 'security/IP checks', p: 'Safe, responsible use' },
    ],
    hyper: [
      { k: 'Context selection', v: 'relevant only', w: 'Signal vs limits' },
      { k: 'Temperature', v: 'low-ish', w: 'Reliable vs creative code' },
      { k: 'Iteration', v: 'on feedback', w: 'Refine to correct' },
      { k: 'Review gate', v: 'mandatory', w: 'Correctness/security' },
    ],
    training: [
      'Use a pretrained code LLM; no training needed — focus on context, prompting, workflow.',
      'Optionally add project conventions/examples to the context.',
      'Always run generated code through tests before use.',
    ],
    metricsIntro: [
      'Useful metrics are practical: correctness after review, security of suggestions, and productivity — but the governing rule is that all output is reviewed.',
    ],
    metrics: [
      { m: 'Correctness (post-review)', v: 'developer-verified', d: 'After test/understand' },
      { m: 'Security of suggestions', v: 'checked', d: 'No injected vulnerabilities' },
      { m: 'Productivity', v: 'improved', d: 'Faster comprehension/coding' },
      { m: 'Blind-trust incidents', v: 'zero (goal)', d: 'Always review' },
    ],
    chart: { title: 'Why review is mandatory', unit: '', desc: 'A large share of AI-generated code looks right but needs fixing, and some carries security issues — hence mandatory review (illustrative).', bars: [
      { label: 'Correct as-is', value: 55 },
      { label: 'Needs fixing', value: 35 },
      { label: 'Security concern', value: 15 },
      { label: 'Hallucinated API', value: 10 },
    ] },
    inference: { file: 'assist.py', lang: 'python', body: `def assist(task, code, request, llm, conventions=""):
    # Give the model RELEVANT context (not the whole codebase).
    prompt = (f"Task: {task}\\nConventions: {conventions}\\n"
              f"Code:\\n{code}\\n\\nRequest: {request}")
    output = llm.generate(prompt)               # explain/write/refactor/debug

    # THE RULE: never use blindly. Return for mandatory human review.
    return {
        "output": output,
        "must_review": True,                    # read it
        "must_test": True,                      # test it
        "must_understand": True,                # understand WHY before use
        "warning": "may be confidently wrong; check for bugs/security",
    }
    # The assistant augments judgement; the developer owns the code.` },
    limits: [
      'Often confidently wrong — subtle bugs, hallucinated APIs, security holes, outdated practices.',
      'All output must be reviewed, tested and understood before use.',
      'Sharing proprietary code with a third-party model raises IP/privacy concerns.',
      'It augments a developer\'s judgement; it does not replace responsibility for the code.',
    ],
  },

  assembly: [
    { h: 'Wrap a code LLM with context and workflows', p: [
      'Assemble the relevant code context and request, and structure the explain/write/refactor/debug tasks around a code LLM.',
    ], warn: 'The assistant is often confidently wrong. All generated code MUST be reviewed, tested and understood before use — never trusted blindly. It can produce subtle bugs, security vulnerabilities and hallucinated APIs. The developer remains responsible for the code.' },
    { h: 'Add a review/test gate', p: [
      'Return output for mandatory review, run it through tests in a sandbox, and only use it once verified and understood.',
    ] },
    { h: 'Handle security and IP', p: [
      'Treat generated code as untrusted until reviewed, and be careful about sharing proprietary code with third-party models.',
    ] },
  ],
  steps: [
    { h: 'Assist with context, then gate on review', p: [
      'Give the model relevant context to explain/write/refactor/debug, and return output flagged for mandatory review, testing and understanding.',
    ], code: {
      file: 'assist.py', lang: 'python',
      body: `def assist(task, code, request, llm, conventions=""):
    prompt = (f"Task: {task}\\nConventions: {conventions}\\n"
              f"Code:\\n{code}\\n\\nRequest: {request}")     # RELEVANT context
    output = llm.generate(prompt)                # explain/write/refactor/debug
    return {                                     # never use blindly:
        "output": output,
        "review_required": True,                 # read + test + understand
        "warning": "may be confidently wrong — check bugs/security before use",
    }`,
      explain: [
        { ref: 'f"Code:\\n{code}\\n\\nRequest: {request}")     # RELEVANT context', txt: 'The model is given the pertinent code and a clear request — quality tracks the context supplied, not the whole codebase.' },
        { ref: 'output = llm.generate(prompt)                # explain/write/refactor/debug', txt: 'One capable code LLM handles all the core workflows through structured prompts.' },
        { ref: '"review_required": True,                 # read + test + understand', txt: 'Output is returned with a mandatory-review flag — the non-negotiable gate that prevents shipping confidently-wrong code.' },
        { ref: '"warning": "may be confidently wrong — check bugs/security before use",', txt: 'The warning makes explicit that fluent output can be subtly buggy or insecure, so it must be verified.' },
      ],
    } },
    { h: 'Review, test, iterate', p: [
      'Read and understand the output, run tests, iterate on feedback, and only apply code once verified — the developer owns the result.',
    ], tip: 'Understand why it works before using it. Code you cannot explain is code you cannot maintain or trust — the assistant should deepen your understanding, not bypass it.' },
  ],

  code: [{
    file: 'code_assistant.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
AI Code Assistant

Explains, writes, refactors and debugs code with a code LLM, driven by
RELEVANT context. THE RULE: the assistant is often confidently wrong, so
ALL output must be reviewed, tested and understood before use — never
trusted blindly. It augments the developer's judgement; the developer
owns the code. Mind security vulnerabilities and IP/privacy.
"""
class CodeAssistant:
    def __init__(self, llm, sandbox):
        self.llm = llm; self.sandbox = sandbox

    def _ask(self, task, request, code="", conventions=""):
        prompt = (f"Task: {task}\\n"
                  f"Conventions: {conventions}\\n"
                  f"{'Code:\\n' + code if code else ''}\\n"
                  f"Request: {request}")                 # relevant context
        return self.llm.generate(prompt)

    def explain(self, code):            return self._ask("explain", "Explain this code", code)
    def write(self, spec, conv=""):     return self._ask("write", spec, conventions=conv)
    def refactor(self, code, goal):     return self._ask("refactor", goal, code)
    def debug(self, code, error):       return self._ask("debug", f"Fix: {error}", code)

    def propose(self, task, **kw):
        output = getattr(self, task)(**kw)
        # NEVER auto-apply. Return for MANDATORY review + testing.
        result = {"output": output, "review_required": True}
        if looks_like_code(output):
            result["test"] = self.sandbox.run_tests(output)   # verify, don't trust
        result["warning"] = ("may be confidently wrong: check for subtle bugs, "
                             "security issues, hallucinated APIs — understand before use")
        return result

if __name__ == "__main__":
    a = CodeAssistant(CodeLLM(), Sandbox())
    print(a.propose("refactor", code=open("util.py").read(), goal="clarity"))
    # The developer reviews, tests and understands before using anything.`,
    explain: [
      { ref: 'prompt = (f"Task: {task}\\n"', txt: 'Structured prompts with relevant context drive the core workflows consistently — context is the main lever on quality.' },
      { ref: 'def explain(self, code):            return self._ask("explain", "Explain this code", code)', txt: 'The common developer workflows — explain, write, refactor, debug — are thin wrappers around the same context-driven prompting.' },
      { ref: '# NEVER auto-apply. Return for MANDATORY review + testing.', txt: 'Output is never applied automatically — the mandatory-review gate is the heart of responsible use.' },
      { ref: 'result["test"] = self.sandbox.run_tests(output)   # verify, don\'t trust', txt: 'Generated code is tested in a sandbox rather than trusted, catching the confidently-wrong output that looks correct.' },
      { ref: '# The developer reviews, tests and understands before using anything.', txt: 'The governing principle — the developer owns the code and verifies before use — is stated explicitly.' },
    ],
  }],

  config: [
    'Configure the code LLM and context assembly (relevant code, conventions).',
    'Configure task workflows (explain/write/refactor/debug).',
    'Configure the mandatory review/test gate and sandbox.',
    'Configure security/IP guardrails for shared code.',
  ],
  calibration: [
    { h: 'Context', p: [
      'Verify supplying relevant context improves output quality; avoid dumping the whole codebase.',
    ] },
    { h: 'Review workflow', p: [
      'Ensure output is always reviewed and tested before use; sandbox execution.',
    ] },
    { h: 'Security/IP', p: [
      'Check for injected vulnerabilities and manage what code is shared with the model.',
    ] },
  ],
  testing: [
    { step: 'Ask it to explain code', expect: 'Useful explanation (verify accuracy)' },
    { step: 'Ask it to write a function', expect: 'Draft code — review and test before use' },
    { step: 'Refactor a snippet', expect: 'Clearer code, same behaviour (verify)' },
    { step: 'Introduce a bug to fix', expect: 'Plausible fix — confirm by testing' },
    { step: 'Check a security-sensitive request', expect: 'Reviewed; no injected vulnerability' },
    { step: 'Try to auto-apply output', expect: 'Blocked — review required' },
  ],
  output: [
    'Explanations and code drafts returned for mandatory review, testing and understanding before use.',
    { file: 'assist-result.json', lang: 'json', body: `{
  "task": "refactor",
  "review_required": true,
  "tests": "3 passed, 1 failed",
  "warning": "may be confidently wrong; understand before use",
  "note": "developer owns the code"
}` },
    'A refactor suggestion returned with test results and a review flag — one test failed, exactly why output is verified and understood rather than trusted; the developer decides.',
  ],
  troubleshoot: [
    { sym: 'Subtly buggy code', cause: 'Confident-but-wrong output', fix: 'Always test; understand why; iterate' },
    { sym: 'Hallucinated API/function', cause: 'Model invention', fix: 'Verify APIs exist; test; check docs' },
    { sym: 'Security vulnerability', cause: 'Unsafe generated code', fix: 'Review for security; sandbox; never run blindly' },
    { sym: 'Poor suggestions', cause: 'Weak/irrelevant context', fix: 'Give relevant code + clear request + conventions' },
    { sym: 'IP leak', cause: 'Proprietary code shared', fix: 'Limit what is sent; use appropriate model/policy' },
    { sym: 'Over-reliance', cause: 'Blind trust', fix: 'Augment judgement; developer owns/reviews the code' },
  ],

  perf: [
    'Supply relevant context and clear requests — quality tracks context.',
    'Always review, test and understand output before use.',
    'Iterate on feedback for correctness.',
    'Treat generated code as untrusted until verified.',
  ],
  safety: [
    'The assistant is often confidently wrong — always review, test and understand code before using it; never trust blindly.',
    'Generated code can contain security vulnerabilities — review for security and sandbox execution.',
    'Sharing proprietary code with a third-party model risks IP/privacy exposure.',
    'It augments judgement; the developer remains responsible for the code.',
  ],
  maintenance: [
    'Update the model and context tooling as they improve.',
    'Keep tests strong — they are the safety net for generated code.',
    'Review security/IP practices for shared code.',
    'Monitor for over-reliance; reinforce review discipline.',
  ],
  future: [
    'Add repository-aware retrieval for better context.',
    'Add automated security scanning of suggestions.',
    'Add tighter editor/CI integration with review gates.',
    'Add provenance/licensing checks for generated code.',
  ],
  faq: [
    { q: 'What can it actually do?', a: 'Explain unfamiliar code, write code from a description, refactor for clarity, and help debug — a capable pair-programmer driven by a code LLM and the relevant context you give it.' },
    { q: 'Why is review non-negotiable?', a: 'Because the assistant is often confidently wrong: it produces fluent code that looks correct but can be subtly buggy, hallucinate APIs, or introduce security vulnerabilities. Blind trust ships real bugs, so all output must be read, tested and understood before use.' },
    { q: 'How do I get better results?', a: 'Give it the right context — the relevant code, a clear request, and your conventions — rather than a vague prompt or the whole codebase. Quality tracks context, and iterating on feedback refines the result.' },
    { q: 'Is it safe to paste my company\'s code in?', a: 'Be careful — sending proprietary or sensitive code to a third-party model can expose it, and licensing of generated code can be unclear. Manage what you share according to your IP and privacy obligations.' },
    { q: 'Does it replace developers?', a: 'No — it augments a developer\'s judgement, it does not replace it. You remain responsible for the code: the assistant accelerates comprehension and routine coding, but every suggestion is yours to evaluate, test and understand.' },
  ],
  refs: [
    { t: 'AI code generation / assistants', u: 'https://en.wikipedia.org/wiki/Vibe_coding', s: 'Reference' },
    { t: 'Large language models', u: 'https://en.wikipedia.org/wiki/Large_language_model', s: 'Reference' },
    { t: 'LLM hallucination', u: 'https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)', s: 'Reference' },
    { t: 'Secure coding', u: 'https://en.wikipedia.org/wiki/Secure_coding', s: 'Reference' },
    { t: 'Code review', u: 'https://en.wikipedia.org/wiki/Code_review', s: 'Reference' },
  ],
  images: ['neural', 'datacentre', 'cnn'],
  imageCaptions: [
    'An AI code assistant explains, writes and refactors code — a capable pair-programmer driven by a code LLM.',
    'Quality tracks context: give the model the relevant code, a clear request, and your conventions.',
    'The non-negotiable rule: always review, test and understand output — it is often confidently wrong.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
   A16 — Wake-Word Voice Assistant
   ══════════════════════════════════════════════════════════════════ */
{
  id: 'A16',
  domainKey: 'ai',
  emoji: '🎙️', thumb: 'chip',
  difficulty: 'Advanced',
  hours: '14–20 hours', iso8601: 'PT18H',
  tagline: 'Listens for its wake word entirely on-device and handles voice commands offline — always listening, never sending your audio to the cloud.',
  platformName: 'ESP32-S3 / Raspberry Pi (edge)',
  ide: 'Python / C++ + TinyML / on-device speech',

  overview: [
    'Voice assistants feel magical but carry a real privacy cost: many are <b>always listening</b> and stream audio to the cloud to understand it. This project builds a voice assistant that keeps the listening — and ideally the understanding — <b>on the device</b>: it detects a <b>wake word</b> ("Hey Jarvis") entirely on-device, and handles a set of voice commands <b>offline</b>, so your audio never has to leave the room. It is a compelling embedded-AI project because it must run capable speech models within the tiny compute and power budget of a microcontroller or single-board computer.',
    'The heart of it is <b>wake-word detection</b>, a beautifully constrained problem. A tiny, efficient neural network runs <b>continuously</b> on the incoming audio, listening for one specific phrase — and it must be extremely <b>cheap</b> (so it can run always-on within a small power budget) yet <b>accurate</b> in two directions: few <b>false rejections</b> (it should wake when you say the word) and, critically, few <b>false accepts</b> (it must not wake at random sounds). Only <i>after</i> the wake word fires does the (heavier) command-recognition stage run, so the expensive work happens rarely. Keeping both stages <b>offline</b> — wake word plus a set of local commands — is what preserves privacy and gives instant, network-independent response.',
    'The value is a private, responsive, offline voice interface — for smart-home control, appliances, or accessibility — that isn\'t always phoning home. It is honest about the hard engineering: fitting speech models into <b>severe compute/memory/power limits</b> (this is <b>TinyML</b>), the accuracy trade-offs of a tiny model, robustness to <b>noise and accents</b>, and the reality that a small offline vocabulary is limited compared to a full cloud assistant. It is also candid that "always listening" deserves genuine privacy care even when local. Built well — an efficient always-on wake-word model, a two-stage design, and offline command handling — it is both a genuinely private voice assistant and the definitive lesson in on-device, resource-constrained speech AI.',
  ],
  does: [
    'Detects a wake word continuously on-device',
    'Handles a set of voice commands offline',
    'Keeps audio local — no cloud round-trip',
    'Runs a tiny always-on model within a small power budget',
    'Uses two stages: cheap wake word, then command recognition',
    'Responds instantly, network-independent',
    'Preserves privacy by design',
  ],
  features: [
    'On-device wake-word detection (always-on)',
    'Offline command recognition',
    'Two-stage (cheap detect → command) design',
    'Low false-accept / false-reject tuning',
    'TinyML resource-constrained models',
    'Privacy-preserving (audio stays local)',
    'Honest about small-vocabulary and noise/accent limits',
  ],
  applications: [
    { t: 'Private smart-home control', d: 'Offline voice control without cloud audio.' },
    { t: 'Voice-enabled appliances', d: 'On-device command handling in products.' },
    { t: 'Accessibility', d: 'Local voice interfaces that respond instantly.' },
    { t: 'Embedded speech / TinyML', d: 'Learning on-device speech AI.' },
  ],
  skills: [
    'Wake-word detection (efficient always-on models)',
    'On-device / offline speech command recognition',
    'TinyML (fitting models to MCU/edge limits)',
    'False-accept/false-reject tuning',
    'Privacy-preserving audio design',
  ],
  prereq: [
    'Keep audio on-device — wake word and commands run offline for privacy.',
    'The wake-word model is always-on: it must be cheap AND avoid false accepts.',
    'Two stages: cheap wake word first, heavier command recognition only after.',
    'TinyML limits (compute/memory/power) constrain accuracy and vocabulary.',
  ],

  parts: ['esp32s3', 'inmp441'],
  extraParts: [
    { name: 'Microphone (I2S/MEMS)', spec: 'Digital mic for on-device audio', qty: 1, price: 200 },
    { name: 'Edge compute', spec: 'ESP32-S3 (TinyML) or Raspberry Pi for more capable offline models', qty: 1, price: 0 },
    { name: 'Wake-word + command models', spec: 'Tiny always-on wake word; offline command recogniser', qty: 1, price: 0 },
    { name: 'Speaker/output', spec: 'Response output (beep/LED/relay/speech)', qty: 1, price: 200 },
  ],
  cost: '₹1,500 – ₹4,000',
  libs: ['python', 'tflmicro', 'edgeimpulse', 'numpy'],

  wiringIntro: 'The "wiring" combines real audio hardware and a two-stage on-device pipeline — a microphone feeds an always-on wake-word model; only after it fires does offline command recognition run, all locally.',
  pins: {
    left: [
      { dev: 'Microphone (I2S)', devPin: 'SD/WS/SCK', pin: 'GPIO', sig: 'Audio in' },
      { dev: 'Wake-word model', devPin: 'always-on', pin: '—', sig: 'Detect phrase' },
    ],
    right: [
      { dev: 'Command recogniser', devPin: 'after wake', pin: '—', sig: 'Offline command' },
      { dev: 'Output', devPin: 'LED/relay/speaker', pin: 'GPIO', sig: 'Action/response' },
    ],
  },
  wiringNotes: [
    'A digital microphone feeds audio to the device (I2S/MEMS).',
    'A tiny wake-word model runs continuously (always-on) on the audio.',
    'Only after the wake word fires does the heavier command recogniser run.',
    'Everything stays on-device — no audio leaves for the cloud.',
    'Drive an output (LED/relay/speaker) for the response.',
  ],

  block: { columns: [
    { label: 'Listen', edge: 'right', blocks: [
      { name: 'Microphone', sub: 'audio', highlight: true },
      { name: 'Wake word', sub: 'always-on cheap', highlight: true },
    ] },
    { label: 'Trigger', edge: 'right', blocks: [
      { name: 'Woke?', sub: 'phrase heard' },
    ] },
    { label: 'Command', edge: 'right', blocks: [
      { name: 'Recogniser', sub: 'offline', highlight: true },
      { name: 'Intent', sub: 'action' },
    ] },
    { label: 'Act', edge: 'none', blocks: [
      { name: 'Response', sub: 'local' },
      { name: 'Audio stays', sub: 'on-device' },
    ] },
  ] },
  flow: [
    { t: 'Mic audio (continuous)', k: 'start' },
    { t: 'Wake-word model (cheap, always-on)', k: 'proc' },
    { t: 'Wake word detected?', k: 'dec', yes: 'Run command recognition (offline)', no: 'Keep listening' },
    { t: 'Keep listening', k: 'proc', back: 'Mic audio (continuous)' },
    { t: 'Run command recognition (offline)', k: 'proc' },
    { t: 'Recognised command?', k: 'dec', yes: 'Act locally + respond', no: 'Ignore / re-listen' },
    { t: 'Act locally + respond', k: 'io' },
    { t: 'Ignore / re-listen', k: 'end', back: 'Mic audio (continuous)' },
  ],

  principle: [
    'The defining goal of this project is <b>privacy through locality</b>: a voice assistant that does not stream your audio to the cloud. Many commercial assistants are always listening and send audio off-device to understand it, which is a genuine privacy exposure. Keeping both the <b>listening</b> (wake word) and the <b>understanding</b> (commands) <b>on the device</b> means the audio never has to leave the room — which also gives <b>instant, network-independent</b> response. Achieving this on tiny hardware is the whole engineering challenge, and it forces a smart architecture.',
    'That architecture is a <b>two-stage cascade</b>, and it exists because of a fundamental tension: you want the device to be <b>always listening</b>, but you cannot afford to run a heavy speech model continuously on a microcontroller\'s power budget. The resolution is to split the work. Stage one is <b>wake-word detection</b>: a <b>tiny, extremely cheap</b> neural network runs <i>continuously</i>, doing nothing but listening for one specific phrase. Only when it fires does stage two — the <b>heavier command recogniser</b> — run, briefly, to understand what you actually said. Because the expensive stage runs only <i>after</i> a wake word (rarely), the device can be always-on within a small power budget. The wake word is the gate that makes always-on feasible.',
    'The wake-word model has a sharply defined and demanding spec. It must be <b>cheap</b> enough to run always-on (few operations, tiny memory — <b>TinyML</b> territory), and accurate in <b>two directions at once</b>. A <b>false rejection</b> (failing to wake when you say the word) is annoying; a <b>false accept</b> (waking at a random sound, a TV, an unrelated phrase) is worse — it makes the assistant fire spuriously and, in a cloud assistant, would send audio unexpectedly. So the model is tuned to a careful operating point balancing false-accept and false-reject rates, and this trade-off is the central quality metric of wake-word systems. Getting a small model to reliably spot one phrase amid noise, without triggering on everything else, is the core difficulty.',
    'The honesty this project requires is about the <b>constraints and their consequences</b>. Fitting speech models into a microcontroller\'s <b>severe compute, memory and power limits</b> is genuinely hard — this is embedded/TinyML engineering, where every kilobyte and milliwatt counts — and a tiny model is inevitably <b>less accurate</b> than a big cloud one, more sensitive to <b>noise and accents</b>, and limited to a <b>small offline vocabulary</b> of commands rather than open-ended conversation. That trade — a modest, local, private assistant versus a powerful, cloud-dependent one — is the honest bargain, and for many uses (a handful of smart-home commands, an appliance, an accessibility control) the local version is exactly right. It is also worth stating plainly that <b>"always listening" warrants real privacy care even when local</b>: the design keeps audio on-device precisely so that being always-on is not a surveillance risk. Built with an efficient always-on wake-word model, the two-stage cascade, and offline command handling, the assistant delivers genuine private, responsive voice control while teaching the substance of resource-constrained, on-device speech AI.',
  ],
  equations: [
    { t: 'Two-stage cascade (why always-on is feasible)', eq: 'Stage 1 (always-on, CHEAP): wake-word model on every audio frame\nStage 2 (rare, heavier): command recogniser — ONLY after wake\n\ncost ≈ always·cheap + rarely·heavy  → fits a small power budget.' },
    { t: 'Wake-word operating point', eq: 'Tune the detection threshold to balance:\n  false reject  (missed wake word) — annoying\n  false accept  (wakes at random sound) — worse\n\nCentral metric: low FA/hour AND low FRR. Small model,\nalways-on, robust to noise.' },
    { t: 'Privacy by locality', eq: 'wake word + commands run ON-DEVICE (offline)\n  → audio never leaves the room\n  → instant, network-independent response\n\nTinyML limits → small vocabulary, lower accuracy (the bargain).' },
  ],

  ai: {
    task: 'Detect a wake word with a tiny always-on on-device model and recognise a set of voice commands offline, keeping all audio local (privacy), within severe compute/power limits (TinyML).',
    dataset: [
      'Wake-word training uses many recordings of the target phrase plus "not-the-word" negatives (speech, noise); command recognition uses labelled command audio.',
      'Noise/accent coverage in the data determines real-world robustness on a small model.',
    ],
    datasetTable: [
      { n: 'Wake-word recordings', size: 'Many positives', lic: 'Yours/consented', use: 'Train the wake-word model' },
      { n: 'Negatives (speech/noise)', size: 'Large/varied', lic: 'Varies', use: 'Reduce false accepts' },
      { n: 'Command audio set', size: 'Per command', lic: 'Yours/consented', use: 'Offline command recogniser' },
      { n: 'Noise/accent samples', size: 'Varied', lic: 'Varies', use: 'Robustness on a tiny model' },
    ],
    preprocess: [
      'Extract audio features (e.g. MFCC/log-mel) on-device.',
      'Augment with noise/gain/accent variation for robustness.',
      'Frame audio for continuous streaming inference.',
    ],
    pipeline: [
      { name: 'Mic audio', sub: 'continuous', highlight: true },
      { name: 'Features', sub: 'MFCC/mel' },
      { name: 'Wake word', sub: 'tiny always-on', highlight: true },
      { name: 'Command model', sub: 'after wake' },
      { name: 'Action', sub: 'local' },
    ],
    archTable: [
      { l: 'Feature front-end', s: 'MFCC/log-mel', p: 'Compact audio features' },
      { l: 'Wake-word net', s: 'tiny CNN/DS-CNN', p: 'Cheap always-on detection' },
      { l: 'Command recogniser', s: 'small model (after wake)', p: 'Offline command intent' },
      { l: 'Thresholding', s: 'FA/FRR operating point', p: 'Reliable, few false wakes' },
      { l: 'Runtime', s: 'TinyML (TFLite Micro)', p: 'Fits MCU/edge limits' },
    ],
    hyper: [
      { k: 'Wake model size', v: 'tiny (KB)', w: 'Always-on power budget' },
      { k: 'Detection threshold', v: 'tuned', w: 'False accept vs reject' },
      { k: 'Window/stride', v: 'streaming', w: 'Latency vs compute' },
      { k: 'Command vocab', v: 'small', w: 'Offline feasibility' },
    ],
    training: [
      'Train the wake-word model on positives + varied negatives; heavily augment for noise/accents.',
      'Train/quantise a small command recogniser for offline use.',
      'Tune the operating point for low false accepts and acceptable false rejects.',
    ],
    metricsIntro: [
      'The decisive metrics are false-accept rate (per hour) and false-reject rate for the wake word, plus offline command accuracy — all under tight compute/power budgets.',
    ],
    metrics: [
      { m: 'False accepts / hour', v: 'very low (key)', d: 'No spurious wakes' },
      { m: 'False reject rate', v: 'low', d: 'Wakes when you say it' },
      { m: 'Command accuracy', v: 'small-vocab', d: 'Offline recognition' },
      { m: 'Compute/power', v: 'MCU-fit', d: 'Always-on feasible' },
    ],
    chart: { title: 'Robustness vs conditions', unit: '%', desc: 'A tiny always-on model is strong in quiet conditions and degrades with noise and unfamiliar accents — the TinyML trade-off (illustrative).', bars: [
      { label: 'Quiet', value: 95 },
      { label: 'Moderate noise', value: 82 },
      { label: 'Loud noise', value: 65 },
      { label: 'Unfamiliar accent', value: 70 },
    ] },
    inference: { file: 'wakeword.py', lang: 'python', body: `THRESHOLD = 0.85                       # tuned for low false accepts

def run(mic, wake_model, command_model, act):
    while True:
        frame = mic.read_frame()            # continuous audio, on-device
        feats = features(frame)             # MFCC/log-mel
        score = wake_model.infer(feats)     # STAGE 1: cheap, always-on

        if score >= THRESHOLD:              # wake word detected
            audio = mic.capture_command()   # STAGE 2 runs ONLY after wake
            cmd = command_model.infer(features(audio))   # offline recognition
            if cmd.confidence > 0.6:
                act(cmd.intent)             # act locally — audio never leaves
        # else: keep listening cheaply; nothing sent to the cloud.
    # TinyML: tiny model, small offline vocab; robustness limited by size.` },
    limits: [
      'Tiny always-on model — lower accuracy, sensitive to noise and accents.',
      'Small offline vocabulary vs a full cloud assistant (the bargain).',
      'False accepts must be kept very low, or it wakes spuriously.',
      '"Always listening" needs genuine privacy care even when local.',
    ],
  },

  assembly: [
    { h: 'Build the audio front-end and wake-word stage', p: [
      'Wire a digital microphone, extract features on-device, and run a tiny always-on wake-word model continuously.',
    ], warn: 'Keep audio on-device — the point is privacy. The wake-word model must be cheap enough to run always-on and tuned for very few false accepts (waking at random sounds is worse than an occasional missed wake). "Always listening" warrants real privacy care even when local.' },
    { h: 'Add offline command recognition (stage two)', p: [
      'Run the heavier command recogniser only after the wake word fires, keeping it offline with a small vocabulary.',
    ] },
    { h: 'Tune and fit within TinyML limits', p: [
      'Tune the false-accept/false-reject operating point, quantise/fit models to the device, and drive local outputs.',
    ] },
  ],
  steps: [
    { h: 'Run the two-stage on-device pipeline', p: [
      'Continuously run the cheap wake-word model; only after it fires, run offline command recognition and act locally.',
    ], code: {
      file: 'assistant.ino', lang: 'cpp',
      body: `const float THRESHOLD = 0.85f;         // low false-accept operating point

void loop(){
  readAudioFrame(buf);                   // continuous, on-device
  computeFeatures(buf, feats);           // MFCC/log-mel

  float score = wakeWordModel(feats);    // STAGE 1: tiny, ALWAYS-ON
  if (score < THRESHOLD) return;         // keep listening cheaply

  // Wake word detected -> STAGE 2 runs only now (rarely)
  captureCommandAudio(cmdBuf);           // still on-device
  Intent cmd = commandModel(features(cmdBuf));   // OFFLINE recognition
  if (cmd.confidence > 0.6f)
    act(cmd.intent);                     // act locally; audio never leaves
}`,
      explain: [
        { ref: 'float score = wakeWordModel(feats);    // STAGE 1: tiny, ALWAYS-ON', txt: 'The cheap wake-word model runs on every frame — always-on within the power budget because it is tiny.' },
        { ref: 'if (score < THRESHOLD) return;         // keep listening cheaply', txt: 'Most of the time nothing fires and the device just keeps listening cheaply — no heavy work, no cloud.' },
        { ref: '// Wake word detected -> STAGE 2 runs only now (rarely)', txt: 'The heavier command recogniser runs only after a wake word, which is what makes always-on feasible on tiny hardware.' },
        { ref: 'act(cmd.intent);                     // act locally; audio never leaves', txt: 'Commands are recognised offline and acted on locally, so audio never leaves the device — privacy by design.' },
      ],
    } },
    { h: 'Tune false accepts and respond locally', p: [
      'Tune the threshold for very few false accepts, keep the vocabulary small and offline, and drive local outputs for instant response.',
    ], tip: 'Optimise hardest against false accepts. A missed wake word is a minor annoyance; a device that wakes at the TV or random noise is unusable — and in any assistant, spurious wakes are the worst failure mode.' },
  ],

  code: [{
    file: 'wakeword_assistant.py', lang: 'python',
    body: `#!/usr/bin/env python3
"""
Wake-Word Voice Assistant (on-device, offline)

Two-stage cascade: a tiny ALWAYS-ON wake-word model runs continuously;
only AFTER it fires does an offline command recogniser run. All audio
stays ON-DEVICE (privacy) with instant, network-independent response.
TinyML: tight compute/power; small vocabulary; tune LOW false accepts.
"""
THRESHOLD = 0.85                       # tuned for very low false accepts

class WakeWordAssistant:
    def __init__(self, mic, wake_model, command_model, actuator):
        self.mic = mic; self.wake = wake_model
        self.cmd = command_model; self.act = actuator

    def run(self):
        while True:
            frame = self.mic.read_frame()          # continuous, on-device
            feats = features(frame)                 # MFCC/log-mel

            # STAGE 1: cheap, always-on wake-word detection
            if self.wake.infer(feats) < THRESHOLD:
                continue                            # keep listening cheaply

            # STAGE 2: runs ONLY after the wake word (rarely) — offline
            audio = self.mic.capture_command()      # audio stays local
            cmd = self.cmd.infer(features(audio))   # offline command recognition
            if cmd.confidence > 0.6:
                self.act(cmd.intent)                # act locally + respond
            # nothing is ever sent to the cloud.

if __name__ == "__main__":
    a = WakeWordAssistant(Microphone(), WakeWordModel(),
                          CommandModel(), Actuator())
    a.run()
    # Private + responsive; small offline vocab; robustness limited by TinyML.`,
    explain: [
      { ref: 'if self.wake.infer(feats) < THRESHOLD:', txt: 'Stage one is a tiny always-on model; below threshold the device just keeps listening cheaply, which is what fits the power budget.' },
      { ref: '# STAGE 2: runs ONLY after the wake word (rarely) — offline', txt: 'The heavier command recogniser runs only after a wake word — the cascade that makes always-on listening feasible.' },
      { ref: 'audio = self.mic.capture_command()      # audio stays local', txt: 'Command audio is captured and recognised on-device, so nothing is streamed to the cloud — the privacy guarantee.' },
      { ref: 'self.act(cmd.intent)                # act locally + respond', txt: 'Recognised commands act locally for instant, network-independent response.' },
      { ref: '# Private + responsive; small offline vocab; robustness limited by TinyML.', txt: 'The honest bargain — private and responsive, but a small offline vocabulary and TinyML-limited robustness — is stated plainly.' },
    ],
  }],

  config: [
    'Configure the microphone, feature front-end and audio framing.',
    'Configure the wake-word model and detection threshold (false-accept-first).',
    'Configure the offline command recogniser and small vocabulary.',
    'Configure local outputs and privacy (audio stays on-device).',
  ],
  calibration: [
    { h: 'Wake-word operating point', p: [
      'Tune the threshold for very low false accepts and acceptable false rejects across noise conditions.',
    ] },
    { h: 'Command accuracy', p: [
      'Validate offline command recognition; keep the vocabulary small and robust.',
    ] },
    { h: 'Resource fit', p: [
      'Confirm models fit the device\'s compute/memory/power for always-on operation.',
    ] },
  ],
  testing: [
    { step: 'Say the wake word', expect: 'Wakes reliably (low false reject)' },
    { step: 'Play unrelated speech/TV', expect: 'Does not wake (low false accept)' },
    { step: 'Give a known command after waking', expect: 'Recognised offline; acts locally' },
    { step: 'Check network traffic', expect: 'No audio sent to the cloud' },
    { step: 'Add background noise', expect: 'Degrades — note TinyML robustness limit' },
    { step: 'Unfamiliar accent', expect: 'Harder — note the limit' },
  ],
  output: [
    'A private, offline voice assistant: reliable wake word, offline commands, local response, no cloud audio.',
    { file: 'assistant-event.json', lang: 'json', body: `{
  "wake_word": "detected",
  "wake_score": 0.91,
  "command": "turn on the light",
  "handled": "offline",
  "audio_left_device": false
}` },
    'The wake word fired on-device, an offline command was recognised and acted on locally, and no audio ever left the device — private, responsive voice control.',
  ],
  troubleshoot: [
    { sym: 'Wakes at random sounds', cause: 'Threshold too low / weak negatives', fix: 'Raise threshold; train on more/varied negatives' },
    { sym: 'Misses the wake word', cause: 'Threshold too high / noise', fix: 'Lower threshold; augment for noise; improve mic' },
    { sym: 'Poor command accuracy', cause: 'Tiny model / vocabulary', fix: 'Keep vocab small; augment; consider a Pi for more capacity' },
    { sym: 'Too slow / won\'t fit', cause: 'Model too big for MCU', fix: 'Quantise/prune; smaller model; TinyML runtime' },
    { sym: 'Struggles in noise/accents', cause: 'TinyML limits', fix: 'Augmented training; accept the trade-off' },
    { sym: 'Privacy concern', cause: 'Audio leaving device', fix: 'Keep wake word + commands offline on-device' },
  ],

  perf: [
    'Keep the wake-word model tiny and always-on; run heavy work only after it fires.',
    'Tune hardest against false accepts.',
    'Keep commands offline with a small vocabulary.',
    'Quantise/fit models to the device\'s limits.',
  ],
  safety: [
    '"Always listening" warrants genuine privacy care — keep audio on-device; do not stream it to the cloud.',
    'Be transparent that the device listens for a wake word, and give users control.',
    'A tiny model is limited in noise/accents — do not rely on it where misrecognition is dangerous.',
    'Secure any local storage of audio/commands.',
  ],
  maintenance: [
    'Retrain/tune the wake word for new conditions and negatives.',
    'Update command models/vocabulary as needs change.',
    'Re-verify false-accept/reject rates over time.',
    'Keep audio local and privacy practices current.',
  ],
  future: [
    'Add on-device speech-to-text for a larger command set.',
    'Add speaker verification (only wake for enrolled users).',
    'Add noise suppression / beamforming for robustness.',
    'Add more capable offline models on stronger edge hardware.',
  ],
  faq: [
    { q: 'Why keep everything on-device?', a: 'For privacy — many assistants stream your audio to the cloud to understand it. Keeping the wake word and commands on-device means audio never has to leave the room, and it also gives instant, network-independent response.' },
    { q: 'Why the two-stage design?', a: 'Because you want always-on listening but cannot afford to run a heavy model continuously on tiny hardware. A cheap wake-word model runs always-on, and the heavier command recogniser runs only after the wake word fires — rarely — which keeps the device within a small power budget.' },
    { q: 'Why obsess over false accepts?', a: 'Because a device that wakes at random sounds, the TV, or unrelated speech is unusable — and in a cloud assistant, a false accept would send audio unexpectedly. A missed wake word is a minor annoyance; a spurious wake is the worst failure mode, so the model is tuned hardest against it.' },
    { q: 'What is the catch versus a cloud assistant?', a: 'A tiny on-device model is less accurate, more sensitive to noise and accents, and limited to a small offline vocabulary rather than open-ended conversation. That is the honest bargain — a modest, private, responsive assistant instead of a powerful, cloud-dependent one.' },
    { q: 'What makes this hard?', a: 'Fitting capable speech models into a microcontroller\'s severe compute, memory and power limits — TinyML engineering where every kilobyte and milliwatt counts — while staying accurate and robust enough to be useful.' },
  ],
  refs: [
    { t: 'Keyword / wake-word spotting', u: 'https://en.wikipedia.org/wiki/Keyword_spotting', s: 'Reference' },
    { t: 'TinyML / on-device ML', u: 'https://en.wikipedia.org/wiki/TinyML', s: 'Reference' },
    { t: 'Speech recognition', u: 'https://en.wikipedia.org/wiki/Speech_recognition', s: 'Reference' },
    { t: 'MFCC audio features', u: 'https://en.wikipedia.org/wiki/Mel-frequency_cepstrum', s: 'Reference' },
    { t: 'TensorFlow Lite Micro', u: 'https://www.tensorflow.org/lite/microcontrollers', s: 'Docs' },
  ],
  images: ['neural', 'esp32', 'health'],
  imageCaptions: [
    'A wake-word voice assistant listens on-device and handles commands offline — audio never leaves the room.',
    'A two-stage cascade — a cheap always-on wake word, then command recognition only after — makes always-on feasible.',
    'This is TinyML: fitting capable speech models into a microcontroller\'s tight compute and power budget.',
  ],
},

];
