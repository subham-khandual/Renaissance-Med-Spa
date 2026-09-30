// ------------------------------------------------------------------
// Sayraa Sweet & Cute Female Voice Synthesis Engine (from EduSkill / Sayraa)
// ------------------------------------------------------------------
// Strictly guarantees a beautiful, sweet, cute, warm FEMALE voice.
// ------------------------------------------------------------------

const NAME_PRONUNCIATION = [
  [/Sayraa/gi, "Sigh-raa"],
  [/Botox®?/gi, "Bow-tox"],
  [/HydraFacial®?/gi, "Hydra-Facial"],
  [/Juvéderm®?/gi, "Ju-ve-derm"],
  [/Restylane®?/gi, "Resty-lane"],
  [/Sculptra®?/gi, "Sculp-tra"],
  [/Radiesse®?/gi, "Ray-dee-ess"],
  [/Plexr/gi, "Plex-er"],
];

let cachedVoices = [];
let voicesPromise = null;

/**
 * Ensures voices are fully loaded asynchronously before picking a voice.
 * In Chrome on Windows, synth.getVoices() initially only contains 2-3 local OS voices (David, Mark, Zira),
 * and loads network voices (like Google हिन्दी) ~100-300ms later via 'voiceschanged'.
 */
export const ensureVoicesReady = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }
  const synth = window.speechSynthesis;

  // Persistently listen to voiceschanged to keep cachedVoices fresh
  if (!synth._sayraaListenerAttached) {
    synth._sayraaListenerAttached = true;
    const update = () => {
      const v = synth.getVoices();
      if (v && v.length) {
        cachedVoices = v;
      }
    };
    synth.addEventListener("voiceschanged", update);
    synth.onvoiceschanged = update;
  }

  const existing = synth.getVoices();
  const hasTargetVoice = existing.some((v) =>
    /google\s*हिन्दी|हिन्दी|swara|neerja|kalpana|heera/i.test(v.name || "")
  );

  // If already loaded with target voice or full list (> 5 voices), resolve immediately
  if (existing && existing.length > 5 && hasTargetVoice) {
    cachedVoices = existing;
    return Promise.resolve(existing);
  }

  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      voicesPromise = null;
      const v = synth.getVoices();
      cachedVoices = v && v.length ? v : existing;
      resolve(cachedVoices);
    };

    synth.onvoiceschanged = finish;

    // Fast polling fallback in case voiceschanged already fired or takes a short delay
    let count = 0;
    const interval = setInterval(() => {
      const v = synth.getVoices();
      const ready = v.some((voice) =>
        /google\s*हिन्दी|हिन्दी|swara|neerja|kalpana|heera/i.test(voice.name || "")
      );
      if (ready || v.length > 15 || ++count > 25) {
        clearInterval(interval);
        finish();
      }
    }, 40);
  });

  return voicesPromise;
};

/**
 * Selects the EXACT sweet, cute, melodious female voice from the Sayraa / Envistream video.
 * In Google Chrome: 'Google हिन्दी' speaking English produces that signature sweet feminine voice.
 * In Edge / Windows: 'Microsoft Swara Online (Natural)' produces the matching sweet tone.
 */
export const pickSweetVoice = (voices) => {
  const synthVoices = typeof window !== "undefined" && window.speechSynthesis
    ? window.speechSynthesis.getVoices()
    : null;
  const list = synthVoices && synthVoices.length > 0 ? synthVoices : (voices && voices.length > 0 ? voices : cachedVoices);
  if (!list || !list.length) return null;

  const isMale = (v) =>
    /male|david|george|mark|ravi|rahul|madhur|prabhat|hemant|guy|stefan|james|brian|alex|fred|richard|oliver/i.test(
      v.name || ""
    );

  const pool = list.filter((v) => !isMale(v));
  if (!pool.length) return list[0];

  // 1. TIER 1: The exact signature sweet female voice from the user's video (Envistream / Sayraa)
  // Google Chrome: "Google हिन्दी"
  // Microsoft Edge: "Microsoft Swara Online (Natural) - Hindi (India)" / "Microsoft Swara"
  const topSweetSayraa = pool.find(
    (v) =>
      /google\s*हिन्दी|हिन्दी/i.test(v.name) ||
      (/swara/i.test(v.name) && (v.name.includes("Natural") || v.name.includes("Online") || /hi/i.test(v.lang)))
  );
  if (topSweetSayraa) return topSweetSayraa;

  // 2. TIER 2: Any Microsoft Swara or Hindi female voice (Kalpana, hi-IN)
  const swaraOrHindi = pool.find(
    (v) => /swara/i.test(v.name) || (/kalpana/i.test(v.name) && /hi/i.test(v.lang)) || (v.lang === "hi-IN" || v.lang === "hi_IN")
  );
  if (swaraOrHindi) return swaraOrHindi;

  // 3. TIER 3: Indian English sweet female voices (Microsoft Neerja, Heera, Google English India)
  const indianFemale = pool.find(
    (v) =>
      (/neerja|heera|ananya|aditi/i.test(v.name) && !isMale(v)) ||
      (/google/i.test(v.name) && (/en-in|india/i.test(v.name) || /en-in/i.test(v.lang)))
  );
  if (indianFemale) return indianFemale;

  // 4. TIER 4: Any en-IN or hi-IN female voice
  const anyIndianFemale = pool.find(
    (v) => (v.lang === "en-IN" || v.lang === "hi-IN") && !isMale(v)
  );
  if (anyIndianFemale) return anyIndianFemale;

  // 5. TIER 5: Microsoft Natural Online Sweet Female Voices (Jenny Online, Aria Online)
  const naturalOnline = pool.find(
    (v) =>
      (v.name.includes("Natural") || v.name.includes("Online") || v.name.includes("Neural")) &&
      /jenny|aria|emma|ava|sonia/i.test(v.name)
  );
  if (naturalOnline) return naturalOnline;

  // 6. TIER 6: Google US English or Google UK English Female
  const googleSweet = pool.find(
    (v) => /google/i.test(v.name) && (/us english|uk english female/i.test(v.name) || /female/i.test(v.name))
  );
  if (googleSweet) return googleSweet;

  // 7. TIER 7: Apple high-quality sweet voices (Samantha, Karen, Victoria)
  const appleSweet = pool.find((v) => /samantha|karen|victoria|tessa/i.test(v.name));
  if (appleSweet) return appleSweet;

  // 8. TIER 8: Any Natural / Neural voice
  const anyNeural = pool.find((v) => /natural|neural|online/i.test(v.name));
  if (anyNeural) return anyNeural;

  // 9. TIER 9: Any non-robotic female voice (excluding Microsoft Zira)
  const nonZiraFemale = pool.find(
    (v) => !/zira/i.test(v.name) && (/female|woman/i.test(v.name) || v.gender === "female")
  );
  if (nonZiraFemale) return nonZiraFemale;

  // 10. Last resort fallback
  return pool.find((v) => !/zira/i.test(v.name)) || pool[0];
};

export const cleanTextForSpeech = (rawText) => {
  if (!rawText) return "";
  let clean = String(rawText);

  // Remove markdown formatting
  clean = clean.replace(/```[\s\S]*?```/g, " ");
  clean = clean.replace(/[*_~`]+/g, "");
  clean = clean.replace(/^#{1,6}\s+/gm, "");
  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  clean = clean.replace(/https?:\/\/\S+/gi, "");
  clean = clean.replace(/^[\s* \---]+\s*/gm, "");

  // Remove emojis so TTS doesn't read symbol names
  clean = clean.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu,
    ""
  );

  // Normalize phonetic pronunciations
  for (const [pattern, replacement] of NAME_PRONUNCIATION) {
    clean = clean.replace(pattern, replacement);
  }

  clean = clean.replace(/\s+/g, " ");
  return clean.trim();
};

const chunkText = (text, maxLen = 160) => {
  const clean = cleanTextForSpeech(text);
  if (!clean) return [];
  if (clean.length <= maxLen) return [clean];

  const sentences = clean.split(/(?<=[?.!])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length <= maxLen) {
      current = current ? current + " " + sentence : sentence;
      continue;
    }
    if (current) chunks.push(current);
    if (sentence.length <= maxLen) {
      current = sentence;
    } else {
      let rest = sentence;
      while (rest.length > maxLen) {
        let cut = rest.lastIndexOf(" ", maxLen);
        if (cut < maxLen * 0.5) cut = maxLen;
        chunks.push(rest.slice(0, cut).trim());
        rest = rest.slice(cut).trim();
      }
      current = rest;
    }
  }
  if (current) chunks.push(current);
  return chunks;
};

let speakToken = 0;

export const stopSpeaking = () => {
  speakToken++;
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
};

/**
 * Speaks text aloud in the proven cute, melodic, sweet female voice from Sayraa/EduSkill
 * pitch: 1.12 (cute melodic feminine tone)
 * rate: 0.98 (gentle, warm, natural pace)
 */
export const speakSweetVoice = async (text, opts = {}) => {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth || !text) return;

  stopSpeaking();
  const token = speakToken;

  const voices = await ensureVoicesReady();
  if (token !== speakToken) return;

  const voice = pickSweetVoice(voices);
  const chunks = chunkText(text);
  if (!chunks.length) return;

  const speakChunk = (index) => {
    if (token !== speakToken) return;
    const isLast = index === chunks.length - 1;
    const chunkContent = chunks[index];
    const utterance = new SpeechSynthesisUtterance(chunkContent);

    utterance.lang = voice?.lang || "hi-IN";
    if (voice) utterance.voice = voice;

    // The signature sweet, cute, warm parameters from EduSkill/Sayraa
    utterance.pitch = opts.pitch ?? 1.12;
    utterance.rate = opts.rate ?? 0.98;
    utterance.volume = opts.volume ?? 1.0;

    let hasEnded = false;
    const finish = () => {
      if (hasEnded) return;
      hasEnded = true;
      clearTimeout(watchdogTimer);
      if (token !== speakToken) return;
      if (isLast) {
        opts.onEnd?.();
      } else {
        speakChunk(index + 1);
      }
    };

    // Watchdog timer so speech never hangs in Chrome/Edge
    const watchdogTimer = setTimeout(finish, Math.max(3500, chunkContent.length * 130));

    utterance.onstart = () => {
      if (token === speakToken && index === 0) {
        opts.onStart?.();
      }
    };
    utterance.onend = finish;
    utterance.onerror = () => finish();

    try {
      if (synth.paused) synth.resume();
      synth.speak(utterance);
    } catch (err) {
      console.warn("synth.speak error:", err);
      finish();
    }
  };

  speakChunk(0);
};
