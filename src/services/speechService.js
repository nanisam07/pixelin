/**
 * Enhanced Speech Service
 * Supports Telugu, Hindi, English, Kannada, and Malayalam.
 * Automatically finds the best system voice matching the selected language.
 */

const localeMap = {
  te: "te-IN",
  hi: "hi-IN",
  en: "en-US",
  kn: "kn-IN",
  ml: "ml-IN"
};

export function speakText(text, languageCode) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech Synthesis is not supported in this browser.");
    return;
  }

  // Cancel any ongoing speaking to prevent queue overlap
  window.speechSynthesis.cancel();

  const targetLocale = localeMap[languageCode] || "en-US";
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLocale;
  utterance.rate = 0.85; // Slightly slower for clear agricultural terminology pronunciation
  utterance.pitch = 1.0;

  // Retrieve voices and select the best match for the locale
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find exact locale match first (e.g. te-IN)
  let voice = voices.find(v => v.lang.toLowerCase() === targetLocale.toLowerCase());
  
  // If not found, try to find language code match (e.g. prefix 'te')
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().startsWith(languageCode.toLowerCase()));
  }

  if (voice) {
    utterance.voice = voice;
  } else {
    console.log(`No native system voice found for locale: ${targetLocale}. Falling back to browser default.`);
  }

  // Speak with a short timeout to clear browser audio channels safely
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 200);
}