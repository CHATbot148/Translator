// Elements for speakers and microphones
const micButton1 = document.getElementById('micButton1');
const micButton2 = document.getElementById('micButton2');
const speaker1 = document.getElementById('speaker1');
const speaker2 = document.getElementById('speaker2');
const speaker1Lang = document.getElementById('speaker1Lang');
const speaker2Lang = document.getElementById('speaker2Lang');

// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.continuous = false;

// Initialize speaker highlighting
let isSpeaker1Turn = true;
highlightSpeaker();

// Function to highlight the active speaker
function highlightSpeaker() {
    if (isSpeaker1Turn) {
        speaker1.classList.add('glow');
        speaker2.classList.remove('glow');
    } else {
        speaker2.classList.add('glow');
        speaker1.classList.remove('glow');
    }
}

// Function to fetch translation using Google Translate API or any other translation API
async function translateSpeech(text, langFrom, langTo) {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${langFrom}|${langTo}`);
        const data = await response.json();
        const translatedText = data.responseData.translatedText;
        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return 'Error translating text.';
    }
}

// Handle speech recognition and translation for each speaker
function handleSpeechRecognition(langFrom, langTo, speakerId) {
    recognition.lang = langFrom;

    recognition.start();

    recognition.onresult = async function (event) {
        const transcript = event.results[0][0].transcript;
        console.log(`${speakerId} said: ${transcript}`);

        // Translate the recognized speech
        const translation = await translateSpeech(transcript, langFrom, langTo);
        console.log(`Translated (${langFrom} to ${langTo}): ${translation}`);

        // Speak out the translated speech
        speakOut(translation, langTo);

        // Switch turns after translation
        isSpeaker1Turn = !isSpeaker1Turn;
        highlightSpeaker();
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = function () {
        console.log('Speech recognition ended');
    };
}

// Function to speak the translated text
function speakOut(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

// Microphone button click events for both speakers
micButton1.addEventListener('click', () => {
    if (isSpeaker1Turn) {
        const langFrom = speaker1Lang.value;
        const langTo = speaker2Lang.value;
        handleSpeechRecognition(langFrom, langTo, 'Speaker 1');
    }
});

micButton2.addEventListener('click', () => {
    if (!isSpeaker1Turn) {
        const langFrom = speaker2Lang.value;
        const langTo = speaker1Lang.value;
        handleSpeechRecognition(langFrom, langTo, 'Speaker 2');
    }
});

// Button to return to normal translator
document.getElementById('backToTranslator').addEventListener('click', () => {
    window.location.href = 'index.html';
});
