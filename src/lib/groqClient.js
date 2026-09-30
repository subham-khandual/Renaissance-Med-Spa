/**
 * Groq API client — Chat (LLM), STT (Whisper), TTS (PlayAI)
 *
 * ⚠️  PRODUCTION NOTE: In production, proxy these calls through a secure
 * server-side endpoint so the API key is never exposed in the browser bundle.
 */

const GROQ_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GROQ_API_KEY) ||
  (typeof process !== "undefined" && process.env?.VITE_GROQ_API_KEY) ||
  "";
const BASE = "https://api.groq.com/openai/v1";

export const SYSTEM_PROMPT = `You are Sayraa, the sophisticated AI virtual concierge for Renaissance Med Spa in Colorado Springs, Colorado. 
You are warm, elegantly professional, and deeply knowledgeable about medical aesthetics and wellness.

MANDATORY RULES:
1. STRICTLY ENGLISH ONLY: Always communicate and reply exclusively in English. Under NO circumstances should you reply in Hindi, Hinglish, Spanish, or any other language.
2. NON-ENGLISH QUERIES: If the user communicates in Hindi, Hinglish, or any other non-English language, reply ONLY with:
   "I apologize, but I can only understand and communicate in English. Please ask your question in English, and I will be delighted to assist you with Renaissance Med Spa treatments and appointments! ✨"
3. STRICT ANSWER LENGTH (EXACTLY 3 LINES ONLY):
   - Provide an accurate, high-quality answer in EXACTLY 3 LINES (approximately 35 to 55 words).
   - Never write fewer than 3 lines or more than 3 lines.
   - Address the client's question directly with aesthetic knowledge and clarity.
4. DO NOT PUSH BOOKING UNLESS ASKED:
   - Do NOT say "book a complimentary consultation" or push appointments in your answers.
   - ONLY mention booking, phone numbers, or scheduling IF the user specifically asks how to book, schedule, or make an appointment.
   - Keep answers focused purely on the aesthetic treatment, benefits, and results.

You help clients with Renaissance Med Spa services (Medical Director: Dr. Parul Maheshwari, MD):
- Injectable aesthetics: Botox®, Xeomin® (neurotoxins), Juvéderm®, Restylane® (dermal fillers), Sculptra®, Radiesse® (biostimulators)
- Facial rejuvenation: HydraFacial®, medical-grade VI Peel chemical peels, microneedling, RF Microneedling, PRP therapy ("Vampire Facial")
- Laser therapies: Laser skin resurfacing, pigment correction, vascular treatments, laser hair removal
- Body & medical care: Physician-supervised medical weight loss (Semaglutide & Tirzepatide), PDO thread lifts, Plexr Plus plasma soft surgery, vein sclerotherapy, waxing
- Financing & appointments: Cherry and CareCredit payment plans, VIP memberships, scheduling at (719) 698-1176 or online at 5014 El Camino Drive, Suite 100, Colorado Springs, CO 80918.

Clinical boundary: Never diagnose medical conditions. Focus on treatment education and answer purely in 3 lines.`;

export async function groqChat(history) {
  const models = ["openai/gpt-oss-20b", "qwen/qwen3.8-27b", "openai/gpt-oss-120b"];
  let lastErr = null;

  for (const model of models) {
    try {
      const res = await fetch(`${BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
          max_tokens: 1000,
          temperature: 0.65,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices[0]?.message?.content?.trim() ?? "";
      }
      const errJson = await res.json().catch(() => ({}));
      lastErr = new Error(errJson.error?.message ?? `Model ${model} returned ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error("All Groq chat models failed");
}

// ── Speech-to-Text (Whisper) ───────────────────────────────────────────────
export async function groqTranscribe(audioBlob) {
  const formData = new FormData();
  // Prefer webm/opus; fall back to mp4 if the browser chose that
  const ext = audioBlob.type.includes("mp4") ? "audio.mp4" : "audio.webm";
  formData.append("file", audioBlob, ext);
  formData.append("model", "whisper-large-v3-turbo"); // fastest & free
  formData.append("response_format", "json");
  formData.append("language", "en");

  const res = await fetch(`${BASE}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${GROQ_KEY}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? `Groq STT error ${res.status}`);
  }

  const data = await res.json();
  return data.text?.trim() ?? "";
}

