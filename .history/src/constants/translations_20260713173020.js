export const translations = {
  en: {
    "Cotton": "Cotton",
    "Paddy": "Paddy",
    "Tomato": "Tomato",
    "Chilli": "Chilli",
    "Cabbage": "Cabbage",
    "Stem Borer": "Stem Borer",
    "Leaf Spot": "Leaf Spot",
    "Bacterial Blight": "Bacterial Blight",
    "Powdery Mildew": "Powdery Mildew",
    "Black Rot": "Black Rot",
    "expel-r": "Expel-R",
    "dodger": "Dodger",
    "pixel-sensa": "Pixel Sensa",
    "AddToCart": "Add To Cart",
    "AddedToCart": "Added To Cart",
    "DiagnosticReport": "Diagnostic Report",
    "Confidence": "Confidence",
    "Listen": "Listen"
  },
  te: {
    "Cotton": "ప్రత్తి",
    "Paddy": "వరి",
    "Tomato": "టమోటా",
    "Chilli": "మిరప",
    "Cabbage": "క్యాబేజీ",
    "Stem Borer": "కాండం తొలిచే పురుగు",
    "Leaf Spot": "ఆకు మచ్చ తెగులు",
    "Bacterial Blight": "బ్యాక్టీరియల్ బ్లైట్",
    "Powdery Mildew": "బూడిద తెగులు",
    "Black Rot": "నలుపు కుళ్లు తెగులు",
    "expel-r": "ఎక్స్పెల్-ఆర్",
    "dodger": "డాడ్జర్",
    "pixel-sensa": "పిక్సెల్ సెన్సా",
    "AddToCart": "కార్ట్‌కి జోడించు",
    "AddedToCart": "జోడించబడింది",
    "DiagnosticReport": "రోగనిర్ధారణ నివేదిక",
    "Confidence": "నమ్మకమైన స్థాయి",
    "Listen": "వినండి"
  },
  hi: {
    "Cotton": "कपास",
    "Paddy": "धान",
    "Tomato": "टमाटर",
    "Chilli": "मिर्च",
    "Cabbage": "पत्तागोभी",
    "Stem Borer": "तना छेदक",
    "Leaf Spot": "पत्ती धब्बा",
    "Bacterial Blight": "जीवाणु झुलसा",
    "Powdery Mildew": "पाउडर फफूंदी",
    "Black Rot": "काली सड़न",
    "expel-r": "एक्स्पेल-आर",
    "dodger": "डॉजर",
    "pixel-sensa": "पिक्सेल सेंसा",
    "AddToCart": "कार्ट में जोड़ें",
    "AddedToCart": "जोड़ा गया",
    "DiagnosticReport": "नैदानिक रिपोर्ट",
    "Confidence": "आत्मविश्वास स्तर",
    "Listen": "सुनें"
  }
};

export function getTranslation(lang, key) {
  const currentLang = translations[lang] || translations["en"];
  return currentLang[key] || key;
}