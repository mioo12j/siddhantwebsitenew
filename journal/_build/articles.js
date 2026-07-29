/* ============================================================
   Article data for the Journal generator.
   Each add({...}) = one article. Build with:  node journal/_build/build.js
   Text fields use backticks so apostrophes/quotes are safe.
   ============================================================ */
'use strict';
const A = [];
const add = o => A.push(o);

// ---- reusable image-credit lines (Wikimedia Commons) ----------
const CC = {
  nwm:      `Photograph by Sanket Oswal, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow noopener" target="_blank">CC BY-SA 4.0</a>, via Wikimedia Commons.`,
  pvc:      `Image: Government of India, Public Domain, via Wikimedia Commons.`,
  kargil:   `Photograph by PhotoholicAbhishek, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow noopener" target="_blank">CC BY-SA 4.0</a>, via Wikimedia Commons.`,
  amar:     `Photograph by KCVelaga, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow noopener" target="_blank">CC BY-SA 4.0</a>, via Wikimedia Commons.`,
  republic: `Photograph: Government of India, GODL-India, via Wikimedia Commons.`,
  siachen:  `Photograph by Arshsangh, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow noopener" target="_blank">CC BY-SA 4.0</a>, via Wikimedia Commons.`,
  manekshaw:`Photograph: Indian Army / Government of India, GODL-India, via Wikimedia Commons.`,
  vikrant:  `Photograph: Indian Navy / Government of India, GODL-India, via Wikimedia Commons.`,
  rafale:   `Photograph: Indian Air Force / Government of India, via Wikimedia Commons.`,
  army:     `Photograph: U.S. Army, Public Domain, via Wikimedia Commons.`
};
const credit = (k) => `Image credit: ${CC[k]}`;

// Common source links
const SRC = {
  wiki: (t, u) => `"${t}," <a href="https://en.wikipedia.org/wiki/${u}" rel="nofollow noopener" target="_blank">Wikipedia</a>.`,
  pib:  `Press Information Bureau (PIB), Government of India — <a href="https://pib.gov.in/" rel="nofollow noopener" target="_blank">pib.gov.in</a>.`,
  army: `Indian Army, official records — <a href="https://indianarmy.nic.in/" rel="nofollow noopener" target="_blank">indianarmy.nic.in</a>.`,
  gallantry: `Gallantry Awards portal, Government of India — <a href="https://www.gallantryawards.gov.in/" rel="nofollow noopener" target="_blank">gallantryawards.gov.in</a>.`
};

/* =================================================================
   PRE-WRITTEN ARTICLES (hand-authored files already on disk).
   Registered here only so they appear in the index + sitemap.
   ================================================================= */
add({ prewritten:true, slug:'national-war-memorial', date:'2026-02-25',
  cardTitle:`The National War Memorial: A Home for India's Heroes`,
  plainTitle:`The National War Memorial`,
  hero:{ src:'assets/national-war-memorial.jpg', alt:'The National War Memorial, New Delhi' },
  excerpt:`For 72 years India had no memorial of its own to its fallen. A walk through the four sacred circles, the eternal flame, and the 25,942 names cut into granite.` });

add({ prewritten:true, slug:'param-vir-chakra', date:'2026-01-26',
  cardTitle:`Param Vir Chakra: India's Highest Honour for Valour`,
  plainTitle:`Param Vir Chakra`,
  hero:{ src:'assets/param-vir-chakra.png', alt:'The Param Vir Chakra medal', cardContain:true },
  excerpt:`A mythic medal designed by Savitri Khanolkar, 21 recipients, the first hero Major Somnath Sharma, and the four awarded for Kargil.` });

add({ prewritten:true, slug:'kargil-war-operation-vijay', date:'2025-07-26',
  cardTitle:`Remembering Kargil: Operation Vijay and the Heroes of 1999`,
  plainTitle:`Remembering Kargil`,
  hero:{ src:'assets/kargil-war-memorial.jpg', alt:'The Kargil War Memorial at Drass' },
  excerpt:`The world's highest battlefield, the recapture of Tololing and Tiger Hill, the 527 who fell, and why we mark Kargil Vijay Diwas every 26 July.` });

add({ prewritten:true, slug:'why-war-poetry-matters', date:'2026-03-15',
  cardTitle:`Why War Poetry Still Matters`,
  plainTitle:`Why War Poetry Still Matters`,
  hero:{ src:'assets/amar-jawan-jyoti.jpg', alt:'An eternal flame of remembrance at India Gate' },
  excerpt:`From Wilfred Owen and the poppies of Flanders to Tagore and Subhadra Kumari Chauhan — how a single poem can outlast the war that made it.` });

/* =================================================================
   BATCH 1 — book-anchored military history
   ================================================================= */

add({
  slug:'battle-of-nathu-la-1967', date:'2025-09-11', category:'History', eyebrow:'History · 1967',
  readTime:'7 min read',
  title:`The Battle of Nathu La, 1967: When India Answered China`,
  h1:`The Battle of Nathu La, 1967: <em>When India Answered China</em>`,
  plainTitle:`The Battle of Nathu La, 1967`,
  cardTitle:`Nathu La 1967: When India Answered China`,
  desc:`Five years after the defeat of 1962, Indian troops stood their ground against China at the Nathu La and Cho La passes in Sikkim — and won. The forgotten clashes of 1967, and the poem they inspired.`,
  keywords:`Nathu La 1967, Cho La clashes, India China war 1967, Sikkim border, Sagat Singh, Indian Army China victory, 1967 skirmishes`,
  excerpt:`Five years after 1962, Indian troops met the Chinese at the icy passes of Sikkim — and this time, they held. The forgotten victory of 1967.`,
  hero:{ src:'assets/army-mountains.jpg', alt:'Indian Army soldiers at a high-altitude Himalayan post', credit:CC.army },
  imageCredit:credit('army'),
  intro:[
    `History remembers India's 1962 war with China as a wound. Far fewer people remember that just five years later, at two windswept passes in Sikkim, the Indian Army met the People's Liberation Army again — and this time refused to yield. The clashes at <strong>Nathu La</strong> in September 1967, and at <strong>Cho La</strong> the following month, are among the most important and least-told chapters of India's military history.`,
    `My poem <em>Echoes of Nathu La</em> was written for the jawans who stood in that cold. It opens "Beneath the indifferent stars of Nathu La, where silence speaks louder than war's roar." This is the story behind those lines.`
  ],
  body:[
    { h2:`A border still raw from 1962` },
    { p:`Nathu La is a mountain pass at over 14,000 feet on the border between Sikkim and Tibet. In the years after the humiliation of 1962, the boundary here remained tense and ill-defined, with Indian and Chinese troops dug in within shouting distance of one another. In the summer of 1967, Indian soldiers of the 2 Grenadiers and other units began laying a wire fence to mark the watershed boundary, and Chinese troops objected violently.<sup><a href="#s1">[1]</a></sup>` },
    { p:`On <strong>11 September 1967</strong>, as the fencing party worked, Chinese forces opened machine-gun fire from the heights. What followed was not a one-sided rout but a fierce, days-long artillery and infantry duel in which Indian gunners pounded Chinese positions with sustained accuracy.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`We stand where many dare not tread, in the shadows of peaks that know our tales.` },
    { h2:`The cost, and the answer` },
    { p:`The fighting at Nathu La lasted until 14 September. A few weeks later, on 1 October, a second clash erupted at the nearby <strong>Cho La</strong> pass. Indian casualties were heavy — roughly <strong>88 soldiers killed</strong> and many more wounded — but Chinese losses were considerably higher, and crucially, the Indian Army held every position it set out to defend.<sup><a href="#s1">[1]</a></sup><sup><a href="#s2">[2]</a></sup>` },
    { p:`Under commanders such as Major General Sagat Singh, who refused to pull his guns back, the army demonstrated that the lessons of 1962 had been learned. The Chinese did not push across the Sikkim frontier again. For a nation still carrying the shame of its earlier defeat, Nathu La was quiet, costly proof that the Indian soldier could stand toe to toe with a larger adversary and not break.` },
    { h2:`Why it still matters` },
    { p:`Nathu La rarely appears in popular memory the way Kargil or 1971 does. There was no triumphant march, no surrender ceremony — only a fence built, a line held, and a price paid in the snow. But that is precisely the kind of sacrifice my book tries to honour: the courage that earns no parade.` },
    { p:`The soldiers of 1967 asked for nothing. In the words of the poem, they wished only to "remember us not as heroes craving fame, but as sons who bore the weight of a motherland." More than half a century later, as the same Himalayan frontier again makes headlines, their steadiness is worth remembering. They drew a line in the ice, and they kept it.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Nathu La and Cho La clashes','Nathu_La_and_Cho_La_clashes') },
    { n:2, html: SRC.army }
  ],
  related:['kargil-war-operation-vijay','1971-war-birth-of-bangladesh','siachen-worlds-highest-battlefield']
});

add({
  slug:'1971-war-birth-of-bangladesh', date:'2025-12-16', category:'History', eyebrow:'History · 1971',
  readTime:'8 min read',
  title:`1971: The War That Gave Birth to a Nation`,
  h1:`1971: The War That <em>Gave Birth to a Nation</em>`,
  plainTitle:`1971: The War That Gave Birth to a Nation`,
  cardTitle:`1971: The War That Gave Birth to a Nation`,
  desc:`In just thirteen days in December 1971, India helped liberate Bangladesh and accepted the surrender of around 93,000 Pakistani troops — the largest military surrender since the Second World War. The story behind Vijay Diwas.`,
  keywords:`1971 war, Indo-Pakistani War 1971, Bangladesh Liberation War, Sam Manekshaw, Vijay Diwas, 16 December 1971, Instrument of Surrender, 93000 prisoners of war`,
  excerpt:`Thirteen days in December 1971: the liberation of Bangladesh and the largest military surrender since World War II.`,
  hero:{ src:'assets/manekshaw.jpg', alt:'Field Marshal Sam Manekshaw, who led the Indian Army in 1971', credit:CC.manekshaw, cardContain:false },
  imageCredit:credit('manekshaw'),
  intro:[
    `Some wars are fought to take land. The war of 1971 was fought to give a people their freedom. In thirteen days in December, the Indian Army helped bring a new country — Bangladesh — into the world, and accepted a surrender so large it remains, to this day, the biggest since the Second World War.`,
    `My poem <em>Liberation's Shadow</em> is written in the voice of an Indian soldier of that war: "We marched not for conquest, not for pride, but for a neighbor's freedom, their voices tied." This is the history those lines remember.`
  ],
  body:[
    { h2:`A genocide across the border` },
    { p:`Through 1971, the Pakistani military waged a brutal crackdown in what was then East Pakistan, driving an estimated ten million refugees across the border into India. The humanitarian catastrophe and the strategic crisis it created pushed India toward intervention.<sup><a href="#s1">[1]</a></sup>` },
    { p:`When the army chief, General (later Field Marshal) <strong>Sam Manekshaw</strong>, was asked to act in spring, he famously insisted on waiting until the monsoon passed and the army was fully prepared — a refusal to be rushed that helped guarantee the swift victory that followed.<sup><a href="#s2">[2]</a></sup>` },
    { quote:`In the heart of Bangladesh, we left a piece, of ourselves, in its soil, a promise of peace.` },
    { h2:`Thirteen days` },
    { p:`Full-scale war began on <strong>3 December 1971</strong>. On land, sea, and in the air, Indian forces and the Mukti Bahini (Bangladeshi freedom fighters) advanced rapidly toward Dhaka. The Indian Navy struck Karachi; the Air Force won command of the skies; the Army drove forward faster than almost anyone expected.<sup><a href="#s1">[1]</a></sup>` },
    { p:`On <strong>16 December 1971</strong>, Lieutenant General A. A. K. Niazi signed the Instrument of Surrender in Dhaka, and around <strong>93,000 Pakistani soldiers</strong> laid down their arms — the largest surrender of troops since 1945. Bangladesh was free. India marks the day every year as <strong>Vijay Diwas</strong> (Victory Day).<sup><a href="#s1">[1]</a></sup>` },
    { h2:`Victory without vanity` },
    { p:`What makes 1971 extraordinary is not only its speed but its restraint. India took no territory for itself; it returned its prisoners of war; it had fought, as the poem says, "not for conquest but for the freedom of a neighbor." It was a war that expanded the map of human freedom rather than the map of a nation.` },
    { p:`Yet victory was paid for in blood. Thousands of Indian soldiers fell so that a new flag could rise over Dhaka. They asked, as soldiers always seem to, only to be remembered "not for the medals we bear, but for the battles fought with love and care." Fifty years on, that is exactly what Vijay Diwas is for.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Indo-Pakistani War of 1971','Indo-Pakistani_War_of_1971') },
    { n:2, html: SRC.wiki('Sam Manekshaw','Sam_Manekshaw') }
  ],
  related:['field-marshal-sam-manekshaw','kargil-war-operation-vijay','battle-of-nathu-la-1967']
});

add({
  slug:'captain-vikram-batra', date:'2025-07-07', category:'History', eyebrow:'Heroes · Kargil',
  readTime:'7 min read',
  title:`Captain Vikram Batra: The Lion of Kargil and "Yeh Dil Maange More"`,
  h1:`Captain Vikram Batra: <em>The Lion of Kargil</em>`,
  plainTitle:`Captain Vikram Batra: The Lion of Kargil`,
  cardTitle:`Captain Vikram Batra: The Lion of Kargil`,
  desc:`The story of Captain Vikram Batra, PVC — "Sher Shah" — who captured Point 5140 and Point 4875 in the Kargil War, gave the nation the cry "Yeh Dil Maange More," and died at 24 leading his men.`,
  keywords:`Captain Vikram Batra, Vikram Batra PVC, Yeh Dil Maange More, Sher Shah, Point 4875, Point 5140, Kargil hero, 13 JAK Rifles, Param Vir Chakra`,
  excerpt:`"Yeh Dil Maange More." The story of Sher Shah — Captain Vikram Batra, PVC — who died at 24 leading the charge on Kargil's peaks.`,
  hero:{ src:'assets/kargil-war-memorial.jpg', alt:'The Kargil War Memorial at Drass, honouring the heroes of 1999', credit:CC.kargil },
  imageCredit:credit('kargil'),
  intro:[
    `Every war produces a face that a nation never forgets. For the Kargil War of 1999, that face belongs to <strong>Captain Vikram Batra</strong> — twenty-four years old, grinning under his helmet, radio callsign "Sher Shah," who gave India one of its most enduring battle-cries: <em>"Yeh Dil Maange More"</em> — "the heart wants more."`,
    `In my poem <em>The Silent Ridge</em>, his words ring across the mountain: "Yeh dil maange more, Batra's command, rings like thunder across this land." This is the man behind the line.`
  ],
  body:[
    { h2:`Sher Shah of the 13 JAK Rifles` },
    { p:`Vikram Batra was a young officer of the <strong>13 Jammu &amp; Kashmir Rifles</strong>, full of life and famous among his men for his fearlessness and good humour. When the Kargil War erupted in the summer of 1999, his battalion was thrown into some of the hardest fighting of the campaign.<sup><a href="#s1">[1]</a></sup>` },
    { p:`His first great feat was the recapture of <strong>Point 5140</strong>, a commanding peak. After taking it, he radioed his victory signal — "Yeh Dil Maange More" — words that would soon be on the lips of a whole country watching the war on television.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`We are not soldiers; we are resolve, an oath unbroken, no matter the cost.` },
    { h2:`Point 4875` },
    { p:`Batra's final battle was for <strong>Point 4875</strong>, a treacherous feature in the Mushkoh valley. Though unwell, he insisted on leading the assault, reportedly saying that the operation needed him. In the closing stages, he moved to rescue an injured fellow officer and was killed by enemy fire on <strong>7 July 1999</strong>.<sup><a href="#s1">[1]</a></sup>` },
    { p:`The peak he died taking was later renamed <strong>Batra Top</strong> in his honour. For his "most conspicuous bravery," he was awarded the <a href="param-vir-chakra.html">Param Vir Chakra</a>, India's highest gallantry award, posthumously.<sup><a href="#s2">[2]</a></sup>` },
    { h2:`The heart that wanted more` },
    { p:`What endures about Vikram Batra is not only his courage but his joy. He was not a grim warrior; he was a young man who loved life intensely and gave it up anyway. That contradiction — the brightest spirit choosing the hardest sacrifice — is the very thing my book reaches for again and again.` },
    { p:`He once said that he would either come back after raising the Indian flag in victory, or come back wrapped in it — but he would come back. He came back wrapped in the tricolour, at twenty-four. "Yeh Dil Maange More" was a soldier's cheeky cry of ambition; it has become a nation's promise never to forget him.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Vikram Batra','Vikram_Batra') },
    { n:2, html: SRC.gallantry }
  ],
  related:['kargil-war-operation-vijay','param-vir-chakra','kargil-vijay-diwas']
});

add({
  slug:'veer-naris-families-who-serve', date:'2026-04-05', category:'Tribute', eyebrow:'Tribute · Families',
  readTime:'7 min read',
  title:`Veer Naris: The Families Who Also Serve`,
  h1:`Veer Naris: <em>The Families Who Also Serve</em>`,
  plainTitle:`Veer Naris: The Families Who Also Serve`,
  cardTitle:`Veer Naris: The Families Who Also Serve`,
  desc:`Behind every fallen soldier is a family that pays a lifetime for a moment of sacrifice. A tribute to India's Veer Naris — the war widows, parents and children who carry the cost of freedom at home.`,
  keywords:`Veer Nari, war widows India, military families sacrifice, soldier family, Armed Forces families, Veer Nari welfare, gold star families India`,
  excerpt:`Behind every name on a memorial is a family that pays for a lifetime. A tribute to India's Veer Naris — the families who also serve.`,
  hero:{ src:'assets/amar-jawan-jyoti.jpg', alt:'The eternal flame of remembrance at India Gate', credit:CC.amar },
  imageCredit:credit('amar'),
  intro:[
    `We speak of soldiers giving their lives, as if the cost is paid in a single instant on a battlefield. But there is a second, quieter sacrifice that lasts decades — borne not by the soldier, but by the family left behind. In India, the widow of a fallen soldier is honoured with a title that says everything: <strong>Veer Nari</strong>, "brave woman."`,
    `My poem <em>The Weight of Sacrifice</em> is written in a mother's voice, the morning two officers appear at her door. This article is for her, and for all the families who also serve.`
  ],
  body:[
    { h2:`The knock at the door` },
    { p:`There is a moment every military family dreads without ever naming it: the unexpected knock, the uniformed figures who do not need to speak. My poem tries to hold that moment still: "A knock came at dawn, shattering the calm, a sound too heavy, a silent alarm." For the family, the war does not begin or end on a distant ridge. It arrives at home, and it stays.` },
    { quote:`He is not gone; he is the earth, the air, a part of the freedom he fought to spare.` },
    { h2:`A sacrifice measured in years` },
    { p:`A soldier's courage is concentrated into the sharp edge of a single decision. A family's courage is spread thin across a lifetime — the empty chair at every festival, the child who grows up on stories, the parent who ages without the son who was meant to care for them. This is sacrifice without medals, endured in living rooms rather than on mountains.` },
    { p:`India recognises this through the honorific <strong>Veer Nari</strong> and through welfare measures — pensions, educational support for children, employment and housing assistance — administered by the armed forces and bodies such as the Kendriya Sainik Board.<sup><a href="#s1">[1]</a></sup> These are necessary and good. But no scheme can fill the absence at the centre of a home.` },
    { h2:`Honouring the unseen frontline` },
    { p:`When senior officers wrote to me about my book, more than one singled out <em>The Weight of Sacrifice</em> — and what moved them was that it spoke for the Veer Naris and the parents, the people history forgets to thank. As Major General P. R. Murli wrote, the poem "offers solidarity and remembrance to countless veer naris and parents."` },
    { p:`To honour a soldier and forget their family is to tell only half the story of a sacrifice. The mother in my poem stands "broken, yet somehow whole," and chooses to carry her son's memory as a kind of light. The least a grateful nation can do is to make sure she never carries it alone.` }
  ],
  sources:[
    { n:1, html: `Kendriya Sainik Board &amp; Department of Ex-Servicemen Welfare, Ministry of Defence — <a href="https://ksb.gov.in/" rel="nofollow noopener" target="_blank">ksb.gov.in</a> (welfare of Veer Naris and dependants).` },
    { n:2, html: SRC.pib }
  ],
  related:['national-war-memorial','the-folded-pride-indian-flag','the-weight-of-remembrance']
});

add({
  slug:'operation-parakram-2001', date:'2025-12-13', category:'History', eyebrow:'History · 2001–02',
  readTime:'6 min read',
  title:`Operation Parakram: The War That Never Came`,
  h1:`Operation Parakram: <em>The War That Never Came</em>`,
  plainTitle:`Operation Parakram: The War That Never Came`,
  cardTitle:`Operation Parakram: The War That Never Came`,
  desc:`After the 2001 attack on India's Parliament, the army mobilised for war on a scale not seen since 1971 — and then held its breath for ten months. The story of Operation Parakram and the courage of waiting.`,
  keywords:`Operation Parakram, 2001 Parliament attack, India Pakistan standoff 2002, military mobilisation, border standoff, Indian Army readiness`,
  excerpt:`After the 2001 Parliament attack, India massed for war and waited ten tense months on the border. The courage of a war that never came.`,
  hero:{ src:'assets/army-mountains.jpg', alt:'Indian Army soldiers deployed in a forward area', credit:CC.army },
  imageCredit:credit('army'),
  intro:[
    `Not every act of soldiering happens in the roar of battle. Sometimes the hardest thing an army does is to stand fully armed at the border for months on end, ready to die at an hour's notice, for a war that may never be ordered. That was <strong>Operation Parakram</strong>.`,
    `My poem <em>Unyielding Flames</em> was written for exactly this kind of vigil: "No roar of guns, no sudden fray, yet the tension holds through night and day."`
  ],
  body:[
    { h2:`A nation pushed to the edge` },
    { p:`On <strong>13 December 2001</strong>, terrorists attacked the Parliament of India in New Delhi. In response, India launched <strong>Operation Parakram</strong> ("Valour") — the largest military mobilisation since the 1971 war, moving hundreds of thousands of troops and heavy equipment to the western border.<sup><a href="#s1">[1]</a></sup>` },
    { p:`For roughly <strong>ten months</strong>, through 2002, two nuclear-armed neighbours stood eyeball to eyeball. Full-scale war was, several times, only a decision away. And yet the order never came; the standoff was wound down by October 2002.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`Each breath we take, a promise sworn, to protect the land where heroes are born.` },
    { h2:`The courage of waiting` },
    { p:`It is easy to imagine the bravery of an assault. It is harder to imagine the bravery of the wait — the soldier in a forward trench through a freezing night, every nerve taut, holding a line for a battle that keeps not arriving. Mines were laid; lives were lost in accidents and skirmishes even without a declared war. The strain was immense.` },
    { p:`This is the paradox my poem turns over: "Peace is precious, a prize we hold dear, but its cost is paid in blood and fear." The soldiers of Operation Parakram paid that cost in patience and readiness, in a war measured not by victories but by the disaster they helped prevent.` },
    { h2:`Why the silence counts` },
    { p:`We rarely build memorials to wars that did not happen. But deterrence — the quiet, exhausting work of being so ready that the enemy dares not begin — is one of the great unseen labours of an army. The men who stood through Operation Parakram defended the nation just as surely as those who storm a hill, and far less visibly.` },
    { p:`"This is our watch, the vigil we keep," the poem says, "for the dreams of the nation, for the freedom we reap." Some guardians are remembered for the battles they won. These were the guardians of a battle that, thanks to them, never had to be fought.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Operation Parakram','2001%E2%80%932002_India%E2%80%93Pakistan_standoff') },
    { n:2, html: SRC.army }
  ],
  related:['para-sf-surgical-strikes','operation-sindoor-2025','siachen-worlds-highest-battlefield']
});

add({
  slug:'mumbai-26-11-nsg', date:'2025-11-26', category:'History', eyebrow:'History · 26/11',
  readTime:'7 min read',
  title:`26/11 and the NSG: The Night Mumbai Did Not Fall`,
  h1:`26/11 and the NSG: <em>The Night Mumbai Did Not Fall</em>`,
  plainTitle:`26/11 and the NSG`,
  cardTitle:`26/11 and the NSG: The Night Mumbai Did Not Fall`,
  desc:`In November 2008, ten terrorists held Mumbai hostage for nearly 60 hours. The story of the NSG commandos who ended the siege — and Major Sandeep Unnikrishnan, who gave his life so others could live.`,
  keywords:`26/11 Mumbai attacks, NSG commandos, Operation Black Tornado, Major Sandeep Unnikrishnan, Taj Mahal Palace hotel, National Security Guard, Ashok Chakra`,
  excerpt:`Ten terrorists, nearly 60 hours, one city held hostage. How the NSG ended the 26/11 siege — and the major who gave everything.`,
  hero:{ src:'assets/republic-day.jpg', alt:'Indian security forces on parade', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `On the night of <strong>26 November 2008</strong>, ten heavily armed terrorists came ashore in Mumbai and turned India's largest city into a battlefield. For nearly sixty hours, they held hotels, a railway station, a hospital and a Jewish centre, killing around <strong>166 people</strong>.<sup><a href="#s1">[1]</a></sup> The story of how the siege ended is the story of the men who ran toward the gunfire.`,
    `My poem <em>The Fire Within</em> is written in the voice of one of those men — a commando storming the terror-struck halls: "They came as shadows, dark and vile, but I bring the storm, fury in every mile."`
  ],
  body:[
    { h2:`Operation Black Tornado` },
    { p:`As the police fought to contain the chaos, India's elite counter-terror force — the <strong>National Security Guard (NSG)</strong>, the "Black Cats" — was flown in to clear the occupied buildings in what was codenamed <strong>Operation Black Tornado</strong>.<sup><a href="#s1">[1]</a></sup> Room by room, floor by floor, through fire and hostages, the commandos retook the Taj Mahal Palace hotel, the Oberoi-Trident and Nariman House.` },
    { quote:`No god nor devil can halt my hand, I fight for justice, for my sacred land.` },
    { h2:`Major Sandeep Unnikrishnan` },
    { p:`Among the heroes of those hours was <strong>Major Sandeep Unnikrishnan</strong> of the NSG. Leading the operation at the Taj, he was killed while rescuing trapped hostages and going to the aid of an injured commando. He was twenty-eight. For his valour he was awarded the <strong>Ashok Chakra</strong> — India's highest peacetime gallantry award — posthumously.<sup><a href="#s2">[2]</a></sup>` },
    { p:`Other personnel, including police officers and the NSG's Havildar Gajender Singh, also fell. They died, as the poem puts it, "for the innocent lives they dared to trade."` },
    { h2:`The reckoning and the resolve` },
    { p:`26/11 changed India. It exposed gaps in coastal security and emergency response, and led to lasting reforms — regional NSG hubs, a coastal command, better inter-agency coordination. But beyond policy, it left the country with an image it has never let go of: ordinary men in black, walking into a building everyone else was fleeing.` },
    { p:`<em>The Fire Within</em> is an angry poem, deliberately so, because 26/11 was a crime against the defenceless and the response demanded fury harnessed to discipline. "This isn't a fight, it's a war they chose," the commando says, "and here, their reign of terror meets its close." Mumbai bled that night. But because of these men, it did not fall.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('2008 Mumbai attacks','2008_Mumbai_attacks') },
    { n:2, html: SRC.wiki('Sandeep Unnikrishnan','Sandeep_Unnikrishnan') }
  ],
  related:['para-sf-surgical-strikes','marcos-marine-commandos','raw-indias-silent-warriors']
});

add({
  slug:'para-sf-surgical-strikes', date:'2025-09-29', category:'History', eyebrow:'Elite Forces',
  readTime:'7 min read',
  title:`The Para SF and the 2016 Surgical Strikes`,
  h1:`The Para SF and the <em>2016 Surgical Strikes</em>`,
  plainTitle:`The Para SF and the 2016 Surgical Strikes`,
  cardTitle:`The Para SF and the 2016 Surgical Strikes`,
  desc:`India's Parachute Regiment Special Forces — the "Red Devils" in their maroon berets — are among the most elite soldiers in the world. The story of the unit and the 2016 cross-border surgical strikes after Uri.`,
  keywords:`Para SF, Parachute Regiment, surgical strikes 2016, Uri attack, Indian special forces, Red Devils, maroon beret, balidaan badge`,
  excerpt:`India's most elite soldiers — the maroon-bereted Para SF — and the 2016 surgical strikes that answered the Uri attack.`,
  hero:{ src:'assets/army-mountains.jpg', alt:'Indian Army special forces soldiers in mountainous terrain', credit:CC.army },
  imageCredit:credit('army'),
  intro:[
    `Some soldiers train to hold a line. A rare few train to vanish across it, strike in the dark, and disappear before dawn. These are India's <strong>Parachute Regiment Special Forces</strong> — the Para SF, whose maroon berets and "balidaan" (sacrifice) badge mark them out as among the most elite warriors on earth.`,
    `My poem <em>Red Devils' Reflections</em> is written as a Para SF soldier's private journal before a mission: "In the stillness where shadows creep, I pen these thoughts before I sleep."`
  ],
  body:[
    { h2:`The maroon beret` },
    { p:`The Para SF are India's foremost special operations soldiers, drawn from the elite of the elite through one of the most punishing selection processes in any military. They specialise in direct action, deep reconnaissance, counter-terrorism and unconventional warfare — operating in small teams, far from support, where failure is fatal.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`Patience and time forge the strongest steel, in every step, our truths reveal.` },
    { h2:`Uri, and the answer` },
    { p:`On <strong>18 September 2016</strong>, terrorists attacked an army base at Uri, killing nineteen Indian soldiers — one of the deadliest such attacks in decades. Eleven days later, on the night of <strong>28–29 September 2016</strong>, India announced that its special forces had crossed the Line of Control and carried out <strong>surgical strikes</strong> on terrorist launch pads, then returned.<sup><a href="#s2">[2]</a></sup>` },
    { p:`The operation was a statement as much as a tactic: that the cost of attacking India would be carried back across the border. It was the Para SF — soldiers like the one in my poem — who walked into the dark to deliver that message.` },
    { h2:`The ethos behind the badge` },
    { p:`What I tried to capture in <em>Red Devils' Reflections</em> is that these warriors are not defined by aggression alone. Their badge reads <em>balidaan</em> — sacrifice. They fight, in the poem's words, "not in destruction, but what we preserve, in a future of hope, that we deserve."` },
    { p:`That is the paradox of the special forces soldier: trained to be the sharpest instrument of war, yet motivated by the most ordinary human wish — for the people back home to sleep safely. "True honor lies in every deed," the poem says. The Red Devils sign off their missions and ask for nothing. We owe them at least our awareness that they exist.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Para (Special Forces)','Para_(Special_Forces)') },
    { n:2, html: SRC.wiki('2016 Indian Line of Control strike','2016_Indian_Line_of_Control_strike') }
  ],
  related:['marcos-marine-commandos','garud-commandos-iaf','mumbai-26-11-nsg']
});

add({
  slug:'siachen-worlds-highest-battlefield', date:'2026-04-13', category:'History', eyebrow:'History · Siachen',
  readTime:'7 min read',
  title:`Siachen: The World's Highest Battlefield`,
  h1:`Siachen: <em>The World's Highest Battlefield</em>`,
  plainTitle:`Siachen: The World's Highest Battlefield`,
  cardTitle:`Siachen: The World's Highest Battlefield`,
  desc:`At over 20,000 feet, the Siachen Glacier is the highest battlefield on Earth, where the cold kills more often than the enemy. The story of Operation Meghdoot and the soldiers who hold the roof of the world.`,
  keywords:`Siachen Glacier, world's highest battlefield, Operation Meghdoot, Bana Singh, Siachen soldiers, highest battlefield, Indian Army Siachen`,
  excerpt:`Over 20,000 feet, where the cold kills more than the enemy. The story of Operation Meghdoot and the soldiers who hold the roof of the world.`,
  hero:{ src:'assets/siachen.jpg', alt:'Indian Army soldiers in the snow at the Siachen Glacier', credit:CC.siachen },
  imageCredit:credit('siachen'),
  intro:[
    `There is a place where soldiers fight an enemy more relentless than any army: the altitude, the cold, and the thin, merciless air. The <strong>Siachen Glacier</strong>, high in the eastern Karakoram, is the highest battlefield on the planet — and India has held it since 1984.`,
    `Across my collection, the Himalayan frontier appears again and again. The soldier of <em>Unyielding Flames</em> stands "though shadows loom and time stands still," and nowhere is that stillness more deadly than on Siachen.`
  ],
  body:[
    { h2:`Operation Meghdoot` },
    { p:`On <strong>13 April 1984</strong>, India launched <strong>Operation Meghdoot</strong>, airlifting soldiers onto the Siachen Glacier to pre-empt a Pakistani move to occupy its commanding heights. It was the first time in history that troops had been deployed to fight at such an altitude — much of the conflict takes place above <strong>20,000 feet</strong>.<sup><a href="#s1">[1]</a></sup>` },
    { p:`At those heights, simply staying alive is a battle. Temperatures fall far below minus 30°C; avalanches, crevasses, frostbite and altitude sickness are constant threats. For decades, more soldiers on Siachen have died from the environment than from enemy fire.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`Above us the stars bear witness and glow, lighting the paths where our legends will grow.` },
    { h2:`The valour of the heights` },
    { p:`Siachen has produced extraordinary feats of courage. In 1987, <strong>Naib Subedar Bana Singh</strong> led an assault up a sheer ice wall to capture a critical Pakistani post at around 21,000 feet — later named <strong>Bana Top</strong> in his honour — and was awarded the <a href="param-vir-chakra.html">Param Vir Chakra</a>.<sup><a href="#s2">[2]</a></sup>` },
    { p:`But most of Siachen's heroism has no such citation. It is the daily, unglamorous endurance of young men holding a post of ice for months, cut off from the world, so that a line on the map stays where the nation needs it.` },
    { h2:`Why we hold it` },
    { p:`People sometimes ask why any nation would fight over a glacier where nothing grows. The answer is strategic, but it is also something deeper — the same instinct that runs through my book: that a nation's soldiers will hold the hardest ground precisely because it is hard, because to abandon it would be to break faith with everyone who froze there before them.` },
    { p:`The guardians of Siachen keep what the poem calls an "eternal watch," in a place that asks everything and gives almost nothing back. When we are warm, we owe them a thought. They are standing, right now, on the roof of the world.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Siachen conflict','Siachen_conflict') },
    { n:2, html: SRC.wiki('Bana Singh','Bana_Singh') }
  ],
  related:['battle-of-nathu-la-1967','galwan-valley-2020','kargil-war-operation-vijay']
});

/* =================================================================
   BATCH 2 — elite forces, the flag, leaders, and current events
   ================================================================= */

add({
  slug:'garud-commandos-iaf', date:'2025-10-08', category:'Elite Forces', eyebrow:'Elite Forces · IAF',
  readTime:'6 min read',
  title:`Garud Commandos: The Guardians of India's Skies`,
  h1:`Garud Commandos: <em>The Guardians of India's Skies</em>`,
  plainTitle:`Garud Commandos`,
  cardTitle:`Garud Commandos: Guardians of India's Skies`,
  desc:`The Garud Commando Force is the Indian Air Force's elite special unit, named after the divine eagle Garuda. The story of the silent guardians who protect the nation's air power.`,
  keywords:`Garud Commando Force, Indian Air Force commandos, Garud, IAF special forces, airbase protection, combat search and rescue, Wings of Vigilance`,
  excerpt:`Named after the divine eagle, the Garud Commandos are the Indian Air Force's elite — the silent guardians of the nation's skies.`,
  hero:{ src:'assets/iaf-rafale.jpg', alt:'An Indian Air Force Rafale fighter jet', credit:CC.rafale },
  imageCredit:credit('rafale'),
  intro:[
    `When we think of air power, we picture fighter jets and pilots. But every airbase, every aircraft, every runway needs to be protected on the ground — often deep in hostile territory. That is the work of the Indian Air Force's elite special force, the <strong>Garud Commandos</strong>, named after Garuda, the divine eagle of Indian mythology.`,
    `My poem <em>Wings of Vigilance</em> was written for these guardians of the sky: "We are the wings that rise with the night, guardians unseen, we hold the light."`
  ],
  body:[
    { h2:`Born from necessity` },
    { p:`The <strong>Garud Commando Force</strong> was raised in 2004 to give the Indian Air Force its own dedicated special operations capability.<sup><a href="#s1">[1]</a></sup> Their tasks include the protection of critical air bases and assets, combat search and rescue of downed pilots, disaster relief, and special operations in support of air campaigns.` },
    { p:`Their selection and training are among the longest of any Indian special force, forging operators capable of working in the most demanding environments — from forward airfields under threat to the chaos of a rescue behind enemy lines.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`Strength is quiet, not bound by noise, in stillness, we make the boldest choice.` },
    { h2:`The unseen half of air power` },
    { p:`A fighter jet is only as effective as the base it flies from and the ground it is defended on. Garud operators are the reason a hostile force cannot simply walk up to a runway and end an air campaign before it begins. They are the quiet foundation beneath the roar of the engines.` },
    { p:`Like much of what my book honours, their service is largely invisible to the public. There are no airshows for the men who guard the airfield's perimeter through the night. "Not for glory, nor for fame," the poem says, "but for the silence that carries our name."` },
    { h2:`Guardians who vanish at dawn` },
    { p:`What I find moving about the Garuds is captured in the poem's closing image: "As dawn breaks, the shadows recede, we vanish, but fulfill every need." Their highest achievement is often that nothing happened — that the base was never breached, the pilot was brought home, the mission flew unhindered.` },
    { p:`To guard the sky, someone must stand watch on the ground. The Garud Commandos do, and "the night remembers, and keeps our flame."` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Garud Commando Force','Garud_Commando_Force') },
    { n:2, html: SRC.wiki('Indian Air Force','Indian_Air_Force') }
  ],
  related:['marcos-marine-commandos','para-sf-surgical-strikes','indian-air-force-modern-power']
});

add({
  slug:'marcos-marine-commandos', date:'2025-10-15', category:'Elite Forces', eyebrow:'Elite Forces · Navy',
  readTime:'6 min read',
  title:`MARCOS: The Silent Warriors of the Sea`,
  h1:`MARCOS: <em>The Silent Warriors of the Sea</em>`,
  plainTitle:`MARCOS: The Silent Warriors of the Sea`,
  cardTitle:`MARCOS: The Silent Warriors of the Sea`,
  desc:`The Marine Commandos of the Indian Navy — MARCOS — operate unseen beneath the waves, on hostile coasts, and behind enemy lines. The story of one of the world's most secretive special forces.`,
  keywords:`MARCOS, Marine Commandos, Indian Navy special forces, maritime special operations, naval commandos India, Magnificent Seven, The Silent Depths`,
  excerpt:`Beneath the waves and on hostile coasts, the Indian Navy's MARCOS fight unseen. The silent warriors of the sea.`,
  hero:{ src:'assets/ins-vikrant.jpg', alt:'Indian Navy aircraft carriers INS Vikrant and INS Vikramaditya at sea', credit:CC.vikrant },
  imageCredit:credit('vikrant'),
  intro:[
    `The deadliest soldiers are often the ones you never see. India's <strong>Marine Commandos</strong> — known by their acronym <strong>MARCOS</strong> — train to emerge from the sea in darkness, strike, and slip back beneath the waves before the enemy knows they were there.`,
    `My poem <em>The Silent Depths</em> is written from the perspective of the sea itself, watching over these warriors: "Within my waves, they drift unseen, guardians of silence, sharp and keen."`
  ],
  body:[
    { h2:`From the deep` },
    { p:`The MARCOS were raised in the late 1980s to give the Indian Navy a maritime special operations capability comparable to the world's best.<sup><a href="#s1">[1]</a></sup> They are trained for amphibious raids, counter-terrorism at sea, underwater demolition, hostage rescue, and reconnaissance — operating from submarines, ships, helicopters and the open ocean.` },
    { p:`Their training is famously brutal, designed to weed out all but the most resilient. The result is a force capable of fighting in three environments at once — sea, land and air — and of doing so in total secrecy.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`No compass guides, no stars alight, yet they move with purpose, cloaked by night.` },
    { h2:`Anonymous by design` },
    { p:`The MARCOS guard their anonymity fiercely; operators are rarely named or photographed. During the 26/11 Mumbai attacks, marine commandos were among the first elite troops to enter the besieged hotels before the NSG arrived. Yet their faces remain hidden, their identities protected.` },
    { p:`This is the paradox at the heart of my poem: their greatest victories are the ones no one is allowed to know about. "Each ripple whispers of missions untold, where courage thrives and hearts stay bold."` },
    { h2:`The tide remembers` },
    { p:`There is something fitting about telling the MARCOS' story through the voice of the sea. The ocean keeps no monuments, raises no statues — and neither do these men. Their valour lives, as the poem says, "where my waters sweep, as sentinels eternal, of the nation's keep."` },
    { p:`The next time you stand on an Indian shore and watch the waves, remember that somewhere beneath a darker stretch of that same sea, the nation's silent warriors may be keeping watch. They ask only that the coast they protect sleeps safely. It does, because of them.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('MARCOS','MARCOS') },
    { n:2, html: SRC.wiki('Indian Navy','Indian_Navy') }
  ],
  related:['garud-commandos-iaf','indian-navy-ins-vikrant','para-sf-surgical-strikes']
});

add({
  slug:'raw-indias-silent-warriors', date:'2025-11-19', category:'History', eyebrow:'Intelligence',
  readTime:'6 min read',
  title:`The Unknown Soldier: India's Silent Warriors of Intelligence`,
  h1:`The Unknown Soldier: <em>India's Silent Warriors</em>`,
  plainTitle:`India's Silent Warriors of Intelligence`,
  cardTitle:`The Unknown Soldier: India's Silent Warriors`,
  desc:`Beyond the battlefield lies the war of intelligence — fought by men and women whose victories are classified and whose sacrifices are never recorded. A tribute to India's unseen guardians.`,
  keywords:`intelligence agencies India, RAW, Research and Analysis Wing, spies, covert operations, national security, The Unknown Soldier, unsung heroes`,
  excerpt:`A war with no medals and no monuments, fought by those who can never be named. A tribute to the unknown soldiers of intelligence.`,
  hero:{ src:'assets/amar-jawan-jyoti.jpg', alt:'The eternal flame honouring India’s unknown soldiers', credit:CC.amar },
  imageCredit:credit('amar'),
  intro:[
    `Not every soldier wears a uniform, and not every battlefield can be found on a map. Some of the nation's most important wars are fought in silence, by people whose successes are classified, whose names are never spoken, and whose sacrifices leave no trace in any history book.`,
    `My poem <em>The Unknown Soldier</em> is written for them: "Classified deeds, no story survives, yet nations breathe through their hidden lives."`
  ],
  body:[
    { h2:`The war in the shadows` },
    { p:`Behind every army stands an apparatus of intelligence — organisations such as the <strong>Research and Analysis Wing (RAW)</strong>, India's external intelligence agency, founded in 1968, and the Intelligence Bureau at home.<sup><a href="#s1">[1]</a></sup> Their officers and agents work to warn the nation of threats before they strike, to understand its adversaries, and sometimes to act where no soldier can.` },
    { p:`It is a profession with a cruel arithmetic. A success means an attack that never happened, a war that was quietly prevented, a disaster the public will never even learn it was spared. As the poem puts it: "A stolen document, a word unsaid, save millions from the tears unshed."` },
    { quote:`The battlefield knows the soldier's stride, but the spy's war is where truths collide.` },
    { h2:`No medals, no monuments` },
    { p:`The frontline soldier may receive a gallantry award, a name on a memorial, a folded flag handed to his family. The intelligence operative who dies on a mission often receives none of these — because to honour them publicly would be to reveal the very secret they died to protect. "No medals gleam upon their chest," the poem says, "no hymns rise to recount their quest."` },
    { p:`This is perhaps the purest form of the sacrifice my whole book is about: service so selfless that even recognition is surrendered. They give their lives and their names both.` },
    { h2:`Owed a quiet debt` },
    { p:`We can never know the full story of what these silent warriors have done for the nation — that is precisely the point. But we can choose to be aware that the safety we take for granted has unseen authors, that "every dawn owes them its light."` },
    { p:`The Unknown Soldier is not a single person. It is everyone whose courage kept us safe in ways we will never be told. To remember that they exist, even without their names, is the smallest tribute we can pay — and the only one they would ever accept.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Research and Analysis Wing','Research_and_Analysis_Wing') },
    { n:2, html: SRC.wiki('National security of India','National_security_of_India') }
  ],
  related:['marcos-marine-commandos','para-sf-surgical-strikes','the-folded-pride-indian-flag']
});

add({
  slug:'the-folded-pride-indian-flag', date:'2026-01-26', category:'Heritage', eyebrow:'Heritage · The Tricolour',
  readTime:'6 min read',
  title:`The Folded Pride: The Story of the Indian Tricolour`,
  h1:`The Folded Pride: <em>The Story of the Tricolour</em>`,
  plainTitle:`The Story of the Indian Tricolour`,
  cardTitle:`The Folded Pride: The Story of the Tricolour`,
  desc:`Saffron, white and green, with the Ashoka Chakra at its heart — the story of the Indian national flag, its meaning, and the solemn honour of the flag that drapes a fallen soldier.`,
  keywords:`Indian national flag, tricolour, tiranga, Ashoka Chakra, Pingali Venkayya, flag of India, flag draping martyr, The Folded Pride`,
  excerpt:`Saffron, white and green, with the wheel of law at its heart — the story of the tiranga, and the flag that drapes a fallen hero.`,
  hero:{ src:'assets/republic-day.jpg', alt:'The Indian tricolour carried on Republic Day', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `A flag is only cloth — and yet it is the one piece of cloth a soldier will die for, and the one that, in the end, covers them. The Indian <strong>tricolour</strong> — the <em>tiranga</em> — is woven into the deepest moments of the nation's life, from a child's first Independence Day to a hero's last journey.`,
    `My poem <em>The Folded Pride</em> is written in the voice of the flag itself: "I once danced with the wind, proud and high… but now I fold, in solemn embrace, to cradle the hero who kept me in place."`
  ],
  body:[
    { h2:`Saffron, white and green` },
    { p:`India's national flag was adopted on <strong>22 July 1947</strong>, weeks before Independence. Its design — a horizontal tricolour of saffron, white and green with a navy-blue <strong>Ashoka Chakra</strong> of twenty-four spokes at its centre — was based on the work of freedom fighter <strong>Pingali Venkayya</strong>.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Each element carries meaning: saffron for courage and sacrifice, white for peace and truth, green for faith and growth, and the Chakra — the wheel of dharma, or law — for ceaseless forward motion. The flag is, in miniature, a statement of what the nation hopes to be.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`I am not mere cloth; I am their trust, their final salute as they ascend to honor's crest.` },
    { h2:`The flag that drapes a hero` },
    { p:`There is one role of the tricolour that my poem dwells on: when a soldier falls in service, their coffin is draped in the national flag — a final, supreme honour. The same cloth that flew over forts and parade grounds folds itself, with great ceremony, around the body of the one who defended it.` },
    { p:`That fold is then handed to the family. "And when I'm passed to trembling hands," the flag says in the poem, "a mother's grief, a father's stand, I carry their story, their life untold." It is one of the most solemn moments in any nation's life.` },
    { h2:`More than a symbol` },
    { p:`When the law around the flag was eased in 2002 and again in recent years — allowing citizens to fly the tiranga more freely, including at night — it reflected a simple truth: the flag belongs to the people, and to the soldiers who carry its honour at the cost of their lives.` },
    { p:`To see the tricolour, then, is to see two things at once: a nation's pride flying high, and the folded grief of every family that received it in place of a loved one. "A flag for the fallen," the poem ends, "yet their memory survives."` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Flag of India','Flag_of_India') },
    { n:2, html: SRC.wiki('Pingali Venkayya','Pingali_Venkayya') }
  ],
  related:['national-war-memorial','veer-naris-families-who-serve','republic-day-india']
});

add({
  slug:'field-marshal-sam-manekshaw', date:'2026-04-03', category:'Heroes', eyebrow:'Heroes · Leadership',
  readTime:'7 min read',
  title:`Field Marshal Sam Manekshaw: The Soldier's Soldier`,
  h1:`Field Marshal Sam Manekshaw: <em>The Soldier's Soldier</em>`,
  plainTitle:`Field Marshal Sam Manekshaw`,
  cardTitle:`Field Marshal Sam Manekshaw: The Soldier's Soldier`,
  desc:`Sam "Bahadur" Manekshaw, India's first Field Marshal, led the army to its greatest victory in 1971. The story of a leader whose wit, courage and integrity made him a legend.`,
  keywords:`Sam Manekshaw, Field Marshal Manekshaw, Sam Bahadur, 1971 war, first Field Marshal India, Military Cross, Indian Army chief, military leadership`,
  excerpt:`"Sam Bahadur" — India's first Field Marshal, architect of the 1971 victory, and a leader whose wit and integrity became legend.`,
  hero:{ src:'assets/manekshaw.jpg', alt:'Field Marshal Sam Manekshaw', credit:CC.manekshaw },
  imageCredit:credit('manekshaw'),
  intro:[
    `Great armies are forged by great leaders, and few leaders in any nation's history are as beloved as <strong>Field Marshal Sam Manekshaw</strong> — "Sam Bahadur," Sam the Brave — the first soldier to hold India's highest military rank, and the architect of its most complete victory.`,
    `My book honours the soldier in the trench; this article honours the kind of leader who earns that soldier's absolute trust.`
  ],
  body:[
    { h2:`A career forged in fire` },
    { p:`Sam Hormusji Framji Jamshedji Manekshaw was commissioned into the British Indian Army in 1934. In the Second World War, fighting the Japanese in Burma, he was gravely wounded by machine-gun fire and awarded the <strong>Military Cross</strong> on the battlefield — the story goes that it was pinned on him because a posthumous award was expected.<sup><a href="#s1">[1]</a></sup>` },
    { p:`He survived, and over the following decades rose through the army with a reputation for fearlessness, sharp wit, and an absolute refusal to flatter his political masters.` },
    { quote:`Their courage you've sown, the values you gave, shape the man who stands unafraid.` },
    { h2:`The architect of 1971` },
    { p:`As Chief of the Army Staff in 1971, Manekshaw was asked by the Prime Minister to move against East Pakistan in the spring. He refused to be rushed — insisting that the army would be ready only after the monsoon, with proper preparation — and offered to resign if overruled.<sup><a href="#s1">[1]</a></sup> His judgement was trusted.` },
    { p:`When the war came in December, the result was decisive: the liberation of <a href="1971-war-birth-of-bangladesh.html">Bangladesh</a> and the surrender of around 93,000 troops in just thirteen days. In 1973, he was made India's first <strong>Field Marshal</strong>.<sup><a href="#s1">[1]</a></sup>` },
    { h2:`Why soldiers loved him` },
    { p:`Manekshaw's legend rests on more than victories. It rests on the way he cared for his soldiers, his legendary one-liners, and his unbending integrity. He believed a leader's job was to take responsibility and to tell the truth — to the troops below and the politicians above alike.` },
    { p:`In an age of noise, his example is a quiet lesson in what leadership actually costs: competence, courage, and the willingness to say "no" to power when the lives of your soldiers depend on it. The men in my poems follow orders into the gale. Sam Bahadur is the kind of man worth following.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Sam Manekshaw','Sam_Manekshaw') },
    { n:2, html: SRC.wiki('Indo-Pakistani War of 1971','Indo-Pakistani_War_of_1971') }
  ],
  related:['1971-war-birth-of-bangladesh','major-somnath-sharma','param-vir-chakra']
});

add({
  slug:'major-somnath-sharma', date:'2025-11-03', category:'Heroes', eyebrow:'Heroes · 1947',
  readTime:'6 min read',
  title:`Major Somnath Sharma: India's First Param Vir Chakra`,
  h1:`Major Somnath Sharma: <em>The First Param Vir</em>`,
  plainTitle:`Major Somnath Sharma`,
  cardTitle:`Major Somnath Sharma: India's First Param Vir`,
  desc:`At the Battle of Badgam in November 1947, Major Somnath Sharma held the line that saved Srinagar — and became the first recipient of the Param Vir Chakra. The story of where the roll of honour begins.`,
  keywords:`Major Somnath Sharma, first Param Vir Chakra, Battle of Badgam, 1947 war Kashmir, Kumaon Regiment, Srinagar airfield, gallantry`,
  excerpt:`At Badgam in 1947, one company stood between the enemy and Srinagar. Major Somnath Sharma held — and the roll of the Param Vir begins with his name.`,
  hero:{ src:'assets/param-vir-chakra.png', alt:'The Param Vir Chakra, first awarded to Major Somnath Sharma', credit:CC.pvc, cardContain:true, style:'aspect-ratio:auto;max-height:430px;object-fit:contain;background:linear-gradient(160deg,#0d1a3a,#0a1124);padding:2rem' },
  imageCredit:credit('pvc'),
  intro:[
    `Every roll of honour has to begin with a single name. India's highest gallantry award, the <a href="param-vir-chakra.html">Param Vir Chakra</a>, begins with <strong>Major Somnath Sharma</strong> — a young officer who, with his hand in a plaster cast, held a thin line that may well have saved Kashmir.`
  ],
  body:[
    { h2:`The first war` },
    { p:`In late 1947, soon after Independence and Partition, tribal raiders backed by Pakistan poured into Jammu and Kashmir, advancing toward Srinagar. The newly independent Indian Army rushed to defend the city, with the airfield at Srinagar as the vital lifeline connecting Kashmir to the rest of the country.<sup><a href="#s1">[1]</a></sup>` },
    { p:`On <strong>3 November 1947</strong>, Major Somnath Sharma's company of the 4th Battalion, Kumaon Regiment, was sent to <strong>Badgam</strong>, on the approach to the airfield. There they found themselves hugely outnumbered, facing a force determined to break through to Srinagar.<sup><a href="#s2">[2]</a></sup>` },
    { h2:`The line that held` },
    { p:`Though his right hand was in a plaster cast from a recent injury, Sharma moved among his men under heavy fire, exposing himself repeatedly to direct the defence, filling magazines for his soldiers, and refusing every chance to fall back. His final radio message reported the enemy only fifty yards away, his men outnumbered seven to one — but his decision to hold unwavering.<sup><a href="#s2">[2]</a></sup>` },
    { p:`He was killed when an enemy mortar shell detonated the ammunition he was carrying. But his company held long enough to blunt the advance and buy time for reinforcements. The airfield — and the route to Srinagar — was saved.` },
    { quote:`Remember us not as heroes craving fame, but as sons who bore the weight of a motherland.` },
    { h2:`Where the honour begins` },
    { p:`For his supreme sacrifice, Major Somnath Sharma was awarded the <strong>Param Vir Chakra</strong> — the very first, gazetted with effect from the day India's gallantry awards were instituted.<sup><a href="#s2">[2]</a></sup> Every recipient since stands, in a sense, in the line he began.` },
    { p:`There is a quiet symmetry in the fact that India's highest honour for valour starts not with a great offensive victory, but with a defensive last stand by an injured officer who simply would not leave his post. That, more than any conquest, is the spirit the medal was made to recognise — and the spirit my book was written to remember.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Indo-Pakistani War of 1947–1948','Indo-Pakistani_War_of_1947%E2%80%931948') },
    { n:2, html: SRC.wiki('Somnath Sharma','Somnath_Sharma') }
  ],
  related:['param-vir-chakra','national-war-memorial','field-marshal-sam-manekshaw']
});

add({
  slug:'galwan-valley-2020', date:'2025-06-15', category:'History', eyebrow:'History · 2020',
  readTime:'6 min read',
  title:`Galwan, 2020: The Night on the Roof of the World`,
  h1:`Galwan, 2020: <em>The Night on the Roof of the World</em>`,
  plainTitle:`Galwan Valley, 2020`,
  cardTitle:`Galwan, 2020: The Night on the Roof of the World`,
  desc:`In June 2020, Indian and Chinese soldiers fought a brutal, hours-long clash in the Galwan Valley of Ladakh — the first deadly combat on the India–China border in over four decades. The story of Colonel Santosh Babu and his men.`,
  keywords:`Galwan Valley clash, India China 2020, Colonel Santosh Babu, Ladakh standoff, 20 soldiers Galwan, LAC, Bihar Regiment, Maha Vir Chakra`,
  excerpt:`June 2020: the first deadly India–China clash in over 40 years, fought hand-to-hand in the dark at 14,000 feet. The story of Galwan.`,
  hero:{ src:'assets/army-mountains.jpg', alt:'Indian Army soldiers in the high mountains of Ladakh', credit:CC.army },
  imageCredit:credit('army'),
  intro:[
    `On a freezing night in June 2020, in a remote river valley in Ladakh, Indian and Chinese soldiers fought one of the most savage clashes of the modern era — without firing a shot. The <strong>Galwan Valley clash</strong> was the first combat to claim lives on the India–China border in over forty years.`,
    `It is a recent chapter in the very same Himalayan story my book returns to again and again — the cold, the height, and the soldiers who hold the line where the nation ends.`
  ],
  body:[
    { h2:`A standoff turns deadly` },
    { p:`Through the spring of 2020, tensions had been rising along the <strong>Line of Actual Control</strong> in eastern Ladakh, with Chinese troops massing in disputed areas. On the night of <strong>15 June 2020</strong>, a confrontation in the Galwan Valley escalated into a brutal, hours-long melee fought with fists, stones and improvised weapons at around 14,000 feet, in darkness and sub-zero cold.<sup><a href="#s1">[1]</a></sup>` },
    { p:`<strong>Twenty Indian soldiers</strong> were killed, including the commanding officer, <strong>Colonel B. Santosh Babu</strong> of the 16 Bihar Regiment. Chinese casualties, though never fully acknowledged by Beijing, were also significant.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`We stand as sentinels, unbowed and proud, our resolve unbroken, silent yet loud.` },
    { h2:`Courage without gunfire` },
    { p:`What makes Galwan haunting is its primal brutality. Because of long-standing protocols against using firearms along the disputed boundary, the soldiers fought essentially hand-to-hand on treacherous ground beside an icy river. Some fell to the terrain and the cold as much as to the enemy.` },
    { p:`Colonel Santosh Babu was posthumously awarded the <strong>Maha Vir Chakra</strong>, India's second-highest wartime gallantry award, and several of his men were also decorated for their valour that night.<sup><a href="#s2">[2]</a></sup>` },
    { h2:`The frontier that never sleeps` },
    { p:`Galwan was a reminder that the Himalayan frontier — the same one where the soldiers of <a href="battle-of-nathu-la-1967.html">Nathu La</a> stood in 1967 — remains one of the most dangerous and demanding postings on earth. The threats change shape; the cold and the courage do not.` },
    { p:`The men who died at Galwan were not fighting a declared war. They were doing what Indian soldiers have done on that frontier for generations: holding ground in an impossible place so that the rest of us never have to. Their watch, like the one in my poems, simply does not end.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('2020 China–India skirmishes','2020_China%E2%80%93India_skirmishes') },
    { n:2, html: SRC.gallantry }
  ],
  related:['siachen-worlds-highest-battlefield','battle-of-nathu-la-1967','operation-sindoor-2025']
});

add({
  slug:'operation-sindoor-2025', date:'2025-05-07', category:'Current', eyebrow:'Current Affairs · 2025',
  readTime:'7 min read',
  title:`Operation Sindoor, 2025: India's Answer to Pahalgam`,
  h1:`Operation Sindoor, 2025: <em>India's Answer to Pahalgam</em>`,
  plainTitle:`Operation Sindoor, 2025`,
  cardTitle:`Operation Sindoor, 2025: India's Answer to Pahalgam`,
  desc:`In May 2025, after the Pahalgam terror attack killed 26 civilians, India launched Operation Sindoor — precision strikes on terror infrastructure across the border. A clear-eyed look at the four days that followed.`,
  keywords:`Operation Sindoor, 2025 India Pakistan conflict, Pahalgam attack, May 2025 airstrikes, Jaish-e-Mohammed, Lashkar-e-Taiba, ceasefire May 2025, Indian Air Force`,
  excerpt:`May 2025: after the Pahalgam attack killed 26 civilians, India struck back. A clear-eyed look at Operation Sindoor and the four days that followed.`,
  hero:{ src:'assets/iaf-rafale.jpg', alt:'An Indian Air Force Rafale, of the kind used in 2025', credit:CC.rafale },
  imageCredit:credit('rafale'),
  intro:[
    `Patriotism is not only about the wars of the past. It is also about how a nation responds, today, when its people are attacked. In May 2025, India faced exactly such a moment — and its answer was <strong>Operation Sindoor</strong>.`,
    `This is a recent and still-debated chapter, so it deserves to be told carefully, with attention to what is established rather than what is claimed by either side.`
  ],
  body:[
    { h2:`The Pahalgam attack` },
    { p:`On <strong>22 April 2025</strong>, terrorists attacked tourists at Pahalgam in Jammu and Kashmir, killing <strong>26 people</strong> — twenty-five Indian tourists and one Nepali citizen. India blamed Pakistan-based militant groups for the massacre, and public demand for a response was overwhelming.<sup><a href="#s1">[1]</a></sup>` },
    { p:`The operation was named <em>Sindoor</em> — the vermilion worn by married Hindu women — a pointed reference to the women widowed in the attack.` },
    { h2:`The strikes of 7 May` },
    { p:`In the early hours of <strong>7 May 2025</strong>, India launched precision strikes on nine sites it described as terror infrastructure linked to groups including Jaish-e-Mohammed and Lashkar-e-Taiba, in Pakistan and Pakistan-administered Kashmir.<sup><a href="#s1">[1]</a></sup><sup><a href="#s2">[2]</a></sup> A tense, four-day military confrontation followed, involving aircraft and missiles on both sides.` },
    { p:`On <strong>10 May 2025</strong>, after the most serious crisis between the two nuclear-armed neighbours in years, a ceasefire was announced.<sup><a href="#s2">[2]</a></sup>` },
    { quote:`When shadows crept, the strikes were swift, a nation's roar through every rift.` },
    { h2:`A poem written before its time` },
    { p:`Long before May 2025, in my poem <a href="why-war-poetry-matters.html">on India's sovereignty</a>, I had written lines that now read almost as prophecy: "When shadows crept, the strikes were swift, a nation's roar through every rift. Not for vengeance, but for peace to reign, for dreams to thrive unchained by pain."` },
    { p:`That, in the end, is the only justification any such operation can claim — not revenge, but the protection of ordinary lives and the deterrence of the next attack. Whether it achieves that is a question history will answer.` },
    { h2:`Remembering responsibly` },
    { p:`As a writer, I believe patriotism includes the duty to speak about even recent events honestly — to honour the sacrifice and resolve of our forces while remaining sober about the terrible stakes of conflict between nuclear powers. Operation Sindoor was a moment of national grief and national resolve. The truest tribute is to remember both the courage it demanded and the cost that any war, threatened or fought, always carries.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('2025 India–Pakistan conflict','2025_India%E2%80%93Pakistan_conflict') },
    { n:2, html: `Analysis of the May 2025 crisis — Stimson Center, "Four Days in May," <a href="https://www.stimson.org/2025/four-days-in-may-the-india-pakistan-crisis-of-2025/" rel="nofollow noopener" target="_blank">stimson.org</a>; and Carnegie Endowment, <a href="https://carnegieendowment.org/" rel="nofollow noopener" target="_blank">carnegieendowment.org</a>.` }
  ],
  related:['balakot-airstrike-2019','galwan-valley-2020','operation-parakram-2001']
});

/* =================================================================
   BATCH 3 — the services, the great battles
   ================================================================= */

add({
  slug:'indian-navy-ins-vikrant', date:'2025-12-04', category:'History', eyebrow:'The Navy',
  readTime:'6 min read',
  title:`INS Vikrant: India's Self-Reliant Sentinel of the Seas`,
  h1:`INS Vikrant: <em>Sentinel of the Seas</em>`,
  plainTitle:`INS Vikrant`,
  cardTitle:`INS Vikrant: Sentinel of the Seas`,
  desc:`Commissioned in 2022, INS Vikrant is India's first home-built aircraft carrier — and the heir to a legendary name from the 1971 war. The story of a ship, a navy, and a nation's reach.`,
  keywords:`INS Vikrant, indigenous aircraft carrier, Indian Navy, Cochin Shipyard, IAC-1, blue water navy, Navy Day, maritime power India`,
  excerpt:`India's first home-built aircraft carrier, heir to a legendary 1971 name — the story of INS Vikrant and a navy that now reaches across oceans.`,
  hero:{ src:'assets/ins-vikrant.jpg', alt:'The aircraft carrier INS Vikrant at sea with its battle group', credit:CC.vikrant },
  imageCredit:credit('vikrant'),
  intro:[
    `A nation's strength is not only measured on its borders, but on the open ocean — in its ability to project power, protect its trade, and answer threats far from home. For India, much of that ambition now sails under one name: <strong>INS Vikrant</strong>.`,
    `My poem <em>The Silent Depths</em> honours the sailors and commandos of the deep. This is the story of the great ship they sail with.`
  ],
  body:[
    { h2:`An honoured name reborn` },
    { p:`The name <em>Vikrant</em> — "courageous" — carries history. The original INS Vikrant, India's first aircraft carrier, played a decisive role in the <a href="1971-war-birth-of-bangladesh.html">1971 war</a>, enforcing a blockade of the eastern seaboard. When it was retired, the name was destined to return on something even greater.<sup><a href="#s1">[1]</a></sup>` },
    { p:`On <strong>2 September 2022</strong>, the new INS Vikrant was commissioned — India's <strong>first indigenously designed and built aircraft carrier</strong>, constructed at Cochin Shipyard. At around 45,000 tonnes, it placed India among the very small club of nations able to build their own carriers.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`Their resolve flows as the tides endure, bound to a nation, steadfast and pure.` },
    { h2:`A blue-water navy` },
    { p:`A carrier is more than a ship; it is a moving airfield, a floating piece of sovereign territory that can sail to wherever the nation's interests lie. With Vikrant, India strengthened its standing as a <strong>blue-water navy</strong> — one capable of operating across the great oceans, from the Indian Ocean to far beyond.` },
    { p:`That matters more than ever. The seas carry the world's trade and the nation's energy; a strong navy keeps those lifelines open and deters those who would threaten them.` },
    { h2:`Self-reliance, made of steel` },
    { p:`Perhaps the deepest significance of Vikrant is that India built it. In an age of "Atmanirbhar Bharat" — self-reliant India — a home-built carrier is a statement that the nation can forge its own shield rather than buy it.<sup><a href="#s2">[2]</a></sup>` },
    { p:`Behind the engineering, though, are the people my poems are really about: the sailors who will spend months at sea, the commandos who launch from its decks into the dark, the families who wait ashore. The ship is steel. Its courage is human. "As sentinels eternal, of the nation's keep."` }
  ],
  sources:[
    { n:1, html: SRC.wiki('INS Vikrant (2013)','INS_Vikrant_(2013)') },
    { n:2, html: SRC.wiki('Indian Navy','Indian_Navy') }
  ],
  related:['marcos-marine-commandos','indian-air-force-modern-power','atmanirbhar-bharat-defence']
});

add({
  slug:'indian-air-force-modern-power', date:'2025-10-08', category:'History', eyebrow:'The Air Force',
  readTime:'6 min read',
  title:`Wings of the Nation: The Modern Indian Air Force`,
  h1:`Wings of the Nation: <em>The Modern Air Force</em>`,
  plainTitle:`The Modern Indian Air Force`,
  cardTitle:`Wings of the Nation: The Modern Air Force`,
  desc:`From the Rafale to the home-grown Tejas, the Indian Air Force is among the most capable in the world. A look at the aircraft, the airmen, and the meaning of command of the skies.`,
  keywords:`Indian Air Force, Rafale, Tejas LCA, Su-30 MKI, IAF modernisation, command of the air, air power India, Wings of Vigilance`,
  excerpt:`From the Rafale to the home-grown Tejas — a look at the modern Indian Air Force, and what it means to command the skies.`,
  hero:{ src:'assets/iaf-rafale.jpg', alt:'An Indian Air Force Rafale fighter jet in flight', credit:CC.rafale },
  imageCredit:credit('rafale'),
  intro:[
    `Whoever controls the sky controls the battlefield beneath it. The <strong>Indian Air Force (IAF)</strong> — one of the largest and most capable in the world — is the nation's shield and sword in the air, and a force my poetry returns to with particular affection.`,
    `My poem <em>Wings of Vigilance</em>, written for the Air Force's guardians, was singled out by the Chief of the Air Staff himself as catching "the spirit of our esteemed organisation."`
  ],
  body:[
    { h2:`A fleet of many feathers` },
    { p:`The modern IAF flies a diverse fleet: the French-built <strong>Rafale</strong>, a formidable multi-role fighter inducted from 2020; the Russian-origin <strong>Su-30 MKI</strong>, the backbone of its strike power; and increasingly the indigenous <strong>HAL Tejas</strong>, a home-grown light combat aircraft that symbolises India's drive for self-reliance.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Layered with airborne early-warning aircraft, mid-air refuellers, transport fleets and advanced air-defence systems, the IAF is built not just to fight, but to see, reach and sustain across a vast and varied geography — from desert to the highest mountains on earth.` },
    { quote:`Through storms, we carve the skies apart, guided by resolve, led by heart.` },
    { h2:`Command of the air` },
    { p:`Air power has been decisive in India's recent history — from <a href="kargil-war-operation-vijay.html">Operation Safed Sagar</a> over Kargil, to the <a href="balakot-airstrike-2019.html">Balakot strike</a> of 2019, to the operations of 2025. In each, the ability to strike precisely and deny the skies to the enemy shaped the outcome.` },
    { p:`But hardware is only half the story. An air force is its <strong>airmen and airwomen</strong> — the pilots, the engineers, the air-traffic and radar crews, the commandos who guard the bases. Every sortie rests on thousands of unseen hands.` },
    { h2:`Guardians of the sky` },
    { p:`What I tried to honour in <em>Wings of Vigilance</em> is the quiet vigilance behind the spectacle — the fact that the skies above a sleeping country are watched, every hour of every night, by people who ask for no applause. "Every step we take rewrites the air," the poem says, "where shadows dance, we are always there."` },
    { p:`A jet streaking overhead is thrilling. But the deeper truth is the watch that never ends — the reason a hostile aircraft never reaches the city, and the citizen never has to know how close danger came. That is air power's greatest victory: the attack that never arrives.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Indian Air Force','Indian_Air_Force') },
    { n:2, html: SRC.wiki('HAL Tejas','HAL_Tejas') }
  ],
  related:['garud-commandos-iaf','balakot-airstrike-2019','indian-navy-ins-vikrant']
});

add({
  slug:'battle-of-saragarhi-1897', date:'2025-09-12', category:'History', eyebrow:'History · 1897',
  readTime:'7 min read',
  title:`The Battle of Saragarhi: 21 Against an Army`,
  h1:`The Battle of Saragarhi: <em>21 Against an Army</em>`,
  plainTitle:`The Battle of Saragarhi`,
  cardTitle:`The Battle of Saragarhi: 21 Against an Army`,
  desc:`In 1897, twenty-one Sikh soldiers chose to fight to the last man against thousands of attackers at Saragarhi. It remains one of the greatest last stands in military history — and is commemorated every 12 September.`,
  keywords:`Battle of Saragarhi, 21 Sikh soldiers, 36th Sikhs, last stand, Havildar Ishar Singh, Saragarhi Day, Indian Order of Merit, military history`,
  excerpt:`In 1897, twenty-one Sikh soldiers chose to hold their post to the last man against thousands. One of history's greatest last stands.`,
  hero:{ src:'assets/republic-day.jpg', alt:'Soldiers of the Indian Army on parade', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `History records few stands as pure as <strong>Saragarhi</strong>. On 12 September 1897, twenty-one soldiers, knowing they could not win and would not be relieved in time, chose to fight to the last man rather than abandon their post. More than a century later, the world still studies their sacrifice.`,
    `It is the same ethos that runs through my book: the choice to hold the line not because victory is certain, but because duty is.`
  ],
  body:[
    { h2:`A signal post on the frontier` },
    { p:`Saragarhi was a small army signalling post in the rugged North-West Frontier, manned by twenty-one soldiers of the <strong>36th Sikhs</strong> of the British Indian Army, under <strong>Havildar Ishar Singh</strong>. It relayed communications between two larger forts.<sup><a href="#s1">[1]</a></sup>` },
    { p:`On <strong>12 September 1897</strong>, an estimated force of around <strong>ten thousand</strong> Afghan tribesmen attacked the post. The twenty-one defenders were offered the chance to surrender. They refused.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`For strength is born not in retreat, but in battles where hearts refuse defeat.` },
    { h2:`The last man, the last round` },
    { p:`For hours, the twenty-one held against impossible odds, repelling wave after wave. A soldier named Gurmukh Singh, manning the heliograph, signalled the unfolding battle to the fort even as it became clear no relief could arrive in time. He is said to have kept transmitting until he asked for permission to take up his rifle, then fought to the end.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Every one of the twenty-one was killed, but they inflicted enormous losses on the attackers and bought crucial time. All twenty-one were posthumously awarded the <strong>Indian Order of Merit</strong>, then the highest gallantry honour available to them — an unprecedented collective recognition.<sup><a href="#s1">[1]</a></sup>` },
    { h2:`Why we remember Saragarhi` },
    { p:`Saragarhi has become a byword for courage and discipline studied in military academies around the world, and it is commemorated by the Sikh Regiment every year as <strong>Saragarhi Day</strong>. It endures because it strips heroism down to its essence: not the glory of winning, but the integrity of not yielding.` },
    { p:`The twenty-one had nothing to gain and everything to lose, and they chose their post over their lives. That choice — made by ordinary men, for an idea larger than themselves — is exactly the "unyielding spirit" my poems try, in their small way, to keep alive.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Battle of Saragarhi','Battle_of_Saragarhi') },
    { n:2, html: SRC.wiki('Sikh Regiment','Sikh_Regiment') }
  ],
  related:['gorkha-regiments','major-somnath-sharma','1962-sino-indian-war']
});

add({
  slug:'gorkha-regiments', date:'2026-02-10', category:'Heritage', eyebrow:'Regiments · Heritage',
  readTime:'6 min read',
  title:`Ayo Gorkhali: The Legend of India's Gorkha Soldiers`,
  h1:`Ayo Gorkhali: <em>The Legend of the Gorkhas</em>`,
  plainTitle:`The Gorkha Regiments`,
  cardTitle:`Ayo Gorkhali: The Legend of the Gorkhas`,
  desc:`"Better to die than to be a coward." The story of the Gorkha regiments of the Indian Army — their khukri, their war cry, and a reputation for courage that spans two centuries.`,
  keywords:`Gorkha regiments, Gorkha soldiers, Ayo Gorkhali, khukri, Indian Army Gorkhas, Nepalese soldiers, bravest of the brave, military heritage`,
  excerpt:`"Better to die than be a coward." The khukri, the war cry "Ayo Gorkhali," and a two-century legend of courage.`,
  hero:{ src:'assets/republic-day.jpg', alt:'Indian Army soldiers marching on parade', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `There is a saying among the Gorkhas: <em>"Kaayar hunu bhanda marnu ramro"</em> — "It is better to die than to be a coward." Few units in any army have lived up to a motto so completely. The <strong>Gorkha regiments</strong> of the Indian Army are, by reputation, among the bravest soldiers on earth.`,
    `My book is full of unyielding spirits; the Gorkha is perhaps their living embodiment.`
  ],
  body:[
    { h2:`A bond forged in battle` },
    { p:`The Gorkhas — soldiers drawn largely from the hills of Nepal and from Indian Gorkha communities — have served with extraordinary distinction for over two centuries. Their relationship with the rest of the army began in mutual respect on the battlefield, and grew into one of the most storied martial traditions in the world.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Their famous curved knife, the <strong>khukri</strong>, is both a tool and a symbol; their war cry, <em>"Ayo Gorkhali!"</em> — "the Gorkhas are coming!" — has struck fear into adversaries across many wars.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`Fear does not linger in our stride, for courage walks where doubts subside.` },
    { h2:`Valour beyond counting` },
    { p:`Gorkha soldiers have won the highest honours of multiple nations. In the Indian Army, Gorkha regiments have produced Param Vir Chakra recipients and countless other decorated heroes — including, in the Kargil War, <a href="captain-vikram-batra.html">Lieutenant Manoj Kumar Pandey</a> of the 11 Gorkha Rifles, who was awarded the Param Vir Chakra posthumously.` },
    { p:`Even Field Marshal <a href="field-marshal-sam-manekshaw.html">Sam Manekshaw</a>, an officer of the Gorkhas, paid them the ultimate compliment: that if a man said he was not afraid of dying, he was either lying or he was a Gorkha.` },
    { h2:`The heart behind the legend` },
    { p:`What is easy to miss behind the fearsome reputation is the Gorkha's renowned warmth, loyalty and humility off the battlefield. The same soldiers spoken of in hushed tones by their enemies are, among their own, gentle, cheerful and famously devoted.` },
    { p:`That combination — ferocity in defence of others, gentleness in themselves — is the very heart of the soldier my poems try to honour. The Gorkha does not fight because he loves war. He fights, as the poem says, because "the land we guard is worth it all."` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Gorkha regiments (India)','Gorkha_regiments_(India)') },
    { n:2, html: SRC.wiki('Sam Manekshaw','Sam_Manekshaw') }
  ],
  related:['battle-of-saragarhi-1897','field-marshal-sam-manekshaw','1962-sino-indian-war']
});

add({
  slug:'1965-war-asal-uttar', date:'2025-09-22', category:'History', eyebrow:'History · 1965',
  readTime:'6 min read',
  title:`1965 and the Graveyard of Tanks at Asal Uttar`,
  h1:`1965 and the <em>Graveyard of Tanks</em>`,
  plainTitle:`The 1965 War and Asal Uttar`,
  cardTitle:`1965 and the Graveyard of Tanks at Asal Uttar`,
  desc:`In the 1965 war, the Battle of Asal Uttar turned a field in Punjab into a graveyard of Pakistani tanks — and gave India one of its greatest heroes, Abdul Hamid, PVC. The story of a hard-won stalemate.`,
  keywords:`1965 war, Indo-Pakistani War 1965, Battle of Asal Uttar, Abdul Hamid PVC, Patton graveyard, Lal Bahadur Shastri, Jai Jawan Jai Kisan, Tashkent`,
  excerpt:`In 1965, a Punjab field became a graveyard of Pakistani Patton tanks — and gave India the hero Abdul Hamid, PVC. The story of Asal Uttar.`,
  hero:{ src:'assets/republic-day.jpg', alt:'The Indian Army on parade', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `The war of 1965 between India and Pakistan rarely gets the attention of 1971 or Kargil, but it produced some of the most extraordinary feats of arms in Indian history — and none more famous than the <strong>Battle of Asal Uttar</strong>, where a determined defence turned an enemy armoured thrust into a graveyard of tanks.`
  ],
  body:[
    { h2:`A war of attrition` },
    { p:`The 1965 war was fought largely through August and September of that year, across the plains of Punjab and the deserts of the west. It was a hard, grinding conflict of infantry and armour, ending in a UN-brokered ceasefire and, later, the <strong>Tashkent Declaration</strong>.<sup><a href="#s1">[1]</a></sup>` },
    { p:`It was during this war that Prime Minister <strong>Lal Bahadur Shastri</strong> gave the nation its enduring slogan — <em>"Jai Jawan, Jai Kisan"</em> ("Hail the soldier, hail the farmer") — binding the courage of the frontline to the labour of the fields.` },
    { quote:`The crack of bullets, the clash of steel, the mountain groans but does not yield.` },
    { h2:`The graveyard of Patton tanks` },
    { p:`At <strong>Asal Uttar</strong>, near Khem Karan, Pakistan launched a major armoured offensive with its modern American-built Patton tanks. Indian defenders, fighting cleverly across flooded fields that bogged down the heavy armour, destroyed or captured so many tanks that the battlefield was nicknamed <strong>"Patton Nagar"</strong> — the graveyard of Pattons.<sup><a href="#s1">[1]</a></sup>` },
    { p:`It was here that <strong>Company Quartermaster Havildar Abdul Hamid</strong> of the 4th Grenadiers knocked out multiple enemy tanks with a recoilless gun mounted on a jeep before he was killed. He was awarded the <a href="param-vir-chakra.html">Param Vir Chakra</a> posthumously, and remains one of India's most cherished heroes.<sup><a href="#s2">[2]</a></sup>` },
    { h2:`The quiet lesson of 1965` },
    { p:`1965 ended without a clear victor on the map, but it restored Indian confidence after the trauma of 1962 and proved the resilience of the ordinary soldier against superior equipment. The Pattons were better tanks; the men of Asal Uttar were better defenders.` },
    { p:`That is a lesson my book keeps circling back to: that wars are decided less by hardware than by the human will behind it. A jeep-mounted gun and an unbreakable resolve undid the pride of an armoured division. "Each inch of ground a soldier's test," and the soldier passed.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Indo-Pakistani War of 1965','Indo-Pakistani_War_of_1965') },
    { n:2, html: SRC.wiki('Abdul Hamid (soldier)','Abdul_Hamid_(soldier)') }
  ],
  related:['1962-sino-indian-war','param-vir-chakra','1971-war-birth-of-bangladesh']
});

add({
  slug:'1962-sino-indian-war', date:'2025-10-20', category:'History', eyebrow:'History · 1962',
  readTime:'7 min read',
  title:`1962 and the Last Stand at Rezang La`,
  h1:`1962 and the <em>Last Stand at Rezang La</em>`,
  plainTitle:`The 1962 War and Rezang La`,
  cardTitle:`1962 and the Last Stand at Rezang La`,
  desc:`The 1962 war with China was a national trauma — but within the defeat shone moments of supreme courage, none greater than the last stand of the 13 Kumaon at Rezang La under Major Shaitan Singh, PVC.`,
  keywords:`1962 war, Sino-Indian War, Rezang La, Major Shaitan Singh, 13 Kumaon, Charlie Company, Param Vir Chakra, India China 1962, last stand`,
  excerpt:`Within the defeat of 1962 shone supreme courage — the last stand of 120 men of the 13 Kumaon at Rezang La, under Major Shaitan Singh, PVC.`,
  hero:{ src:'assets/army-mountains.jpg', alt:'Indian soldiers in a high mountain landscape', credit:CC.army },
  imageCredit:credit('army'),
  intro:[
    `The Sino-Indian War of 1962 is remembered by India as a defeat — a hard, formative wound. And yet even within that loss, the army produced moments of courage so absolute that they have outlasted the shame of the war itself. The greatest of these was the last stand at <strong>Rezang La</strong>.`,
    `My poem <em>The Silent Ridge</em> speaks of men "barely men, yet unshaken they sit" on a cruel peak. Nowhere is that image truer than at Rezang La.`
  ],
  body:[
    { h2:`A war India was not ready for` },
    { p:`In October–November 1962, China launched a large offensive across the Himalayan frontier. Indian troops — under-equipped, under-supplied, and fighting at extreme altitude without winter gear — were overwhelmed in many sectors. The war ended in a Chinese-declared ceasefire and lasting national soul-searching.<sup><a href="#s1">[1]</a></sup>` },
    { p:`But the failures of planning and politics should never erase the valour of the soldiers, who fought and died with remarkable courage in impossible conditions.` },
    { quote:`We are not soldiers; we are resolve, an oath unbroken, no matter the cost.` },
    { h2:`The men of Charlie Company` },
    { p:`At <strong>Rezang La</strong>, a high pass in Ladakh at over 16,000 feet, around 120 men of the Charlie Company of the <strong>13 Kumaon</strong>, led by <strong>Major Shaitan Singh</strong>, held an isolated position against waves of attacking Chinese troops in the bitter cold.<sup><a href="#s2">[2]</a></sup>` },
    { p:`Cut off from artillery support by the terrain, they fought with rifles, grenades and bayonets. Almost the entire company fought to the death rather than withdraw; only a handful survived. Major Shaitan Singh, mortally wounded, refused to be evacuated and died directing his men. He was awarded the <a href="param-vir-chakra.html">Param Vir Chakra</a> posthumously.<sup><a href="#s2">[2]</a></sup>` },
    { h2:`Defeat, and the seeds of resolve` },
    { p:`Rezang La gave India something it desperately needed even in defeat: proof that the failure of 1962 was not the failure of its soldiers. When the bodies were later recovered, many were found still at their posts, weapons in hand, surrounded by the enemy fallen.` },
    { p:`That image — men who would not leave their ridge — helped steel a nation to rebuild its army, a resolve that bore fruit at <a href="battle-of-nathu-la-1967.html">Nathu La in 1967</a>. The poppies of remembrance grow even in lost battles. Rezang La is where India learned that courage is not the same as victory, and is sometimes greater than it.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Sino-Indian War','Sino-Indian_War') },
    { n:2, html: SRC.wiki('Battle of Rezang La','Battle_of_Rezang_La') }
  ],
  related:['battle-of-nathu-la-1967','1965-war-asal-uttar','battle-of-saragarhi-1897']
});

add({
  slug:'balakot-airstrike-2019', date:'2025-02-26', category:'Current', eyebrow:'Recent History · 2019',
  readTime:'6 min read',
  title:`Balakot, 2019: The Strike After Pulwama`,
  h1:`Balakot, 2019: <em>The Strike After Pulwama</em>`,
  plainTitle:`The Balakot Airstrike, 2019`,
  cardTitle:`Balakot, 2019: The Strike After Pulwama`,
  desc:`After the Pulwama attack killed 40 CRPF personnel in February 2019, the Indian Air Force struck a terror camp at Balakot across the border. The story of those tense February days — and Wing Commander Abhinandan.`,
  keywords:`Balakot airstrike, Pulwama attack 2019, Indian Air Force Mirage 2000, Wing Commander Abhinandan, Jaish-e-Mohammed, February 2019, cross-border strike`,
  excerpt:`After Pulwama killed 40 CRPF men in 2019, the IAF struck a terror camp at Balakot. The story of those tense February days.`,
  hero:{ src:'assets/iaf-rafale.jpg', alt:'An Indian Air Force fighter jet', credit:CC.rafale },
  imageCredit:credit('rafale'),
  intro:[
    `In February 2019, India was struck by grief and then galvanised into action. The <strong>Balakot airstrike</strong> marked a significant shift in how the nation answered cross-border terrorism — and produced days of tension that the whole country lived through hour by hour.`
  ],
  body:[
    { h2:`Pulwama` },
    { p:`On <strong>14 February 2019</strong>, a suicide bomber struck a convoy of the Central Reserve Police Force at Pulwama in Jammu and Kashmir, killing <strong>40 CRPF personnel</strong>. The Pakistan-based group Jaish-e-Mohammed claimed responsibility, and the nation was plunged into mourning and outrage.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`For every scream they dared to inspire, I bring a vengeance that burns like fire.` },
    { h2:`The strike` },
    { p:`In the pre-dawn hours of <strong>26 February 2019</strong>, Indian Air Force Mirage 2000 jets crossed the Line of Control and struck what India described as a major Jaish-e-Mohammed training camp near <strong>Balakot</strong>, inside Pakistan.<sup><a href="#s1">[1]</a></sup> It was the first such air strike across the international border since 1971.` },
    { p:`The next day brought an aerial engagement in which <strong>Wing Commander Abhinandan Varthaman's</strong> MiG-21 was shot down; he ejected, was captured by Pakistan, and was returned to India a few days later — a moment that gripped the country.<sup><a href="#s1">[1]</a></sup>` },
    { h2:`A new doctrine, and its weight` },
    { p:`Balakot signalled a more assertive Indian posture — a willingness to strike terror infrastructure across the border. It was, in spirit, a precursor to <a href="operation-sindoor-2025.html">Operation Sindoor</a> six years later.` },
    { p:`The poem <em>The Fire Within</em>, written about the fury of the soldier avenging the innocent, captures the emotional charge of such moments. But part of writing honestly about patriotism is to hold two truths together: the righteous anger at an attack on the defenceless, and the sober knowledge of how dangerous escalation between nuclear neighbours can be. Balakot was both a moment of national resolve and a reminder of how high the stakes have become.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('2019 Balakot airstrike','2019_Balakot_airstrike') },
    { n:2, html: SRC.wiki('Indian Air Force','Indian_Air_Force') }
  ],
  related:['operation-sindoor-2025','indian-air-force-modern-power','mumbai-26-11-nsg']
});

add({
  slug:'kargil-vijay-diwas', date:'2025-07-26', category:'Tribute', eyebrow:'Remembrance · 26 July',
  readTime:'5 min read',
  title:`Kargil Vijay Diwas: Why We Remember 26 July`,
  h1:`Kargil Vijay Diwas: <em>Why We Remember 26 July</em>`,
  plainTitle:`Kargil Vijay Diwas`,
  cardTitle:`Kargil Vijay Diwas: Why We Remember 26 July`,
  desc:`Every 26 July, India marks Kargil Vijay Diwas — the day the Kargil War was won in 1999. What the day means, how it is observed, and why remembrance is a duty, not a ceremony.`,
  keywords:`Kargil Vijay Diwas, 26 July, Kargil War anniversary, Drass war memorial, remembrance day India, Operation Vijay, Kargil heroes`,
  excerpt:`Every 26 July, India marks the day the Kargil War was won. What Vijay Diwas means, and why remembrance is a duty, not a ceremony.`,
  hero:{ src:'assets/kargil-war-memorial.jpg', alt:'The Kargil War Memorial at Drass', credit:CC.kargil },
  imageCredit:credit('kargil'),
  intro:[
    `Some dates a nation must never let slip into ordinariness. <strong>26 July</strong> is one of them. It is <strong>Kargil Vijay Diwas</strong> — the day, in 1999, that the last intruder was driven from Indian soil and the <a href="kargil-war-operation-vijay.html">Kargil War</a> was won.`,
    `My poem <em>The Silence After Victory</em> was written for exactly this day — the strange quiet that follows triumph, when the cost finally becomes visible.`
  ],
  body:[
    { h2:`The day victory was declared` },
    { p:`After nearly three months of brutal high-altitude fighting through the summer of 1999, India declared the successful conclusion of <strong>Operation Vijay</strong> on 26 July. The heights had been retaken; the Line of Control restored. The victory had cost <strong>527 Indian lives</strong>.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`No victory blooms without its thorn, for peace is a rose in conflict born.` },
    { h2:`How the day is observed` },
    { p:`Each year, the nation pauses to remember. The principal observances are held at the <strong>Kargil War Memorial</strong> at Drass, beneath the very peaks that were reclaimed, where families, veterans and serving soldiers gather to honour the fallen.<sup><a href="#s1">[1]</a></sup> Wreaths are laid; names are read; the young learn the stories of those barely older than themselves who did not return.` },
    { h2:`Remembrance as a duty` },
    { p:`It is easy for a commemoration to harden into routine — a ceremony performed and forgotten by lunchtime. Vijay Diwas asks for something more active: that we actually <em>remember</em>, that we know a name or two, that we understand what 26 July cost.` },
    { p:`My poem ends on the paradox at the heart of the day: "Victory rises, though shadows remain, a truth eternal through triumph and pain." Kargil Vijay Diwas is not a celebration of war. It is a promise — renewed every 26 July — that the men who climbed those peaks will not be allowed to fade. To keep that promise is the simplest, and the most important, patriotism of all.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Kargil War','Kargil_War') },
    { n:2, html: SRC.pib }
  ],
  related:['kargil-war-operation-vijay','captain-vikram-batra','national-war-memorial']
});

/* =================================================================
   BATCH 4 — current affairs, heritage, reflection (to 35)
   ================================================================= */

add({
  slug:'agnipath-agniveer-scheme', date:'2026-05-10', category:'Current', eyebrow:'Current Affairs · Defence',
  readTime:'6 min read',
  title:`The Agnipath Scheme: A New Generation of Agniveers`,
  h1:`The Agnipath Scheme: <em>A New Generation of Agniveers</em>`,
  plainTitle:`The Agnipath Scheme`,
  cardTitle:`The Agnipath Scheme: A New Generation of Agniveers`,
  desc:`Introduced in 2022, the Agnipath scheme changed how India recruits its soldiers, sailors and airmen. A clear, balanced explainer of the Agniveer model — how it works, its aims, and its debates.`,
  keywords:`Agnipath scheme, Agniveer, Indian Army recruitment, four year service, Seva Nidhi, defence reform India, military recruitment 2022`,
  excerpt:`Introduced in 2022, the Agnipath scheme reshaped how India recruits its soldiers. A clear, balanced explainer of the Agniveer model.`,
  hero:{ src:'assets/republic-day.jpg', alt:'Young soldiers of the Indian Army on parade', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `Every nation must constantly ask how best to raise the soldiers who defend it. In 2022, India introduced one of the biggest changes to military recruitment in its history: the <strong>Agnipath scheme</strong>, and with it a new kind of soldier — the <strong>Agniveer</strong>, the "fire-warrior."`,
    `This is a recent and debated reform, so it is worth explaining plainly and fairly.`
  ],
  body:[
    { h2:`How the scheme works` },
    { p:`The Agnipath scheme was approved on <strong>14 June 2022</strong> and rolled out later that year for recruitment below the rank of commissioned officer across the Army, Navy and Air Force.<sup><a href="#s1">[1]</a></sup> Under it, young recruits — called <strong>Agniveers</strong>, a new rank — serve for a <strong>four-year tenure</strong>, including about six months of training.` },
    { p:`At the end of four years, up to <strong>25 per cent</strong> of each batch may be selected to continue in the armed forces as regulars; the rest leave with a tax-free lump-sum "Seva Nidhi" package of roughly ₹11–12 lakh, a skill certificate, and assistance toward future careers.<sup><a href="#s1">[1]</a></sup> The government has aimed to recruit tens of thousands of Agniveers each year.` },
    { h2:`The aims behind it` },
    { p:`Supporters argue the scheme will lower the average age of the forces, create a larger pool of trained, disciplined young citizens, and modernise a recruitment system long due for reform. Eligibility is open to both young men and women, broadening who can serve.<sup><a href="#s1">[1]</a></sup>` },
    { h2:`The debate` },
    { p:`The scheme also drew significant debate. Critics raised concerns about job security, the lack of a pension for those not retained, and the effect of shorter tenures on unit cohesion and regimental tradition. The government responded with assurances on welfare, reservations in other services for ex-Agniveers, and adjustments such as a temporary rise in the upper age limit.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`Each step we take, a vow renewed, to shield the land where dreams are pursued.` },
    { h2:`The same oath, a new path` },
    { p:`Whatever one's view of the model, the young people stepping forward as Agniveers are doing what soldiers in my book have always done — raising their hand to serve, accepting hardship and risk on behalf of strangers. The uniform's design may change with the times; the courage required to wear it does not.` },
    { p:`Reforms will be argued over by policymakers, as they should be. But the eighteen-year-old who chooses to train for the defence of the nation deserves, in every era, our respect. They are the latest to answer a very old call.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Agnipath Scheme','Agnipath_Scheme') },
    { n:2, html: SRC.pib }
  ],
  related:['women-in-indian-armed-forces','atmanirbhar-bharat-defence','republic-day-india']
});

add({
  slug:'women-in-indian-armed-forces', date:'2026-03-08', category:'Current', eyebrow:'Current Affairs · Forces',
  readTime:'6 min read',
  title:`Breaking Barriers: Women in the Indian Armed Forces`,
  h1:`Breaking Barriers: <em>Women in the Armed Forces</em>`,
  plainTitle:`Women in the Indian Armed Forces`,
  cardTitle:`Breaking Barriers: Women in the Armed Forces`,
  desc:`From the first women fighter pilots to permanent commissions and combat roles, women are reshaping the Indian armed forces. The story of a barrier falling, rank by rank.`,
  keywords:`women in Indian armed forces, women fighter pilots, permanent commission women officers, Avani Chaturvedi, women in combat India, NDA women, gender military`,
  excerpt:`From the first women fighter pilots to permanent commissions and combat roles — the story of a barrier falling, rank by rank.`,
  hero:{ src:'assets/republic-day.jpg', alt:'Indian Armed Forces personnel on parade', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `Courage has never belonged to one gender, and increasingly the Indian armed forces reflect that truth. Over the past decade, women have moved from the margins toward the heart of military service — flying fighter jets, leading troops, and winning the right to permanent careers in uniform.`
  ],
  body:[
    { h2:`Into the cockpit` },
    { p:`A landmark came in 2016, when the Indian Air Force commissioned its <strong>first women fighter pilots</strong> — Avani Chaturvedi, Bhawana Kanth and Mohana Singh — opening the fast-jet cockpit to women for the first time.<sup><a href="#s1">[1]</a></sup> It was a powerful signal: that the most demanding combat role in the air was no longer closed by gender.` },
    { quote:`Strength is quiet, not bound by noise, in stillness, we make the boldest choice.` },
    { h2:`The right to stay` },
    { p:`Another turning point came through the courts. In 2020, the Supreme Court of India ruled that women officers were entitled to <strong>permanent commissions</strong> and command appointments in the Army, striking down arguments that had long limited their careers.<sup><a href="#s2">[2]</a></sup> The decision affirmed that women could not be denied advancement simply for being women.` },
    { h2:`New frontiers` },
    { p:`The changes have continued: women cadets admitted to the National Defence Academy, women inducted into roles once closed to them — including the artillery — and a steadily widening set of opportunities across all three services. Each step has been earned against real resistance, and each has expanded what the next generation of girls can imagine for themselves.` },
    { h2:`The same flame` },
    { p:`My poems speak of guardians without ever insisting they are only men, because the spirit of service has no gender. The woman who flies a sortie at dawn, or commands a unit on a difficult posting, carries the very same "fire within" as any soldier in my book.` },
    { p:`A nation grows stronger when it draws courage from all its people, not half of them. The women breaking these barriers are not only advancing their own careers; they are making the armed forces a truer reflection of the country they defend — and writing a new verse in a very old story of service.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Women in the Indian Armed Forces','Women_in_the_Indian_Armed_Forces') },
    { n:2, html: SRC.wiki('Indian Army','Indian_Army') }
  ],
  related:['agnipath-agniveer-scheme','indian-air-force-modern-power','atmanirbhar-bharat-defence']
});

add({
  slug:'atmanirbhar-bharat-defence', date:'2026-02-01', category:'Current', eyebrow:'Current Affairs · Defence',
  readTime:'6 min read',
  title:`Atmanirbhar Bharat: India's Push for Self-Reliant Defence`,
  h1:`Atmanirbhar Bharat: <em>Self-Reliant Defence</em>`,
  plainTitle:`Self-Reliant Defence`,
  cardTitle:`Atmanirbhar Bharat: Self-Reliant Defence`,
  desc:`From the Tejas fighter to the home-built carrier INS Vikrant, India is striving to make its own weapons rather than import them. A look at the drive for self-reliant defence — and why it matters.`,
  keywords:`Atmanirbhar Bharat defence, self-reliant India defence, Make in India defence, Tejas, INS Vikrant, defence indigenisation, DRDO, defence exports India`,
  excerpt:`From the Tejas fighter to the home-built INS Vikrant, India is striving to make its own weapons. Why self-reliant defence matters.`,
  hero:{ src:'assets/ins-vikrant.jpg', alt:'The indigenously built INS Vikrant at sea', credit:CC.vikrant },
  imageCredit:credit('vikrant'),
  intro:[
    `True sovereignty is not only the ability to defend your land — it is the ability to forge the means of that defence yourself. For decades India was one of the world's largest arms importers. Today, under the banner of <strong>Atmanirbhar Bharat</strong> ("self-reliant India"), it is working to change that.`
  ],
  body:[
    { h2:`From buyer to builder` },
    { p:`India's drive for defence self-reliance spans all three services and many institutions — the design houses of the DRDO, public-sector giants like HAL and the shipyards, and a fast-growing private defence industry.<sup><a href="#s1">[1]</a></sup> The government has used measures such as "positive indigenisation lists," which progressively bar the import of items that can be made at home, to push the shift.` },
    { p:`The results are increasingly visible: the indigenous <strong>HAL Tejas</strong> light combat aircraft, the home-built carrier <a href="indian-navy-ins-vikrant.html">INS Vikrant</a>, a widening range of missiles, artillery and equipment — and a rise in <strong>defence exports</strong>, as India begins to sell, not just buy.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`The roots of freedom lie buried in loss, every victory forged from what it costs.` },
    { h2:`Why it matters` },
    { p:`Dependence on foreign suppliers is a strategic vulnerability: spares can be withheld, deliveries delayed, prices dictated, and political conditions attached at the worst possible moment. A nation that builds its own arms controls its own defence in a way an importer never can.` },
    { p:`Self-reliance also builds jobs, skills and an industrial base — turning the act of defence into an engine of national development, binding "Jai Jawan" to "Jai Vigyan," the soldier to the scientist.` },
    { h2:`The deeper sovereignty` },
    { p:`My poem <em>The History of Sovereignty</em> reflects on how dearly a nation's freedom is bought. Self-reliant defence is the modern continuation of that idea — the understanding that independence won in 1947 must be perpetually re-earned, not only on the battlefield but in the workshop and the laboratory.` },
    { p:`A country that can feed itself, defend itself, and build its own shield is a country no one can easily bend. That is the quiet, ambitious meaning of Atmanirbhar Bharat — and it honours, in steel and circuitry, the same independence the soldiers in my book defend in snow and silence.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Defence industry of India','Defence_industry_of_India') },
    { n:2, html: SRC.pib }
  ],
  related:['indian-navy-ins-vikrant','indian-air-force-modern-power','women-in-indian-armed-forces']
});

add({
  slug:'republic-day-india', date:'2026-01-26', category:'Heritage', eyebrow:'Heritage · 26 January',
  readTime:'5 min read',
  title:`Republic Day: The Promise India Renews Every January`,
  h1:`Republic Day: <em>The Promise India Renews</em>`,
  plainTitle:`Republic Day`,
  cardTitle:`Republic Day: The Promise India Renews`,
  desc:`Every 26 January, India celebrates the day its Constitution came into force in 1950. Beyond the grand parade lies a deeper meaning — and a roll-call of the nation's bravest, honoured on the same day.`,
  keywords:`Republic Day India, 26 January, Constitution of India 1950, Republic Day parade, Kartavya Path, gallantry awards, Beating Retreat, national celebration`,
  excerpt:`Every 26 January, India marks the day its Constitution came alive. Beyond the parade lies a deeper promise — and its bravest, honoured.`,
  hero:{ src:'assets/republic-day.jpg', alt:'The Indian Army contingent at the Republic Day parade', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `On <strong>26 January</strong>, India does not merely hold a parade. It renews a promise it first made to itself in 1950 — a promise about the kind of nation it intends to be. <strong>Republic Day</strong> is that promise, dressed in colour and ceremony.`
  ],
  body:[
    { h2:`The day a republic was born` },
    { p:`On 26 January 1950, the <strong>Constitution of India</strong> came into force, transforming the newly independent dominion into a sovereign democratic republic.<sup><a href="#s1">[1]</a></sup> The date was chosen deliberately: it was the anniversary of the 1930 "Purna Swaraj" declaration of complete independence, linking the new republic to the long freedom struggle that birthed it.` },
    { quote:`The flag stood tall, the oath held true, a soldier's dream in tricolor hue.` },
    { h2:`More than a parade` },
    { p:`The grand parade along Kartavya Path in New Delhi, with its marching contingents, tableaux and flypast, is the public face of the day. But woven into the same ceremony is something more solemn: the conferral of the nation's highest <strong>gallantry awards</strong>, and the honouring of its bravest — including those who receive their medals posthumously, accepted by grieving families.<sup><a href="#s1">[1]</a></sup>` },
    { p:`So the celebration of the republic and the remembrance of its defenders happen side by side, as they should. The parade ground holds both the joy of freedom and the price of it.` },
    { h2:`Renewing the vow` },
    { p:`A republic is not a thing achieved once and kept forever. It is a promise that each generation must choose to keep — the promise of justice, liberty, equality and fraternity written into the Constitution's preamble.` },
    { p:`The soldiers who march on 26 January, and those honoured on it, are the most visible guardians of that promise. But Republic Day quietly asks the same thing of every citizen watching: to be worthy, in our own smaller ways, of the freedom these men and women defend. That, more than any flypast, is what the day is for.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Republic Day (India)','Republic_Day_(India)') },
    { n:2, html: SRC.wiki('Constitution of India','Constitution_of_India') }
  ],
  related:['the-folded-pride-indian-flag','national-war-memorial','india-gate-amar-jawan-jyoti']
});

add({
  slug:'india-gate-amar-jawan-jyoti', date:'2026-01-21', category:'Heritage', eyebrow:'Heritage · India Gate',
  readTime:'6 min read',
  title:`India Gate and the Eternal Flame of the Amar Jawan Jyoti`,
  h1:`India Gate and the <em>Eternal Flame</em>`,
  plainTitle:`India Gate and the Amar Jawan Jyoti`,
  cardTitle:`India Gate and the Eternal Flame`,
  desc:`India Gate has watched over Delhi for a century, and for fifty years its Amar Jawan Jyoti burned for the unknown soldier. The story of the monument, the flame, and its 2022 move to the National War Memorial.`,
  keywords:`India Gate, Amar Jawan Jyoti, eternal flame, unknown soldier India, Lutyens Delhi, war memorial, National War Memorial merger 2022`,
  excerpt:`A century-old arch, a flame that burned for fifty years for the unknown soldier — and its 2022 journey to a new home.`,
  hero:{ src:'assets/amar-jawan-jyoti.jpg', alt:'The Amar Jawan Jyoti flame at India Gate', credit:CC.amar },
  imageCredit:credit('amar'),
  intro:[
    `Few monuments are as woven into a nation's imagination as <strong>India Gate</strong>. For a century it has stood at the heart of New Delhi; for fifty years its eternal flame, the <strong>Amar Jawan Jyoti</strong>, burned in honour of the soldier with no name. Its story is the story of how India learned to grieve its fallen.`,
    `My poem <em>Echoes in the Embers</em> imagines a child standing before just such a flame, holding a fallen father's medal.`
  ],
  body:[
    { h2:`An arch of memory` },
    { p:`India Gate was built in the 1920s, designed by the architect Edwin Lutyens, as a memorial to the soldiers of the British Indian Army who died in the First World War and the Third Anglo-Afghan War. The names of thousands of them are inscribed upon its sandstone.<sup><a href="#s1">[1]</a></sup>` },
    { p:`For decades it was simply a grand arch and a much-loved gathering place. Then, after the <a href="1971-war-birth-of-bangladesh.html">1971 war</a>, it gained a deeper purpose.` },
    { quote:`This flame, a sentinel of flickering hopes, casts long the stories we tether to our ropes.` },
    { h2:`The flame for the unknown soldier` },
    { p:`In 1972, the <strong>Amar Jawan Jyoti</strong> — the "Flame of the Immortal Soldier" — was installed beneath the arch: an eternal flame honouring India's unknown soldiers, those who fell without their sacrifice ever being individually recorded.<sup><a href="#s1">[1]</a></sup> For half a century, it was the place the nation came to remember.` },
    { h2:`A flame that found a new home` },
    { p:`On <strong>21 January 2022</strong>, the flame of the Amar Jawan Jyoti was ceremonially merged with the eternal flame at the new <a href="national-war-memorial.html">National War Memorial</a> nearby.<sup><a href="#s1">[1]</a></sup> The move was debated — many had grown up saluting the India Gate flame — but its logic was that independent India's soldiers should be honoured at a memorial built for them, rather than under a colonial-era arch.` },
    { p:`The fire did not go out; it was carried to a place built to receive it. India Gate still stands, magnificent against the Delhi sky, and the flame still burns — only now beside the names of the very soldiers my poems were written to remember. As <em>Echoes in the Embers</em> puts it, it remains "a beacon of valor, an everlasting flame."` }
  ],
  sources:[
    { n:1, html: SRC.wiki('India Gate','India_Gate') },
    { n:2, html: SRC.wiki('National War Memorial (India)','National_War_Memorial_(India)') }
  ],
  related:['national-war-memorial','republic-day-india','why-war-poetry-matters']
});

add({
  slug:'a-soldiers-last-letter', date:'2026-03-22', category:'Tribute', eyebrow:'Tribute · Letters Home',
  readTime:'6 min read',
  title:`A Soldier's Last Letter: The Words Left Behind`,
  h1:`A Soldier's Last Letter: <em>The Words Left Behind</em>`,
  plainTitle:`A Soldier's Last Letter`,
  cardTitle:`A Soldier's Last Letter: The Words Left Behind`,
  desc:`Some of the most moving documents of any war are the letters soldiers write home before a dangerous mission. A reflection on the tradition of the last letter — and one young captain's farewell from Kargil.`,
  keywords:`soldier's last letter, Kargil letters, Vijayant Thapar letter, military letters home, farewell letter soldier, war letters, A Soldier's Farewell Letter`,
  excerpt:`The most moving documents of any war are the letters soldiers write home before a mission. A reflection on the words left behind.`,
  hero:{ src:'assets/kargil-war-memorial.jpg', alt:'The Kargil War Memorial, honouring soldiers who wrote their last letters home', credit:CC.kargil },
  imageCredit:credit('kargil'),
  intro:[
    `Among all the relics of war — the medals, the weapons, the maps — none is more piercing than a letter. Soldiers facing a dangerous mission have always written home, "just in case," and those letters, when they become the last word a family ever receives, hold a power no monument can match.`,
    `My poem <em>A Soldier's Farewell Letter</em> is written as exactly such a note: "When you read this, time may decide, I'll either return to stand by your side, or wrapped in the tricolor, I may lie still."`
  ],
  body:[
    { h2:`The bravest kind of writing` },
    { p:`To write a farewell letter is an act of almost unbearable courage. The soldier must imagine their own death clearly enough to prepare their family for it, and must do so while keeping fear from the page — offering, instead, comfort and love to the very people they are about to leave.` },
    { p:`These letters tend to share a striking calm. They speak less of glory than of small, human things: gratitude to parents, love for a spouse, hopes for a child, an apology for the grief to come. "Pray not for safety, but for resolve," my poem's soldier writes — a line I imagined precisely because real soldiers so often write something like it.` },
    { quote:`Alive or fallen, my spirit stays, in the flag I served, in the freedom that sways.` },
    { h2:`A captain's farewell from Kargil` },
    { p:`The Kargil War left behind several such letters. One of the most famous was written by <strong>Captain Vijyant Thapar</strong> of the 2 Rajputana Rifles, just twenty-two years old, who fell in the fighting of 1999. In his last letter to his parents, he wrote with extraordinary maturity about duty, sacrifice, and his wish that they be proud rather than only sad.<sup><a href="#s1">[1]</a></sup> It is now read by many as a national treasure.` },
    { p:`Letters like his turn an abstract casualty figure back into a person — a son with a sense of humour, a young man with plans, a human being who chose his duty knowing the price.` },
    { h2:`Why the words endure` },
    { p:`A farewell letter is a bridge thrown across the gap of death — "a bridge to hearts forever entwined," as the poem says. Long after the war ends, the letter remains, carrying the soldier's voice into rooms they will never enter again.` },
    { p:`That is why I wanted to write one into my book. The history of a war can be told in dates and ridgelines. But its truth lives in these private goodbyes — the words a young person leaves behind, hoping they will never have to be read, and proving, when they are, exactly what was given so that the rest of us could stay home and safe.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Vijyant Thapar','Vijyant_Thapar') },
    { n:2, html: SRC.wiki('Kargil War','Kargil_War') }
  ],
  related:['captain-vikram-batra','veer-naris-families-who-serve','kargil-war-operation-vijay']
});

add({
  slug:'the-history-of-indian-sovereignty', date:'2026-08-15', category:'History', eyebrow:'History · Freedom',
  readTime:'7 min read',
  title:`The History of Sovereignty: From 1857 to a Free India`,
  h1:`The History of Sovereignty: <em>From 1857 to Freedom</em>`,
  plainTitle:`The History of Indian Sovereignty`,
  cardTitle:`The History of Sovereignty: From 1857 to Freedom`,
  desc:`India's freedom was not given; it was won across a century of sacrifice — from the revolt of 1857 to the Salt March to the wars that followed Independence. A reflection on the long, costly road to sovereignty.`,
  keywords:`Indian freedom struggle, 1857 revolt, Salt March, independence 1947, Partition, sovereignty India, freedom fighters, The History of Sovereignty`,
  excerpt:`India's freedom was not given; it was won across a century of sacrifice — from the revolt of 1857 to the Salt March and beyond.`,
  hero:{ src:'assets/republic-day.jpg', alt:'The Indian tricolour and armed forces on Republic Day', credit:CC.republic },
  imageCredit:credit('republic'),
  intro:[
    `We inherit our freedom so completely that it is easy to forget it was ever in doubt. But India's sovereignty was not a gift handed down — it was won, inch by inch and life by life, across a century of struggle and then defended in war after war.`,
    `My poem <em>The History of Sovereignty</em> tries to trace that whole arc, "from fields of indigo to rivers of salt," and this article walks the same road.`
  ],
  body:[
    { h2:`The first spark: 1857` },
    { p:`The poem begins where the modern struggle did: "The cry of 1857 shook the crown, a rebellion born, though beaten down." The revolt of <strong>1857</strong> — often called the First War of Independence — was crushed, but it planted a seed. "The seed was sown in blood and dust, a future forged by undying trust."<sup><a href="#s1">[1]</a></sup>` },
    { quote:`No swords were drawn, yet battles were won, a land reclaimed beneath the sun.` },
    { h2:`The march to freedom` },
    { p:`Over the following decades, the freedom movement grew — through protest, sacrifice and an extraordinary experiment in non-violence. The poem marks its most iconic moment: "Salt marched to freedom, a vision anew" — the <strong>Salt March</strong> of 1930, when a simple act of making salt became a challenge to an empire.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Freedom came in 1947 — but "freedom's birth came cloaked in pain, Partition's wound, a bloody stain." The same year that brought independence brought one of history's great human tragedies, a division that scarred millions. Sovereignty's first cost was paid before the new nation had even drawn breath.` },
    { h2:`Defended in war` },
    { p:`Independence did not end the struggle; it changed its form. The poem moves on through the wars that followed: "The mountains echoed in '62's frost," then "in '71, a nation was born anew," and "valor etched on Kargil's hill." Freedom, once won, had to be defended again and again by the armed forces.` },
    { p:`This is the thread that ties my whole book to this single poem: the freedom of 1947 and the sacrifices on Kargil's peaks are not separate stories. They are one long, unbroken act of guarding the same dream.` },
    { h2:`A privilege borne from sacrifice` },
    { p:`Sovereignty, the poem concludes, "is a privilege borne from ultimate sacrifices." It is not the natural state of things; it is an achievement, perpetually maintained. Every freedom we enjoy — to speak, to vote, to walk safely home — rests on a foundation laid by people who gave everything and asked for nothing.` },
    { p:`To know that history is itself a kind of patriotism. The least we owe the freedom fighters of 1857 and the soldiers of Kargil alike is to remember that our ordinary, peaceful lives are the very thing they were fighting for — and to live them in a way worthy of the price.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Indian independence movement','Indian_independence_movement') },
    { n:2, html: SRC.wiki('Partition of India','Partition_of_India') }
  ],
  related:['republic-day-india','national-war-memorial','why-war-poetry-matters']
});

/* =================================================================
   BATCH 5 — new long-form topics (1,500+ words)
   ================================================================= */

add({
  slug:'field-marshal-cariappa', date:'2026-01-15', category:'Heroes', eyebrow:'Heroes · Leadership',
  readTime:'9 min read',
  title:`Field Marshal K. M. Cariappa: The Man Who Took Command`,
  h1:`Field Marshal K. M. Cariappa: <em>The Man Who Took Command</em>`,
  plainTitle:`Field Marshal K. M. Cariappa`,
  cardTitle:`Field Marshal Cariappa: The Man Who Took Command`,
  desc:`On 15 January 1949, K. M. Cariappa became the first Indian Commander-in-Chief of the Indian Army — the day now marked as Army Day. The life of the soldier who built the foundations of a free India's army.`,
  keywords:`Field Marshal Cariappa, K M Cariappa, first Indian Commander-in-Chief, Army Day 15 January, Kipper Cariappa, Indian Army history, second Field Marshal India, 1947 war`,
  excerpt:`On 15 January 1949 — now Army Day — K. M. Cariappa became the first Indian to command the Indian Army. The life of a foundational soldier.`,
  intro:[
    `Every institution needs a first — someone who steps into a role no one of their kind has held before, and by holding it with dignity, makes it possible for everyone who follows. For the Indian Army, that person was <strong>Field Marshal Kodandera Madappa Cariappa</strong>, the first Indian to command it.`,
    `His story is not one of a single famous battle, but of something rarer: the quiet, steady work of building an army worthy of a free nation. It is the kind of foundational service that my book tries to honour — the guardianship that earns no spotlight but makes everything else possible.`
  ],
  body:[
    { h2:`From Coorg to command` },
    { p:`Cariappa was born in 1899 in Coorg (Kodagu), in present-day Karnataka, into a land famous for sending its sons into the army. He was among the first generation of Indians commissioned as officers in the British Indian Army, at a time when the highest ranks were reserved almost entirely for the British.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Through decades of service he rose steadily, earning a reputation for professionalism, fairness, and an unshakeable belief that the army must stand above politics, religion and region — that it belonged to the nation as a whole. He was affectionately known as "Kipper," a nickname that stuck through his long career.` },
    { h2:`The day an Indian took over` },
    { p:`On <strong>15 January 1949</strong>, Cariappa took over as the first Indian <strong>Commander-in-Chief of the Indian Army</strong> from General Sir Roy Bucher, the last British officer to hold the post.<sup><a href="#s1">[1]</a></sup> It was a moment of profound symbolism: barely a year and a half after Independence, the army that had been an instrument of empire now answered to one of India's own.` },
    { p:`That date is why India observes <strong>Army Day</strong> every 15 January — not to mark a victory, but to mark the moment the nation took full command of its own defence.` },
    { quote:`Remember us not as heroes craving fame, but as sons who bore the weight of a motherland.` },
    { h2:`The war in Kashmir` },
    { p:`Cariappa's command was not ceremonial. He had already played a central role in the <a href="major-somnath-sharma.html">1947–48 war</a> over Kashmir, directing operations that pushed back the raiders and stabilised the front. As C-in-C, he inherited the enormous task of welding the post-Partition army — its regiments divided, its men scattered across a newly drawn border — into a coherent, disciplined national force.<sup><a href="#s1">[1]</a></sup>` },
    { p:`He insisted on professionalism over favouritism, on merit over connection, and on the absolute principle that the soldier serves the Constitution and the country, never a party or a person. Much of the apolitical, professional character that the Indian Army is admired for today traces back to the standards Cariappa set in those formative years.` },
    { h2:`The honour of a Field Marshal` },
    { p:`In 1986, in recognition of his towering contribution, Cariappa was conferred the rank of <strong>Field Marshal</strong> — only the second Indian, after <a href="field-marshal-sam-manekshaw.html">Sam Manekshaw</a>, to be so honoured.<sup><a href="#s1">[1]</a></sup> A Field Marshal never retires; he holds the rank for life. It was a fitting tribute to a man who had given his whole life to the service.` },
    { p:`There is a famous story from the 1965 war, when Cariappa's own son, an air force pilot, was shot down and captured by Pakistan. Pakistan's leader, who had once served under Cariappa, reportedly offered to release the young man as a special gesture. Cariappa refused, saying that his son was no different from any other prisoner, and that all of them should be treated alike. He would accept no special treatment. It is hard to imagine a clearer statement of what he believed an officer should be.` },
    { h2:`The foundation beneath the flag` },
    { p:`It is easy to celebrate the soldier who storms a hill or flies a daring sortie. It is harder, but just as important, to honour the builder — the leader who lays the foundations on which all that later courage stands. Cariappa was that builder.` },
    { p:`Every disciplined parade, every apolitical posting, every soldier who salutes the flag rather than a faction, owes something to the standards he established at the very beginning. He took command of an army in its infancy and handed on something solid, professional and proud.` },
    { p:`When we speak of "the unsung breath of heroes," we usually mean the soldier in the trench. But there is an unsung heroism in institution-building too — in the patient, unglamorous work of making something that will outlast you. On Army Day each 15 January, when the nation honours its soldiers, it is also honouring the quiet first step taken by Kipper Cariappa, the man who took command.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('K. M. Cariappa','K._M._Cariappa') },
    { n:2, html: SRC.army }
  ],
  related:['field-marshal-sam-manekshaw','general-bipin-rawat-cds','republic-day-india']
});

add({
  slug:'general-bipin-rawat-cds', date:'2026-01-01', category:'Current', eyebrow:'Current Affairs · Leadership',
  readTime:'9 min read',
  title:`General Bipin Rawat and the Birth of the CDS`,
  h1:`General Bipin Rawat and the <em>Birth of the CDS</em>`,
  plainTitle:`General Bipin Rawat and the CDS`,
  cardTitle:`General Bipin Rawat and the Birth of the CDS`,
  desc:`In 2020, General Bipin Rawat became India's first Chief of Defence Staff, charged with uniting the Army, Navy and Air Force into integrated theatre commands. His vision, his tragic loss, and the future of India's military.`,
  keywords:`General Bipin Rawat, Chief of Defence Staff, CDS India, theatre commands, jointness, integrated commands, Coonoor crash, military reform India`,
  excerpt:`In 2020, General Bipin Rawat became India's first Chief of Defence Staff — tasked with uniting three services into one fighting machine. His vision and legacy.`,
  intro:[
    `For more than seventy years, India's three armed forces — the Army, the Navy and the Air Force — fought, trained and planned largely as three separate worlds. Bringing them together under a single strategic head had been recommended for decades. In 2020, it finally happened, and the man chosen to lead the change was <strong>General Bipin Rawat</strong>, India's first <strong>Chief of Defence Staff</strong>.`
  ],
  body:[
    { h2:`Why the CDS was created` },
    { p:`Modern war is not fought by one service alone. Air power supports the soldier on the ground; the navy secures the seas that supply both; intelligence, space and cyber capabilities tie everything together. Yet for decades, India's services planned their budgets, procurement and operations in separate silos, coordinating only at the top.<sup><a href="#s1">[1]</a></sup>` },
    { p:`The need for a single point of military advice to the government, and for genuine "jointness" between the services, had been urged after every major conflict — including the Kargil War, whose review committee strongly recommended it. On <strong>1 January 2020</strong>, the post of Chief of Defence Staff was created, and General Bipin Rawat, then the Army Chief, became the first to hold it.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`Not to conquer, but to defend, the line we hold has no end.` },
    { h2:`The vision: theatre commands` },
    { p:`Rawat's central mission was to push India toward <strong>integrated theatre commands</strong> — the idea that, instead of the Army, Navy and Air Force each running their own commands, India would create unified commands organised by geography or function, in which all three services fight together under one commander.<sup><a href="#s1">[1]</a></sup>` },
    { p:`It is one of the most significant military reforms in India's history, and also one of the hardest — requiring three proud, century-old services to surrender some independence for the sake of combined strength. Rawat brought to it his characteristic bluntness and drive, determined to make jointness a reality rather than a slogan.` },
    { h2:`A soldier's soldier` },
    { p:`Rawat had spent his career in tough postings — high-altitude warfare, counter-insurgency, and command along India's most sensitive frontiers. He was known for plain speaking and a hands-on, front-line style. To the troops, he was a soldier who understood the soldier's world from the inside.<sup><a href="#s1">[1]</a></sup>` },
    { h2:`A tragic loss` },
    { p:`On <strong>8 December 2021</strong>, General Rawat, his wife Madhulika Rawat, and several armed forces personnel were killed when their helicopter crashed near Coonoor in the Nilgiri hills of Tamil Nadu.<sup><a href="#s1">[1]</a></sup> The nation was stunned. India had lost its first CDS in the middle of the very reforms he had been brought in to drive.` },
    { p:`The grief was immense and genuine — a reminder that those at the very top of the military are, in the end, soldiers too, and that service carries risk at every rank.` },
    { h2:`The work continues` },
    { p:`The institution Rawat helped create did not die with him. The post of Chief of Defence Staff continues, and the long, difficult march toward integrated theatre commands and true jointness goes on — part of a broader modernisation that includes <a href="atmanirbhar-bharat-defence.html">self-reliant defence</a>, new technology, and a leaner, more lethal force.` },
    { p:`In a sense, Rawat's legacy is the most demanding kind: not a monument, but a reform still being built. The Indian military of the coming decades — more integrated, more modern, more self-reliant — will carry his fingerprints.` },
    { p:`My poems are usually about the soldier at the edge of the map. But the soldier at the edge can only succeed if those at the centre have built the right structures behind him. General Bipin Rawat spent his final years trying to build exactly that, and gave his life still in harness. That, too, is a form of the quiet, total service this book was written to remember.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Bipin Rawat','Bipin_Rawat') },
    { n:2, html: SRC.pib }
  ],
  related:['field-marshal-cariappa','modern-indian-military-2026','atmanirbhar-bharat-defence']
});

add({
  slug:'indian-coast-guard', date:'2026-02-01', category:'History', eyebrow:'The Fourth Service',
  readTime:'8 min read',
  title:`The Indian Coast Guard: Sentinels of the Shore`,
  h1:`The Indian Coast Guard: <em>Sentinels of the Shore</em>`,
  plainTitle:`The Indian Coast Guard`,
  cardTitle:`The Indian Coast Guard: Sentinels of the Shore`,
  desc:`Born in 1978, the Indian Coast Guard guards a 7,500-kilometre coastline — saving lives at sea, fighting smugglers, and standing as the nation's first line of maritime defence. Meet the fourth armed force.`,
  keywords:`Indian Coast Guard, maritime security, search and rescue, coastal security, Vayam Rakshamah, fourth armed force, blue economy, sea guardians`,
  excerpt:`Guarding 7,500 km of coastline — saving lives, fighting smugglers, and standing as the nation's first line at sea. Meet India's fourth armed force.`,
  intro:[
    `India is not only a land of mountains and plains; it is a maritime nation, with a coastline stretching some seven and a half thousand kilometres and a vast ocean of interests beyond it. Guarding that watery frontier — quietly, constantly, and often heroically — is the <strong>Indian Coast Guard</strong>, the nation's fourth armed force.`,
    `My poem <em>The Silent Depths</em> honours those who serve at sea. The Coast Guard is part of that same brotherhood of the waters.`
  ],
  body:[
    { h2:`A force born of need` },
    { p:`The Indian Coast Guard was formally established in <strong>1978</strong>, after it became clear that the navy could not, on its own, police the enormous and growing demands of India's maritime zone — smuggling, illegal fishing, search and rescue, and the protection of offshore assets.<sup><a href="#s1">[1]</a></sup> A dedicated force was needed for the everyday guardianship of the seas, leaving the navy free for war-fighting.` },
    { p:`Its motto, <em>"Vayam Rakshamah"</em> — "We Protect" — captures its character. The Coast Guard is, above all, a protective force: of lives, of laws, and of the coastline itself.` },
    { quote:`Their resolve flows as the tides endure, bound to a nation, steadfast and pure.` },
    { h2:`Guardians of life at sea` },
    { p:`Much of the Coast Guard's work is invisible to the public until disaster strikes. Its ships and aircraft conduct <strong>search and rescue</strong> across millions of square kilometres of ocean — pulling fishermen from sinking boats, evacuating the injured, and racing into cyclones when others are racing out.<sup><a href="#s1">[1]</a></sup> Every year, the force saves hundreds of lives at sea.` },
    { p:`It also fights the unglamorous but vital battles of maritime law enforcement: intercepting smugglers and traffickers, curbing illegal fishing, responding to oil spills, and protecting the marine environment. This is the daily, grinding guardianship on which a coastal nation depends.` },
    { h2:`The first line of coastal defence` },
    { p:`The terrible lessons of the <a href="mumbai-26-11-nsg.html">26/11 Mumbai attacks</a> — when terrorists came to the city by sea — transformed India's approach to coastal security. The Coast Guard's role expanded sharply, with new vessels, aircraft, coastal radar networks and a far tighter coordination with the navy, marine police and intelligence agencies.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Today the Coast Guard is the crucial middle layer of India's maritime shield: between the marine police close to shore and the navy far out at sea, it watches the approaches, checks suspicious vessels, and stands as an early warning against threats from the water.` },
    { h2:`A growing fleet for a growing nation` },
    { p:`As India's economy and maritime interests grow — its ports, its offshore energy, its "blue economy" — so does the Coast Guard. Its fleet of patrol vessels, interceptor boats and aircraft has expanded steadily, much of it built in Indian shipyards as part of the drive for <a href="atmanirbhar-bharat-defence.html">self-reliant defence</a>.<sup><a href="#s2">[2]</a></sup>` },
    { h2:`From a handful of ships to a major force` },
    { p:`The Coast Guard began modestly, with a small fleet and a big mandate. Over the decades it has grown into one of the largest coast guards in the world, operating a fleet of offshore and inshore patrol vessels, fast interceptor boats, hovercraft, and a dedicated air wing of fixed-wing aircraft and helicopters.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Much of this fleet is now built in Indian shipyards, tying the Coast Guard's expansion to the wider push for <a href="atmanirbhar-bharat-defence.html">self-reliant defence</a>. Its reach extends across the country's vast Exclusive Economic Zone — millions of square kilometres of ocean in which India holds rights to the resources of the sea and the seabed, and which someone must actually patrol for those rights to mean anything.` },
    { h2:`The wall at sea after 26/11` },
    { p:`The most profound change in the Coast Guard's role came after the <a href="mumbai-26-11-nsg.html">26/11 Mumbai attacks</a> of 2008, when ten terrorists reached the heart of the city by sea, exposing a gaping hole in India's coastal security.<sup><a href="#s1">[1]</a></sup> The response was a complete overhaul of how the coast is watched.` },
    { p:`The Coast Guard was designated the agency responsible for coastal security in territorial waters, and a layered system was built: a chain of coastal surveillance radars dotting the shoreline, joint operations centres linking the navy, Coast Guard and marine police, and tighter registration and tracking of the countless fishing boats that crowd Indian waters. The aim is simple and vital — that no hostile vessel should ever again slip unnoticed toward an Indian city.` },
    { h2:`Humanitarian first responders` },
    { p:`For all its security duties, the Coast Guard is, to most Indians who have encountered it, a rescuer first. When cyclones tear up the Bay of Bengal and the Arabian Sea, its ships and aircraft are among the first to move — evacuating oil rigs, plucking stranded sailors from the water, and ferrying relief to cut-off coastal communities.<sup><a href="#s2">[2]</a></sup>` },
    { p:`It is also the nation's principal shield against pollution at sea, leading the response to oil spills that threaten India's beaches and fisheries. In this role the Coast Guard protects not just lives but livelihoods — the coastal economy on which millions of fishing families depend.` },
    { h2:`The charter: where its authority comes from` },
    { p:`The Coast Guard is not simply a smaller navy; it is a distinct service with its own legal charter. Raised under an Act of Parliament, it was given clear statutory duties — the protection of India's maritime zones and offshore installations, the safety of life and property at sea, the preservation of the marine environment, and the enforcement of the nation's maritime laws.<sup><a href="#s1">[1]</a></sup> It operates in the band of ocean between the marine police, who patrol close to shore, and the navy, which prepares for war on the high seas.` },
    { p:`That charter matters because India's stake in the sea is vast. The country's Exclusive Economic Zone — the waters in which it holds sovereign rights over fish, oil, gas and minerals — covers more than two million square kilometres. Rights on paper mean nothing without the ships and aircraft to assert them, and it is the Coast Guard that turns the map's blue boundaries into a living, patrolled frontier.` },
    { h2:`Guarding the Indian Ocean's lifelines` },
    { p:`India sits astride some of the busiest and most strategically vital sea lanes on earth. A huge share of the world's trade and energy passes through the Indian Ocean, and the bulk of India's own commerce — and almost all of its oil imports — travels by sea.<sup><a href="#s2">[2]</a></sup> Keeping these arteries safe is a national-security task in its own right.` },
    { p:`Here the Coast Guard's work shades into the wider contest for a secure Indian Ocean: deterring piracy, intercepting the drug shipments that increasingly move by sea, checking illegal and unregulated fishing by foreign vessels, and cooperating with the navies and coast guards of friendly nations. In an age when much of the competition between powers plays out on the water, the everyday vigilance of the Coast Guard is part of how India keeps its maritime neighbourhood stable.` },
    { h2:`The people behind the ensign` },
    { p:`Behind every vessel and aircraft are the men and women who crew them. The Coast Guard draws and trains its own officers and personnel, increasingly including women in operational roles, instilling a culture that blends naval discipline with the improvisational grit of a rescue service.<sup><a href="#s1">[1]</a></sup> A Coast Guard sailor may spend one week boarding a suspect vessel in heavy seas and the next plucking shipwrecked fishermen from the water in a cyclone.` },
    { p:`It is a demanding ethos, and a quietly heroic one. There are no grand parades for the crew that spends a freezing night searching a black ocean for a capsized boat. Their reward is measured in the people who make it home because of them — a kind of service that asks for everything and advertises nothing, which is exactly the kind my book was written to honour.` },
    { h2:`The diplomat in white` },
    { p:`A coast guard is also, quietly, an instrument of friendship. Indian Coast Guard ships make goodwill visits to neighbouring countries, train with partner coast guards, and lead the regional response when disaster strikes the wider Indian Ocean — from search-and-rescue coordination to relief after tsunamis and cyclones.<sup><a href="#s2">[2]</a></sup> In a part of the world where many nations share the same vulnerable coastlines and the same threats of piracy, trafficking and natural disaster, this everyday cooperation builds trust that no treaty alone can.` },
    { p:`This makes the service something more than a policeman of the seas. It is one of the friendlier faces India turns toward its maritime neighbours — a reminder that security and solidarity, at sea, are often the same thing.` },
    { h2:`Technology and the future fleet` },
    { p:`The ocean is too vast to watch with ships alone, so the modern Coast Guard increasingly fights with information. Coastal surveillance radar chains, satellite-based vessel tracking, long-range maritime patrol aircraft and remotely piloted aircraft are weaving a picture of who is moving where across India's waters.<sup><a href="#s1">[1]</a></sup> The aim is "maritime domain awareness" — to know, at any moment, what is on and under the sea near India's coast, so that the genuinely suspicious can be picked out from the thousands of honest fishing boats.` },
    { p:`As the fleet grows — much of it now built in Indian yards — the Coast Guard is becoming a more technological force without losing its essential character: that of a service whose first instinct, when an alarm sounds at sea, is to head toward the danger.` },
    { h2:`The unseen watch on the water` },
    { p:`We tend to picture the nation's defenders on snowy ridges or in fighter cockpits. But there is a whole service that keeps its watch on the heaving, indifferent sea — in storms and darkness, far from any cheering crowd, so that a fisherman comes home, a smuggler is stopped, or a threat is turned back before it reaches our shores.` },
    { p:`The Coast Guard rarely makes headlines, and that is precisely the point: its success is measured in disasters averted and lives quietly saved. It is, in the truest sense, one of the unsung breaths of the nation's heroes — sentinels of the shore, keeping their endless, vigilant watch over the waters that surround us all.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Indian Coast Guard','Indian_Coast_Guard') },
    { n:2, html: SRC.pib }
  ],
  related:['indian-navy-ins-vikrant','marcos-marine-commandos','atmanirbhar-bharat-defence']
});

add({
  slug:'agni-missiles-india', date:'2026-02-20', category:'History', eyebrow:'Defence · Deterrence',
  readTime:'9 min read',
  title:`Agni: The Missiles That Guard India's Peace`,
  h1:`Agni: <em>The Missiles That Guard India's Peace</em>`,
  plainTitle:`India's Agni Missiles`,
  cardTitle:`Agni: The Missiles That Guard India's Peace`,
  desc:`From Agni-I to the long-range Agni-V, India's home-built ballistic missiles form the backbone of its nuclear deterrent. The story of the Agni programme, the "Missile Man" Abdul Kalam, and deterrence as a kind of peace.`,
  keywords:`Agni missile, Agni-V, ballistic missile India, DRDO, Abdul Kalam missile man, nuclear deterrence India, no first use, IGMDP, credible minimum deterrence`,
  excerpt:`From Agni-I to the long-range Agni-V, India's home-built missiles anchor its nuclear deterrent. The story of the programme — and deterrence as peace.`,
  intro:[
    `There is a strange paradox at the heart of national defence: that some of the most powerful weapons a nation builds exist precisely so that they will never be used. India's <strong>Agni</strong> missiles — named for the Vedic god of fire — are exactly such weapons. They are the silent guarantors of a peace held in place by deterrence.`,
    `My poetry dwells on the human cost of war. This article looks at the machinery built to prevent the worst war of all.`
  ],
  body:[
    { h2:`The Missile Man's dream` },
    { p:`India's missile capability grew out of the <strong>Integrated Guided Missile Development Programme (IGMDP)</strong>, launched in the 1980s and led by the scientist <strong>A. P. J. Abdul Kalam</strong> — later the President of India, and forever remembered as the "Missile Man."<sup><a href="#s1">[1]</a></sup> The programme aimed to give India the ability to design and build its own missiles, rather than depend on foreign suppliers who could cut off access at any moment.` },
    { p:`The Agni series was its most strategically important product: a family of land-based <strong>ballistic missiles</strong> capable of carrying India's nuclear deterrent over long distances.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`The roots of freedom lie buried in loss, every victory forged from what it costs.` },
    { h2:`A family that grew with the nation` },
    { p:`The Agni programme advanced step by step, each version reaching further than the last. From the early <strong>Agni-I</strong> and <strong>Agni-II</strong>, through the intermediate ranges, to the long-range <strong>Agni-V</strong> — capable of striking targets thousands of kilometres away — the series steadily extended the reach of India's deterrent.<sup><a href="#s1">[1]</a></sup> Newer variants such as Agni-P bring greater accuracy, mobility and survivability.` },
    { p:`Crucially, these are <em>Indian</em> missiles — designed, built and tested at home, by the DRDO and Indian industry. Each successful test is not only a military milestone but a statement of technological independence.` },
    { h2:`The doctrine behind the fire` },
    { p:`India's nuclear posture is built on two principles that shape how the Agni missiles are meant to be used — which is to say, not used at all if it can possibly be avoided. The first is <strong>"credible minimum deterrence"</strong>: maintaining just enough capability to make any nuclear attack on India unthinkably costly for the attacker.<sup><a href="#s2">[2]</a></sup>` },
    { p:`The second is the policy of <strong>"no first use"</strong> — a commitment that India will not be the first to launch nuclear weapons, but will retain the assured ability to retaliate devastatingly if attacked.<sup><a href="#s2">[2]</a></sup> Together, these turn the Agni missiles into instruments of restraint: weapons whose entire purpose is to ensure that no one ever dares to start the war they are built to answer.` },
    { h2:`Deterrence as a kind of peace` },
    { p:`It is uncomfortable to think of peace resting on the threat of terrible force. And yet, for the nuclear age, deterrence has been one of the things that has kept the gravest wars from happening. The Agni missiles sit in their silos and on their launchers not to be fired, but to make firing pointless — to hold the balance so steady that the peace endures.` },
    { p:`This is a colder, more abstract kind of guardianship than the soldier on the ridge. There is no folded flag, no last letter home. But the scientists, engineers and strategic forces personnel who build and keep these weapons are guardians too, in their way — custodians of a deterrent that, by existing, helps ensure the nation is never tested at its most catastrophic level.` },
    { p:`My book is full of the human cost of the wars that <em>do</em> happen. The Agni programme is part of the machinery meant to prevent the one war from which there would be no poems left to write. Its fire is named for a god — and its deepest purpose is to make sure that fire is never lit.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Agni (missile)','Agni_(missile)') },
    { n:2, html: SRC.wiki('Nuclear doctrine of India','Nuclear_doctrine_of_India') }
  ],
  related:['atmanirbhar-bharat-defence','operation-sindoor-2025','modern-indian-military-2026']
});

add({
  slug:'modern-indian-military-2026', date:'2026-01-26', category:'Current', eyebrow:'Current Affairs · Modernisation',
  readTime:'9 min read',
  title:`The Indian Military in 2026: A Force Transformed`,
  h1:`The Indian Military in 2026: <em>A Force Transformed</em>`,
  plainTitle:`The Indian Military in 2026`,
  cardTitle:`The Indian Military in 2026: A Force Transformed`,
  desc:`Theatre commands, indigenous weapons, drones, space and cyber capability — India's armed forces are in the middle of their biggest transformation in decades. A clear look at where the military stands in 2026.`,
  keywords:`Indian military modernisation, theatre commands, Atmanirbhar Bharat defence, drones warfare India, AMCA, Project Zorawar, S-400, defence reforms 2026, future warfare`,
  excerpt:`Theatre commands, indigenous weapons, drones, space and cyber — India's forces are in their biggest transformation in decades. Where things stand in 2026.`,
  intro:[
    `The Indian armed forces of today would be barely recognisable to a soldier of even a generation ago. Behind the timeless image of the jawan on the ridge, a vast modernisation is under way — in how the forces are organised, what they fight with, and how they imagine the wars of the future.`,
    `This is the living, evolving body that the courage in my poems serves. It is worth understanding where it stands.`
  ],
  body:[
    { h2:`Fighting as one: theatre commands` },
    { p:`The single biggest structural reform is the long, difficult move toward <strong>integrated theatre commands</strong> — combining the Army, Navy and Air Force under unified commanders rather than running three separate command structures.<sup><a href="#s1">[1]</a></sup> Driven by the office of the <a href="general-bipin-rawat-cds.html">Chief of Defence Staff</a>, this push for "jointness" aims to make the three services fight as a single, coordinated machine.` },
    { p:`It is a profound cultural shift as much as an organisational one, asking proud and independent services to combine their strengths — and it is reshaping how India plans to defend itself across land, sea, air, space and cyberspace.` },
    { quote:`Each step we take, a vow renewed, to shield the land where dreams are pursued.` },
    { h2:`Made in India` },
    { p:`The second great theme is <strong>self-reliance</strong>. Under the banner of <a href="atmanirbhar-bharat-defence.html">Atmanirbhar Bharat</a>, India is steadily replacing imported weapons with home-built ones — the <a href="indian-air-force-modern-power.html">Tejas</a> fighter, the carrier <a href="indian-navy-ins-vikrant.html">INS Vikrant</a>, the <a href="agni-missiles-india.html">Agni</a> and BrahMos missiles, artillery, drones and more.<sup><a href="#s2">[2]</a></sup>` },
    { p:`"Positive indigenisation lists" progressively bar the import of items India can make itself, and defence exports — once almost non-existent — are rising. The goal is strategic autonomy: the ability to defend the nation without being held hostage by a foreign supplier.` },
    { h2:`The new face of war` },
    { p:`The character of warfare itself is changing, and India is adapting. Recent conflicts around the world — and India's own experience in operations like <a href="operation-sindoor-2025.html">2025</a> — have shown the growing importance of <strong>drones and counter-drone systems</strong>, precision stand-off weapons, electronic warfare, and the contest in the unseen domains of <strong>space and cyberspace</strong>.<sup><a href="#s1">[1]</a></sup>` },
    { p:`India has stood up dedicated agencies for space, cyber and special operations, demonstrated anti-satellite capability, and is investing in next-generation platforms — from the planned fifth-generation AMCA fighter to indigenous light tanks designed for high-altitude frontiers like Ladakh.` },
    { h2:`The frontier that never sleeps` },
    { p:`All this modernisation is sharpened by hard strategic reality: two contested land borders, a vast maritime domain, and the lessons of recent flare-ups from <a href="galwan-valley-2020.html">Galwan</a> to the operations of 2025. India's modernisation is not abstract; it is a direct response to threats that are very much alive.` },
    { p:`Yet for all the new technology, the forces remain deeply rooted in their human core — the regimental traditions, the gallantry, the families who serve alongside. Modernisation changes the tools, not the soul.` },
    { h2:`The technology race` },
    { p:`Perhaps the fastest-moving front of all is technological. The wars of the present have shown how cheap drones and loitering munitions can threaten even expensive tanks and ships, how electronic warfare can blind an enemy, and how data and artificial intelligence increasingly decide who sees and strikes first.<sup><a href="#s1">[1]</a></sup>` },
    { p:`India is investing heavily across this spectrum — indigenous drones and counter-drone systems, precision munitions, network-centric warfare, and the steady digitisation of the battlefield. The goal is a force that is not just bigger or better-armed, but <em>faster</em> at sensing, deciding and acting than any adversary it might face.` },
    { h2:`Eyes in space, shields in cyber` },
    { p:`Modern conflict is also fought in domains with no physical territory at all. Recognising this, India has stood up dedicated tri-service agencies for <strong>space</strong>, <strong>cyber</strong> and <strong>special operations</strong>, and has demonstrated anti-satellite capability — proof that it can defend its assets in orbit, on which navigation, communications and surveillance increasingly depend.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Securing the nation's satellites, networks and critical digital infrastructure is now as much a part of defence as guarding a mountain pass. The frontier has expanded upward into space and inward into the wires — and the armed forces are reorganising to hold those new frontiers too.` },
    { h2:`The human challenge` },
    { p:`No transformation is without friction. Building integrated theatre commands means overcoming decades of single-service culture. The <a href="agnipath-agniveer-scheme.html">Agnipath scheme</a> has reshaped recruitment and sparked real debate about retention, experience and morale. Modern equipment demands new skills, longer training, and careful balancing of imported and indigenous systems.<sup><a href="#s2">[2]</a></sup>` },
    { p:`These are not signs of failure but of a force genuinely in motion — wrestling, in public and in real time, with how to remain both rooted in its proud traditions and ready for a kind of war its founders never imagined.` },
    { h2:`The soldier of the future` },
    { p:`Modernisation is not only about big platforms; it reaches all the way down to the individual infantryman. Under long-running efforts to create a "future soldier," the army is fielding new assault rifles — including modern imported designs and the Indo-Russian rifles now being manufactured on Indian soil — alongside better body armour, helmets, night-vision devices, and communications that link the foot soldier into the wider digital battlefield.<sup><a href="#s1">[1]</a></sup>` },
    { p:`The hard frontiers shape this too. The standoff in eastern Ladakh accelerated work on equipment built for extreme altitude, including a programme to develop an indigenous light tank agile enough for the thin air and narrow tracks of the high Himalaya. The lesson of <a href="galwan-valley-2020.html">Galwan</a> and the long deployment that followed was blunt: the soldier on the roof of the world needs tools designed for that world, not hand-me-downs from the plains.` },
    { h2:`Two fronts, one demanding reality` },
    { p:`India's modernisation is driven by an unforgiving strategic geography. To the north and east lies a long, contested and increasingly tense frontier with China; to the west, a hostile border with Pakistan that has flared repeatedly from Kargil to the operations of 2025. Planning for the possibility of pressure on two fronts at once is one of the central problems Indian defence planners must solve.<sup><a href="#s1">[1]</a></sup>` },
    { p:`This two-front reality is exactly why reforms like integrated theatre commands matter so much. A nation that may have to defend widely separated frontiers cannot afford three services planning in isolation; it needs to concentrate combat power quickly wherever the threat appears. The urgency of India's transformation is, in the end, a direct response to the company it keeps on the map.` },
    { h2:`The long road of money and procurement` },
    { p:`None of this is cheap, and here lies one of modernisation's hardest knots. A large standing force carries enormous running costs — salaries and pensions for serving and retired personnel — which compete every year with the capital budget needed to actually buy new equipment.<sup><a href="#s2">[2]</a></sup> Reforms such as the Agnipath recruitment model are, in part, attempts to manage this balance over the long term.` },
    { p:`Procurement itself is a famously slow and complex process, and the drive for self-reliance adds another layer: the choice, again and again, between buying a proven foreign system now and investing in an indigenous one that builds capability for the future. Getting this balance right — fielding enough capability today without mortgaging tomorrow's industrial independence — is among the quiet, unglamorous battles that will decide how strong India's military really is in the decades ahead.` },
    { h2:`The nuclear backdrop` },
    { p:`All of India's conventional modernisation takes place beneath a nuclear ceiling. As a declared nuclear-weapon state with a stated policy of "no first use" and "credible minimum deterrence," India maintains a triad of delivery systems — land-based <a href="agni-missiles-india.html">Agni missiles</a>, aircraft, and increasingly submarine-launched weapons — designed to ensure that no adversary could ever profit from a nuclear strike.<sup><a href="#s1">[1]</a></sup> The point of this arsenal is to never be used: it exists to take the most catastrophic options off the table entirely.` },
    { p:`This nuclear stability is precisely what makes conventional readiness matter so much. Because all-out war between nuclear neighbours is unthinkable, conflict tends to live in the grey zone — limited strikes, standoffs, terrorism, and skirmishes like Galwan. A modern, flexible, conventional force gives India the ability to respond proportionately in that grey zone without ever approaching the nuclear threshold.` },
    { h2:`Modernisation is for people, not machines` },
    { p:`It is worth ending where modernisation should always begin: with the soldier. Every new system is ultimately meant to do one of two things — let the soldier win, or let the soldier come home. Better armour, better medical evacuation, better intelligence and precision all exist so that fewer young men and women end up as names on a memorial wall.` },
    { p:`That is the human measure against which all the hardware should be judged. A transformed military is not an end in itself; it is a promise to the people who serve — and to the families who wait — that the nation will give them every possible advantage, and ask of them no more sacrifice than absolutely necessary. The machines change to keep that promise. The promise does not change.` },
    { h2:`The same oath, sharper than ever` },
    { p:`It would be easy to be dazzled by the hardware — the jets, the missiles, the satellites. But the deepest truth of the 2026 military is the same as it has always been: that all of it exists to be wielded by people who have sworn to defend the nation, and who will, if called upon, pay any price to do so.` },
    { p:`A drone is only as good as the values of the force that flies it. India's transformation is impressive precisely because it is married to an old and unbroken ethos of service — the same ethos that runs from <a href="field-marshal-cariappa.html">Cariappa's</a> founding standards to the Agniveer of today. The tools grow sharper every year. The oath behind them does not change.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Indian Armed Forces','Indian_Armed_Forces') },
    { n:2, html: SRC.pib }
  ],
  related:['atmanirbhar-bharat-defence','general-bipin-rawat-cds','agni-missiles-india']
});

add({
  slug:'battle-of-longewala-1971', date:'2025-12-05', category:'History', eyebrow:'History · 1971',
  readTime:'8 min read',
  title:`The Battle of Longewala: 120 Men Against an Armoured Brigade`,
  h1:`The Battle of Longewala: <em>120 Against a Brigade</em>`,
  plainTitle:`The Battle of Longewala`,
  cardTitle:`Longewala: 120 Men Against an Armoured Brigade`,
  desc:`On the night of 4–5 December 1971, a company of around 120 Indian soldiers under Major Kuldip Singh Chandpuri held off a Pakistani armoured brigade at Longewala in the Thar desert until dawn — when the Air Force finished the job. The story behind the legend.`,
  keywords:`Battle of Longewala, 1971 war, Kuldip Singh Chandpuri, 23 Punjab, Thar desert, Maha Vir Chakra, Border movie, last stand, IAF Hunters`,
  excerpt:`On the night of 4–5 December 1971, ~120 Indian soldiers held off a Pakistani armoured brigade in the Thar desert until dawn. The story behind the legend.`,
  intro:[
    `Some battles are won by numbers, and some by sheer, stubborn refusal to break. The <strong>Battle of Longewala</strong>, fought on the night of 4–5 December 1971, belongs firmly to the second kind — a handful of men in the desert holding a line that, by every rational calculation, should have been overrun.`,
    `It is the very embodiment of the spirit my book keeps returning to: the choice to stand, against the odds, for the soil behind you.`
  ],
  body:[
    { h2:`A post in the desert` },
    { p:`As the <a href="1971-war-birth-of-bangladesh.html">1971 war</a> opened, Pakistan launched a major thrust into Indian territory in the Thar desert of Rajasthan, aiming to capture the town of Jaisalmer. In its path lay a small, isolated border post at <strong>Longewala</strong>, held by 'A' Company of the <strong>23 Punjab</strong> — around 120 men under <strong>Major Kuldip Singh Chandpuri</strong>.<sup><a href="#s1">[1]</a></sup>` },
    { p:`On the night of 4 December, Chandpuri's tiny garrison detected an enormous enemy force advancing on them: an infantry brigade backed by a regiment of tanks — many dozens of armoured vehicles against a single company with no tanks of their own.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`"Let them come," we say, "we shall not fall, for the land we guard is worth it all."` },
    { h2:`The decision to hold` },
    { p:`Chandpuri faced a brutal choice: withdraw and surrender the post, or hold and almost certainly be wiped out. He chose to hold, and asked his men to fight through the night, buying time until air support could arrive at first light.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Through the dark hours, the company fought a desperate defensive battle. They used the terrain cleverly, channelled the enemy armour, and made every weapon count — anti-tank guns, medium machine guns, and sheer nerve. A minefield and soft sand slowed the tanks; the defenders' discipline did the rest. Against overwhelming odds, the thin line at Longewala did not break.` },
    { h2:`Dawn, and the Hunters` },
    { p:`When morning came, the Indian Air Force arrived. Hunter fighter-bombers swept over the desert and fell upon the exposed Pakistani armour, which had no air cover of its own. In the open desert, the tanks were terribly vulnerable. Through the day, the air strikes turned the stalled offensive into a rout, destroying a large number of vehicles.<sup><a href="#s1">[1]</a></sup>` },
    { p:`What had begun as a hopeless last stand by 120 men ended as one of the most lopsided defensive victories of the war. Major Chandpuri was awarded the <strong>Maha Vir Chakra</strong>, India's second-highest wartime gallantry award, for his leadership.<sup><a href="#s1">[1]</a></sup>` },
    { h2:`The legend, and the truth` },
    { p:`Longewala became famous far beyond military circles, immortalised in the Hindi film <em>Border</em>. As with any legend, the cinematic version simplifies and dramatises. But the core of the story is true and remarkable: a small, outnumbered force chose to hold a desert post against an armoured brigade, fought through the night, and survived to see the enemy broken by dawn.` },
    { p:`What makes Longewala endure is not just the spectacular outcome but the decision at its heart — Chandpuri's choice to hold when retreat would have been entirely reasonable. The victory was sealed by air power, but it was made possible by the men on the ground who refused to leave.` },
    { h2:`The arithmetic of courage` },
    { p:`Longewala is often told as a tale of clever tactics and timely air support, and it is both. But underneath, it is a story about a kind of arithmetic that has nothing to do with numbers: the willingness of a few to stand firm so that the many behind them stay safe.` },
    { p:`120 men against a brigade is not a fair fight. The defenders of Longewala fought it anyway, and held, because the alternative — opening the road to Jaisalmer — was unthinkable to them. "The land we guard is worth it all," says the soldier in my poem. At Longewala, a company of ordinary men proved exactly how much they meant it.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Battle of Longewala','Battle_of_Longewala') },
    { n:2, html: SRC.wiki('Kuldip Singh Chandpuri','Kuldip_Singh_Chandpuri') }
  ],
  related:['1971-war-birth-of-bangladesh','arun-khetarpal-basantar','indian-air-force-modern-power']
});

add({
  slug:'arun-khetarpal-basantar', date:'2025-12-16', category:'Heroes', eyebrow:'Heroes · 1971',
  readTime:'8 min read',
  title:`Second Lieutenant Arun Khetarpal: "I Will Not Abandon My Tank"`,
  h1:`Arun Khetarpal: <em>"I Will Not Abandon My Tank"</em>`,
  plainTitle:`Second Lieutenant Arun Khetarpal`,
  cardTitle:`Arun Khetarpal: "I Will Not Abandon My Tank"`,
  desc:`At 21, Second Lieutenant Arun Khetarpal of the Poona Horse fought one of the great tank actions of the 1971 war at Basantar — and refused to leave his burning tank. The story of a Param Vir Chakra earned with a final, immortal radio message.`,
  keywords:`Arun Khetarpal, Param Vir Chakra, Battle of Basantar, Poona Horse, 1971 war, tank battle, Shakargarh, youngest PVC, armoured corps`,
  excerpt:`At 21, Arun Khetarpal of the Poona Horse fought a great tank action at Basantar in 1971 — and refused to leave his burning tank. A Param Vir Chakra story.`,
  intro:[
    `Some final words outlive the men who speak them. For <strong>Second Lieutenant Arun Khetarpal</strong>, just twenty-one years old, those words were a refusal — a young tank officer's flat insistence, over the radio, that he would not abandon his post even as his tank burned around him.`,
    `His story belongs beside the others in my book: the very young, asked to give everything, who give it without flinching.`
  ],
  body:[
    { h2:`A soldier by inheritance` },
    { p:`Arun Khetarpal came from a family with a long tradition of military service and was commissioned into the <strong>17 Poona Horse</strong>, one of the Indian Army's most distinguished armoured regiments. He was barely out of the academy when the <a href="1971-war-birth-of-bangladesh.html">1971 war</a> began.<sup><a href="#s1">[1]</a></sup>` },
    { p:`In December 1971, his regiment was committed to the fierce fighting in the Shakargarh sector, in what became known as the <strong>Battle of Basantar</strong> — one of the largest tank engagements of the war.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`We are not soldiers; we are resolve, an oath unbroken, no matter the cost.` },
    { h2:`The battle of Basantar` },
    { p:`To hold the ground won by Indian infantry, engineers had cleared a path through a minefield, and the Poona Horse's tanks moved up to defend against the expected enemy armoured counter-attacks. When those counter-attacks came, in waves, the fighting was at murderously close range.<sup><a href="#s1">[1]</a></sup>` },
    { p:`Khetarpal, leading his troop of tanks, charged into the assault with extraordinary aggression. He overran enemy positions, captured defenders, and in a series of duels destroyed several enemy tanks, helping blunt thrust after thrust. His courage was, by every account, almost reckless in its boldness — and decisive in its effect.` },
    { h2:`"I will not abandon my tank"` },
    { p:`Then his own tank was hit and set ablaze. Ordered on the radio to abandon it and pull back to safety, Khetarpal replied that his gun was still working and that he would fight on — refusing to leave. In his final moments he destroyed at least one more enemy tank before a second hit killed him.<sup><a href="#s1">[1]</a></sup>` },
    { p:`He was twenty-one years old. His stand helped hold the line at Basantar, and for his "most conspicuous bravery," he was awarded the <a href="param-vir-chakra.html">Param Vir Chakra</a> posthumously — among the youngest ever to receive it.<sup><a href="#s2">[2]</a></sup>` },
    { h2:`The meeting that became legend` },
    { p:`There is a haunting postscript to Khetarpal's story. Years later, his father travelled to Pakistan and, by extraordinary chance, met the very Pakistani tank commander who had fought against — and killed — his son at Basantar. The old soldier spoke of Arun's valour with deep respect, soldier to soldier, across the border that had made them enemies. It is one of the most moving stories in the annals of either army: proof that true courage commands honour even from those it was used against.` },
    { h2:`The Poona Horse: a regiment of legends` },
    { p:`To understand Khetarpal, it helps to understand the regiment that shaped him. The <strong>Poona Horse</strong> is one of the oldest and most decorated armoured regiments of the Indian Army, with a lineage of cavalry tradition stretching back into the nineteenth century and a long roll of battle honours earned across two world wars and beyond.<sup><a href="#s1">[1]</a></sup>` },
    { p:`In such a regiment, a young officer inherits more than tanks and tactics. He inherits a code — of courage, of loyalty to one's crew, of the cavalryman's refusal to turn his back on a fight. When Khetarpal rode into Basantar, he carried the weight of that inheritance, and in a single night he added one of its proudest chapters.` },
    { h2:`The cauldron of Basantar` },
    { p:`The Battle of Basantar was no isolated duel; it was one of the decisive engagements of the western front in 1971, fought in the <strong>Shakargarh sector</strong>. To advance, Indian forces had to push a bridgehead across the Basantar river and through a deep enemy minefield. Engineers and infantry cleared and held that crossing under heavy fire — itself an act of supreme valour, for which Major Hoshiar Singh also earned the Param Vir Chakra in the same battle.<sup><a href="#s3">[3]</a></sup>`  },
    { p:`Once the bridgehead was secured, the enemy launched fierce armoured counter-attacks to throw the Indians back into the river. It was into this storm of steel that the Poona Horse's tanks, Khetarpal among them, were committed. The fighting was at point-blank range, tank against tank, in the cold December dawn — exactly the kind of close, merciless combat in which a single determined crew can change the course of a battle.` },
    { p:`Khetarpal's troop did precisely that. By refusing to give ground, by destroying counter-attacking tanks one after another, they broke the back of the enemy thrust and held the hard-won bridgehead. The cost was terrible, but the line held, and the wider Indian advance in the sector was secured.` },
    { h2:`What armour cannot replace` },
    { p:`It is tempting to think of tank warfare as a contest of machines — thicker armour, bigger guns, better engines. Basantar is a reminder that it is nothing of the sort. Both sides had powerful tanks. What decided the outcome was the human being inside the steel: the will to stay, to aim true, to fight on with a burning machine rather than withdraw.` },
    { p:`No upgrade, no technology, can manufacture that. It can only be given, freely, by a person who has decided that the ground behind them matters more than their own life. Khetarpal, at twenty-one, gave it without hesitation — and in doing so proved that the deciding factor in war has never really been the weapon, but the heart that wields it.` },
    { h2:`The western front in 1971` },
    { p:`To grasp the importance of Basantar, it helps to remember the shape of the whole 1971 war. India's main effort was in the east, where the goal was the swift liberation of <a href="1971-war-birth-of-bangladesh.html">Bangladesh</a>. On the western front, facing Pakistan proper, India fought a largely offensive-defensive campaign — holding firm against Pakistani thrusts while seizing key ground to strengthen its position. The <strong>Shakargarh sector</strong>, a wedge of Pakistani territory pointing toward vital Indian road and rail links, was one of the most important battlegrounds of that western war.<sup><a href="#s3">[3]</a></sup>` },
    { p:`Whoever controlled Shakargarh threatened the other's lines of communication. India's strike formations were committed to blunting the Pakistani armour concentrated there and pushing the line forward. The crossing of the Basantar river, and the desperate defence of the bridgehead beyond it against repeated armoured counter-attacks, became the decisive act of that struggle — and the stage on which a twenty-one-year-old subaltern would write himself into history.` },
    { h2:`Centurions against the counter-attack` },
    { p:`The tank battle at Basantar was a contest between well-matched machines, decided by the men inside them. The Poona Horse fought in British-designed <strong>Centurion</strong> tanks — rugged, accurate, and deadly in the hands of a disciplined crew. Against them came waves of Pakistani armour attempting to crush the fragile Indian bridgehead before it could be reinforced.<sup><a href="#s3">[3]</a></sup>` },
    { p:`In such close-range fighting, victory went to the crew that kept its nerve, picked its targets, and fired first and true. Khetarpal's troop did exactly that, fighting from a position they had been ordered to hold at all costs. Even after his own tank was hit and set ablaze, with his gun still able to fire, he chose to keep fighting rather than withdraw — and destroyed at least one more attacking tank before the end. It was not the armour that won at Basantar. It was the refusal of men like Khetarpal to break.` },
    { h2:`A legacy carved in stone and memory` },
    { p:`Arun Khetarpal's story did not end on the battlefield. It became part of how the army teaches courage to those who come after. His name is honoured at the <a href="national-war-memorial.html">National War Memorial</a>'s Param Yodha Sthal, among the busts of the nation's Param Vir Chakra recipients, and his example is held up to every young officer who passes through the academies he once walked.<sup><a href="#s2">[2]</a></sup>` },
    { p:`The most moving keeper of his memory, though, was his own father. Decades after the war, Brigadier M. L. Khetarpal travelled to Pakistan and, in an extraordinary turn of fate, met the very officer who had commanded the tanks against his son at Basantar. The two old soldiers spoke of Arun with mutual respect — the enemy commander acknowledging the young man's exceptional bravery. That meeting, later recorded in accounts of the battle, is one of the most humane episodes in the history of two armies that have so often faced each other in anger: proof that true valour is recognised even across the bitterest of borders.` },
    { h2:`The two Param Vir Chakras of Basantar` },
    { p:`Basantar was so fiercely contested that it produced two Param Vir Chakras — a rare distinction for a single battle. Alongside Khetarpal, Major Hoshiar Singh of the 3 Grenadiers earned the honour for holding a captured position on the far bank against relentless counter-attacks, moving openly among his men under shellfire to direct the defence even after being wounded.<sup><a href="#s3">[3]</a></sup> One award went to the cavalry, fighting from inside its tanks; the other to the infantry, clinging to the earth it had taken. Together they tell the whole story of Basantar: a victory won by different arms of the service, each refusing in its own way to yield the ground.` },
    { p:`That two such honours came from one battle is a measure of how desperate the fighting was — and of how much the outcome depended not on any single hero but on a shared, stubborn refusal across the whole force. The bridgehead held because, up and down the line, men decided independently that it would.` },
    { h2:`Why the young so often fall first` },
    { p:`There is a hard pattern in the citations of India's wars, and Khetarpal embodies it: a striking number of the bravest dead are very young officers — second lieutenants, lieutenants, captains barely into their twenties. It is not an accident. The junior officer's job, in the Indian military tradition, is to lead from the front, to be the first out of the trench and the last to fall back. The cost of that ethic is borne disproportionately by the youngest.` },
    { p:`It would be easy to call this a tragedy of waste, and in human terms it is. But it is also the source of the army's deepest strength: soldiers will follow an officer who shares their danger absolutely, and they will hold ground for a leader who would die before abandoning them. Khetarpal was that kind of leader at twenty-one. The men around him fought harder because of it, and the line held because of them.` },
    { h2:`The boy who would not leave` },
    { p:`What stays with me about Arun Khetarpal is his age. Twenty-one — younger than many readers of this article. At an age when most people are only beginning to imagine their lives, he made a decision that ended his: to stay, to fight, to hold, when leaving was not only permitted but ordered.` },
    { p:`"We are not soldiers; we are resolve," says the voice in my poem. Khetarpal's last transmission — that he would not abandon his tank — is that line made real, spoken by a boy in a burning machine in a faraway field. His resolve held the line at Basantar. His example holds something in us still.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Arun Khetarpal','Arun_Khetarpal') + ' Regimental history: ' + SRC.wiki('The Poona Horse','The_Poona_Horse') },
    { n:2, html: SRC.gallantry },
    { n:3, html: SRC.wiki('Battle of Basantar','Battle_of_Basantar') }
  ],
  related:['battle-of-longewala-1971','param-vir-chakra','subedar-joginder-singh-1962']
});

add({
  slug:'subedar-joginder-singh-1962', date:'2025-10-23', category:'Heroes', eyebrow:'Heroes · 1962',
  readTime:'8 min read',
  title:`Subedar Joginder Singh: The Last Bayonet at Bum La`,
  h1:`Subedar Joginder Singh: <em>The Last Bayonet at Bum La</em>`,
  plainTitle:`Subedar Joginder Singh`,
  cardTitle:`Subedar Joginder Singh: The Last Bayonet at Bum La`,
  desc:`In the 1962 war, Subedar Joginder Singh and a small platoon of the Sikh Regiment held a Himalayan ridge against waves of Chinese troops near Bum La — fighting on with the bayonet when the ammunition ran out. The story of a Param Vir Chakra earned in defeat.`,
  keywords:`Subedar Joginder Singh, Param Vir Chakra, 1962 war, Bum La, Tongpen La, Sikh Regiment, NEFA Tawang, last stand, bayonet charge`,
  excerpt:`In 1962, Subedar Joginder Singh and a small platoon held a Himalayan ridge against waves of Chinese troops — fighting on with bayonets when the ammo ran out.`,
  intro:[
    `History tends to reward the wars we win. But some of the purest courage in any nation's story is found in the battles it lost — in the men who, with no hope of victory and no chance of relief, simply refused to yield. <strong>Subedar Joginder Singh</strong>, who fell in the 1962 war, is one of those men.`,
    `His stand sits beside the last stand at <a href="1962-sino-indian-war.html">Rezang La</a> as proof that the defeat of 1962 was not the defeat of the Indian soldier.`
  ],
  body:[
    { h2:`A platoon on the ridge` },
    { p:`When China launched its offensive in October 1962, one of the first blows fell in the Tawang sector of the North-East Frontier. There, guarding a critical approach near <strong>Bum La</strong>, stood a platoon of the <strong>1 Sikh</strong>, led by <strong>Subedar Joginder Singh</strong> — a small body of men holding a ridge against a vastly larger attacking force.<sup><a href="#s1">[1]</a></sup>` },
    { p:`On the morning of <strong>23 October 1962</strong>, the Chinese assaulted the position in successive waves. Joginder Singh's platoon, dug in and disciplined, met each wave with steady, accurate fire, inflicting heavy casualties and throwing the attackers back again and again.<sup><a href="#s1">[1]</a></sup>` },
    { quote:`The crack of bullets, the clash of steel, the mountain groans but does not yield.` },
    { h2:`When the ammunition ran out` },
    { p:`Wave after wave came on. Joginder Singh was wounded, but refused to be evacuated, moving among his dwindling men, manning a machine gun himself, holding the position by sheer will. As casualties mounted and ammunition began to run out, the situation became desperate.<sup><a href="#s1">[1]</a></sup>` },
    { p:`When the bullets were nearly gone, Joginder Singh did the only thing left to a soldier determined not to surrender his ground: he led the survivors of his platoon in a <strong>bayonet charge</strong> into the advancing enemy. Outnumbered many times over, they fought hand to hand until almost all had fallen. Joginder Singh, grievously wounded, was overpowered and taken prisoner; he later died of his wounds in captivity.<sup><a href="#s1">[1]</a></sup>` },
    { h2:`A Param Vir Chakra in defeat` },
    { p:`The position was ultimately lost, as so much was lost in that bitter war. But the manner of its defence — a platoon holding against impossible odds, fighting with the bayonet when nothing else remained — became one of the few shining lights in a dark campaign. Subedar Joginder Singh was awarded the <a href="param-vir-chakra.html">Param Vir Chakra</a> posthumously, one of the first of the 1962 war.<sup><a href="#s2">[2]</a></sup>` },
    { p:`In a quiet act of respect, the Chinese later returned his ashes to India — an acknowledgement, perhaps, of valour that crossed the line between enemies.` },
    { h2:`Why the lost battles matter` },
    { p:`It would be easy to leave the heroes of 1962 in the shadow of the war's failure — to remember only the strategic blunders and the retreat. But to do so would be to insult men like Joginder Singh, whose courage owed nothing to the mistakes made far above them.` },
    { p:`The soldier does not choose the war or its planning. He chooses only how he will meet the enemy in front of him. Joginder Singh met them with discipline, then with defiance, and finally with the bayonet — giving everything for a ridge he could not ultimately hold.` },
    { p:`That is the deepest theme of my whole collection: that the worth of a sacrifice does not depend on whether the battle was won. "The mountain groans but does not yield," says my poem of Kargil — but the line belongs just as truly to a Sikh subedar on a lost ridge in 1962, charging with cold steel into the dawn, so that the idea of an unbroken India might survive even a defeat.` }
  ],
  sources:[
    { n:1, html: SRC.wiki('Joginder Singh (soldier)','Joginder_Singh_(soldier)') },
    { n:2, html: SRC.gallantry }
  ],
  related:['1962-sino-indian-war','arun-khetarpal-basantar','param-vir-chakra']
});

// ---- geopolitics batch (hand-authored pages, registered for index) ----
require('./articles-geopolitics.js').forEach(add);

// ---- 2026 "latest happenings" batch (appended) ----------------
require('./articles-latest.js').forEach(add);

module.exports = A;
