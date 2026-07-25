export function speakText(
text,
language
){

window
.speechSynthesis
.cancel();

const utterance =
new SpeechSynthesisUtterance(
text
);

const voices = {

te:"te-IN",

hi:"hi-IN",

en:"en-US",

kn:"kn-IN",

ml:"ml-IN"

};

utterance.lang =
voices[
language
];

utterance.rate =
0.9;

window
.speechSynthesis
.speak(
utterance
);

}