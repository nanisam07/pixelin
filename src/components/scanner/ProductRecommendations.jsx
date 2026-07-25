"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Check, Info } from "lucide-react";
import { getRecommendedProducts } from "../../services/productService";
import { useTranslation } from "../../hooks/useTranslation";

// Local translations for product descriptions/reasonings to keep JSON translations compact and fast
const productLocalTranslations = {
  te: {
    "expel-r": {
      cat: "బయో క్రిమిసంహారకం",
      desc: "కాండం మరియు కాయల లోపల నమిలే పురుగులు మరియు గులాబీ పురుగులను నివారిస్తుంది.",
      why: "కాండం తొలిచే పురుగు మరియు గులాబీ రంగు పురుగులను సమర్థవంతంగా అరికడుతుంది."
    },
    "dodger": {
      cat: "క్రిమిసంహారకం",
      desc: "సిస్టమిಕ್ చర్య ద్వారా రసం పీల్చే పురుగులను నిరోధిస్తుంది, వరి పంటను సుడి దోమ (BPH) నుండి కాపాడుతుంది.",
      why: "సుడి దోమ త్వరగా వ్యాపించకుండా అడ్డుకుంటుంది."
    },
    "pixel-sensa": {
      cat: "శిలీంధ్ర ನಾಶಕ",
      desc: "వరిలో అగ్గి తెగులు మరియు ఆకుమచ్చ తెగులు నుండి సంపూర్ణ రక్షణ కల్పిస్తుంది.",
      why: "శిలీంధ్ర వ్యాధుల వ్యాప్తిని నిరోధించి గింజ నాణ್ಯతను పెంచుతుంది."
    },
    "pixel-4d": {
      cat: "క్రిమిసంహారకం",
      desc: "పత్తిలో తెల్లదోమ, పై ముడత మరియు నల్లి నివారణకు ఒకే స్ప్రే సరిపోతుంది.",
      why: "ఆకుల అడుగు భాగంలో దాగి ఉండే రసం పೀಲ್చే పురుగులను వాయు చర్య ద్వారా నివారిస్తుంది."
    },
    "extend": {
      cat: "బయో రక్షణ",
      desc: "రసాయన ఒత్తిడి లేకుండా రసం పీಲ್చే పురుగుల వృద్ధిని నిరోధించే హెర్బల్ బయో-స్టిమ్యులెంట్.",
      why: "సహಜ పద్ధతిలో పై ముడత మరియు నల్లి నివారణకు సహాయపడుతుంది."
    },
    "maxcott": {
      cat: "ద్విపాత్రాభినయం",
      desc: "తెల్లదోమ, పేను పురుగు మరియు జస్సిడ్‌లను వెంటనే నివారిస్తూ పంట వేగంగా కోలుకోవడానికి సహాయపడుతుంది.",
      why: "రసం పೀಲ್చే పురుగులను చంపుతూనే ఆకుల పచ్చదనాన్ని పెంచుతుంది."
    },
    "flora": {
      cat: "దిగుబడి బూస్టర్",
      desc: "పూత మరియు కాయ రాలడాన్ని నిరోధిస్తుంది మరియు పోషకాలను కాయలకు చేరవేస్తుంది.",
      why: "పూత మరియు కాయల నిలుపుదలను పెంచి నేరుగా దిగుబడిని పెంచుతుంది."
    },
    "builder": {
      cat: "సూక్ష్ಮ ಪೋಷಕాలు",
      desc: "పూతకు ముందు కాండం నిర్మితిని బలోపేతం చేయడానికి మెగ్නීషియం, జింಕ್, ರಂಜಕం మరియు ಬೋರಾన్ అందిస్తుంది.",
      why: "ಪೂತ దశకు అవసరమైన కీలక పోషకాలను సమకూరుస్తుంది."
    },
    "probion": {
      cat: "బయో స్టిమ్యులెంట్",
      desc: "వాతావరణ మరియు రసాయన ఒత్తిడి నుండి పంటలు వేగంగా కోలుకోవడానికి అమినో ఆమ్లాలను అందిస్తుంది.",
      why: "తీవ్రమైన వాతావರಣ మార్పుల నుండి పంటను రಕ್ಷిస్తుంది."
    },
    "k-mate": {
      cat: "నేల ఆరోగ్యం",
      desc: "వేరు వ్యవస్థ అభివృద్ధిని పెంచడానికి మరియు నేలలో లభించని భాస్వరాన్ని కరిగించడానికి సహాయపడుతుంది.",
      why: "వేర్లు బలంగా పెరగడానికి మరియు నేలను సారవంతం చేయడానికి సహాయపడుతుంది."
    },
    "lamigo": {
      cat: "క్రిమిసంహారకం",
      desc: "నమిలే పురుగులు మరియు కాండం తొలిచే పురుగులపై వేగవంతమైన రక్షణ కవచం.",
      why: "స్ప్రే చేసిన రెండు గಂಟల్లోనే వర్షానికి కొట్టుకుపోకుండా రక్షణ కల్పిస్తుంది."
    },
    "aimer": {
      cat: "క్రిమిసంహారకం",
      desc: "కాండం తొలిచే పురుగు లార్వాలను ఆకు లోపలికి వెళ్లకుండా ముందే నిరోధించే వ్యవస్థ.",
      why: "పంట ఎదుగుదల దశలో ఎక్కువ రోజులు తెగుళ్ల నుండి కాపాడుతుంది."
    }
  },
  hi: {
    "expel-r": {
      cat: "बायो कीटनाशक",
      desc: "तने और बोल के अंदर चबाने वाले कीड़ों और गुलाबी सुंडी को रोकता है।",
      why: "तने और बोल के अंदर छिपे कीड़ों को प्रभावी ढंग से नियंत्रित करता है।"
    },
    "dodger": {
      cat: "कीटनाशक",
      desc: "प्रणालीगत क्रिया से रस चूसने वाले कीटों को रोकता है, धान को बीपीएच से बचाता है।",
      why: "हॉपर बर्न को रोकने के लिए कीटों को तुरंत पंगु बना देता है।"
    },
    "pixel-sensa": {
      cat: "फफूंदनाशक",
      desc: "धान में ब्लास्ट और शीथ ब्लाइट रोगों से फसल को पूरी सुरक्षा प्रदान करता है।",
      why: "फंगल रोगों के प्रसार को रोकता है और दाने की चमक बढ़ाता है।"
    },
    "pixel-4d": {
      cat: "कीटनाशक",
      desc: "कपास में सफेद मक्खी, थ्रिप्स और लाल मकड़ी का एक साथ नियंत्रण।",
      why: "वाष्प क्रिया द्वारा पत्तों के नीचे छिपे रस चूसने वाले कीटों तक पहुंचता है।"
    },
    "extend": {
      cat: "बायो रक्षक",
      desc: "बिना किसी रासायनिक तनाव के रस चूसने वाले कीटों के जीवन चक्र को रोकता है।",
      why: "प्राकृतिक रूप से थ्रिप्स और माइट्स को नियंत्रित करने में मदद करता है।"
    },
    "maxcott": {
      cat: "दोहरा प्रभाव",
      desc: "सफेद मक्खी, एफिड और जैसिड को मारता है और फसल के विकास को गति देता है।",
      why: "चूसने वाले कीटों को मारते हुए पत्तों के हरेपन को बढ़ाता है।"
    },
    "flora": {
      cat: "उपज बूस्टर",
      desc: "फूलों और बोल गिरने को रोकता है और पोषक तत्वों को बोल तक पहुँचाता है।",
      why: "फूलों के झड़ने को कम करके सीधे फसल की पैदावार बढ़ाता है।"
    },
    "builder": {
      cat: "सूक्ष्म पोषक तत्व",
      desc: "फूल आने से पहले पौधों की संरचना को मजबूत करने के लिए Mg, Zn, P और Boron प्रदान करता है।",
      why: "फूल आने की अवस्था में आवश्यक पोषक तत्व प्रदान करता है।"
    },
    "probion": {
      cat: "बायो स्टिम्युलेंट",
      desc: "सूखा, गर्मी या रासायनिक तनाव से उबरने के लिए अमीनो एसिड प्रदान करता है।",
      why: "प्रतिकूल मौसम के प्रभाव से फसल को तुरंत बचाता है।"
    },
    "k-mate": {
      cat: "मिट्टी स्वास्थ्य",
      desc: "जड़ों के विकास को बढ़ाने और अनुपलब्ध फास्फोरस को घोलने में मदद करता है।",
      why: "जड़ों को मजबूत बनाने और मिट्टी की गुणवत्ता सुधारने में सहायक है।"
    },
    "lamigo": {
      cat: "कीटनाशक",
      desc: "चबाने वाले कीड़ों और तना छेदकों पर त्वरित और प्रभावी सुरक्षा।",
      why: "छिड़काव के दो घंटे के भीतर बारिश से बेअसर नहीं होता।"
    },
    "aimer": {
      cat: "कीटनाशक",
      desc: "तना छेदक के लार्वा को तने के अंदर जाने से पहले ही रोकता है।",
      why: "लंबे समय तक फसल को सुरक्षा कवच प्रदान करता है।"
    }
  },
  kn: {
    "expel-r": {
      cat: "ಬಯೋ ಕೀಟನಾಶಕ",
      desc: "ಕಾಂಡ ಮತ್ತು ಕಾಯಿಗಳ ಒಳಗಿನ ಕೀಟಗಳು ಮತ್ತು ಗುಲಾಬಿ ಹುಳುಗಳನ್ನು ತಡೆಯುತ್ತದೆ.",
      why: "ಕಾಂಡ ಕೊರಕ ಮತ್ತು ಕಾಯಿ ಕೊರಕ ಹುಳುಗಳನ್ನು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ನಿಯಂತ್ರಿಸುತ್ತದೆ."
    },
    "dodger": {
      cat: "ಕೀಟನಾಶಕ",
      desc: "ಸಿಸ್ಟಮಿಕ್ ಕ್ರಿಯೆಯಿಂದ ರಸ ಹೀರುವ ಕೀಟಗಳನ್ನು ತಡೆಯುತ್ತದೆ, ಭತ್ತವನ್ನು ಬಿಪಿಎಚ್ ನಿಂದ ರಕ್ಷಿಸುತ್ತದೆ.",
      why: "ಕಂದು ಜಿಗಿ ಹುಳುಗಳು ಹರಡದಂತೆ ತಕ್ಷಣವೇ ನಿಯಂತ್ರಿಸುತ್ತದೆ."
    },
    "pixel-sensa": {
      cat: "ಶಿಲೀಂಧ್ರ ನಾಶಕ",
      desc: "ಭತ್ತದಲ್ಲಿ ಕುತ್ತಿಗೆ ರೋಗ ಮತ್ತು ಎಲೆ ಒಣಗುವ ರೋಗಗಳ ವಿರುದ್ಧ ಸಂಪೂರ್ಣ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ.",
      why: "ಶಿಲೀಂಧ್ರ ರೋಗಗಳ ಹರಡುವಿಕೆಯನ್ನು ತಡೆಯುತ್ತದೆ ಮತ್ತು ಧಾನ್ಯದ ಗುಣಮಟ್ಟ ಹೆಚ್ಚಿಸುತ್ತದೆ."
    },
    "pixel-4d": {
      cat: "ಕೀಟನಾಶಕ",
      desc: "ಹತ್ತಿಯಲ್ಲಿ ಬಿಳಿ ನೊಣ, ಥ್ರಿಪ್ಸ್ ಮತ್ತು ನುಸಿಗಳ ನಿಯಂತ್ರಣಕ್ಕೆ ಒಂದೇ ಸಿಂಪಡಣೆ ಸಾಕು.",
      why: "ಎಲೆಗಳ ಕೆಳಗೆ ಅಡಗಿರುವ ರಸ ಹೀರುವ ಕೀಟಗಳನ್ನು ಆವಿ ಕ್ರಿಯೆಯ ಮೂಲಕ ನಾಶಪಡಿಸುತ್ತದೆ."
    },
    "extend": {
      cat: "ಬಯೋ ರಕ್ಷಕ",
      desc: "ರಾಸಾಯನಿಕ ಒತ್ತಡವಿಲ್ಲದೆ ರಸ ಹೀರುವ ಕೀಟಗಳ ಸಂತತಿಯನ್ನು ತಡೆಯುವ ಗಿಡಮೂಲಿಕೆ ಬಯೋ-ಸ್ಟಿಮ್ಯುಲೆಂಟ್.",
      why: "ನೈಸರ್ಗಿಕವಾಗಿ ಥ್ರಿಪ್ಸ್ ಮತ್ತು ನುಸಿಗಳನ್ನು ನಿಯಂತ್ರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ."
    },
    "maxcott": {
      cat: "ದ್ವಿಪಾತ್ರ ಕ್ರಿಯೆ",
      desc: "ಬಿಳಿನೊಣ, ಅಫಿಡ್ಸ್ ಮತ್ತು ಜಸ್ಸಿಡ್ಸ್ ಗಳನ್ನು ಕೊಲ್ಲುತ್ತದೆ ಮತ್ತು ಬೆಳೆ ಚೇತರಿಕೆಗೆ ಸಹಕರಿಸುತ್ತದೆ.",
      why: "ರಸ ಹೀರುವ ಕೀಟಗಳನ್ನು ಕೊಲ್ಲುತ್ತಲೇ ಎಲೆಗಳ ಹಸಿರು ತನವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ."
    },
    "flora": {
      cat: "ಇಳುವರಿ ಬೂಸ್ಟರ್",
      desc: "ಹೂವು ಮತ್ತು ಕಾಯಿ ಉದುರುವುದನ್ನು ತಡೆಯುತ್ತದೆ ಮತ್ತು ಪೋಷಕಾಂಶಗಳನ್ನು ಕಾಯಿಗಳಿಗೆ ತಲುಪಿಸುತ್ತದೆ.",
      why: "ಹೂವು ಮತ್ತು ಕಾಯಿಗಳ ನಿಲುಪುದೆಯನ್ನು ಹೆಚ್ಚಿಸಿ ನೇರವಾಗಿ ಇಳುವರಿ ಹೆಚ್ಚಿಸುತ್ತದೆ."
    },
    "builder": {
      cat: "ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳು",
      desc: "ಹೂಬಿಡುವ ಮೊದಲು ಸಸ್ಯದ ರಚನೆ ಬಲಪಡಿಸಲು ಮೆಗ್ನೀಸಿಯಮ್, ಜಿಂಕ್, ರಂಜಕ ಮತ್ತು ಬೋರಾನ್ ಒದಗಿಸುತ್ತದೆ.",
      why: "ಹೂಬಿಡುವ ಹಂತಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಪ್ರಮುಖ ಪೋಷಕಾಂಶಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ."
    },
    "probion": {
      cat: "ಬಯೋ ಸ್ಟಿಮ್ಯುಲೆಂಟ್",
      desc: "ಬರಗಾಲ, ಬಿಸಿಲು ಅಥವಾ ರಾಸಾಯನಿಕ ಒತ್ತಡದಿಂದ ಬೆಳೆಗಳು ಬೇಗನೆ ಚೇತರಿಸಿಕೊಳ್ಳಲು ಅಮಿನೊ ಆಮ್ಲಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
      why: "ವಿಪರೀತ ಹವಾಮಾನ ಬದಲಾವಣೆಗಳಿಂದ ಬೆಳೆಯನ್ನು ರಕ್ಷಿಸುತ್ತದೆ."
    },
    "k-mate": {
      cat: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
      desc: "ಬೇರು ವ್ಯವಸ್ಥೆ ಅಭಿವೃದ್ಧಿಪಡಿಸಲು ಮತ್ತು ಮಣ್ಣಿನಲ್ಲಿ ಕರಗದ ರಂಜಕವನ್ನು ಕರಗಿಸಲು ಸಹಕರಿಸುತ್ತದೆ.",
      why: "ಬೇರುಗಳು ಬಲವಾಗಿ ಬೆಳೆಯಲು ಮತ್ತು ಮಣ್ಣನ್ನು ಫಲವತ್ತಾಗಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ."
    },
    "lamigo": {
      cat: "ಕೀಟನಾಶಕ",
      desc: "ಕೀಟಗಳು ಮತ್ತು ಕಾಂಡ ಕೊರಕ ಹುಳುಗಳ ಮೇಲೆ ತಕ್ಷಣದ ರಕ್ಷಣೆ.",
      why: "ಸಿಂಪಡಿಸಿದ ಎರಡು ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆಗೆ ತೊಳೆದು ಹೋಗದಂತೆ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ."
    },
    "aimer": {
      cat: "ಕೀಟನಾಶಕ",
      desc: "ಕಾಂಡ ಕೊರಕ ಹುಳುಗಳು ಕಾಂಡದೊಳಗೆ ಹೋಗದಂತೆ ಮುಂಚಿತವಾಗಿ ತಡೆಯುತ್ತದೆ.",
      why: "ಬೆಳೆಯ ಬೆಳವಣಿಗೆಯ ಹಂತದಲ್ಲಿ ದೀರ್ಘಕಾಲದ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ."
    }
  },
  ml: {
    "expel-r": {
      cat: "ബയോ കീടനാശിനി",
      desc: "തണ്ടുകൾക്കും കായ്കൾക്കും ഉള്ളിലുള്ള പുഴുക്കളെയും കായ്തുരപ്പൻമാരെയും തടയുന്നു.",
      why: "തണ്ടുതുരപ്പൻ പുഴുക്കളെയും കായ്തുരപ്പൻമാരെയും ഫലപ്രദമായി പ്രതിരോധിക്കുന്നു."
    },
    "dodger": {
      cat: "കീടനാശിനി",
      desc: "സിസ്റ്റമിക് പ്രവർത്തനത്തിലൂടെ നീരൂറ്റിക്കുടിക്കുന്ന കീടങ്ങളെ തടയുന്നു, നെല്ലിനെ ഓലക്കരിച്ചിലിൽ നിന്ന് സംരക്ഷിക്കുന്നു.",
      why: "തവിട്ടു തുളളൻ കീടങ്ങൾ പടരുന്നത് തടയാൻ സഹായിക്കുന്നു."
    },
    "pixel-sensa": {
      cat: "കുമിൾനാശിനി",
      desc: "നെല്ലിലെ കുലവാട്ടം, ഇലപ്പുള്ളി രോഗം എന്നിവക്കെതിരെ പൂർണ്ണ സംരക്ഷണം നൽകുന്നു.",
      why: "കുമിൾ രോഗങ്ങൾ പടരുന്നത് തടയുകയും ധാന്യങ്ങളുടെ ഗുണമേന്മ വർദ്ധിപ്പിക്കുകയും ചെയ്യുന്നു."
    },
    "pixel-4d": {
      cat: "കീടനാശിനി",
      desc: "പരുത്തിയിലെ വെള്ളീച്ച, ഇലപ്പേൻ, ചിലന്തികൾ എന്നിവക്കെതിരെ ഒരൊറ്റ സ്പ്രേ.",
      why: "ഇലകൾക്കടിയിൽ ഒളിച്ചിരിക്കുന്ന നീരൂറ്റിക്കുടിക്കുന്ന കീടങ്ങളെ ആവി പ്രവർത്തനത്തിലൂടെ നശിപ്പിക്കുന്നു."
    },
    "extend": {
      cat: "ബയോ സംരക്ഷണം",
      desc: "രാസവസ്തുക്കൾ ഇല്ലാതെ നീരൂറ്റിക്കുടിക്കുന്ന കീടങ്ങളെ പ്രതിരോധിക്കുന്ന ഹെർബൽ ബയോ-സ്റ്റിമുലന്റ്.",
      why: "സ്വാഭാവിക രീതിയിൽ ഇലപ്പേൻ, ചിലന്തികൾ എന്നിവയെ തടയാൻ സഹായിക്കുന്നു."
    },
    "maxcott": {
      cat: "രണ്ട് പ്രവർത്തനങ്ങൾ",
      desc: "വെള്ളീച്ച, ഇലപ്പേൻ എന്നിവയെ നശിപ്പിക്കുകയും വിളയുടെ വേഗതയേറിയ വളർച്ചക്ക് സഹായിക്കുകയും ചെയ്യുന്നു.",
      why: "കീടങ്ങളെ നശിപ്പിക്കുന്നതിനൊപ്പം ഇലകളുടെ പച്ചപ്പ് വർദ്ധിപ്പിക്കുന്നു."
    },
    "flora": {
      cat: "വിളവ് ബൂസ്റ്റർ",
      desc: "പൂക്കളും കായ്കളും കൊഴിയുന്നത് തടയുകയും പോഷകങ്ങൾ കായ്കളിലേക്ക് എത്തിക്കുകയും ചെയ്യുന്നു.",
      why: "പൂ കൊഴിച്ചിൽ തടഞ്ഞ് വിളവ് നേരിട്ട് വർദ്ധിപ്പിക്കുന്നു."
    },
    "builder": {
      cat: "സൂക്ഷ്മ പോഷകങ്ങൾ",
      desc: "പൂക്കുന്നതിന് മുൻപ് ചെടിയുടെ ഘടന ശക്തമാക്കാൻ മഗ്നീഷ്യം, സിങ്ക്, ഫോസ്ഫറസ്, ബോറോൺ എന്നിവ നൽകുന്നു.",
      why: "പൂക്കുന്ന ഘട്ടത്തിൽ ആവശ്യമായ പ്രധാന പോഷകങ്ങൾ നൽകുന്നു."
    },
    "probion": {
      cat: "ബയോ സ്റ്റിമുലന്റ്",
      desc: "വരൾച്ച, ചൂട് അല്ലെങ്കിൽ രാസവസ്തുക്കളുടെ സമ്മർദ്ദം എന്നിവയിൽ നിന്ന് വിളകൾ സുഖം പ്രാപിക്കാൻ അമിനോ ആസിഡുകൾ നൽകുന്നു.",
      why: "പ്രതികൂല കാലാവസ്ഥയിൽ നിന്ന് വിളകളെ സംരക്ഷിക്കുന്നു."
    },
    "k-mate": {
      cat: "മണ്ണ് ആരോഗ്യം",
      desc: "വേരുകളുടെ വളർച്ച വർദ്ധിപ്പിക്കാനും മണ്ണിലെ ഫോസ്ഫറസ് ലയിപ്പിക്കാനും സഹായിക്കുന്നു.",
      why: "വേരുകൾ ശക്തമാക്കാനും മണ്ണിന്റെ ഗുണനിലവാരം മെച്ചപ്പെടുത്താനും സഹായിക്കുന്നു."
    },
    "lamigo": {
      cat: "കീടനാശിനി",
      desc: "കീടങ്ങൾക്കും തണ്ടുതുരപ്പൻമാർക്കുമെതിരെ ദ്രുതഗതിയിലുള്ള പ്രതിരോധം.",
      why: "സ്പ്രേ ചെയ്ത് രണ്ട് മണിക്കൂറിനുള്ളിൽ മഴ പെയ്താലും കഴുകിപ്പോകില്ല."
    },
    "aimer": {
      cat: "കീടനാശിനി",
      desc: "തണ്ടുതുരപ്പൻ പുഴുക്കൾ തണ്ടിനുള്ളിലേക്ക് കടക്കുന്നതിന് മുൻപ് തന്നെ തടയുന്നു.",
      why: "വിളയുടെ വളർച്ചാ ഘട്ടത്തിൽ ദീർഘകാല സംരക്ഷണം നൽകുന്നു."
    }
  }
};

export default function ProductRecommendations({ ids, onAddToCart, addedProductIds = [] }) {
  const recommendedProducts = getRecommendedProducts(ids);
  const { language, t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const renderProductIllustration = (id) => {
    switch (id) {
      case "expel-r":
        return (
          <svg className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="url(#expel-grad)" fillOpacity="0.1" stroke="rgba(239,68,68,0.2)" strokeWidth="1.5" />
            <path d="M50 22L30 31V53.5C30 67 38.5 75.5 50 78C61.5 75.5 70 67 70 53.5V31L50 22Z" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="10" stroke="#F97316" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M50 43V57M43 50H57" stroke="#FF6633" strokeWidth="2.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="expel-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EF4444" />
                <stop offset="1" stopColor="#F97316" />
              </linearGradient>
            </defs>
          </svg>
        );
      case "pixel-sensa":
        return (
          <svg className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="url(#sensa-grad)" fillOpacity="0.1" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" />
            <path d="M50 24C40 38 32 44 32 58C32 67.9411 40.0589 76 50 76C59.9411 76 68 67.9411 68 58C68 44 60 38 50 24Z" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2.5" />
            <path d="M50 36V70M50 48L38 42M50 56L62 52" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="50" cy="48" r="3" fill="#10B981" />
            <circle cx="38" cy="42" r="2.5" fill="#34D399" />
            <circle cx="62" cy="52" r="2.5" fill="#34D399" />
            <defs>
              <linearGradient id="sensa-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
          </svg>
        );
      case "dodger":
        return (
          <svg className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="url(#dodger-grad)" fillOpacity="0.1" stroke="rgba(59,130,246,0.2)" strokeWidth="1.5" />
            <path d="M43 25V30H57V25H43Z" fill="rgba(59,130,246,0.3)" stroke="#3B82F6" strokeWidth="2" />
            <path d="M46 30L34 68C31 77 39 80 50 80C61 80 69 77 66 68L54 30H46Z" fill="rgba(59, 130, 246, 0.15)" stroke="#3B82F6" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M37 60H63" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="46" cy="50" r="3" fill="#60A5FA" opacity="0.8" />
            <circle cx="54" cy="62" r="2" fill="#60A5FA" opacity="0.6" />
            <circle cx="48" cy="70" r="3.5" fill="#3B82F6" opacity="0.9" />
            <defs>
              <linearGradient id="dodger-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        );
      default:
        return (
          <svg className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="16" fill="url(#default-grad)" fillOpacity="0.1" stroke="rgba(168,85,247,0.2)" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="18" fill="rgba(168,85,247,0.2)" stroke="#A855F7" strokeWidth="2" />
            <path d="M50 40V60M40 50H60" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="default-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A855F7" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="h-[2px] w-8 bg-secondary"></span>
        <h3 className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
          {t("scanner.products_header")}
        </h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
      >
        {recommendedProducts.map((product) => {
          const isAdded = addedProductIds.includes(product.id);
          
          // Translate dynamic parameters if translation exists
          const localTrans = productLocalTranslations[language]?.[product.id];
          const category = localTrans?.cat || product.category;
          const description = localTrans?.desc || product.description;
          const whyRecommended = localTrans?.why || product.whyRecommended;
          
          return (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group flex flex-col justify-between overflow-hidden rounded-3xl border backdrop-blur-xl bg-white/5 shadow-xl transition-all duration-300 p-6 ${product.borderGlow}`}
            >
              {/* Card Header (Category & Illustration) */}
              <div>
                <div className="flex justify-between items-start mb-5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider border ${product.bgBadge}`}>
                    {category}
                  </span>
                  <span className="text-gray-400 text-xs font-label">
                    {t("scanner.dosage")}: <strong className="text-gray-200 font-normal">{product.dosage}</strong>
                  </span>
                </div>

                <div className="flex justify-center mb-6">
                  {renderProductIllustration(product.id)}
                </div>

                {/* Product Info */}
                <h4 className="font-headline text-lg font-bold text-white mb-2 group-hover:text-secondary transition-colors duration-200">
                  {product.name}
                </h4>
                <p className="font-body text-gray-400 text-xs leading-relaxed mb-4">
                  {description}
                </p>

                {/* Technical "Why Recommended" box */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 mb-6 flex gap-2.5 items-start">
                  <Info className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="font-body text-[11px] text-gray-300 leading-normal">
                    <span className="font-bold text-secondary">Why scan recommends:</span> {whyRecommended}
                  </p>
                </div>
              </div>

              {/* Price & Add To Cart Button */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-gray-500 font-label uppercase tracking-widest">Price</span>
                  <span className="text-xl font-headline font-bold text-white">₹{product.price}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className={`px-4 py-2.5 rounded-xl font-label font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                    isAdded
                      ? "bg-secondary/20 text-secondary border border-secondary/30"
                      : "bg-secondary hover:bg-secondary-light text-white shadow-md shadow-secondary-dark/15 hover:scale-[1.03]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {t("scanner.added_to_cart")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {t("scanner.add_to_cart")}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
