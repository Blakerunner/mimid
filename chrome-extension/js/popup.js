// variables
let apiURL = "https://x1zi1laze8.execute-api.us-west-2.amazonaws.com/v1/";

// listen to our translate button for on click
translateButton.addEventListener("click", async () => {
  // we need to specify what tab we're looking at
  console.log("function translateButton click");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
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

// handles post request to api gateway
function postAPI(text) {
  chrome.storage.sync.get("voice", (voice) => {
    // create data for POST payload
    // text contains our highlighted text, voice contains the speaker we would like from polly
    let data = { text: text, voice: voice.voice };
    console.log("data", data); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // make post request to our api
    fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("response:", data);
        // response comes back with a url of our polly translated text-to-mp3
        if (data.s3url) {
          console.log("Request complete! response:", data.s3url);
          updateSource(data.s3url);
        }
      });
  });
}

// update our audio player to refer to our new translated audio
function updateSource(s3url) {
  document.getElementById("audioPlayer").src = s3url;
}
