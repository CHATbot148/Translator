const translateButton = document.getElementById("translateButton");
const speakButton = document.getElementById("speakButton");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const micButton = document.getElementById("micButton");

translateButton.addEventListener("click", () => {
    const text = inputText.value;
    const source = sourceLang.value;
    const target = targetLang.value;

    if (text.trim() === "") {
        outputText.value = "Please enter some text.";
        return;
    }

    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURI(text)}`)
        .then(response => response.json())
        .then(data => {
            outputText.value = data[0][0][0];
        })
        .catch(error => {
            outputText.value = "There's an Error translating. Check your Internet connection and try again.";
        });
});

speakButton.addEventListener("click", () => {
    const translatedText = outputText.value;
    if (!translatedText) {
        return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang.value;
    speechSynthesis.speak(utterance);
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = sourceLang.value;
recognition.continuous = false;

micButton.addEventListener("click", () => {
    recognition.start();
    micButton.classList.add("listening");
});

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value = transcript;
    micButton.classList.remove("listening");
};

recognition.onerror = (event) => {
    console.log('Speech recognition error: ' + event.error);
    micButton.classList.remove("listening");
};
