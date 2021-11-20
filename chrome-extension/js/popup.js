// variables
let apiURL = "";
let urlTrex =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";
let urlS3 =
  "https://mimid-polly-bucket.s3.us-west-2.amazonaws.com/file_example_MP3_700KB.mp3";
let text = "";

// listen to our translate button for on click
translateButton.addEventListener("click", async () => {

  // we need to specify what tab we're looking at
  console.log("function translateButton click");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // execute script to a specific tab, target has to be our current tab or we wont be able to specify what document we want our text from
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getHighlightedText,
  });
  
  // after we get out text back, post the text to the api endpoint
  //postAPI(text);
  updateSource(urlTrex);
});

// set our text to the current highlighted text
function getHighlightedText() {
  console.log("function getHighlightedText");
  text = document.getSelection().toString();
  console.log("selected:", text);
}

// handles post request to api gateway
function postAPI() {
  // get the voice we want to the audio to be translated into
  voice = chrome.storage.sync.get("voice");

  // create data for POST payload
  // text contains our highlighted text, voice contains the speaker we would like from polly
  let data = { text, voice };

  // make post request to our api
  fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    // response comes back with a url of our polly translated text-to-mp3
    console.log("Request complete! response:", res);
    updateSource(res.s3url);
  });
}

// update our audio player to refer to our new translated audio
function updateSource(s3url) {
  document.getElementById("audioPlayer").src = s3url;
}
