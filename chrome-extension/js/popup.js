// popup.js
let apiURL = "https://x1zi1laze8.execute-api.us-west-2.amazonaws.com/v1/";

// listen to our translate button for on click
translateButton.addEventListener("click", async () => {
  // we need to specify what tab we're looking at
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // execute out getHighlighted text within the tab we are currently using
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: getHighlightedText,
    },
    (text) => {
      // after we get out text back, post the text to the api endpoint
      postAPI(text[0].result);
    }
  );
});

// set our text to the current highlighted text
function getHighlightedText() {
  let selectedText = document.getSelection().toString();
  console.log(`Selected Text:\n`, selectedText);
  return selectedText;
}

// this wraps our raw text back with a prosody tag, this allows of ssml text for polly
// which allows us to change the speaking rate
function ssmlWrapper(text, speed) {
  return `<prosody rate="${speed}">${text}</prosody>`;
}

// handles post request to api gateway
function postAPI(text) {
  chrome.storage.sync.get("voice", (voiceData) => {
    chrome.storage.sync.get("speed", (speedData) => {
      let ssmlText = ssmlWrapper(text, speedData.speed);
      // create data for POST payload
      // text contains our highlighted text, voice contains the speaker we would like from polly
      let data = { text: ssmlText, voice: voiceData.voice };
      
      console.log("🚀 ~ file: popup.js ~ line 44 ~ chrome.storage.sync.get ~ data", data);

      // make post request to our api containing our data
      fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("🚀 ~ file: popup.js ~ line 53 ~ .then ~ data", data);
          // response comes back with a url of our polly translated text-to-mp3
          // set our audioUrl so we can reference it later
          chrome.storage.sync.set({ audioUrl: data.s3url }, () => {
            // force update our audio source to our new audio url
            updateAudioSource();
          });
        });
    });
  });
}

// update our audio player to refer to our new translated audio
function updateAudioSource() {
  chrome.storage.sync.get("audioUrl", (data) => {
    document.getElementById("audioPlayer").src = data.audioUrl;
  });
}

// everytime popup load we get the last audioSource loaded into player
updateAudioSource();
